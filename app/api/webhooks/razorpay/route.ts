import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { platformStore } from '../../../../lib/services/mock-data';
import { DispatchEngine } from '../../../../lib/services/dispatch-engine';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'test_webhook_secret';

    // Verify HMAC SHA256 Signature
    if (signature && secret !== 'test_webhook_secret') {
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        return NextResponse.json({ error: 'Invalid Razorpay signature' }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    // Handle payment.captured
    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload.payload?.payment?.entity;
      const orderNotes = paymentEntity?.notes;
      const platformOrderId = orderNotes?.order_id;

      if (platformOrderId) {
        const order = platformStore.orders.find(o => o.id === platformOrderId);
        if (order) {
          order.payment_status = 'paid';
          order.order_status = 'accepted';

          // Trigger dispatch engine
          DispatchEngine.findAndAssignPartner(order.id);
        }
      }
    }

    return NextResponse.json({ status: 'ok', message: 'Webhook processed' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

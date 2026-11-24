'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  CreditCard, 
  Banknote, 
  ShieldCheck, 
  CheckCircle2, 
  Trash2,
  Plus,
  Minus,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { usePlatform } from '../../lib/context/platform-context';
import { platformStore } from '../../lib/services/mock-data';
import { DispatchEngine } from '../../lib/services/dispatch-engine';
import { formatINR, generateOTP } from '../../lib/utils';
import { Order, OrderItem } from '../../lib/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, clearCart, cartSubtotal, cartItemCount, refreshData } = usePlatform();

  const [cookingInstructions, setCookingInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [selectedAddress, setSelectedAddress] = useState({
    name: 'Rajesh Sharma',
    phone: '+919819012345',
    address: 'Flat 802, Sea Pearl Towers, Carter Road, Bandra West, Mumbai 400050'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const branch = cart.branchId ? platformStore.branches.find(b => b.id === cart.branchId) : null;
  const org = branch ? platformStore.organizations.find(o => o.id === branch.organization_id) : null;

  if (cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Your Cart is Empty</h2>
        <p className="text-slate-500 text-sm mb-6">
          Explore delicious cuisines from platform-operated hotels and independent partners.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center gap-2 bg-rose-600 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Restaurants</span>
        </Link>
      </div>
    );
  }

  // Financial Calculations
  const taxAmount = Math.round(cartSubtotal * 0.05 * 100) / 100; // 5% GST
  const packagingFee = branch ? branch.packaging_fee_base : 25;
  const deliveryFee = 40.00;
  const discountAmount = cartSubtotal > 500 ? 50.00 : 0.00; // Festive discount
  const totalAmount = cartSubtotal + taxAmount + packagingFee + deliveryFee - discountAmount;

  const handlePlaceOrder = () => {
    if (!branch || !org) return;

    setIsSubmitting(true);

    const orderId = `ord-${Date.now()}`;
    const orderNumber = `ORD-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const deliveryOtp = generateOTP(4);
    const pickupOtp = generateOTP(4);

    const orderItems: OrderItem[] = cart.items.map((item, idx) => ({
      id: `oi-${orderId}-${idx}`,
      order_id: orderId,
      menu_item_id: item.menuItem.id,
      item_name_snapshot: item.menuItem.name,
      unit_price_snapshot: item.menuItem.base_price + (item.selectedVariant?.price_differential || 0),
      quantity: item.quantity,
      variant_snapshot: item.selectedVariant ? { name: item.selectedVariant.name } : undefined,
      addons_snapshot: item.selectedAddons ? item.selectedAddons.map(a => ({ name: a.name, price: a.price })) : undefined,
      subtotal: item.subtotal
    }));

    // Commission logic: 0 for platform owned, 15% for 3rd party
    const isPlatformOwned = org.ownership_type === 'platform_owned';
    const commission = isPlatformOwned ? 0 : Math.round(cartSubtotal * 0.15);

    const newOrder: Order = {
      id: orderId,
      order_number: orderNumber,
      customer_id: 'cust-1',
      organization_id: org.id,
      branch_id: branch.id,
      delivery_address_snapshot: selectedAddress,
      order_status: 'placed',
      payment_status: paymentMethod === 'razorpay' ? 'paid' : 'cod_pending',
      payment_method: paymentMethod,
      cooking_instructions: cookingInstructions,
      subtotal: cartSubtotal,
      tax_amount: taxAmount,
      packaging_fee: packagingFee,
      delivery_fee: deliveryFee,
      discount_amount: discountAmount,
      total_amount: totalAmount,
      platform_commission_amount: commission,
      delivery_otp: deliveryOtp,
      pickup_otp: pickupOtp,
      estimated_prep_mins: branch.average_preparation_time_mins,
      created_at: new Date().toISOString(),
      items: orderItems,
      branch,
      organization: org
    };

    // Store order in platform state
    platformStore.orders.unshift(newOrder);

    // Automatically trigger Central Dispatch assignment in background
    setTimeout(() => {
      DispatchEngine.findAndAssignPartner(newOrder.id);
      refreshData();
    }, 2000);

    clearCart();
    refreshData();
    router.push(`/orders/${newOrder.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
            Secure Order Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Delivery Address & Payment */}
          <div className="md:col-span-2 space-y-6">
            {/* Delivery Address Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-600" />
                  <span>Delivery Address</span>
                </h3>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Default (Home)
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-900">{selectedAddress.name} ({selectedAddress.phone})</div>
                <div className="text-slate-600">{selectedAddress.address}</div>
                <div className="text-slate-400">Timezone: Asia/Kolkata (IST)</div>
              </div>
            </div>

            {/* Cooking Instructions */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Cooking / Delivery Instructions
              </label>
              <textarea
                value={cookingInstructions}
                onChange={(e) => setCookingInstructions(e.target.value)}
                placeholder="e.g. Please make biryani medium spicy. Ring bell on arrival."
                rows={2}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-rose-500 transition"
              />
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-rose-600" />
                <span>Select Payment Mode</span>
              </h3>

              <div className="space-y-2.5">
                <label 
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`flex items-center justify-between p-4 rounded-xl border text-xs cursor-pointer transition ${
                    paymentMethod === 'razorpay'
                      ? 'border-rose-600 bg-rose-50/50 font-bold text-slate-900'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'razorpay'} 
                      onChange={() => setPaymentMethod('razorpay')} 
                      className="text-rose-600"
                    />
                    <div>
                      <div className="font-bold">Online Payment via Razorpay</div>
                      <div className="text-[11px] text-slate-400">UPI (Google Pay, PhonePe), Cards & Net Banking</div>
                    </div>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold">
                    Instant Instant Refund
                  </span>
                </label>

                <label 
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-center justify-between p-4 rounded-xl border text-xs cursor-pointer transition ${
                    paymentMethod === 'cod'
                      ? 'border-rose-600 bg-rose-50/50 font-bold text-slate-900'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'cod'} 
                      onChange={() => setPaymentMethod('cod')} 
                      className="text-rose-600"
                    />
                    <div>
                      <div className="font-bold">Cash on Delivery (COD)</div>
                      <div className="text-[11px] text-slate-400">Pay cash or scan QR when delivery partner arrives</div>
                    </div>
                  </div>
                  <Banknote className="w-4 h-4 text-slate-400" />
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Placement */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                  Selected Outlet
                </div>
                <div className="font-bold text-slate-900 text-sm">
                  {cart.restaurantName}
                </div>
                <div className="text-xs text-slate-500">
                  {branch?.city} • Managed by Central Fleet
                </div>
              </div>

              {/* Item breakdown */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {cart.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start text-xs border-b border-slate-50 pb-2">
                    <div className="flex-1 mr-2">
                      <div className="font-semibold text-slate-800">{item.menuItem.name}</div>
                      {item.selectedVariant && (
                        <div className="text-[10px] text-slate-400">{item.selectedVariant.name}</div>
                      )}
                      {item.selectedAddons && item.selectedAddons.length > 0 && (
                        <div className="text-[10px] text-rose-500">
                          +{item.selectedAddons.map(a => a.name).join(', ')}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <div className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        <button onClick={() => updateQuantity(idx, item.quantity - 1)}>-</button>
                        <span className="font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(idx, item.quantity + 1)}>+</button>
                      </div>
                      <span className="font-bold text-slate-900">{formatINR(item.subtotal)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price details */}
              <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Item Subtotal:</span>
                  <span className="font-mono font-semibold text-slate-900">{formatINR(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5%):</span>
                  <span className="font-mono">{formatINR(taxAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Restaurant Packaging Fee:</span>
                  <span className="font-mono">{formatINR(packagingFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Central Delivery Fee:</span>
                  <span className="font-mono">{formatINR(deliveryFee)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Special Welcome Discount:</span>
                    <span className="font-mono">-{formatINR(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Payable:</span>
                  <span className="font-mono text-rose-600">{formatINR(totalAmount)}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-extrabold py-3.5 rounded-xl text-sm shadow-md transition active:scale-95 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirm & Pay {formatINR(totalAmount)}</span>
                  </>
                )}
              </button>

              <div className="text-[10px] text-center text-slate-400">
                Safe & Encrypted 256-bit Payment • GST Invoice Generated
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

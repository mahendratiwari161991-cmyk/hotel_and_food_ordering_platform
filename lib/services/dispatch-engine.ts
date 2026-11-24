import { platformStore } from './mock-data';
import { calculateDistanceKm } from '../utils';
import { Order, DeliveryPartner, DeliveryAssignment } from '../types';

export class DispatchEngine {
  /**
   * Centralized Assignment Algorithm:
   * When any hotel (platform or 3rd-party) marks an order 'ready_for_pickup':
   * 1. Retrieve branch coordinates.
   * 2. Find all online and active delivery partners.
   * 3. Calculate distance from hotel pickup.
   * 4. Select the closest eligible partner.
   * 5. Dispatch assignment request.
   */
  static findAndAssignPartner(orderId: string): { success: boolean; assignment?: DeliveryAssignment; message: string } {
    const order = platformStore.orders.find(o => o.id === orderId);
    if (!order) {
      return { success: false, message: 'Order not found' };
    }

    const branch = platformStore.branches.find(b => b.id === order.branch_id);
    if (!branch) {
      return { success: false, message: 'Hotel branch not found' };
    }

    // Filter online partners
    const availablePartners = platformStore.deliveryPartners.filter(p => p.is_online && p.status === 'active');
    if (availablePartners.length === 0) {
      return { success: false, message: 'No delivery partners are currently online in this zone.' };
    }

    // Rank by proximity to hotel branch
    const ranked = availablePartners.map(partner => {
      const distance = calculateDistanceKm(
        branch.latitude,
        branch.longitude,
        partner.current_latitude || branch.latitude,
        partner.current_longitude || branch.longitude
      );
      return { partner, distance };
    }).sort((a, b) => a.distance - b.distance);

    const selected = ranked[0];
    const estimatedPayout = 35 + Math.round(selected.distance * 15);

    const assignment: DeliveryAssignment = {
      id: `da-${Date.now()}`,
      order_id: order.id,
      hotel_branch_id: branch.id,
      delivery_partner_id: selected.partner.id,
      status: 'accepted', // Auto-accepted in simulator or pending
      estimated_pickup_km: selected.distance,
      estimated_drop_km: 2.5,
      estimated_payout: estimatedPayout,
      assigned_at: new Date().toISOString(),
      accepted_at: new Date().toISOString(),
      partner: selected.partner
    };

    order.order_status = 'assigned';
    order.delivery_assignment = assignment;

    return {
      success: true,
      assignment,
      message: `Assigned partner ${selected.partner.full_name} (${selected.distance} km away).`
    };
  }

  /**
   * Admin manual reassignment override
   */
  static adminReassign(orderId: string, newPartnerId: string): { success: boolean; message: string } {
    const order = platformStore.orders.find(o => o.id === orderId);
    const partner = platformStore.deliveryPartners.find(p => p.id === newPartnerId);

    if (!order || !partner) {
      return { success: false, message: 'Invalid order or partner ID' };
    }

    if (order.delivery_assignment) {
      order.delivery_assignment.delivery_partner_id = partner.id;
      order.delivery_assignment.partner = partner;
      order.delivery_assignment.status = 'accepted';
    } else {
      order.delivery_assignment = {
        id: `da-${Date.now()}`,
        order_id: order.id,
        hotel_branch_id: order.branch_id,
        delivery_partner_id: partner.id,
        status: 'accepted',
        estimated_payout: 50,
        assigned_at: new Date().toISOString(),
        accepted_at: new Date().toISOString(),
        partner
      };
    }
    order.order_status = 'assigned';

    return { success: true, message: `Successfully reassigned order ${order.order_number} to ${partner.full_name}` };
  }

  /**
   * Delivery Partner pickup verification with hotel pickup OTP
   */
  static verifyPickup(orderId: string, enteredOtp: string): { success: boolean; message: string } {
    const order = platformStore.orders.find(o => o.id === orderId);
    if (!order) return { success: false, message: 'Order not found' };

    if (order.pickup_otp !== enteredOtp.trim()) {
      return { success: false, message: 'Invalid pickup OTP. Verify with the hotel kitchen.' };
    }

    order.order_status = 'picked_up';
    if (order.delivery_assignment) {
      order.delivery_assignment.status = 'picked_up';
      order.delivery_assignment.picked_up_at = new Date().toISOString();
    }

    return { success: true, message: 'Order pickup confirmed! You can now navigate to customer.' };
  }

  /**
   * Delivery Partner drop verification with customer OTP
   */
  static verifyDelivery(orderId: string, enteredOtp: string): { success: boolean; message: string } {
    const order = platformStore.orders.find(o => o.id === orderId);
    if (!order) return { success: false, message: 'Order not found' };

    if (order.delivery_otp !== enteredOtp.trim()) {
      return { success: false, message: 'Invalid delivery OTP. Please verify with customer.' };
    }

    order.order_status = 'delivered';
    order.payment_status = 'paid';
    if (order.delivery_assignment) {
      order.delivery_assignment.status = 'delivered';
      order.delivery_assignment.delivered_at = new Date().toISOString();
    }

    return { success: true, message: 'Delivery completed successfully!' };
  }
}

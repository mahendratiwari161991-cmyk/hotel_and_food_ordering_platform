import { platformStore } from './mock-data';
import { BookingEnquiry, BookingQuotation, VenueBooking, SlotType } from '../types';

export class VenueEngine {
  /**
   * Check if a venue is already booked for date and slot
   */
  static isSlotAvailable(venueId: string, date: string, slot: SlotType): boolean {
    const existingBooking = platformStore.venueBookings.find(
      b => b.venue_id === venueId && b.booking_date === date && b.slot_type === slot && b.status === 'confirmed'
    );
    return !existingBooking;
  }

  /**
   * Submit an initial customer enquiry
   */
  static submitEnquiry(data: {
    customerId: string;
    branchId: string;
    venueId: string;
    eventType: string;
    guestCount: number;
    targetDate: string;
    slotType: SlotType;
    foodPreference: string;
    specialRequirements?: string;
  }): { success: boolean; enquiry?: BookingEnquiry; message: string } {
    if (!this.isSlotAvailable(data.venueId, data.targetDate, data.slotType)) {
      return { success: false, message: 'This venue is already booked on the selected date and time slot.' };
    }

    const enquiryNumber = `ENQ-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`;
    const venue = platformStore.venues.find(v => v.id === data.venueId);

    const enquiry: BookingEnquiry = {
      id: `enq-${Date.now()}`,
      enquiry_number: enquiryNumber,
      customer_id: data.customerId,
      branch_id: data.branchId,
      venue_id: data.venueId,
      event_type: data.eventType,
      guest_count: data.guestCount,
      target_date: data.targetDate,
      slot_type: data.slotType,
      food_preference: data.foodPreference,
      special_requirements: data.specialRequirements,
      status: 'submitted',
      created_at: new Date().toISOString(),
      venue
    };

    platformStore.bookingEnquiries.unshift(enquiry);
    return { success: true, enquiry, message: `Booking enquiry ${enquiryNumber} submitted to hotel management!` };
  }

  /**
   * Hotel sends a formal quotation
   */
  static sendQuotation(data: {
    enquiryId: string;
    venueId: string;
    rentAmount: number;
    platePrice: number;
    guestCount: number;
    decorAmount: number;
    advancePercent: number;
    terms: string;
  }): { success: boolean; quotation?: BookingQuotation; message: string } {
    const enquiry = platformStore.bookingEnquiries.find(e => e.id === data.enquiryId);
    if (!enquiry) return { success: false, message: 'Enquiry not found' };

    const foodAmount = data.platePrice * data.guestCount;
    const subtotal = data.rentAmount + foodAmount + data.decorAmount;
    const taxes = (subtotal * 18) / 100; // 18% GST on venue and hospitality catering
    const totalAmount = subtotal + taxes;
    const advanceAmount = (totalAmount * data.advancePercent) / 100;

    const quotation: BookingQuotation = {
      id: `quote-${Date.now()}`,
      enquiry_id: enquiry.id,
      venue_id: data.venueId,
      rent_amount: data.rentAmount,
      food_package_amount: foodAmount,
      decoration_amount: data.decorAmount,
      taxes_amount: taxes,
      advance_percentage_required: data.advancePercent,
      advance_amount: advanceAmount,
      total_amount: totalAmount,
      terms_and_conditions: data.terms,
      valid_until: new Date(Date.now() + 7 * 86400000).toISOString(),
      status: 'sent'
    };

    enquiry.status = 'quoted';
    platformStore.bookingQuotations.unshift(quotation);

    return { success: true, quotation, message: 'Formal quotation sent to customer.' };
  }

  /**
   * Customer accepts quote and pays advance, locking the slot
   */
  static confirmBookingWithAdvance(quotationId: string, paymentMethod: string = 'razorpay'): { success: boolean; booking?: VenueBooking; message: string } {
    const quotation = platformStore.bookingQuotations.find(q => q.id === quotationId);
    if (!quotation) return { success: false, message: 'Quotation not found' };

    const enquiry = platformStore.bookingEnquiries.find(e => e.id === quotation.enquiry_id);
    if (!enquiry) return { success: false, message: 'Associated enquiry not found' };

    // Transactional double booking check
    if (!this.isSlotAvailable(enquiry.venue_id, enquiry.target_date, enquiry.slot_type)) {
      return { success: false, message: 'Unfortunately another customer completed booking for this slot moments ago.' };
    }

    const bookingNumber = `BK-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const booking: VenueBooking = {
      id: `bk-${Date.now()}`,
      booking_number: bookingNumber,
      quotation_id: quotation.id,
      customer_id: enquiry.customer_id,
      branch_id: enquiry.branch_id,
      venue_id: enquiry.venue_id,
      booking_date: enquiry.target_date,
      slot_type: enquiry.slot_type,
      guest_count: enquiry.guest_count,
      total_amount: quotation.total_amount,
      advance_paid: quotation.advance_amount,
      balance_due: quotation.total_amount - quotation.advance_amount,
      status: 'confirmed',
      venue: enquiry.venue
    };

    quotation.status = 'accepted';
    enquiry.status = 'accepted';
    platformStore.venueBookings.unshift(booking);

    return {
      success: true,
      booking,
      message: `Congratulations! Venue booking confirmed with Advance of ₹${quotation.advance_amount.toLocaleString('en-IN')}. Booking Number: ${bookingNumber}`
    };
  }
}

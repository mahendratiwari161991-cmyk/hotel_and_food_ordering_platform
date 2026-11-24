'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Users, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Check, 
  Clock, 
  FileText, 
  ShieldCheck,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { platformStore } from '../../lib/services/mock-data';
import { VenueEngine } from '../../lib/services/venue-engine';
import { formatINR } from '../../lib/utils';
import { Venue, SlotType, BookingQuotation } from '../../lib/types';

export default function VenuesDiscoveryPage() {
  const venues = platformStore.venues;
  const [selectedVenueForEnquiry, setSelectedVenueForEnquiry] = useState<Venue | null>(null);

  // Form State
  const [eventType, setEventType] = useState('Wedding Reception');
  const [guestCount, setGuestCount] = useState(200);
  const [targetDate, setTargetDate] = useState('2026-12-20');
  const [slotType, setSlotType] = useState<SlotType>('evening');
  const [foodPreference, setFoodPreference] = useState('both');
  const [specialReq, setSpecialReq] = useState('');

  // Generated Quote Preview
  const [activeQuotation, setActiveQuotation] = useState<BookingQuotation | null>(null);
  const [bookingConfirmedMsg, setBookingConfirmedMsg] = useState<string | null>(null);

  const handleOpenEnquiry = (venue: Venue) => {
    setSelectedVenueForEnquiry(venue);
    setActiveQuotation(null);
    setBookingConfirmedMsg(null);
  };

  const handleGenerateQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVenueForEnquiry) return;

    // 1. Submit enquiry
    const enqResult = VenueEngine.submitEnquiry({
      customerId: 'cust-1',
      branchId: selectedVenueForEnquiry.branch_id,
      venueId: selectedVenueForEnquiry.id,
      eventType,
      guestCount,
      targetDate,
      slotType,
      foodPreference,
      specialRequirements: specialReq
    });

    if (!enqResult.success || !enqResult.enquiry) {
      alert(enqResult.message);
      return;
    }

    // 2. Generate formal quotation
    const quoteResult = VenueEngine.sendQuotation({
      enquiryId: enqResult.enquiry.id,
      venueId: selectedVenueForEnquiry.id,
      rentAmount: selectedVenueForEnquiry.base_rent_per_slot,
      platePrice: foodPreference === 'veg' ? 850 : 1150,
      guestCount,
      decorAmount: 35000,
      advancePercent: 30,
      terms: '30% advance on confirmation to lock the slot. 18% GST applicable on luxury banqueting.'
    });

    if (quoteResult.success && quoteResult.quotation) {
      setActiveQuotation(quoteResult.quotation);
    }
  };

  const handleConfirmAndPayAdvance = () => {
    if (!activeQuotation) return;

    const result = VenueEngine.confirmBookingWithAdvance(activeQuotation.id, 'razorpay');
    if (result.success) {
      setBookingConfirmedMsg(result.message);
      setActiveQuotation(null);
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold mb-4 border border-purple-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Certified Hotel Banqueting & Oceanside Lawns</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
              Book Prestigious Venues for Weddings & Celebrations
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore grand ballrooms and lawns managed by platform hotels and luxury partners. Complete with verified catering packages, audio-visual acoustics, and instant milestone booking advance protection.
            </p>
          </div>
        </div>

        {/* Success Confirmation Banner */}
        {bookingConfirmedMsg && (
          <div className="bg-emerald-50 border border-emerald-300 p-6 rounded-2xl flex items-start gap-4 text-emerald-900 animate-in fade-in">
            <Check className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-black text-base text-emerald-950">Slot Locked & Confirmed!</h3>
              <p className="text-xs sm:text-sm mt-1">{bookingConfirmedMsg}</p>
              <div className="text-[11px] text-emerald-700 mt-2 font-semibold">
                An official banquet manager from the hotel branch has been assigned to coordinate your catering and setup.
              </div>
            </div>
          </div>
        )}

        {/* Venues Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {venues.map(venue => {
            const branch = platformStore.branches.find(b => b.id === venue.branch_id);
            const org = branch ? platformStore.organizations.find(o => o.id === branch.organization_id) : null;

            return (
              <div 
                key={venue.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  {/* Photo Carousel Preview */}
                  <div className="relative h-64 w-full bg-slate-900 overflow-hidden">
                    <img 
                      src={venue.photos[0]} 
                      alt={venue.name}
                      className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {venue.venue_type.replace('_', ' ')}
                    </div>
                    <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md text-slate-900 text-xs font-black px-3 py-1 rounded-lg shadow-sm">
                      Base Rent {formatINR(venue.base_rent_per_slot)} / slot
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <div className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
                        {org?.name} • {branch?.branch_name}
                      </div>
                      <h3 className="text-xl font-black text-slate-900">
                        {venue.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{branch?.address_line}, {branch?.city}</span>
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {venue.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Users className="w-4 h-4 text-purple-600" />
                        <span>Capacity: {venue.capacity_min} - {venue.capacity_max} Guests</span>
                      </div>
                      <span className="text-slate-300">•</span>
                      <div className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-4 h-4 text-purple-600" />
                        <span>Morning / Evening Slots</span>
                      </div>
                    </div>

                    {/* Amenities list */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Included Facilities
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {venue.amenities.map((amenity, i) => (
                          <span 
                            key={i} 
                            className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2.5 py-1 rounded-lg"
                          >
                            ✓ {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    Double-Booking Guard Active
                  </div>
                  <button
                    onClick={() => handleOpenEnquiry(venue)}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition active:scale-95 flex items-center gap-1.5"
                  >
                    <span>Request Quotation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Quotation & Booking Modal */}
      {selectedVenueForEnquiry && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                  Direct Hotel Banqueting
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                  {selectedVenueForEnquiry.name}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedVenueForEnquiry(null)}
                className="text-slate-400 hover:text-slate-800 p-1"
              >
                ✕
              </button>
            </div>

            {!activeQuotation ? (
              <form onSubmit={handleGenerateQuotation} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Event Occasion
                    </label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-rose-500 font-medium"
                    >
                      <option value="Wedding Reception">Wedding Reception</option>
                      <option value="Sangeet & Mehendi">Sangeet & Mehendi</option>
                      <option value="Birthday Party">Birthday Party</option>
                      <option value="Corporate Annual Gala">Corporate Annual Gala</option>
                      <option value="Engagement Ceremony">Engagement Ceremony</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Expected Guest Count
                    </label>
                    <input
                      type="number"
                      min={selectedVenueForEnquiry.capacity_min}
                      max={selectedVenueForEnquiry.capacity_max}
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-rose-500 font-medium font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Desired Event Date
                    </label>
                    <input
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-rose-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Time Slot
                    </label>
                    <select
                      value={slotType}
                      onChange={(e) => setSlotType(e.target.value as SlotType)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-rose-500 font-medium"
                    >
                      <option value="evening">Evening Slot (6:30 PM - 11:30 PM)</option>
                      <option value="morning">Morning Slot (10:00 AM - 3:30 PM)</option>
                      <option value="full_day">Full Day Hire (10:00 AM - 11:30 PM)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Catering & Food Preference
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`p-3 rounded-xl border text-xs cursor-pointer text-center font-medium ${foodPreference === 'veg' ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold' : 'border-slate-200 text-slate-600'}`}>
                      <input 
                        type="radio" 
                        name="food" 
                        checked={foodPreference === 'veg'} 
                        onChange={() => setFoodPreference('veg')}
                        className="sr-only" 
                      />
                      Pure Veg Menu (₹850/plate)
                    </label>
                    <label className={`p-3 rounded-xl border text-xs cursor-pointer text-center font-medium ${foodPreference === 'both' ? 'border-rose-600 bg-rose-50 text-rose-900 font-bold' : 'border-slate-200 text-slate-600'}`}>
                      <input 
                        type="radio" 
                        name="food" 
                        checked={foodPreference === 'both'} 
                        onChange={() => setFoodPreference('both')}
                        className="sr-only" 
                      />
                      Veg + Non-Veg Gala (₹1,150/plate)
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Special Demands (Stage, DJ, Alcohol Permit)
                  </label>
                  <textarea
                    rows={2}
                    value={specialReq}
                    onChange={(e) => setSpecialReq(e.target.value)}
                    placeholder="Mention custom stage floral decor, AV equipment, or dietary instructions..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-rose-500 font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-rose-600 text-white font-extrabold py-3.5 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Generate Itemized Quotation</span>
                </button>
              </form>
            ) : (
              /* Formal Quotation Preview */
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200 text-xs space-y-2">
                  <div className="flex justify-between items-center font-bold text-purple-950">
                    <span>Quotation Breakdown ({guestCount} Guests)</span>
                    <span className="font-mono">Date: {targetDate} ({slotType})</span>
                  </div>

                  <div className="space-y-1 text-slate-600 pt-2 border-t border-purple-200/60">
                    <div className="flex justify-between">
                      <span>Venue Base Rental:</span>
                      <span className="font-mono font-medium">{formatINR(activeQuotation.rent_amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Buffet Catering ({guestCount} × ₹{foodPreference === 'veg' ? 850 : 1150}):</span>
                      <span className="font-mono font-medium">{formatINR(activeQuotation.food_package_amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Stage & Theme Floral Decor:</span>
                      <span className="font-mono font-medium">{formatINR(activeQuotation.decoration_amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST (18% Banqueting Tax):</span>
                      <span className="font-mono font-medium">{formatINR(activeQuotation.taxes_amount)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-purple-200 text-sm">
                      <span>Total Package Value:</span>
                      <span className="font-mono text-purple-900">{formatINR(activeQuotation.total_amount)}</span>
                    </div>
                  </div>
                </div>

                {/* Milestone advance callout */}
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Advance Payment Required to Lock Date:</span>
                  </div>
                  <div className="text-xl font-black font-mono text-amber-900">
                    {formatINR(activeQuotation.advance_amount)} <span className="text-xs font-normal text-amber-700">({activeQuotation.advance_percentage_required}% of Total)</span>
                  </div>
                  <div className="text-[11px] text-amber-700">
                    Remaining balance of {formatINR(activeQuotation.total_amount - activeQuotation.advance_amount)} payable 48 hours prior to event commencement.
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveQuotation(null)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs transition"
                  >
                    Modify Requirements
                  </button>
                  <button
                    onClick={handleConfirmAndPayAdvance}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-3 rounded-xl text-xs shadow-md transition"
                  >
                    Pay Advance & Confirm
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

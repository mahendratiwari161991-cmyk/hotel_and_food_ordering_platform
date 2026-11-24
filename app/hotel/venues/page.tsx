'use client';

import React from 'react';
import { 
  CalendarDays, 
  Users, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { usePlatform } from '../../../lib/context/platform-context';
import { platformStore } from '../../../lib/services/mock-data';
import { formatINR } from '../../../lib/utils';

export default function HotelVenuesPage() {
  const { activeBranchId } = usePlatform();
  const branch = platformStore.branches.find(b => b.id === activeBranchId) || platformStore.branches[0];

  const venues = platformStore.venues.filter(v => v.branch_id === branch.id);
  const enquiries = platformStore.bookingEnquiries.filter(e => e.branch_id === branch.id);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-purple-600" />
          <span>Branch Banqueting & Event Venues</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage ballroom capacities, event enquiries, and quotations for <strong className="text-slate-800">{branch.branch_name}</strong>
        </p>
      </div>

      {/* Venues Managed */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
          Venues Under Management ({venues.length})
        </h3>

        {venues.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
            No active banquet halls or lawns registered under this specific branch.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {venues.map(v => (
              <div key={v.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">
                      {v.venue_type.replace('_', ' ')}
                    </span>
                    <h4 className="font-bold text-slate-900 text-base mt-0.5">
                      {v.name}
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-900 bg-purple-50 px-3 py-1 rounded-lg">
                    {formatINR(v.base_rent_per_slot)} / slot
                  </span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {v.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                  <div className="flex items-center gap-1 font-bold">
                    <Users className="w-3.5 h-3.5 text-purple-600" />
                    <span>{v.capacity_min} - {v.capacity_max} Guests</span>
                  </div>
                  <span>•</span>
                  <span>Double Booking Guard Active</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Customer Event Enquiries */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
          Customer Event Enquiries & Formal Quotations
        </h3>

        {enquiries.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
            No customer banquet enquiries submitted yet for this branch.
          </div>
        ) : (
          <div className="space-y-3">
            {enquiries.map(enq => (
              <div 
                key={enq.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-xs">{enq.enquiry_number}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 uppercase">
                      {enq.status}
                    </span>
                  </div>
                  <div className="font-bold text-slate-800 text-sm mt-1">
                    {enq.event_type} • {enq.guest_count} Guests
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Target Date: <strong className="text-slate-800">{enq.target_date}</strong> ({enq.slot_type} slot) • Food: {enq.food_preference}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert(`Official Banquet Contract & Menu Tasting Sheet generated for ${enq.enquiry_number}`)}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-xs"
                  >
                    View Banquet Contract
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

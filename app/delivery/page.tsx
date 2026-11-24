'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Bike, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  Clock, 
  Phone, 
  ShieldCheck, 
  Power, 
  DollarSign, 
  Award, 
  Star,
  Sparkles,
  Check,
  AlertCircle
} from 'lucide-react';
import { platformStore } from '../../lib/services/mock-data';
import { DispatchEngine } from '../../lib/services/dispatch-engine';
import { usePlatform } from '../../lib/context/platform-context';
import { formatINR, formatIST } from '../../lib/utils';
import { DeliveryPartner, Order } from '../../lib/types';

export default function DeliveryPartnerAppPage() {
  const { refreshData } = usePlatform();
  const [partner, setPartner] = useState<DeliveryPartner>(platformStore.deliveryPartners[0]);
  const [isOnline, setIsOnline] = useState<boolean>(partner.is_online ?? true);
  const [activeTab, setActiveTab] = useState<'active' | 'requests' | 'earnings'>('active');

  const [enteredPickupOtp, setEnteredPickupOtp] = useState('');
  const [enteredDeliveryOtp, setEnteredDeliveryOtp] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Active delivery assignment for this partner
  const activeOrder = platformStore.orders.find(
    o => o.delivery_assignment?.delivery_partner_id === partner.id && o.order_status !== 'delivered' && o.order_status !== 'cancelled'
  );

  const toggleOnline = () => {
    const next = !isOnline;
    setIsOnline(next);
    partner.is_online = next;
    partner.status = next ? 'active' : 'offline';
    setNotification(`You are now ${next ? 'ONLINE and receiving orders across Mumbai!' : 'OFFLINE.'}`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleVerifyPickup = () => {
    if (!activeOrder) return;
    const result = DispatchEngine.verifyPickup(activeOrder.id, enteredPickupOtp);
    if (result.success) {
      setNotification(result.message);
      setEnteredPickupOtp('');
      refreshData();
    } else {
      alert(result.message);
    }
  };

  const handleVerifyDelivery = () => {
    if (!activeOrder) return;
    const result = DispatchEngine.verifyDelivery(activeOrder.id, enteredDeliveryOtp);
    if (result.success) {
      setNotification(result.message);
      setEnteredDeliveryOtp('');
      partner.total_completed_trips += 1;
      refreshData();
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-20">
      {/* Toast */}
      {notification && (
        <div className="fixed top-16 right-4 left-4 sm:left-auto sm:right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 font-bold text-xs animate-bounce">
          <Check className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Mobile-First Header */}
      <div className="bg-slate-950 border-b border-slate-800 p-4 sticky top-0 z-30">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center font-bold text-lg text-white">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-black flex items-center gap-1.5">
                <span>{partner.full_name}</span>
                <span className="text-[10px] text-amber-400 font-bold bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-800/40">
                  ★ {partner.rating}
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                {partner.vehicle_number} • Central Fleet
              </div>
            </div>
          </div>

          {/* Online / Offline Toggle Button */}
          <button
            onClick={toggleOnline}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black transition ${
              isOnline 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' 
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{isOnline ? 'ONLINE' : 'GO ONLINE'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold text-center">
          <button
            onClick={() => setActiveTab('active')}
            className={`py-2 rounded-xl transition ${activeTab === 'active' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Active Trip
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`py-2 rounded-xl transition ${activeTab === 'requests' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Radar
          </button>
          <button
            onClick={() => setActiveTab('earnings')}
            className={`py-2 rounded-xl transition ${activeTab === 'earnings' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Earnings
          </button>
        </div>

        {/* TAB 1: ACTIVE TRIP WORKFLOW */}
        {activeTab === 'active' && (
          <div className="space-y-4">
            {!isOnline ? (
              <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 text-center space-y-3">
                <Power className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="font-bold text-slate-200 text-base">You are Currently Offline</h3>
                <p className="text-xs text-slate-400">
                  Switch to Online to begin receiving delivery requests across Bandra, Juhu, and Powai.
                </p>
                <button
                  onClick={toggleOnline}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs"
                >
                  Go Online Now
                </button>
              </div>
            ) : !activeOrder ? (
              <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-orange-950/60 border border-orange-800/40 text-orange-400 flex items-center justify-center mx-auto animate-pulse">
                  <Navigation className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-200 text-base">Searching for Orders...</h3>
                <p className="text-xs text-slate-400">
                  You are positioned in Mumbai Grid Zone 1. Orders from platform hotels and partner restaurants will pop up here.
                </p>
              </div>
            ) : (
              /* Live Active Trip Screen */
              <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-5">
                {/* Trip Payout Badge */}
                <div className="flex items-center justify-between bg-slate-900 p-3 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400 font-semibold">Estimated Trip Payout:</span>
                  <span className="text-xl font-black font-mono text-emerald-400">
                    {formatINR(activeOrder.delivery_assignment?.estimated_payout || 65)}
                  </span>
                </div>

                {/* Step Indicator */}
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">
                    Current Trip Step
                  </div>
                  <div className="text-lg font-black text-white">
                    {activeOrder.order_status === 'assigned' && '1. Drive to Hotel Branch'}
                    {activeOrder.order_status === 'picked_up' && '2. En Route to Customer'}
                    {activeOrder.order_status === 'on_the_way' && '2. En Route to Customer'}
                  </div>
                </div>

                {/* Pickup Hotel Details */}
                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-wider text-[10px]">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Pickup Location</span>
                  </div>
                  <div className="font-bold text-white text-sm">
                    {activeOrder.branch?.branch_name}
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    {activeOrder.branch?.address_line}
                  </div>
                </div>

                {/* Drop Customer Details */}
                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Customer Delivery Address</span>
                  </div>
                  <div className="font-bold text-white text-sm">
                    {activeOrder.delivery_address_snapshot.name}
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    {activeOrder.delivery_address_snapshot.address}
                  </div>
                  <div className="pt-2 flex gap-2">
                    <a
                      href={`tel:${activeOrder.delivery_address_snapshot.phone}`}
                      className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 border border-slate-700"
                    >
                      <Phone className="w-3 h-3 text-emerald-400" />
                      <span>Call Customer</span>
                    </a>
                  </div>
                </div>

                {/* Action 1: Pickup OTP Verification */}
                {activeOrder.order_status === 'assigned' && (
                  <div className="bg-orange-950/40 border border-orange-800/60 p-4 rounded-2xl space-y-3">
                    <div className="text-xs text-orange-200 font-semibold">
                      Ask the hotel kitchen staff for the 4-digit <strong>Pickup OTP</strong>:
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={4}
                        value={enteredPickupOtp}
                        onChange={(e) => setEnteredPickupOtp(e.target.value)}
                        placeholder="Enter 4-digit OTP"
                        className="flex-1 bg-slate-900 border border-slate-700 text-white font-mono font-bold text-center text-lg p-2.5 rounded-xl outline-none focus:border-orange-500"
                      />
                      <button
                        onClick={handleVerifyPickup}
                        className="bg-orange-600 hover:bg-orange-700 text-white font-black px-5 py-2.5 rounded-xl text-xs transition"
                      >
                        Verify Pickup
                      </button>
                    </div>
                  </div>
                )}

                {/* Action 2: Customer Delivery OTP Verification */}
                {(activeOrder.order_status === 'picked_up' || activeOrder.order_status === 'on_the_way') && (
                  <div className="bg-emerald-950/40 border border-emerald-800/60 p-4 rounded-2xl space-y-3">
                    <div className="text-xs text-emerald-200 font-semibold">
                      Ask the customer for their 4-digit <strong>Delivery OTP</strong>:
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={4}
                        value={enteredDeliveryOtp}
                        onChange={(e) => setEnteredDeliveryOtp(e.target.value)}
                        placeholder="Customer OTP"
                        className="flex-1 bg-slate-900 border border-slate-700 text-white font-mono font-bold text-center text-lg p-2.5 rounded-xl outline-none focus:border-emerald-500"
                      />
                      <button
                        onClick={handleVerifyDelivery}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-5 py-2.5 rounded-xl text-xs transition"
                      >
                        Complete Order
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: FLEET RADAR & MAP */}
        {activeTab === 'requests' && (
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-orange-500" />
              <span>Central Fleet GPS Radar (Mumbai Grid)</span>
            </h3>

            <div className="h-48 rounded-2xl bg-slate-900 border border-slate-800 relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <div className="text-center space-y-1 relative z-10">
                <div className="w-8 h-8 rounded-full bg-orange-600/30 border-2 border-orange-500 animate-ping mx-auto"></div>
                <div className="text-xs font-bold text-slate-300">Live GPS Connected</div>
                <div className="text-[10px] text-slate-500 font-mono">19.0560° N, 72.8290° E (Bandra West)</div>
              </div>
            </div>

            <div className="text-xs text-slate-400 space-y-1">
              <div>• Auto-dispatch triggers when any hotel marks food ready.</div>
              <div>• Distance calculated via Haversine real-time radius.</div>
            </div>
          </div>
        )}

        {/* TAB 3: EARNINGS & INCENTIVES */}
        {activeTab === 'earnings' && (
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-5">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Today&apos;s Fleet Payout
              </div>
              <div className="text-3xl font-black font-mono text-emerald-400 mt-1">
                {formatINR(1240.00)}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                8 orders completed today • 100% on-time delivery
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-3 rounded-xl bg-slate-900">
                <span className="text-slate-400">Base Pay (₹35 / order):</span>
                <span className="font-mono font-bold text-white">₹280.00</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-slate-900">
                <span className="text-slate-400">Distance Travelled Pay (₹15 / km):</span>
                <span className="font-mono font-bold text-white">₹720.00</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-slate-900 text-amber-400 font-bold">
                <span>Peak Hour Target Incentive:</span>
                <span className="font-mono">₹240.00</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

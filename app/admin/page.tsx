'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Building2, 
  Bike, 
  ShoppingBag, 
  Percent, 
  DollarSign, 
  Users, 
  Check, 
  X, 
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { platformStore } from '../../lib/services/mock-data';
import { DispatchEngine } from '../../lib/services/dispatch-engine';
import { usePlatform } from '../../lib/context/platform-context';
import { formatINR, formatIST } from '../../lib/utils';
import { Organization, CommissionPlan, Order } from '../../lib/types';

export default function PlatformAdminDashboardPage() {
  const { refreshData } = usePlatform();
  const [activeTab, setActiveTab] = useState<'overview' | 'hotels' | 'fleet' | 'commissions' | 'orders'>('overview');
  const [notification, setNotification] = useState<string | null>(null);

  const organizations = platformStore.organizations;
  const branches = platformStore.branches;
  const orders = platformStore.orders;
  const deliveryPartners = platformStore.deliveryPartners;
  const commissionPlans = platformStore.commissionPlans;

  // Manual Reassignment Modal State
  const [selectedOrderForReassign, setSelectedOrderForReassign] = useState<Order | null>(null);
  const [targetPartnerId, setTargetPartnerId] = useState<string>(deliveryPartners[0]?.id || 'dp-1');

  const handleAdminReassign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForReassign) return;

    const result = DispatchEngine.adminReassign(selectedOrderForReassign.id, targetPartnerId);
    if (result.success) {
      setNotification(result.message);
      refreshData();
      setSelectedOrderForReassign(null);
      setTimeout(() => setNotification(null), 4000);
    } else {
      alert(result.message);
    }
  };

  const handleToggleHotelApproval = (org: Organization) => {
    org.organization_status = org.organization_status === 'active' ? 'suspended' : 'active';
    refreshData();
    setNotification(`${org.name} status updated to ${org.organization_status}`);
    setTimeout(() => setNotification(null), 3000);
  };

  const totalMarketplaceGross = orders.reduce((acc, o) => acc + o.total_amount, 0);
  const totalPlatformCommissions = orders.reduce((acc, o) => acc + o.platform_commission_amount, 0);

  return (
    <div className="min-h-screen bg-slate-100/80 py-8">
      {/* Toast */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold">{notification}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
              <span className="text-xs font-extrabold uppercase tracking-wider text-purple-700">Platform Super Admin</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Central Platform Administration
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Governance for platform-owned chains, third-party hotel partners, and centralized delivery fleet.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-purple-50 text-purple-900 border border-purple-200 px-4 py-2 rounded-2xl text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>Master Governance Console Active</span>
          </div>
        </div>

        {/* Global KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Hotels & Chains</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{organizations.length} Organizations</div>
            <div className="text-[11px] text-slate-500 mt-1">{branches.length} Physical Branches Active</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Marketplace Gross GMV</div>
            <div className="text-2xl font-black text-slate-900 mt-1 font-mono">{formatINR(totalMarketplaceGross)}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">Both Platform & 3rd-Party Sales</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Platform Commissions Earned</div>
            <div className="text-2xl font-black text-purple-600 mt-1 font-mono">{formatINR(totalPlatformCommissions)}</div>
            <div className="text-[11px] text-slate-400 mt-1">15% Commission on 3rd-Party Outlets</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Central Delivery Fleet</div>
            <div className="text-2xl font-black text-orange-600 mt-1">{deliveryPartners.length} Couriers</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">100% Online in Mumbai</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'overview' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('hotels')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'hotels' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Hotel Approvals & Types ({organizations.length})
          </button>
          <button
            onClick={() => setActiveTab('fleet')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'fleet' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Central Fleet & Manual Dispatch
          </button>
          <button
            onClick={() => setActiveTab('commissions')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'commissions' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Commission Plans
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'orders' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Live Platform Orders ({orders.length})
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-base">
                Hybrid Business Model Overview
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The platform seamlessly merges <strong>platform-owned hospitality chains</strong> (which operate at 0% marketplace commission with consolidated parent organization financials) with <strong>third-party independent hotel partners</strong> (subject to configured commission plans).
              </p>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950">
                  <strong>Type 1: Platform-Owned (Royal Heritage Group)</strong> — Multi-branch chain, central menu with branch overrides, direct supplier procurement, zero platform commission.
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                  <strong>Type 2: Third-Party Partners (Spice Symphony, Grand Deccan)</strong> — Independent owners, independent pricing, direct private suppliers, 15% marketplace commission.
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-base">
                Centralized Fleet Dispatch Rule
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                All food deliveries across both hotel types are fulfilled by the central platform fleet. Individual hotels do not assign private delivery boys, guaranteeing uniform SLA, verified OTP handoffs, and customer tracking.
              </p>
              <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-orange-950 text-xs font-semibold">
                Haversine Distance Engine calculates nearest courier within 5km of hotel branch pickup and dispatches automatically upon kitchen readiness.
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HOTEL APPROVALS & OWNERSHIP TYPES */}
        {activeTab === 'hotels' && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Hotel Organizations & Verification</h3>
                <p className="text-xs text-slate-500">Configure ownership models, commissions, and access status</p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {organizations.map(org => {
                const isPlatformOwned = org.ownership_type === 'platform_owned';
                const orgBranches = branches.filter(b => b.organization_id === org.id);

                return (
                  <div key={org.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{org.name}</span>
                        {isPlatformOwned ? (
                          <span className="text-[10px] font-extrabold bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full">
                            Platform-Owned
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                            Third-Party Partner
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-500 mt-1">
                        Legal Entity: {org.legal_business_name} • GSTIN: <strong className="font-mono text-slate-700">{org.gstin}</strong>
                      </div>

                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {orgBranches.length} Branches: {orgBranches.map(b => b.branch_name).join(', ')}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right text-xs">
                        <div className="font-bold text-slate-800">
                          {isPlatformOwned ? '0% Commission' : '15% Marketplace'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Status: <strong className={org.organization_status === 'active' ? 'text-emerald-600' : 'text-rose-600'}>{org.organization_status}</strong>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleHotelApproval(org)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition ${
                          org.organization_status === 'active'
                            ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        {org.organization_status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: CENTRAL FLEET & MANUAL DISPATCH */}
        {activeTab === 'fleet' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Central Delivery Partner Fleet</h3>
                  <p className="text-xs text-slate-500">Universal courier pool serving all hotel outlets</p>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  {deliveryPartners.filter(p => p.is_online).length} Couriers Online
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {deliveryPartners.map(dp => (
                  <div key={dp.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-slate-900">{dp.full_name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{dp.vehicle_number} ({dp.vehicle_type})</div>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                        ★ {dp.rating}
                      </span>
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
                      <span>Completed: {dp.total_completed_trips} trips</span>
                      <span className="font-bold text-emerald-600">Online & Active</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Manual Order Reassignment Section */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-purple-600" />
                  <span>Admin Manual Reassignment Override</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Override automatic dispatch algorithm for delayed or bottlenecked orders.
                </p>
              </div>

              <div className="space-y-3">
                {orders.filter(o => o.order_status !== 'delivered' && o.order_status !== 'cancelled').map(order => (
                  <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-purple-50/40 border border-purple-200/60 text-xs gap-3">
                    <div>
                      <span className="font-mono font-bold text-slate-900">{order.order_number}</span>
                      <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold ml-2">
                        {order.order_status}
                      </span>
                      <div className="text-slate-500 mt-0.5">
                        From: {order.branch?.branch_name} • Current Courier: {order.delivery_assignment?.partner?.full_name || 'Unassigned'}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedOrderForReassign(order)}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-xs self-start sm:self-auto"
                    >
                      Reassign Courier
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: COMMISSION PLANS */}
        {activeTab === 'commissions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {commissionPlans.map(cp => (
              <div key={cp.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{cp.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{cp.description}</p>
                  </div>
                  <span className="font-mono font-black text-xl text-purple-600">
                    {cp.food_commission_percent}%
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Food Order Commission:</span>
                    <span className="font-mono font-bold text-slate-900">{cp.food_commission_percent}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Venue Hire Commission:</span>
                    <span className="font-mono font-bold text-slate-900">{cp.venue_commission_percent}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Fixed Platform Fee per Order:</span>
                    <span className="font-mono font-bold text-slate-900">{formatINR(cp.fixed_fee_per_order)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: LIVE PLATFORM ORDERS */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="divide-y divide-slate-100">
              {orders.map(order => (
                <div key={order.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 text-sm">{order.order_number}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-slate-100 text-slate-800">
                        {order.order_status}
                      </span>
                    </div>
                    <div className="text-slate-500 mt-1">
                      Outlet: <strong className="text-slate-800">{order.branch?.branch_name}</strong> • Customer: {order.delivery_address_snapshot.name}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Delivery OTP: <span className="font-mono text-slate-700">{order.delivery_otp}</span> • Pickup OTP: <span className="font-mono text-slate-700">{order.pickup_otp}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-extrabold text-sm text-slate-900">{formatINR(order.total_amount)}</div>
                    <div className="text-[11px] text-purple-600 font-semibold">
                      Comm: {formatINR(order.platform_commission_amount)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Manual Reassign Modal */}
      {selectedOrderForReassign && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                Manually Reassign: {selectedOrderForReassign.order_number}
              </h3>
              <button onClick={() => setSelectedOrderForReassign(null)}>✕</button>
            </div>

            <form onSubmit={handleAdminReassign} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Select Target Delivery Courier:
                </label>
                <select
                  value={targetPartnerId}
                  onChange={(e) => setTargetPartnerId(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 font-medium"
                >
                  {deliveryPartners.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.full_name} ({p.vehicle_type} - {p.vehicle_number})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForReassign(null)}
                  className="flex-1 bg-slate-100 py-2.5 rounded-xl font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 py-2.5 rounded-xl font-bold text-white shadow-xs"
                >
                  Confirm Reassignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  TrendingUp, 
  Clock, 
  Boxes, 
  CalendarDays, 
  ArrowRight, 
  CheckCircle2, 
  Bike,
  AlertCircle
} from 'lucide-react';
import { usePlatform } from '../../../lib/context/platform-context';
import { platformStore } from '../../../lib/services/mock-data';
import { formatINR, formatIST } from '../../../lib/utils';

export default function HotelDashboardPage() {
  const { activeBranchId } = usePlatform();

  const branch = platformStore.branches.find(b => b.id === activeBranchId) || platformStore.branches[0];
  const org = platformStore.organizations.find(o => o.id === branch.organization_id);

  // Filter orders for this branch
  const branchOrders = platformStore.orders.filter(o => o.branch_id === branch.id);
  const activeOrdersCount = branchOrders.filter(o => o.order_status !== 'delivered' && o.order_status !== 'cancelled').length;
  const totalRevenue = branchOrders.reduce((acc, o) => acc + o.total_amount, 0);

  // Procurement for this branch
  const branchPOs = platformStore.purchaseOrders.filter(p => p.branch_id === branch.id || p.organization_id === org?.id);
  const pendingSuppliesCount = branchPOs.filter(p => p.status === 'sent_to_supplier' || p.status === 'acknowledged' || p.status === 'partially_received').length;

  // Venue enquiries
  const branchEnquiries = platformStore.bookingEnquiries.filter(e => e.branch_id === branch.id);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Branch Operations Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Realtime operations for <strong className="text-slate-800">{branch.branch_name}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/hotel/orders"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-1.5"
          >
            <span>Live Kitchen Display</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/hotel/procurement"
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-1.5"
          >
            <span>Direct POs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Active Kitchen Orders
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {activeOrdersCount}
            </div>
            <div className="text-[11px] text-blue-600 font-semibold mt-1">
              Ready for prep & dispatch
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Gross Sales (Today)
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
              {formatINR(totalRevenue)}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>Includes 5% GST</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Direct Supply Orders
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {pendingSuppliesCount}
            </div>
            <div className="text-[11px] text-amber-600 font-semibold mt-1">
              Awaiting supplier dispatch
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Boxes className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Venue Enquiries
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {branchEnquiries.length}
            </div>
            <div className="text-[11px] text-purple-600 font-semibold mt-1">
              Quotations & Sangeet banquets
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <CalendarDays className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Kitchen Orders Feed & Supply Shipments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 spans): Recent Orders */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Incoming Customer Food Orders
              </h3>
              <p className="text-xs text-slate-500">
                Centralized platform fleet will pick up once food is ready.
              </p>
            </div>
            <Link
              href="/hotel/orders"
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Open Full KDS Screen →
            </Link>
          </div>

          <div className="space-y-3">
            {branchOrders.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                No orders active for this branch currently.
              </div>
            ) : (
              branchOrders.map(order => (
                <div 
                  key={order.id}
                  className="p-4 rounded-2xl border border-slate-100 hover:border-slate-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 text-xs">
                        {order.order_number}
                      </span>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        {order.order_status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {formatIST(order.created_at)}
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 font-medium mt-1">
                      {order.items?.map(i => `${i.quantity}x ${i.item_name_snapshot}`).join(', ')}
                    </div>

                    <div className="text-[11px] text-slate-500 mt-1">
                      Customer: {order.delivery_address_snapshot.name} • Pickup OTP: <strong className="font-mono text-slate-900">{order.pickup_otp}</strong>
                    </div>
                  </div>

                  <div className="text-right flex sm:flex-col justify-between items-center sm:items-end">
                    <div className="font-mono font-extrabold text-sm text-slate-900">
                      {formatINR(order.total_amount)}
                    </div>
                    <Link
                      href="/hotel/orders"
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-white border border-blue-200 px-3 py-1 rounded-lg shadow-2xs mt-1"
                    >
                      Manage Status
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Direct Supplier Shipments */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Direct Supply Purchases
              </h3>
              <p className="text-xs text-slate-500">
                Direct from preferred hotel suppliers.
              </p>
            </div>
            <Link
              href="/hotel/procurement"
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              All POs →
            </Link>
          </div>

          <div className="space-y-3">
            {branchPOs.map(po => (
              <div 
                key={po.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2 text-xs"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono font-bold text-slate-800">{po.po_number}</span>
                    <div className="text-[11px] text-slate-500">{po.supplier?.company_name}</div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 uppercase">
                    {po.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-200/60 text-[11px]">
                  <span className="text-slate-500">Expected: {po.expected_delivery_date || 'Today'}</span>
                  <span className="font-mono font-bold text-slate-900">{formatINR(po.total_amount)}</span>
                </div>
              </div>
            ))}

            <Link
              href="/hotel/procurement"
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl text-xs block text-center transition"
            >
              + Create Direct Purchase Order
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

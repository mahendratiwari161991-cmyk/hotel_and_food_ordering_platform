'use client';

import React, { useState } from 'react';
import { 
  ChefHat, 
  Clock, 
  Check, 
  X, 
  Bike, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  RefreshCw,
  Phone
} from 'lucide-react';
import { usePlatform } from '../../../lib/context/platform-context';
import { platformStore } from '../../../lib/services/mock-data';
import { DispatchEngine } from '../../../lib/services/dispatch-engine';
import { formatINR, formatIST } from '../../../lib/utils';
import { Order, OrderStatus } from '../../../lib/types';

export default function KitchenDisplayPage() {
  const { activeBranchId, refreshData } = usePlatform();
  const branch = platformStore.branches.find(b => b.id === activeBranchId) || platformStore.branches[0];

  const [notification, setNotification] = useState<string | null>(null);

  // Filter orders for active branch
  const branchOrders = platformStore.orders.filter(o => o.branch_id === branch.id);

  const handleUpdateStatus = (order: Order, nextStatus: OrderStatus) => {
    order.order_status = nextStatus;

    // When food is ready, trigger central delivery fleet dispatch
    if (nextStatus === 'ready_for_pickup') {
      const dispatchResult = DispatchEngine.findAndAssignPartner(order.id);
      if (dispatchResult.success) {
        setNotification(`Order marked Ready! Central Dispatch Engine assigned courier: ${dispatchResult.assignment?.partner?.full_name}`);
      } else {
        setNotification(`Order marked Ready! Central Dispatch alerted: ${dispatchResult.message}`);
      }
    } else {
      setNotification(`Order ${order.order_number} transitioned to ${nextStatus.replace(/_/g, ' ')}`);
    }

    refreshData();
    setTimeout(() => setNotification(null), 4000);
  };

  const handleRejectOrder = (order: Order) => {
    const reason = prompt('Please enter reason for order cancellation (e.g. Out of stock):');
    if (reason) {
      order.order_status = 'cancelled';
      order.cancellation_reason = reason;
      refreshData();
      setNotification(`Order ${order.order_number} cancelled.`);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold">{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-rose-600" />
            <span>Kitchen Display System (KDS)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Realtime order dispatch for <strong className="text-slate-800">{branch.branch_name}</strong>
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl text-xs text-amber-900 flex items-center gap-2">
          <Bike className="w-4 h-4 text-amber-700" />
          <span>Fulfillment Policy: All customer orders are fulfilled by Central Platform Fleet.</span>
        </div>
      </div>

      {/* Orders Grid */}
      {branchOrders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-2">
          <ChefHat className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700 text-base">No Kitchen Orders Active</h3>
          <p className="text-xs text-slate-400">Incoming orders from the customer marketplace appear here instantly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branchOrders.map(order => {
            const isCompleted = order.order_status === 'delivered';
            const isCancelled = order.order_status === 'cancelled';
            const partner = order.delivery_assignment?.delivery_partner_id
              ? platformStore.deliveryPartners.find(p => p.id === order.delivery_assignment?.delivery_partner_id)
              : null;

            return (
              <div 
                key={order.id}
                className={`bg-white rounded-3xl border shadow-xs overflow-hidden flex flex-col justify-between transition ${
                  order.order_status === 'placed'
                    ? 'border-rose-400 ring-2 ring-rose-100'
                    : order.order_status === 'ready_for_pickup' || order.order_status === 'assigned'
                      ? 'border-blue-400 ring-2 ring-blue-50'
                      : 'border-slate-200'
                }`}
              >
                {/* Header */}
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {order.order_number}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      order.order_status === 'placed'
                        ? 'bg-rose-500 text-white animate-pulse'
                        : order.order_status === 'ready_for_pickup'
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'bg-slate-200 text-slate-800'
                    }`}>
                      {order.order_status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>Placed {formatIST(order.created_at)}</span>
                    <span className="font-mono font-semibold text-slate-700">{formatINR(order.total_amount)}</span>
                  </div>
                </div>

                {/* Items List */}
                <div className="p-5 space-y-3 flex-1">
                  <div className="space-y-2">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start text-xs border-b border-slate-50 pb-1.5">
                        <div className="flex-1">
                          <span className="font-bold text-slate-900">{item.quantity} × {item.item_name_snapshot}</span>
                          {item.variant_snapshot && (
                            <div className="text-[10px] text-slate-400">{item.variant_snapshot.name}</div>
                          )}
                          {item.addons_snapshot && (
                            <div className="text-[10px] text-rose-600">
                              +{item.addons_snapshot.map((a: any) => a.name).join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.cooking_instructions && (
                    <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 font-medium">
                      <strong>Cooking Note:</strong> {order.cooking_instructions}
                    </div>
                  )}

                  {/* Pickup OTP for Kitchen Verification */}
                  <div className="p-3 rounded-xl bg-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Handover Pickup OTP:</span>
                    <span className="font-mono font-black text-rose-600 text-base tracking-widest bg-white px-2.5 py-0.5 rounded border border-slate-200">
                      {order.pickup_otp}
                    </span>
                  </div>

                  {/* Assigned Fleet Courier info */}
                  {partner && (
                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950 space-y-1">
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center gap-1.5">
                          <Bike className="w-3.5 h-3.5 text-blue-600" />
                          <span>Fleet Courier: {partner.full_name}</span>
                        </span>
                        <span className="text-[10px] bg-blue-200 px-1.5 py-0.5 rounded">
                          {partner.vehicle_number}
                        </span>
                      </div>
                      <div className="text-[11px] text-blue-700">
                        Status: {order.delivery_assignment?.status.replace(/_/g, ' ')}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {!isCompleted && !isCancelled && (
                  <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-2">
                    {order.order_status === 'placed' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateStatus(order, 'accepted')}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-1 shadow-xs"
                        >
                          <Check className="w-4 h-4" />
                          <span>Accept Order</span>
                        </button>
                        <button
                          onClick={() => handleRejectOrder(order)}
                          className="bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 font-bold px-3 py-2.5 rounded-xl text-xs transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {order.order_status === 'accepted' && (
                      <button
                        onClick={() => handleUpdateStatus(order, 'preparing')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <ChefHat className="w-4 h-4" />
                        <span>Start Cooking</span>
                      </button>
                    )}

                    {order.order_status === 'preparing' && (
                      <button
                        onClick={() => handleUpdateStatus(order, 'ready_for_pickup')}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-2.5 rounded-xl text-xs transition shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <Bike className="w-4 h-4" />
                        <span>Food Ready • Dispatch Central Fleet</span>
                      </button>
                    )}

                    {(order.order_status === 'ready_for_pickup' || order.order_status === 'assigned') && (
                      <div className="text-center text-xs font-semibold text-blue-600 py-1 flex items-center justify-center gap-1">
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        <span>Awaiting delivery courier arrival at branch</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

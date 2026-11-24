'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Clock, 
  MapPin, 
  ChevronRight, 
  ArrowRight, 
  CheckCircle2, 
  Bike,
  Sparkles
} from 'lucide-react';
import { usePlatform } from '../../lib/context/platform-context';
import { platformStore } from '../../lib/services/mock-data';
import { formatINR, formatIST } from '../../lib/utils';

export default function OrderHistoryPage() {
  const { activeOrders } = usePlatform();
  const orders = activeOrders.length > 0 ? activeOrders : platformStore.orders;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Your Orders & Live Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Realtime status updates from hotel kitchens and central delivery partners.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No Orders Placed Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Start exploring delicious dishes from platform-owned chains and partner restaurants.
            </p>
            <Link
              href="/"
              className="inline-block bg-rose-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md"
            >
              Browse Restaurants
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const isDelivered = order.order_status === 'delivered';
              const branch = platformStore.branches.find(b => b.id === order.branch_id);

              return (
                <div 
                  key={order.id}
                  className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:border-slate-300 transition space-y-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 font-mono">
                          {order.order_number}
                        </span>
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          isDelivered 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-rose-100 text-rose-800 animate-pulse'
                        }`}>
                          {order.order_status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {branch?.branch_name || 'Hotel Outlet'} • {formatIST(order.created_at)}
                      </div>
                    </div>

                    <Link
                      href={`/orders/${order.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-900 hover:bg-rose-600 text-white px-4 py-2 rounded-xl transition shadow-xs self-start sm:self-auto"
                    >
                      <span>Track Order</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Items summary */}
                  <div className="space-y-1.5 text-xs text-slate-700">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{item.quantity} × {item.item_name_snapshot}</span>
                        <span className="font-mono text-slate-500">{formatINR(item.subtotal)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      Paid via {order.payment_method.toUpperCase()}
                    </span>
                    <span className="font-extrabold text-sm text-slate-900 font-mono">
                      {formatINR(order.total_amount)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

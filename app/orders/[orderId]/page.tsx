'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Bike, 
  Phone, 
  ShieldCheck, 
  Download, 
  Sparkles,
  AlertCircle,
  RefreshCw,
  ChefHat
} from 'lucide-react';
import { platformStore } from '../../../lib/services/mock-data';
import { usePlatform } from '../../../lib/context/platform-context';
import { formatINR, formatIST } from '../../../lib/utils';
import { OrderStatus } from '../../../lib/types';

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.orderId as string;
  const { activeOrders, refreshData } = usePlatform();

  // Find order
  const order = platformStore.orders.find(o => o.id === orderId) || platformStore.orders[0];

  const steps: { status: OrderStatus; label: string; desc: string }[] = [
    { status: 'placed', label: 'Order Placed', desc: 'Received by central server' },
    { status: 'accepted', label: 'Hotel Accepted', desc: 'Kitchen acknowledged order' },
    { status: 'preparing', label: 'Food Preparing', desc: 'Chefs cooking fresh meal' },
    { status: 'ready_for_pickup', label: 'Food Ready', desc: 'Packed & awaiting fleet pickup' },
    { status: 'assigned', label: 'Partner Assigned', desc: 'Central delivery partner dispatched' },
    { status: 'picked_up', label: 'Order Picked Up', desc: 'Courier leaving hotel branch' },
    { status: 'on_the_way', label: 'Out for Delivery', desc: 'En route to your address' },
    { status: 'delivered', label: 'Delivered', desc: 'Verified with secure delivery OTP' }
  ];

  const getStepIndex = (currentStatus: OrderStatus) => {
    return steps.findIndex(s => s.status === currentStatus);
  };

  const currentStepIdx = getStepIndex(order.order_status);

  // Delivery partner details
  const partner = order.delivery_assignment?.delivery_partner_id 
    ? platformStore.deliveryPartners.find(p => p.id === order.delivery_assignment?.delivery_partner_id)
    : platformStore.deliveryPartners[0];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/orders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All My Orders</span>
          </Link>

          <button
            onClick={() => refreshData()}
            className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Live Refresh</span>
          </button>
        </div>

        {/* Order Status Banner */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-rose-900/40 to-transparent pointer-events-none"></div>

          <div className="relative z-10 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold mb-2 border border-rose-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Live Central Tracking</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {order.order_status === 'delivered' ? 'Order Successfully Delivered!' : 'Your Gourmet Meal is in Motion'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Order <strong className="text-white font-mono">{order.order_number}</strong> • Placed {formatIST(order.created_at)}
              </p>
            </div>

            {/* Delivery OTP Display */}
            {order.order_status !== 'delivered' && (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center flex-shrink-0">
                <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">
                  Share OTP with Courier
                </div>
                <div className="text-3xl font-black font-mono tracking-widest text-amber-400 my-0.5">
                  {order.delivery_otp}
                </div>
                <div className="text-[10px] text-slate-400">
                  Required upon arrival
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 8-Stage Progress Tracker */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
            <Clock className="w-4 h-4 text-rose-600" />
            <span>Order Fulfillment Lifecycle</span>
          </h3>

          <div className="relative">
            {/* Connecting Track Line */}
            <div className="hidden sm:block absolute top-5 left-6 right-6 h-1 bg-slate-100 -z-0">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-rose-600 transition-all duration-700"
                style={{ width: `${Math.min(100, (currentStepIdx / (steps.length - 1)) * 100)}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
              {steps.map((s, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div key={s.status} className="flex flex-col items-center text-center p-2">
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition duration-300 ${
                        isCurrent
                          ? 'bg-rose-600 text-white shadow-lg ring-4 ring-rose-100 scale-110'
                          : isPassed
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>

                    <div className="mt-2">
                      <div className={`text-xs font-bold leading-tight ${isCurrent ? 'text-rose-600' : isPassed ? 'text-slate-900' : 'text-slate-400'}`}>
                        {s.label}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                        {s.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Assigned Central Delivery Partner Card */}
        {partner && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xl flex-shrink-0">
                <Bike className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">{partner.full_name}</span>
                  <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                    ★ {partner.rating}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Platform Delivery Fleet • {partner.vehicle_type.toUpperCase()} ({partner.vehicle_number})
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Completed {partner.total_completed_trips} safe trips
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a 
                href={`tel:${partner.phone}`}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Courier</span>
              </a>
            </div>
          </div>
        )}

        {/* Order Details & Invoicing Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Order Summary & Items
              </h3>
              <p className="text-xs text-slate-500">
                Fulfilled by {order.branch?.branch_name || 'Participating Hotel Branch'}
              </p>
            </div>

            <button
              onClick={() => alert(`Tax Invoice for ${order.order_number} (GST 5% included) ready. Print dialog simulated.`)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>GST Invoice</span>
            </button>
          </div>

          {/* Items List */}
          <div className="space-y-3">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-slate-50">
                <div>
                  <span className="font-bold text-slate-800">{item.item_name_snapshot}</span>
                  <span className="text-slate-400 font-mono ml-2">× {item.quantity}</span>
                  {item.variant_snapshot && (
                    <div className="text-[10px] text-slate-400">{item.variant_snapshot.name}</div>
                  )}
                </div>
                <span className="font-mono font-bold text-slate-900">
                  {formatINR(item.subtotal)}
                </span>
              </div>
            ))}
          </div>

          {/* Financial Breakdown */}
          <div className="pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Item Subtotal:</span>
              <span className="font-mono font-semibold">{formatINR(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (5% Hospitality):</span>
              <span className="font-mono">{formatINR(order.tax_amount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Packaging & Container Charge:</span>
              <span className="font-mono">{formatINR(order.packaging_fee)}</span>
            </div>
            <div className="flex justify-between">
              <span>Central Fleet Delivery Fee:</span>
              <span className="font-mono">{formatINR(order.delivery_fee)}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount Applied:</span>
                <span className="font-mono">-{formatINR(order.discount_amount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-extrabold text-slate-900 pt-3 border-t border-slate-200">
              <span>Total Paid via {order.payment_method.toUpperCase()}:</span>
              <span className="font-mono text-rose-600">{formatINR(order.total_amount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

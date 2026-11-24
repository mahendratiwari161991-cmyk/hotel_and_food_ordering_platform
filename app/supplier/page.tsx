'use client';

import React, { useState } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  FileText, 
  DollarSign, 
  Clock, 
  Building2, 
  ShieldCheck,
  Check,
  AlertCircle
} from 'lucide-react';
import { platformStore } from '../../lib/services/mock-data';
import { usePlatform } from '../../lib/context/platform-context';
import { formatINR, formatIST } from '../../lib/utils';
import { PurchaseOrder } from '../../lib/types';

export default function SupplierPortalPage() {
  const { refreshData } = usePlatform();
  const supplier = platformStore.suppliers[0]; // FreshFarms Dairy & Poultry
  const [activeTab, setActiveTab] = useState<'orders' | 'catalogue' | 'profile'>('orders');
  const [notification, setNotification] = useState<string | null>(null);

  // Filter POs directed to this supplier
  const incomingPOs = platformStore.purchaseOrders.filter(
    po => po.hotel_supplier_connection_id === 'conn-1' || po.supplier?.id === supplier.id
  );

  const handleUpdateDispatchStatus = (po: PurchaseOrder, status: any) => {
    po.status = status;
    refreshData();
    setNotification(`Purchase Order ${po.po_number} status updated to ${status.replace(/_/g, ' ')}`);
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 py-8">
      {/* Toast */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold">{notification}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 text-lg">{supplier.company_name}</span>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  Verified Supplier
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                GSTIN: <span className="font-mono text-slate-700">{supplier.gstin}</span> • APMC Market 2, Vashi, Navi Mumbai
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Multi-Hotel Commercial Isolation Active</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'orders' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Hotel Purchase Orders ({incomingPOs.length})
          </button>
          <button
            onClick={() => setActiveTab('catalogue')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'catalogue' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Wholesale Product Catalogue
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'profile' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Banking & GST Compliance
          </button>
        </div>

        {/* TAB 1: INCOMING HOTEL PURCHASE ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {incomingPOs.map(po => {
              const isDispatched = po.status === 'dispatched';
              const isReceived = po.status === 'received_complete' || po.status === 'partially_received';

              return (
                <div key={po.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 text-sm">{po.po_number}</span>
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          {po.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Issued by: <strong className="text-slate-800">Royal Heritage Hospitality - Bandra Flagship</strong>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-black text-slate-900 text-base">{formatINR(po.total_amount)}</div>
                      <div className="text-[11px] text-slate-400">Payment terms: 30 days credit</div>
                    </div>
                  </div>

                  {/* PO Items */}
                  <div className="space-y-2 text-xs">
                    {po.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
                        <div>
                          <span className="font-bold text-slate-800">{item.item_name_snapshot}</span>
                          <span className="text-slate-500 font-mono ml-2">Qty: {item.ordered_quantity} {item.unit_snapshot}</span>
                        </div>
                        <span className="font-mono font-bold text-slate-900">{formatINR(item.line_total)}</span>
                      </div>
                    ))}
                  </div>

                  {po.supplier_notes && (
                    <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900">
                      <strong>Hotel Note:</strong> {po.supplier_notes}
                    </div>
                  )}

                  {/* Supplier Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-xs text-slate-500">
                      Required by: {po.expected_delivery_date || 'Urgent'}
                    </span>

                    <div className="flex gap-2">
                      {po.status === 'sent_to_supplier' && (
                        <button
                          onClick={() => handleUpdateDispatchStatus(po, 'acknowledged')}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
                        >
                          Acknowledge Order
                        </button>
                      )}
                      {(po.status === 'acknowledged' || po.status === 'sent_to_supplier') && (
                        <button
                          onClick={() => handleUpdateDispatchStatus(po, 'dispatched')}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Dispatch Goods</span>
                        </button>
                      )}
                      {isReceived && (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                          ✓ Goods Received by Hotel Kitchen
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: PRODUCT CATALOGUE */}
        {activeTab === 'catalogue' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Wholesale Standard Products</h3>
            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-3 flex justify-between">
                <div>
                  <div className="font-bold text-slate-900">Malai Paneer Premium Block (1kg)</div>
                  <div className="text-slate-400">SKU: FF-PAN-01 • Dairy</div>
                </div>
                <div className="font-mono font-bold text-slate-800">Standard: ₹360.00 / kg</div>
              </div>
              <div className="py-3 flex justify-between">
                <div>
                  <div className="font-bold text-slate-900">Farm Fresh Spring Chicken (Curry Cut)</div>
                  <div className="text-slate-400">SKU: FF-CHK-02 • Poultry</div>
                </div>
                <div className="font-mono font-bold text-slate-800">Standard: ₹220.00 / kg</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BANKING & PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">Commercial Profile</h3>
            <div>Legal Name: FreshFarms Dairy & Poultry Distributors</div>
            <div>GSTIN: 27AAFCD1122K1Z9</div>
            <div>Bank IFSC: HDFC0000240 • Account: 50200034889122</div>
            <div>Payment Terms: 30 days net credit</div>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { 
  Boxes, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText, 
  ShieldCheck, 
  Building2,
  DollarSign,
  Download,
  Truck,
  Check
} from 'lucide-react';
import { usePlatform } from '../../../lib/context/platform-context';
import { platformStore } from '../../../lib/services/mock-data';
import { ProcurementEngine } from '../../../lib/services/procurement-engine';
import { formatINR, formatIST } from '../../../lib/utils';
import { PurchaseOrder, POStatus } from '../../../lib/types';

export default function HotelProcurementPage() {
  const { activeBranchId, refreshData } = usePlatform();
  const branch = platformStore.branches.find(b => b.id === activeBranchId) || platformStore.branches[0];
  const org = platformStore.organizations.find(o => o.id === branch.organization_id);

  const [activeTab, setActiveTab] = useState<'pos' | 'create' | 'receive' | 'suppliers'>('pos');
  const [notification, setNotification] = useState<string | null>(null);

  // Data
  const purchaseOrders = platformStore.purchaseOrders.filter(
    po => po.branch_id === branch.id || po.organization_id === org?.id
  );
  const connections = platformStore.supplierConnections.filter(
    c => c.branch_id === branch.id || c.organization_id === org?.id
  );
  const negotiatedProducts = platformStore.hotelSupplierProducts;

  // New PO State
  const [selectedConnectionId, setSelectedConnectionId] = useState<string>(connections[0]?.id || 'conn-1');
  const [expectedDate, setExpectedDate] = useState<string>('2026-11-28');
  const [poNotes, setPoNotes] = useState<string>('Deliver fresh batch via morning refrigerated van.');
  const [orderQtys, setOrderQtys] = useState<{ [productId: string]: number }>({
    'hsp-1': 15,
    'hsp-2': 25
  });

  // Receiving state
  const [selectedPoForReceipt, setSelectedPoForReceipt] = useState<PurchaseOrder | null>(null);
  const [deliveryChallan, setDeliveryChallan] = useState('CHAL-9982');
  const [receiptQuantities, setReceiptQuantities] = useState<{ [itemId: string]: { accepted: number; rejected: number; reason: string } }>({});

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();

    const items = Object.entries(orderQtys).map(([hspId, qty]) => ({
      hotelSupplierProductId: hspId,
      quantity: Number(qty)
    })).filter(i => i.quantity > 0);

    if (items.length === 0) {
      alert('Please enter quantities for at least one supply product.');
      return;
    }

    const result = ProcurementEngine.createPO({
      organizationId: org?.id || 'org-platform-1',
      branchId: branch.id,
      connectionId: selectedConnectionId,
      expectedDate,
      notes: poNotes,
      items
    });

    if (result.success) {
      setNotification(result.message);
      refreshData();
      setActiveTab('pos');
      setTimeout(() => setNotification(null), 4000);
    } else {
      alert(result.message);
    }
  };

  const handleOpenReceive = (po: PurchaseOrder) => {
    setSelectedPoForReceipt(po);
    const initialQtys: any = {};
    po.items?.forEach(i => {
      initialQtys[i.id] = {
        accepted: i.ordered_quantity - i.received_quantity,
        rejected: 0,
        reason: 'None'
      };
    });
    setReceiptQuantities(initialQtys);
    setActiveTab('receive');
  };

  const handleSubmitReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPoForReceipt) return;

    const receivedItems = Object.entries(receiptQuantities).map(([poItemId, val]) => ({
      poItemId,
      acceptedQty: Number(val.accepted),
      rejectedQty: Number(val.rejected),
      rejectionReason: val.reason !== 'None' ? val.reason : undefined
    }));

    const result = ProcurementEngine.recordReceipt({
      poId: selectedPoForReceipt.id,
      challanNo: deliveryChallan,
      notes: 'Physical delivery inspected at receiving dock.',
      receivedItems
    });

    if (result.success) {
      setNotification(result.message);
      refreshData();
      setActiveTab('pos');
      setSelectedPoForReceipt(null);
      setTimeout(() => setNotification(null), 4000);
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold">{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Boxes className="w-6 h-6 text-amber-600" />
            <span>Direct Hotel Procurement & Purchase Orders</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Independent supplier management with private negotiated prices for <strong className="text-slate-800">{branch.branch_name}</strong>
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl text-xs text-amber-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-700" />
          <span>Procurement Privacy: Negotiated rates are strictly private to your hotel.</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('pos')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'pos' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          Purchase Orders ({purchaseOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'create' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Purchase Order</span>
        </button>
        <button
          onClick={() => setActiveTab('suppliers')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'suppliers' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          Hotel Supplier Directory & Rates
        </button>
        {selectedPoForReceipt && (
          <button
            onClick={() => setActiveTab('receive')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'receive' ? 'bg-amber-600 text-white shadow-xs' : 'text-amber-800 bg-amber-50'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Receive Goods: {selectedPoForReceipt.po_number}</span>
          </button>
        )}
      </div>

      {/* TAB 1: PURCHASE ORDERS LIST */}
      {activeTab === 'pos' && (
        <div className="space-y-4">
          {purchaseOrders.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <Boxes className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-700 text-base">No Purchase Orders Created</h3>
              <p className="text-xs text-slate-400">Order dairy, poultry, produce, and supplies directly from your suppliers.</p>
              <button
                onClick={() => setActiveTab('create')}
                className="bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs"
              >
                + Create First PO
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {purchaseOrders.map(po => {
                const isComplete = po.status === 'received_complete';

                return (
                  <div 
                    key={po.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                          <span className="font-mono font-bold text-slate-900 text-sm">
                            {po.po_number}
                          </span>
                          <div className="text-xs text-slate-500 mt-0.5">
                            Supplier: <strong className="text-slate-800">{po.supplier?.company_name}</strong>
                          </div>
                        </div>

                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          isComplete 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : po.status === 'partially_received'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}>
                          {po.status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      {/* Line Items */}
                      <div className="py-3 space-y-2 text-xs">
                        {po.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
                            <div>
                              <div className="font-bold text-slate-800">{item.item_name_snapshot}</div>
                              <div className="text-[11px] text-slate-500 font-mono">
                                Ordered: {item.ordered_quantity} {item.unit_snapshot} • Received: {item.received_quantity} {item.unit_snapshot}
                              </div>
                            </div>
                            <div className="text-right font-mono">
                              <div className="font-bold text-slate-900">{formatINR(item.line_total)}</div>
                              <div className="text-[10px] text-slate-400">@ {formatINR(item.negotiated_price_snapshot)}/{item.unit_snapshot}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex justify-between text-xs">
                        <span className="text-slate-500">Expected Delivery: {po.expected_delivery_date || 'Standard'}</span>
                        <span className="font-mono font-extrabold text-sm text-slate-900">{formatINR(po.total_amount)}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-2">
                      {!isComplete && (
                        <button
                          onClick={() => handleOpenReceive(po)}
                          className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 rounded-xl text-xs transition shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Record Goods Arrival</span>
                        </button>
                      )}
                      <button
                        onClick={() => alert(`Purchase Order ${po.po_number} downloaded as PDF with GST breakup.`)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-xl text-xs font-semibold"
                        title="Download PO Slip"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CREATE DIRECT PO */}
      {activeTab === 'create' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs max-w-2xl space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-900 text-base">
              Issue Direct Purchase Order
            </h3>
            <p className="text-xs text-slate-500">
              Contractually binding purchase request sent directly to your approved supplier.
            </p>
          </div>

          <form onSubmit={handleCreatePO} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Select Supplier
                </label>
                <select
                  value={selectedConnectionId}
                  onChange={(e) => setSelectedConnectionId(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 font-medium"
                >
                  {connections.map(c => {
                    const sup = platformStore.suppliers.find(s => s.id === c.supplier_id);
                    return (
                      <option key={c.id} value={c.id}>
                        {sup?.company_name} ({sup?.payment_terms_days} days credit)
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Expected Delivery Date
                </label>
                <input
                  type="date"
                  value={expectedDate}
                  onChange={(e) => setExpectedDate(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 font-medium"
                />
              </div>
            </div>

            {/* Product selection with negotiated prices */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Items & Quantities (Private Negotiated Pricing Applied)
              </label>

              <div className="space-y-2.5">
                {negotiatedProducts.map(hsp => {
                  const currentQty = orderQtys[hsp.id] || 0;
                  const itemSubtotal = hsp.negotiated_unit_price * currentQty;

                  return (
                    <div 
                      key={hsp.id}
                      className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-4 text-xs"
                    >
                      <div className="flex-1">
                        <div className="font-bold text-slate-900">
                          {hsp.custom_item_name || hsp.supplier_product?.product_name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Negotiated Rate: <strong className="text-slate-900 font-mono">{formatINR(hsp.negotiated_unit_price)}</strong> / {hsp.supplier_product?.unit_of_measure} (Tax: {hsp.tax_rate_percent}%)
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <label className="text-slate-400 font-medium text-[11px]">Qty:</label>
                          <input
                            type="number"
                            min="0"
                            value={currentQty}
                            onChange={(e) => setOrderQtys({ ...orderQtys, [hsp.id]: Number(e.target.value) })}
                            className="w-16 p-2 rounded-lg border border-slate-200 font-mono text-center font-bold text-xs"
                          />
                          <span className="text-slate-400">{hsp.supplier_product?.unit_of_measure}</span>
                        </div>

                        <div className="w-24 text-right font-mono font-bold text-slate-800">
                          {formatINR(itemSubtotal)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Dispatch Instructions / Packaging Notes
              </label>
              <textarea
                rows={2}
                value={poNotes}
                onChange={(e) => setPoNotes(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('pos')}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl text-xs transition shadow-md"
              >
                Submit Purchase Order
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: RECEIVE GOODS & DAMAGED/PARTIAL LOGS */}
      {activeTab === 'receive' && selectedPoForReceipt && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs max-w-2xl space-y-6">
          <div className="border-b border-slate-100 pb-4 flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                Receiving Dock Inspection
              </span>
              <h3 className="font-bold text-slate-900 text-base mt-0.5">
                Record Delivery: {selectedPoForReceipt.po_number}
              </h3>
              <p className="text-xs text-slate-500">
                Supplier: {selectedPoForReceipt.supplier?.company_name}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('pos')}
              className="text-slate-400 hover:text-slate-800 text-xs font-bold"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmitReceipt} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Supplier Delivery Challan / Invoice No.
              </label>
              <input
                type="text"
                value={deliveryChallan}
                onChange={(e) => setDeliveryChallan(e.target.value)}
                placeholder="e.g. DC-98421"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-amber-500 font-mono font-bold"
                required
              />
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Inspect Line Items (Accepted vs Shortage/Damaged)
              </div>

              {selectedPoForReceipt.items?.map(item => {
                const current = receiptQuantities[item.id] || { accepted: 0, rejected: 0, reason: 'None' };

                return (
                  <div key={item.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs">
                    <div className="flex justify-between items-center font-bold text-slate-900">
                      <span>{item.item_name_snapshot}</span>
                      <span className="font-mono text-slate-500">
                        Total Ordered: {item.ordered_quantity} {item.unit_snapshot} (Already Recv: {item.received_quantity})
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] text-emerald-700 font-bold mb-1">
                          Accepted Qty ({item.unit_snapshot})
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={current.accepted}
                          onChange={(e) => setReceiptQuantities({
                            ...receiptQuantities,
                            [item.id]: { ...current, accepted: Number(e.target.value) }
                          })}
                          className="w-full p-2.5 rounded-xl border border-emerald-300 bg-emerald-50/50 font-mono font-bold text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-rose-700 font-bold mb-1">
                          Damaged / Short ({item.unit_snapshot})
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={current.rejected}
                          onChange={(e) => setReceiptQuantities({
                            ...receiptQuantities,
                            [item.id]: { ...current, rejected: Number(e.target.value) }
                          })}
                          className="w-full p-2.5 rounded-xl border border-rose-300 bg-rose-50/50 font-mono font-bold text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-500 font-medium mb-1">
                          Rejection Reason
                        </label>
                        <select
                          value={current.reason}
                          onChange={(e) => setReceiptQuantities({
                            ...receiptQuantities,
                            [item.id]: { ...current, reason: e.target.value }
                          })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 font-medium text-xs bg-white"
                        >
                          <option value="None">None (All Good)</option>
                          <option value="damaged">Damaged in Transit</option>
                          <option value="shortage">Quantity Shortage</option>
                          <option value="expired">Expired / Past Quality Date</option>
                          <option value="wrong_grade">Inferior Grade</option>
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-extrabold py-3.5 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Confirm Physical Receipt & Audit Log</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: HOTEL SUPPLIER DIRECTORY & NEGOTIATED RATES */}
      {activeTab === 'suppliers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {connections.map(conn => {
              const sup = platformStore.suppliers.find(s => s.id === conn.supplier_id);
              if (!sup) return null;

              return (
                <div key={conn.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                        {conn.custom_supplier_code || 'SUP-01'}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base mt-0.5">
                        {sup.company_name}
                      </h3>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Contact: {sup.contact_name} ({sup.phone})
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                      {conn.status}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 text-xs space-y-1 text-slate-600">
                    <div>GSTIN: <strong className="font-mono text-slate-800">{sup.gstin}</strong></div>
                    <div>Credit Period: <strong className="text-slate-800">{conn.credit_period_days} Days</strong></div>
                    <div>Credit Limit: <strong className="font-mono text-slate-800">{formatINR(conn.credit_limit)}</strong></div>
                    <div>Address: {sup.address}, {sup.city}</div>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      Your Negotiated Purchase Rates (Private)
                    </div>
                    <div className="space-y-1.5">
                      {negotiatedProducts
                        .filter(p => p.hotel_supplier_connection_id === conn.id)
                        .map(hsp => (
                          <div key={hsp.id} className="flex justify-between items-center text-xs p-2 rounded-lg bg-slate-100/60">
                            <span className="font-medium text-slate-800">{hsp.custom_item_name}</span>
                            <span className="font-mono font-bold text-slate-900">
                              {formatINR(hsp.negotiated_unit_price)} / {hsp.supplier_product?.unit_of_measure}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

import { platformStore } from './mock-data';
import { PurchaseOrder, PurchaseOrderItem, PurchaseReceipt, POStatus } from '../types';

export class ProcurementEngine {
  /**
   * Create a Purchase Order from hotel to a preferred direct supplier.
   * Uses strictly isolated negotiated prices.
   */
  static createPO(data: {
    organizationId: string;
    branchId: string;
    connectionId: string;
    expectedDate: string;
    notes?: string;
    items: {
      hotelSupplierProductId: string;
      quantity: number;
    }[];
  }): { success: boolean; po?: PurchaseOrder; message: string } {
    const connection = platformStore.supplierConnections.find(c => c.id === data.connectionId);
    if (!connection) {
      return { success: false, message: 'Supplier connection not found' };
    }

    const supplier = platformStore.suppliers.find(s => s.id === connection.supplier_id);
    const poNumber = `PO-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(1000 + Math.random() * 9000))}`;

    let subtotal = 0;
    let taxTotal = 0;
    const poId = `po-${Date.now()}`;

    const poItems: PurchaseOrderItem[] = [];

    for (const item of data.items) {
      const hsp = platformStore.hotelSupplierProducts.find(p => p.id === item.hotelSupplierProductId);
      if (!hsp) continue;

      const lineSubtotal = hsp.negotiated_unit_price * item.quantity;
      const lineTax = (lineSubtotal * hsp.tax_rate_percent) / 100;
      subtotal += lineSubtotal;
      taxTotal += lineTax;

      poItems.push({
        id: `poi-${Date.now()}-${Math.random()}`,
        purchase_order_id: poId,
        hotel_supplier_product_id: hsp.id,
        item_name_snapshot: hsp.custom_item_name || hsp.supplier_product?.product_name || 'Supplies',
        unit_snapshot: hsp.supplier_product?.unit_of_measure || 'units',
        ordered_quantity: item.quantity,
        received_quantity: 0,
        negotiated_price_snapshot: hsp.negotiated_unit_price,
        line_total: lineSubtotal
      });
    }

    const totalAmount = subtotal + taxTotal;

    const po: PurchaseOrder = {
      id: poId,
      po_number: poNumber,
      organization_id: data.organizationId,
      branch_id: data.branchId,
      hotel_supplier_connection_id: data.connectionId,
      expected_delivery_date: data.expectedDate,
      subtotal,
      tax_total: taxTotal,
      total_amount: totalAmount,
      status: 'sent_to_supplier',
      supplier_notes: data.notes,
      created_at: new Date().toISOString(),
      supplier,
      items: poItems
    };

    platformStore.purchaseOrders.unshift(po);
    return { success: true, po, message: `Purchase Order ${poNumber} created and dispatched to ${supplier?.company_name}.` };
  }

  /**
   * Record physical receipt of goods (supports partial deliveries and damaged/missing item logs)
   */
  static recordReceipt(data: {
    poId: string;
    challanNo: string;
    notes?: string;
    receivedItems: {
      poItemId: string;
      acceptedQty: number;
      rejectedQty: number;
      rejectionReason?: string;
    }[];
  }): { success: boolean; message: string; receipt?: PurchaseReceipt } {
    const po = platformStore.purchaseOrders.find(p => p.id === data.poId);
    if (!po) return { success: false, message: 'Purchase Order not found' };

    let totalOrdered = 0;
    let totalReceived = 0;

    const receiptItemsFormatted = [];

    for (const recItem of data.receivedItems) {
      const poItem = po.items?.find(i => i.id === recItem.poItemId);
      if (!poItem) continue;

      poItem.received_quantity += recItem.acceptedQty;
      totalOrdered += poItem.ordered_quantity;
      totalReceived += poItem.received_quantity;

      receiptItemsFormatted.push({
        item_name: poItem.item_name_snapshot,
        accepted_quantity: recItem.acceptedQty,
        rejected_quantity: recItem.rejectedQty,
        rejection_reason: recItem.rejectionReason
      });
    }

    const receipt: PurchaseReceipt = {
      id: `pr-${Date.now()}`,
      purchase_order_id: po.id,
      receipt_number: `REC-${Date.now().toString().slice(-6)}`,
      delivery_challan_no: data.challanNo,
      received_at: new Date().toISOString(),
      notes: data.notes,
      items: receiptItemsFormatted
    };

    platformStore.purchaseReceipts.unshift(receipt);

    // Update PO Status
    if (totalReceived >= totalOrdered && totalOrdered > 0) {
      po.status = 'received_complete';
    } else {
      po.status = 'partially_received';
    }

    return { 
      success: true, 
      message: `Goods receipt ${receipt.receipt_number} recorded. Status updated to ${po.status}.`, 
      receipt 
    };
  }
}

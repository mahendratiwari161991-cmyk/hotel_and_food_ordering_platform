'use client';

import React from 'react';
import { 
  BarChart3, 
  DollarSign, 
  Download, 
  Sparkles, 
  Building2,
  Calendar,
  CreditCard,
  Percent
} from 'lucide-react';
import { usePlatform } from '../../../lib/context/platform-context';
import { platformStore } from '../../../lib/services/mock-data';
import { formatINR } from '../../../lib/utils';

export default function HotelFinancialReportsPage() {
  const { activeBranchId } = usePlatform();
  const branch = platformStore.branches.find(b => b.id === activeBranchId) || platformStore.branches[0];
  const org = platformStore.organizations.find(o => o.id === branch.organization_id);
  const isPlatformOwned = org?.ownership_type === 'platform_owned';

  // Branch orders
  const branchOrders = platformStore.orders.filter(o => o.branch_id === branch.id);
  const branchGross = branchOrders.reduce((acc, o) => acc + o.total_amount, 0);
  const branchCommission = isPlatformOwned ? 0 : Math.round(branchGross * 0.15);
  const branchGST = branchOrders.reduce((acc, o) => acc + o.tax_amount, 0);
  const branchNetPayout = branchGross - branchCommission;

  // Org Consolidated Numbers (all branches)
  const allOrgBranches = platformStore.branches.filter(b => b.organization_id === org?.id);
  const orgOrders = platformStore.orders.filter(o => o.organization_id === org?.id);
  const orgGross = orgOrders.reduce((acc, o) => acc + o.total_amount, 0);
  const orgCommission = isPlatformOwned ? 0 : Math.round(orgGross * 0.15);
  const orgNet = orgGross - orgCommission;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-600" />
            <span>Financial & Settlement Reports</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            GST reconciliation and net payout ledgers for <strong className="text-slate-800">{org?.name}</strong>
          </p>
        </div>

        <button
          onClick={() => alert('Financial ledger exported as Excel (.xlsx) with GSTIN breakdown.')}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export GST-Ready Statement</span>
        </button>
      </div>

      {/* Ownership & Commission Status Callout */}
      <div className={`p-5 rounded-3xl border text-xs flex items-center justify-between ${
        isPlatformOwned 
          ? 'bg-amber-50 border-amber-200 text-amber-950' 
          : 'bg-emerald-50 border-emerald-200 text-emerald-950'
      }`}>
        <div className="flex items-center gap-3">
          <Building2 className="w-6 h-6 flex-shrink-0" />
          <div>
            <div className="font-bold text-sm">
              {isPlatformOwned ? 'Platform-Owned Chain Account' : 'Third-Party Marketplace Partner'}
            </div>
            <div className="text-[11px] opacity-80 mt-0.5">
              {isPlatformOwned 
                ? 'Zero platform commission applied. Branch revenue consolidates directly into parent organization accounts.'
                : '15% platform marketplace commission applied. Automatic T+2 bank settlement to registered account.'
              }
            </div>
          </div>
        </div>

        <div className="font-mono font-black text-lg">
          {isPlatformOwned ? '0% Commission' : '15% Commission'}
        </div>
      </div>

      {/* Active Branch Summary Cards */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
          Active Branch Performance ({branch.branch_name})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Gross Food Sales</div>
            <div className="text-2xl font-black text-slate-900 mt-1 font-mono">{formatINR(branchGross)}</div>
            <div className="text-[11px] text-slate-400 mt-1">{branchOrders.length} completed orders</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Platform Commission</div>
            <div className="text-2xl font-black text-rose-600 mt-1 font-mono">{formatINR(branchCommission)}</div>
            <div className="text-[11px] text-slate-400 mt-1">{isPlatformOwned ? 'Exempted (Self-Operated)' : '15% Marketplace fee'}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">GST Collected (5%)</div>
            <div className="text-2xl font-black text-slate-900 mt-1 font-mono">{formatINR(branchGST)}</div>
            <div className="text-[11px] text-slate-400 mt-1">GSTR-1 Monthly Credit</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Net Payable / Settled</div>
            <div className="text-2xl font-black text-emerald-600 mt-1 font-mono">{formatINR(branchNetPayout)}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">Processed to Bank Account</div>
          </div>
        </div>
      </div>

      {/* Multi-Branch Consolidated Chain Breakdown (if platform owned or multi-branch) */}
      {allOrgBranches.length > 1 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Consolidated Organization Chain Totals ({allOrgBranches.length} Branches)
              </h3>
              <p className="text-xs text-slate-500">
                Consolidated across Mumbai outlets
              </p>
            </div>
            <span className="font-mono font-black text-lg text-slate-900">
              Total: {formatINR(orgGross)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {allOrgBranches.map(b => (
              <div key={b.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-900 text-sm">{b.branch_name}</div>
                <div className="text-slate-500">{b.address_line}, {b.city}</div>
                <div className="pt-2 flex justify-between text-slate-800 font-semibold font-mono">
                  <span>Branch Gross Sales:</span>
                  <span>{formatINR(branch.id === b.id ? branchGross : 8450)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

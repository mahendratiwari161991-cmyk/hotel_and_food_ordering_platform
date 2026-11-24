'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ChefHat, 
  Boxes, 
  UtensilsCrossed, 
  CalendarDays, 
  BarChart3, 
  Building2,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { usePlatform } from '../../lib/context/platform-context';
import { platformStore } from '../../lib/services/mock-data';

export default function HotelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { activeBranchId, setActiveBranchId } = usePlatform();

  const branches = platformStore.branches;
  const activeBranch = branches.find(b => b.id === activeBranchId) || branches[0];
  const org = platformStore.organizations.find(o => o.id === activeBranch.organization_id);
  const isPlatformOwned = org?.ownership_type === 'platform_owned';

  const navLinks = [
    { href: '/hotel/dashboard', label: 'Dashboard Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: '/hotel/orders', label: 'Kitchen Display (KDS)', icon: <ChefHat className="w-4 h-4" /> },
    { href: '/hotel/procurement', label: 'Direct Procurement', icon: <Boxes className="w-4 h-4" /> },
    { href: '/hotel/menu', label: 'Menu & Branch Pricing', icon: <UtensilsCrossed className="w-4 h-4" /> },
    { href: '/hotel/venues', label: 'Venues & Enquiries', icon: <CalendarDays className="w-4 h-4" /> },
    { href: '/hotel/reports', label: 'Financial Reports', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-100/70">
      {/* Hotel Dashboard Top Sub-Header */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-sm">
                  {org?.name}
                </span>
                {isPlatformOwned ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full">
                    <Sparkles className="w-2.5 h-2.5 fill-slate-950" />
                    <span>Platform-Owned Chain</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                    Independent Partner Hotel
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400">
                GSTIN: {activeBranch.gstin || '27AABCR1234F1Z5'} • FSSAI: {activeBranch.fssai_license_number || '11518001000452'}
              </div>
            </div>
          </div>

          {/* Active Branch Selector Dropdown */}
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl">
            <span className="text-xs text-slate-400 font-medium">Active Branch:</span>
            <select
              value={activeBranchId}
              onChange={(e) => setActiveBranchId(e.target.value)}
              className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer"
            >
              {branches.map(b => (
                <option key={b.id} value={b.id} className="bg-slate-800 text-white">
                  {b.branch_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto border-t border-slate-800/80 pt-1 text-xs">
          {navLinks.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-slate-100 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

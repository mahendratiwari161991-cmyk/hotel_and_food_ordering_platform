'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShoppingBag, 
  MapPin, 
  Building2, 
  Bike, 
  ShieldCheck, 
  Package, 
  Menu, 
  X,
  ChevronDown,
  UserCheck
} from 'lucide-react';
import { usePlatform } from '../../lib/context/platform-context';
import { SystemRole } from '../../lib/types';
import { formatINR } from '../../lib/utils';

export function TopBar() {
  const pathname = usePathname();
  const { currentRole, setCurrentRole, cartItemCount, cartSubtotal, cart } = usePlatform();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const roles: { role: SystemRole; label: string; icon: React.ReactNode; path: string }[] = [
    { role: 'customer', label: 'Customer View', icon: <UserCheck className="w-4 h-4 text-emerald-600" />, path: '/' },
    { role: 'hotel_owner', label: 'Hotel Management', icon: <Building2 className="w-4 h-4 text-blue-600" />, path: '/hotel/dashboard' },
    { role: 'delivery_partner', label: 'Delivery Partner App', icon: <Bike className="w-4 h-4 text-orange-600" />, path: '/delivery' },
    { role: 'platform_admin', label: 'Central Admin Panel', icon: <ShieldCheck className="w-4 h-4 text-purple-600" />, path: '/admin' },
    { role: 'supplier_user', label: 'Supplier Portal', icon: <Package className="w-4 h-4 text-amber-600" />, path: '/supplier' },
  ];

  const currentRoleObj = roles.find(r => r.role === currentRole) || roles[0];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Banner indicating Platform Status & Role Toggle */}
      <div className="bg-slate-900 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-slate-200">
              Hybrid Multi-Hotel & Central Delivery Grid Active
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline text-slate-400">Timezone: Asia/Kolkata (IST)</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded text-xs font-medium text-slate-100 transition border border-slate-700"
            >
              <span className="text-slate-400">Switch Interface:</span>
              <span className="font-semibold text-white flex items-center gap-1">
                {currentRoleObj.label}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 text-slate-800">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Test Any Interface
                </div>
                {roles.map(r => (
                  <Link
                    key={r.role}
                    href={r.path}
                    onClick={() => {
                      setCurrentRole(r.role);
                      setRoleMenuOpen(false);
                    }}
                    className={`flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-slate-50 transition ${
                      currentRole === r.role ? 'bg-slate-100 font-semibold text-slate-900' : 'text-slate-700'
                    }`}
                  >
                    {r.icon}
                    <span>{r.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-105 transition">
              H
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900">
                HOTEL<span className="text-rose-600">&</span>DELIVERY
              </span>
              <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                Hybrid Hospitality Marketplace
              </span>
            </div>
          </Link>

          {/* Location Picker */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-xs text-slate-700 border border-slate-200">
            <MapPin className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
            <span className="font-medium text-slate-900">Bandra West, Mumbai</span>
            <span className="text-slate-400">400050</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-600">
          <Link
            href="/"
            className={`px-3 py-2 rounded-lg transition ${
              pathname === '/' ? 'text-rose-600 font-semibold bg-rose-50' : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Food Marketplace
          </Link>
          <Link
            href="/venues"
            className={`px-3 py-2 rounded-lg transition ${
              pathname.startsWith('/venues') ? 'text-rose-600 font-semibold bg-rose-50' : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Venues & Occasions
          </Link>
          <Link
            href="/orders"
            className={`px-3 py-2 rounded-lg transition ${
              pathname.startsWith('/orders') ? 'text-rose-600 font-semibold bg-rose-50' : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Live Tracking
          </Link>
          <span className="w-px h-5 bg-slate-200 mx-1"></span>
          <Link
            href="/hotel/dashboard"
            className={`px-3 py-2 rounded-lg transition ${
              pathname.startsWith('/hotel') ? 'text-blue-600 font-semibold bg-blue-50' : 'hover:text-blue-600 hover:bg-blue-50/50'
            }`}
          >
            Hotel Portal
          </Link>
          <Link
            href="/delivery"
            className={`px-3 py-2 rounded-lg transition ${
              pathname.startsWith('/delivery') ? 'text-orange-600 font-semibold bg-orange-50' : 'hover:text-orange-600 hover:bg-orange-50/50'
            }`}
          >
            Delivery Fleet
          </Link>
          <Link
            href="/admin"
            className={`px-3 py-2 rounded-lg transition ${
              pathname.startsWith('/admin') ? 'text-purple-600 font-semibold bg-purple-50' : 'hover:text-purple-600 hover:bg-purple-50/50'
            }`}
          >
            Admin
          </Link>
        </nav>

        {/* Cart Drawer Trigger */}
        <div className="flex items-center gap-3">
          <Link
            href="/checkout"
            className="flex items-center gap-2.5 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition active:scale-95"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-900 font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </div>
            <span>Cart</span>
            {cartSubtotal > 0 && (
              <span className="bg-rose-700/60 px-2 py-0.5 rounded text-xs font-mono font-bold">
                {formatINR(cartSubtotal)}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-slate-700 hover:bg-slate-100"
          >
            Food Marketplace
          </Link>
          <Link
            href="/venues"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-slate-700 hover:bg-slate-100"
          >
            Venues & Occasions
          </Link>
          <Link
            href="/orders"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-slate-700 hover:bg-slate-100"
          >
            Live Tracking
          </Link>
          <div className="pt-2 border-t border-slate-100">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 pb-1">
              Management Portals
            </div>
            <Link
              href="/hotel/dashboard"
              onClick={() => { setCurrentRole('hotel_owner'); setMobileMenuOpen(false); }}
              className="block px-3 py-2 rounded-md font-medium text-blue-700 hover:bg-blue-50"
            >
              Hotel Management Dashboard
            </Link>
            <Link
              href="/delivery"
              onClick={() => { setCurrentRole('delivery_partner'); setMobileMenuOpen(false); }}
              className="block px-3 py-2 rounded-md font-medium text-orange-700 hover:bg-orange-50"
            >
              Delivery Fleet App
            </Link>
            <Link
              href="/admin"
              onClick={() => { setCurrentRole('platform_admin'); setMobileMenuOpen(false); }}
              className="block px-3 py-2 rounded-md font-medium text-purple-700 hover:bg-purple-50"
            >
              Platform Administration
            </Link>
            <Link
              href="/supplier"
              onClick={() => { setCurrentRole('supplier_user'); setMobileMenuOpen(false); }}
              className="block px-3 py-2 rounded-md font-medium text-amber-700 hover:bg-amber-50"
            >
              Supplier Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

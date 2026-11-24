'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  MapPin, 
  Clock, 
  Star, 
  ShieldCheck, 
  Sparkles, 
  Filter, 
  Plus, 
  Check, 
  Building2,
  CalendarDays,
  ShoppingBag
} from 'lucide-react';
import { platformStore } from '../lib/services/mock-data';
import { formatINR } from '../lib/utils';
import { usePlatform } from '../lib/context/platform-context';
import { FoodType, MenuItem } from '../lib/types';

export default function CustomerHomePage() {
  const { addToCart, cart } = usePlatform();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');
  const [vegOnly, setVegOnly] = useState<boolean>(false);
  const [ownershipFilter, setOwnershipFilter] = useState<'all' | 'platform_owned' | 'third_party'>('all');
  const [addedItemNotification, setAddedItemNotification] = useState<string | null>(null);

  const branches = platformStore.branches;
  const menuItems = platformStore.menuItems;

  // Filter branches
  const filteredBranches = branches.filter(branch => {
    const org = platformStore.organizations.find(o => o.id === branch.organization_id);
    if (!org) return false;

    // Filter by ownership
    if (ownershipFilter !== 'all' && org.ownership_type !== ownershipFilter) {
      return false;
    }

    // Filter by search
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = branch.branch_name.toLowerCase().includes(q);
      const matchOrg = org.name.toLowerCase().includes(q);
      const matchCity = branch.city.toLowerCase().includes(q);
      if (!matchName && !matchOrg && !matchCity) return false;
    }

    return true;
  });

  // Filter menu items
  const filteredItems = menuItems.filter(item => {
    if (vegOnly && item.food_type !== 'veg' && item.food_type !== 'vegan') return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }
    return true;
  });

  const handleQuickAdd = (item: MenuItem) => {
    // Pick the first branch belonging to this item's organization
    const branch = branches.find(b => b.organization_id === item.organization_id);
    const result = addToCart(item, 1, item.variants?.[0], undefined, branch);

    if (result.success) {
      setAddedItemNotification(`Added ${item.name} to cart!`);
      setTimeout(() => setAddedItemNotification(null), 3000);
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Toast Notification */}
      {addedItemNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-bounce">
          <Check className="w-5 h-5" />
          <span className="text-sm font-semibold">{addedItemNotification}</span>
        </div>
      )}

      {/* Hero & Discovery Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold mb-4 border border-rose-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Unified Hybrid Hospitality Experience</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
              Gourmet Food Ordering & Luxury Venue Bookings
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              Explore royal cuisines from our platform-owned heritage hotels and top verified independent restaurant partners. Centralized delivery dispatch guarantees fresh, punctual doorstep delivery.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch gap-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-white rounded-xl text-slate-800">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search dishes (Biryani, Dal Makhani), hotels, or localities..."
                  className="w-full bg-transparent border-none outline-none text-sm placeholder:text-slate-400 font-medium"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setVegOnly(!vegOnly)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition flex-1 sm:flex-none justify-center ${
                    vegOnly 
                      ? 'bg-emerald-600 text-white shadow-md' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full border-2 ${vegOnly ? 'bg-white border-white' : 'border-emerald-400'}`}></span>
                  <span>Veg Only</span>
                </button>

                <Link
                  href="/venues"
                  className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-3 rounded-xl text-sm transition shadow-md whitespace-nowrap"
                >
                  <CalendarDays className="w-4 h-4" />
                  <span>Book Venues</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Chips Bar */}
      <div className="sticky top-16 z-40 bg-white border-b border-slate-200 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Outlet Type:
            </span>
            <button
              onClick={() => setOwnershipFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                ownershipFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Hotels ({branches.length})
            </button>
            <button
              onClick={() => setOwnershipFilter('platform_owned')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${
                ownershipFilter === 'platform_owned'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Platform-Owned Chains</span>
            </button>
            <button
              onClick={() => setOwnershipFilter('third_party')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${
                ownershipFilter === 'third_party'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <Building2 className="w-3 h-3" />
              <span>Independent Partners</span>
            </button>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{filteredBranches.length}</strong> outlets in Mumbai
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Section 1: Hotel & Restaurant Discovery */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Featured Hotels & Dining Outlets
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                Single unified checkout with centralized doorstep delivery.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBranches.map(branch => {
              const org = platformStore.organizations.find(o => o.id === branch.organization_id);
              const isPlatformOwned = org?.ownership_type === 'platform_owned';

              return (
                <div 
                  key={branch.id} 
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition group flex flex-col"
                >
                  {/* Hotel Banner Image */}
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <img 
                      src={org?.banner_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80'} 
                      alt={branch.branch_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />

                    {/* Ownership Badge */}
                    <div className="absolute top-3 left-3">
                      {isPlatformOwned ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950 shadow-md">
                          <Sparkles className="w-3 h-3 fill-slate-950" />
                          <span>Platform-Owned</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-md">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Verified Partner</span>
                        </span>
                      )}
                    </div>

                    {/* Operating Status */}
                    <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-rose-400" />
                      <span>{branch.average_preparation_time_mins} mins</span>
                    </div>
                  </div>

                  {/* Hotel Body Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-rose-600 transition">
                          {branch.branch_name}
                        </h3>
                        <div className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded text-emerald-800 text-xs font-bold border border-emerald-200">
                          <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                          <span>4.7</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                        {branch.address_line}, {branch.city} - {branch.pincode}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 mb-4">
                        <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">North Indian</span>
                        <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">Awadhi</span>
                        <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">Biryani</span>
                        <span className="text-slate-400">•</span>
                        <span>₹{branch.packaging_fee_base} pkg</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-xs text-slate-500">
                        Delivery via <strong className="text-slate-800">Central Fleet</strong>
                      </div>

                      <Link
                        href={`/restaurants/${branch.slug}`}
                        className="bg-slate-900 hover:bg-rose-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1 shadow-sm"
                      >
                        <span>View Menu</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 2: Trending Signature Dishes */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Chef&apos;s Recommendations
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Trending Gourmet Dishes
              </h2>
            </div>
            <span className="text-xs text-slate-400">Order directly from participating kitchens</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.slice(0, 6).map(item => {
              const isVeg = item.food_type === 'veg' || item.food_type === 'vegan';
              const org = platformStore.organizations.find(o => o.id === item.organization_id);

              return (
                <div 
                  key={item.id}
                  className="flex gap-4 p-4 rounded-2xl border border-slate-100 hover:border-slate-300 hover:shadow-sm bg-slate-50/50 transition group"
                >
                  {/* Dish Image */}
                  <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0">
                    <img 
                      src={item.image_url} 
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                    {/* Food Type Indicator (Indian Veg/Non-Veg symbol) */}
                    <div className="absolute top-2 left-2 bg-white/90 p-1 rounded border shadow-xs">
                      <div className={`w-2.5 h-2.5 rounded-full ${isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`}></div>
                    </div>
                  </div>

                  {/* Dish Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                        {org?.name}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight mb-1">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <span className="font-extrabold text-slate-900 text-sm">
                        {formatINR(item.base_price)}
                      </span>

                      <button
                        onClick={() => handleQuickAdd(item)}
                        className="flex items-center gap-1 bg-white hover:bg-rose-600 hover:text-white text-rose-600 border border-rose-200 hover:border-rose-600 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-xs active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 3: Occasion & Banquet Venues Promo Banner */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-600 via-rose-700 to-purple-800 text-white p-8 sm:p-12 shadow-lg">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-4">
              Hotel Venues & Lawns
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mb-4 tracking-tight">
              Host Your Dream Wedding, Sangeet, or Corporate Gala
            </h2>
            <p className="text-white/90 text-sm sm:text-base mb-6 leading-relaxed">
              Book certified luxury hotel ballrooms and oceanside lawns directly through the marketplace. Real-time slot availability, instant quotation, and transparent advance payment protection.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/venues"
                className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-6 py-3 rounded-xl text-sm transition shadow-md"
              >
                Explore Available Venues
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

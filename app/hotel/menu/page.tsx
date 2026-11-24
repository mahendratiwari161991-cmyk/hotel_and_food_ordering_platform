'use client';

import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  Plus, 
  Sparkles, 
  Check, 
  Edit, 
  Eye, 
  EyeOff,
  Building2
} from 'lucide-react';
import { usePlatform } from '../../../lib/context/platform-context';
import { platformStore } from '../../../lib/services/mock-data';
import { formatINR } from '../../../lib/utils';
import { MenuItem } from '../../../lib/types';

export default function HotelMenuManagementPage() {
  const { activeBranchId, refreshData } = usePlatform();
  const branch = platformStore.branches.find(b => b.id === activeBranchId) || platformStore.branches[0];
  const org = platformStore.organizations.find(o => o.id === branch.organization_id);

  const menuItems = platformStore.menuItems.filter(m => m.organization_id === org?.id);
  const [notification, setNotification] = useState<string | null>(null);

  const toggleAvailability = (item: MenuItem) => {
    item.is_available = !item.is_available;
    refreshData();
    setNotification(`${item.name} is now ${item.is_available ? 'Available' : 'Turned Off (Sold Out)'}.`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleEditPrice = (item: MenuItem) => {
    const newPrice = prompt(`Enter new base price for ${item.name}:`, String(item.base_price));
    if (newPrice && !isNaN(Number(newPrice))) {
      item.base_price = Number(newPrice);
      refreshData();
      setNotification(`Price updated for ${item.name} to ₹${newPrice}`);
      setTimeout(() => setNotification(null), 3000);
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
            <UtensilsCrossed className="w-6 h-6 text-rose-600" />
            <span>Menu & Branch Overrides</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Control live menu availability and pricing for <strong className="text-slate-800">{branch.branch_name}</strong>
          </p>
        </div>

        <button
          onClick={() => alert('New menu item modal. In production, uploads high-res dish photos and nutrition info.')}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Dish</span>
        </button>
      </div>

      {/* Menu Table / Cards */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="divide-y divide-slate-100">
          {menuItems.map(item => {
            const isVeg = item.food_type === 'veg' || item.food_type === 'vegan';

            return (
              <div 
                key={item.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                    <img 
                      src={item.image_url} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 left-1 bg-white p-0.5 rounded shadow-2xs">
                      <div className={`w-2 h-2 rounded-full ${isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`}></div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 max-w-md">
                      {item.description}
                    </p>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Prep: {item.preparation_time_mins} mins • Variants: {item.variants?.length || 0}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-right">
                    <div className="font-mono font-extrabold text-sm text-slate-900">
                      {formatINR(item.base_price)}
                    </div>
                    <button
                      onClick={() => handleEditPrice(item)}
                      className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit Price</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleAvailability(item)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                        item.is_available
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {item.is_available ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{item.is_available ? 'Available' : 'Turned Off'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

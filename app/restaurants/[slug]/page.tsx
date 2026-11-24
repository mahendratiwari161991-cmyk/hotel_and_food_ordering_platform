'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Star, 
  Plus, 
  Minus, 
  ShoppingBag,
  Building2,
  Check,
  Info
} from 'lucide-react';
import { platformStore } from '../../../lib/services/mock-data';
import { usePlatform } from '../../../lib/context/platform-context';
import { formatINR } from '../../../lib/utils';
import { MenuItem, MenuVariant, MenuAddon } from '../../../lib/types';

export default function RestaurantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { addToCart, cart, cartItemCount, cartSubtotal } = usePlatform();

  // Find the branch by slug or find the first branch of the organization if org slug was provided
  let branch = platformStore.branches.find(b => b.slug === slug);
  let org = branch ? platformStore.organizations.find(o => o.id === branch?.organization_id) : undefined;

  if (!branch) {
    org = platformStore.organizations.find(o => o.slug === slug);
    if (org) {
      branch = platformStore.branches.find(b => b.organization_id === org?.id);
    }
  }

  // Related sibling branches if platform owned
  const siblingBranches = org ? platformStore.branches.filter(b => b.organization_id === org?.id) : [];

  // Menu items for this organization
  const menuItems = org ? platformStore.menuItems.filter(m => m.organization_id === org?.id) : [];

  // State for customization modal
  const [selectedItemForCustomization, setSelectedItemForCustomization] = useState<MenuItem | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<MenuVariant | undefined>(undefined);
  const [selectedAddons, setSelectedAddons] = useState<MenuAddon[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!branch || !org) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Outlet Not Found</h2>
        <p className="text-slate-500 mb-6">The restaurant or branch you requested is not active on the marketplace.</p>
        <Link href="/" className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const isPlatformOwned = org.ownership_type === 'platform_owned';

  const handleOpenCustomization = (item: MenuItem) => {
    setSelectedItemForCustomization(item);
    setSelectedVariant(item.variants?.[0]);
    setSelectedAddons([]);
    setQuantity(1);
  };

  const toggleAddon = (addon: MenuAddon) => {
    if (selectedAddons.some(a => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter(a => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const handleConfirmAddToCart = () => {
    if (!selectedItemForCustomization || !branch) return;

    const result = addToCart(
      selectedItemForCustomization,
      quantity,
      selectedVariant,
      selectedAddons,
      branch
    );

    if (result.success) {
      setToastMessage(`Added ${quantity}x ${selectedItemForCustomization.name} to cart!`);
      setTimeout(() => setToastMessage(null), 3000);
      setSelectedItemForCustomization(null);
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2">
          <Check className="w-5 h-5" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative h-64 sm:h-80 w-full bg-slate-900 overflow-hidden">
        <img 
          src={org.banner_url || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'} 
          alt={branch.branch_name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

        <div className="absolute top-6 left-4 sm:left-8">
          <Link
            href="/"
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Outlets</span>
          </Link>
        </div>

        {/* Floating Hotel Info */}
        <div className="absolute bottom-6 left-4 sm:left-8 right-4 sm:right-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {isPlatformOwned ? (
                <span className="inline-flex items-center gap-1 bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full text-xs font-extrabold shadow-sm">
                  <Sparkles className="w-3 h-3 fill-slate-950" />
                  <span>Platform-Owned Chain</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-emerald-500 text-white px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Partner Hotel</span>
                </span>
              )}
              <span className="text-xs text-slate-300 font-mono">FSSAI: {branch.fssai_license_number || '11518001000452'}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {branch.branch_name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
              <span>{branch.address_line}, {branch.city}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 text-center text-white">
              <div className="text-lg font-black text-emerald-400 flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-emerald-400" /> 4.8
              </div>
              <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">2,400+ Ratings</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 text-center text-white">
              <div className="text-lg font-black text-white">
                {branch.average_preparation_time_mins} mins
              </div>
              <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Avg Prep Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Chain Branch Switcher (for Multi-Branch Platform Chains) */}
      {siblingBranches.length > 1 && (
        <div className="bg-amber-50 border-b border-amber-200 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-amber-900 font-bold">
              <Building2 className="w-4 h-4 text-amber-700" />
              <span>Select Chain Branch for Pickup & Delivery:</span>
            </div>
            <div className="flex items-center gap-2">
              {siblingBranches.map(b => (
                <button
                  key={b.id}
                  onClick={() => router.push(`/restaurants/${b.slug}`)}
                  className={`text-xs px-3 py-1 rounded-lg font-semibold transition ${
                    b.id === branch.id
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  {b.branch_name.replace('Royal Heritage - ', '')}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Menu Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Menu Sections */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Kitchen Menu & Daily Specialities
                </h2>
                <p className="text-xs text-slate-500">
                  Prepared fresh upon order receipt by master chefs.
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {menuItems.length} Items Available
              </span>
            </div>

            <div className="space-y-4">
              {menuItems.map(item => {
                const isVeg = item.food_type === 'veg' || item.food_type === 'vegan';

                return (
                  <div
                    key={item.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition flex flex-col sm:flex-row justify-between gap-4"
                  >
                    <div className="flex-1">
                      {/* Veg/Non-Veg Symbol */}
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="p-0.5 rounded border border-slate-300 bg-white">
                          <div className={`w-2.5 h-2.5 rounded-full ${isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`}></div>
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          {item.food_type}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 mb-1">
                        {item.name}
                      </h3>

                      <div className="text-sm font-extrabold text-slate-900 mb-2">
                        {formatINR(item.base_price)}
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                        {item.description}
                      </p>

                      {/* Variants & Addons Pill indicators */}
                      {(item.variants && item.variants.length > 0) && (
                        <div className="mt-3 flex items-center gap-2 text-[11px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg w-fit border border-amber-200/60 font-medium">
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          <span>Portion sizes & add-ons customizable</span>
                        </div>
                      )}
                    </div>

                    {/* Image & Action */}
                    <div className="relative w-full sm:w-36 h-36 sm:h-32 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 self-center sm:self-auto">
                      <img 
                        src={item.image_url} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 right-2 flex justify-center">
                        <button
                          onClick={() => handleOpenCustomization(item)}
                          className="bg-white hover:bg-rose-600 hover:text-white text-rose-600 font-extrabold text-xs px-4 py-2 rounded-xl shadow-md border border-rose-200 hover:border-rose-600 transition active:scale-95 flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>ADD</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sticky Sidebar Cart Summary */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-28 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-rose-600" />
                  <span>Your Order</span>
                </h3>
                <span className="text-xs font-semibold text-slate-400 font-mono">
                  {cartItemCount} items
                </span>
              </div>

              {cart.items.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-xs">Your basket is currently empty.</p>
                  <p className="text-[11px] text-slate-400 mt-1">Select signature items from the menu.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-xs text-slate-500 font-medium">
                    Ordering from: <strong className="text-slate-800">{cart.restaurantName}</strong>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {cart.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs border-b border-slate-50 pb-2">
                        <div className="flex-1 mr-2">
                          <div className="font-semibold text-slate-800 line-clamp-1">{item.menuItem.name}</div>
                          {item.selectedVariant && (
                            <div className="text-[10px] text-slate-400">{item.selectedVariant.name}</div>
                          )}
                        </div>
                        <div className="font-mono font-bold text-slate-700 whitespace-nowrap">
                          {item.quantity} × {formatINR(item.subtotal / item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Item Subtotal:</span>
                      <span className="font-mono font-semibold">{formatINR(cartSubtotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Estimated Taxes (GST 5%):</span>
                      <span className="font-mono">{formatINR(cartSubtotal * 0.05)}</span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl text-center text-xs block shadow-sm transition active:scale-95"
                  >
                    Proceed to Checkout ({formatINR(cartSubtotal * 1.05 + 40 + branch.packaging_fee_base)})
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Item Customization Modal */}
      {selectedItemForCustomization && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="relative h-44 w-full bg-slate-100">
              <img 
                src={selectedItemForCustomization.image_url} 
                alt={selectedItemForCustomization.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedItemForCustomization(null)}
                className="absolute top-3 right-3 bg-white/80 hover:bg-white text-slate-700 p-1.5 rounded-full text-xs font-bold transition shadow-xs"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <h3 className="text-lg font-black text-slate-900 leading-snug">
                  {selectedItemForCustomization.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {selectedItemForCustomization.description}
                </p>
              </div>

              {/* Portion Variant Selection */}
              {selectedItemForCustomization.variants && selectedItemForCustomization.variants.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Select Portion Size
                  </div>
                  <div className="space-y-1.5">
                    {selectedItemForCustomization.variants.map(v => (
                      <label
                        key={v.id}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition ${
                          selectedVariant?.id === v.id
                            ? 'border-rose-600 bg-rose-50/50 font-bold text-rose-900'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input 
                            type="radio" 
                            name="variant" 
                            checked={selectedVariant?.id === v.id}
                            onChange={() => setSelectedVariant(v)}
                            className="text-rose-600 focus:ring-rose-500"
                          />
                          <span>{v.name}</span>
                        </div>
                        <span className="font-mono">
                          +{formatINR(v.price_differential)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Add-ons Checklist */}
              {selectedItemForCustomization.addons && selectedItemForCustomization.addons.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Recommended Add-ons
                  </div>
                  <div className="space-y-1.5">
                    {selectedItemForCustomization.addons.map(a => {
                      const isSelected = selectedAddons.some(addon => addon.id === a.id);
                      return (
                        <label
                          key={a.id}
                          className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition ${
                            isSelected
                              ? 'border-rose-600 bg-rose-50/50 font-bold text-rose-900'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input 
                              type="checkbox" 
                              checked={isSelected}
                              onChange={() => toggleAddon(a)}
                              className="text-rose-600 rounded focus:ring-rose-500"
                            />
                            <span>{a.name}</span>
                          </div>
                          <span className="font-mono">
                            +{formatINR(a.price)}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity selector */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-3 bg-slate-100 px-3 py-1.5 rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-slate-600 hover:text-rose-600 font-bold p-1"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-bold text-sm text-slate-900 w-4 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-slate-600 hover:text-rose-600 font-bold p-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleConfirmAddToCart}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-6 py-3 rounded-xl text-xs shadow-md transition active:scale-95"
                >
                  Add to Cart • {formatINR(
                    ((selectedItemForCustomization.base_price + (selectedVariant?.price_differential || 0)) +
                    selectedAddons.reduce((acc, a) => acc + a.price, 0)) * quantity
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Cart Bar on Mobile */}
      {cartItemCount > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 p-4 shadow-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-500 font-medium">
                {cartItemCount} items from {cart.restaurantName}
              </div>
              <div className="text-base font-black text-slate-900 font-mono">
                {formatINR(cartSubtotal)}
              </div>
            </div>
            <Link
              href="/checkout"
              className="bg-rose-600 text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2 shadow-md"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>View Cart</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

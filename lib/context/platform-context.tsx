'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, MenuVariant, MenuAddon, CartItem, SystemRole, Order, HotelBranch } from '../types';
import { platformStore } from '../services/mock-data';

interface CartState {
  items: CartItem[];
  branchId: string | null;
  organizationId: string | null;
  restaurantName: string | null;
}

interface PlatformContextType {
  currentRole: SystemRole;
  setCurrentRole: (role: SystemRole) => void;
  activeBranchId: string;
  setActiveBranchId: (branchId: string) => void;
  cart: CartState;
  addToCart: (
    item: MenuItem, 
    quantity: number, 
    variant?: MenuVariant, 
    addons?: MenuAddon[],
    branch?: HotelBranch
  ) => { success: boolean; error?: string };
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartItemCount: number;
  activeOrders: Order[];
  refreshData: () => void;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<SystemRole>('customer');
  const [activeBranchId, setActiveBranchId] = useState<string>('branch-rh-bandra');
  const [cart, setCart] = useState<CartState>({
    items: [],
    branchId: null,
    organizationId: null,
    restaurantName: null
  });
  const [activeOrders, setActiveOrders] = useState<Order[]>(platformStore.orders);

  const refreshData = () => {
    setActiveOrders([...platformStore.orders]);
  };

  const addToCart = (
    item: MenuItem, 
    quantity: number, 
    variant?: MenuVariant, 
    addons?: MenuAddon[],
    branch?: HotelBranch
  ) => {
    // Requirement 3: Maintain one restaurant per checkout order
    if (cart.branchId && branch && cart.branchId !== branch.id) {
      return {
        success: false,
        error: `Your cart contains items from ${cart.restaurantName}. Clear your cart to order from ${branch.branch_name}.`
      };
    }

    const unitPrice = item.base_price + (variant?.price_differential || 0);
    const addonsTotal = addons?.reduce((acc, a) => acc + a.price, 0) || 0;
    const subtotal = (unitPrice + addonsTotal) * quantity;

    const newItem: CartItem = {
      menuItem: item,
      quantity,
      selectedVariant: variant,
      selectedAddons: addons,
      subtotal
    };

    setCart(prev => ({
      items: [...prev.items, newItem],
      branchId: branch ? branch.id : prev.branchId,
      organizationId: branch ? branch.organization_id : prev.organizationId,
      restaurantName: branch ? branch.branch_name : prev.restaurantName
    }));

    return { success: true };
  };

  const removeFromCart = (index: number) => {
    setCart(prev => {
      const newItems = prev.items.filter((_, i) => i !== index);
      if (newItems.length === 0) {
        return { items: [], branchId: null, organizationId: null, restaurantName: null };
      }
      return { ...prev, items: newItems };
    });
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart(prev => {
      const newItems = [...prev.items];
      const item = newItems[index];
      const unitPrice = item.menuItem.base_price + (item.selectedVariant?.price_differential || 0);
      const addonsTotal = item.selectedAddons?.reduce((acc, a) => acc + a.price, 0) || 0;
      item.quantity = quantity;
      item.subtotal = (unitPrice + addonsTotal) * quantity;
      return { ...prev, items: newItems };
    });
  };

  const clearCart = () => {
    setCart({ items: [], branchId: null, organizationId: null, restaurantName: null });
  };

  const cartSubtotal = cart.items.reduce((acc, item) => acc + item.subtotal, 0);
  const cartItemCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <PlatformContext.Provider value={{
      currentRole,
      setCurrentRole,
      activeBranchId,
      setActiveBranchId,
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartSubtotal,
      cartItemCount,
      activeOrders,
      refreshData
    }}>
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
}

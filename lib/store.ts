export interface CartItem {
  id: string; // Generato o basato sul mix di taglia/logo
  productId: string;
  title: string;
  price: number;
  imageUrl: string;
  size?: string;
  customization?: {
    cuore?: string | null;
    destro?: string | null;
    retro?: string | null;
    vinylModel?: string | null;
  };
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isDrawerOpen: boolean;
  addItem: (item: Omit<CartItem, "id" | "quantity">) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  getCartTotal: () => number;
}

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      addItem: (newItem) => {
        set((state) => {
          // Creazione di un ID unico basato sul prodotto e le config scelte
          const customStr = newItem.customization
            ? `${newItem.customization.cuore || ''}-${newItem.customization.destro || ''}-${newItem.customization.retro || ''}-${newItem.customization.vinylModel || ''}`
            : '';
          const uniqueId = `${newItem.productId}-${newItem.size || 'base'}-${customStr}`;

          const existingItemIndex = state.items.findIndex(i => i.id === uniqueId);
          
          if (existingItemIndex >= 0) {
            // Se la stessa configurazione esiste già, aumenta solo la quantità
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += 1;
            return { items: updatedItems, isDrawerOpen: true };
          } else {
            // Altrimenti aggiungi un nuovo elemento
            return { 
              items: [...state.items, { ...newItem, id: uniqueId, quantity: 1 }],
              isDrawerOpen: true 
            };
          }
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      clearCart: () => set({ items: [] }),

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

      getCartTotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    {
      name: 'pizzaboynico-cart', // salva il carrello nel localStorage
      partialize: (state) => ({ items: state.items }), // non salvare lo stato isDrawerOpen
    }
  )
);

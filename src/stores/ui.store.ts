import { create } from 'zustand';

interface UIStore {
  cartOpen: boolean;
  searchOpen: boolean;
  menuOpen: boolean;
  compareList: string[];
  setCartOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setMenuOpen: (open: boolean) => void;
  toggleCompare: (productId: string) => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
  cartOpen: false,
  searchOpen: false,
  menuOpen: false,
  compareList: [],

  setCartOpen: (open) => set({ cartOpen: open }),
  setSearchOpen: (open) => set({ searchOpen: open }),
  setMenuOpen: (open) => set({ menuOpen: open }),

  toggleCompare: (productId) => {
    const list = get().compareList;
    if (list.includes(productId)) {
      set({ compareList: list.filter((id) => id !== productId) });
    } else if (list.length < 4) {
      set({ compareList: [...list, productId] });
    }
  },
}));

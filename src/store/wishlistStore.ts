import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WishlistItem } from '@/types'

interface WishlistStore {
  items: WishlistItem[]
  toggle: (item: WishlistItem) => void
  isWishlisted: (productId: string) => boolean
  remove: (productId: string) => void
  clear: () => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      toggle: (item) => {
        const exists = get().items.find(i => i.product_id === item.product_id)
        if (exists) {
          set(state => ({ items: state.items.filter(i => i.product_id !== item.product_id) }))
        } else {
          set(state => ({ items: [item, ...state.items] }))
        }
      },

      isWishlisted: (productId) =>
        get().items.some(i => i.product_id === productId),

      remove: (productId) =>
        set(state => ({ items: state.items.filter(i => i.product_id !== productId) })),

      clear: () => set({ items: [] }),
    }),
    {
      name: 'tryonx-wishlist',
    }
  )
)

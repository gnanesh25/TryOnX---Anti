import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/types'

// Install zustand
interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  subtotalPaise: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set(state => {
          const existing = state.items.find(i => i.id === item.id)
          if (existing) {
            return {
              items: state.items.map(i =>
                i.id === item.id
                  ? { ...i, quantity: Math.min(i.quantity + item.quantity, 10) }
                  : i
              ),
            }
          }
          return { items: [...state.items, item] }
        })
      },

      removeItem: (variantId) => {
        set(state => ({
          items: state.items.filter(i => i.id !== variantId),
        }))
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId)
          return
        }
        set(state => ({
          items: state.items.map(i =>
            i.id === variantId ? { ...i, quantity: Math.min(quantity, 10) } : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotalPaise: () =>
        get().items.reduce((sum, i) => sum + i.selling_price_paise * i.quantity, 0),
    }),
    {
      name: 'tryonx-cart',
    }
  )
)

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Global app store: persists queries and answers across navigation (and refresh)
export const useAppStore = create(persist((set, get) => ({
  queries: [],           // array of { id, text, ts }
  answers: [],           // array of { id, data, ts }

  addQuery: (text) => {
    const q = { id: crypto.randomUUID(), text, ts: Date.now() }
    set(state => ({ queries: [...state.queries, q] }))
    return q
  },

  addAnswer: (data) => {
    const a = { id: crypto.randomUUID(), data, ts: Date.now() }
    set(state => ({ answers: [...state.answers, a] }))
    return a
  },

  clear: () => set({ queries: [], answers: [] }),
}), {
  name: 'bodhasetu-app',
  partialize: (state) => ({ queries: state.queries, answers: state.answers })
}))

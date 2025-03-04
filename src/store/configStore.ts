import { BattleResult } from '@/types'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface ConfigState {
  battleHistory: BattleResult[]
  isConfigured: boolean

  // Actions
  addBattleResult: (result: BattleResult) => void
  clearBattleHistory: () => void
  resetConfig: () => void
}

const isWindowUndefined = typeof window === 'undefined'

/**
 * Store for managing API configuration and battle history
 * Uses localStorage for persistence when available
 */
export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      battleHistory: [],
      isConfigured: false,

      addBattleResult: (result) =>
        set((state) => ({
          battleHistory: [result, ...state.battleHistory].slice(0, 50), // Keep last 50 battles
        })),

      clearBattleHistory: () => set({ battleHistory: [] }),

      resetConfig: () =>
        set({
          isConfigured: false,
        }),
    }),
    {
      name: 'llm-evals-arena-config',
      partialize: (state) => ({
        battleHistory: state.battleHistory,
      }),
      storage: createJSONStorage(() => {
        // Use a conditional approach to handle localStorage
        if (isWindowUndefined) {
          // Provide a mock storage implementation for SSR
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          }
        }
        return localStorage
      }),
    }
  )
)

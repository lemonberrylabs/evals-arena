import { Provider } from '@/config/models'
import { ApiConfig, BattleResult } from '@/types'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface ConfigState {
  apiConfig: ApiConfig
  battleHistory: BattleResult[]
  isConfigured: boolean

  // Actions
  updateApiConfig: (config: Partial<ApiConfig>) => void
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
      apiConfig: {
        openaiApiKey: '',
        anthropicApiKey: '',
        googleApiKey: '',
        mistralApiKey: '',
        llamaApiKey: '',
        enabledProviders: [Provider.OPENAI], // Default to OpenAI enabled
      },
      battleHistory: [],
      isConfigured: false,

      updateApiConfig: (config) =>
        set((state) => {
          const newConfig = {
            ...state.apiConfig,
            ...config,
          }

          // Automatically determine if the configuration is valid
          const hasAnyKey = Object.entries(newConfig)
            .filter(([key]) => key.includes('ApiKey'))
            .some(([, value]) => value && value.length > 0)

          return {
            apiConfig: newConfig,
            isConfigured: hasAnyKey && newConfig.enabledProviders.length > 0,
          }
        }),

      addBattleResult: (result) =>
        set((state) => ({
          battleHistory: [result, ...state.battleHistory].slice(0, 50), // Keep last 50 battles
        })),

      clearBattleHistory: () => set({ battleHistory: [] }),

      resetConfig: () =>
        set({
          apiConfig: {
            openaiApiKey: '',
            anthropicApiKey: '',
            googleApiKey: '',
            mistralApiKey: '',
            llamaApiKey: '',
            enabledProviders: [Provider.OPENAI],
          },
          isConfigured: false,
        }),
    }),
    {
      name: 'llm-evals-arena-config',
      partialize: (state) => ({
        apiConfig: state.apiConfig,
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

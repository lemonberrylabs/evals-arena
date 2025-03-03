import { Provider } from '@/types'

/**
 * Environment configuration helper
 * Provides access to environment variables with defaults and type safety
 */
export const env = {
  // API Keys
  openaiApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  anthropicApiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || '',
  googleApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '',
  mistralApiKey: process.env.NEXT_PUBLIC_MISTRAL_API_KEY || '',
  cohereApiKey: process.env.NEXT_PUBLIC_COHERE_API_KEY || '',
  llamaApiKey: process.env.NEXT_PUBLIC_LLAMA_API_KEY || '',

  // Get the list of enabled providers from env or default to OpenAI
  get enabledProviders(): Provider[] {
    if (!process.env.NEXT_PUBLIC_ENABLED_PROVIDERS) {
      return [Provider.OPENAI]
    }

    return process.env.NEXT_PUBLIC_ENABLED_PROVIDERS.split(',')
      .map((provider) => provider.trim().toLowerCase())
      .filter((provider) => Object.values(Provider).includes(provider as Provider))
      .map((provider) => provider as Provider)
  },

  // Judge model
  judgeModel: process.env.NEXT_PUBLIC_JUDGE_MODEL || 'gpt-4o',

  // Check if we have at least one valid API key
  get isConfigured(): boolean {
    const hasOpenAI = !!this.openaiApiKey && this.enabledProviders.includes(Provider.OPENAI)
    const hasAnthropic = !!this.anthropicApiKey && this.enabledProviders.includes(Provider.ANTHROPIC)
    const hasGoogle = !!this.googleApiKey && this.enabledProviders.includes(Provider.GOOGLE)
    const hasMistral = !!this.mistralApiKey && this.enabledProviders.includes(Provider.MISTRAL)
    const hasCohere = !!this.cohereApiKey && this.enabledProviders.includes(Provider.COHERE)
    const hasLlama = !!this.llamaApiKey && this.enabledProviders.includes(Provider.LLAMA)

    return hasOpenAI || hasAnthropic || hasGoogle || hasMistral || hasCohere || hasLlama
  },

  // Get API config object
  get apiConfig() {
    return {
      openaiApiKey: this.openaiApiKey,
      anthropicApiKey: this.anthropicApiKey,
      googleApiKey: this.googleApiKey,
      mistralApiKey: this.mistralApiKey,
      cohereApiKey: this.cohereApiKey,
      llamaApiKey: this.llamaApiKey,
      enabledProviders: this.enabledProviders,
    }
  },
}

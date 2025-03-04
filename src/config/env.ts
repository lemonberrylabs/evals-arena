import { Provider } from '@/types'

/**
 * Environment configuration helper
 * Provides access to environment variables with defaults and type safety
 */
export const env = {
  // API Keys
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  googleApiKey: process.env.GOOGLE_API_KEY || '',
  mistralApiKey: process.env.MISTRAL_API_KEY || '',
  llamaApiKey: process.env.LLAMA_API_KEY || '',

  // Get the list of enabled providers from env or default to OpenAI
  get enabledProviders(): Provider[] {
    if (!process.env.NEXT_PUBLIC_ENABLED_PROVIDERS) {
      throw new Error('NEXT_PUBLIC_ENABLED_PROVIDERS is not set')
    }

    return process.env.NEXT_PUBLIC_ENABLED_PROVIDERS.split(',')
      .map((provider) => provider.trim().toLowerCase())
      .filter((provider) => Object.values(Provider).includes(provider as Provider))
      .map((provider) => provider as Provider)
  },

  // Judge model
  judgeModel: process.env.JUDGE_MODEL || 'gpt-4o',

  // Check if we have at least one valid API key
  get isConfigured(): boolean {
    const hasOpenAI = !!this.openaiApiKey && this.enabledProviders.includes(Provider.OPENAI)
    const hasAnthropic = !!this.anthropicApiKey && this.enabledProviders.includes(Provider.ANTHROPIC)
    const hasGoogle = !!this.googleApiKey && this.enabledProviders.includes(Provider.GOOGLE)
    const hasMistral = !!this.mistralApiKey && this.enabledProviders.includes(Provider.MISTRAL)
    const hasLlama = !!this.llamaApiKey && this.enabledProviders.includes(Provider.LLAMA)

    return hasOpenAI || hasAnthropic || hasGoogle || hasMistral || hasLlama
  },
}

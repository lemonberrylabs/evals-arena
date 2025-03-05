import { Model } from '@/types'
import OpenAI from 'openai'

// Supported LLM providers
export enum Provider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  GOOGLE = 'google',
  MISTRAL = 'mistral',
  LLAMA = 'llama',
}

export const defaultJudgeCriteria = `Please evaluate the responses based on the following criteria:
1. Correctness - How factually accurate is the response?
2. Completeness - How thoroughly does it address all aspects of the prompt?
3. Clarity - How clear and easy to understand is the response?
4. Creativity - Does the response show original thinking where appropriate?
5. Usefulness - How practical and helpful is the response?

Assign a score from 0-100 for each model.`

class ProviderConfigs {
  private judgeModel = process.env.JUDGE_MODEL || 'gpt-4o'

  private enabledProviders: Provider[] = (process.env.NEXT_PUBLIC_ENABLED_PROVIDERS || '')
    .split(',')
    .map((provider) => provider.trim().toLowerCase())
    .filter((provider) => Object.values(Provider).includes(provider as Provider))
    .map((provider) => provider as Provider)

  private configs: ProviderConfig[] = [
    {
      provider: Provider.OPENAI,
      style: 'bg-green-100 text-green-800',
      apiConfig: {
        apiKey: process.env.OPENAI_API_KEY || '',
        baseURL: 'https://api.openai.com/v1',
      },
      models: [
        {
          id: 'gpt-4o',
          name: 'GPT-4o',
          description: "OpenAI's most advanced model, optimized for both vision and language tasks.",
          capabilities: ['text generation', 'vision', 'reasoning', 'coding'],
          enabled: true,
        },
        {
          id: 'gpt-4-turbo',
          name: 'GPT-4 Turbo',
          description: 'Optimized version of GPT-4 with improved performance and lower latency.',
          capabilities: ['text generation', 'reasoning', 'coding'],
          enabled: true,
        },
        {
          id: 'gpt-3.5-turbo',
          name: 'GPT-3.5 Turbo',
          description: 'Fast and cost-effective model for general-purpose tasks.',
          capabilities: ['text generation', 'chat', 'simple reasoning'],
          enabled: true,
        },
      ],
    },
    {
      provider: Provider.ANTHROPIC,
      style: 'bg-purple-100 text-purple-800',
      apiConfig: {
        apiKey: process.env.ANTHROPIC_API_KEY || '',
        baseURL: 'https://api.anthropic.com/v1',
      },
      models: [
        {
          id: 'claude-3-5-haiku-20241022',
          name: 'Claude 3.5 Haiku',
          description: "Anthropic's most powerful model with advanced reasoning and comprehension.",
          capabilities: ['text generation', 'reasoning', 'coding', 'analysis'],
          enabled: true,
        },
        {
          id: 'claude-3-7-sonnet-20250219',
          name: 'Claude 3.7 Sonnet',
          description: 'A balanced model offering strong performance with lower latency.',
          capabilities: ['text generation', 'reasoning', 'coding'],
          enabled: true,
        },
        {
          id: 'claude-3-5-sonnet-20241022',
          name: 'Claude 3.5 Sonnet',
          description: 'A balanced model offering strong performance with lower latency.',
          capabilities: ['text generation', 'reasoning', 'coding'],
          enabled: true,
        },
      ],
    },
    {
      provider: Provider.GOOGLE,
      style: 'bg-blue-100 text-blue-800',
      apiConfig: {
        apiKey: process.env.GOOGLE_API_KEY || '',
        baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai',
      },
      models: [
        {
          id: 'gemini-1.5-pro',
          name: 'Gemini 1.5 Pro',
          description: "Google's advanced multimodal model.",
          capabilities: ['text generation', 'reasoning', 'multimodal'],
          enabled: true,
        },
        {
          id: 'gemini-2.0-flash',
          name: 'Gemini 2.0 Flash',
          description: 'Faster version of Gemini optimized for efficiency.',
          capabilities: ['text generation', 'chat'],
          enabled: true,
        },
      ],
    },
    {
      provider: Provider.MISTRAL,
      style: 'bg-cyan-100 text-cyan-800',
      apiConfig: {
        apiKey: process.env.MISTRAL_API_KEY || '',
        baseURL: 'https://api.mistral.ai/v1',
      },
      models: [
        {
          id: 'mistral-large',
          name: 'Mistral Large',
          description: "Mistral's flagship large language model.",
          capabilities: ['text generation', 'reasoning', 'coding'],
          enabled: true,
        },
        {
          id: 'mistral-medium',
          name: 'Mistral Medium',
          description: 'Balanced performance and efficiency.',
          capabilities: ['text generation', 'summarization', 'reasoning'],
          enabled: true,
        },
        {
          id: 'mistral-small',
          name: 'Mistral Small',
          description: 'Efficient model for straightforward tasks.',
          capabilities: ['text generation', 'chat'],
          enabled: true,
        },
      ],
    },
    {
      provider: Provider.LLAMA,
      style: 'bg-orange-100 text-orange-800',
      apiConfig: {
        apiKey: process.env.LLAMA_API_KEY || '',
        baseURL: 'https://api.llama-api.com',
      },
      models: [
        {
          id: 'llama-3-70b',
          name: 'Llama 3 70B',
          description: "Meta's largest open-source language model.",
          capabilities: ['text generation', 'reasoning', 'coding'],
          enabled: true,
        },
        {
          id: 'llama-3-8b',
          name: 'Llama 3 8B',
          description: 'Efficient and lightweight model for deployment.',
          capabilities: ['text generation', 'chat'],
          enabled: true,
        },
      ],
    },
  ]

  private providerByModel: Record<string, Provider> = this.configs.reduce(
    (acc, config) => {
      config.models.forEach((model) => {
        acc[model.id] = config.provider
      })
      return acc
    },
    {} as Record<string, Provider>
  )

  private configByProvider: Record<Provider, ProviderConfig> = this.configs.reduce(
    (acc, config) => {
      acc[config.provider] = config
      return acc
    },
    {} as Record<Provider, ProviderConfig>
  )

  // We have to initialize the clients to null, because otherwise they attempt to initialize in a browser environment.
  // In reality these are only accessed in server actions, so this is safe.
  private clients: Record<Provider, OpenAI | null> = this.configs.reduce(
    (acc, config) => {
      acc[config.provider] = null
      return acc
    },
    {} as Record<Provider, OpenAI | null>
  )

  isConfigured(): boolean {
    return Object.values(this.configByProvider).some(
      (config) => !!config.apiConfig.apiKey && config.models.some((model) => model.enabled)
    )
  }

  enabledModels(): Model[] {
    return this.enabledProviders
      .flatMap((provider) => this.configByProvider[provider].models)
      .filter((model) => model.enabled)
  }

  modelById(modelId: string): Model | null {
    return this.enabledModels().find((model) => model.id === modelId) || null
  }

  style(modelId: string): string {
    const provider = this.providerForModelId(modelId)

    if (!provider) {
      return 'bg-gray-100 text-gray-800'
    }

    return this.configByProvider[provider].style
  }

  providerForModelId(modelId: string): Provider {
    const provider = this.providerByModel[modelId]
    if (!provider) {
      throw new Error(`Provider for model ${modelId} not found`)
    }
    return provider
  }

  clientForModelId(modelId: string): OpenAI {
    let model: Model | undefined
    let provider: Provider | undefined
    for (const config of this.configs) {
      model = config.models.find((model) => model.id === modelId)
      if (model) {
        provider = config.provider
        break
      }
    }

    if (!model || !provider) {
      throw new Error(`Model ${modelId} not found`)
    }

    let client = this.clients[provider]

    if (!client) {
      const apiConfig = this.configByProvider[provider].apiConfig
      if (!apiConfig.apiKey) {
        throw new Error(`API key for provider ${provider} not found`)
      }
      client = new OpenAI(apiConfig)
      this.clients[provider] = client

      return client
    }

    return client
  }

  judge(): Judge {
    const model = this.modelById(this.judgeModel)
    if (!model) {
      throw new Error(`Judge model ${this.judgeModel} not found`)
    }

    const client = this.clientForModelId(this.judgeModel)

    return {
      client,
      model,
    }
  }
}

export const providers = new ProviderConfigs()

interface APIConfig {
  apiKey: string
  baseURL: string
}

interface ProviderConfig {
  provider: Provider
  style: string
  apiConfig: APIConfig
  models: Model[]
}

interface Judge {
  client: OpenAI
  model: Model
}

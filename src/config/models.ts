import { Model, Provider } from '@/types'

import { env } from './env'

/**
 * Available models for the LLM Evals Arena
 * This list can be modified or extended based on the models you want to support
 */
const availableModels: Model[] = [
  // OpenAI Models
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: Provider.OPENAI,
    description: "OpenAI's most advanced model, optimized for both vision and language tasks.",
    capabilities: ['text generation', 'vision', 'reasoning', 'coding'],
    enabled: true,
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: Provider.OPENAI,
    description: 'Optimized version of GPT-4 with improved performance and lower latency.',
    capabilities: ['text generation', 'reasoning', 'coding'],
    enabled: true,
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: Provider.OPENAI,
    description: 'Fast and cost-effective model for general-purpose tasks.',
    capabilities: ['text generation', 'chat', 'simple reasoning'],
    enabled: true,
  },

  // Anthropic Models
  {
    id: 'claude-3-5-haiku-20241022',
    name: 'Claude 3.5 Haiku',
    provider: Provider.ANTHROPIC,
    description: "Anthropic's most powerful model with advanced reasoning and comprehension.",
    capabilities: ['text generation', 'reasoning', 'coding', 'analysis'],
    enabled: true,
  },
  {
    id: 'claude-3-7-sonnet-20250219',
    name: 'Claude 3.7 Sonnet',
    provider: Provider.ANTHROPIC,
    description: 'A balanced model offering strong performance with lower latency.',
    capabilities: ['text generation', 'reasoning', 'coding'],
    enabled: true,
  },

  {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    provider: Provider.ANTHROPIC,
    description: 'A balanced model offering strong performance with lower latency.',
    capabilities: ['text generation', 'reasoning', 'coding'],
    enabled: true,
  },

  // Google Models
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: Provider.GOOGLE,
    description: "Google's advanced multimodal model.",
    capabilities: ['text generation', 'reasoning', 'multimodal'],
    enabled: true,
  },
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: Provider.GOOGLE,
    description: 'Faster version of Gemini optimized for efficiency.',
    capabilities: ['text generation', 'chat'],
    enabled: true,
  },

  // Mistral Models
  {
    id: 'mistral-large',
    name: 'Mistral Large',
    provider: Provider.MISTRAL,
    description: "Mistral's flagship large language model.",
    capabilities: ['text generation', 'reasoning', 'coding'],
    enabled: true,
  },
  {
    id: 'mistral-medium',
    name: 'Mistral Medium',
    provider: Provider.MISTRAL,
    description: 'Balanced performance and efficiency.',
    capabilities: ['text generation', 'summarization', 'reasoning'],
    enabled: true,
  },
  {
    id: 'mistral-small',
    name: 'Mistral Small',
    provider: Provider.MISTRAL,
    description: 'Efficient model for straightforward tasks.',
    capabilities: ['text generation', 'chat'],
    enabled: true,
  },

  // Llama Models
  {
    id: 'llama-3-70b',
    name: 'Llama 3 70B',
    provider: Provider.LLAMA,
    description: "Meta's largest open-source language model.",
    capabilities: ['text generation', 'reasoning', 'coding'],
    enabled: true,
  },
  {
    id: 'llama-3-8b',
    name: 'Llama 3 8B',
    provider: Provider.LLAMA,
    description: 'Efficient and lightweight model for deployment.',
    capabilities: ['text generation', 'chat'],
    enabled: true,
  },
]

export const endpoints: Record<Provider, string> = {
  [Provider.OPENAI]: 'https://api.openai.com/v1',
  [Provider.ANTHROPIC]: 'https://api.anthropic.com/v1',
  [Provider.GOOGLE]: 'https://generativelanguage.googleapis.com/v1beta/openai',
  [Provider.MISTRAL]: 'https://api.mistral.ai/v1',
  [Provider.LLAMA]: 'https://api.llama-api.com',
}

/**
 * Get models filtered by enabled status and provider
 */
export function getEnabledModels(): Model[] {
  const enabledProviders = new Set(env.enabledProviders)
  return availableModels.filter((model) => model.enabled && enabledProviders.has(model.provider))
}

/**
 * Get a model by its ID
 */
export function getModelById(modelId: string): Model | undefined {
  const enabledModels = getEnabledModels()
  return enabledModels.find((model) => model.id === modelId)
}

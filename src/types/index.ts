/**
 * Types for LLM Evals Arena
 */
import { Provider } from '@/config/models'

// LLM model configuration
export interface Model {
  id: string
  name: string
  description: string
  capabilities: string[]
  enabled: boolean
}

// Battle setup form data
export interface BattleSetup {
  developerPrompt?: string
  userPrompt: string
  judgeCriteria?: string
  selectedModels: string[]
}

export interface BattleResponse {
  modelResponses: ModelResponse[]
  judgeEvaluation: JudgeEvaluation[]
}

// Model response in a battle
export interface ModelResponse {
  modelId: string
  modelName: string
  provider: Provider
  response: string
  responseTime: number
  tokenUsage?: {
    input: number
    output: number
    total: number
  }
  error?: string
}

// Judge's evaluation result for a single model
export interface JudgeEvaluation {
  modelId: string
  score: number
  reasoning: string
}

// Complete battle result
export interface BattleResult {
  id: string
  timestamp: number
  battleSetup: BattleSetup
  modelResponses: ModelResponse[]
  judgeEvaluation: JudgeEvaluation[]
  winner: {
    modelId: string
    modelName: string
    provider: Provider
    score: number
  }
}

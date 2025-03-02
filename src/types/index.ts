/**
 * Types for LLM Evals Arena
 */

// Supported LLM providers
export enum Provider {
    OPENAI = 'openai',
    ANTHROPIC = 'anthropic',
    GOOGLE = 'google',
    MISTRAL = 'mistral',
    COHERE = 'cohere',
    LLAMA = 'llama',
}

// LLM model configuration
export interface Model {
    id: string;
    name: string;
    provider: Provider;
    description: string;
    capabilities: string[];
    enabled: boolean;
}

// Configuration for API keys and enabled providers
export interface ApiConfig {
    openaiApiKey?: string;
    anthropicApiKey?: string;
    googleApiKey?: string;
    mistralApiKey?: string;
    cohereApiKey?: string;
    llamaApiKey?: string;
    enabledProviders: Provider[];
}

// Battle setup form data
export interface BattleSetup {
    developerPrompt: string;
    userPrompt: string;
    judgeCriteria: string;
    selectedModels: string[];
}

// Model response in a battle
export interface ModelResponse {
    modelId: string;
    modelName: string;
    provider: Provider;
    response: string;
    responseTime: number;
    tokenUsage?: {
        input: number;
        output: number;
        total: number;
    };
}

// Judge's evaluation result for a single model
export interface JudgeEvaluation {
    modelId: string;
    score: number;
    reasoning: string;
}

// Complete battle result
export interface BattleResult {
    id: string;
    timestamp: number;
    battleSetup: BattleSetup;
    modelResponses: ModelResponse[];
    judgeEvaluation: JudgeEvaluation[];
    winner: {
        modelId: string;
        modelName: string;
        provider: Provider;
        score: number;
    };
}

// History of past battles
export interface BattleHistory {
    battles: BattleResult[];
}
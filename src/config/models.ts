import { Model, Provider } from "@/types";
import { env } from "@/config/env";

/**
 * Available models for the LLM Evals Arena
 * This list can be modified or extended based on the models you want to support
 */
export const availableModels: Model[] = [
    // OpenAI Models
    {
        id: "gpt-4o",
        name: "GPT-4o",
        provider: Provider.OPENAI,
        description: "OpenAI's most advanced model, optimized for both vision and language tasks.",
        capabilities: ["text generation", "vision", "reasoning", "coding"],
        enabled: true,
    },
    {
        id: "gpt-4-turbo",
        name: "GPT-4 Turbo",
        provider: Provider.OPENAI,
        description: "Optimized version of GPT-4 with improved performance and lower latency.",
        capabilities: ["text generation", "reasoning", "coding"],
        enabled: true,
    },
    {
        id: "gpt-3.5-turbo",
        name: "GPT-3.5 Turbo",
        provider: Provider.OPENAI,
        description: "Fast and cost-effective model for general-purpose tasks.",
        capabilities: ["text generation", "chat", "simple reasoning"],
        enabled: true,
    },

    // Anthropic Models
    {
        id: "claude-3-opus",
        name: "Claude 3 Opus",
        provider: Provider.ANTHROPIC,
        description: "Anthropic's most powerful model with advanced reasoning and comprehension.",
        capabilities: ["text generation", "reasoning", "coding", "analysis"],
        enabled: true,
    },
    {
        id: "claude-3-sonnet",
        name: "Claude 3 Sonnet",
        provider: Provider.ANTHROPIC,
        description: "A balanced model offering strong performance with lower latency.",
        capabilities: ["text generation", "reasoning", "coding"],
        enabled: true,
    },
    {
        id: "claude-3-haiku",
        name: "Claude 3 Haiku",
        provider: Provider.ANTHROPIC,
        description: "Fast and efficient model for simpler tasks.",
        capabilities: ["text generation", "chat", "summarization"],
        enabled: true,
    },

    // Google Models
    {
        id: "gemini-1.5-pro",
        name: "Gemini 1.5 Pro",
        provider: Provider.GOOGLE,
        description: "Google's advanced multimodal model.",
        capabilities: ["text generation", "reasoning", "multimodal"],
        enabled: true,
    },
    {
        id: "gemini-1.5-flash",
        name: "Gemini 1.5 Flash",
        provider: Provider.GOOGLE,
        description: "Faster version of Gemini optimized for efficiency.",
        capabilities: ["text generation", "chat"],
        enabled: true,
    },

    // Mistral Models
    {
        id: "mistral-large",
        name: "Mistral Large",
        provider: Provider.MISTRAL,
        description: "Mistral's flagship large language model.",
        capabilities: ["text generation", "reasoning", "coding"],
        enabled: true,
    },
    {
        id: "mistral-medium",
        name: "Mistral Medium",
        provider: Provider.MISTRAL,
        description: "Balanced performance and efficiency.",
        capabilities: ["text generation", "summarization", "reasoning"],
        enabled: true,
    },
    {
        id: "mistral-small",
        name: "Mistral Small",
        provider: Provider.MISTRAL,
        description: "Efficient model for straightforward tasks.",
        capabilities: ["text generation", "chat"],
        enabled: true,
    },

    // Cohere Models
    {
        id: "cohere-command",
        name: "Cohere Command",
        provider: Provider.COHERE,
        description: "Cohere's powerful model for enterprise applications.",
        capabilities: ["text generation", "reasoning", "enterprise"],
        enabled: true,
    },

    // Llama Models
    {
        id: "llama-3-70b",
        name: "Llama 3 70B",
        provider: Provider.LLAMA,
        description: "Meta's largest open-source language model.",
        capabilities: ["text generation", "reasoning", "coding"],
        enabled: true,
    },
    {
        id: "llama-3-8b",
        name: "Llama 3 8B",
        provider: Provider.LLAMA,
        description: "Efficient and lightweight model for deployment.",
        capabilities: ["text generation", "chat"],
        enabled: true,
    },
];

/**
 * Default judge model (used for evaluating responses)
 */
export const defaultJudgeModel = env.judgeModel || "gpt-4o";

/**
 * Get models filtered by enabled status and provider
 */
export function getEnabledModels(): Model[] {
    return availableModels.filter(
        (model) => model.enabled && env.enabledProviders.includes(model.provider)
    );
}

/**
 * Get a model by its ID
 */
export function getModelById(modelId: string): Model | undefined {
    return availableModels.find((model) => model.id === modelId);
}
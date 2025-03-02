declare namespace NodeJS {
    interface ProcessEnv {
        NEXT_PUBLIC_OPENAI_API_KEY?: string;
        NEXT_PUBLIC_ANTHROPIC_API_KEY?: string;
        NEXT_PUBLIC_GOOGLE_API_KEY?: string;
        NEXT_PUBLIC_MISTRAL_API_KEY?: string;
        NEXT_PUBLIC_COHERE_API_KEY?: string;
        NEXT_PUBLIC_LLAMA_API_KEY?: string;
        NEXT_PUBLIC_ENABLED_PROVIDERS?: string;
        NEXT_PUBLIC_JUDGE_MODEL?: string;
    }
}
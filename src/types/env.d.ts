declare namespace NodeJS {
  interface ProcessEnv {
    OPENAI_API_KEY?: string
    ANTHROPIC_API_KEY?: string
    GOOGLE_API_KEY?: string
    MISTRAL_API_KEY?: string
    LLAMA_API_KEY?: string
    NEXT_PUBLIC_ENABLED_PROVIDERS?: string
    JUDGE_MODEL?: string
  }
}

# Environment Configuration for LLM Evals Arena

This document explains how to set up your environment variables for the LLM Evals Arena application.

## Setup Instructions

1. Create a file named `.env.local` in the root directory of the project.
2. Add your API keys and configuration settings as shown below.
3. Restart the development server if it's already running.

## Environment Variables

Copy the template below and replace the placeholder values with your actual API keys:

```
# API Keys for LLM providers
NEXT_PUBLIC_OPENAI_API_KEY=your-openai-api-key
NEXT_PUBLIC_ANTHROPIC_API_KEY=your-anthropic-api-key
NEXT_PUBLIC_GOOGLE_API_KEY=your-google-api-key
NEXT_PUBLIC_MISTRAL_API_KEY=your-mistral-api-key
NEXT_PUBLIC_COHERE_API_KEY=your-cohere-api-key
NEXT_PUBLIC_LLAMA_API_KEY=your-llama-api-key

# Enabled providers (comma-separated list)
# Options: openai,anthropic,google,mistral,cohere,llama
NEXT_PUBLIC_ENABLED_PROVIDERS=openai,anthropic

# Judge model configuration
NEXT_PUBLIC_JUDGE_MODEL=gpt-4o
```

## Required Variables

At minimum, you need:
1. At least one API key for any of the supported providers
2. The corresponding provider(s) enabled in `NEXT_PUBLIC_ENABLED_PROVIDERS`

## Security Note

The variables are prefixed with `NEXT_PUBLIC_` because they are accessed from the client-side code. In a production environment, you should:

1. Use a backend service to handle API requests
2. Keep sensitive keys on the server side only
3. Consider using environment-specific variables (.env.development, .env.production)

## Getting API Keys

- **OpenAI**: [https://platform.openai.com/account/api-keys](https://platform.openai.com/account/api-keys)
- **Anthropic**: [https://console.anthropic.com/](https://console.anthropic.com/)
- **Google (Gemini)**: [https://ai.google.dev/](https://ai.google.dev/)
- **Mistral**: [https://console.mistral.ai/](https://console.mistral.ai/)
- **Cohere**: [https://dashboard.cohere.com/api-keys](https://dashboard.cohere.com/api-keys)
- **Llama**: Contact Meta AI for access

## Troubleshooting

If you encounter issues with the environment variables:

1. Make sure the `.env.local` file is in the root directory
2. Verify that you've restarted the dev server after creating/modifying the file
3. Check for any typos in variable names
4. Ensure API keys are valid and not expired
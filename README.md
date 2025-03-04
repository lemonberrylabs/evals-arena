# LLM Evals Arena

[![CI](https://github.com/lemonberrylabs/evals-arena/actions/workflows/ci.yml/badge.svg)](https://github.com/lemonberrylabs/evals-arena/actions/workflows/ci.yml)

An open-source platform for evaluating and comparing different language models in head-to-head battles.

## Features

- **Battle Arena**: Test the same prompt across multiple LLM models simultaneously
- **Custom Evaluation**: Define your own judging criteria for comparing responses
- **Multiple Providers**: Support for OpenAI, Anthropic, Google, Mistral, and Llama models
- **Battle History**: Save and review past evaluations
- **Environment-based Configuration**: Configure API keys via environment variables
- **Beautiful UI**: Modern, responsive interface with battle theme
- **Open Source**: Free to use, modify, and contribute

## Getting Started

### Prerequisites

- Node.js 22.x or higher
- yarn
- API keys for at least one of the supported LLM providers

### Installation

1. Clone the repository:

```bash
git clone https://github.com/lemonberrylabs/evals-arena
cd llm-evals-arena
```

2. Install dependencies:

```bash
yarn install
```

3. Set up your environment variables:

Create a `.env.local` file in the project root with your API keys (see [ENV_SETUP.md](ENV_SETUP.md) for details).

```
OPENAI_API_KEY=your-openai-api-key
NEXT_PUBLIC_ENABLED_PROVIDERS=openai
```

4. Start the development server:

```bash
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Configuration

See [ENV_SETUP.md](ENV_SETUP.md) for complete details on configuring the application with environment variables.

## Usage

### Creating a Battle

1. Enter a user prompt - the task or question you want to test
2. (Optional) Add developer instructions - system instructions for the models
3. Define judging criteria - how responses should be evaluated
4. Select models to participate in the battle
5. Click "Battle" to start the evaluation

### Viewing Results

- See all model responses side by side
- Review the judge's evaluation and scoring
- See which model won based on the criteria
- Save results for future reference

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [React Hook Form](https://react-hook-form.com/) - Form handling
- [Zod](https://github.com/colinhacks/zod) - Schema validation
- [Lucide Icons](https://lucide.dev/) - Beautiful icons

## Adding a custom LLM provider

**In [`src/config/models.ts`](src/config/models.ts)**:

All of the configuration for supported providers should be centralized in [`src/config/models.ts`](src/config/models.ts). 
If you are considering adding a new provider, make sure that no other files are affected.

1. Add the provider to the `Provider` enum
2. Add the provider config to the `configs` array and include at least one model config.
3. Make sure to follow naming conventions.
4. Update [README.md](README.md) and [ENV_SETUP.md](ENV_SETUP.md) to reflect the new provider.

**Note**:

Currently the code assumes that all providers support the OpenAI compatible API as we are using an `OpenAI` client implementation.
If you are adding a provider that does not support the OpenAI compatible API, you you will need to abstract the API calls for all providers.

## Security Considerations

This application is designed for local development and educational purposes. In its current state:

- API keys are stored in environment variables that are not exposed to the client
- For production use, consider implementing a backend API gateway to proxy requests

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the need for better tools to compare LLM performance
- Thanks to all the LLM providers for their amazing models
- Built with ❤️ by lemonberry labs for the open-source community

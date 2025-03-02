import { BattleSetup, ModelResponse, JudgeEvaluation, Provider, ApiConfig} from '@/types';
import {getModelById} from '@/config/models';
import {env} from '@/config/env';
import OpenAI from 'openai';

function createLLMClient(provider: Provider) {
    switch (provider) {
        case Provider.OPENAI:
            if (!env.openaiApiKey) throw new Error('OpenAI API key not configured');
            return new OpenAI({
                apiKey: env.openaiApiKey,
                dangerouslyAllowBrowser: true // Allow browser usage - warning: this exposes API keys in frontend code
            });

        // For demo purposes, we'll use the OpenAI client for all providers
        // In a real implementation, you would use the appropriate client for each provider
        case Provider.ANTHROPIC:
            if (!env.anthropicApiKey) throw new Error('Anthropic API key not configured');
            return new OpenAI({
                apiKey: env.anthropicApiKey,
                baseURL: 'https://api.anthropic.com/v1',
                dangerouslyAllowBrowser: true
            });

        case Provider.GOOGLE:
            if (!env.googleApiKey) throw new Error('Google API key not configured');
            return new OpenAI({
                apiKey: env.googleApiKey,
                baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
                dangerouslyAllowBrowser: true
            });

        case Provider.MISTRAL:
            if (!env.mistralApiKey) throw new Error('Mistral API key not configured');
            return new OpenAI({
                apiKey: env.mistralApiKey,
                baseURL: 'https://api.mistral.ai/v1',
                dangerouslyAllowBrowser: true
            });

        case Provider.COHERE:
            if (!env.cohereApiKey) throw new Error('Cohere API key not configured');
            return new OpenAI({
                apiKey: env.cohereApiKey,
                baseURL: 'https://api.cohere.ai/compatibility/v1',
                dangerouslyAllowBrowser: true
            });

        case Provider.LLAMA:
            if (!env.llamaApiKey) throw new Error('Llama API key not configured');
            return new OpenAI({
                apiKey: env.llamaApiKey,
                baseURL: 'https://api.llama-api.com',
                dangerouslyAllowBrowser: true
            });

        default:
            throw new Error(`Unsupported provider: ${provider}`);
    }
}

/**
 * Generates a model response for a given prompt
 */
export async function generateModelResponse(
    modelId: string,
    developerPrompt: string,
    userPrompt: string
): Promise<ModelResponse> {
    const model = getModelById(modelId);
    if (!model) {
        throw new Error(`Model not found: ${modelId}`);
    }

    const provider = model.provider;
    const startTime = Date.now();

    try {
        const client = createLLMClient(provider);

        // For demo purposes, all requests go through OpenAI-like interface
        // In a real implementation, you would use the appropriate client API for each provider
        const completion = await client.chat.completions.create({
            model: modelId,
            messages: [
                {
                    role: 'system',
                    content: developerPrompt || 'You are a helpful assistant.'
                },
                {
                    role: 'user',
                    content: userPrompt
                }
            ],
            temperature: 0.7,
        });

        const endTime = Date.now();
        const responseTime = endTime - startTime;

        return {
            modelId,
            modelName: model.name,
            provider,
            response: completion.choices[0]?.message.content || 'No response generated',
            responseTime,
            tokenUsage: {
                input: completion.usage?.prompt_tokens || 0,
                output: completion.usage?.completion_tokens || 0,
                total: completion.usage?.total_tokens || 0,
            }
        };
    } catch (error: any) {
        console.error(`Error generating response from ${model.name}:`, error);

        // Return a failure response
        return {
            modelId,
            modelName: model.name,
            provider,
            response: `Error: ${error.message || 'Unknown error occurred'}`,
            responseTime: Date.now() - startTime,
        };
    }
}

/**
 * Judges multiple model responses using a judging model (default: GPT-4o)
 */
export async function judgeResponses(
    battleSetup: BattleSetup,
    modelResponses: ModelResponse[]
): Promise<JudgeEvaluation[]> {
    if (!env.openaiApiKey) {
        throw new Error('OpenAI API key required for judging');
    }

    try {
        const client = new OpenAI({
            apiKey: env.openaiApiKey,
            dangerouslyAllowBrowser: true // Allow browser usage
        });

        // Construct the judging prompt
        const judgingPrompt = `
# Judge Evaluation Task

## Original User Prompt
${battleSetup.userPrompt}

## Judging Criteria
${battleSetup.judgeCriteria}

## Model Responses to Evaluate

${modelResponses.map((resp, index) => `
### Model ${index + 1}: ${resp.modelName}
\`\`\`
${resp.response}
\`\`\`
`).join('\n')}

# Instructions
Evaluate each model's response based on the judging criteria.
Assign a score from 0-100 for each model, with higher scores indicating better responses.
Provide brief reasoning for each score.
Be fair and objective in your evaluation.

# Output Format
Return a JSON array with each model evaluation in this format:
[
  {
    "modelId": "model-id-1",
    "score": 85,
    "reasoning": "Brief explanation of score"
  },
  ...
]
`;

        const completion = await client.chat.completions.create({
            model: env.judgeModel,
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert judge of language model outputs. Your task is to fairly evaluate responses from different language models based on specific criteria.'
                },
                {
                    role: 'user',
                    content: judgingPrompt
                }
            ],
            temperature: 0.3,
            response_format: {type: 'json_object'},
        });

        const responseText = completion.choices[0]?.message.content || '[]';
        console.log("Judge response:", responseText);

        try {
            // Extract the JSON array from the response
            const json = JSON.parse(responseText);
            const results = Array.isArray(json) ? json : (json.evaluations || []);

            console.log("Final evaluations:", results);
            return results;
        } catch (e) {
            console.error('Error parsing judge response:', e);
            // Create default evaluations as fallback
            const defaultEvaluations = modelResponses.map(response => ({
                modelId: response.modelId,
                score: 50,
                reasoning: "Error processing judge response. Default evaluation provided."
            }));
            console.log("Using default evaluations due to error:", defaultEvaluations);
            return defaultEvaluations;
        }
    } catch (error: any) {
        console.error('Error in judging responses:', error);
        throw new Error(`Judging error: ${error.message || 'Unknown error'}`);
    }
}

/**
 * Runs a complete battle with the given setup
 */
export async function runBattle(
    battleSetup: BattleSetup, onProgress: (progress: number) => void): Promise<{
    modelResponses: ModelResponse[];
    judgeEvaluation: JudgeEvaluation[];
}> {
    try {
        // Step 1: Generate responses from all selected models
        const modelResponses: ModelResponse[] = [];
        let completedModels = 0;

        // Use Promise.all for parallel processing
        await Promise.all(
            battleSetup.selectedModels.map(async (modelId) => {
                try {
                    const response = await generateModelResponse(
                        modelId,
                        battleSetup.developerPrompt,
                        battleSetup.userPrompt
                    );

                    modelResponses.push(response);
                    completedModels++;
                    onProgress((completedModels / battleSetup.selectedModels.length) * 80); // First 80% of progress
                } catch (error) {
                    console.error(`Error generating response for model ${modelId}:`, error);
                    const model = getModelById(modelId);
                    if (model) {
                        modelResponses.push({
                            modelId,
                            modelName: model.name,
                            provider: model.provider,
                            response: `Error: Failed to generate response from this model.`,
                            responseTime: 0,
                        });
                    }
                    completedModels++;
                    onProgress((completedModels / battleSetup.selectedModels.length) * 80);
                }
            })
        );

        // Update progress
        onProgress(80);

        // Step 2: Judge the responses
        const judgeEvaluation = await judgeResponses(
            battleSetup,
            modelResponses
        );

        // Complete progress
        onProgress(100);

        return {
            modelResponses,
            judgeEvaluation,
        };
    } catch (error: any) {
        console.error('Error running battle:', error);
        throw new Error(`Battle error: ${error.message || 'Unknown error occurred'}`);
    }
}
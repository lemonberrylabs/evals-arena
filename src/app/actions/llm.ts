'use server'

import { env } from '@/config/env'
import { endpoints, getModelById } from '@/config/models'
import { BattleSetup, JudgeEvaluation, ModelResponse, Provider } from '@/types'
import OpenAI from 'openai'
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs'

/**
 * Generates a model response for a given prompt
 */
export async function generateModelResponse(
  modelId: string,
  developerPrompt: string,
  userPrompt: string
): Promise<ModelResponse> {
  const model = getModelById(modelId)
  if (!model) {
    throw new Error(`Model not found: ${modelId}`)
  }

  const provider = model.provider
  const startTime = Date.now()

  const messages: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: developerPrompt || 'You are a helpful assistant.',
    },
    {
      role: 'user',
      content: userPrompt,
    },
  ]

  try {
    // Call the proxy API
    const completion = await callLLMAPI({ modelId, messages })

    const endTime = Date.now()
    const responseTime = endTime - startTime

    return {
      modelId,
      modelName: model.name,
      provider,
      response: completion.choices[0]?.message.content || 'No response generated',
      responseTime,
      tokenUsage: completion.usage
        ? {
            input: completion.usage.prompt_tokens,
            output: completion.usage.completion_tokens,
            total: completion.usage.total_tokens,
          }
        : undefined,
    }
  } catch (error) {
    console.error(`Error generating response from ${model.name}:`, error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

    // Return a failure response
    return {
      modelId,
      modelName: model.name,
      provider,
      response: `Error: ${errorMessage}`,
      responseTime: Date.now() - startTime,
      error: errorMessage,
    }
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
    throw new Error('OpenAI API key required for judging')
  }

  const successResponses = modelResponses.filter((resp) => !resp.error)

  try {
    const client = clientForModelId(env.judgeModel)

    // Construct the judging prompt
    const judgingPrompt = `
  # Judge Evaluation Task
  
  ## Original User Prompt
  ${battleSetup.userPrompt}
  
  ## Judging Criteria
  ${battleSetup.judgeCriteria}
  
  ## Model Responses to Evaluate
  
  ${successResponses
    .map(
      (resp, index) => `
  ### Model ${index + 1}: ${resp.modelName}
  \`\`\`
  ${resp.response}
  \`\`\`
  `
    )
    .join('\n')}
  
  # Instructions
  Evaluate each model's response based on the judging criteria.
  Assign a score from 0-100 for each model, with higher scores indicating better responses.
  Provide brief reasoning for each score.
  Be fair and objective in your evaluation.
  
  # Output Format
  Return a JSON array with each model evaluation in this format, even if there is only one model:
  [
    {
      "modelId": "model-id-1",
      "score": 85,
      "reasoning": "Brief explanation of score"
    },
    ...
  ]
  `

    const completion = await client.chat.completions.create({
      model: env.judgeModel,
      messages: [
        {
          role: 'system',
          content:
            'You are an expert judge of language model outputs. Your task is to fairly evaluate responses from different language models based on specific criteria.',
        },
        {
          role: 'user',
          content: judgingPrompt,
        },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    })

    const responseText = completion.choices[0]?.message.content || '[]'
    console.log('Judge response:', responseText)

    try {
      // Extract the JSON array from the response
      const json = JSON.parse(responseText)
      const results = Array.isArray(json) ? json : json.evaluations ? json.evaluations : json.modelId ? [json] : []

      console.log('Final evaluations:', results)
      return results
    } catch (e) {
      console.error('Error parsing judge response:', e)
      // Create default evaluations as fallback
      const defaultEvaluations = successResponses.map((response) => ({
        modelId: response.modelId,
        score: 50,
        reasoning: 'Error processing judge response. Default evaluation provided.',
      }))
      console.log('Using default evaluations due to error:', defaultEvaluations)
      return defaultEvaluations
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error in judging responses:', msg)
    throw new Error(`Judging error: ${msg}`)
  }
}

async function callLLMAPI(params: { modelId: string; messages: ChatCompletionMessageParam[] }) {
  const { modelId, messages } = params

  const client = clientForModelId(modelId)

  return await client.chat.completions.create({
    model: modelId,
    messages,
  })
}

function clientForModelId(modelId: string) {
  const model = getModelById(modelId)
  if (!model) {
    throw new Error(`Model not found: ${modelId}`)
  }

  const { endpoint, apiKey } = getApiConfig(model.provider)
  return new OpenAI({
    apiKey,
    baseURL: endpoint,
  })
}

function getApiConfig(provider: Provider) {
  switch (provider) {
    case Provider.OPENAI:
      return {
        endpoint: endpoints[Provider.OPENAI],
        apiKey: env.openaiApiKey,
      }
    case Provider.ANTHROPIC:
      return {
        endpoint: endpoints[Provider.ANTHROPIC],
        apiKey: env.anthropicApiKey,
      }
    case Provider.GOOGLE:
      return {
        endpoint: endpoints[Provider.GOOGLE],
        apiKey: env.googleApiKey,
      }
    case Provider.MISTRAL:
      return {
        endpoint: endpoints[Provider.MISTRAL],
        apiKey: env.mistralApiKey,
      }
    case Provider.COHERE:
      return {
        endpoint: endpoints[Provider.COHERE],
        apiKey: env.cohereApiKey,
      }
    case Provider.LLAMA:
      return {
        endpoint: endpoints[Provider.LLAMA],
        apiKey: env.llamaApiKey,
      }
  }
}

import { generateModelResponse, judgeResponses } from '@/app/actions/llm'
import { getModelById } from '@/config/models'
import { BattleSetup, JudgeEvaluation, ModelResponse } from '@/types'

/**
 * Runs a complete battle with the given setup
 */
export async function runBattle(
  battleSetup: BattleSetup,
  onProgress: (progress: number) => void
): Promise<{
  modelResponses: ModelResponse[]
  judgeEvaluation: JudgeEvaluation[]
}> {
  try {
    // Step 1: Generate responses from all selected models
    const modelResponses: ModelResponse[] = []
    let completedModels = 0

    // Use Promise.all for parallel processing
    await Promise.all(
      battleSetup.selectedModels.map(async (modelId) => {
        try {
          const response = await generateModelResponse(
            modelId,
            battleSetup.developerPrompt || '',
            battleSetup.userPrompt
          )

          modelResponses.push(response)
          completedModels++
          onProgress((completedModels / battleSetup.selectedModels.length) * 80) // First 80% of progress
        } catch (error) {
          console.error(`Error generating response for model ${modelId}:`, error)
          const model = getModelById(modelId)
          if (model) {
            modelResponses.push({
              modelId,
              modelName: model.name,
              provider: model.provider,
              response: `Error: Failed to generate response from this model.`,
              responseTime: 0,
            })
          }
          completedModels++
          onProgress((completedModels / battleSetup.selectedModels.length) * 80)
        }
      })
    )

    // Update progress
    onProgress(80)

    // Step 2: Judge the responses
    const judgeEvaluation = await judgeResponses(battleSetup, modelResponses)

    // Complete progress
    onProgress(100)

    return {
      modelResponses,
      judgeEvaluation,
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error running battle:', msg)
    throw new Error(`Battle error: ${msg}`)
  }
}

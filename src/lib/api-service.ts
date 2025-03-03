import { generateModelResponse, judgeResponses } from '@/app/actions/llm'
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
    let completedModels = 0

    // Use Promise.all for parallel processing
    const modelResponses = await Promise.all(
      battleSetup.selectedModels.map(async (modelId) => {
        const response = await generateModelResponse(modelId, battleSetup.developerPrompt || '', battleSetup.userPrompt)

        completedModels++
        onProgress((completedModels / battleSetup.selectedModels.length) * 80) // First 80% of progress
        return response
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

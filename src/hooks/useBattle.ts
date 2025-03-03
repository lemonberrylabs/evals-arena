import { runBattle } from '@/lib/api-service'
import { useBattleStore } from '@/store/battleStore'
import { useConfigStore } from '@/store/configStore'
import { BattleSetup } from '@/types'

import { useCallback } from 'react'

/**
 * Hook for managing battle execution
 */
export function useBattle() {
  const {
    initBattle,
    setBattleStatus,
    setModelResponses,
    setJudgeEvaluation,
    setProgress,
    setError,
    getCurrentBattleResult,
  } = useBattleStore()

  const addBattleToHistory = useConfigStore((state) => state.addBattleResult)

  /**
   * Start a new battle with the given setup
   */
  const startBattle = useCallback(
    async (battleSetup: BattleSetup) => {
      try {
        // Initialize battle state
        initBattle(battleSetup)
        setBattleStatus('in-progress')

        // Run the battle
        const { modelResponses, judgeEvaluation } = await runBattle(battleSetup, (progress) => {
          setProgress(progress)
        })

        // Update battle state with results
        setModelResponses(modelResponses)
        setJudgeEvaluation(judgeEvaluation)

        // Set battle as complete - this triggers the UI to show results
        setBattleStatus('complete')

        // Debug logging
        console.log('Battle complete!', { modelResponses, judgeEvaluation })

        // Add to history
        const battleResult = getCurrentBattleResult()
        if (battleResult) {
          console.log('Adding battle to history:', battleResult)
          addBattleToHistory(battleResult)
        } else {
          console.error('Failed to get current battle result')
        }

        return { success: true }
      } catch (error: unknown) {
        console.error('Battle error:', error)
        const msg = error instanceof Error ? error.message : 'An unexpected error occurred'
        setError(msg)
        setBattleStatus('error')
        return { success: false, error: msg }
      }
    },
    [
      initBattle,
      setBattleStatus,
      setModelResponses,
      setJudgeEvaluation,
      setProgress,
      setError,
      getCurrentBattleResult,
      addBattleToHistory,
    ]
  )

  return {
    startBattle,
  }
}

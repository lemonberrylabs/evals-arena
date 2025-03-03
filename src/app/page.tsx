'use client'

import { BattleForm } from '@/components/forms/BattleForm'
import { BattleResults } from '@/components/ui/BattleResults'
import { useBattle } from '@/hooks/useBattle'
import { useBattleStore } from '@/store/battleStore'
import { BattleResult, BattleSetup } from '@/types'
import { Sword } from 'lucide-react'

import { useState } from 'react'

export default function HomePage() {
  const { startBattle } = useBattle()
  const { status, getCurrentBattleResult, resetBattle } = useBattleStore()

  const [selectedHistoryBattle, setSelectedHistoryBattle] = useState<BattleResult | null>(null)

  const handleSubmit = async (battleSetup: BattleSetup) => {
    await startBattle(battleSetup)
  }

  const handleReset = () => {
    resetBattle()
    setSelectedHistoryBattle(null)
  }

  // Get the current battle result (if available)
  const currentBattleResult = getCurrentBattleResult()
  console.log('Current battle status:', status)
  console.log('Current battle result:', currentBattleResult)

  // Determine which battle result to display (current or from history)
  const battleToDisplay = selectedHistoryBattle || currentBattleResult

  // Show configuration warning if not configured

  return (
    <div className="max-w-4xl mx-auto">
      {status === 'complete' && battleToDisplay ? (
        <BattleResults battleResult={battleToDisplay} onReset={handleReset} />
      ) : (
        <>
          <div className="mb-8 text-center">
            <div className="bg-gradient-to-r from-amber-500 to-red-600 p-3 rounded-full inline-block mb-4">
              <Sword className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">LLM Battle Arena</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Set up a battle between different LLM models. Define your task, select the models to compete, and let the
              judge decide which one performs best.
            </p>
          </div>

          {status === 'in-progress' && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md text-blue-800">
              <p className="font-medium">Battle in progress...</p>
              <p className="text-sm mt-1">Requesting responses and evaluating models. This may take a minute.</p>
              <div className="w-full bg-blue-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${useBattleStore.getState().progress}%` }}
                ></div>
              </div>
            </div>
          )}

          <BattleForm onSubmit={handleSubmit} isLoading={status === 'in-progress'} />

          {status === 'error' && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
              <p className="font-medium">Error running battle</p>
              <p className="text-sm mt-1">Please check your API configuration and try again.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

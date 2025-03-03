'use client'

import { BattleForm } from '@/components/forms/BattleForm'
import { BattleResults } from '@/components/ui/BattleResults'
import { Layout } from '@/components/ui/Layout'
import { SecurityWarning } from '@/components/ui/SecurityWarning'
import { env } from '@/config/env'
import { useBattle } from '@/hooks/useBattle'
import { useBattleStore } from '@/store/battleStore'
import { BattleSetup, BattleResult } from '@/types'
import { Sword, AlertTriangle } from 'lucide-react'

import React, { useState } from 'react'

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
  if (!env.isConfigured) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-amber-800">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 mr-3 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-lg font-semibold mb-2">API Configuration Required</h2>
                <p className="mb-4">
                  To use the LLM Evals Arena, you need to configure at least one API key in your environment variables.
                  Please check the ENV_SETUP.md file for instructions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {status === 'complete' && battleToDisplay ? (
          <BattleResults battleResult={battleToDisplay} onReset={handleReset} />
        ) : (
          <>
            <SecurityWarning />

            <div className="mb-8 text-center">
              <div className="bg-gradient-to-r from-amber-500 to-red-600 p-3 rounded-full inline-block mb-4">
                <Sword className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-2">LLM Battle Arena</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Set up a battle between different LLM models. Define your task, select the models to compete, and let
                the judge decide which one performs best.
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
    </Layout>
  )
}

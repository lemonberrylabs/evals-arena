import { runBattle } from '@/lib/api-service'
import { BattleSetup } from '@/types'

export async function POST(req: Request) {
  const battleSetup = await req.json()
  const { userPrompt, selectedModels } = battleSetup as BattleSetup
  // Validate required fields
  if (!userPrompt) {
    return new Response('userPrompt is required', { status: 400 })
  }

  if (!selectedModels?.length) {
    return new Response('selectedModels is required', { status: 400 })
  }

  try {
    const battleResponse = await runBattle(battleSetup, () => {})
    return Response.json(battleResponse, { status: 200 })
  } catch (error) {
    console.error('Error running battle:', error)
    const msg = error instanceof Error ? error.message : 'Internal server error'
    return Response.json({ error: msg }, { status: 500 })
  }
}

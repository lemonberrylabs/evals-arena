// src/app/api/llm/route.ts
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { modelId, messages, endpoint, apiKey } = body

    const key = apiKey

    if (!key) {
      return NextResponse.json({ error: 'No API key provided' }, { status: 400 })
    }

    const openai = new OpenAI({
      apiKey: key,
      baseURL: endpoint,
      dangerouslyAllowBrowser: false, // Not needed in server context
    })

    const completion = await openai.chat.completions.create({
      model: modelId,
      messages,
    })

    return NextResponse.json(completion)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

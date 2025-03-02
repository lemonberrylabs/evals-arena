// src/app/api/llm/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { model, messages, endpoint, apiKey } = body;

        // Use the provided API key or fall back to environment variable
        const key = apiKey || process.env.OPENAI_API_KEY;

        if (!key) {
            return NextResponse.json(
                { error: 'No API key provided' },
                { status: 400 }
            );
        }

        const openai = new OpenAI({
            apiKey: key,
            baseURL: endpoint || undefined, // Use custom endpoint if provided
            dangerouslyAllowBrowser: false // Not needed in server context
        });

        const completion = await openai.chat.completions.create({
            model,
            messages,
        });

        return NextResponse.json(completion);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

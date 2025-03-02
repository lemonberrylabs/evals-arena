import { NextRequest, NextResponse } from 'next/server';
import { runBattle } from '@/lib/api-service';
import { BattleSetup, ApiConfig } from '@/types';
import { z } from 'zod';

// Schema for request validation
const evaluateSchema = z.object({
    battleSetup: z.object({
        developerPrompt: z.string(),
        userPrompt: z.string().min(1, 'User prompt is required'),
        judgeCriteria: z.string().min(1, 'Judge criteria is required'),
        selectedModels: z.array(z.string()).min(2, 'Select at least 2 models'),
    }),
    apiConfig: z.object({
        openaiApiKey: z.string().optional(),
        anthropicApiKey: z.string().optional(),
        googleApiKey: z.string().optional(),
        mistralApiKey: z.string().optional(),
        cohereApiKey: z.string().optional(),
        llamaApiKey: z.string().optional(),
        enabledProviders: z.array(z.string()),
    }),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate request body
        const result = evaluateSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: 'Invalid request data', details: result.error.format() },
                { status: 400 }
            );
        }

        const { battleSetup, apiConfig } = body as {
            battleSetup: BattleSetup;
            apiConfig: ApiConfig;
        };

        // Run the battle
        const battleResult = await runBattle(
            battleSetup,
            () => {} // Progress callback (not used in API route)
        );

        return NextResponse.json(battleResult);
    } catch (error: any) {
        console.error('API route error:', error);
        return NextResponse.json(
            { error: error.message || 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
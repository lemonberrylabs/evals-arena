import { create } from 'zustand';
import { BattleSetup, ModelResponse, JudgeEvaluation, BattleResult } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { useConfigStore } from './configStore';

type BattleStatus = 'idle' | 'preparing' | 'in-progress' | 'judging' | 'complete' | 'error';

interface BattleState {
    // Current battle state
    currentBattleId: string;
    battleSetup: BattleSetup;
    status: BattleStatus;
    progress: number; // 0-100%
    modelResponses: ModelResponse[];
    judgeEvaluation: JudgeEvaluation[];
    error: string | null;

    // Actions
    initBattle: (setup: BattleSetup) => void;
    setBattleStatus: (status: BattleStatus) => void;
    addModelResponse: (response: ModelResponse) => void;
    setModelResponses: (responses: ModelResponse[]) => void;
    setJudgeEvaluation: (evaluation: JudgeEvaluation[]) => void;
    setProgress: (progress: number) => void;
    setError: (error: string | null) => void;
    resetBattle: () => void;

    // Computed
    getCurrentBattleResult: () => BattleResult | null;
    getWinner: () => ModelResponse | null;
}

export const useBattleStore = create<BattleState>()((set, get) => ({
    currentBattleId: '',
    battleSetup: {
        developerPrompt: '',
        userPrompt: '',
        judgeCriteria: '',
        selectedModels: [],
    },
    status: 'idle',
    progress: 0,
    modelResponses: [],
    judgeEvaluation: [],
    error: null,

    initBattle: (setup) => set({
        currentBattleId: uuidv4 ? uuidv4() : 'battle-' + Date.now(),
        battleSetup: setup,
        status: 'preparing',
        progress: 0,
        modelResponses: [],
        judgeEvaluation: [],
        error: null,
    }),

    setBattleStatus: (status) => set({ status }),

    addModelResponse: (response) => set((state) => ({
        modelResponses: [...state.modelResponses, response],
        progress: (state.modelResponses.length + 1) / state.battleSetup.selectedModels.length * 100
    })),

    setModelResponses: (responses) => set({ modelResponses: responses }),

    setJudgeEvaluation: (evaluation) => set({ judgeEvaluation: evaluation }),

    setProgress: (progress) => set({ progress }),

    setError: (error) => set({ error, status: error ? 'error' : get().status }),

    resetBattle: () => set({
        currentBattleId: '',
        battleSetup: {
            developerPrompt: '',
            userPrompt: '',
            judgeCriteria: '',
            selectedModels: [],
        },
        status: 'idle',
        progress: 0,
        modelResponses: [],
        judgeEvaluation: [],
        error: null,
    }),

    /**
     * Constructs a complete battle result from the current state
     */
    getCurrentBattleResult: () => {
        const state = get();

        console.log("Getting current battle result, state:", {
            status: state.status,
            modelResponses: state.modelResponses.length,
            judgeEvaluation: state.judgeEvaluation.length
        });

        if (state.status !== 'complete') {
            console.log("Battle not complete yet, status:", state.status);
            return null;
        }

        // Ensure we have evaluation results
        if (!state.judgeEvaluation.length) {
            console.error("No judge evaluations available");
            return null;
        }

        // Find the winner based on judge scores
        const winnerEval = [...state.judgeEvaluation].sort((a, b) => b.score - a.score)[0];

        if (!winnerEval) {
            console.error("No winner evaluation found");
            return null;
        }

        let winnerResponse = state.modelResponses.find(r => r.modelId === winnerEval.modelId);

        if (!winnerResponse) {
            winnerResponse = state.modelResponses.find(r => r.modelName === winnerEval.modelId);
            if (!winnerResponse) {
                console.error("No matching response found for winner:", winnerEval.modelId);
                return null;
            }
        }

        const result = {
            id: state.currentBattleId,
            timestamp: Date.now(),
            battleSetup: state.battleSetup,
            modelResponses: state.modelResponses,
            judgeEvaluation: state.judgeEvaluation,
            winner: {
                modelId: winnerResponse.modelId,
                modelName: winnerResponse.modelName,
                provider: winnerResponse.provider,
                score: winnerEval.score,
            }
        };

        console.log("Constructed battle result:", result);
        return result;
    },

    /**
     * Get the winning model response based on judge evaluation
     */
    getWinner: () => {
        const state = get();

        if (!state.judgeEvaluation.length) return null;

        // Find highest score
        const winnerEval = [...state.judgeEvaluation].sort((a, b) => b.score - a.score)[0];

        if (!winnerEval) return null;

        return state.modelResponses.find(r => r.modelId === winnerEval.modelId) || null;
    }
}));
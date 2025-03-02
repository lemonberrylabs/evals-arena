import { useCallback } from 'react';
import { useConfigStore } from '@/store/configStore';
import { useBattleStore } from '@/store/battleStore';
import { BattleSetup } from '@/types';
import { runBattle } from '@/lib/api-service';

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
    } = useBattleStore();

    const addBattleToHistory = useConfigStore((state) => state.addBattleResult);

    /**
     * Start a new battle with the given setup
     */
    const startBattle = useCallback(
        async (battleSetup: BattleSetup) => {
            try {
                // Initialize battle state
                initBattle(battleSetup);
                setBattleStatus('in-progress');

                // Run the battle
                const { modelResponses, judgeEvaluation } = await runBattle(
                    battleSetup,
                    (progress) => {
                        setProgress(progress);
                    }
                );

                // Update battle state with results
                setModelResponses(modelResponses);
                setJudgeEvaluation(judgeEvaluation);
                setBattleStatus('complete');

                // Add to history
                const battleResult = getCurrentBattleResult();
                if (battleResult) {
                    addBattleToHistory(battleResult);
                }

                return { success: true };
            } catch (error: any) {
                console.error('Battle error:', error);
                setError(error.message || 'An unexpected error occurred');
                setBattleStatus('error');
                return { success: false, error: error.message };
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
    );

    return {
        startBattle,
    };
}
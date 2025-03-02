import React from 'react';
import { BattleResult, ModelResponse, JudgeEvaluation } from '@/types';
import { ModelResponseCard } from '@/components/ui/ModelResponseCard';
import { formatDate } from '@/lib/utils';
import { Trophy, RotateCcw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BattleResultsProps {
    battleResult: BattleResult;
    onReset: () => void;
}

export function BattleResults({ battleResult, onReset }: BattleResultsProps) {
    const {
        timestamp,
        battleSetup,
        modelResponses,
        judgeEvaluation,
        winner
    } = battleResult;

    // Sort responses by score (highest first)
    const sortedResponses = [...modelResponses].sort((a, b) => {
        // Using evaluation instead of eval to avoid reserved word
        const scoreA = judgeEvaluation.find(evaluation => evaluation.modelId === a.modelId)?.score || 0;
        const scoreB = judgeEvaluation.find(evaluation => evaluation.modelId === b.modelId)?.score || 0;
        return scoreB - scoreA;
    });

    // Find evaluations for each model
    const getEvaluation = (modelId: string): JudgeEvaluation | undefined => {
        return judgeEvaluation.find(evaluation => evaluation.modelId === modelId);
    };

    return (
        <div className="space-y-6">
            {/* Battle header */}
            <div className="rounded-lg bg-gradient-to-r from-amber-50 to-red-50 p-6 border border-amber-200">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-amber-900 flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-amber-500" />
                            Battle Results
                        </h2>
                        <p className="text-amber-800 mt-1">{formatDate(timestamp)}</p>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={onReset}>
                            <RotateCcw className="w-4 h-4 mr-1" /> New Battle
                        </Button>
                    </div>
                </div>

                {/* Winner section */}
                <div className="mt-4 bg-amber-100 p-4 rounded-md border border-amber-200">
                    <div className="flex items-center gap-2 text-amber-900 font-medium mb-2">
                        <Trophy className="w-4 h-4 text-amber-600" />
                        Winner: {winner.modelName} ({winner.score}/100)
                    </div>
                    <p className="text-sm text-amber-800">
                        {getEvaluation(winner.modelId)?.reasoning || 'No reasoning provided'}
                    </p>
                </div>
            </div>

            {/* Original prompt */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Battle Configuration</h3>

                <div className="space-y-4">
                    {battleSetup.developerPrompt && (
                        <div>
                            <h4 className="text-sm font-medium text-gray-700">Developer Prompt</h4>
                            <div className="mt-1 p-3 bg-gray-50 rounded border border-gray-100 text-sm whitespace-pre-wrap">
                                {battleSetup.developerPrompt}
                            </div>
                        </div>
                    )}

                    <div>
                        <h4 className="text-sm font-medium text-gray-700">User Prompt</h4>
                        <div className="mt-1 p-3 bg-gray-50 rounded border border-gray-100 text-sm whitespace-pre-wrap">
                            {battleSetup.userPrompt}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-gray-700">Judge Criteria</h4>
                        <div className="mt-1 p-3 bg-gray-50 rounded border border-gray-100 text-sm whitespace-pre-wrap">
                            {battleSetup.judgeCriteria}
                        </div>
                    </div>
                </div>
            </div>

            {/* Model responses */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Model Responses</h3>

                <div className="space-y-6">
                    {sortedResponses.map((response, index) => (
                        <ModelResponseCard
                            key={response.modelId}
                            modelResponse={response}
                            judgeEvaluation={getEvaluation(response.modelId)}
                            isWinner={response.modelId === winner.modelId}
                            rank={index + 1}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
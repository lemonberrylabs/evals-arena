"use client";

import React, { useState } from 'react';
import { Layout } from '@/components/ui/Layout';
import { BattleHistory } from '@/components/ui/BattleHistory';
import { BattleResults } from '@/components/ui/BattleResults';
import { BattleResult } from '@/types';
import { History, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HistoryPage() {
    const [selectedBattle, setSelectedBattle] = useState<BattleResult | null>(null);

    const handleSelectBattle = (battle: BattleResult) => {
        setSelectedBattle(battle);
        window.scrollTo(0, 0);
    };

    const handleBack = () => {
        setSelectedBattle(null);
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto">
                {selectedBattle ? (
                    <>
                        <div className="mb-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleBack}
                            >
                                <ArrowLeft className="w-4 h-4 mr-1" /> Back to History
                            </Button>
                        </div>

                        <BattleResults battleResult={selectedBattle} onReset={handleBack} />
                    </>
                ) : (
                    <>
                        <div className="mb-8 text-center">
                            <div className="bg-gradient-to-r from-amber-500 to-red-600 p-3 rounded-full inline-block mb-4">
                                <History className="h-8 w-8 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold mb-2">Battle History</h1>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                View past battles, compare different models, and see which one performed best.
                            </p>
                        </div>

                        <BattleHistory onSelectBattle={handleSelectBattle} />
                    </>
                )}
            </div>
        </Layout>
    );
}
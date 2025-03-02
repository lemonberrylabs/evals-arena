import React, { useState } from 'react';
import { useConfigStore } from '@/store/configStore';
import { BattleResult } from '@/types';
import { formatDate, getProviderBgColor, truncateText } from '@/lib/utils';
import { Trophy, ArrowRight, Trash2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BattleHistoryProps {
    onSelectBattle: (battle: BattleResult) => void;
}

export function BattleHistory({ onSelectBattle }: BattleHistoryProps) {
    const { battleHistory, clearBattleHistory } = useConfigStore();
    const [searchTerm, setSearchTerm] = useState('');

    // Filter battles based on search term
    const filteredBattles = searchTerm
        ? battleHistory.filter(
            battle =>
                battle.battleSetup.userPrompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                battle.winner.modelName.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : battleHistory;

    const handleClearHistory = () => {
        if (window.confirm('Are you sure you want to clear all battle history? This cannot be undone.')) {
            clearBattleHistory();
        }
    };

    if (battleHistory.length === 0) {
        return (
            <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-500">No battles recorded yet. Start a battle to see results here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Battle History</h2>

                <div className="flex gap-2 items-center">
                    <input
                        type="text"
                        placeholder="Search battles..."
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearHistory}
                        className="text-red-600 hover:bg-red-50"
                    >
                        <Trash2 size={14} className="mr-1" /> Clear
                    </Button>
                </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Prompt
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Winner
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Models
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBattles.map((battle) => (
                        <tr key={battle.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Clock size={14} />
                                    <span>{formatDate(battle.timestamp)}</span>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-800">
                                {truncateText(battle.battleSetup.userPrompt, 80)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                    <Trophy size={14} className="text-amber-500" />
                                    <span className="font-medium">{battle.winner.modelName}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${getProviderBgColor(battle.winner.provider)}`}>
                      {battle.winner.provider}
                    </span>
                                </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {battle.modelResponses.length} models
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onSelectBattle(battle)}
                                >
                                    View <ArrowRight size={14} className="ml-1" />
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {filteredBattles.length === 0 && searchTerm && (
                <div className="text-center py-4 text-gray-500">
                    No battles found matching "{searchTerm}"
                </div>
            )}
        </div>
    );
}
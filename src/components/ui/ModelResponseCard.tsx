import React, { useState } from 'react';
import { ModelResponse, JudgeEvaluation } from '@/types';
import { formatResponseTime, getProviderBgColor, getProviderColor } from '@/lib/utils';
import { Clock, Award, ChevronsDown, ChevronsUp, Copy, CheckCircle2 } from 'lucide-react';

interface ModelResponseCardProps {
    modelResponse: ModelResponse;
    judgeEvaluation?: JudgeEvaluation;
    isWinner?: boolean;
    rank?: number;
}

export function ModelResponseCard({
                                      modelResponse,
                                      judgeEvaluation,
                                      isWinner = false,
                                      rank,
                                  }: ModelResponseCardProps) {
    const [expanded, setExpanded] = useState(false);
    const [copied, setCopied] = useState(false);

    const providerColor = getProviderColor(modelResponse.provider);
    const providerBgColor = getProviderBgColor(modelResponse.provider);

    const handleCopy = () => {
        navigator.clipboard.writeText(modelResponse.response);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={`
      border rounded-lg overflow-hidden transition-all
      ${isWinner ? 'border-amber-500 shadow-md shadow-amber-100' : 'border-gray-200'}
    `}>
            {/* Header */}
            <div className={`p-4 ${isWinner ? 'bg-gradient-to-r from-amber-50 to-amber-100' : 'bg-white'}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {rank && (
                            <div className={`
                w-6 h-6 rounded-full inline-flex items-center justify-center text-sm font-semibold
                ${rank === 1 ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'}
              `}>
                                {rank}
                            </div>
                        )}
                        <h3 className="font-medium">{modelResponse.modelName}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${providerBgColor}`}>
              {modelResponse.provider}
            </span>
                        {isWinner && (
                            <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full flex items-center gap-1">
                <Award className="w-3 h-3" /> Winner
              </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
            <span className="text-xs flex items-center gap-1 text-gray-500">
              <Clock className="w-3 h-3" /> {formatResponseTime(modelResponse.responseTime)}
            </span>

                        {judgeEvaluation && (
                            <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded-full">
                Score: {judgeEvaluation.score}/100
              </span>
                        )}
                    </div>
                </div>

                {judgeEvaluation && (
                    <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                        <p><strong>Judge:</strong> {judgeEvaluation.reasoning}</p>
                    </div>
                )}
            </div>

            {/* Response content */}
            <div className="p-4 bg-gray-50 border-t border-gray-100">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-gray-700">Response</h4>
                    <div className="flex gap-2">
                        <button
                            onClick={handleCopy}
                            className="text-gray-500 hover:text-gray-700"
                            title="Copy response"
                        >
                            {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="text-gray-500 hover:text-gray-700"
                            title={expanded ? "Collapse" : "Expand"}
                        >
                            {expanded ? <ChevronsUp className="w-4 h-4" /> : <ChevronsDown className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <div className={`prose prose-sm max-w-none ${!expanded ? 'max-h-64 overflow-y-hidden' : ''}`}>
                    <div className="whitespace-pre-wrap">
                        {modelResponse.response}
                    </div>
                </div>

                {!expanded && (
                    <div className="relative -mt-8 pt-8 pb-2 text-center">
                        <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-t from-gray-50 to-transparent"></div>
                        <button
                            onClick={() => setExpanded(true)}
                            className="text-sm text-gray-500 hover:text-gray-800"
                        >
                            Show more <ChevronsDown className="w-4 h-4 inline" />
                        </button>
                    </div>
                )}

                {/* Token usage */}
                {modelResponse.tokenUsage && (
                    <div className="mt-4 pt-2 border-t border-gray-200 flex gap-4 text-xs text-gray-500">
                        <span>Input: {modelResponse.tokenUsage.input} tokens</span>
                        <span>Output: {modelResponse.tokenUsage.output} tokens</span>
                        <span>Total: {modelResponse.tokenUsage.total} tokens</span>
                    </div>
                )}
            </div>
        </div>
    );
}
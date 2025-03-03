import { getEnabledModels } from '@/config/models'
import { getProviderBgColor, cn } from '@/lib/utils'
import { Model } from '@/types'

import React from 'react'

interface ModelSelectionProps {
  selectedModels: string[]
  onChange: (selectedModels: string[]) => void
}

export function ModelSelection({ selectedModels, onChange }: ModelSelectionProps) {
  // Get all enabled models based on the environment configuration
  const enabledModels = getEnabledModels()

  const toggleModel = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      onChange(selectedModels.filter((id) => id !== modelId))
    } else {
      onChange([...selectedModels, modelId])
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold mb-2">Select Combatants</h3>
        <span className="text-sm text-gray-500">
          {selectedModels.length} of {enabledModels.length} selected
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {enabledModels.map((model) => (
          <ModelCard
            key={model.id}
            model={model}
            isSelected={selectedModels.includes(model.id)}
            onToggle={() => toggleModel(model.id)}
          />
        ))}
      </div>

      {enabledModels.length === 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
          <p>No models available. Please check your environment configuration and API keys.</p>
        </div>
      )}
    </div>
  )
}

interface ModelCardProps {
  model: Model
  isSelected: boolean
  onToggle: () => void
}

function ModelCard({ model, isSelected, onToggle }: ModelCardProps) {
  const providerClass = getProviderBgColor(model.provider)

  return (
    <div
      className={cn(
        'p-4 border rounded-lg transition-all cursor-pointer hover:shadow-md',
        isSelected ? 'border-red-500 bg-red-50 shadow-sm' : 'border-gray-200 bg-white'
      )}
      onClick={onToggle}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium">{model.name}</h4>
        <span className={cn('text-xs px-2 py-1 rounded-full', providerClass)}>{model.provider}</span>
      </div>

      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{model.description}</p>

      <div className="flex flex-wrap gap-1 mt-1">
        {model.capabilities.slice(0, 3).map((capability) => (
          <span key={capability} className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">
            {capability}
          </span>
        ))}
        {model.capabilities.length > 3 && (
          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">
            +{model.capabilities.length - 3}
          </span>
        )}
      </div>
    </div>
  )
}

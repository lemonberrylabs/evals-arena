import { Button } from '@/components/ui/button'
import { useConfigStore } from '@/store/configStore'
import { Provider } from '@/types'
import { Eye, EyeOff, Save, RefreshCw } from 'lucide-react'

import React, { useState } from 'react'

export function ApiConfigForm() {
  const { apiConfig, updateApiConfig, resetConfig } = useConfigStore()
  const [showApiKeys, setShowApiKeys] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const toggleProvider = (provider: Provider) => {
    const enabledProviders = apiConfig.enabledProviders.includes(provider)
      ? apiConfig.enabledProviders.filter((p) => p !== provider)
      : [...apiConfig.enabledProviders, provider]

    updateApiConfig({ enabledProviders })
  }

  const handleSave = () => {
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all API configurations?')) {
      resetConfig()
    }
  }

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">API Configuration</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setShowApiKeys(!showApiKeys)}
            title={showApiKeys ? 'Hide API Keys' : 'Show API Keys'}
          >
            {showApiKeys ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-600">
        Configure API keys for the LLM providers you want to use. Enable or disable providers as needed.
      </p>

      <div className="space-y-4">
        {/* OpenAI */}
        <div className="p-4 border rounded-md">
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                checked={apiConfig.enabledProviders.includes(Provider.OPENAI)}
                onChange={() => toggleProvider(Provider.OPENAI)}
              />
              <span className="ml-2 font-medium">OpenAI</span>
            </label>
            <div className="text-xs text-gray-500">Models: GPT-4o, GPT-4-Turbo, GPT-3.5-Turbo</div>
          </div>

          <div className="mt-2">
            <input
              type={showApiKeys ? 'text' : 'password'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="OpenAI API Key"
              value={apiConfig.openaiApiKey || ''}
              onChange={(e) => updateApiConfig({ openaiApiKey: e.target.value })}
            />
          </div>
        </div>

        {/* Anthropic */}
        <div className="p-4 border rounded-md">
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                checked={apiConfig.enabledProviders.includes(Provider.ANTHROPIC)}
                onChange={() => toggleProvider(Provider.ANTHROPIC)}
              />
              <span className="ml-2 font-medium">Anthropic</span>
            </label>
            <div className="text-xs text-gray-500">Models: Claude 3 Opus, Claude 3 Sonnet, Claude 3 Haiku</div>
          </div>

          <div className="mt-2">
            <input
              type={showApiKeys ? 'text' : 'password'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="Anthropic API Key"
              value={apiConfig.anthropicApiKey || ''}
              onChange={(e) => updateApiConfig({ anthropicApiKey: e.target.value })}
            />
          </div>
        </div>

        {/* Google */}
        <div className="p-4 border rounded-md">
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                checked={apiConfig.enabledProviders.includes(Provider.GOOGLE)}
                onChange={() => toggleProvider(Provider.GOOGLE)}
              />
              <span className="ml-2 font-medium">Google</span>
            </label>
            <div className="text-xs text-gray-500">Models: Gemini 1.5 Pro, Gemini 1.5 Flash</div>
          </div>

          <div className="mt-2">
            <input
              type={showApiKeys ? 'text' : 'password'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="Google API Key"
              value={apiConfig.googleApiKey || ''}
              onChange={(e) => updateApiConfig({ googleApiKey: e.target.value })}
            />
          </div>
        </div>

        {/* Mistral */}
        <div className="p-4 border rounded-md">
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                checked={apiConfig.enabledProviders.includes(Provider.MISTRAL)}
                onChange={() => toggleProvider(Provider.MISTRAL)}
              />
              <span className="ml-2 font-medium">Mistral</span>
            </label>
            <div className="text-xs text-gray-500">Models: Mistral Large, Mistral Medium, Mistral Small</div>
          </div>

          <div className="mt-2">
            <input
              type={showApiKeys ? 'text' : 'password'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="Mistral API Key"
              value={apiConfig.mistralApiKey || ''}
              onChange={(e) => updateApiConfig({ mistralApiKey: e.target.value })}
            />
          </div>
        </div>

        {/* Llama */}
        <div className="p-4 border rounded-md">
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                checked={apiConfig.enabledProviders.includes(Provider.LLAMA)}
                onChange={() => toggleProvider(Provider.LLAMA)}
              />
              <span className="ml-2 font-medium">Llama</span>
            </label>
            <div className="text-xs text-gray-500">Models: Llama 3 70B, Llama 3 8B</div>
          </div>

          <div className="mt-2">
            <input
              type={showApiKeys ? 'text' : 'password'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="Llama API Key"
              value={apiConfig.llamaApiKey || ''}
              onChange={(e) => updateApiConfig({ llamaApiKey: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
        >
          <RefreshCw size={16} className="mr-1" /> Reset
        </Button>

        <Button type="button" variant="battle" onClick={handleSave}>
          {isSaved ? (
            'Saved!'
          ) : (
            <>
              <Save size={16} className="mr-1" /> Save Configuration
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

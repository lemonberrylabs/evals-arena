'use client'

import { ApiConfigForm } from '@/components/forms/ApiConfigForm'
import { Settings } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <div className="bg-gradient-to-r from-amber-500 to-red-600 p-3 rounded-full inline-block mb-4">
          <Settings className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Configure API keys and select which providers to enable for your battles.
        </p>
      </div>

      <ApiConfigForm />

      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">About LLM Evals Arena</h2>

        <div className="prose prose-sm max-w-none">
          <p>
            LLM Evals Arena is an open-source tool for evaluating and comparing different language models. You can use
            it to:
          </p>

          <ul>
            <li>Test the same prompt across multiple LLMs</li>
            <li>Compare responses based on custom criteria</li>
            <li>Save and review past evaluations</li>
            <li>Identify which models perform best for specific tasks</li>
          </ul>

          <h3>Security &amp; Privacy</h3>
          <p>
            Your API keys are stored locally in your browser and are never sent to our servers. All communication
            happens directly between your browser and the LLM provider APIs.
          </p>

          <h3>Getting Started</h3>
          <p>
            1. Add your API keys for the providers you want to use
            <br />
            2. Enable the providers you want to include in battles
            <br />
            3. Return to the Arena to start a battle
          </p>

          <h3>Contributing</h3>
          <p>
            This is an open-source project. Contributions, issues, and feature requests are welcome!
            <br />
            <a
              href="https://github.com/lemonberrylabs/evals-arena"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-700"
            >
              Visit the GitHub repository
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

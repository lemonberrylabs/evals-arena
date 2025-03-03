import { AlertTriangle } from 'lucide-react'

export default function ConfigRequired() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-amber-800">
        <div className="flex items-start">
          <AlertTriangle className="w-6 h-6 mr-3 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-lg font-semibold mb-2">API Configuration Required</h2>
            <p className="mb-4">
              To use the LLM Evals Arena, you need to configure at least one API key in your environment variables.
              Please check the ENV_SETUP.md file for instructions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

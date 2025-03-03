import { AlertTriangle, X } from 'lucide-react'

import React, { useState } from 'react'

export function SecurityWarning() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) {
    return null
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-amber-800">
      <div className="flex items-start">
        <AlertTriangle className="w-5 h-5 mr-2 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-medium">Security Notice</h3>
            <button
              onClick={() => setDismissed(true)}
              className="text-amber-500 hover:text-amber-700 ml-2"
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
          <p className="mt-1 text-sm">
            This application uses environment variables with the{' '}
            <code className="bg-amber-100 px-1 py-0.5 rounded">NEXT_PUBLIC_</code> prefix, which makes API keys
            accessible in client-side code. For better security in production, consider using a backend API gateway to
            proxy requests to LLM providers.
          </p>
        </div>
      </div>
    </div>
  )
}

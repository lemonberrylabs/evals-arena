import { Header } from '@/components/ui/Header'

import React from 'react'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>

      <footer className="bg-gray-900 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-1">LLM Evals Arena</h3>
              <p className="text-gray-400 text-sm">An open-source platform for comparing LLM performance</p>
            </div>

            <div className="text-gray-400 text-sm">
              <p>© {new Date().getFullYear()} Lemonberry Labs. MIT License.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

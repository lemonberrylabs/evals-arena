import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LLM Evals Arena - Compare and Evaluate Language Models',
  description: 'An open-source tool for comparing different language models through head-to-head battles',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

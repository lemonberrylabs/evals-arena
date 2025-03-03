import { Header } from '@/components/ui/Header'
import { Separator } from '@/components/ui/separator'
import { isConfigured } from '@/config/actions'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'

import ConfigRequired from './ConfigRequired'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LLM Evals Arena - Compare and Evaluate Language Models',
  description: 'An open-source tool for comparing different language models through head-to-head battles',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Layout>{(await isConfigured()) ? children : <ConfigRequired />}</Layout>
        </Providers>
      </body>
    </html>
  )
}

function Layout({ children }: { children: React.ReactNode }) {
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

            <div className="text-gray-400 text-sm flex items-center gap-2">
              <span>&copy; {new Date().getFullYear()} Lemonberry Labs</span>
              <Separator orientation="vertical" />
              <Link href="https://lemonberrylabs.com" target="_blank" rel="noopener noreferrer">
                <Image src="/lemonberry.ico" alt="Lemonberry Labs" width={20} height={20} />
              </Link>
              <Separator orientation="vertical" />
              <span>All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

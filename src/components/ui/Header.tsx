'use client'

import { cn } from '@/lib/utils'
import { Github, History, Sword } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname()

  const navigation = [
    { name: 'Arena', href: '/', icon: Sword },
    { name: 'History', href: '/history', icon: History }, // TODO: Clicking the history button the header should also go "back" when looking at a battle
  ]

  return (
    <header className="bg-gradient-to-r from-red-800 to-amber-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-amber-400 to-red-500 p-1.5 rounded">
              <Sword className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">LLM Evals Arena</span>
          </Link>

          <div className="flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium flex items-center',
                  pathname === item.href ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
                )}
              >
                <item.icon className="h-4 w-4 mr-1" />
                {item.name}
              </Link>
            ))}

            <a
              href="https://github.com/lemonberrylabs/evals-arena"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-md text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white flex items-center"
            >
              <Github className="h-4 w-4 mr-1" />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}

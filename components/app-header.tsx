'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Radio, X } from 'lucide-react'
import { ActivePlayers } from '@/components/active-players'
import { useProfile } from '@/lib/local-store'

export function AppHeader() {
  const { profile, clearProfile } = useProfile()
  const router = useRouter()
  const ready = profile && profile !== 'loading'

  return (
    <header className="grid grid-cols-[auto_1fr_auto] items-stretch border-b-2 border-foreground">
      <Link
        href="/lobby"
        className="flex items-center gap-3 border-r-2 border-foreground px-5 py-4 text-sm font-black tracking-tight uppercase outline-none hover:bg-foreground hover:text-background focus-visible:bg-foreground focus-visible:text-background"
      >
        <Radio className="size-5" aria-hidden />
        Turing Line
      </Link>
      <div className="flex items-center justify-center gap-6 px-4 font-mono text-xs tracking-[0.25em] uppercase">
        {ready && (
          <span className="hidden sm:inline">
            Playing as <span className="font-bold">{profile.name}</span>
          </span>
        )}
        <ActivePlayers className="hidden md:flex" />
      </div>
      {ready && (
        <button
          type="button"
          onClick={() => {
            clearProfile()
            router.push('/')
          }}
          className="flex items-center gap-2 border-l-2 border-foreground px-5 font-mono text-xs tracking-[0.25em] uppercase outline-none hover:bg-foreground hover:text-background focus-visible:bg-foreground focus-visible:text-background"
        >
          Leave
          <X className="size-4" aria-hidden />
        </button>
      )}
    </header>
  )
}

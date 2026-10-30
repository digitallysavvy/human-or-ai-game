'use client'

import Link from 'next/link'
import { Zap } from 'lucide-react'
import { ActivePlayers } from '@/components/active-players'
import { MicStage } from '@/components/lobby/mic-stage'
import { RecordStrip } from '@/components/lobby/record-strip'
import { useRequiredProfile } from '@/components/require-profile'

export function LobbyView() {
  const profile = useRequiredProfile()

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-10 py-6 text-center">
      <div className="flex flex-col items-center gap-3">
        <ActivePlayers className="mb-2" />
        <h1 className="text-[clamp(2.25rem,6vw,4.5rem)] leading-[0.95] font-semibold tracking-[-0.03em] text-balance">
          Ready, <span className="font-serif font-normal text-primary italic">{profile.name}</span>?
        </h1>
        <p className="max-w-md text-muted-foreground">
          Say something and watch the orb. Then connect — you&apos;ll keep getting new voices until you leave.
        </p>
      </div>

      <MicStage />

      <div className="relative flex items-center justify-center">
        <span className="ring-pulse absolute inset-0 rounded-full border-2 border-primary/60" aria-hidden />
        <span className="ring-pulse absolute inset-0 rounded-full border-2 border-primary/40" style={{ animationDelay: '0.6s' }} aria-hidden />
        <Link
          href="/call"
          className="group relative flex h-16 items-center gap-3 rounded-full bg-primary pr-8 pl-3 text-lg font-semibold text-primary-foreground glow-primary transition-transform outline-none hover:scale-[1.03] focus-visible:ring-4 focus-visible:ring-primary/40 active:scale-95"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-primary-foreground/15 transition-transform group-hover:-rotate-12">
            <Zap className="size-5" aria-hidden />
          </span>
          Connect
        </Link>
      </div>

      <RecordStrip />
    </div>
  )
}

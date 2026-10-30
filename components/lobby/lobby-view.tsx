'use client'

import Link from 'next/link'
import { PhoneCall } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { MicCheck } from '@/components/lobby/mic-check'
import { StatsPanel } from '@/components/lobby/stats-panel'
import { useRequiredProfile } from '@/components/require-profile'
import { cn } from '@/lib/utils'

export function LobbyView() {
  const profile = useRequiredProfile()
  return (
    <div className="grid flex-1 gap-8 py-6 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <p className="font-mono text-xs tracking-[0.2em] text-primary uppercase">Lobby</p>
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Ready when you are, {profile.name}.
          </h1>
          <p className="max-w-md text-muted-foreground">
            Check your mic, then pick up. You&apos;ll be connected to a random caller. Each call runs sixty seconds,
            you make your call, and the line connects you to the next one until you hang up.
          </p>
        </div>

        <MicCheck />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/call"
            className={cn(buttonVariants({ size: 'lg' }), 'h-14 flex-1 text-base sm:flex-none sm:px-8')}
          >
            <PhoneCall data-icon="inline-start" aria-hidden />
            Pick up
          </Link>
          <p className="text-sm text-muted-foreground">
            Mic optional. If speech recognition isn&apos;t available you can type.
          </p>
        </div>
      </section>

      <StatsPanel />
    </div>
  )
}

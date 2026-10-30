'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { MicStage } from '@/components/lobby/mic-stage'
import { RecordStrip } from '@/components/lobby/record-strip'
import { useRequiredProfile } from '@/components/require-profile'

export function LobbyView() {
  const profile = useRequiredProfile()

  return (
    <div className="flex flex-1 flex-col">
      <section className="grid border-b-2 border-foreground lg:grid-cols-2">
        <div className="flex flex-col justify-between gap-8 border-b-2 border-foreground px-5 py-8 sm:px-8 lg:border-r-2 lg:border-b-0">
          <div className="flex flex-col gap-4">
            <p className="font-mono text-xs tracking-[0.3em] uppercase">Lobby</p>
            <h1 className="text-[clamp(3rem,9vw,7rem)] leading-[0.85] font-black tracking-[-0.05em] uppercase">
              Ready,
              <br />
              <span className="text-outline break-all">{profile.name}?</span>
            </h1>
            <p className="max-w-md text-lg leading-snug text-pretty">
              Say something and watch the blob. Then connect — you&apos;ll keep getting new voices until you leave.
            </p>
          </div>
          <Link
            href="/call"
            className="btn-brut flex h-16 items-center justify-between bg-foreground px-6 text-xl font-black tracking-tight text-background uppercase outline-none focus-visible:ring-4 focus-visible:ring-ring"
          >
            Connect
            <ArrowRight className="size-7" aria-hidden />
          </Link>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center justify-between border-b-2 border-foreground px-5 py-2 font-mono text-xs tracking-[0.25em] uppercase">
            <span>Mic check</span>
            <span className="text-muted-foreground">Tap the blob</span>
          </div>
          <div className="flex flex-1 items-center justify-center px-5 py-10">
            <MicStage />
          </div>
        </div>
      </section>
      <RecordStrip />
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { PhoneOff } from 'lucide-react'
import { Button } from '@/components/ui/button'

const LINES = ['Dialing the line…', 'Looking for a voice…', 'Someone picked up…']

export function MatchingScreen({ name, onCancel }: { name: string; onCancel: () => void }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => setStep((s) => Math.min(s + 1, LINES.length - 1)), 900)
    return () => window.clearInterval(id)
  }, [])

  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-10 py-12 text-center" aria-live="polite">
      <div className="relative flex size-44 items-center justify-center">
        <span className="ring-pulse absolute inset-0 rounded-full border border-primary/60" />
        <span className="ring-pulse absolute inset-0 rounded-full border border-primary/60" style={{ animationDelay: '0.8s' }} />
        <span className="dial-spin absolute inset-3 rounded-full border-2 border-dashed border-primary/40" />
        <span className="flex size-28 items-center justify-center rounded-full bg-card font-mono text-3xl font-semibold text-primary shadow-xl shadow-black/40">
          {name.slice(0, 2).toUpperCase()}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-mono text-xs tracking-[0.2em] text-primary uppercase">Connecting</p>
        <h1 className="text-3xl font-semibold tracking-tight">{LINES[step]}</h1>
        <p className="text-sm text-muted-foreground">Could be anyone. Could be anything.</p>
      </div>
      <Button variant="ghost" onClick={onCancel}>
        <PhoneOff data-icon="inline-start" aria-hidden />
        Back to lobby
      </Button>
    </section>
  )
}

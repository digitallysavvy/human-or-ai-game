'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Orb } from '@/components/orb'
import { Button } from '@/components/ui/button'

const LINES = ['Finding a connection', 'Someone\u2019s out there', 'Connecting you']
const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789'

export function MatchingScreen({ name, onCancel }: { name: string; onCancel: () => void }) {
  const [step, setStep] = useState(0)
  const [scramble, setScramble] = useState('——————')

  useEffect(() => {
    const stepId = window.setInterval(() => setStep((s) => Math.min(s + 1, LINES.length - 1)), 900)
    const scrambleId = window.setInterval(() => {
      setScramble(Array.from({ length: 6 }, () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]).join(''))
    }, 70)
    return () => {
      window.clearInterval(stepId)
      window.clearInterval(scrambleId)
    }
  }, [])

  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-10 py-12 text-center" aria-live="polite">
      <div className="flex flex-col items-center gap-4">
        <Orb hueDrift active size={260} idle={0.1} />
        <span className="brut bg-background px-3 py-1 font-mono text-sm tracking-[0.4em]" aria-hidden>
          {scramble}
        </span>
      </div>
      <div className="flex flex-col gap-3">
        <p className="font-mono text-xs tracking-[0.3em] uppercase">Connecting {name}</p>
        <h1 className="text-4xl font-black tracking-[-0.04em] uppercase sm:text-6xl">
          {LINES[step]}
          <span className="blink">_</span>
        </h1>
        <p className="text-muted-foreground">Could be anyone. Could be anything.</p>
      </div>
      <Button variant="outline" onClick={onCancel}>
        <X data-icon="inline-start" aria-hidden />
        Cancel
      </Button>
    </section>
  )
}

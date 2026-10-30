'use client'

import { useEffect, useState } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { Bot, UserRound } from 'lucide-react'
import { Orb } from '@/components/orb'
import type { Guess, PublicPartner } from '@/lib/types'
import { cn } from '@/lib/utils'

const THRESHOLD = 140

export function VerdictScreen({
  partner,
  onGuess,
  busy,
}: {
  partner: PublicPartner
  onGuess: (guess: Guess) => void
  busy: boolean
}) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-300, 300], [-10, 10])
  const botOpacity = useTransform(x, [-THRESHOLD, -30], [1, 0])
  const humanOpacity = useTransform(x, [30, THRESHOLD], [0, 1])
  const [locked, setLocked] = useState<Guess | null>(null)

  function commit(guess: Guess) {
    if (busy || locked) return
    setLocked(guess)
    animate(x, guess === 'human' ? 600 : -600, { duration: 0.3, ease: [0.4, 0, 1, 1] }).then(() => onGuess(guess))
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') commit('ai')
      if (e.key === 'ArrowRight') commit('human')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busy, locked])

  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-8 py-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="font-mono text-xs tracking-[0.3em] uppercase">Time&apos;s up</p>
        <h1 className="text-4xl font-black tracking-[-0.04em] uppercase sm:text-6xl">
          So. <span className="text-outline">Who was that?</span>
        </h1>
        <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">Drag the card · Tap a side · Arrow keys</p>
      </div>

      <div className="relative flex w-full max-w-3xl items-center justify-center">
        <SideTarget kind="ai" opacity={botOpacity} onClick={() => commit('ai')} disabled={busy || !!locked} />

        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.9}
          style={{ x, rotate }}
          onDragEnd={(_, info) => {
            if (info.offset.x > THRESHOLD || info.velocity.x > 600) commit('human')
            else if (info.offset.x < -THRESHOLD || info.velocity.x < -600) commit('ai')
          }}
          className="brut relative z-10 flex w-72 cursor-grab touch-none flex-col items-center gap-4 bg-background p-6 brut-shadow active:cursor-grabbing sm:w-80"
          aria-label={`Card for ${partner.name}. Drag right for human, left for AI.`}
        >
          <motion.span style={{ opacity: botOpacity }} className="absolute top-4 left-4 -rotate-6 border-2 border-bot bg-background px-2 py-0.5 font-mono text-sm font-bold tracking-widest text-bot uppercase">
            AI
          </motion.span>
          <motion.span style={{ opacity: humanOpacity }} className="absolute top-4 right-4 rotate-6 border-2 border-human bg-background px-2 py-0.5 font-mono text-sm font-bold tracking-widest text-human uppercase">
            Human
          </motion.span>
          <Orb hue={partner.hue} size={180} idle={0.05} />
          <div className="text-center">
            <p className="text-2xl font-black tracking-tight uppercase">{partner.name}</p>
            <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">{partner.vibe}</p>
          </div>
          <div className="flex w-full items-center justify-between border-t-2 border-foreground pt-3 font-mono text-[11px] tracking-[0.2em] uppercase">
            <span className="text-bot">← AI</span>
            <span className="text-human">Human →</span>
          </div>
        </motion.div>

        <SideTarget kind="human" opacity={humanOpacity} onClick={() => commit('human')} disabled={busy || !!locked} />
      </div>
    </section>
  )
}

function SideTarget({
  kind,
  opacity,
  onClick,
  disabled,
}: {
  kind: Guess
  opacity: ReturnType<typeof useTransform<number, number>>
  onClick: () => void
  disabled: boolean
}) {
  const isHuman = kind === 'human'
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'absolute top-1/2 flex size-24 -translate-y-1/2 flex-col items-center justify-center gap-1 border-2 bg-background transition-colors outline-none focus-visible:ring-4 sm:size-32',
        isHuman
          ? 'right-0 border-human text-human brut-shadow-human hover:bg-human hover:text-human-foreground focus-visible:ring-human/40'
          : 'left-0 border-bot text-bot brut-shadow-bot hover:bg-bot hover:text-bot-foreground focus-visible:ring-bot/40',
      )}
      aria-label={isHuman ? 'Human' : 'AI'}
    >
      <motion.span style={{ opacity }} className={cn('absolute inset-0', isHuman ? 'bg-human/20' : 'bg-bot/20')} aria-hidden />
      {isHuman ? <UserRound className="relative size-8 sm:size-10" aria-hidden /> : <Bot className="relative size-8 sm:size-10" aria-hidden />}
      <span className="relative font-mono text-xs font-bold tracking-widest uppercase">{isHuman ? 'Human' : 'AI'}</span>
    </button>
  )
}

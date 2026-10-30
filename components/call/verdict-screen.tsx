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
  const rotate = useTransform(x, [-300, 300], [-14, 14])
  const botOpacity = useTransform(x, [-THRESHOLD, -30], [1, 0])
  const humanOpacity = useTransform(x, [30, THRESHOLD], [0, 1])
  const botScale = useTransform(x, [-THRESHOLD, 0], [1.15, 1])
  const humanScale = useTransform(x, [0, THRESHOLD], [1, 1.15])
  const [locked, setLocked] = useState<Guess | null>(null)

  function commit(guess: Guess) {
    if (busy || locked) return
    setLocked(guess)
    animate(x, guess === 'human' ? 600 : -600, { duration: 0.35, ease: [0.4, 0, 1, 1] }).then(() => onGuess(guess))
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
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-xs tracking-[0.28em] text-primary uppercase">Line closed</p>
        <h1 className="text-4xl font-semibold tracking-[-0.03em] text-balance sm:text-6xl">
          So. <span className="font-serif font-normal italic">Who was that?</span>
        </h1>
        <p className="text-sm text-muted-foreground">Drag the card. Or tap a side. Arrow keys work too.</p>
      </div>

      <div className="relative flex w-full max-w-3xl items-center justify-center">
        <SideTarget kind="ai" opacity={botOpacity} scale={botScale} onClick={() => commit('ai')} disabled={busy || !!locked} />

        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.9}
          style={{ x, rotate }}
          onDragEnd={(_, info) => {
            if (info.offset.x > THRESHOLD || info.velocity.x > 600) commit('human')
            else if (info.offset.x < -THRESHOLD || info.velocity.x < -600) commit('ai')
          }}
          whileTap={{ scale: 1.02 }}
          className="glass relative z-10 flex w-72 cursor-grab touch-none flex-col items-center gap-4 rounded-3xl p-6 shadow-2xl shadow-black/50 active:cursor-grabbing sm:w-80"
          aria-label={`Card for ${partner.name}. Drag right for human, left for AI.`}
        >
          <motion.span
            style={{ opacity: botOpacity }}
            className="absolute top-5 left-5 -rotate-12 rounded-lg border-2 border-bot px-2 py-0.5 text-sm font-bold tracking-widest text-bot uppercase"
          >
            AI
          </motion.span>
          <motion.span
            style={{ opacity: humanOpacity }}
            className="absolute top-5 right-5 rotate-12 rounded-lg border-2 border-human px-2 py-0.5 text-sm font-bold tracking-widest text-human uppercase"
          >
            Human
          </motion.span>
          <Orb hue={partner.hue} size={180} idle={0.05} />
          <div className="text-center">
            <p className="text-2xl font-semibold tracking-tight">{partner.name}</p>
            <p className="font-serif text-lg text-muted-foreground italic">{partner.vibe}</p>
          </div>
          <div className="flex items-center gap-1 text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
            <span>← AI</span>
            <span className="mx-2 h-px w-8 bg-border" />
            <span>Human →</span>
          </div>
        </motion.div>

        <SideTarget kind="human" opacity={humanOpacity} scale={humanScale} onClick={() => commit('human')} disabled={busy || !!locked} />
      </div>
    </section>
  )
}

function SideTarget({
  kind,
  opacity,
  scale,
  onClick,
  disabled,
}: {
  kind: Guess
  opacity: ReturnType<typeof useTransform<number, number>>
  scale: ReturnType<typeof useTransform<number, number>>
  onClick: () => void
  disabled: boolean
}) {
  const isHuman = kind === 'human'
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{ scale }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'group absolute top-1/2 flex size-24 -translate-y-1/2 flex-col items-center justify-center gap-1 rounded-full border-2 transition-colors outline-none focus-visible:ring-4 sm:size-32',
        isHuman
          ? 'right-0 border-human/40 text-human hover:bg-human/15 focus-visible:ring-human/40'
          : 'left-0 border-bot/40 text-bot hover:bg-bot/15 focus-visible:ring-bot/40',
      )}
      aria-label={isHuman ? 'Human' : 'AI'}
    >
      <motion.span style={{ opacity }} className={cn('absolute inset-0 rounded-full', isHuman ? 'bg-human/25' : 'bg-bot/25')} aria-hidden />
      {isHuman ? <UserRound className="relative size-8 sm:size-10" aria-hidden /> : <Bot className="relative size-8 sm:size-10" aria-hidden />}
      <span className="relative text-xs font-semibold tracking-widest uppercase">{isHuman ? 'Human' : 'AI'}</span>
    </motion.button>
  )
}

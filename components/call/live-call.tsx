'use client'

import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Bot, UserRound, X } from 'lucide-react'
import { Orb } from '@/components/orb'
import type { useMicrophone } from '@/hooks/use-microphone'
import { YOU_HUE } from '@/lib/theme'
import type { Guess, PublicPartner, TranscriptItem } from '@/lib/types'
import { cn } from '@/lib/utils'

const ORB = 200
const RING_R = ORB / 2 + 10
const RING_C = 2 * Math.PI * RING_R

export function LiveCall({
  you,
  partner,
  transcript,
  partnerSpeaking,
  secondsLeft,
  totalSeconds,
  mic,
  listening,
  interim,
  speechSupported,
  canDecide,
  decideInSeconds,
  unlockSeconds,
  busy,
  onGuess,
  onExit,
}: {
  you: string
  partner: PublicPartner
  transcript: TranscriptItem[]
  partnerSpeaking: boolean
  secondsLeft: number
  totalSeconds: number
  mic: ReturnType<typeof useMicrophone>
  listening: boolean
  interim: string
  speechSupported: boolean
  canDecide: boolean
  decideInSeconds: number
  unlockSeconds: number
  busy: boolean
  onGuess: (guess: Guess) => void
  onExit: () => void
}) {
  const listRef = useRef<HTMLOListElement>(null)
  const progress = secondsLeft / totalSeconds
  const urgent = secondsLeft <= 10
  const lastThem = [...transcript].reverse().find((t) => t.who === 'them')
  const lastYou = [...transcript].reverse().find((t) => t.who === 'you')
  const youTalking = mic.level > 0.08 || Boolean(interim)
  const unlockProgress = 1 - decideInSeconds / unlockSeconds

  const yourCaption =
    mic.status === 'live'
      ? listening
        ? 'listening'
        : 'mic on'
      : mic.status === 'denied'
        ? 'mic blocked'
        : mic.status === 'requesting'
          ? 'asking for mic…'
          : 'mic off'

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [transcript.length, interim])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!canDecide || busy) return
      if (e.key === 'ArrowLeft') onGuess('ai')
      if (e.key === 'ArrowRight') onGuess('human')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [canDecide, busy, onGuess])

  return (
    <section className="flex flex-1 flex-col gap-4 py-2 lg:grid lg:grid-cols-[1fr_340px] lg:gap-6">
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-sm">
            <span className="relative flex size-2.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-human/70" />
              <span className="relative size-2.5 rounded-full bg-human" />
            </span>
            <span className="font-medium">Connected</span>
          </div>
          <div className="flex items-center gap-4">
            <div
              className={cn('text-4xl font-semibold tracking-tight tabular-nums transition-colors sm:text-5xl', urgent && 'text-destructive')}
              role="timer"
              aria-live={urgent ? 'assertive' : 'off'}
            >
              0:{String(secondsLeft).padStart(2, '0')}
            </div>
            <button
              type="button"
              onClick={onExit}
              aria-label="Leave"
              title="Leave"
              className="glass flex size-11 items-center justify-center rounded-full text-muted-foreground transition-all outline-none hover:scale-105 hover:text-foreground focus-visible:ring-4 focus-visible:ring-primary/40 active:scale-95"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>
        </div>

        <div className="relative flex flex-1 items-center justify-center py-6">
          <div className="grid w-full max-w-3xl grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-6">
            <Presence
              name={partner.name}
              caption={partnerSpeaking ? 'speaking' : partner.vibe}
              hue={partner.hue}
              active={partnerSpeaking}
              ring={{ progress, urgent }}
            />

            <svg className="h-10 w-16 sm:w-32" viewBox="0 0 128 40" aria-hidden>
              <line x1="0" y1="20" x2="128" y2="20" className="stroke-border" strokeWidth="2" />
              <line
                x1="0"
                y1="20"
                x2="128"
                y2="20"
                strokeWidth="2"
                className={cn('dash-flow transition-opacity', partnerSpeaking || youTalking ? 'opacity-100' : 'opacity-0')}
                style={{
                  stroke: partnerSpeaking ? `oklch(0.78 0.16 ${partner.hue})` : 'var(--primary)',
                  animationDirection: partnerSpeaking ? 'normal' : 'reverse',
                }}
              />
            </svg>

            <Presence name={you} caption={yourCaption} hue={YOU_HUE} level={mic.level} isYou />
          </div>
        </div>

        <div className="flex min-h-28 flex-col items-center justify-end gap-2 px-4 text-center">
          <AnimatePresence mode="wait">
            {(interim || lastYou) && (
              <motion.p
                key={interim ? 'interim' : lastYou!.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={cn('text-sm text-muted-foreground', interim && 'italic')}
              >
                you: {interim || lastYou!.text}
              </motion.p>
            )}
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.p
              key={lastThem?.id ?? 'empty'}
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
              transition={{ duration: 0.35 }}
              className="max-w-2xl font-serif text-2xl leading-snug text-balance italic sm:text-3xl"
              aria-live="polite"
            >
              {lastThem ? `“${lastThem.text}”` : <span className="text-muted-foreground">You&apos;re connected. Say hello.</span>}
            </motion.p>
          </AnimatePresence>
          {!speechSupported && (
            <p className="text-xs text-muted-foreground">This browser can&apos;t transcribe your voice, but they&apos;ll keep talking.</p>
          )}
          {mic.status === 'denied' && speechSupported && (
            <p className="text-xs text-muted-foreground">Allow the microphone so they can hear you.</p>
          )}
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="grid w-full max-w-xl grid-cols-2 gap-3">
            <GuessButton kind="ai" disabled={!canDecide || busy} progress={unlockProgress} onClick={() => onGuess('ai')} />
            <GuessButton kind="human" disabled={!canDecide || busy} progress={unlockProgress} onClick={() => onGuess('human')} />
          </div>
          <p className="text-xs text-muted-foreground" aria-live="polite">
            {canDecide ? 'Call it whenever you\u2019re sure. ← AI · Human →' : `Listen for ${decideInSeconds}s before you decide`}
          </p>
        </div>
      </div>

      <aside className="glass hidden max-h-[calc(100dvh-8rem)] flex-col overflow-hidden rounded-2xl lg:flex">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-sm font-medium">Transcript</h2>
          <span className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase">{transcript.length} lines</span>
        </div>
        <ol ref={listRef} className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
          {transcript.map((item) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn('flex flex-col gap-0.5', item.who === 'you' ? 'items-end' : 'items-start')}
            >
              <span className="text-[11px] text-muted-foreground">{item.who === 'you' ? you : partner.name}</span>
              <p
                className={cn(
                  'max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-relaxed',
                  item.who === 'you' ? 'rounded-br-sm bg-primary text-primary-foreground' : 'rounded-bl-sm bg-muted',
                )}
              >
                {item.text}
              </p>
            </motion.li>
          ))}
        </ol>
      </aside>
    </section>
  )
}

function GuessButton({ kind, disabled, progress, onClick }: { kind: Guess; disabled: boolean; progress: number; onClick: () => void }) {
  const isHuman = kind === 'human'
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.04, y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      className={cn(
        'relative flex h-20 items-center justify-center gap-3 overflow-hidden rounded-2xl border-2 text-2xl font-bold tracking-tight uppercase transition-colors outline-none focus-visible:ring-4 sm:h-24 sm:text-3xl',
        isHuman
          ? 'border-human text-human focus-visible:ring-human/40 enabled:hover:bg-human enabled:hover:text-human-foreground enabled:hover:glow-human'
          : 'border-bot text-bot focus-visible:ring-bot/40 enabled:hover:bg-bot enabled:hover:text-bot-foreground enabled:hover:glow-bot',
        disabled && 'cursor-not-allowed border-border text-muted-foreground',
      )}
    >
      {disabled && (
        <span
          className={cn('absolute inset-y-0 left-0 transition-[width] duration-1000 ease-linear', isHuman ? 'bg-human/15' : 'bg-bot/15')}
          style={{ width: `${progress * 100}%` }}
          aria-hidden
        />
      )}
      {isHuman ? <UserRound className="relative size-7" aria-hidden /> : <Bot className="relative size-7" aria-hidden />}
      <span className="relative">{isHuman ? 'Human' : 'AI'}</span>
    </motion.button>
  )
}

function Presence({
  name,
  caption,
  hue,
  level = 0,
  active = false,
  isYou = false,
  ring,
}: {
  name: string
  caption: string
  hue: number
  level?: number
  active?: boolean
  isYou?: boolean
  ring?: { progress: number; urgent: boolean }
}) {
  const box = ORB + 28
  return (
    <div className="flex min-w-0 flex-col items-center gap-2">
      <div className="relative flex items-center justify-center" style={{ width: box, height: box }}>
        {ring && (
          <svg className="absolute inset-0 -rotate-90" viewBox={`0 0 ${box} ${box}`} aria-hidden>
            <circle cx={box / 2} cy={box / 2} r={RING_R} className="fill-none stroke-border" strokeWidth="2" />
            <circle
              cx={box / 2}
              cy={box / 2}
              r={RING_R}
              className={cn('fill-none transition-[stroke-dashoffset,stroke] duration-300', ring.urgent ? 'stroke-destructive' : 'stroke-foreground/70')}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={RING_C}
              strokeDashoffset={RING_C * (1 - ring.progress)}
            />
          </svg>
        )}
        <Orb hue={hue} level={level} active={active} size={ORB} className="scale-[0.72] sm:scale-100" />
      </div>
      <div className="flex flex-col items-center">
        <p className="flex items-center gap-2 text-base font-semibold tracking-tight">
          <span className="truncate">{name}</span>
          {isYou && <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">you</span>}
        </p>
        <p className="text-xs text-muted-foreground">{caption}</p>
      </div>
    </div>
  )
}

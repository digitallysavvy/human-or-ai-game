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
    <section className="flex flex-1 flex-col gap-4 py-4 lg:grid lg:grid-cols-[1fr_340px] lg:gap-6">
      <div className="flex flex-1 flex-col">
        <div className="brut grid grid-cols-[1fr_auto_auto] items-stretch divide-x-2 divide-foreground">
          <div className="flex items-center gap-3 px-4 font-mono text-xs tracking-[0.25em] uppercase">
            <span className="blink size-2.5 bg-human" aria-hidden />
            Connected
          </div>
          <div
            className={cn('px-4 py-2 font-mono text-4xl font-bold tabular-nums sm:text-5xl', urgent && 'bg-bot text-bot-foreground')}
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
            className="flex w-14 items-center justify-center outline-none hover:bg-foreground hover:text-background focus-visible:bg-foreground focus-visible:text-background"
          >
            <X className="size-6" aria-hidden />
          </button>
        </div>

        <div className="h-2 border-x-2 border-b-2 border-foreground" aria-hidden>
          <div className={cn('h-full transition-[width] duration-1000 ease-linear', urgent ? 'bg-bot' : 'bg-foreground')} style={{ width: `${progress * 100}%` }} />
        </div>

        <div className="flex flex-1 items-center justify-center py-8">
          <div className="grid w-full max-w-3xl grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-6">
            <Presence name={partner.name} caption={partnerSpeaking ? 'speaking' : partner.vibe} hue={partner.hue} active={partnerSpeaking} />

            <svg className="h-10 w-16 sm:w-32" viewBox="0 0 128 40" aria-hidden>
              <line x1="0" y1="20" x2="128" y2="20" className="stroke-muted-foreground/40" strokeWidth="3" />
              <line
                x1="0"
                y1="20"
                x2="128"
                y2="20"
                strokeWidth="3"
                className={cn('dash-flow stroke-foreground transition-opacity', partnerSpeaking || youTalking ? 'opacity-100' : 'opacity-0')}
                style={{ animationDirection: partnerSpeaking ? 'normal' : 'reverse' }}
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
                className={cn('font-mono text-xs tracking-wide text-muted-foreground uppercase', interim && 'italic')}
              >
                you: {interim || lastYou!.text}
              </motion.p>
            )}
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.p
              key={lastThem?.id ?? 'empty'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="max-w-2xl text-2xl leading-tight font-bold tracking-tight text-balance sm:text-3xl"
              aria-live="polite"
            >
              {lastThem ? `“${lastThem.text}”` : <span className="text-muted-foreground">You&apos;re connected. Say hello.</span>}
            </motion.p>
          </AnimatePresence>
          {!speechSupported && (
            <p className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">This browser can&apos;t transcribe your voice, but they&apos;ll keep talking.</p>
          )}
          {mic.status === 'denied' && speechSupported && (
            <p className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">Allow the microphone so they can hear you.</p>
          )}
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="grid w-full max-w-xl grid-cols-2 gap-4">
            <GuessButton kind="ai" disabled={!canDecide || busy} progress={unlockProgress} onClick={() => onGuess('ai')} />
            <GuessButton kind="human" disabled={!canDecide || busy} progress={unlockProgress} onClick={() => onGuess('human')} />
          </div>
          <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase" aria-live="polite">
            {canDecide ? 'Call it when you\u2019re sure · ← AI · Human →' : `Listen for ${decideInSeconds}s before you decide`}
          </p>
        </div>
      </div>

      <aside className="brut hidden max-h-[calc(100dvh-8rem)] flex-col overflow-hidden lg:flex">
        <div className="flex items-center justify-between border-b-2 border-foreground px-4 py-2 font-mono text-xs tracking-[0.25em] uppercase">
          <h2>Transcript</h2>
          <span className="text-muted-foreground">{transcript.length} lines</span>
        </div>
        <ol ref={listRef} className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
          {transcript.map((item) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn('flex flex-col gap-1', item.who === 'you' ? 'items-end' : 'items-start')}
            >
              <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">{item.who === 'you' ? you : partner.name}</span>
              <p
                className={cn(
                  'max-w-[88%] border-2 border-foreground px-3 py-2 text-sm leading-snug',
                  item.who === 'you' ? 'bg-foreground text-background' : 'bg-background',
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
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative flex h-20 items-center justify-center gap-3 overflow-hidden border-2 bg-background text-2xl font-black tracking-tight uppercase outline-none focus-visible:ring-4 sm:h-24 sm:text-3xl',
        'transition-[transform,box-shadow,background-color,color] duration-100',
        isHuman
          ? 'border-human text-human brut-shadow-human focus-visible:ring-human/40 enabled:hover:translate-x-0.5 enabled:hover:translate-y-0.5 enabled:hover:bg-human enabled:hover:text-human-foreground enabled:hover:shadow-[3px_3px_0_var(--human)] enabled:active:translate-x-1.5 enabled:active:translate-y-1.5 enabled:active:shadow-none'
          : 'border-bot text-bot brut-shadow-bot focus-visible:ring-bot/40 enabled:hover:translate-x-0.5 enabled:hover:translate-y-0.5 enabled:hover:bg-bot enabled:hover:text-bot-foreground enabled:hover:shadow-[3px_3px_0_var(--bot)] enabled:active:translate-x-1.5 enabled:active:translate-y-1.5 enabled:active:shadow-none',
        disabled && 'cursor-not-allowed border-muted-foreground/40 text-muted-foreground/50 shadow-none',
      )}
    >
      {disabled && (
        <span className="absolute inset-y-0 left-0 bg-foreground/10 transition-[width] duration-1000 ease-linear" style={{ width: `${progress * 100}%` }} aria-hidden />
      )}
      {isHuman ? <UserRound className="relative size-7" aria-hidden /> : <Bot className="relative size-7" aria-hidden />}
      <span className="relative">{isHuman ? 'Human' : 'AI'}</span>
    </button>
  )
}

function Presence({
  name,
  caption,
  hue,
  level = 0,
  active = false,
  isYou = false,
}: {
  name: string
  caption: string
  hue: number
  level?: number
  active?: boolean
  isYou?: boolean
}) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-3">
      <Orb hue={hue} level={level} active={active} size={ORB} className="scale-[0.72] sm:scale-100" />
      <div className="flex flex-col items-center gap-1">
        <p className="flex items-center gap-2 text-lg font-black tracking-tight uppercase">
          <span className="truncate">{name}</span>
          {isYou && <span className="border-2 border-foreground px-1.5 py-0.5 font-mono text-[10px] tracking-[0.2em]">You</span>}
        </p>
        <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">{caption}</p>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { Gavel, Mic, MicOff, PhoneOff, SendHorizontal, Volume2, VolumeX } from 'lucide-react'
import { VoiceTile } from '@/components/call/voice-tile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { useMicrophone } from '@/hooks/use-microphone'
import type { PublicPartner, TranscriptItem } from '@/lib/types'
import { cn } from '@/lib/utils'

const PROMPTS = ['What did you do this weekend?', 'Are you a bot?', 'Where are you calling from?', 'Tell me a joke']

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
  speakerEnabled,
  onToggleSpeaker,
  onSend,
  canDecide,
  onDecide,
  onHangUp,
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
  speakerEnabled: boolean
  onToggleSpeaker: () => void
  onSend: (text: string) => void
  canDecide: boolean
  onDecide: () => void
  onHangUp: () => void
}) {
  const [draft, setDraft] = useState('')
  const listRef = useRef<HTMLOListElement>(null)
  const progress = secondsLeft / totalSeconds
  const urgent = secondsLeft <= 10

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [transcript.length, interim])

  function send(text: string) {
    const clean = text.trim()
    if (!clean) return
    onSend(clean)
    setDraft('')
  }

  return (
    <section className="flex flex-1 flex-col gap-4 py-2 lg:grid lg:grid-cols-[1.4fr_1fr] lg:grid-rows-[auto_1fr_auto] lg:gap-5">
      <div className="flex items-center justify-between gap-4 lg:col-span-2">
        <div className="flex items-center gap-3">
          <span className="relative flex size-2.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-destructive/70" />
            <span className="relative size-2.5 rounded-full bg-destructive" />
          </span>
          <p className="text-sm font-medium">On the line</p>
          <p className="hidden text-sm text-muted-foreground sm:block">Ask anything. Listen for the tells.</p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className={cn('font-mono text-2xl font-semibold tabular-nums', urgent ? 'text-destructive' : 'text-foreground')}
            role="timer"
            aria-live={urgent ? 'assertive' : 'off'}
          >
            0:{String(secondsLeft).padStart(2, '0')}
          </div>
          <div className="hidden h-1.5 w-32 overflow-hidden rounded-full bg-muted sm:block" aria-hidden>
            <div
              className={cn('h-full rounded-full transition-[width] duration-200', urgent ? 'bg-destructive' : 'bg-primary')}
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex min-h-[240px] flex-row gap-3 sm:min-h-[320px] sm:gap-4 lg:col-start-1 lg:row-start-2">
        <VoiceTile
          name={partner.name}
          caption={partnerSpeaking ? 'Speaking…' : partner.vibe}
          hue={partner.hue}
          speaking={partnerSpeaking}
        />
        <VoiceTile
          name={you}
          caption={listening ? 'Listening to you' : mic.status === 'live' ? 'Mic on' : 'Mic off — type below'}
          hue={82}
          level={mic.level}
          isYou
          muted={mic.muted}
        />
      </div>

      <aside className="flex min-h-[280px] flex-col overflow-hidden rounded-2xl border bg-card lg:col-start-2 lg:row-span-2 lg:row-start-2 lg:max-h-[calc(100dvh-10rem)]">
        <div className="flex items-center justify-between border-b px-4 py-2.5">
          <h2 className="text-sm font-medium">Live transcript</h2>
          <span className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
            {speechSupported && listening ? 'voice + text' : 'text'}
          </span>
        </div>
        <ol ref={listRef} className="flex flex-1 flex-col gap-3 overflow-y-auto p-4" aria-live="polite">
          {transcript.length === 0 && !interim && (
            <li className="m-auto text-center text-sm text-muted-foreground">Line is open. Say hello.</li>
          )}
          {transcript.map((item) => (
            <li key={item.id} className={cn('flex flex-col gap-0.5', item.who === 'you' ? 'items-end' : 'items-start')}>
              <span className="text-[11px] text-muted-foreground">{item.who === 'you' ? you : partner.name}</span>
              <p
                className={cn(
                  'max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed',
                  item.who === 'you' ? 'rounded-br-sm bg-primary text-primary-foreground' : 'rounded-bl-sm bg-muted',
                )}
              >
                {item.text}
              </p>
            </li>
          ))}
          {interim && (
            <li className="flex flex-col items-end gap-0.5">
              <span className="text-[11px] text-muted-foreground">{you}</span>
              <p className="max-w-[85%] rounded-xl rounded-br-sm bg-primary/40 px-3 py-2 text-sm text-primary-foreground italic">
                {interim}
              </p>
            </li>
          )}
        </ol>
        <div className="flex flex-col gap-2 border-t p-3">
          <div className="flex flex-wrap gap-1.5">
            {PROMPTS.map((p) => (
              <Button key={p} variant="outline" size="xs" onClick={() => send(p)}>
                {p}
              </Button>
            ))}
          </div>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              send(draft)
            }}
          >
            <label htmlFor="say" className="sr-only">
              Say something
            </label>
            <Input
              id="say"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.nativeEvent.isComposing || e.keyCode === 229)) e.preventDefault()
              }}
              placeholder={listening ? 'Or type it…' : 'Say something…'}
              autoComplete="off"
            />
            <Button type="submit" size="icon-lg" aria-label="Send">
              <SendHorizontal />
            </Button>
          </form>
        </div>
      </aside>

      <div className="flex flex-wrap items-center justify-center gap-2 lg:col-start-1 lg:row-start-3">
        {mic.status === 'live' ? (
          <Button variant="outline" size="lg" onClick={mic.toggleMute} aria-pressed={mic.muted}>
            {mic.muted ? <MicOff data-icon="inline-start" aria-hidden /> : <Mic data-icon="inline-start" aria-hidden />}
            {mic.muted ? 'Unmute' : 'Mute'}
          </Button>
        ) : (
          <Button variant="outline" size="lg" onClick={mic.start} disabled={mic.status === 'requesting' || mic.status === 'unsupported'}>
            <Mic data-icon="inline-start" aria-hidden />
            Turn on mic
          </Button>
        )}
        <Button variant="outline" size="lg" onClick={onToggleSpeaker} aria-pressed={speakerEnabled}>
          {speakerEnabled ? <Volume2 data-icon="inline-start" aria-hidden /> : <VolumeX data-icon="inline-start" aria-hidden />}
          {speakerEnabled ? 'Voice on' : 'Voice off'}
        </Button>
        <Button size="lg" onClick={onDecide} disabled={!canDecide} className="bg-foreground text-background hover:bg-foreground/90">
          <Gavel data-icon="inline-start" aria-hidden />
          {canDecide ? 'Make the call' : 'Listen a bit longer'}
        </Button>
        <Button variant="destructive" size="lg" onClick={onHangUp}>
          <PhoneOff data-icon="inline-start" aria-hidden />
          Hang up
        </Button>
      </div>
    </section>
  )
}

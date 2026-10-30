'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { partnerOpener, partnerReply, startRound, submitVerdict } from '@/app/actions/round'
import { LiveCall } from '@/components/call/live-call'
import { MatchingScreen } from '@/components/call/matching-screen'
import { RevealScreen } from '@/components/call/reveal-screen'
import { SessionSummary } from '@/components/call/session-summary'
import { VerdictScreen } from '@/components/call/verdict-screen'
import { useRequiredProfile } from '@/components/require-profile'
import { useMicrophone } from '@/hooks/use-microphone'
import { useSpeaker, useSpeechRecognition } from '@/hooks/use-speech'
import { useStats } from '@/lib/local-store'
import type { Guess, Reveal, RoundResult, RoundStart, TranscriptItem } from '@/lib/types'

const CALL_SECONDS = 60
const MIN_MATCH_MS = 2600
const DECIDE_UNLOCK_SECONDS = 15
const IDLE_NUDGE_MS = 14000
const REVEAL_SECONDS = 6

type Phase = 'matching' | 'live' | 'verdict' | 'reveal' | 'ended'

export function CallFlow() {
  const profile = useRequiredProfile()
  const router = useRouter()
  const { stats, recordRound } = useStats()
  const mic = useMicrophone()
  const speaker = useSpeaker()
  const { speak, cancel: cancelSpeech } = speaker
  const micStart = mic.start
  const micStop = mic.stop

  const [phase, setPhase] = useState<Phase>('matching')
  const [round, setRound] = useState<RoundStart | null>(null)
  const [transcript, setTranscript] = useState<TranscriptItem[]>([])
  const [secondsLeft, setSecondsLeft] = useState(CALL_SECONDS)
  const [reveal, setReveal] = useState<Reveal | null>(null)
  const [revealCountdown, setRevealCountdown] = useState(REVEAL_SECONDS)
  const [sessionResults, setSessionResults] = useState<RoundResult[]>([])
  const [submitting, setSubmitting] = useState(false)

  const roundRef = useRef<RoundStart | null>(null)
  const phaseRef = useRef<Phase>('matching')
  const replyPendingRef = useRef(false)
  const queuedTextRef = useRef<string | null>(null)
  const lastActivityRef = useRef(Date.now())
  const timersRef = useRef<number[]>([])
  const bootedRef = useRef(false)
  const matchTokenRef = useRef(0)

  phaseRef.current = phase
  roundRef.current = round

  const later = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms)
    timersRef.current.push(id)
    return id
  }, [])

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id))
    timersRef.current = []
  }, [])

  const pushLine = useCallback((who: TranscriptItem['who'], text: string) => {
    setTranscript((t) => [...t, { id: crypto.randomUUID(), who, text, at: Date.now() }])
    lastActivityRef.current = Date.now()
  }, [])

  const deliverPartnerLine = useCallback(
    (text: string, delayMs: number) => {
      const current = roundRef.current
      if (!current) return
      replyPendingRef.current = true
      later(() => {
        if (phaseRef.current !== 'live' || roundRef.current?.roundId !== current.roundId) {
          replyPendingRef.current = false
          return
        }
        pushLine('them', text)
        speak(text, { rate: current.partner.voiceRate, pitch: current.partner.voicePitch }, () => {
          replyPendingRef.current = false
          const queued = queuedTextRef.current
          queuedTextRef.current = null
          if (queued && phaseRef.current === 'live') void requestReply(queued)
        })
      }, delayMs)
    },
    // requestReply is defined below and stable via ref usage
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [later, pushLine, speak],
  )

  const requestReply = useCallback(
    async (userText: string | null) => {
      const current = roundRef.current
      if (!current || phaseRef.current !== 'live') return
      if (replyPendingRef.current) {
        if (userText) queuedTextRef.current = userText
        return
      }
      replyPendingRef.current = true
      const line = await partnerReply(current.roundId, userText)
      if (!line) {
        replyPendingRef.current = false
        return
      }
      deliverPartnerLine(line.text, line.delayMs)
    },
    [deliverPartnerLine],
  )

  const handleUserText = useCallback(
    (text: string) => {
      if (phaseRef.current !== 'live') return
      pushLine('you', text)
      void requestReply(text)
    },
    [pushLine, requestReply],
  )

  const recognition = useSpeechRecognition((text) => {
    // Ignore what the browser hears while the partner's voice is playing.
    if (replyPendingRef.current && speaker.speaking) return
    handleUserText(text)
  })
  const recognitionStop = recognition.stop

  const beginMatching = useCallback(async () => {
    clearTimers()
    cancelSpeech()
    replyPendingRef.current = false
    queuedTextRef.current = null
    setPhase('matching')
    setRound(null)
    setTranscript([])
    setReveal(null)
    setSecondsLeft(CALL_SECONDS)

    const token = ++matchTokenRef.current
    const [next] = await Promise.all([startRound(), new Promise((r) => setTimeout(r, MIN_MATCH_MS))])
    if (token !== matchTokenRef.current || phaseRef.current !== 'matching') return
    roundRef.current = next
    setRound(next)
    setPhase('live')
    lastActivityRef.current = Date.now()
    const opener = await partnerOpener(next.roundId)
    if (opener) deliverPartnerLine(opener.text, opener.delayMs)
  }, [clearTimers, deliverPartnerLine, cancelSpeech])

  useEffect(() => {
    // Strict Mode re-runs this effect; a second startRound would overwrite the round cookie.
    if (bootedRef.current) return
    bootedRef.current = true
    void micStart()
    void beginMatching()
    return () => {
      clearTimers()
    }
    // Intentionally run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (phase !== 'live') {
      recognition.stop()
      return
    }
    if (recognition.supported && mic.status === 'live') recognition.start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, recognition.supported, mic.status])

  useEffect(() => {
    if (phase !== 'live') return
    const endsAt = Date.now() + CALL_SECONDS * 1000
    const id = window.setInterval(() => {
      const left = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000))
      setSecondsLeft(left)
      if (left === 0) {
        window.clearInterval(id)
        goToVerdict()
      } else if (Date.now() - lastActivityRef.current > IDLE_NUDGE_MS && !replyPendingRef.current) {
        lastActivityRef.current = Date.now()
        void requestReply(null)
      }
    }, 250)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const goToVerdict = useCallback(() => {
    if (phaseRef.current !== 'live') return
    clearTimers()
    cancelSpeech()
    recognitionStop()
    setPhase('verdict')
  }, [clearTimers, recognitionStop, cancelSpeech])

  const handleGuess = useCallback(
    async (guess: Guess) => {
      const current = roundRef.current
      if (!current || submitting) return
      setSubmitting(true)
      const result = await submitVerdict(current.roundId, guess)
      setSubmitting(false)
      if (!result) {
        void beginMatching()
        return
      }
      const record: RoundResult = {
        roundId: current.roundId,
        partnerName: result.partnerName,
        actual: result.actual,
        guess: result.guess,
        correct: result.correct,
        at: Date.now(),
      }
      recordRound(record)
      setSessionResults((s) => [record, ...s])
      setReveal(result)
      setRevealCountdown(REVEAL_SECONDS)
      setPhase('reveal')
    },
    [beginMatching, recordRound, submitting],
  )

  useEffect(() => {
    if (phase !== 'reveal') return
    const id = window.setInterval(() => {
      setRevealCountdown((c) => {
        if (c <= 1) {
          window.clearInterval(id)
          void beginMatching()
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [phase, beginMatching])

  const hangUp = useCallback(() => {
    clearTimers()
    cancelSpeech()
    recognitionStop()
    setPhase('ended')
  }, [clearTimers, recognitionStop, cancelSpeech])

  useEffect(() => {
    if (phase === 'ended') micStop()
  }, [phase, micStop])

  if (phase === 'matching') return <MatchingScreen name={profile.name} onCancel={() => router.push('/lobby')} />

  if (phase === 'live' && round) {
    return (
      <LiveCall
        you={profile.name}
        partner={round.partner}
        transcript={transcript}
        partnerSpeaking={speaker.speaking}
        secondsLeft={secondsLeft}
        totalSeconds={CALL_SECONDS}
        mic={mic}
        listening={recognition.listening}
        interim={recognition.interim}
        speechSupported={recognition.supported}
        speakerEnabled={speaker.enabled}
        onToggleSpeaker={() => speaker.setEnabled(!speaker.enabled)}
        onSend={handleUserText}
        canDecide={CALL_SECONDS - secondsLeft >= DECIDE_UNLOCK_SECONDS}
        onDecide={goToVerdict}
        onHangUp={hangUp}
      />
    )
  }

  if (phase === 'verdict' && round) return <VerdictScreen partner={round.partner} onGuess={handleGuess} busy={submitting} />

  if (phase === 'reveal' && reveal) {
    return (
      <RevealScreen
        reveal={reveal}
        streak={stats.streak}
        secondsToNext={revealCountdown}
        onNext={() => void beginMatching()}
        onEnd={hangUp}
      />
    )
  }

  return <SessionSummary results={sessionResults} onBackToLobby={() => router.push('/lobby')} />
}

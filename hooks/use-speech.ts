'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type RecognitionLike = {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  onresult: ((e: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
}

function getRecognitionCtor(): (new () => RecognitionLike) | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as { SpeechRecognition?: new () => RecognitionLike; webkitSpeechRecognition?: new () => RecognitionLike }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

/**
 * Stand-in for live speech on the call. Uses the browser's SpeechRecognition
 * when available so the player can talk; falls back to typing otherwise.
 */
export function useSpeechRecognition(onFinal: (text: string) => void) {
  const [supported, setSupported] = useState(false)
  const [listening, setListening] = useState(false)
  const [interim, setInterim] = useState('')
  const recRef = useRef<RecognitionLike | null>(null)
  const wantedRef = useRef(false)
  const onFinalRef = useRef(onFinal)
  onFinalRef.current = onFinal

  useEffect(() => {
    setSupported(getRecognitionCtor() !== null)
  }, [])

  const stop = useCallback(() => {
    wantedRef.current = false
    recRef.current?.stop()
    recRef.current = null
    setListening(false)
    setInterim('')
  }, [])

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor()
    if (!Ctor || recRef.current) return
    const rec = new Ctor()
    rec.continuous = true
    rec.interimResults = true
    rec.lang = 'en-US'
    rec.onresult = (e) => {
      let interimText = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i]
        const text = result[0]?.transcript ?? ''
        if (result.isFinal) {
          const clean = text.trim()
          if (clean) onFinalRef.current(clean)
        } else {
          interimText += text
        }
      }
      setInterim(interimText)
    }
    rec.onerror = () => {
      setInterim('')
    }
    rec.onend = () => {
      recRef.current = null
      // Browsers end continuous sessions periodically; restart if still wanted.
      if (wantedRef.current) {
        try {
          start()
        } catch {
          setListening(false)
        }
      } else {
        setListening(false)
      }
    }
    wantedRef.current = true
    recRef.current = rec
    try {
      rec.start()
      setListening(true)
    } catch {
      recRef.current = null
      setListening(false)
    }
  }, [])

  useEffect(() => stop, [stop])

  return { supported, listening, interim, start, stop }
}

/**
 * Stand-in for the partner's voice. Uses speechSynthesis so the "caller"
 * is audible; the rate/pitch come from the server so both kinds vary alike.
 */
export function useSpeaker() {
  const [enabled, setEnabled] = useState(true)
  const [speaking, setSpeaking] = useState(false)
  const enabledRef = useRef(enabled)
  enabledRef.current = enabled

  const speak = useCallback((text: string, opts: { rate: number; pitch: number }, onDone?: () => void) => {
    const estimatedMs = Math.max(1200, text.length * 55)
    if (!enabledRef.current || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSpeaking(true)
      window.setTimeout(() => {
        setSpeaking(false)
        onDone?.()
      }, estimatedMs)
      return
    }
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = opts.rate
    utterance.pitch = opts.pitch
    const voices = window.speechSynthesis.getVoices().filter((v) => v.lang.startsWith('en'))
    if (voices.length) utterance.voice = voices[0]
    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      setSpeaking(false)
      onDone?.()
    }
    utterance.onstart = () => setSpeaking(true)
    utterance.onend = finish
    utterance.onerror = finish
    // Safety net: some engines never fire onend.
    window.setTimeout(finish, estimatedMs + 4000)
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }, [])

  const cancel = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [])

  useEffect(() => cancel, [cancel])

  return { enabled, setEnabled, speaking, speak, cancel }
}

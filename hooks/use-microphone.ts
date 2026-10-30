'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export type MicStatus = 'idle' | 'requesting' | 'live' | 'denied' | 'unsupported'

/**
 * Local-only microphone capture via getUserMedia. Exposes a smoothed
 * 0..1 input level for meters. Later the stream is handed to Agora.
 */
export function useMicrophone() {
  const [status, setStatus] = useState<MicStatus>('idle')
  const [level, setLevel] = useState(0)
  const [muted, setMuted] = useState(false)
  const streamRef = useRef<MediaStream | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)
  const rafRef = useRef<number | null>(null)
  const lastEmitRef = useRef(0)

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    ctxRef.current?.close().catch(() => {})
    ctxRef.current = null
    setLevel(0)
    setStatus('idle')
  }, [])

  const start = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setStatus('unsupported')
      return
    }
    if (streamRef.current) return
    setStatus('requesting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
        video: false,
      })
      streamRef.current = stream
      const ctx = new AudioContext()
      ctxRef.current = ctx
      const source = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 512
      analyser.smoothingTimeConstant = 0.6
      source.connect(analyser)
      const buffer = new Uint8Array(analyser.fftSize)

      const tick = (now: number) => {
        analyser.getByteTimeDomainData(buffer)
        let sum = 0
        for (let i = 0; i < buffer.length; i++) {
          const v = (buffer[i] - 128) / 128
          sum += v * v
        }
        const rms = Math.sqrt(sum / buffer.length)
        if (now - lastEmitRef.current > 50) {
          lastEmitRef.current = now
          setLevel(Math.min(1, rms * 3.5))
        }
        rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
      setStatus('live')
    } catch {
      setStatus('denied')
    }
  }, [])

  const toggleMute = useCallback(() => {
    const stream = streamRef.current
    if (!stream) return
    const next = !muted
    stream.getAudioTracks().forEach((t) => (t.enabled = !next))
    setMuted(next)
  }, [muted])

  useEffect(() => stop, [stop])

  return { status, level: muted ? 0 : level, muted, start, stop, toggleMute }
}

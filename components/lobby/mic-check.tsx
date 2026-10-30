'use client'

import { Mic, MicOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VoiceMeter } from '@/components/voice-meter'
import { useMicrophone } from '@/hooks/use-microphone'

const STATUS_COPY: Record<string, string> = {
  idle: 'Microphone is off. Turn it on to test your level.',
  requesting: 'Asking your browser for microphone access…',
  live: 'Say something. The meter should move.',
  denied: 'Microphone was blocked. You can still play by typing.',
  unsupported: 'This browser can’t capture audio. You can still play by typing.',
}

export function MicCheck() {
  const mic = useMicrophone()
  const isLive = mic.status === 'live'

  return (
    <div className="flex flex-col gap-5 rounded-2xl border bg-card p-5 sm:flex-row sm:items-center sm:gap-6">
      <div className="relative flex size-24 shrink-0 items-center justify-center self-center">
        {isLive && !mic.muted && (
          <span
            className="ring-pulse absolute inset-0 rounded-full border-2 border-primary"
            style={{ animationPlayState: mic.level > 0.08 ? 'running' : 'paused', opacity: mic.level > 0.08 ? 0.6 : 0 }}
          />
        )}
        <span
          className="flex size-20 items-center justify-center rounded-full border bg-background text-primary"
          style={{ boxShadow: isLive ? `0 0 ${12 + mic.level * 40}px oklch(0.83 0.165 82 / ${0.15 + mic.level * 0.5})` : undefined }}
        >
          <VoiceMeter level={mic.level} className="h-8" />
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">Mic check</p>
          <p className="text-sm text-muted-foreground" role="status">
            {STATUS_COPY[mic.status]}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isLive ? (
            <>
              <Button variant="outline" size="sm" onClick={mic.toggleMute} aria-pressed={mic.muted}>
                {mic.muted ? <MicOff data-icon="inline-start" aria-hidden /> : <Mic data-icon="inline-start" aria-hidden />}
                {mic.muted ? 'Unmute' : 'Mute'}
              </Button>
              <Button variant="ghost" size="sm" onClick={mic.stop}>
                Turn off
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={mic.start}
              disabled={mic.status === 'requesting' || mic.status === 'unsupported'}
            >
              <Mic data-icon="inline-start" aria-hidden />
              Turn on mic
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

import { Mic, MicOff } from 'lucide-react'
import { Orb } from '@/components/orb'
import { Button } from '@/components/ui/button'
import { useMicrophone } from '@/hooks/use-microphone'
import { YOU_HUE } from '@/lib/theme'

const STATUS_COPY: Record<string, string> = {
  idle: 'Mic is off. Turn it on to see your voice.',
  requesting: 'Asking for microphone access…',
  live: 'That\u2019s you. Keep talking.',
  denied: 'Mic blocked. Allow it in your browser to be heard.',
  unsupported: 'No audio capture in this browser.',
}

export function MicStage() {
  const mic = useMicrophone()
  const isLive = mic.status === 'live'

  return (
    <div className="flex flex-col items-center gap-5">
      <button
        type="button"
        onClick={isLive ? mic.toggleMute : mic.start}
        disabled={mic.status === 'requesting' || mic.status === 'unsupported'}
        className="group relative outline-none focus-visible:ring-4 focus-visible:ring-ring"
        aria-label={isLive ? (mic.muted ? 'Unmute microphone' : 'Mute microphone') : 'Turn on microphone'}
      >
        <Orb level={mic.level} hue={YOU_HUE} size={240} idle={isLive ? 0.05 : 0.03} className={isLive ? '' : 'opacity-50'} />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="brut flex size-12 items-center justify-center bg-background text-foreground brut-shadow-sm transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5">
            {isLive && !mic.muted ? <Mic className="size-5" aria-hidden /> : <MicOff className="size-5" aria-hidden />}
          </span>
        </span>
      </button>
      <p className="font-mono text-xs tracking-[0.15em] text-muted-foreground uppercase" role="status">
        {mic.muted ? 'Muted. Tap the blob to unmute.' : STATUS_COPY[mic.status]}
      </p>
      {isLive && (
        <Button variant="outline" size="sm" onClick={mic.stop}>
          Turn mic off
        </Button>
      )}
    </div>
  )
}

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
  denied: 'Mic blocked. You can still play by typing.',
  unsupported: 'No audio capture here. You can still play by typing.',
}

export function MicStage() {
  const mic = useMicrophone()
  const isLive = mic.status === 'live'

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={isLive ? mic.toggleMute : mic.start}
        disabled={mic.status === 'requesting' || mic.status === 'unsupported'}
        className="group relative rounded-full outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
        aria-label={isLive ? (mic.muted ? 'Unmute microphone' : 'Mute microphone') : 'Turn on microphone'}
      >
        <Orb level={mic.level} hue={YOU_HUE} size={240} idle={isLive ? 0.05 : 0.03} className={isLive ? '' : 'opacity-60 saturate-50'} />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-background/70 text-foreground shadow-lg backdrop-blur transition-transform group-hover:scale-110">
            {isLive && !mic.muted ? <Mic className="size-5" aria-hidden /> : <MicOff className="size-5" aria-hidden />}
          </span>
        </span>
      </button>
      <p className="text-sm text-muted-foreground" role="status">
        {mic.muted ? 'Muted. Tap the orb to unmute.' : STATUS_COPY[mic.status]}
      </p>
      {isLive && (
        <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={mic.stop}>
          Turn mic off
        </Button>
      )}
    </div>
  )
}

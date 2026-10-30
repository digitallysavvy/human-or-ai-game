import { VoiceMeter } from '@/components/voice-meter'
import { cn } from '@/lib/utils'

export function VoiceTile({
  name,
  caption,
  hue,
  level = 0,
  speaking = false,
  isYou = false,
  muted = false,
}: {
  name: string
  caption: string
  hue: number
  level?: number
  speaking?: boolean
  isYou?: boolean
  muted?: boolean
}) {
  const color = `oklch(0.78 0.14 ${hue})`
  const active = speaking || level > 0.06

  return (
    <div
      className={cn(
        'relative flex min-w-0 flex-1 flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border bg-card p-3 transition-shadow sm:gap-5 sm:p-6',
        active && 'shadow-[0_0_0_1px_var(--tile-color)]',
      )}
      style={{ '--tile-color': color } as React.CSSProperties}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${color.replace(')', ' / 35%)')}, transparent 60%)`,
          opacity: active ? 0.5 : 0.15,
        }}
        aria-hidden
      />
      <div className="relative flex size-24 items-center justify-center sm:size-40">
        {active && <span className="ring-pulse absolute inset-0 rounded-full border-2" style={{ borderColor: color }} />}
        <span
          className="flex size-20 items-center justify-center rounded-full bg-background/80 font-mono text-2xl font-semibold sm:size-36 sm:text-4xl"
          style={{ color, boxShadow: active ? `0 0 ${20 + level * 40}px ${color.replace(')', ' / 45%)')}` : undefined }}
        >
          {name.slice(0, 2).toUpperCase()}
        </span>
      </div>
      <div className="relative flex flex-col items-center gap-1 text-center">
        <p className="flex max-w-full items-center gap-2 text-base font-semibold tracking-tight sm:text-lg">
          <span className="truncate">{name}</span>
          {isYou && <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">you</span>}
        </p>
        <p className="line-clamp-2 text-xs text-muted-foreground sm:text-sm">{muted ? 'Muted' : caption}</p>
      </div>
      <div className="relative h-10" style={{ color }}>
        <VoiceMeter level={level} animated={speaking} />
      </div>
    </div>
  )
}

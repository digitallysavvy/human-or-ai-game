import { cn } from '@/lib/utils'

const BAR_WEIGHTS = [0.35, 0.6, 0.85, 1, 0.85, 0.6, 0.35]

/**
 * Seven-bar audio meter. `level` drives bar height from live input;
 * `animated` plays a looping wave for a stubbed remote speaker.
 */
export function VoiceMeter({
  level = 0,
  animated = false,
  className,
  barClassName,
}: {
  level?: number
  animated?: boolean
  className?: string
  barClassName?: string
}) {
  return (
    <div className={cn('flex h-10 items-center justify-center gap-1', className)} aria-hidden>
      {BAR_WEIGHTS.map((weight, i) => {
        const scale = animated ? undefined : Math.max(0.12, Math.min(1, level * weight * 1.6 + 0.08))
        return (
          <span
            key={i}
            className={cn('block h-full w-1.5 rounded-full bg-current', animated && 'wave-bar', barClassName)}
            style={
              animated
                ? { animationDelay: `${i * 90}ms`, animationDuration: `${700 + weight * 400}ms` }
                : { transform: `scaleY(${scale})`, transition: 'transform 80ms linear' }
            }
          />
        )
      })}
    </div>
  )
}

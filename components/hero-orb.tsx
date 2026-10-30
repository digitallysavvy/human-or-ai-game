'use client'

import { useEffect, useRef, useState } from 'react'
import { Orb } from '@/components/orb'
import { PALETTE_HUES as HUES } from '@/lib/theme'

/** Landing orb: pointer speed becomes "voice" level; clicking changes its mood. */
export function HeroOrb() {
  const [level, setLevel] = useState(0)
  const [hueIndex, setHueIndex] = useState(0)
  const [size, setSize] = useState(360)
  const wrapRef = useRef<HTMLDivElement>(null)
  const last = useRef<{ x: number; y: number; t: number } | null>(null)
  const energy = useRef(0)

  useEffect(() => {
    const update = () => setSize(window.innerWidth < 640 ? 260 : window.innerWidth < 1024 ? 320 : 400)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    let raf = 0
    const tick = () => {
      energy.current *= 0.9
      setLevel((l) => (Math.abs(l - energy.current) < 0.005 ? l : energy.current))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  function onMove(e: React.PointerEvent) {
    const now = performance.now()
    if (last.current) {
      const dx = e.clientX - last.current.x
      const dy = e.clientY - last.current.y
      const dt = Math.max(8, now - last.current.t)
      const speed = Math.hypot(dx, dy) / dt
      energy.current = Math.min(1, energy.current + speed * 0.25)
    }
    last.current = { x: e.clientX, y: e.clientY, t: now }
  }

  return (
    <div
      ref={wrapRef}
      onPointerMove={onMove}
      onPointerLeave={() => (last.current = null)}
      onClick={() => {
        energy.current = 1
        setHueIndex((i) => (i + 1) % HUES.length)
      }}
      className="relative flex cursor-pointer items-center justify-center select-none"
      role="button"
      tabIndex={0}
      aria-label="Interactive voice orb. Move your cursor or click."
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          energy.current = 1
          setHueIndex((i) => (i + 1) % HUES.length)
        }
      }}
    >
      <Orb level={level} hue={HUES[hueIndex]} size={size} idle={0.08} />
      <span className="pointer-events-none absolute right-[8%] bottom-[8%] rotate-[-6deg] font-serif text-2xl text-muted-foreground italic sm:text-3xl">
        it listens
      </span>
    </div>
  )
}

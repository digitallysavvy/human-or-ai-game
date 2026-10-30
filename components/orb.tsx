'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * Audio-reactive blob rendered on canvas. `level` (0..1) drives displacement
 * from a live mic; `active` with no level synthesizes a speaking rhythm.
 * `hue` is an oklch hue. `hueDrift` cycles the hue (used while matching).
 */
export function Orb({
  level = 0,
  active = false,
  hue = 300,
  hueDrift = false,
  size = 220,
  idle = 0.06,
  className,
}: {
  level?: number
  active?: boolean
  hue?: number
  hueDrift?: boolean
  size?: number
  idle?: number
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const levelRef = useRef(level)
  const activeRef = useRef(active)
  const hueRef = useRef(hue)
  levelRef.current = level
  activeRef.current = active
  hueRef.current = hue

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const px = size * dpr
    canvas.width = px
    canvas.height = px

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const POINTS = 120
    let t = Math.random() * 100
    let smooth = 0
    let raf = 0
    let driftHue = hueRef.current

    const blob = (cx: number, cy: number, base: number, amp: number, phase: number, fill: string | CanvasGradient) => {
      ctx.beginPath()
      const pts: [number, number][] = []
      for (let i = 0; i < POINTS; i++) {
        const a = (i / POINTS) * Math.PI * 2
        const n =
          Math.sin(a * 3 + t * 1.3 + phase) * 0.5 +
          Math.sin(a * 5 - t * 2.1 + phase * 2) * 0.3 +
          Math.sin(a * 2 + t * 0.7 - phase) * 0.2
        const r = base + amp * n
        pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r])
      }
      for (let i = 0; i < POINTS; i++) {
        const [x1, y1] = pts[i]
        const [x2, y2] = pts[(i + 1) % POINTS]
        const mx = (x1 + x2) / 2
        const my = (y1 + y2) / 2
        if (i === 0) ctx.moveTo(mx, my)
        else ctx.quadraticCurveTo(x1, y1, mx, my)
      }
      ctx.closePath()
      ctx.fillStyle = fill
      ctx.fill()
    }

    const draw = () => {
      t += reduceMotion ? 0.003 : 0.014
      if (hueDrift) driftHue = (driftHue + 0.6) % 360
      const h = hueDrift ? driftHue : hueRef.current

      let target = levelRef.current
      if (activeRef.current && target < 0.05) {
        target = 0.3 + 0.3 * Math.abs(Math.sin(t * 3.1)) * Math.abs(Math.sin(t * 1.7 + 1))
      }
      smooth += (target - smooth) * 0.14

      ctx.clearRect(0, 0, px, px)
      const cx = px / 2
      const cy = px / 2
      const base = px * 0.27
      const amp = base * (idle + smooth * 0.5)

      // Outer glow halo
      const halo = ctx.createRadialGradient(cx, cy, base * 0.6, cx, cy, base * 1.9)
      halo.addColorStop(0, `oklch(0.78 0.16 ${h} / ${0.28 + smooth * 0.35})`)
      halo.addColorStop(1, `oklch(0.78 0.16 ${h} / 0)`)
      ctx.fillStyle = halo
      ctx.fillRect(0, 0, px, px)

      // Back layer, slightly larger and translucent
      blob(cx, cy, base * 1.08, amp * 1.3, 1.7, `oklch(0.7 0.17 ${h} / 0.35)`)

      // Main body
      const body = ctx.createRadialGradient(cx - base * 0.3, cy - base * 0.35, base * 0.1, cx, cy, base * 1.15)
      body.addColorStop(0, `oklch(0.93 0.08 ${h})`)
      body.addColorStop(0.45, `oklch(0.78 0.16 ${h})`)
      body.addColorStop(1, `oklch(0.45 0.14 ${h})`)
      blob(cx, cy, base, amp, 0, body)

      // Inner highlight
      blob(cx - base * 0.18, cy - base * 0.22, base * 0.45, amp * 0.4, 3.1, `oklch(0.98 0.03 ${h} / ${0.18 + smooth * 0.2})`)

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [size, idle, hueDrift])

  return (
    <canvas
      ref={canvasRef}
      className={cn('block', className)}
      style={{ width: size, height: size }}
      aria-hidden
    />
  )
}

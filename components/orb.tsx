'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * Audio-reactive blob rendered flat on canvas: solid fill, ink outline, hard
 * offset shadow. `level` (0..1) drives displacement from a live mic; `active`
 * with no level synthesizes a speaking rhythm. `hue` is an oklch hue; a
 * negative hue renders solid ink. `hueDrift` cycles the hue (while matching).
 */
export function Orb({
  level = 0,
  active = false,
  hue = -1,
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

    const css = getComputedStyle(document.documentElement)
    const ink = css.getPropertyValue('--foreground').trim() || '#1a1a1a'
    const paper = css.getPropertyValue('--background').trim() || '#f3f1ec'

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const POINTS = 120
    let t = Math.random() * 100
    let smooth = 0
    let raf = 0
    let driftHue = Math.max(0, hueRef.current)

    const blob = (cx: number, cy: number, base: number, amp: number, phase: number, fill: string, stroke?: string) => {
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
      if (stroke) {
        ctx.lineWidth = 3 * dpr
        ctx.lineJoin = 'round'
        ctx.strokeStyle = stroke
        ctx.stroke()
      }
    }

    const draw = () => {
      t += reduceMotion ? 0.003 : 0.014
      if (hueDrift) driftHue = (driftHue + 0.8) % 360
      const h = hueDrift ? driftHue : hueRef.current
      const mono = h < 0

      let target = levelRef.current
      if (activeRef.current && target < 0.05) {
        target = 0.3 + 0.3 * Math.abs(Math.sin(t * 3.1)) * Math.abs(Math.sin(t * 1.7 + 1))
      }
      smooth += (target - smooth) * 0.14

      ctx.clearRect(0, 0, px, px)
      const cx = px / 2
      const cy = px / 2
      const base = px * 0.3
      const amp = base * (idle + smooth * 0.5)
      const off = base * (0.1 + smooth * 0.1)

      // Hard offset shadow, same shape.
      blob(cx + off, cy + off, base, amp, 0, mono ? paper : ink, ink)
      // Body
      blob(cx, cy, base, amp, 0, mono ? ink : `oklch(0.68 0.17 ${h})`, ink)

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

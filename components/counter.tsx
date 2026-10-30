'use client'

import { useEffect, useState } from 'react'
import { animate, useMotionValue } from 'motion/react'

/** Number that springs from its previous value to `value`. */
export function Counter({ value, suffix = '', className }: { value: number; suffix?: string; className?: string }) {
  const mv = useMotionValue(0)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.9, ease: [0.22, 1, 0.36, 1] })
    const unsub = mv.on('change', (v) => setDisplay(Math.round(v)))
    return () => {
      controls.stop()
      unsub()
    }
  }, [value, mv])

  return (
    <span className={className}>
      {display}
      {suffix}
    </span>
  )
}

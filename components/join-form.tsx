'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProfile } from '@/lib/local-store'

export function JoinForm() {
  const { profile, setProfile } = useProfile()
  const router = useRouter()
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (profile && profile !== 'loading') router.replace('/lobby')
  }, [profile, router])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const clean = name.trim()
    if (clean.length < 2) return setError('At least two characters.')
    if (clean.length > 24) return setError('Keep it under 24 characters.')
    setProfile(clean)
    router.push('/lobby')
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="handle" className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
          Your handle
        </label>
        <input
          id="handle"
          name="handle"
          autoComplete="nickname"
          placeholder="late-night-sam"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setError(null)
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'handle-error' : 'handle-hint'}
          className="h-14 w-full border-0 border-b border-input bg-transparent px-0 font-serif text-3xl text-foreground italic outline-none placeholder:text-muted-foreground/40 focus-visible:border-primary"
        />
        <p id={error ? 'handle-error' : 'handle-hint'} className={error ? 'text-sm text-destructive' : 'text-xs text-muted-foreground'}>
          {error ?? 'It\u2019s what the other player sees. Scores stay on this device.'}
        </p>
      </div>
      <Button type="submit" size="lg" className="group h-13 justify-between rounded-full pr-2 pl-6 text-base">
        Join the game
        <span className="flex size-9 items-center justify-center rounded-full bg-primary-foreground/15 transition-transform group-hover:rotate-12 group-hover:scale-110">
          <Zap className="size-4" aria-hidden />
        </span>
      </Button>
    </form>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
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
    <form onSubmit={submit} className="flex max-w-md flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="handle" className="font-mono text-xs tracking-[0.25em] uppercase">
          Your handle
        </label>
        <input
          id="handle"
          name="handle"
          autoComplete="nickname"
          placeholder="LATE-NIGHT-SAM"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setError(null)
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'handle-error' : 'handle-hint'}
          className="h-16 w-full border-2 border-foreground bg-background px-4 font-mono text-2xl font-bold tracking-tight uppercase outline-none placeholder:text-muted-foreground/50 focus-visible:brut-shadow aria-invalid:border-destructive"
        />
        <p id={error ? 'handle-error' : 'handle-hint'} className={error ? 'font-mono text-xs text-destructive uppercase' : 'text-sm text-muted-foreground'}>
          {error ?? 'It\u2019s what the other player sees.'}
        </p>
      </div>
      <button
        type="submit"
        className="btn-brut flex h-14 items-center justify-between bg-foreground px-5 text-lg font-black tracking-tight text-background uppercase outline-none focus-visible:ring-4 focus-visible:ring-ring"
      >
        Join the game
        <ArrowRight className="size-6" aria-hidden />
      </button>
    </form>
  )
}

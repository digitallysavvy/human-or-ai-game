'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { useProfile } from '@/lib/local-store'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Errors = { name?: string; email?: string }

const inputClass =
  'h-14 w-full border-2 border-foreground bg-background px-4 font-mono text-xl font-bold tracking-tight outline-none placeholder:text-muted-foreground/50 focus-visible:brut-shadow aria-invalid:border-destructive'

export function JoinForm() {
  const { profile, setProfile } = useProfile()
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<Errors>({})

  useEffect(() => {
    if (profile && profile !== 'loading' && profile.email) router.replace('/lobby')
  }, [profile, router])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const cleanName = name.trim()
    const cleanEmail = email.trim()
    const next: Errors = {}
    if (cleanName.length < 2) next.name = 'At least two characters.'
    else if (cleanName.length > 24) next.name = 'Keep it under 24 characters.'
    if (!cleanEmail) next.email = 'Email is required.'
    else if (!EMAIL_RE.test(cleanEmail)) next.email = 'That doesn\u2019t look like an email.'
    if (next.name || next.email) return setErrors(next)
    setProfile(cleanName, cleanEmail)
    router.push('/lobby')
  }

  return (
    <form onSubmit={submit} noValidate className="flex max-w-md flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="handle" className="font-mono text-xs tracking-[0.25em] uppercase">
          Your handle
        </label>
        <input
          id="handle"
          name="handle"
          required
          autoComplete="nickname"
          placeholder="LATE-NIGHT-SAM"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setErrors((er) => ({ ...er, name: undefined }))
          }}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby="handle-hint"
          className={`${inputClass} uppercase`}
        />
        <p id="handle-hint" className={errors.name ? 'font-mono text-xs text-destructive uppercase' : 'text-sm text-muted-foreground'}>
          {errors.name ?? 'It\u2019s what the other player sees.'}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="font-mono text-xs tracking-[0.25em] uppercase">
          Your email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="sam@night.fm"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setErrors((er) => ({ ...er, email: undefined }))
          }}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby="email-hint"
          className={`${inputClass} lowercase`}
        />
        <p id="email-hint" className={errors.email ? 'font-mono text-xs text-destructive uppercase' : 'text-sm text-muted-foreground'}>
          {errors.email ?? 'Never shown to other players.'}
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

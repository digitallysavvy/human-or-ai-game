'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { useProfile } from '@/lib/local-store'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Errors = { name?: string; email?: string; agree?: string }

const inputClass =
  'h-14 w-full border-2 border-foreground bg-background px-4 font-mono text-xl font-bold tracking-tight outline-none placeholder:text-muted-foreground/50 focus-visible:brut-shadow aria-invalid:border-destructive'

export function JoinForm() {
  const { profile, setProfile } = useProfile()
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [agreed, setAgreed] = useState(false)
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
    if (!agreed) next.agree = 'You need to agree to play.'
    if (next.name || next.email || next.agree) return setErrors(next)
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
          {errors.email ?? 'Ties your account to the leaderboard.'}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="agree" className="flex cursor-pointer items-start gap-3 text-sm leading-snug">
          <input
            id="agree"
            name="agree"
            type="checkbox"
            required
            checked={agreed}
            onChange={(e) => {
              setAgreed(e.target.checked)
              setErrors((er) => ({ ...er, agree: undefined }))
            }}
            aria-invalid={errors.agree ? true : undefined}
            aria-describedby={errors.agree ? 'agree-error' : undefined}
            className="mt-0.5 size-5 shrink-0 cursor-pointer accent-foreground"
          />
          <span>
            I agree to the{' '}
            <Link href="/rules" className="font-bold underline underline-offset-4 outline-none focus-visible:bg-foreground focus-visible:text-background">
              rules &amp; code of conduct
            </Link>
            .
          </span>
        </label>
        {errors.agree && (
          <p id="agree-error" className="font-mono text-xs text-destructive uppercase">
            {errors.agree}
          </p>
        )}
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

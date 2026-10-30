'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
    if (clean.length < 2) {
      setError('Give us at least two characters.')
      return
    }
    if (clean.length > 24) {
      setError('Keep it under 24 characters.')
      return
    }
    setProfile(clean)
    router.push('/lobby')
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <label htmlFor="handle" className="sr-only">
        Display name
      </label>
      <Input
        id="handle"
        name="handle"
        autoComplete="nickname"
        placeholder="e.g. late-night-sam"
        value={name}
        onChange={(e) => {
          setName(e.target.value)
          setError(null)
        }}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? 'handle-error' : undefined}
        className="h-12 text-base"
        autoFocus
      />
      {error && (
        <p id="handle-error" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <Button type="submit" size="lg" className="h-12 text-base">
        Get on the line
        <ArrowRight data-icon="inline-end" aria-hidden />
      </Button>
    </form>
  )
}

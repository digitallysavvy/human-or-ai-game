'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, Radio } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProfile } from '@/lib/local-store'

export function AppHeader() {
  const { profile, clearProfile } = useProfile()
  const router = useRouter()

  return (
    <header className="flex items-center justify-between px-5 py-4 sm:px-8">
      <Link href="/lobby" className="flex items-center gap-2.5 text-sm font-semibold tracking-tight">
        <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Radio className="size-4" aria-hidden />
        </span>
        Turing Line
      </Link>
      {profile && profile !== 'loading' && (
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:inline">
            on the line as <span className="font-medium text-foreground">{profile.name}</span>
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              clearProfile()
              router.push('/')
            }}
          >
            <LogOut data-icon="inline-start" aria-hidden />
            Leave
          </Button>
        </div>
      )}
    </header>
  )
}

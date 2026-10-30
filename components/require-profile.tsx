'use client'

import { createContext, useContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useProfile } from '@/lib/local-store'
import type { Profile } from '@/lib/types'

const ProfileContext = createContext<Profile | null>(null)

export function useRequiredProfile(): Profile {
  const profile = useContext(ProfileContext)
  if (!profile) throw new Error('useRequiredProfile must be used inside <RequireProfile>')
  return profile
}

export function RequireProfile({ children }: { children: React.ReactNode }) {
  const { profile } = useProfile()
  const router = useRouter()

  useEffect(() => {
    if (profile === null) router.replace('/')
  }, [profile, router])

  if (profile === 'loading' || profile === null) {
    return (
      <div className="flex flex-1 items-center justify-center p-10 text-sm text-muted-foreground" role="status">
        Connecting…
      </div>
    )
  }
  return <ProfileContext.Provider value={profile}>{children}</ProfileContext.Provider>
}

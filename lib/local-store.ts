'use client'

import { useCallback, useSyncExternalStore } from 'react'
import type { LocalStats, Profile, RoundResult } from './types'

// Scores and the display name are stored locally for now (per user request).

const PROFILE_KEY = 'tl_profile'
const STATS_KEY = 'tl_stats'

const EMPTY_STATS: LocalStats = { rounds: 0, correct: 0, streak: 0, bestStreak: 0, history: [] }

const listeners = new Set<() => void>()

function emit() {
  for (const l of listeners) l()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  window.addEventListener('storage', listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', listener)
  }
}

function readRaw(key: string) {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeRaw(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(key)
    else window.localStorage.setItem(key, value)
  } catch {
    // Storage may be unavailable (private mode); the game still runs in memory.
  }
  emit()
}

function parse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function useProfile() {
  const raw = useSyncExternalStore(
    subscribe,
    () => readRaw(PROFILE_KEY),
    () => 'loading',
  )
  const profile: Profile | null | 'loading' = raw === 'loading' ? 'loading' : parse<Profile | null>(raw, null)

  const setProfile = useCallback((name: string, email: string) => {
    const next: Profile = { name: name.trim(), email: email.trim().toLowerCase(), createdAt: Date.now() }
    writeRaw(PROFILE_KEY, JSON.stringify(next))
  }, [])

  const clearProfile = useCallback(() => writeRaw(PROFILE_KEY, null), [])

  return { profile, setProfile, clearProfile }
}

export function useStats() {
  const raw = useSyncExternalStore(
    subscribe,
    () => readRaw(STATS_KEY),
    () => null,
  )
  const stats = parse<LocalStats>(raw, EMPTY_STATS)

  const recordRound = useCallback((result: RoundResult) => {
    const current = parse<LocalStats>(readRaw(STATS_KEY), EMPTY_STATS)
    const streak = result.correct ? current.streak + 1 : 0
    const next: LocalStats = {
      rounds: current.rounds + 1,
      correct: current.correct + (result.correct ? 1 : 0),
      streak,
      bestStreak: Math.max(current.bestStreak, streak),
      history: [result, ...current.history].slice(0, 50),
    }
    writeRaw(STATS_KEY, JSON.stringify(next))
    return next
  }, [])

  const resetStats = useCallback(() => writeRaw(STATS_KEY, null), [])

  return { stats, recordRound, resetStats }
}

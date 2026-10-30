'use server'

import { cookies } from 'next/headers'
import { getPersona, nextLine, pickPersona } from '@/lib/personas'
import type { Guess, PartnerLine, Reveal, RoundStart } from '@/lib/types'

const ROUND_COOKIE = 'tl_round'

type RoundState = {
  roundId: string
  personaId: string
  turn: number
  startedAt: number
}

async function readRound(): Promise<RoundState | null> {
  const jar = await cookies()
  const raw = jar.get(ROUND_COOKIE)?.value
  if (!raw) return null
  try {
    return JSON.parse(raw) as RoundState
  } catch {
    return null
  }
}

async function writeRound(state: RoundState | null) {
  const jar = await cookies()
  if (!state) {
    jar.delete(ROUND_COOKIE)
    return
  }
  jar.set(ROUND_COOKIE, JSON.stringify(state), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 30,
  })
}

export async function startRound(): Promise<RoundStart> {
  const previous = await readRound()
  const persona = pickPersona(previous?.personaId)
  const roundId = crypto.randomUUID()
  await writeRound({ roundId, personaId: persona.id, turn: 0, startedAt: Date.now() })
  return {
    roundId,
    partner: {
      name: persona.name,
      vibe: persona.vibe,
      hue: persona.hue,
      voiceRate: persona.voiceRate,
      voicePitch: persona.voicePitch,
    },
  }
}

export async function partnerOpener(roundId: string): Promise<PartnerLine | null> {
  const round = await readRound()
  if (!round || round.roundId !== roundId) return null
  const persona = getPersona(round.personaId)
  if (!persona) return null
  return { text: persona.opener, delayMs: 1200 + Math.random() * 800 }
}

export async function partnerReply(roundId: string, userText: string | null): Promise<PartnerLine | null> {
  const round = await readRound()
  if (!round || round.roundId !== roundId) return null
  const persona = getPersona(round.personaId)
  if (!persona) return null
  const text = nextLine(persona, round.turn, userText)
  await writeRound({ ...round, turn: round.turn + 1 })
  // Humans and bots alike take a beat; keep the delay band identical so it isn't a tell.
  return { text, delayMs: 900 + Math.random() * 1800 }
}

export async function submitVerdict(roundId: string, guess: Guess): Promise<Reveal | null> {
  const round = await readRound()
  if (!round || round.roundId !== roundId) return null
  const persona = getPersona(round.personaId)
  if (!persona) return null
  await writeRound(null)
  return {
    correct: guess === persona.kind,
    actual: persona.kind,
    guess,
    partnerName: persona.name,
    tell: persona.tell,
  }
}

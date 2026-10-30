export type PartnerKind = 'human' | 'ai'

export type Guess = PartnerKind

export type PublicPartner = {
  name: string
  vibe: string
  hue: number
  voiceRate: number
  voicePitch: number
}

export type RoundStart = {
  roundId: string
  partner: PublicPartner
}

export type PartnerLine = {
  text: string
  delayMs: number
}

export type Reveal = {
  correct: boolean
  actual: PartnerKind
  guess: Guess
  partnerName: string
  tell: string
}

export type TranscriptItem = {
  id: string
  who: 'you' | 'them'
  text: string
  at: number
}

export type RoundResult = {
  roundId: string
  partnerName: string
  actual: PartnerKind
  guess: Guess
  correct: boolean
  at: number
}

export type LocalStats = {
  rounds: number
  correct: number
  streak: number
  bestStreak: number
  history: RoundResult[]
}

export type Profile = {
  name: string
  createdAt: number
}

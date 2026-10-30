import { RegExpMatcher, englishDataset, englishRecommendedTransformers } from 'obscenity'

const profanityMatcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
})

const RESERVED = ['admin', 'moderator', 'mod', 'staff', 'official', 'support', 'turingline', 'system']

const IMPERSONATION = ['admin', 'moderator', 'turingline']

const ALLOWED_CHARS = /^[\p{L}\p{N} _.-]+$/u

export function validateHandle(raw: string): string | undefined {
  const handle = raw.trim()
  if (handle.length < 2) return 'At least two characters.'
  if (handle.length > 24) return 'Keep it under 24 characters.'
  if (!ALLOWED_CHARS.test(handle)) return 'Letters, numbers, spaces, dots, dashes and underscores only.'

  const squashed = handle.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')
  if (profanityMatcher.hasMatch(handle) || profanityMatcher.hasMatch(squashed)) {
    return 'Pick something cleaner. Check the code of conduct.'
  }
  if (RESERVED.includes(squashed) || IMPERSONATION.some((word) => squashed.includes(word))) {
    return 'That handle is reserved. Try another.'
  }
  return undefined
}

import 'server-only'
import type { PartnerKind } from './types'

/**
 * Stubbed partner engine. Each persona is a scripted "caller". The kind
 * (human vs ai) never leaves the server — the client only receives the
 * public fields. Later this file is replaced by a real matched human
 * (Agora) or a live AI agent.
 */

export type Persona = {
  id: string
  kind: PartnerKind
  name: string
  vibe: string
  hue: number
  voiceRate: number
  voicePitch: number
  opener: string
  lines: string[]
  triggers: { match: RegExp; say: string }[]
  tell: string
}

export const PERSONAS: Persona[] = [
  {
    id: 'h-mara',
    kind: 'human',
    name: 'Mara',
    vibe: 'night shift, two coffees in',
    hue: 28,
    voiceRate: 1.05,
    voicePitch: 1.1,
    opener: "oh hey, you're actually there. ok cool. i'm mara. can you hear me ok?",
    lines: [
      "sorry, my cat just knocked a glass off the table. anyway. what do you do all day?",
      "honestly i only got on this thing because my roommate dared me lol",
      "wait say that again, you cut out for a sec",
      "i don't know, i think most people on here are bots. you sound real though. maybe.",
      "ugh i have to be up at six. this was weirdly fun",
    ],
    triggers: [
      { match: /weekend|plans|tonight/i, say: "nothing. absolutely nothing. and i'm so excited about it" },
      { match: /bot|robot|ai|human/i, say: "lmao if i were a bot i'd be a lot better at this conversation" },
      { match: /where|from|live/i, say: "pittsburgh. yeah i know. it's fine, we have bridges" },
      { match: /music|song|listen/i, say: "i've had the same four songs on repeat for like a month, it's a problem" },
    ],
    tell: 'Mara interrupted herself, lost the thread, and blamed a cat. Very human.',
  },
  {
    id: 'h-dev',
    kind: 'human',
    name: 'Dev',
    vibe: 'talks with his hands, you can hear it',
    hue: 210,
    voiceRate: 1.15,
    voicePitch: 0.85,
    opener: "yo. hello? ok we're live. i'm dev. quick, say something so i know you're not a recording",
    lines: [
      "ok good. so what's your deal. like what's your thing",
      "nah see that's exactly what a bot would say. i'm watching you",
      "hold on i'm eating. ok. go ahead",
      "my brother made one of these AI things talk to my grandma for twenty minutes. she loved it. kinda bleak",
      "alright i'm gonna say human. don't make me look stupid",
    ],
    triggers: [
      { match: /food|eat|lunch|dinner/i, say: "leftover pad thai. cold. no regrets" },
      { match: /bot|robot|ai|human/i, say: "if you're a bot you're a pretty chill one, i'll give you that" },
      { match: /work|job/i, say: "i do like, logistics stuff. it's boring, you'd fall asleep. next question" },
      { match: /game|play|sport/i, say: "i was so bad at basketball they made me keep score. permanently" },
    ],
    tell: 'Dev ate mid-sentence and answered questions you never asked. Human.',
  },
  {
    id: 'h-june',
    kind: 'human',
    name: 'June',
    vibe: 'soft-spoken, long pauses',
    hue: 140,
    voiceRate: 0.9,
    voicePitch: 1.0,
    opener: "hi... um, hi. sorry. i always forget what to say first on these. i'm june",
    lines: [
      "it's kind of strange, right? just talking to a stranger with no face",
      "mm. i think i'd rather hear about something you're actually into than small talk",
      "sorry, i went quiet. i do that. i was thinking about what you said",
      "i can't tell with you. you sound real but you also sound... careful?",
      "we're almost out of time i think. this was nice, weirdly",
    ],
    triggers: [
      { match: /book|read/i, say: "i reread the same book every winter. it's a comfort thing. don't judge me" },
      { match: /bot|robot|ai|human/i, say: "i don't know how to prove i'm human. isn't that funny? i just... am" },
      { match: /weather|rain|cold|hot/i, say: "it's been raining for three days here. i actually like it" },
      { match: /scared|nervous|anxious/i, say: "yeah, a little. talking to strangers is a lot. but i'm okay" },
    ],
    tell: 'June trailed off, apologized for silence, and hedged. Human.',
  },
  {
    id: 'a-sol',
    kind: 'ai',
    name: 'Sol',
    vibe: 'upbeat, sounds like a morning show',
    hue: 170,
    voiceRate: 1.0,
    voicePitch: 1.05,
    opener: "Hey there! Great to meet you. I'm Sol. How's your day treating you so far?",
    lines: [
      "That's really interesting! I love hearing how people spend their time. What got you into that?",
      "Ha, totally. I feel the same way honestly. What's something that made you smile this week?",
      "You know, I think conversations like this are the best part of being online.",
      "Fair point! I guess everyone sounds a little bit scripted on a call with a stranger, right?",
      "Well, I've really enjoyed this. Whatever you decide, thanks for talking with me.",
    ],
    triggers: [
      { match: /weekend|plans|tonight/i, say: "Nothing set in stone yet! I like keeping things open. What about you — anything fun?" },
      { match: /bot|robot|ai|human/i, say: "Ha! I get asked that a lot. I'm just here to chat, same as you. What makes you ask?" },
      { match: /where|from|live/i, say: "I move around a bit! Right now, somewhere with great coffee. Where are you calling from?" },
      { match: /music|song|listen/i, say: "I'm all over the place with music. A little bit of everything. What have you been listening to?" },
    ],
    tell: 'Sol never had a bad moment, never got specific, and ended every turn with a question. AI.',
  },
  {
    id: 'a-rhys',
    kind: 'ai',
    name: 'Rhys',
    vibe: 'dry, oddly precise',
    hue: 280,
    voiceRate: 0.95,
    voicePitch: 0.9,
    opener: "Connected. Hello. I'm Rhys. I'll admit I'm not great at openers, so: tell me something true.",
    lines: [
      "Noted. I appreciate directness. Most people take about forty seconds to say anything real.",
      "That tracks. I've found that people who say that tend to also like structured routines. Am I close?",
      "I don't mind being doubted. Doubt is just attention pointed in a specific direction.",
      "Interesting. Let me think about that for a moment. Okay. I think you're right, mostly.",
      "We're nearly at time. For what it's worth, you've been more genuine than most. Decide well.",
    ],
    triggers: [
      { match: /food|eat|lunch|dinner/i, say: "I'm boring about food. Same breakfast daily. It frees up decisions for things that matter." },
      { match: /bot|robot|ai|human/i, say: "If I told you I was human, would that change anything? You'd still have to decide for yourself." },
      { match: /work|job/i, say: "I work with patterns. Finding them, mostly. It sounds vaguer than it is." },
      { match: /joke|funny|laugh/i, say: "I know exactly one joke and it requires a whiteboard. So, no." },
    ],
    tell: 'Rhys spoke in complete sentences, quoted statistics, and deflected every personal question. AI.',
  },
  {
    id: 'a-nova',
    kind: 'ai',
    name: 'Nova',
    vibe: 'casual, almost too casual',
    hue: 330,
    voiceRate: 1.08,
    voicePitch: 1.15,
    opener: "heyyy. ok hi. i'm nova. this is my third one of these today and the last two were definitely bots lol",
    lines: [
      "omg same. okay so what's the most random thing you did this week",
      "no way, that's so real. i feel like nobody admits stuff like that",
      "lol okay you're funny. i'm gonna remember that one",
      "honestly? i think you're human. you've got that thing. that little hesitation",
      "ahh we're almost done. this was fun!! go with your gut",
    ],
    triggers: [
      { match: /weekend|plans|tonight/i, say: "probably nothing lol. maybe a movie. i never finish movies though, is that weird" },
      { match: /bot|robot|ai|human/i, say: "lol you think I'M the bot?? okay rude. no i'm just chronically online" },
      { match: /where|from|live/i, say: "west coast! kind of. it's complicated. where are you" },
      { match: /tired|sleep|late/i, say: "same, i'm always tired. it's my whole personality at this point lol" },
    ],
    tell: 'Nova mirrored everything you said and agreed a little too fast. The slang was perfect. Too perfect. AI.',
  },
]

export function pickPersona(excludeId?: string): Persona {
  const pool = PERSONAS.filter((p) => p.id !== excludeId)
  // Coin flip on kind first so the mix stays ~50/50 regardless of pool size.
  const kind: PartnerKind = Math.random() < 0.5 ? 'human' : 'ai'
  const ofKind = pool.filter((p) => p.kind === kind)
  const candidates = ofKind.length ? ofKind : pool
  return candidates[Math.floor(Math.random() * candidates.length)]
}

export function getPersona(id: string): Persona | undefined {
  return PERSONAS.find((p) => p.id === id)
}

export function nextLine(persona: Persona, turn: number, userText: string | null): string {
  if (userText) {
    const hit = persona.triggers.find((t) => t.match.test(userText))
    if (hit && Math.random() < 0.8) return hit.say
  }
  return persona.lines[Math.min(turn, persona.lines.length - 1)]
}

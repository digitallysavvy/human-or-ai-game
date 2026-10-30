import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Radio } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Rules & Code of Conduct — Turing Line',
  description: 'How Turing Line works, how scoring is kept fair, and what gets you banned.',
}

const RULES = [
  {
    title: 'One call, one guess',
    body: 'Every round is sixty seconds with one voice. When time runs out, you lock in Human or AI. No changing your mind after the reveal.',
  },
  {
    title: 'Play it straight',
    body: 'If you\u2019re the human on the line, be yourself. Don\u2019t pretend to be a bot to throw off the other player, and don\u2019t coordinate answers with anyone.',
  },
  {
    title: 'One account per person',
    body: 'Your handle and email are tied to your spot on the leaderboard. Multiple accounts, shared accounts, or scripted play will be wiped from the board.',
  },
  {
    title: 'No outside help',
    body: 'Don\u2019t use tools, bots, or other people to figure out who you\u2019re talking to. The whole point is your ear.',
  },
]

const CONDUCT = [
  {
    title: 'No swearing at people',
    body: 'Trash talk the game, not the person. Insults, slurs, and cursing at the other player aren\u2019t allowed.',
  },
  {
    title: 'Nothing sexual',
    body: 'No sexually explicit talk, innuendo aimed at the other player, or requests of that kind. Ever.',
  },
  {
    title: 'No hate or harassment',
    body: 'No attacks on anyone\u2019s race, religion, gender, sexuality, disability, or background. No threats, no bullying.',
  },
  {
    title: 'Keep it anonymous',
    body: 'Don\u2019t ask for or share real names, addresses, phone numbers, socials, or anything that identifies someone.',
  },
  {
    title: 'Don\u2019t steer it somewhere dark',
    body: 'No talk of self-harm, violence, or illegal activity. If someone seems to be in real trouble, end the call and report it.',
  },
]

const ENFORCEMENT = [
  { level: 'Warning', body: 'A first minor slip. Your rounds still count.' },
  { level: 'Suspension', body: 'Repeat or serious breaks. You\u2019re off the line and the leaderboard for a set time.' },
  { level: 'Ban', body: 'Sexual content, hate, threats, or cheating. Your account and scores are removed for good.' },
]

export default function RulesPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col border-foreground sm:border-x-2">
      <header className="grid grid-cols-[auto_1fr_auto] items-stretch border-b-2 border-foreground">
        <Link
          href="/"
          className="flex items-center gap-3 border-r-2 border-foreground px-5 py-4 text-sm font-black tracking-tight uppercase outline-none focus-visible:bg-foreground focus-visible:text-background"
        >
          <Radio className="size-5" aria-hidden />
          Turing Line
        </Link>
        <p className="hidden items-center justify-center font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase md:flex">
          Keep it fun · Keep it clean
        </p>
        <Link
          href="/"
          className="flex items-center gap-2 border-l-2 border-foreground px-5 font-mono text-xs tracking-[0.2em] uppercase outline-none hover:bg-foreground hover:text-background focus-visible:bg-foreground focus-visible:text-background"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back
        </Link>
      </header>

      <section className="flex flex-col gap-4 border-b-2 border-foreground px-5 py-10 sm:px-8">
        <h1 className="text-[clamp(2.75rem,7vw,6rem)] leading-[0.85] font-black tracking-[-0.05em] uppercase">
          House
          <br />
          <span className="text-outline">rules.</span>
        </h1>
        <p className="max-w-xl text-base leading-snug text-pretty text-muted-foreground">
          Turing Line is a game. It only works if every call feels safe to pick up. Joining means you agree to
          everything on this page.
        </p>
      </section>

      <RuleSection id="rules" label="01 / How to play fair" items={RULES} />
      <RuleSection id="conduct" label="02 / Code of conduct" items={CONDUCT} />

      <section aria-labelledby="enforcement-heading" className="border-b-2 border-foreground">
        <div className="border-b-2 border-foreground px-5 py-2 font-mono text-xs tracking-[0.25em] uppercase">
          <h2 id="enforcement-heading">03 / What happens if you break them</h2>
        </div>
        <ol className="grid divide-y-2 divide-foreground sm:grid-cols-3 sm:divide-x-2 sm:divide-y-0">
          {ENFORCEMENT.map((step) => (
            <li key={step.level} className="flex flex-col gap-2 p-6">
              <p className="text-2xl font-black tracking-tight uppercase">{step.level}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
        <p className="border-t-2 border-foreground px-5 py-4 text-sm leading-relaxed text-muted-foreground sm:px-8">
          Calls may be reviewed when a player is reported. Moderators make the final call on every report.
        </p>
      </section>

      <div className="flex flex-col items-start gap-4 border-b-2 border-foreground px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="text-xl font-black tracking-tight uppercase">Got it? The line is open.</p>
        <Link
          href="/"
          className="btn-brut flex h-12 items-center bg-foreground px-5 font-black tracking-tight text-background uppercase outline-none focus-visible:ring-4 focus-visible:ring-ring"
        >
          Join the game
        </Link>
      </div>

      <footer className="flex items-center justify-between px-5 py-4 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
        <span>Turing Line</span>
        <span>Be curious · Be kind</span>
      </footer>
    </main>
  )
}

function RuleSection({
  id,
  label,
  items,
}: {
  id: string
  label: string
  items: { title: string; body: string }[]
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-4 border-b-2 border-foreground">
      <div className="border-b-2 border-foreground px-5 py-2 font-mono text-xs tracking-[0.25em] uppercase">
        <h2 id={`${id}-heading`}>{label}</h2>
      </div>
      <ol className="divide-y-2 divide-foreground">
        {items.map((item, i) => (
          <li key={item.title} className="grid gap-2 px-5 py-5 sm:grid-cols-[4rem_16rem_1fr] sm:items-baseline sm:gap-6 sm:px-8">
            <span className="font-mono text-sm font-bold text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
            <p className="text-lg font-black tracking-tight uppercase">{item.title}</p>
            <p className="text-sm leading-relaxed text-pretty text-muted-foreground">{item.body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

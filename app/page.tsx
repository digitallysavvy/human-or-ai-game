import { Radio } from 'lucide-react'
import { ActivePlayers } from '@/components/active-players'
import { HeroOrb } from '@/components/hero-orb'
import { JoinForm } from '@/components/join-form'

const TELLS = [
  'too-perfect grammar',
  'answers a beat too fast',
  'never says um',
  'laughs at the wrong time',
  'knows too much',
  'ends every line with a question',
  'forgets what you said',
  'eats mid-sentence',
  'apologizes for silence',
  'agrees a little too quickly',
]

const STEPS = [
  { n: '01', title: 'Get connected', body: 'You\u2019re matched with a random voice. No face. No profile.' },
  { n: '02', title: 'Talk for a minute', body: 'Ask anything. Listen for the tells.' },
  { n: '03', title: 'Call it', body: 'Human or AI. The reveal is instant. Then you&apos;re matched again.' },
]

export default function JoinPage() {
  return (
    <main className="relative mx-auto flex min-h-dvh w-full max-w-7xl flex-col overflow-hidden px-5 sm:px-8">
      <div className="flex items-center justify-between py-5">
        <div className="flex items-center gap-2.5 text-sm font-semibold tracking-tight">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Radio className="size-4" aria-hidden />
          </span>
          Turing Line
        </div>
        <ActivePlayers />
      </div>

      <section className="grid flex-1 items-center gap-10 py-8 lg:grid-cols-[1.05fr_1fr] lg:gap-6">
        <div className="flex flex-col gap-9">
          <div className="flex flex-col gap-5">
            <p className="text-xs tracking-[0.28em] text-primary uppercase">Voice roulette</p>
            <h1 className="text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.92] font-semibold tracking-[-0.03em] text-balance">
              Human or AI?
              <br />
              <span className="font-serif font-normal text-primary italic">You decide.</span>
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-pretty text-muted-foreground">
              Get connected to a stranger&apos;s voice. Talk for sixty seconds. Then make the call.
            </p>
          </div>

          <div className="glass max-w-md rounded-2xl p-5 sm:p-6">
            <JoinForm />
          </div>
        </div>

        <div className="flex items-center justify-center lg:justify-end">
          <HeroOrb />
        </div>
      </section>

      <div className="relative -mx-5 overflow-hidden border-y py-3 text-sm whitespace-nowrap sm:-mx-8" aria-label="Tells to listen for">
        <div className="marquee flex w-max gap-10">
          {[...TELLS, ...TELLS].map((tell, i) => (
            <span key={i} className="flex items-center gap-10 text-muted-foreground">
              <span className="font-serif text-lg italic">{tell}</span>
              <span className="size-1 rounded-full bg-primary" aria-hidden />
            </span>
          ))}
        </div>
      </div>

      <ol className="grid gap-6 py-10 sm:grid-cols-3">
        {STEPS.map((step) => (
          <li key={step.n} className="flex gap-4">
            <span className="font-serif text-3xl text-primary italic">{step.n}</span>
            <div className="flex flex-col gap-1">
              <p className="font-medium">{step.title}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </main>
  )
}

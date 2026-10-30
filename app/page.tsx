import Link from 'next/link'
import { Radio } from 'lucide-react'
import { ActivePlayers } from '@/components/active-players'
import { HeroOrb } from '@/components/hero-orb'
import { JoinForm } from '@/components/join-form'

const TELLS = [
  'They never once said \u201cum\u201d',
  'They laughed half a beat late',
  'They remembered everything',
  'They paused before every answer',
  'They knew the exact date',
  'They agreed too fast',
  'They sounded tired',
  'They changed the subject',
  'They asked how I was \u2014 twice',
  'They apologized for nothing',
]

const STEPS = [
  {
    n: '01',
    title: 'Pick up',
    body: 'A random voice answers. No name, no face, no hints \u2014 just whoever, or whatever, is on the line.',
  },
  {
    n: '02',
    title: 'Pry',
    body: 'Sixty seconds. Ask what a machine can\u2019t fake. Listen for what a person can\u2019t hide.',
  },
  {
    n: '03',
    title: 'Make the call',
    body: 'Human or AI. Lock it in and the truth drops instantly. Then the next line rings.',
  },
]

export default function JoinPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col border-foreground sm:border-x-2">
      <header className="grid grid-cols-[auto_1fr_auto] items-stretch border-b-2 border-foreground">
        <div className="flex items-center gap-3 border-r-2 border-foreground px-5 py-4 text-sm font-black tracking-tight uppercase">
          <Radio className="size-5" aria-hidden />
          Turing Line
        </div>
        <p className="hidden items-center justify-center font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase md:flex">
          One voice · One minute · One guess
        </p>
        <ActivePlayers className="border-l-2 border-foreground px-5" />
      </header>

      <section className="grid flex-1 border-b-2 border-foreground lg:grid-cols-[1.15fr_1fr]">
        <div className="flex flex-col border-b-2 border-foreground lg:border-r-2 lg:border-b-0">
          <CellHeader left="01 / The line is open" right="Someone is waiting" />
          <div className="grid flex-1 items-center gap-6 px-5 py-8 sm:grid-cols-[1fr_auto] sm:px-8">
            <div className="flex flex-col gap-4">
              <h1 className="text-[clamp(3rem,7.5vw,7rem)] leading-[0.85] font-black tracking-[-0.05em] uppercase">
                Human
                <br />
                or AI?
                <br />
                <span className="text-outline">You decide.</span>
              </h1>
              <p className="max-w-sm text-base leading-snug text-pretty text-muted-foreground">
                A stranger picks up. They hesitate, laugh at your joke, ask about your day. Maybe
                they mean it. Maybe they were built to. You have sixty seconds to find out.
              </p>
            </div>
            <div className="flex justify-center">
              <HeroOrb />
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <CellHeader left="02 / Take the call" right="Your streak starts now" />
          <div className="flex flex-1 flex-col justify-center px-5 py-8 sm:px-8">
            <JoinForm />
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-b-2 border-foreground py-3 font-mono text-sm tracking-wide uppercase" aria-label="What players swear gave it away">
        <div className="marquee flex w-max">
          {[...TELLS, ...TELLS].map((tell, i) => (
            <span key={i} className="flex items-center">
              <span className="px-6">{tell}</span>
              <span className="size-2 bg-foreground" aria-hidden />
            </span>
          ))}
        </div>
      </div>

      <ol className="grid divide-y-2 divide-foreground border-b-2 border-foreground sm:grid-cols-3 sm:divide-x-2 sm:divide-y-0">
        {STEPS.map((step) => (
          <li key={step.n} className="flex flex-col gap-4 p-6">
            <span className="font-mono text-5xl font-bold tracking-tighter">{step.n}</span>
            <div className="flex flex-col gap-1">
              <p className="text-lg font-black tracking-tight uppercase">{step.title}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <footer className="flex items-center justify-between px-5 py-4 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
        <span>Turing Line</span>
        <Link href="/rules" className="underline-offset-4 outline-none hover:text-foreground hover:underline focus-visible:text-foreground focus-visible:underline">
          Rules &amp; code of conduct
        </Link>
      </footer>
    </main>
  )
}

function CellHeader({ left, right }: { left: string; right: string }) {
  return (
    <div className="flex items-center justify-between border-b-2 border-foreground px-5 py-2 font-mono text-xs tracking-[0.25em] uppercase">
      <span>{left}</span>
      <span className="text-muted-foreground">{right}</span>
    </div>
  )
}

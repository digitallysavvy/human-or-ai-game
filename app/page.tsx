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
  { n: '03', title: 'Call it', body: 'Human or AI. The reveal is instant. Then you\u2019re matched again.' },
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
          Voice roulette · 60-second rounds · No faces
        </p>
        <ActivePlayers className="border-l-2 border-foreground px-5" />
      </header>

      <section className="grid flex-1 border-b-2 border-foreground lg:grid-cols-[1.15fr_1fr]">
        <div className="flex flex-col border-b-2 border-foreground lg:border-r-2 lg:border-b-0">
          <CellHeader left="01 / The question" right="Sixty seconds. One call." />
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
                Get connected to a stranger&apos;s voice. Talk for sixty seconds. Then make the call.
              </p>
            </div>
            <div className="flex justify-center">
              <HeroOrb />
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <CellHeader left="02 / Enter" right="Scores stay on device" />
          <div className="flex flex-1 flex-col justify-center px-5 py-8 sm:px-8">
            <JoinForm />
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-b-2 border-foreground py-3 font-mono text-sm tracking-wide uppercase" aria-label="Tells to listen for">
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
        <span>No accounts · No recordings</span>
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

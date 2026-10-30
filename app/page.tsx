import { Bot, Mic, Timer, UserRound } from 'lucide-react'
import { JoinForm } from '@/components/join-form'

const STEPS = [
  { icon: Mic, title: 'Get on the line', body: 'Voice only. No faces, no names you can trust.' },
  { icon: Timer, title: 'Talk for sixty seconds', body: 'Ask anything. Listen for the tells.' },
  { icon: UserRound, title: 'Call it', body: 'Human or AI. Then the line connects you to the next caller.' },
]

export default function JoinPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-5 py-8 sm:px-8">
      <div className="flex items-center gap-2.5 text-sm font-semibold tracking-tight">
        <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Mic className="size-4" aria-hidden />
        </span>
        Turing Line
      </div>

      <section className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-5">
            <p className="font-mono text-xs tracking-[0.2em] text-primary uppercase">Voice roulette</p>
            <h1 className="text-5xl leading-[0.95] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
              Somebody&apos;s on the line.
              <br />
              <span className="text-muted-foreground">Or something.</span>
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-pretty text-muted-foreground">
              You get connected to a random voice. You talk for a minute. Then you decide: human, or AI? Call it right
              and keep your streak alive.
            </p>
          </div>

          <ul className="grid gap-4 sm:grid-cols-3">
            {STEPS.map((step) => (
              <li key={step.title} className="flex flex-col gap-2 rounded-xl border bg-card/60 p-4">
                <step.icon className="size-5 text-primary" aria-hidden />
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-6 rounded-2xl border bg-card p-6 shadow-2xl shadow-black/40 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-human/15 text-human">
              <UserRound className="size-5" aria-hidden />
            </span>
            <span className="font-mono text-xs text-muted-foreground">vs</span>
            <span className="flex size-10 items-center justify-center rounded-full bg-bot/15 text-bot">
              <Bot className="size-5" aria-hidden />
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <h2 className="text-xl font-semibold tracking-tight">Pick a handle</h2>
            <p className="text-sm text-muted-foreground">
              It&apos;s what the other caller hears. Scores are saved on this device.
            </p>
          </div>
          <JoinForm />
        </div>
      </section>
    </main>
  )
}

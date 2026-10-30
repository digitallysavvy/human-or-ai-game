import { AppHeader } from '@/components/app-header'
import { CallFlow } from '@/components/call/call-flow'
import { RequireProfile } from '@/components/require-profile'

export default function CallPage() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col border-foreground sm:border-x-2">
      <AppHeader />
      <main className="flex flex-1 flex-col px-5 pb-8 sm:px-8">
        <RequireProfile>
          <CallFlow />
        </RequireProfile>
      </main>
    </div>
  )
}

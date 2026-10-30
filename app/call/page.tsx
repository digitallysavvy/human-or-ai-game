import { AppHeader } from '@/components/app-header'
import { CallFlow } from '@/components/call/call-flow'
import { RequireProfile } from '@/components/require-profile'

export default function CallPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 pb-8 sm:px-8">
        <RequireProfile>
          <CallFlow />
        </RequireProfile>
      </main>
    </div>
  )
}

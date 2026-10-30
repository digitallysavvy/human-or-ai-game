import { AppHeader } from '@/components/app-header'
import { LobbyView } from '@/components/lobby/lobby-view'
import { RequireProfile } from '@/components/require-profile'

export default function LobbyPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 pb-12 sm:px-8">
        <RequireProfile>
          <LobbyView />
        </RequireProfile>
      </main>
    </div>
  )
}

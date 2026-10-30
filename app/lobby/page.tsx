import { AppHeader } from '@/components/app-header'
import { LobbyView } from '@/components/lobby/lobby-view'
import { RequireProfile } from '@/components/require-profile'

export default function LobbyPage() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col border-foreground sm:border-x-2">
      <AppHeader />
      <main className="flex flex-1 flex-col">
        <RequireProfile>
          <LobbyView />
        </RequireProfile>
      </main>
    </div>
  )
}

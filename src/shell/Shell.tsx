import { useState, useCallback, Suspense } from 'react'
import type { ShellWorkspace, ShellTopic } from './types'
import { useTheme } from './hooks/useTheme'
import { Gallery } from './screens/Gallery/Gallery'
import { Settings } from './screens/Settings/Settings'
import { TopBar } from './components/TopBar/TopBar'

import './styles/tokens.css'
import './styles/reset.css'
import './styles/typography.css'

type ShellScreen = 'home' | 'topic' | 'workspace' | 'settings'

interface ShellProps {
  topics: ShellTopic[]
  workspaces: ShellWorkspace[]
  loading?: boolean
}

export function Shell({ topics, workspaces, loading }: ShellProps) {
  const { mode, resolved, setMode } = useTheme()
  const [screen, setScreen] = useState<ShellScreen>('home')
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null)
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null)

  const activeWorkspace = activeWorkspaceId
    ? workspaces.find((w) => w.id === activeWorkspaceId)
    : null

  const WorkspaceComponent = activeWorkspace?.component

  const handleToggleTheme = useCallback(() => {
    setMode(resolved === 'dark' ? 'light' : 'dark')
  }, [resolved, setMode])

  const handleSelectTopic = useCallback((topicId: string) => {
    setActiveTopicId(topicId)
    setScreen('topic')
  }, [])

  const handleSelectWorkspace = useCallback((id: string) => {
    setActiveWorkspaceId(id)
    setScreen('workspace')
  }, [])

  const handleBackToTopics = useCallback(() => {
    setActiveTopicId(null)
    setScreen('home')
  }, [])

  const handleBackToTopicList = useCallback(() => {
    setActiveWorkspaceId(null)
    setScreen('topic')
  }, [])

  const handleOpenSettings = useCallback(() => {
    setScreen('settings')
  }, [])

  const handleBackFromSettings = useCallback(() => {
    setScreen('home')
  }, [])

  if (screen === 'workspace' && WorkspaceComponent) {
    return (
      <div data-theme={resolved}>
        <div className="bgd-shell">
          <TopBar showBack onBack={handleBackToTopicList} title={activeWorkspace?.name} />
        </div>
        <div style={{ paddingTop: 'var(--shell-topbar-height)' }}>
          <Suspense
            fallback={
              <div
                style={{
                  minHeight: '100vh',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#ffffff',
                }}
              >
                <span
                  style={{
                    fontSize: '16px',
                    color: '#6c757d',
                    fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
                  }}
                >
                  Loading workspace...
                </span>
              </div>
            }
          >
            <WorkspaceComponent />
          </Suspense>
        </div>
      </div>
    )
  }

  return (
    <div className="bgd-shell" data-theme={resolved} style={{ minHeight: '100vh' }}>
      {screen === 'settings' ? (
        <Settings
          workspaceCount={workspaces.length}
          onBack={handleBackFromSettings}
        />
      ) : (
        <Gallery
          topics={topics}
          workspaces={workspaces}
          loading={loading}
          themeMode={mode}
          resolved={resolved}
          onToggleTheme={handleToggleTheme}
          onSelectTopic={handleSelectTopic}
          onSelectWorkspace={handleSelectWorkspace}
          onOpenSettings={handleOpenSettings}
          onBackToTopics={handleBackToTopics}
          activeTopicId={screen === 'topic' ? activeTopicId : null}
        />
      )}
    </div>
  )
}

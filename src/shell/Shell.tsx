import { useState, useCallback, Suspense } from 'react'
import type { ShellWorkspace, ShellTopic } from './types'
import { useTheme } from './hooks/useTheme'
import { Gallery } from './screens/Gallery/Gallery'
import { Settings } from './screens/Settings/Settings'
import { TopBar } from './components/TopBar/TopBar'

import './styles/moving-parts-tokens.css'
import './styles/moving-parts-reset.css'
import './styles/moving-parts-typography.css'
import './styles/moving-parts-components.css'

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
      <div className="moving-parts-shell" data-theme={resolved}>
        <TopBar onToggleTheme={handleToggleTheme} themeIsDark={resolved === 'dark'} />
        <div className="mp-container" style={{ paddingTop: 'var(--mp-space-12)', paddingBottom: 'var(--mp-space-12)' }}>
          <button
            type="button"
            className="btn-ghost"
            onClick={handleBackToTopicList}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--mp-space-4)' }}
          >
            ← {activeWorkspace?.name}
          </button>
        </div>
        <Suspense
          fallback={
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60vh',
            }}>
              <span className="mp-mono">Loading workspace...</span>
            </div>
          }
        >
          <WorkspaceComponent />
        </Suspense>
      </div>
    )
  }

  return (
    <div className="moving-parts-shell" data-theme={resolved} style={{ minHeight: '100vh' }}>
      <TopBar onToggleTheme={handleToggleTheme} themeIsDark={resolved === 'dark'} />
      <div className="mp-container" style={{ paddingTop: 'var(--mp-space-16)' }}>
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
            activeTopicId={screen === 'topic' ? activeTopicId : null}
            onSelectTopic={handleSelectTopic}
            onSelectWorkspace={handleSelectWorkspace}
            onOpenSettings={handleOpenSettings}
            onBackToTopics={handleBackToTopics}
          />
        )}
      </div>
    </div>
  )
}

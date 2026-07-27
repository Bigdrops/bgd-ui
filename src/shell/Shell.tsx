import { useState, useCallback, useMemo, Suspense } from 'react'
import { Eye, Code, FileText, ArrowLeft } from 'lucide-react'
import type { ShellWorkspace, ShellTopic } from './types'
import { useTheme } from './hooks/useTheme'
import { Gallery } from './screens/Gallery/Gallery'
import { Settings } from './screens/Settings/Settings'
import { TopBar } from './components/TopBar/TopBar'
import { getComponentById, getRawFileContent } from '@/lib/component-registry'
import { SourceFileList } from '@/components/ui/source-file-list'
import { MarkdownViewer } from '@/components/ui/markdown-viewer'

import './styles/moving-parts-tokens.css'
import './styles/moving-parts-reset.css'
import './styles/moving-parts-typography.css'
import './styles/moving-parts-components.css'
import './workspace-preview.css'

type ShellScreen = 'home' | 'topic' | 'workspace' | 'settings'
type WorkspaceTab = 'preview' | 'code' | 'design'

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
  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>('preview')

  const activeWorkspace = activeWorkspaceId
    ? workspaces.find((w) => w.id === activeWorkspaceId)
    : null

  const WorkspaceComponent = activeWorkspace?.component

  const registryEntry = useMemo(() => {
    if (!activeWorkspace?.registryId) return null
    return getComponentById(activeWorkspace.registryId) ?? null
  }, [activeWorkspace?.registryId])

  const handleToggleTheme = useCallback(() => {
    setMode(resolved === 'dark' ? 'light' : 'dark')
  }, [resolved, setMode])

  const handleSelectTopic = useCallback((topicId: string) => {
    setActiveTopicId(topicId)
    setScreen('topic')
  }, [])

  const handleSelectWorkspace = useCallback((id: string) => {
    setActiveWorkspaceId(id)
    setWorkspaceTab('preview')
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
    const hasFiles = registryEntry && registryEntry.files.length > 0
    const hasDesign = registryEntry && registryEntry.designFile !== null

    return (
      <div className="moving-parts-shell" data-theme={resolved}>
        <TopBar onToggleTheme={handleToggleTheme} themeIsDark={resolved === 'dark'} />

        <div className="mp-container workspace-toolbar">
          <button
            type="button"
            className="btn-ghost"
            onClick={handleBackToTopicList}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--mp-space-4)' }}
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          <div className="workspace-tabs">
            <button
              className={`workspace-tab ${workspaceTab === 'preview' ? 'workspace-tab--active' : ''}`}
              onClick={() => setWorkspaceTab('preview')}
            >
              <Eye size={15} />
              <span>Preview</span>
            </button>
            <button
              className={`workspace-tab ${workspaceTab === 'code' ? 'workspace-tab--active' : ''}`}
              onClick={() => setWorkspaceTab('code')}
            >
              <Code size={15} />
              <span>Code</span>
            </button>
            <button
              className={`workspace-tab ${workspaceTab === 'design' ? 'workspace-tab--active' : ''}`}
              onClick={() => setWorkspaceTab('design')}
            >
              <FileText size={15} />
              <span>Design.md</span>
            </button>
          </div>
        </div>

        <div className="workspace-preview">
          {workspaceTab === 'preview' && (
            <Suspense
              fallback={
                <div className="workspace-loading">
                  <span className="mp-mono">Loading workspace...</span>
                </div>
              }
            >
              <WorkspaceComponent />
            </Suspense>
          )}

          {workspaceTab === 'code' && (
            <div className="mp-container workspace-tab-content">
              {hasFiles ? (
                <SourceFileList
                  files={registryEntry!.files}
                  getContent={getRawFileContent}
                />
              ) : (
                <div className="workspace-empty">
                  <Code size={32} strokeWidth={1.5} />
                  <p>No source files registered for this workspace.</p>
                </div>
              )}
            </div>
          )}

          {workspaceTab === 'design' && (
            <div className="mp-container workspace-tab-content">
              {hasDesign ? (
                <MarkdownViewer
                  content={getRawFileContent(registryEntry!.designFile!) ?? ''}
                  filename={registryEntry!.designFile!.split('/').pop() ?? registryEntry!.designFile!}
                />
              ) : (
                <div className="workspace-empty">
                  <FileText size={32} strokeWidth={1.5} />
                  <p>No design.md available for this workspace.</p>
                </div>
              )}
            </div>
          )}
        </div>
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

import type { ThemeMode } from '../../types'
import type { ShellTopic, ShellWorkspace } from '../../types'
import { TopBar } from '../../components/TopBar/TopBar'
import { WorkspaceCard } from '../../components/WorkspaceCard/WorkspaceCard'
import { EmptyState } from '../../components/EmptyState/EmptyState'
import { LoadingState } from '../../components/LoadingState/LoadingState'
import styles from './Gallery.module.css'

interface GalleryProps {
  topics: ShellTopic[]
  workspaces: ShellWorkspace[]
  loading?: boolean
  themeMode: ThemeMode
  resolved: 'light' | 'dark'
  onToggleTheme: () => void
  onSelectTopic: (topicId: string) => void
  onSelectWorkspace: (id: string) => void
  onOpenSettings: () => void
  onBackToTopics: () => void
  activeTopicId: string | null
}

export function Gallery({
  topics,
  workspaces,
  loading,
  themeMode,
  resolved,
  onToggleTheme,
  onSelectTopic,
  onSelectWorkspace,
  onOpenSettings,
  onBackToTopics,
  activeTopicId,
}: GalleryProps) {
  if (activeTopicId) {
    const topic = topics.find((t) => t.id === activeTopicId)
    if (!topic) return null

    return (
      <>
        <TopBar showBack onBack={onBackToTopics} />
        <main className={styles.page}>
          <h2 className="shell-heading" style={{ marginBottom: 'var(--shell-spacing-lg)' }}>
            {topic.name}
          </h2>
          <div className={styles.list}>
            {topic.workspaces.map((entry) => {
              const ws = workspaces.find((w) => w.id === entry.id)
              return (
                <WorkspaceCard
                  key={entry.id}
                  name={entry.name}
                  description={entry.description}
                  onClick={() => onSelectWorkspace(entry.id)}
                />
              )
            })}
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <TopBar showThemeToggle themeIsDark={resolved === 'dark'} onToggleTheme={onToggleTheme} />
      <main className={styles.page}>
        <h1 className="shell-display" style={{ marginBottom: 'var(--shell-spacing-xl)' }}>
          WORKSPACES
        </h1>

        {loading ? (
          <LoadingState />
        ) : topics.length === 0 ? (
          <EmptyState />
        ) : (
          <div className={styles.list}>
            {topics.map((topic) => (
              <button
                key={topic.id}
                type="button"
                className={styles.topicRow}
                onClick={() => onSelectTopic(topic.id)}
                aria-label={`${topic.name} workspaces`}
              >
                <span className={styles.topicName}>{topic.name}</span>
                <span className={styles.topicArrow}>→</span>
              </button>
            ))}
          </div>
        )}

        <button type="button" className={styles.settingsLink} onClick={onOpenSettings}>
          Settings
        </button>
      </main>
    </>
  )
}

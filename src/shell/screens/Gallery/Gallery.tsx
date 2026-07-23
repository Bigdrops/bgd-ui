import { useState, useMemo } from 'react'
import { ArrowLeft, Search, Settings } from 'lucide-react'
import type { ShellTopic, ShellWorkspace } from '../../types'

interface GalleryProps {
  topics: ShellTopic[]
  workspaces: ShellWorkspace[]
  loading?: boolean
  activeTopicId: string | null
  onSelectTopic: (topicId: string) => void
  onSelectWorkspace: (id: string) => void
  onBackToTopics: () => void
  onOpenSettings: () => void
}

export function Gallery({
  topics,
  workspaces,
  loading,
  activeTopicId,
  onSelectTopic,
  onSelectWorkspace,
  onBackToTopics,
  onOpenSettings,
}: GalleryProps) {
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [category, setCategory] = useState('all')

  if (activeTopicId) {
    const topic = topics.find((t) => t.id === activeTopicId)
    if (!topic) return null

    const topicWorkspaces = workspaces.filter((w) =>
      topic.workspaces.some((e) => e.id === w.id)
    )

    const categories = useMemo(
      () => ['all', ...Array.from(new Set(topicWorkspaces.map((w) => w.category.toLowerCase())))],
      [topicWorkspaces]
    )

    const filtered = topicWorkspaces.filter((w) => {
      const matchesCategory = category === 'all' || w.category.toLowerCase() === category
      const q = query.toLowerCase().trim()
      const matchesQuery = q === '' || w.name.toLowerCase().includes(q) || w.description.toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })

    return (
      <div className="mp-section" style={{ paddingTop: 0 }}>
        <button
          type="button"
          className="btn-ghost"
          onClick={onBackToTopics}
          style={{ marginBottom: 'var(--mp-space-16)' }}
        >
          <ArrowLeft size={18} />
          All workspaces
        </button>

        <div className={`mp-search ${searchOpen ? 'visible' : ''}`}>
          <span className="mp-search-icon"><Search size={18} /></span>
          <input
            type="text"
            placeholder="Search workspaces…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSearchOpen(true) }}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => { if (!query) setSearchOpen(false) }}
            aria-label="Search workspaces"
          />
        </div>

        <div className="mp-section-label">
          <h2>{topic.name}</h2>
          <span>{filtered.length} {filtered.length === 1 ? 'shot' : 'shots'}</span>
        </div>

        <div className="mp-categories">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              className={`mp-category-pill ${category === c ? 'active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="mp-mono">Loading workspaces…</p>
        ) : filtered.length === 0 ? (
          <div className="mp-empty">
            <p>No workspaces match your search</p>
          </div>
        ) : (
          <div className="mp-shot-grid" role="list">
            {filtered.map((ws) => (
              <article
                key={ws.id}
                role="listitem"
                tabIndex={0}
                className="mp-shot"
                onClick={() => onSelectWorkspace(ws.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectWorkspace(ws.id) } }}
              >
                <div
                  className="shot-preview"
                  style={{ '--shot-bg': ws.accentColor ?? 'var(--mp-color-chalk)', '--shot-accent': ws.accentColor ?? 'var(--mp-color-electric)' } as React.CSSProperties}
                >
                  <div className="product-mock">
                    <div className="mock-content">
                      <div className="line w-80" />
                      <div className="line w-60" />
                      <div className="line w-40" />
                    </div>
                  </div>
                </div>
                <div className="shot-meta">
                  <div className="shot-top">
                    <span className={`shot-status ${ws.status !== 'active' ? 'is-planned' : ''}`}>
                      {ws.status === 'active' ? 'Live' : 'In development'}
                    </span>
                  </div>
                  <h3 className="shot-name">{ws.name}</h3>
                  <p className="shot-domain">{ws.category} · {ws.description}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="mp-section" style={{ paddingTop: 0 }}>
      <div className="mp-section-label">
        <h2>Workspace Gallery</h2>
        <span>{topics.reduce((s, t) => s + t.workspaces.length, 0)} total</span>
      </div>

      {loading ? (
        <p className="mp-mono">Loading workspaces…</p>
      ) : topics.length === 0 ? (
        <div className="mp-empty">
          <p>No workspaces available</p>
        </div>
      ) : (
        <div className="mp-shot-grid" role="list">
          {topics.map((topic) => (
            <article
              key={topic.id}
              role="listitem"
              tabIndex={0}
              className="mp-shot"
              onClick={() => onSelectTopic(topic.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectTopic(topic.id) } }}
            >
              <div className="shot-preview" style={{ '--shot-bg': 'var(--mp-color-electric)', '--shot-accent': 'var(--mp-color-electric)' } as React.CSSProperties}>
                <div className="product-mock">
                  <div className="mock-content">
                    <div className="line w-80" />
                    <div className="line w-60" />
                    <div className="line w-40" />
                  </div>
                </div>
              </div>
              <div className="shot-meta">
                <div className="shot-top">
                  <span className="shot-status">{topic.workspaces.length} {topic.workspaces.length === 1 ? 'workspace' : 'workspaces'}</span>
                </div>
                <h3 className="shot-name">{topic.name}</h3>
                <p className="shot-domain">{topic.workspaces.map((w) => w.name).join(', ')}</p>
              </div>
            </article>
          ))}
        </div>
      )}

      <div style={{ marginTop: 'var(--mp-space-32)', textAlign: 'center' }}>
        <button type="button" className="btn-ghost" onClick={onOpenSettings}>
          <Settings size={18} />
          Settings
        </button>
      </div>
    </div>
  )
}

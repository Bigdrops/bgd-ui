import { lazy, useState, useCallback } from 'react'
import { Shell } from './shell'
import type { ShellWorkspace, ShellTopic } from './shell'
import { Landing } from './landing'
import { ComponentsPage } from './pages/components'
import { WorkspacesPage } from './pages/workspaces'
import { DocsPage } from './pages/docs'

const PRAVInvoice = lazy(() => import('./workspaces/invoice/prav/InvoiceWorkspace'))
const AMRAInvoice = lazy(() => import('./workspaces/invoice/amra/InvoiceWorkspace'))
const RunwayInvoice = lazy(() => import('./workspaces/invoice/runway/InvoiceWorkspace'))
const PostHogInvoice = lazy(() => import('./workspaces/invoice/posthog/InvoiceWorkspace'))
const NuriInvoice = lazy(() => import('./workspaces/invoice/nuri/InvoiceWorkspace'))

const WORKSPACES: ShellWorkspace[] = [
  {
    id: 'invoice-prav',
    name: 'PRAV',
    description: 'Engineering dossier | warm parchment, ink-black hierarchy, 4px radius',
    icon: 'receipt',
    category: 'Invoice',
    status: 'active',
    accentColor: '#6C5CE7',
    component: PRAVInvoice,
  },
  {
    id: 'invoice-amra',
    name: 'AMRA',
    description: 'Monochrome minimal | white canvas, lavender accent, 44px radius',
    icon: 'grid',
    category: 'Invoice',
    status: 'active',
    accentColor: '#00B894',
    component: AMRAInvoice,
  },
  {
    id: 'invoice-runway',
    name: 'Runway',
    description: 'Kraft paper ledger | cream canvas, espresso ink, amber accent, 8px radius',
    icon: 'file-text',
    category: 'Invoice',
    status: 'active',
    accentColor: '#FDCB6E',
    component: RunwayInvoice,
  },
  {
    id: 'invoice-posthog',
    name: 'PostHog',
    description: 'Corkboard desktop | sandy beige canvas, deep moss ink, amber accent, 4px radius',
    icon: 'layout',
    category: 'Invoice',
    status: 'active',
    accentColor: '#E17055',
    component: PostHogInvoice,
  },
  {
    id: 'invoice-nuri',
    name: 'Nuri',
    description: 'Art-deco fintech | lavender canvas, ink-plum text, violet cards, pill shapes',
    icon: 'grid',
    category: 'Invoice',
    status: 'active',
    accentColor: '#0984E3',
    component: NuriInvoice,
  },
]

const TOPICS: ShellTopic[] = [
  {
    id: 'invoice',
    name: 'Invoice',
    workspaces: WORKSPACES.map((w) => ({ id: w.id, name: w.name, description: w.description })),
  },
]

type Page = 'landing' | 'components' | 'workspaces' | 'docs' | 'shell'

export default function App() {
  const [page, setPage] = useState<Page>('landing')

  const navigateToShell = useCallback(() => setPage('shell'), [])
  const navigateToLanding = useCallback(() => setPage('landing'), [])
  const navigateToComponents = useCallback(() => setPage('components'), [])
  const navigateToWorkspaces = useCallback(() => setPage('workspaces'), [])
  const navigateToDocs = useCallback(() => setPage('docs'), [])

  if (page === 'landing') {
    return <Landing onNavigateToShell={navigateToShell} />
  }

  if (page === 'components') {
    return (
      <ShellPage
        currentPage="components"
        onNavigateToLanding={navigateToLanding}
        onNavigate={setPage}
      >
        <ComponentsPage />
      </ShellPage>
    )
  }

  if (page === 'workspaces') {
    return (
      <ShellPage
        currentPage="workspaces"
        onNavigateToLanding={navigateToLanding}
        onNavigate={setPage}
      >
        <WorkspacesPage />
      </ShellPage>
    )
  }

  if (page === 'docs') {
    return (
      <ShellPage
        currentPage="docs"
        onNavigateToLanding={navigateToLanding}
        onNavigate={setPage}
      >
        <DocsPage />
      </ShellPage>
    )
  }

  return (
    <ShellPage
      currentPage="shell"
      onNavigateToLanding={navigateToLanding}
      onNavigate={setPage}
    >
      <Shell topics={TOPICS} workspaces={WORKSPACES} />
    </ShellPage>
  )
}

interface ShellPageProps {
  currentPage: string
  onNavigateToLanding: () => void
  onNavigate: (page: Page) => void
  children: React.ReactNode
}

function ShellPage({ currentPage, onNavigateToLanding, onNavigate, children }: ShellPageProps) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--shell-color-canvas)' }}>
      <ShellPageHeader
        currentPage={currentPage}
        onNavigateToLanding={onNavigateToLanding}
        onNavigate={onNavigate}
      />
      {children}
    </div>
  )
}

interface ShellPageHeaderProps {
  currentPage: string
  onNavigateToLanding: () => void
  onNavigate: (page: Page) => void
}

function ShellPageHeader({ currentPage, onNavigateToLanding, onNavigate }: ShellPageHeaderProps) {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 64,
      padding: '0 24px',
      borderBottom: '1px solid var(--shell-color-border)',
      background: 'var(--shell-color-surface)',
    }}>
      <nav style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          onClick={onNavigateToLanding}
          style={{
            fontFamily: 'var(--shell-font-display)',
            fontSize: 24,
            fontWeight: 400,
            color: 'var(--shell-color-text)',
            letterSpacing: '0.02em',
            marginRight: 24,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
          }}
        >
          BGD
        </button>
        {(['workspaces', 'components', 'docs'] as const).map((p) => (
          <button
            key={p}
            onClick={() => onNavigate(p)}
            style={{
              fontFamily: 'var(--shell-font-body)',
              fontSize: 15,
              fontWeight: 500,
              color: currentPage === p ? 'var(--shell-color-text)' : 'var(--shell-color-text-muted)',
              cursor: 'pointer',
              padding: '8px 16px',
              borderRadius: 'var(--shell-radius-full)',
              transition: 'background 150ms ease, color 150ms ease',
              border: 'none',
              background: currentPage === p ? 'var(--shell-color-surface-hover)' : 'none',
            }}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </nav>
    </header>
  )
}

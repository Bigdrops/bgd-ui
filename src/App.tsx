import { lazy, useState, useCallback } from 'react'
import { Shell } from './shell'
import type { ShellWorkspace, ShellTopic } from './shell'
import { Landing } from './landing'
import { ComponentsPage } from './pages/components'
import { WorkspacesPage } from './pages/workspaces'
import { DocsPage } from './pages/docs'

const GetanchorInvoice = lazy(() => import('./workspaces/invoice/getanchor/InvoiceWorkspace'))
const MageInvoice = lazy(() => import('./workspaces/invoice/mage/InvoiceWorkspace'))
const ModelInvoice = lazy(() => import('./workspaces/invoice/model/InvoiceWorkspace'))
const TrackyInvoice = lazy(() => import('./workspaces/invoice/tracky/InvoiceWorkspace'))
const TypeformInvoice = lazy(() => import('./workspaces/invoice/typeform/InvoiceWorkspace'))
const AurosInvoice = lazy(() => import('./workspaces/invoice/auros/InvoiceWorkspace'))
const CodaSettings = lazy(() => import('./workspaces/settings/coda/SettingsWorkspace'))
const AurosSettings = lazy(() => import('./workspaces/settings/auros/SettingsWorkspace'))
const LuroNewProject = lazy(() => import('./workspaces/projects/luro/NewProjectWorkspace'))
const StructuredProjectDetail = lazy(() => import('./workspaces/projects/structured/ProjectDetailWorkspace'))
const MorulaCsrForm = lazy(() => import('./workspaces/csr/morula/CsrFormWorkspace'))
const VoltCsrForm = lazy(() => import('./workspaces/csr/volt/CsrFormWorkspace'))
const ModernWebIntelligenceDashboard = lazy(() => import('./components/dashboard/modern-web-intelligence-dashboard'))
const OperateDashboard = lazy(() => import('./components/dashboard/operate-dashboard'))
const SlashDashboard = lazy(() => import('./components/dashboard/slash-dashboard'))
const ParadigmDashboard = lazy(() => import('./components/dashboard/paradigm-dashboard'))
const PostHogDashboard = lazy(() => import('./components/dashboard/posthog-dashboard'))
const DashlaneDashboard = lazy(() => import('./components/dashboard/dashlane-dashboard'))
const RivianDashboard = lazy(() => import('./components/dashboard/rivian-dashboard'))
const PrismaDashboard = lazy(() => import('./components/dashboard/prisma-dashboard'))
const TypeformDashboard = lazy(() => import('./components/dashboard/typeform-dashboard'))
const OutsetaDashboard = lazy(() => import('./components/dashboard/outseta-dashboard'))
const NuriDashboard = lazy(() => import('./components/dashboard/nuri-dashboard'))
const MorflaxDashboard = lazy(() => import('./components/dashboard/morflax-dashboard'))
const AbletonDashboard = lazy(() => import('./components/dashboard/ableton-dashboard'))
const RunwayDashboard = lazy(() => import('./components/dashboard/runway-dashboard'))

const WORKSPACES: ShellWorkspace[] = [
  {
    id: 'invoice-getanchor',
    name: 'Getanchor',
    description: 'Terracotta accent — warm earth tones, 4px radius, Archivo sans',
    icon: 'receipt',
    category: 'Invoice',
    status: 'active',
    accentColor: '#ee884f',
    component: GetanchorInvoice,
    registryId: 'invoice-getanchor',
  },
  {
    id: 'invoice-mage',
    name: 'Mage',
    description: 'Achromatic editorial — Fraunces display, Dawn Arc gradient, pill radius',
    icon: 'scroll-text',
    category: 'Invoice',
    status: 'active',
    accentColor: '#0c1018',
    component: MageInvoice,
    registryId: 'invoice-mage',
  },
  {
    id: 'invoice-model',
    name: 'Model',
    description: 'Green accent — clean modern, 12px radius, glow focus, Fraunces display',
    icon: 'file-text',
    category: 'Invoice',
    status: 'active',
    accentColor: '#0e9f6e',
    component: ModelInvoice,
    registryId: 'invoice-model',
  },
  {
    id: 'invoice-tracky',
    name: 'Tracky',
    description: 'Notebook bullet journal — ash canvas, navy/coral/mint, Bagel Fat One display',
    icon: 'file-text',
    category: 'Invoice',
    status: 'active',
    accentColor: '#151b31',
    component: TrackyInvoice,
    registryId: 'invoice-tracky',
  },
  {
    id: 'invoice-typeform',
    name: 'Typeform',
    description: 'Editorial aubergine — cream canvas, violet whispers, Tobias serif, restrained elegance',
    icon: 'file-text',
    category: 'Invoice',
    status: 'active',
    accentColor: '#2a222b',
    component: TypeformInvoice,
    registryId: 'invoice-typeform',
  },
  {
    id: 'invoice-auros',
    name: 'Auros',
    description: 'Abyssal terminal — teal-black canvas, bioluminescent gradients, lavender highlights',
    icon: 'file-text',
    category: 'Invoice',
    status: 'active',
    accentColor: '#012624',
    component: AurosInvoice,
    registryId: 'invoice-auros',
  },
  {
    id: 'settings-coda',
    name: 'Coda',
    description: 'Warm parchment — cream canvas, obsidian borders, charcoal actions, pastel accents',
    icon: 'settings',
    category: 'Settings',
    status: 'active',
    accentColor: '#202020',
    component: CodaSettings,
    registryId: 'settings-coda',
  },
  {
    id: 'settings-auros',
    name: 'Auros',
    description: 'Abyssal terminal — teal-black canvas, bioluminescent gradients, lavender phosphor',
    icon: 'settings',
    category: 'Settings',
    status: 'active',
    accentColor: '#012624',
    component: AurosSettings,
    registryId: 'settings-auros',
  },
  {
    id: 'projects-luro',
    name: 'New Project',
    description: 'Crimson laser chamber — dark obsidian, hot pink plasma glow, cinematic form',
    icon: 'folder-plus',
    category: 'Projects',
    status: 'active',
    accentColor: '#ff0068',
    component: LuroNewProject,
    registryId: 'projects-luro',
  },
  {
    id: 'projects-structured',
    name: 'Project Detail',
    description: 'Renaissance gallery — putty canvas, stark black accents, serif display',
    icon: 'folder-kanban',
    category: 'Projects',
    status: 'active',
    accentColor: '#c4c3b6',
    component: StructuredProjectDetail,
    registryId: 'projects-structured',
  },
  {
    id: 'csr-morula',
    name: 'Morula',
    description: 'Organic clinical — warm cream, amber accent, Instrument Serif, softly elevated cards',
    icon: 'file-text',
    category: 'CSR',
    status: 'active',
    accentColor: '#d4934b',
    component: MorulaCsrForm,
    registryId: 'csr-morula',
  },
  {
    id: 'csr-volt',
    name: 'Volt',
    description: 'Dark terminal — near-black canvas, electric cyan glow, Syne display, sharp angles',
    icon: 'file-text',
    category: 'CSR',
    status: 'active',
    accentColor: '#56f0d4',
    component: VoltCsrForm,
    registryId: 'csr-volt',
  },
  {
    id: 'dashboard-modern-web-intelligence',
    name: 'Modern Web Intelligence',
    description: 'BigDrops mode | deep forest, chartreuse accents, real-time telemetry',
    icon: 'grid',
    category: 'Dashboard',
    status: 'active',
    accentColor: '#043f2e',
    component: ModernWebIntelligenceDashboard,
    registryId: 'modern-web-intelligence-dashboard',
  },
  {
    id: 'dashboard-operate',
    name: 'Operate',
    description: 'Botanist data terminal | sage-green canvas, mono-green family, compact instrument panels',
    icon: 'grid',
    category: 'Dashboard',
    status: 'active',
    accentColor: '#09352e',
    component: OperateDashboard,
    registryId: 'operate-dashboard',
  },
  {
    id: 'dashboard-slash',
    name: 'Slash',
    description: 'Midnight vault | gilded ledger lines, dark canvas, golden accents, Ivy Presto serif',
    icon: 'grid',
    category: 'Dashboard',
    status: 'active',
    accentColor: '#08080a',
    component: SlashDashboard,
    registryId: 'slash-dashboard',
  },
  {
    id: 'dashboard-paradigm',
    name: 'Paradigm',
    description: 'Research instrument | dark-to-light transition, pastel status badges, Atacama VAR serif',
    icon: 'grid',
    category: 'Dashboard',
    status: 'active',
    accentColor: '#080b12',
    component: ParadigmDashboard,
    registryId: 'paradigm-dashboard',
  },
  {
    id: 'dashboard-posthog',
    name: 'PostHog',
    description: 'Warm paper desktop | sandy beige canvas, 4px radii, flat printed feel, amber CTA',
    icon: 'grid',
    category: 'Dashboard',
    status: 'active',
    accentColor: '#e1d7c2',
    component: PostHogDashboard,
    registryId: 'posthog-dashboard',
  },
  {
    id: 'dashboard-dashlane',
    name: 'Dashlane',
    description: 'Midnight vault | cocoa canvas, mint keyholes, whisper-weight headlines, pill buttons',
    icon: 'grid',
    category: 'Dashboard',
    status: 'active',
    accentColor: '#200f0a',
    component: DashlaneDashboard,
    registryId: 'dashlane-dashboard',
  },
  {
    id: 'dashboard-rivian',
    name: 'Rivian',
    description: 'Monochrome gallery | solar yellow accent, monumental typography, comfortable spacing',
    icon: 'grid',
    category: 'Dashboard',
    status: 'active',
    accentColor: '#151515',
    component: RivianDashboard,
    registryId: 'rivian-dashboard',
  },
  {
    id: 'dashboard-prisma',
    name: 'Prisma',
    description: "Engineer's blueprint | white canvas, hairline borders, teal accent, code-first panels",
    icon: 'grid',
    category: 'Dashboard',
    status: 'active',
    accentColor: '#14b8a6',
    component: PrismaDashboard,
    registryId: 'prisma-dashboard',
  },
  {
    id: 'dashboard-typeform',
    name: 'Typeform',
    description: 'Editorial authority | Tobias serif, light/dark theme switcher, violet accent, stream charts',
    icon: 'grid',
    category: 'Dashboard',
    status: 'active',
    accentColor: '#9454ab',
    component: TypeformDashboard,
    registryId: 'typeform-dashboard',
  },
  {
    id: 'dashboard-outseta',
    name: 'Outseta',
    description: 'Sunset warmth | Deep plum canvas, sunset gradient, fuchsia signal, animated bars',
    icon: 'grid',
    category: 'Dashboard',
    status: 'active',
    accentColor: '#c1338a',
    component: OutsetaDashboard,
    registryId: 'outseta-dashboard',
  },
  {
    id: 'dashboard-nuri',
    name: 'Nuri',
    description: 'Lavender art-deco | Bitcoin orange accent, Lora headings, radial charts, cumulative wave',
    icon: 'grid',
    category: 'Dashboard',
    status: 'active',
    accentColor: '#f97316',
    component: NuriDashboard,
    registryId: 'nuri-dashboard',
  },
  {
    id: 'dashboard-morflax',
    name: 'Morflax',
    description: 'Porcelain gallery | Cobalt spark accent, dark nav, lavender hero, monochrome + one blue',
    icon: 'grid',
    category: 'Dashboard',
    status: 'active',
    accentColor: '#298ef5',
    component: MorflaxDashboard,
    registryId: 'morflax-dashboard',
  },
  {
    id: 'dashboard-ableton',
    name: 'Ableton',
    description: 'Editorial workshop | Stark white, Futura/Jost, flat grid, coral/teal tags, zero radius',
    icon: 'grid',
    category: 'Dashboard',
    status: 'active',
    accentColor: '#000000',
    component: AbletonDashboard,
    registryId: 'ableton-dashboard',
  },
  {
    id: 'dashboard-runway',
    name: 'Runway',
    description: 'Kraft paper ledger | Cream canvas, espresso ink, amber signal, warm shadows',
    icon: 'grid',
    category: 'Dashboard',
    status: 'active',
    accentColor: '#f9a600',
    component: RunwayDashboard,
    registryId: 'runway-dashboard',
  },
]

const TOPICS: ShellTopic[] = [
  {
    id: 'invoice',
    name: 'Invoice',
    workspaces: WORKSPACES.filter((w) => w.category === 'Invoice').map((w) => ({ id: w.id, name: w.name, description: w.description })),
  },
  {
    id: 'settings',
    name: 'Settings',
    workspaces: WORKSPACES.filter((w) => w.category === 'Settings').map((w) => ({ id: w.id, name: w.name, description: w.description })),
  },
  {
    id: 'projects',
    name: 'Projects',
    workspaces: WORKSPACES.filter((w) => w.category === 'Projects').map((w) => ({ id: w.id, name: w.name, description: w.description })),
  },
  {
    id: 'csr',
    name: 'CSR',
    workspaces: WORKSPACES.filter((w) => w.category === 'CSR').map((w) => ({ id: w.id, name: w.name, description: w.description })),
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    workspaces: WORKSPACES.filter((w) => w.category === 'Dashboard').map((w) => ({ id: w.id, name: w.name, description: w.description })),
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

import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import {
  Square,
  LayoutGrid,
  LayoutDashboard,
  FileCode,
  Image,
  Bell,
  MessageSquare,
  Receipt,
  FileText,
  ScrollText,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface ComponentFile {
  path: string
  language: string
}

export interface ComponentMeta {
  id: string
  name: string
  category: string
  description: string
  badge?: string
  icon: LucideIcon
  files: ComponentFile[]
  designFile: string | null
  previewComponent: LazyExoticComponent<ComponentType<{}>> | null
}

const RAW_SOURCE_FILES: Record<string, string> = import.meta.glob(
  '/src/**/*.{ts,tsx,css}',
  { query: '?raw', import: 'default', eager: true }
) as Record<string, string>

const RAW_DESIGN_FILES: Record<string, string> = import.meta.glob(
  '/docs/Designs/*.md',
  { query: '?raw', import: 'default', eager: true }
) as Record<string, string>

function detectLanguage(path: string): string {
  const ext = path.split('.').pop()
  switch (ext) {
    case 'ts':
      return 'typescript'
    case 'tsx':
      return 'typescriptreact'
    case 'js':
      return 'javascript'
    case 'jsx':
      return 'javascriptreact'
    case 'css':
      return 'css'
    case 'html':
      return 'html'
    case 'json':
      return 'json'
    case 'md':
      return 'markdown'
    default:
      return 'plaintext'
  }
}

function normalizePath(path: string): string {
  return path.replace(/\\/g, '/')
}

function resolveSourceContent(path: string): string | undefined {
  const target = normalizePath(path).replace(/^\//, '')
  const key = Object.keys(RAW_SOURCE_FILES).find((candidate) => {
    const normalized = normalizePath(candidate)
    return normalized === `/${target}` || normalized.endsWith(`/${target}`)
  })

  return key ? RAW_SOURCE_FILES[key] : undefined
}

function resolveDesignContent(path: string): string | undefined {
  const target = normalizePath(path).replace(/^\//, '')
  const key = Object.keys(RAW_DESIGN_FILES).find((candidate) => {
    const normalized = normalizePath(candidate)
    return normalized === `/${target}` || normalized.endsWith(`/${target}`)
  })

  return key ? RAW_DESIGN_FILES[key] : undefined
}

function normalizeName(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function tokenize(value: string): string[] {
  return normalizeName(value)
    .split(' ')
    .filter((token) => token.length > 2)
}

const DESIGN_CANDIDATES = Object.entries(RAW_DESIGN_FILES).map(([path, content]) => ({
  path: normalizePath(path),
  content,
  normalizedPath: normalizePath(path).toLowerCase(),
  normalizedContent: content.toLowerCase(),
}))

function scoreDesignCandidate(candidate: {
  path: string
  content: string
  normalizedPath: string
  normalizedContent: string
}, entry: RegistryEntry): number {
  const tokens = tokenize(`${entry.name} ${entry.id} ${entry.category} ${entry.description}`)
  const fullName = normalizeName(entry.name)
  let score = 0

  if (candidate.normalizedPath.endsWith(`/${normalizeName(entry.name).replace(/\s+/g, '-')}.md`)) {
    score += 80
  }

  const titleMatch = candidate.content.match(/^#\s+(.+)$/m)?.[1] ?? ''
  const normalizedTitle = normalizeName(titleMatch)

  if (normalizedTitle === fullName) score += 100
  if (normalizedTitle.includes(fullName)) score += 60
  if (candidate.normalizedContent.includes(fullName)) score += 30
  if (candidate.normalizedContent.includes(normalizeName(entry.id))) score += 30

  for (const token of tokens) {
    const tokenCount = candidate.normalizedContent.split(token).length - 1
    if (tokenCount > 0) {
      score += Math.min(tokenCount * 3, 18)
    }
    if (normalizedTitle.includes(token)) {
      score += 8
    }
    if (candidate.normalizedPath.includes(token)) {
      score += 5
    }
  }

  if (entry.files.some((file) => candidate.normalizedContent.includes(file.split('/').pop()?.toLowerCase() ?? ''))) {
    score += 12
  }

  return score
}

function inferDesignFile(entry: RegistryEntry): string | null {
  if (entry.designFile) {
    return normalizePath(entry.designFile)
  }

  const scored = DESIGN_CANDIDATES
    .map((candidate) => ({ candidate, score: scoreDesignCandidate(candidate, entry) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)

  return scored[0]?.candidate.path ?? null
}

interface RegistryEntry {
  id: string
  name: string
  category: string
  description: string
  badge?: string
  icon: LucideIcon
  files: string[]
  designFile?: string
  previewComponent: LazyExoticComponent<ComponentType<{}>> | null
}


const ENTRIES: RegistryEntry[] = [
  {
    id: 'modern-web-intelligence-dashboard',
    name: 'Modern Web Intelligence Dashboard',
    category: 'Dashboard',
    description: 'Real-time financial snapshot, telemetry stream, activity feed, and document management.',
    badge: 'New',
    icon: LayoutDashboard,
    files: [
      'src/components/dashboard/modern-web-intelligence-dashboard.tsx',
      'src/components/dashboard/index.ts',
      'src/components/dashboard/index.css',
    ],
    designFile: 'docs/Designs/Modern-Business-Intelligence.md',
    previewComponent: lazy(
      () => import('@/components/dashboard/modern-web-intelligence-dashboard') as Promise<{
        default: ComponentType<{}>
      }>
    ),
  },
  {
    id: 'operate-dashboard',
    name: 'Operate Dashboard',
    category: 'Dashboard',
    description: 'Botanist data terminal — sage-green canvas, mono-green family, compact instrument panels.',
    badge: 'New',
    icon: LayoutDashboard,
    files: [
      'src/components/dashboard/operate-dashboard.tsx',
      'src/components/dashboard/operate.css',
    ],
    designFile: 'docs/Designs/Operate.md',
    previewComponent: lazy(
      () => import('@/components/dashboard/operate-dashboard') as Promise<{
        default: ComponentType<{}>
      }>
    ),
  },
  {
    id: 'slash-dashboard',
    name: 'Slash Dashboard',
    category: 'Dashboard',
    description: 'Midnight vault with gilded ledger lines — dark canvas, golden accents, Ivy Presto serif.',
    badge: 'New',
    icon: LayoutDashboard,
    files: [
      'src/components/dashboard/slash-dashboard.tsx',
      'src/components/dashboard/slash.css',
    ],
    designFile: 'docs/Designs/Slash.md',
    previewComponent: lazy(
      () => import('@/components/dashboard/slash-dashboard') as Promise<{
        default: ComponentType<{}>
      }>
    ),
  },
  {
    id: 'paradigm-dashboard',
    name: 'Paradigm Dashboard',
    category: 'Dashboard',
    description: 'Research instrument — dark hero to light body, pastel status badges, Atacama VAR serif.',
    badge: 'New',
    icon: LayoutDashboard,
    files: [
      'src/components/dashboard/paradigm-dashboard.tsx',
      'src/components/dashboard/paradigm.css',
    ],
    designFile: 'docs/Designs/Paradigm.md',
    previewComponent: lazy(
      () => import('@/components/dashboard/paradigm-dashboard') as Promise<{
        default: ComponentType<{}>
      }>
    ),
  },
  {
    id: 'posthog-dashboard',
    name: 'PostHog Dashboard',
    category: 'Dashboard',
    description: 'Warm paper desktop — sandy beige canvas, 4px radii, flat printed feel, amber CTA.',
    badge: 'New',
    icon: LayoutDashboard,
    files: [
      'src/components/dashboard/posthog-dashboard.tsx',
      'src/components/dashboard/posthog.css',
    ],
    designFile: 'docs/Designs/PostHog.md',
    previewComponent: lazy(
      () => import('@/components/dashboard/posthog-dashboard') as Promise<{
        default: ComponentType<{}>
      }>
    ),
  },
  {
    id: 'dashlane-dashboard',
    name: 'Dashlane Dashboard',
    category: 'Dashboard',
    description: 'Midnight vault — cocoa canvas, mint keyholes, whisper-weight headlines, pill buttons.',
    badge: 'New',
    icon: LayoutDashboard,
    files: [
      'src/components/dashboard/dashlane-dashboard.tsx',
      'src/components/dashboard/dashlane.css',
    ],
    designFile: 'docs/Designs/Dashlane.md',
    previewComponent: lazy(
      () => import('@/components/dashboard/dashlane-dashboard') as Promise<{
        default: ComponentType<{}>
      }>
    ),
  },
  {
    id: 'rivian-dashboard',
    name: 'Rivian Dashboard',
    category: 'Dashboard',
    description: 'Monochrome gallery wall — solar yellow accent, monumental typography, comfortable spacing.',
    badge: 'New',
    icon: LayoutDashboard,
    files: [
      'src/components/dashboard/rivian-dashboard.tsx',
      'src/components/dashboard/rivian.css',
    ],
    designFile: 'docs/Designs/Rivian.md',
    previewComponent: lazy(
      () => import('@/components/dashboard/rivian-dashboard') as Promise<{
        default: ComponentType<{}>
      }>
    ),
  },
  {
    id: 'prisma-dashboard',
    name: 'Prisma Dashboard',
    category: 'Dashboard',
    description: 'Engineer\'s blueprint — white canvas, hairline borders, teal accent, code-first panels.',
    badge: 'New',
    icon: LayoutDashboard,
    files: [
      'src/components/dashboard/prisma-dashboard.tsx',
      'src/components/dashboard/prisma.css',
    ],
    designFile: 'docs/Designs/Prisma.md',
    previewComponent: lazy(
      () => import('@/components/dashboard/prisma-dashboard') as Promise<{
        default: ComponentType<{}>
      }>
    ),
  },
  {
    id: 'typeform-dashboard',
    name: 'Typeform Dashboard',
    category: 'Dashboard',
    description: 'Editorial authority — Tobias serif, light/dark theme switcher, violet accent, stream charts.',
    badge: 'New',
    icon: LayoutDashboard,
    files: [
      'src/components/dashboard/typeform-dashboard.tsx',
      'src/components/dashboard/typeform-dashboard.css',
    ],
    designFile: 'docs/Designs/Typeform.md',
    previewComponent: lazy(
      () => import('@/components/dashboard/typeform-dashboard') as Promise<{
        default: ComponentType<{}>
      }>
    ),
  },
  {
    id: 'outseta-dashboard',
    name: 'Outseta Dashboard',
    category: 'Dashboard',
    description: 'Sunset warmth — deep plum canvas, sunset gradient, fuchsia signal, animated bars, radial donut charts.',
    icon: LayoutDashboard,
    files: [
      'src/components/dashboard/outseta-dashboard.tsx',
      'src/components/dashboard/outseta-dashboard.css',
    ],
    designFile: 'docs/Designs/Outseta.md',
    previewComponent: lazy(
      () => import('@/components/dashboard/outseta-dashboard') as Promise<{
        default: ComponentType<{}>
      }>
    ),
  },
  {
    id: 'nuri-dashboard',
    name: 'Nuri Dashboard',
    category: 'Dashboard',
    description: 'Lavender art-deco — Bitcoin orange accent, Lora headings, radial donut charts, cumulative wave timeline.',
    icon: LayoutDashboard,
    files: [
      'src/components/dashboard/nuri-dashboard.tsx',
      'src/components/dashboard/nuri-dashboard.css',
    ],
    designFile: 'docs/Designs/Nuri.md',
    previewComponent: lazy(
      () => import('@/components/dashboard/nuri-dashboard') as Promise<{
        default: ComponentType<{}>
      }>
    ),
  },
  {
    id: 'morflax-dashboard',
    name: 'Morflax Dashboard',
    category: 'Dashboard',
    description: 'Porcelain gallery — cobalt spark accent, dark nav bar, lavender hero wash, monochrome + one blue.',
    icon: LayoutDashboard,
    files: [
      'src/components/dashboard/morflax-dashboard.tsx',
      'src/components/dashboard/morflax-dashboard.css',
    ],
    designFile: 'docs/Designs/Morflax.md',
    previewComponent: lazy(
      () => import('@/components/dashboard/morflax-dashboard') as Promise<{
        default: ComponentType<{}>
      }>
    ),
  },
  {
    id: 'ableton-dashboard',
    name: 'Ableton Dashboard',
    category: 'Dashboard',
    description: 'Editorial workshop — stark white, Jost/Futura, flat grid, coral/teal tags, zero radius everywhere.',
    icon: LayoutDashboard,
    files: [
      'src/components/dashboard/ableton-dashboard.tsx',
      'src/components/dashboard/ableton-dashboard.css',
    ],
    designFile: 'docs/Designs/Ableton.md',
    previewComponent: lazy(
      () => import('@/components/dashboard/ableton-dashboard') as Promise<{
        default: ComponentType<{}>
      }>
    ),
  },
  {
    id: 'runway-dashboard',
    name: 'Runway Dashboard',
    category: 'Dashboard',
    description: 'Kraft paper ledger — cream canvas, espresso ink, amber signal CTA, warm brown shadows.',
    icon: LayoutDashboard,
    files: [
      'src/components/dashboard/runway-dashboard.tsx',
      'src/components/dashboard/runway-dashboard.css',
    ],
    designFile: 'docs/Designs/Runway.md',
    previewComponent: lazy(
      () => import('@/components/dashboard/runway-dashboard') as Promise<{
        default: ComponentType<{}>
      }>
    ),
  },
  {
    id: 'settings-coda',
    name: 'Coda Settings',
    category: 'Settings',
    description: 'Warm parchment settings — cream canvas, obsidian borders, charcoal actions, pastel accent groups.',
    icon: FileText,
    files: [
      'src/workspaces/settings/coda/SettingsWorkspace.tsx',
      'src/workspaces/settings/coda/index.css',
    ],
    designFile: 'docs/Designs/Coda.md',
    previewComponent: lazy(
      () => import('@/workspaces/settings/coda/SettingsWorkspace') as Promise<{
        default: ComponentType<{}>
      }>
    ),
  },
  {
    id: 'settings-auros',
    name: 'Auros Settings',
    category: 'Settings',
    description: 'Abyssal terminal settings — teal-black canvas, bioluminescent gradients, lavender phosphor.',
    icon: FileText,
    files: [
      'src/workspaces/settings/auros/SettingsWorkspace.tsx',
      'src/workspaces/settings/auros/index.css',
    ],
    designFile: 'docs/Designs/Auros.md',
    previewComponent: lazy(
      () => import('@/workspaces/settings/auros/SettingsWorkspace') as Promise<{
        default: ComponentType<{}>
      }>
    ),
  },
  {
    id: 'projects-luro',
    name: 'Luro New Project',
    category: 'Projects',
    description: 'Crimson laser chamber — dark obsidian, hot pink plasma glow, cinematic new project form.',
    icon: FileText,
    files: [
      'src/workspaces/projects/luro/NewProjectWorkspace.tsx',
      'src/workspaces/projects/luro/index.css',
    ],
    designFile: 'docs/Designs/Luro.md',
    previewComponent: lazy(
      () => import('@/workspaces/projects/luro/NewProjectWorkspace') as Promise<{
        default: ComponentType<{}>
      }>
    ),
  },
  {
    id: 'projects-structured',
    name: 'Structured Project Detail',
    category: 'Projects',
    description: 'Renaissance gallery — putty canvas, stark black accents, serif display, project detail view.',
    icon: FileText,
    files: [
      'src/workspaces/projects/structured/ProjectDetailWorkspace.tsx',
      'src/workspaces/projects/structured/index.css',
    ],
    designFile: 'docs/Designs/Structured.md',
    previewComponent: lazy(
      () => import('@/workspaces/projects/structured/ProjectDetailWorkspace') as Promise<{
        default: ComponentType<{}>
      }>
    ),
  },
  {
    id: 'button',
    name: 'Button',
    category: 'Forms',
    description: 'Interactive button with multiple variants and sizes.',
    badge: 'New',
    icon: Square,
    files: ['src/components/ui/button.tsx'],
    previewComponent: null,
  },
  {
    id: 'carousel',
    name: 'Carousel',
    category: 'Data Display',
    description: 'Image and content carousel with navigation controls.',
    icon: Image,
    files: ['src/components/ui/carousel.tsx'],
    previewComponent: null,
  },
  {
    id: 'infinite-notification-carousel',
    name: 'Infinite Notification Carousel',
    category: 'Data Display',
    description: 'Production-ready infinite carousel with autoplay, touch swipe, and pagination dots.',
    icon: Bell,
    files: ['src/components/ui/infinite-notification-carousel.tsx'],
    previewComponent: null,
  },
  {
    id: 'code-viewer',
    name: 'Code Viewer',
    category: 'Utility',
    description: 'Syntax-highlighted code viewer with copy support and line numbers.',
    icon: FileCode,
    files: ['src/components/ui/code-viewer.tsx'],
    previewComponent: null,
  },
  {
    id: 'file-explorer',
    name: 'File Explorer',
    category: 'Utility',
    description: 'Tree-based file explorer with expand/collapse and file icons.',
    icon: LayoutGrid,
    files: ['src/components/ui/file-explorer.tsx'],
    previewComponent: null,
  },
  {
    id: 'markdown-viewer',
    name: 'Markdown Viewer',
    category: 'Utility',
    description: 'Renders Markdown content with syntax highlighting and styling.',
    icon: MessageSquare,
    files: ['src/components/ui/markdown-viewer.tsx'],
    previewComponent: null,
  },
  {
    id: 'component-detail',
    name: 'Component Detail',
    category: 'Utility',
    description: 'Three-tab preview/code/design detail panel for component browsing.',
    icon: LayoutGrid,
    files: ['src/components/component-detail.tsx'],
    previewComponent: null,
  },
  {
    id: 'invoice-getanchor',
    name: 'Getanchor Invoice',
    category: 'Invoice',
    description: 'Terracotta accent — warm earth tones, rounded squares, Archivo sans.',
    icon: Receipt,
    files: [
      'src/workspaces/invoice/getanchor/InvoiceWorkspace.tsx',
      'src/workspaces/invoice/getanchor/index.css',
    ],
    designFile: 'docs/Designs/Getanchor.md',
    previewComponent: lazy(
      () => import('@/workspaces/invoice/getanchor/InvoiceWorkspace') as Promise<{
        default: ComponentType<{}>
      }>
    ),
  },
  {
    id: 'invoice-mage',
    name: 'Mage Invoice',
    category: 'Invoice',
    description: 'Achromatic editorial — New Genre design system, Fraunces display, Dawn Arc gradient.',
    icon: ScrollText,
    files: [
      'src/workspaces/invoice/mage/InvoiceWorkspace.tsx',
      'src/workspaces/invoice/mage/index.css',
    ],
    designFile: 'docs/Designs/New-genre.md',
    previewComponent: lazy(
      () => import('@/workspaces/invoice/mage/InvoiceWorkspace') as Promise<{
        default: ComponentType<{}>
      }>
    ),
  },
  {
    id: 'invoice-model',
    name: 'Model Invoice',
    category: 'Invoice',
    description: 'Contractbook facelift — cream canvas, ultramarine accent, gold actions, 24px cards.',
    icon: FileText,
    files: [
      'src/workspaces/invoice/model/InvoiceWorkspace.tsx',
      'src/workspaces/invoice/model/index.css',
    ],
    designFile: 'docs/Designs/Contractbook.md',
    previewComponent: lazy(
      () => import('@/workspaces/invoice/model/InvoiceWorkspace') as Promise<{
        default: ComponentType<{}>
      }>
    ),
  },
  {
    id: 'invoice-tracky',
    name: 'Tracky Invoice',
    category: 'Invoice',
    description: 'Notebook bullet journal — ash canvas, navy/coral/mint accents, Bagel Fat One display.',
    icon: FileText,
    files: [
      'src/workspaces/invoice/tracky/InvoiceWorkspace.tsx',
      'src/workspaces/invoice/tracky/index.css',
    ],
    designFile: 'docs/Designs/Tracky.md',
    previewComponent: lazy(
      () => import('@/workspaces/invoice/tracky/InvoiceWorkspace') as Promise<{
        default: ComponentType<{}>
      }>
    ),
  },
  {
    id: 'invoice-typeform',
    name: 'Typeform Invoice',
    category: 'Invoice',
    description: 'Editorial aubergine — cream canvas, violet whispers, Tobias serif, restrained elegance.',
    icon: FileText,
    files: [
      'src/workspaces/invoice/typeform/InvoiceWorkspace.tsx',
      'src/workspaces/invoice/typeform/index.css',
    ],
    designFile: 'docs/Designs/Typeform.md',
    previewComponent: lazy(
      () => import('@/workspaces/invoice/typeform/InvoiceWorkspace') as Promise<{
        default: ComponentType<{}>
      }>
    ),
  },
  {
    id: 'csr-morula',
    name: 'Morula CSR Form',
    category: 'CSR',
    description: 'Organic clinical — warm cream canvas, amber accent, Instrument Serif headings, softly elevated cards.',
    icon: FileText,
    files: [
      'src/workspaces/csr/morula/CsrFormWorkspace.tsx',
      'src/workspaces/csr/morula/index.css',
    ],
    designFile: 'docs/Designs/PRAV.md',
    previewComponent: lazy(
      () => import('@/workspaces/csr/morula/CsrFormWorkspace') as Promise<{
        default: ComponentType<{}>
      }>
    ),
  },
  {
    id: 'csr-volt',
    name: 'Volt CSR Form',
    category: 'CSR',
    description: 'Dark terminal — near-black canvas, electric cyan glow, Syne display, sharp angles, pulsing save button.',
    icon: FileText,
    files: [
      'src/workspaces/csr/volt/CsrFormWorkspace.tsx',
      'src/workspaces/csr/volt/index.css',
    ],
    designFile: 'docs/Designs/AMRA.md',
    previewComponent: lazy(
      () => import('@/workspaces/csr/volt/CsrFormWorkspace') as Promise<{
        default: ComponentType<{}>
      }>
    ),
  },
  {
    id: 'invoice-auros',
    name: 'Auros Invoice',
    category: 'Invoice',
    description: 'Abyssal terminal — teal-black canvas, bioluminescent gradients, lavender-phosphor highlights.',
    icon: FileText,
    files: [
      'src/workspaces/invoice/auros/InvoiceWorkspace.tsx',
      'src/workspaces/invoice/auros/index.css',
    ],
    designFile: 'docs/Designs/Auros.md',
    previewComponent: lazy(
      () => import('@/workspaces/invoice/auros/InvoiceWorkspace') as Promise<{
        default: ComponentType<{}>
      }>
    ),
  },
]

function buildRegistry(): ComponentMeta[] {
  return ENTRIES.map((entry) => {
    const files: ComponentFile[] = entry.files.flatMap((filePath) => {
      if (!resolveSourceContent(filePath)) {
        throw new Error(`Missing registered source file: ${filePath}`)
      }
      return [
        {
          path: normalizePath(filePath),
          language: detectLanguage(filePath),
        },
      ]
    })

    const inferred = inferDesignFile(entry)
    const designFile = inferred && resolveDesignContent(inferred) ? inferred : null

    return {
      id: entry.id,
      name: entry.name,
      category: entry.category,
      description: entry.description,
      badge: entry.badge,
      icon: entry.icon,
      files,
      designFile,
      previewComponent: entry.previewComponent,
    }
  })
}

const REGISTRY_DATA: ComponentMeta[] = buildRegistry()

export const COMPONENT_REGISTRY: ComponentMeta[] = REGISTRY_DATA

export function getComponentById(id: string): ComponentMeta | undefined {
  return COMPONENT_REGISTRY.find((component) => component.id === id)
}

export function getRawFileContent(path: string): string | undefined {
  const target = normalizePath(path)
  const sourceKey = Object.keys(RAW_SOURCE_FILES).find((candidate) => {
    const normalized = normalizePath(candidate)
    return normalized === `/${target}` || normalized.endsWith(`/${target}`)
  })

  if (sourceKey) {
    return RAW_SOURCE_FILES[sourceKey]
  }

  const designKey = Object.keys(RAW_DESIGN_FILES).find((candidate) => {
    const normalized = normalizePath(candidate)
    return normalized === `/${target}` || normalized.endsWith(`/${target}`)
  })

  return designKey ? RAW_DESIGN_FILES[designKey] : undefined
}

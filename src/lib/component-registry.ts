import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import {
  Square,
  LayoutGrid,
  LayoutDashboard,
  FileCode,
  Image,
  Bell,
  MessageSquare,
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

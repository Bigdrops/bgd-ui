import { lazy, type LazyExoticComponent, type ComponentType } from 'react'
import { Square, LayoutGrid, Table, Type, ChevronDown, MessageSquare, BarChart, LayoutDashboard } from 'lucide-react'
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
  designFiles: ComponentFile[]
  lazyComponent: LazyExoticComponent<ComponentType<any>> | null
}

const RAW_SOURCE_FILES: Record<string, string> = import.meta.glob(
  '/src/components/**/*.{ts,tsx,css,md}',
  { query: '?raw', import: 'default', eager: true }
) as Record<string, string>

function detectLanguage(path: string): string {
  const ext = path.split('.').pop()
  switch (ext) {
    case 'ts': return 'typescript'
    case 'tsx': return 'typescriptreact'
    case 'js': return 'javascript'
    case 'jsx': return 'javascriptreact'
    case 'css': return 'css'
    case 'html': return 'html'
    case 'json': return 'json'
    case 'md': return 'markdown'
    default: return 'plaintext'
  }
}

function discoverDirFiles(dir: string): { code: ComponentFile[]; design: ComponentFile[] } {
  const code: ComponentFile[] = []
  const design: ComponentFile[] = []
  const prefix = dir.endsWith('/') ? dir : dir + '/'

  for (const absPath of Object.keys(RAW_SOURCE_FILES)) {
    const normalizedPath = absPath.replace(/\\/g, '/')
    if (!normalizedPath.startsWith(prefix)) continue
    const relPath = normalizedPath.replace(/^\/src\//, '')
    const ext = relPath.split('.').pop()
    if (ext === 'md') {
      design.push({ path: relPath, language: 'markdown' })
    } else {
      code.push({ path: relPath, language: detectLanguage(relPath) })
    }
  }

  code.sort((a, b) => a.path.localeCompare(b.path))
  design.sort((a, b) => a.path.localeCompare(b.path))
  return { code, design }
}

const REGISTRY_DATA: ComponentMeta[] = [
  {
    id: 'modern-web-intelligence-dashboard',
    name: 'Modern Web Intelligence Dashboard',
    category: 'Dashboard',
    description: 'Real-time financial snapshot, telemetry stream, activity feed, and document management.',
    badge: 'New',
    icon: LayoutDashboard,
    files: [],
    designFiles: [],
    lazyComponent: lazy(() => import('@/components/dashboard/modern-web-intelligence-dashboard')),
  },
  {
    id: 'infinite-notification-carousel',
    name: 'Infinite Notification Carousel',
    category: 'Dashboard',
    description: 'Production-ready infinite carousel with autoplay, touch swipe, and pagination dots.',
    icon: LayoutDashboard,
    files: [],
    designFiles: [],
    lazyComponent: null,
  },
  {
    id: 'button',
    name: 'Button',
    category: 'Forms',
    description: 'Interactive button with multiple variants and sizes.',
    badge: 'New',
    icon: Square,
    files: [],
    designFiles: [],
    lazyComponent: null,
  },
  {
    id: 'card',
    name: 'Card',
    category: 'Layout',
    description: 'Container for grouping related content.',
    icon: LayoutGrid,
    files: [],
    designFiles: [],
    lazyComponent: null,
  },
  {
    id: 'table',
    name: 'Table',
    category: 'Data Display',
    description: 'Data table with sorting, filtering, and pagination.',
    icon: Table,
    files: [],
    designFiles: [],
    lazyComponent: null,
  },
  {
    id: 'input',
    name: 'Input',
    category: 'Forms',
    description: 'Text input field with validation states.',
    icon: Type,
    files: [],
    designFiles: [],
    lazyComponent: null,
  },
  {
    id: 'select',
    name: 'Select',
    category: 'Forms',
    description: 'Dropdown select with search and multi-select.',
    icon: ChevronDown,
    files: [],
    designFiles: [],
    lazyComponent: null,
  },
  {
    id: 'dialog',
    name: 'Dialog',
    category: 'Feedback',
    description: 'Modal dialog for confirmations and forms.',
    icon: MessageSquare,
    files: [],
    designFiles: [],
    lazyComponent: null,
  },
  {
    id: 'chart',
    name: 'Chart',
    category: 'Data Display',
    description: 'Data visualization with multiple chart types.',
    badge: 'New',
    icon: BarChart,
    files: [],
    designFiles: [],
    lazyComponent: null,
  },
  {
    id: 'badge',
    name: 'Badge',
    category: 'Data Display',
    description: 'Status indicator and label component.',
    icon: Square,
    files: [],
    designFiles: [],
    lazyComponent: null,
  },
  {
    id: 'alert',
    name: 'Alert',
    category: 'Feedback',
    description: 'Inline notification with severity levels.',
    icon: MessageSquare,
    files: [],
    designFiles: [],
    lazyComponent: null,
  },
  {
    id: 'tabs',
    name: 'Tabs',
    category: 'Navigation',
    description: 'Tabbed navigation for switching views.',
    icon: LayoutGrid,
    files: [],
    designFiles: [],
    lazyComponent: null,
  },
  {
    id: 'sidebar',
    name: 'Sidebar',
    category: 'Navigation',
    description: 'Collapsible sidebar navigation.',
    icon: LayoutGrid,
    files: [],
    designFiles: [],
    lazyComponent: null,
  },
  {
    id: 'form',
    name: 'Form',
    category: 'Forms',
    description: 'Form layout with validation and error handling.',
    icon: Type,
    files: [],
    designFiles: [],
    lazyComponent: null,
  },
]

;(function populateFiles() {
  for (const comp of REGISTRY_DATA) {
    if (comp.id === 'modern-web-intelligence-dashboard') {
      const { code, design } = discoverDirFiles('/src/components/dashboard')
      comp.files = code
      comp.designFiles = design
    } else if (comp.id === 'infinite-notification-carousel') {
      comp.files = [
        { path: 'components/ui/infinite-notification-carousel.tsx', language: 'typescriptreact' },
      ]
      comp.designFiles = []
    } else if (comp.id === 'button') {
      comp.files = [
        { path: 'components/ui/button.tsx', language: 'typescriptreact' },
      ]
      comp.designFiles = []
    } else if (comp.id === 'card') {
      comp.files = [
        { path: 'components/ui/card.tsx', language: 'typescriptreact' },
      ]
      comp.designFiles = []
    } else if (comp.id === 'table') {
      comp.files = [
        { path: 'components/ui/table.tsx', language: 'typescriptreact' },
      ]
      comp.designFiles = []
    } else if (comp.id === 'input') {
      comp.files = [
        { path: 'components/ui/input.tsx', language: 'typescriptreact' },
      ]
      comp.designFiles = []
    } else if (comp.id === 'badge') {
      comp.files = [
        { path: 'components/ui/badge.tsx', language: 'typescriptreact' },
      ]
      comp.designFiles = []
    } else if (comp.id === 'dialog') {
      comp.files = [
        { path: 'components/ui/dialog.tsx', language: 'typescriptreact' },
      ]
      comp.designFiles = []
    }
  }
})()

export const COMPONENT_REGISTRY: ComponentMeta[] = REGISTRY_DATA

export function getComponentById(id: string): ComponentMeta | undefined {
  return COMPONENT_REGISTRY.find((c) => c.id === id)
}

export function getRawFileContent(path: string): string | undefined {
  const absKey = Object.keys(RAW_SOURCE_FILES).find((k) => {
    const normalized = k.replace(/\\/g, '/')
    return normalized.endsWith('/' + path) || normalized === '/src/' + path
  })
  return absKey ? RAW_SOURCE_FILES[absKey] : undefined
}

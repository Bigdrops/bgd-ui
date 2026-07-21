import type { ComponentType, LazyExoticComponent } from 'react'

export interface WorkspaceEntry {
  id: string
  name: string
  description: string
}

export interface ShellTopic {
  id: string
  name: string
  workspaces: WorkspaceEntry[]
}

export interface ShellWorkspace {
  id: string
  name: string
  description: string
  icon: string
  category: string
  status: 'active' | 'draft' | 'archived'
  component: LazyExoticComponent<ComponentType>
}

export type ThemeMode = 'light' | 'dark' | 'system'

export type ShellScreen = 'home' | 'topic' | 'workspace' | 'settings'

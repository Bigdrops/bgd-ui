import { lazy } from 'react'
import { Shell } from './shell'
import type { ShellWorkspace, ShellTopic } from './shell'

const PRAVInvoice = lazy(() => import('./workspaces/invoice/prav/InvoiceWorkspace'))
const SackvilleInvoice = lazy(() => import('./workspaces/invoice/sackville/InvoiceWorkspace'))
const AMRAInvoice = lazy(() => import('./workspaces/invoice/amra/InvoiceWorkspace'))

const WORKSPACES: ShellWorkspace[] = [
  {
    id: 'invoice-prav',
    name: 'PRAV',
    description: 'Engineering dossier | warm parchment, ink-black hierarchy, 4px radius',
    icon: 'receipt',
    category: 'Invoice',
    status: 'active',
    component: PRAVInvoice,
  },
  {
    id: 'invoice-sackville',
    name: 'Sackville',
    description: 'Editorial risograph | cream paper, cobalt ink, oval outlined actions',
    icon: 'file-text',
    category: 'Invoice',
    status: 'active',
    component: SackvilleInvoice,
  },
  {
    id: 'invoice-amra',
    name: 'AMRA',
    description: 'Monochrome minimal | white canvas, lavender accent, 44px radius',
    icon: 'grid',
    category: 'Invoice',
    status: 'active',
    component: AMRAInvoice,
  },
]

const TOPICS: ShellTopic[] = [
  {
    id: 'invoice',
    name: 'Invoice',
    workspaces: WORKSPACES.map((w) => ({ id: w.id, name: w.name, description: w.description })),
  },
]

export default function App() {
  return <Shell topics={TOPICS} workspaces={WORKSPACES} />
}

import { useState, useEffect, useRef } from 'react'
import {
  Activity, TrendingUp, TrendingDown, Clock, AlertTriangle,
  FileText, FileSpreadsheet, ClipboardCheck, Truck, Mail,
  FileQuestion, Plus, Search, Bell, ChevronDown, Eye, Check,
  BarChart3, Zap, Database, ExternalLink, MoreHorizontal,
} from 'lucide-react'
import './posthog.css'

interface SparklineProps {
  data: number[]
  color: string
  height?: number
}

function Sparkline({ data, color, height = 28 }: SparklineProps) {
  const width = 120
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const coords = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((val - min) / range) * (height - 6) - 3
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })

  const linePath = `M ${coords.join(' L ')}`
  const areaPath = `M 0,${height} L ${coords.join(' L ')} L ${width},${height} Z`
  const last = coords[coords.length - 1].split(',')

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <path d={areaPath} fill={color} className="ph-sparkline-area" />
      <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={parseFloat(last[0])} cy={parseFloat(last[1])} r="2.5" fill={color} />
    </svg>
  )
}

interface KpiCardProps {
  label: string
  value: string
  change: string
  changeType: 'up' | 'down' | 'neutral'
  sparkData: number[]
  sparkColor: string
  icon: React.ReactNode
}

function KpiCard({ label, value, change, changeType, sparkData, sparkColor, icon }: KpiCardProps) {
  return (
    <div className="ph-card p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="ph-section-label">{label}</span>
        <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: `${sparkColor}18` }}>
          {icon}
        </div>
      </div>
      <div className="ph-kpi-value text-xl">{value}</div>
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-medium flex items-center gap-1 ${
          changeType === 'up' ? 'text-[var(--ph-green)]' :
          changeType === 'down' ? 'text-[var(--ph-orange)]' :
          'text-[var(--ph-text-muted)]'
        }`}>
          {changeType === 'up' && <TrendingUp className="w-3 h-3" />}
          {changeType === 'down' && <TrendingDown className="w-3 h-3" />}
          {change}
        </span>
        <div className="w-16">
          <Sparkline data={sparkData} color={sparkColor} height={20} />
        </div>
      </div>
    </div>
  )
}

interface StreamEvent {
  id: number
  type: 'pageview' | 'capture' | 'identify' | 'feature' | 'error'
  event: string
  distinctId: string
  timestamp: string
  properties?: string
}

const initialEvents: StreamEvent[] = [
  { id: 1, type: 'pageview', event: '$pageview', distinctId: 'user_3x8k2m', timestamp: '2s ago', properties: '/dashboard' },
  { id: 2, type: 'capture', event: 'invoice_created', distinctId: 'user_7j4n9p', timestamp: '5s ago', properties: 'amount=₦2,450,000' },
  { id: 3, type: 'identify', event: '$identify', distinctId: 'user_1a5c8e', timestamp: '8s ago', properties: 'org=BIGDROPS' },
  { id: 4, type: 'feature', event: '$feature_flag_called', distinctId: 'user_9d2f6h', timestamp: '12s ago', properties: 'new_checkout=true' },
  { id: 5, type: 'capture', event: 'quotation_approved', distinctId: 'user_4k8m1n', timestamp: '15s ago', properties: 'id=QUO-000128' },
  { id: 6, type: 'error', event: '$exception', distinctId: 'user_2b7e5a', timestamp: '18s ago', properties: 'TypeError: undefined' },
  { id: 7, type: 'pageview', event: '$pageview', distinctId: 'user_6h3j9k', timestamp: '22s ago', properties: '/invoices/INV-000042' },
  { id: 8, type: 'capture', event: 'payment_received', distinctId: 'user_8f1d4c', timestamp: '25s ago', properties: 'amount=₦540,000' },
]

const eventColors: Record<StreamEvent['type'], string> = {
  pageview: 'var(--ph-blue)',
  capture: 'var(--ph-green)',
  identify: 'var(--ph-amber)',
  feature: '#8b5cf6',
  error: 'var(--ph-orange)',
}

const eventLabels: Record<StreamEvent['type'], string> = {
  pageview: 'PAGE',
  capture: 'EVENT',
  identify: 'ID',
  feature: 'FLAG',
  error: 'ERR',
}

let eventCounter = 9

const newEventTemplates: Omit<StreamEvent, 'id' | 'timestamp'>[] = [
  { type: 'pageview', event: '$pageview', distinctId: 'user_5m2k8p', properties: '/quotations' },
  { type: 'capture', event: 'document_viewed', distinctId: 'user_3n7j1a', properties: 'doc_type=waybill' },
  { type: 'identify', event: '$set', distinctId: 'user_9c4e6b', properties: 'plan=enterprise' },
  { type: 'feature', event: '$feature_flag_called', distinctId: 'user_1h8k3m', properties: 'bulk_export=false' },
  { type: 'capture', event: 'invoice_sent', distinctId: 'user_7p2d9f', properties: 'client=Apex Construction' },
  { type: 'error', event: '$exception', distinctId: 'user_4a6c8e', properties: 'NetworkError: timeout' },
  { type: 'capture', event: 'csr_completed', distinctId: 'user_2k5m7n', properties: 'csr_id=CSR-000089' },
  { type: 'pageview', event: '$pageview', distinctId: 'user_8j3f1d', properties: '/settings' },
]

const activityItems = [
  { icon: <Check className="w-3 h-3" />, color: 'var(--ph-green)', text: 'Payment', amount: '₦540,000', detail: 'Prime Energy', time: '12m ago' },
  { icon: <Eye className="w-3 h-3" />, color: 'var(--ph-blue)', text: 'Zenith Mfg viewed Invoice', ref: '#INV-000043', time: '1h ago' },
  { icon: <Truck className="w-3 h-3" />, color: 'var(--ph-text-muted)', text: 'Waybill', ref: '#WBL-E-000054', detail: 'Nova Logistics', time: '3h ago' },
  { icon: <Check className="w-3 h-3" />, color: 'var(--ph-green)', text: 'Quotation', ref: '#QUO-000128', detail: 'approved by Apex Construction', time: 'Yesterday' },
]

const documents = [
  { type: 'Invoice', ref: '#INV-000042', client: 'Zenith Manufacturing Ltd', amount: '₦2,450,000', date: 'Aug 26, 2026', status: 'Active', icon: <FileText className="w-4 h-4" /> },
  { type: 'Quotation', ref: '#QUO-000128', client: 'Apex Construction', amount: '₦4,120,000', date: 'Aug 25, 2026', status: 'Approved', icon: <FileSpreadsheet className="w-4 h-4" /> },
  { type: 'CSR Log', ref: '#CSR-000089', client: 'GreenFarm Foods', amount: 'Service Log', date: 'Aug 24, 2026', status: 'Signed', icon: <ClipboardCheck className="w-4 h-4" /> },
  { type: 'Waybill', ref: '#WBL-E-000054', client: 'Nova Logistics', amount: '14 Items', date: 'Aug 23, 2026', status: 'In Transit', icon: <Truck className="w-4 h-4" /> },
  { type: 'Correspondence', ref: '#COR-000031', client: 'Sterling Supplies', amount: 'SLA Rev', date: 'Aug 22, 2026', status: 'Sent', icon: <Mail className="w-4 h-4" /> },
  { type: 'RFQ', ref: '#RFQ-000019', client: 'Prime Energy', amount: '₦8,500,000', date: 'Aug 21, 2026', status: 'Tender', icon: <FileQuestion className="w-4 h-4" /> },
]

export default function PosthogDashboard() {
  const [mrr] = useState(8920000)
  const [outstanding] = useState(12540000)
  const [activeCustomers] = useState(48)
  const [runway] = useState(14.2)
  const [collected, setCollected] = useState(8920000)
  const [expected] = useState(15700000)
  const [events, setEvents] = useState<StreamEvent[]>(initialEvents)
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const streamRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      const template = newEventTemplates[Math.floor(Math.random() * newEventTemplates.length)]
      const newEvent: StreamEvent = {
        ...template,
        id: eventCounter++,
        timestamp: 'just now',
      }
      setEvents(prev => [newEvent, ...prev.slice(0, 19)])
      setCollected(prev => prev + Math.floor(Math.random() * 45000))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }

  const burnRate = outstanding
  const collectionRate = ((collected / expected) * 100).toFixed(1)

  const cashFlowSegments = [
    { label: 'Collected', value: collected, color: 'var(--ph-green)' },
    { label: 'Outstanding', value: burnRate * 0.4, color: 'var(--ph-amber)' },
    { label: 'Overdue', value: burnRate * 0.15, color: 'var(--ph-orange)' },
  ]
  const cashFlowTotal = cashFlowSegments.reduce((sum, s) => sum + s.value, 0)

  return (
    <div className="posthog-dashboard">
      <div className="max-w-[1120px] mx-auto px-4 py-5 space-y-4">
        <header className="ph-app-window px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[var(--ph-amber)]" />
              <span className="ph-heading text-base">BIGDROPS</span>
            </div>
            <div className="ph-divider w-px h-4" />
            <div className="ph-tag ph-tag--blue flex items-center gap-1.5">
              <span className="ph-live-dot" />
              LIVE
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="ph-mono text-[10px] text-[var(--ph-text-muted)]">
              {new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
            <div className="ph-divider w-px h-4" />
            <button className="ph-btn p-1.5" onClick={() => showToast('Search activated')}>
              <Search className="w-3.5 h-3.5" />
            </button>
            <button className="ph-btn p-1.5 relative" onClick={() => showToast('3 new notifications')}>
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[var(--ph-orange)]" />
            </button>
          </div>
        </header>

        <section className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="ph-section-label">Financial Snapshot</span>
            <span className="ph-mono text-[9px] text-[var(--ph-text-muted)]">Last 30 points</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            <KpiCard
              label="MRR"
              value={`₦${(mrr / 1000000).toFixed(2)}M`}
              change="+14% vs last month"
              changeType="up"
              sparkData={Array.from({ length: 30 }, (_, i) => 8.5 + Math.sin(i * 0.3) * 1.2 + (Math.random() - 0.5) * 0.4)}
              sparkColor="var(--ph-green)"
              icon={<TrendingUp className="w-3.5 h-3.5" style={{ color: 'var(--ph-green)' }} />}
            />
            <KpiCard
              label="Burn Rate"
              value={`₦${(burnRate / 1000000).toFixed(2)}M`}
              change="48 invoices active"
              changeType="neutral"
              sparkData={Array.from({ length: 30 }, (_, i) => 12.5 + Math.cos(i * 0.25) * 0.8 + (Math.random() - 0.5) * 0.3)}
              sparkColor="var(--ph-amber)"
              icon={<Clock className="w-3.5 h-3.5" style={{ color: 'var(--ph-amber)' }} />}
            />
            <KpiCard
              label="Runway"
              value={`${runway} mo`}
              change="Based on current burn"
              changeType="neutral"
              sparkData={Array.from({ length: 30 }, (_, i) => 14 + Math.sin(i * 0.2) * 0.5 + (Math.random() - 0.5) * 0.2)}
              sparkColor="var(--ph-blue)"
              icon={<BarChart3 className="w-3.5 h-3.5" style={{ color: 'var(--ph-blue)' }} />}
            />
            <KpiCard
              label="Active Customers"
              value={String(activeCustomers)}
              change="6 overdue accounts"
              changeType="down"
              sparkData={Array.from({ length: 30 }, (_, i) => 44 + Math.floor(Math.sin(i * 0.4) * 3 + (Math.random() * 2)))}
              sparkColor="var(--ph-orange)"
              icon={<AlertTriangle className="w-3.5 h-3.5" style={{ color: 'var(--ph-orange)' }} />}
            />
          </div>
        </section>

        <section className="ph-app-window p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="ph-section-label">Cash Flow Forecast</span>
            <div className="flex items-center gap-3">
              {cashFlowSegments.map(s => (
                <div key={s.label} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  <span className="text-[10px] text-[var(--ph-text-muted)]">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-7 rounded overflow-hidden flex">
            {cashFlowSegments.map((segment, i) => {
              const pct = (segment.value / cashFlowTotal) * 100
              return (
                <div
                  key={i}
                  className="ph-bar-segment h-full first:rounded-l last:rounded-r"
                  style={{ width: `${pct}%`, background: segment.color }}
                  title={`${segment.label}: ₦${(segment.value / 1000000).toFixed(1)}M`}
                />
              )
            })}
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="ph-card-soft p-2.5 text-center">
              <div className="text-[9px] text-[var(--ph-text-muted)] uppercase tracking-wider">Expected</div>
              <div className="ph-kpi-value text-sm">₦{(expected / 1000000).toFixed(1)}M</div>
            </div>
            <div className="ph-card-soft p-2.5 text-center">
              <div className="text-[9px] text-[var(--ph-green)] uppercase tracking-wider">Collected</div>
              <div className="ph-kpi-value text-sm" style={{ color: 'var(--ph-green)' }}>₦{(collected / 1000000).toFixed(2)}M</div>
            </div>
            <div className="ph-card-soft p-2.5 text-center">
              <div className="text-[9px] text-[var(--ph-text-muted)] uppercase tracking-wider">Rate</div>
              <div className="ph-kpi-value text-sm">{collectionRate}%</div>
            </div>
          </div>
        </section>

        <section className="ph-app-window p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="ph-section-label flex items-center gap-1.5">
              <Database className="w-3 h-3" />
              Telemetry Stream
            </span>
            <span className="ph-mono text-[9px] text-[var(--ph-text-muted)]">{events.length} events</span>
          </div>
          <div ref={streamRef} className="h-48 overflow-y-auto ph-no-scrollbar space-y-0.5">
            {events.map(evt => (
              <div
                key={evt.id}
                className="ph-stream-item flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-[var(--ph-surface)] transition-colors"
                onClick={() => setSelectedEvent(selectedEvent === evt.id ? null : evt.id)}
              >
                <span
                  className="ph-tag shrink-0"
                  style={{ background: `${eventColors[evt.type]}18`, color: eventColors[evt.type] }}
                >
                  {eventLabels[evt.type]}
                </span>
                <span className="ph-mono text-xs text-[var(--ph-text-primary)] truncate flex-1">{evt.event}</span>
                <span className="ph-mono text-[10px] text-[var(--ph-text-muted)] truncate max-w-[100px]">{evt.distinctId}</span>
                {evt.properties && selectedEvent === evt.id && (
                  <span className="ph-mono text-[10px] text-[var(--ph-text-muted)] truncate max-w-[140px]">{evt.properties}</span>
                )}
                <span className="ph-mono text-[9px] text-[var(--ph-text-muted)] shrink-0">{evt.timestamp}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <section className="ph-app-window p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="ph-section-label">Activity Feed</span>
              <span className="ph-mono text-[9px] text-[var(--ph-text-muted)]">{activityItems.length} recent</span>
            </div>
            <div className="space-y-0">
              {activityItems.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 py-2.5 border-b border-[var(--ph-border-subtle)] last:border-0">
                  <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${item.color}18` }}>
                    <span style={{ color: item.color }}>{item.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[var(--ph-text-body)]">
                      {item.text} {item.amount && <span className="font-medium text-[var(--ph-text-primary)]">{item.amount}</span>}
                      {item.ref && <span className="ph-mono text-[10px]">{item.ref}</span>}
                      {item.detail && <span> {item.detail}</span>}
                    </p>
                    <span className="text-[10px] text-[var(--ph-text-muted)]">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="ph-btn ph-btn--cta w-full text-[11px]" onClick={() => showToast('Opening Audit Hub')}>
              <AlertTriangle className="w-3.5 h-3.5" />
              Open Compiled Audit Hub
              <ExternalLink className="w-3 h-3" />
            </button>
          </section>

          <section className="ph-app-window p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="ph-section-label">Document Management</span>
              <button className="ph-btn text-[10px] py-1 px-2">
                <MoreHorizontal className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-0">
              {documents.map((doc, i) => (
                <div
                  key={i}
                  className="ph-doc-row flex items-center justify-between py-2.5 border-b border-[var(--ph-border-subtle)] last:border-0 cursor-pointer px-1 -mx-1 rounded"
                  onClick={() => showToast(`Opening ${doc.type} ${doc.ref}`)}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded flex items-center justify-center shrink-0 bg-[var(--ph-surface)] text-[var(--ph-text-muted)]">
                      {doc.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-medium text-[var(--ph-text-primary)]">{doc.type}</span>
                        <span className="ph-mono text-[10px] text-[var(--ph-text-muted)]">{doc.ref}</span>
                      </div>
                      <p className="text-[11px] text-[var(--ph-text-body)] truncate">{doc.client}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <div className="ph-kpi-value text-xs">{doc.amount}</div>
                    <span className={`ph-tag text-[8px] mt-0.5 ${
                      doc.status === 'Active' ? 'ph-tag--green' :
                      doc.status === 'Approved' ? 'ph-tag--blue' :
                      doc.status === 'In Transit' ? 'ph-tag--amber' :
                      'ph-tag--blue'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <button
          className="ph-fab"
          onClick={() => showToast('Select Document Type to Create')}
          aria-label="Create Document"
        >
          <Plus className="w-5 h-5" />
        </button>

        {toast && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[var(--ph-text-primary)] text-white text-xs font-medium px-4 py-2 rounded var(--ph-radius) ph-mono whitespace-nowrap animate-[ph-slide-in_0.2s_ease-out]">
            {toast}
          </div>
        )}
      </div>
    </div>
  )
}

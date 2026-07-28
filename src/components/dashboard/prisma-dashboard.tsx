import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Plus, Search, Bell, Menu, X, FileText, FileSpreadsheet,
  ClipboardCheck, Truck, Mail, FileQuestion, Building2,
  ChevronDown, Settings, ShieldAlert, LogOut, Clock,
  TrendingUp, AlertCircle, BellRing, Eye, Check, ArrowRight,
  LayoutDashboard, Folder, FolderKanban, Users, ShieldCheck,
  Package, Layers, CreditCard, Terminal, Activity, BarChart3,
  Zap, Hash, ArrowUpRight, ArrowDownRight, Send,
} from 'lucide-react'
import './prisma.css'

interface SparklineProps {
  baseValue: number
  volatility: number
  color?: string
}

function Sparkline({ baseValue, volatility, color = '#14b8a6' }: SparklineProps) {
  const [points, setPoints] = useState<number[]>(() => {
    const arr: number[] = []
    let val = baseValue
    for (let i = 0; i < 30; i++) {
      val += (Math.random() - 0.48) * volatility
      arr.push(val)
    }
    return arr
  })

  const animRef = useRef<number | null>(null)
  const lastUpdateRef = useRef<number>(performance.now())

  useEffect(() => {
    const handleFrame = (time: number) => {
      if (time - lastUpdateRef.current > 500) {
        lastUpdateRef.current = time
        setPoints((prev) => {
          const last = prev[prev.length - 1]
          const nextVal = Math.max(0, last + (Math.random() - 0.48) * volatility)
          return [...prev.slice(1), nextVal]
        })
      }
      animRef.current = requestAnimationFrame(handleFrame)
    }
    animRef.current = requestAnimationFrame(handleFrame)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [volatility])

  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1
  const width = 140
  const height = 32

  const pathCoords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * width
    const y = height - ((p - min) / range) * (height - 8) - 4
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })

  const linePath = `M ${pathCoords.join(' L ')}`
  const areaPath = `M 0,${height} L ${pathCoords.join(' L ')} L ${width},${height} Z`
  const latestPoint = pathCoords[pathCoords.length - 1].split(',')
  const latestX = parseFloat(latestPoint[0])
  const latestY = parseFloat(latestPoint[1])

  return (
    <div className="relative w-full h-[32px] overflow-hidden">
      <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id={`spark-grad-${baseValue}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#spark-grad-${baseValue})`} />
        <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={latestX} cy={latestY} r="3" fill={color} className="animate-ping opacity-60" />
        <circle cx={latestX} cy={latestY} r="2" fill="#ffffff" stroke={color} strokeWidth="1.5" />
      </svg>
    </div>
  )
}

interface TelemetryEvent {
  id: number
  type: 'invoice' | 'payment' | 'quotation' | 'system' | 'alert'
  message: string
  ref: string
  amount?: string
  time: string
}

const initialTelemetryEvents: TelemetryEvent[] = [
  { id: 1, type: 'invoice', message: 'Invoice dispatched to client portal', ref: '#INV-000042', amount: '₦2,450,000', time: '12m' },
  { id: 2, type: 'payment', message: 'Partial payment reconciled via bank feed', ref: '#INV-000054', amount: '₦540,000', time: '28m' },
  { id: 3, type: 'quotation', message: 'Client approved quotation revision', ref: '#QUO-000128', amount: '₦4,120,000', time: '45m' },
  { id: 4, type: 'system', message: 'Auto-reminder queued for overdue batch', ref: '#SYS-REM', time: '1h' },
  { id: 5, type: 'alert', message: 'SLA breach warning on active quotation', ref: '#QUO-000130', time: '2h' },
  { id: 6, type: 'payment', message: 'Direct debit notice acknowledged', ref: '#INV-000051', amount: '₦3,100,000', time: '3h' },
]

const telemetryTypeConfig: Record<string, { color: string; bg: string; icon: typeof Zap }> = {
  invoice: { color: '#14b8a6', bg: 'rgba(20, 184, 166, 0.1)', icon: FileText },
  payment: { color: '#14b8a6', bg: 'rgba(20, 184, 166, 0.1)', icon: CreditCard },
  quotation: { color: '#14b8a6', bg: 'rgba(20, 184, 166, 0.1)', icon: FileSpreadsheet },
  system: { color: '#6b7280', bg: 'rgba(107, 114, 128, 0.08)', icon: Terminal },
  alert: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', icon: AlertCircle },
}

const activityItems = [
  { icon: Check, iconBg: 'rgba(20, 184, 166, 0.1)', iconColor: '#14b8a6', text: <>Payment <span className="font-medium">₦540,000</span> received from <span className="font-medium">Prime Energy</span></>, time: '12m ago' },
  { icon: Eye, iconBg: 'rgba(107, 114, 128, 0.08)', iconColor: '#6b7280', text: <><span className="font-medium">Zenith Mfg</span> viewed Invoice <span className="font-mono text-[10px]">#INV-000043</span></>, time: '1h ago' },
  { icon: Truck, iconBg: 'rgba(107, 114, 128, 0.08)', iconColor: '#6b7280', text: <>Waybill <span className="font-mono text-[10px]">#WBL-E-000054</span> generated for <span className="font-medium">Nova Logistics</span></>, time: '3h ago' },
  { icon: Check, iconBg: 'rgba(20, 184, 166, 0.1)', iconColor: '#14b8a6', text: <>Quotation <span className="font-mono text-[10px]">#QUO-000128</span> approved by <span className="font-medium">Apex Construction</span></>, time: 'Yesterday' },
  { icon: Send, iconBg: 'rgba(107, 114, 128, 0.08)', iconColor: '#6b7280', text: <>Correspondence <span className="font-mono text-[10px]">#COR-000031</span> sent to <span className="font-medium">Sterling Supplies</span></>, time: 'Yesterday' },
  { icon: AlertCircle, iconBg: 'rgba(245, 158, 11, 0.1)', iconColor: '#f59e0b', text: <>Payment reminder auto-queued for <span className="font-medium">Nova Logistics</span></>, time: '2d ago' },
]

const documentItems = [
  { type: 'Invoice', id: '#INV-000042', client: 'Zenith Manufacturing Ltd', amount: '₦2,450,000', date: 'Aug 26, 2026', status: 'active', icon: FileText },
  { type: 'Quotation', id: '#QUO-000128', client: 'Apex Construction', amount: '₦4,120,000', date: 'Aug 25, 2026', status: 'approved', icon: FileSpreadsheet },
  { type: 'CSR Log', id: '#CSR-000089', client: 'GreenFarm Foods', amount: 'Service Log', date: 'Aug 24, 2026', status: 'signed', icon: ClipboardCheck },
  { type: 'Waybill', id: '#WBL-E-000054', client: 'Nova Logistics', amount: '14 Items', date: 'Aug 23, 2026', status: 'transit', icon: Truck },
  { type: 'Correspondence', id: '#COR-000031', client: 'Sterling Supplies', amount: 'SLA Rev', date: 'Aug 22, 2026', status: 'sent', icon: Mail },
  { type: 'RFQ', id: '#RFQ-000019', client: 'Prime Energy', amount: '₦8,500,000', date: 'Aug 21, 2026', status: 'tender', icon: FileQuestion },
]

const statusStyles: Record<string, { label: string; color: string; bg: string; border?: string }> = {
  active: { label: 'Active', color: '#14b8a6', bg: 'rgba(20, 184, 166, 0.1)' },
  approved: { label: 'Approved', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.06)', border: '#e2e8f0' },
  signed: { label: 'Signed', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.06)', border: '#e2e8f0' },
  transit: { label: 'In Transit', color: '#14b8a6', bg: 'rgba(20, 184, 166, 0.1)' },
  sent: { label: 'Sent', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.06)', border: '#e2e8f0' },
  tender: { label: 'Tender', color: '#14b8a6', bg: 'rgba(20, 184, 166, 0.1)' },
}

const cashFlowSegments = [
  { label: 'Receivables', value: 9.2, color: '#14b8a6' },
  { label: 'Pending', value: 3.3, color: '#94a3b8' },
  { label: 'Overdue', value: 1.18, color: '#e2e8f0' },
]

const navItems = [
  { icon: LayoutDashboard, label: 'Home', active: true },
  { icon: FileText, label: 'Docs', active: false },
  { icon: Truck, label: 'Logistics', active: false },
  { icon: Folder, label: 'Projects', active: false },
  { icon: Menu, label: 'More', active: false },
]

export default function PrismaDashboard() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [activeTenant, setActiveTenant] = useState('BIGDROPS Nigeria Ltd')
  const [mrr, setMrr] = useState(8920000)
  const [burnRate, setBurnRate] = useState(3200000)
  const [activeCustomers, setActiveCustomers] = useState(148)
  const [telemetryId, setTelemetryId] = useState(100)
  const [telemetryEvents, setTelemetryEvents] = useState<TelemetryEvent[]>(initialTelemetryEvents)
  const [selectedDocType, setSelectedDocType] = useState<string | null>(null)
  const telemetryTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setMrr((p) => p + Math.floor(Math.random() * 45000))
      setBurnRate((p) => Math.max(1500000, p + Math.floor((Math.random() - 0.55) * 25000)))
      setActiveCustomers((p) => p + (Math.random() > 0.85 ? 1 : 0))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const types: TelemetryEvent['type'][] = ['invoice', 'payment', 'quotation', 'system', 'alert']
    const messages = [
      'Invoice dispatched to client portal',
      'Partial payment reconciled via bank feed',
      'Client approved quotation revision',
      'Auto-reminder queued for overdue batch',
      'SLA breach warning on active quotation',
      'Direct debit notice acknowledged',
      'Credit note issued against original invoice',
      'Payment schedule updated for project',
      'New CSR logged by operations team',
      'Document export queued for compliance',
    ]

    telemetryTimerRef.current = setInterval(() => {
      setTelemetryId((p) => p + 1)
      setTelemetryEvents((prev) => {
        const next = [...prev]
        const type = types[Math.floor(Math.random() * types.length)]
        const event: TelemetryEvent = {
          id: Date.now(),
          type,
          message: messages[Math.floor(Math.random() * messages.length)],
          ref: `#${type === 'invoice' ? 'INV' : type === 'payment' ? 'PAY' : type === 'quotation' ? 'QUO' : type === 'system' ? 'SYS' : 'ALT'}-${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}`,
          amount: type === 'invoice' || type === 'payment' || type === 'quotation'
            ? `₦${(Math.floor(Math.random() * 9000000) + 100000).toLocaleString()}`
            : undefined,
          time: 'now',
        }
        return [event, ...next.slice(0, 7)]
      })
    }, 3200)
    return () => { if (telemetryTimerRef.current) clearInterval(telemetryTimerRef.current) }
  }, [telemetryId])

  const toggleDrawer = () => setDrawerOpen((p) => !p)

  const handleTenantSwitch = () => {
    const next = activeTenant === 'BIGDROPS Nigeria Ltd' ? 'BIGDROPS Ghana Hub' : 'BIGDROPS Nigeria Ltd'
    setActiveTenant(next)
    showToast(`Workspace: ${next}`)
  }

  const handleModuleSelect = (name: string) => {
    setDrawerOpen(false)
    showToast(`Opened ${name}`)
  }

  const formatCurrency = (val: number) => `₦${(val / 1000000).toFixed(2)}M`

  const runway = mrr > 0 ? Math.floor((mrr / burnRate) * 12) : 0
  const totalCashFlow = cashFlowSegments.reduce((s, seg) => s + seg.value, 0)

  const timestamp = new Date().toLocaleString('en-NG', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false,
  })

  return (
    <div className="prisma-dashboard min-h-screen bg-white flex items-center justify-center p-0 sm:p-4 md:p-6">
      <div className="w-full max-w-[430px] h-[100vh] sm:h-[900px] bg-white relative overflow-hidden sm:rounded-[14px] border-0 sm:border border-[#e2e8f0] flex flex-col">
        <header className="bg-white px-4 py-3.5 flex items-center justify-between z-30 shrink-0 border-b border-[#e2e8f0]">
          <div className="flex items-center gap-3">
            <button onClick={toggleDrawer} className="prisma-btn p-2 bg-[#f3f4f6] text-[#1d242f] border border-[#e2e8f0] flex items-center justify-center" aria-label="Toggle Navigation">
              <Menu className="w-4 h-4" />
            </button>
            <div className="flex flex-col">
              <span className="font-display text-[15px] font-bold text-[#1d242f]">BIGDROPS</span>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="live-badge">
                  <span className="pulsing-dot" />
                  <span>LIVE</span>
                </div>
                <span className="text-[9px] text-[#6b7280] font-mono">{timestamp}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => showToast('Search initialized')} className="prisma-btn p-2 bg-[#f3f4f6] text-[#1d242f] border border-[#e2e8f0] flex items-center justify-center" aria-label="Search">
              <Search className="w-4 h-4" />
            </button>
            <button onClick={() => showToast('8 unread notifications')} className="prisma-btn relative p-2 bg-[#f3f4f6] text-[#1d242f] border border-[#e2e8f0] flex items-center justify-center" aria-label="Notifications">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#14b8a6]" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto no-scrollbar px-4 py-5 space-y-6 pb-24">
          <section className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="section-label">Financial Snapshot</h2>
              <div className="live-badge">
                <span className="pulsing-dot" />
                <span>REAL-TIME</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="prisma-card p-3.5 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-[#6b7280]">MRR</span>
                  <div className="w-7 h-7 rounded-[6px] bg-[rgba(20,184,166,0.1)] flex items-center justify-center">
                    <TrendingUp className="w-3.5 h-3.5 text-[#14b8a6]" />
                  </div>
                </div>
                <div className="my-2">
                  <div className="kpi-value text-[22px] text-[#1d242f]">{formatCurrency(mrr)}</div>
                  <span className="text-[9px] text-[#6b7280] uppercase tracking-wider font-medium">Monthly Recurring</span>
                </div>
                <Sparkline baseValue={8.9} volatility={0.1} />
              </div>

              <div className="prisma-card p-3.5 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-[#6b7280]">Burn Rate</span>
                  <div className="w-7 h-7 rounded-[6px] bg-[#f3f4f6] flex items-center justify-center border border-[#e2e8f0]">
                    <BarChart3 className="w-3.5 h-3.5 text-[#6b7280]" />
                  </div>
                </div>
                <div className="my-2">
                  <div className="kpi-value text-[22px] text-[#1d242f]">{formatCurrency(burnRate)}</div>
                  <span className="text-[9px] text-[#6b7280] uppercase tracking-wider font-medium">Monthly Expenses</span>
                </div>
                <Sparkline baseValue={3.2} volatility={0.06} color="#6b7280" />
              </div>

              <div className="prisma-card p-3.5 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-[#6b7280]">Runway</span>
                  <div className="w-7 h-7 rounded-[6px] bg-[rgba(20,184,166,0.1)] flex items-center justify-center">
                    <Clock className="w-3.5 h-3.5 text-[#14b8a6]" />
                  </div>
                </div>
                <div className="my-2">
                  <div className="kpi-value text-[22px] text-[#1d242f]">{runway} <span className="text-[13px] text-[#6b7280]">mo</span></div>
                  <span className="text-[9px] text-[#14b8a6] uppercase tracking-wider font-medium bg-[rgba(20,184,166,0.1)] px-1.5 py-0.5 rounded inline-block">Healthy Margin</span>
                </div>
                <Sparkline baseValue={33.4} volatility={0.3} />
              </div>

              <div className="prisma-card p-3.5 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-[#6b7280]">Customers</span>
                  <div className="w-7 h-7 rounded-[6px] bg-[#f3f4f6] flex items-center justify-center border border-[#e2e8f0]">
                    <Users className="w-3.5 h-3.5 text-[#6b7280]" />
                  </div>
                </div>
                <div className="my-2">
                  <div className="kpi-value text-[22px] text-[#1d242f]">{activeCustomers}</div>
                  <span className="text-[9px] text-[#6b7280] uppercase tracking-wider font-medium">Active Accounts</span>
                </div>
                <Sparkline baseValue={148} volatility={0.4} color="#94a3b8" />
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="section-label px-0.5">Cash Flow Forecast</h2>
            <div className="prisma-card p-4 space-y-4">
              <div className="space-y-3">
                {cashFlowSegments.map((seg) => (
                  <div key={seg.label} className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-[#6b7280]">{seg.label}</span>
                      <span className="text-[11px] font-medium text-[#1d242f]">₦{seg.value}M</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${(seg.value / totalCashFlow) * 100}%`, background: seg.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-[#e2e8f0] grid grid-cols-3 gap-2">
                <div className="text-center">
                  <div className="text-[9px] text-[#6b7280] uppercase tracking-wider mb-1">Total</div>
                  <div className="text-[13px] font-bold text-[#1d242f]">₦{totalCashFlow.toFixed(1)}M</div>
                </div>
                <div className="text-center">
                  <div className="text-[9px] text-[#14b8a6] uppercase tracking-wider mb-1">Collected</div>
                  <div className="text-[13px] font-bold text-[#14b8a6]">{formatCurrency(mrr)}</div>
                </div>
                <div className="text-center">
                  <div className="text-[9px] text-[#6b7280] uppercase tracking-wider mb-1">Rate</div>
                  <div className="text-[13px] font-bold text-[#1d242f]">{((mrr / (totalCashFlow * 1000000)) * 100).toFixed(1)}%</div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex justify-between items-center px-0.5">
              <h2 className="section-label flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-[#14b8a6]" /> Telemetry Stream
              </h2>
              <span className="text-[9px] text-[#6b7280] font-mono">{telemetryEvents.length} events</span>
            </div>
            <div className="prisma-card-bone p-4 max-h-[280px] overflow-y-auto no-scrollbar space-y-2">
              {telemetryEvents.map((evt, idx) => {
                const cfg = telemetryTypeConfig[evt.type]
                const Icon = cfg.icon
                return (
                  <div
                    key={evt.id}
                    className="telemetry-event flex items-start gap-2.5 py-2.5 border-b border-[#e2e8f0] last:border-0"
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    <div className="w-7 h-7 rounded-[6px] flex items-center justify-center shrink-0 mt-0.5" style={{ background: cfg.bg }}>
                      <Icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: cfg.color }}>{evt.type}</span>
                        <span className="text-[10px] font-mono text-[#6b7280]">{evt.ref}</span>
                        <span className="text-[9px] text-[#94a3b8] font-mono ml-auto shrink-0">{evt.time}</span>
                      </div>
                      <p className="text-[11px] text-[#111827] leading-relaxed">{evt.message}</p>
                      {evt.amount && (
                        <span className="text-[11px] font-bold text-[#1d242f] mt-1 inline-block">{evt.amount}</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="section-label px-0.5">Activity Feed</h2>
            <div className="prisma-card p-4 space-y-0">
              {activityItems.map((item, idx) => {
                const Icon = item.icon
                return (
                  <div key={idx} className={`flex items-start gap-3 py-3 ${idx < activityItems.length - 1 ? 'border-b border-[#e2e8f0]' : ''}`}>
                    <div className="w-7 h-7 rounded-[6px] flex items-center justify-center shrink-0 mt-0.5" style={{ background: item.iconBg }}>
                      <Icon className="w-3.5 h-3.5" style={{ color: item.iconColor }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] text-[#111827] leading-relaxed">{item.text}</p>
                      <span className="text-[9px] text-[#94a3b8]">{item.time}</span>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="text-center pt-1">
              <button
                onClick={() => showToast('Audit Hub opened')}
                className="prisma-btn text-[11px] font-semibold tracking-wider uppercase inline-flex items-center gap-1.5 py-2 px-5 bg-[#14b8a6] text-white"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Open Audit Hub</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="section-label px-0.5">Document Management</h2>
            <div className="prisma-card divide-y divide-[#e2e8f0] overflow-hidden">
              {documentItems.map((doc, idx) => {
                const Icon = doc.icon
                const st = statusStyles[doc.status]
                return (
                  <div
                    key={idx}
                    className="p-3.5 flex items-center justify-between hover:bg-[#f3f4f6] transition-colors cursor-pointer"
                    onClick={() => showToast(`Opening ${doc.type} ${doc.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-[6px] bg-[#f3f4f6] border border-[#e2e8f0] flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-[#6b7280]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-medium text-[#1d242f]">{doc.type}</span>
                          <span className="text-[9px] font-mono text-[#6b7280]">{doc.id}</span>
                        </div>
                        <p className="text-[10px] text-[#94a3b8]">{doc.client}</p>
                        <span className="text-[9px] text-[#94a3b8] font-mono">{doc.date}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[13px] font-bold text-[#1d242f]">{doc.amount}</div>
                      <span
                        className="inline-block text-[8px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded mt-0.5"
                        style={{
                          color: st.color,
                          background: st.bg,
                          border: st.border ? `1px solid ${st.border}` : 'none',
                        }}
                      >
                        {st.label}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="section-label px-0.5 flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-[#14b8a6]" /> System Output
            </h2>
            <div className="code-block">
              <div><span className="token-comment">// system output — live telemetry</span></div>
              <div><span className="token-keyword">const</span> <span className="token-function">pipeline</span> = <span className="token-string">"BIGDROPS v2.4"</span>;</div>
              <div><span className="token-keyword">const</span> <span className="token-function">mrr</span> = <span className="token-number">{mrr.toLocaleString()}</span>;</div>
              <div><span className="token-keyword">const</span> <span className="token-function">burn</span> = <span className="token-number">{burnRate.toLocaleString()}</span>;</div>
              <div><span className="token-keyword">const</span> <span className="token-function">runway</span> = <span className="token-number">{runway}</span>;</div>
              <div><span className="token-keyword">const</span> <span className="token-function">customers</span> = <span className="token-number">{activeCustomers}</span>;</div>
              <div className="mt-1"><span className="token-keyword">if</span> (runway &gt; <span className="token-number">12</span>) {'{'}</div>
              <div className="pl-4"><span className="token-function">console</span>.<span className="token-function">log</span>(<span className="token-string">"Financial health: stable"</span>);</div>
              <div>{'}'}</div>
            </div>
          </section>
        </main>

        <button
          onClick={() => {
            setSelectedDocType(null)
            setDrawerOpen(true)
            showToast('Select document type to create')
          }}
          className="prisma-fab"
          aria-label="Create Document"
        >
          <Plus className="w-5 h-5" />
        </button>

        <div
          className={`absolute inset-0 bg-[#1d242f]/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={toggleDrawer}
        />

        <div
          className={`absolute top-0 left-0 bottom-0 w-[82%] max-w-[310px] bg-white text-[#1d242f] z-50 transition-transform duration-300 ease-out flex flex-col justify-between border-r border-[#e2e8f0] ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="space-y-4 p-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#e2e8f0]">
              <h3 className="font-display text-[15px] font-bold text-[#1d242f]">BIGDROPS</h3>
              <button onClick={toggleDrawer} className="prisma-btn p-1.5 bg-[#f3f4f6] text-[#1d242f] border border-[#e2e8f0]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <span className="text-[9px] text-[#6b7280] uppercase tracking-wider px-1 font-medium">Active Workspace</span>
              <button
                onClick={handleTenantSwitch}
                className="w-full prisma-card p-2.5 flex items-center justify-between text-left hover:bg-[#f3f4f6] transition-colors"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <Building2 className="w-4 h-4 text-[#1d242f] shrink-0" />
                  <span className="text-[11px] font-medium text-[#1d242f] truncate">{activeTenant}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#6b7280] shrink-0 ml-1" />
              </button>
            </div>

            <div className="prisma-card p-3 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-[6px] bg-[#1d242f] flex items-center justify-center text-white text-[11px] font-bold">
                CO
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[11px] font-medium text-[#1d242f] truncate">Chinedu Okonkwo</h4>
                <p className="text-[9px] text-[#94a3b8] truncate">Senior Operations Lead</p>
              </div>
            </div>

            <div className="space-y-1 overflow-y-auto max-h-[360px] no-scrollbar pr-1">
              <div className="text-[9px] text-[#6b7280] uppercase tracking-wider mb-1 px-1 font-medium">Core Modules</div>
              {[
                { icon: FileText, label: 'Invoices', active: true },
                { icon: FileSpreadsheet, label: 'Quotations' },
                { icon: ClipboardCheck, label: 'Customer Service Reports (CSR)' },
                { icon: Truck, label: 'Waybills (Ext & Int)' },
                { icon: CreditCard, label: 'Payments Ledger' },
                { icon: FolderKanban, label: 'Projects Engagement' },
                { icon: Users, label: 'Client Management' },
              ].map((mod) => (
                <button
                  key={mod.label}
                  onClick={() => handleModuleSelect(mod.label)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-[11px] transition-colors ${mod.active ? 'bg-[#14b8a6] text-white font-medium' : 'text-[#1d242f] hover:bg-[#f3f4f6]'}`}
                >
                  <mod.icon className="w-3.5 h-3.5" />
                  <span>{mod.label}</span>
                </button>
              ))}
              <div className="text-[9px] text-[#6b7280] uppercase tracking-wider mt-3 mb-1 px-1 font-medium">Management</div>
              {[
                { icon: ShieldCheck, label: 'Compliance Hub' },
                { icon: ShieldAlert, label: 'Audit Hub & Token Ledger' },
                { icon: Package, label: 'Item Library' },
                { icon: Layers, label: 'Bill of Quantities (BOQ)' },
                { icon: FileQuestion, label: 'Request for Quotation (RFQ)' },
                { icon: Settings, label: 'Settings' },
              ].map((mod) => (
                <button
                  key={mod.label}
                  onClick={() => handleModuleSelect(mod.label)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-[11px] text-[#1d242f] hover:bg-[#f3f4f6] transition-colors"
                >
                  <mod.icon className="w-3.5 h-3.5 text-[#6b7280]" />
                  <span>{mod.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#e2e8f0] px-4 pb-4 space-y-2">
            <button
              onClick={() => { setDrawerOpen(false); showToast('Signed out') }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-[6px] bg-[#1d242f] text-white text-[11px] font-medium uppercase tracking-wider"
            >
              <LogOut className="w-3.5 h-3.5 text-[#14b8a6]" />
              <span>Sign Out</span>
            </button>
            <div className="text-center text-[8px] text-[#94a3b8] tracking-wider uppercase">
              BIGDROPS Mode System v2.4
            </div>
          </div>
        </div>

        <nav className="bg-white border-t border-[#e2e8f0] px-2 py-2 flex justify-around items-center z-30 shrink-0">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                onClick={() => {
                  if (item.label === 'More') toggleDrawer()
                  else showToast(`Switched to ${item.label}`)
                }}
                className={`flex flex-col items-center justify-center space-y-0.5 transition-transform active:scale-95 w-12 prisma-btn ${item.active ? 'text-[#14b8a6]' : 'text-[#6b7280] hover:text-[#1d242f]'}`}
              >
                <Icon className="w-4 h-4" />
                <span className={`text-[9px] ${item.active ? 'font-semibold' : 'font-normal'}`}>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="w-full bg-white pb-1.5 flex justify-center z-30">
          <div className="w-28 h-1 bg-[#e2e8f0] rounded-full" />
        </div>

        {toast && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#1d242f] text-white text-[11px] font-medium px-4 py-2 rounded-[6px] shadow-lg whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-200">
            {toast}
          </div>
        )}
      </div>
    </div>
  )
}

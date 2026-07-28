import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Plus, Search, Bell, Menu, X, FileText, FileSpreadsheet,
  ClipboardCheck, Truck, Mail, FileQuestion, Building2,
  ChevronDown, Settings, ShieldAlert, LogOut, Clock,
  TrendingUp, AlertCircle, Eye, Check, ArrowRight,
  LayoutDashboard, Folder, FolderKanban, Users, ShieldCheck,
  Package, Layers, CreditCard, Zap, ArrowUpRight, ArrowDownRight,
} from 'lucide-react'
import './morflax-dashboard.css'

interface SparklineProps {
  baseValue: number
  volatility: number
  color?: string
}

function Sparkline({ baseValue, volatility, color = '#7c7e83' }: SparklineProps) {
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
  const height = 36

  const pathCoords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * width
    const y = height - ((p - min) / range) * (height - 10) - 5
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })

  const linePath = `M ${pathCoords.join(' L ')}`
  const areaPath = `M 0,${height} L ${pathCoords.join(' L ')} L ${width},${height} Z`
  const latestPoint = pathCoords[pathCoords.length - 1].split(',')
  const latestX = parseFloat(latestPoint[0])
  const latestY = parseFloat(latestPoint[1])

  return (
    <div className="morflax-sparkline">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id={`spark-grad-m-${baseValue}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.12" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#spark-grad-m-${baseValue})`} />
        <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={latestX} cy={latestY} r="2.5" fill={color} opacity="0.5" />
        <circle cx={latestX} cy={latestY} r="1.5" fill="var(--morflax-porcelain)" stroke={color} strokeWidth="1.5" />
      </svg>
    </div>
  )
}

interface CashFlowChartProps {
  collected: number
  outstanding: number
}

function CashFlowChart({ collected, outstanding }: CashFlowChartProps) {
  const [animProgress, setAnimProgress] = useState(0)

  useEffect(() => {
    const start = performance.now()
    const duration = 2400
    const tick = (now: number) => {
      const elapsed = now - start
      const t = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setAnimProgress(eased)
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [])

  const width = 400
  const height = 160
  const padding = { top: 20, right: 20, bottom: 30, left: 20 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom

  const forecastData = [
    42, 38, 45, 40, 52, 48, 55, 50, 58, 54, 60, 56,
    62, 58, 65, 60, 68, 64, 70, 66, 72, 68, 75, 71,
  ]
  const collectedData = [
    28, 32, 30, 35, 33, 38, 36, 40, 38, 42, 40, 44,
    42, 46, 44, 48, 46, 50, 48, 52, 50, 54, 52, 56,
  ]

  const maxVal = 80
  const visibleCount = Math.ceil(forecastData.length * animProgress)

  const toPath = (data: number[], count: number) => {
    const pts = data.slice(0, count).map((v, i) => {
      const x = padding.left + (i / (data.length - 1)) * chartW
      const y = padding.top + chartH - (v / maxVal) * chartH
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    if (pts.length < 2) return ''
    if (pts.length === 2) return `M ${pts[0]} L ${pts[1]}`
    const first = pts[0].split(',').map(Number)
    let d = `M ${pts[0]}`
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1].split(',').map(Number)
      const curr = pts[i].split(',').map(Number)
      const cpx1 = prev[0] + (curr[0] - prev[0]) * 0.4
      const cpx2 = prev[0] + (curr[0] - prev[0]) * 0.6
      d += ` C ${cpx1.toFixed(1)},${prev[1]} ${cpx2.toFixed(1)},${curr[1]} ${curr[0].toFixed(1)},${curr[1].toFixed(1)}`
    }
    return d
  }

  const toArea = (data: number[], count: number) => {
    const line = toPath(data, count)
    if (!line) return ''
    const lastIdx = Math.min(count - 1, data.length - 1)
    const lastX = padding.left + (lastIdx / (data.length - 1)) * chartW
    const firstX = padding.left
    return `${line} L ${lastX.toFixed(1)},${padding.top + chartH} L ${firstX.toFixed(1)},${padding.top + chartH} Z`
  }

  const forecastPath = toPath(forecastData, visibleCount)
  const forecastArea = toArea(forecastData, visibleCount)
  const collectedPath = toPath(collectedData, visibleCount)
  const collectedArea = toArea(collectedData, visibleCount)

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const labelIndices = [0, 3, 6, 9]

  return (
    <div className="morflax-chart-card">
      <div className="morflax-chart-header">
        <span className="morflax-chart-title">Cash Flow Forecast</span>
        <div className="morflax-chart-legend">
          <span className="morflax-chart-legend-item">
            <span className="morflax-chart-legend-dot" style={{ background: '#171718' }} />
            Collected
          </span>
          <span className="morflax-chart-legend-item">
            <span className="morflax-chart-legend-dot" style={{ background: '#7c7e83' }} />
            Forecast
          </span>
        </div>
      </div>
      <svg className="morflax-chart-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="morflax-forecast-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c7e83" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#7c7e83" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="morflax-collected-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#171718" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#171718" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        {forecastArea && <path d={forecastArea} fill="url(#morflax-forecast-fill)" />}
        {collectedArea && <path d={collectedArea} fill="url(#morflax-collected-fill)" />}
        {forecastPath && (
          <path
            d={forecastPath}
            fill="none"
            stroke="#7c7e83"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="4 3"
          />
        )}
        {collectedPath && (
          <path
            d={collectedPath}
            fill="none"
            stroke="#171718"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
      <div className="morflax-chart-labels">
        {labelIndices.map((i) => (
          <span key={i} className="morflax-chart-label">{months[i]}</span>
        ))}
      </div>
    </div>
  )
}

interface Notification {
  type: string
  ref: string
  client: string
  amount: string
  time: string
  desc: string
}

const notificationsList: Notification[] = [
  { type: 'Invoice', ref: '#INV-000042', client: 'Zenith Manufacturing Ltd', amount: '₦2,450,000', time: '12m ago', desc: 'New invoice generated & dispatched.' },
  { type: 'Quotation', ref: '#QUO-000128', client: 'Apex Construction', amount: '₦4,120,000', time: '45m ago', desc: 'Quotation reviewed by client.' },
  { type: 'Invoice', ref: '#INV-000048', client: 'Nova Logistics', amount: '₦820,000', time: '2h ago', desc: 'Payment reminder auto-queued.' },
  { type: 'Quotation', ref: '#QUO-000130', client: 'GreenFarm Foods', amount: '₦1,150,000', time: '3h ago', desc: 'Draft quotation updated with VAT.' },
  { type: 'Invoice', ref: '#INV-000051', client: 'Sterling Supplies', amount: '₦3,100,000', time: '5h ago', desc: 'Direct debit notice acknowledged.' },
  { type: 'Invoice', ref: '#INV-000054', client: 'Prime Energy', amount: '₦540,000', time: '6h ago', desc: 'Partial payment reconciled.' },
]

interface Document {
  type: string
  ref: string
  client: string
  amount: string
  date: string
  status: string
}

const documents: Document[] = [
  { type: 'Invoice', ref: '#INV-000042', client: 'Zenith Manufacturing Ltd', amount: '₦2,450,000', date: 'Aug 26, 2026', status: 'Active' },
  { type: 'Quotation', ref: '#QUO-000128', client: 'Apex Construction', amount: '₦4,120,000', date: 'Aug 25, 2026', status: 'Approved' },
  { type: 'CSR Log', ref: '#CSR-000089', client: 'GreenFarm Foods', amount: '', date: 'Aug 24, 2026', status: 'Signed' },
  { type: 'Waybill (Ext)', ref: '#WBL-E-000054', client: 'Nova Logistics', amount: '14 Items', date: 'Aug 23, 2026', status: 'In Transit' },
  { type: 'Correspondence', ref: '#COR-000031', client: 'Sterling Supplies', amount: 'SLA Rev', date: 'Aug 22, 2026', status: 'Sent' },
  { type: 'RFQ', ref: '#RFQ-000019', client: 'Prime Energy', amount: '₦8,500,000', date: 'Aug 21, 2026', status: 'Tender' },
]

const activityItems = [
  { icon: Check, variant: 'check' as const, text: <>Payment <strong>₦540,000</strong> received from <strong>Prime Energy</strong></>, time: '12m ago' },
  { icon: Eye, variant: 'alert' as const, text: <><strong>Zenith Mfg</strong> viewed Invoice <code>#INV-000043</code></>, time: '1h ago' },
  { icon: Truck, variant: 'send' as const, text: <>Waybill <code>#WBL-E-000054</code> generated for <strong>Nova Logistics</strong></>, time: '3h ago' },
  { icon: Check, variant: 'check' as const, text: <>Quotation <code>#QUO-000128</code> approved by <strong>Apex Construction</strong></>, time: 'Yesterday' },
  { icon: ArrowRight, variant: 'send' as const, text: <>Correspondence <code>#COR-000031</code> sent to <strong>Sterling Supplies</strong></>, time: 'Yesterday' },
  { icon: AlertCircle, variant: 'alert' as const, text: <>Payment reminder auto-queued for <strong>Nova Logistics</strong></>, time: '2d ago' },
]

const docTypeIcons: Record<string, typeof FileText> = {
  'Invoice': FileText,
  'Quotation': FileSpreadsheet,
  'CSR Log': ClipboardCheck,
  'Waybill (Ext)': Truck,
  'Correspondence': Mail,
  'RFQ': FileQuestion,
}

const navItems = [
  { icon: LayoutDashboard, label: 'Home', active: true },
  { icon: FileText, label: 'Docs', active: false },
  { icon: Truck, label: 'Logistics', active: false },
  { icon: Folder, label: 'Projects', active: false },
  { icon: Users, label: 'More', active: false },
]

const drawerModules = [
  { icon: FileText, label: 'Invoices', active: true },
  { icon: FileSpreadsheet, label: 'Quotations' },
  { icon: ClipboardCheck, label: 'Customer Service Reports' },
  { icon: Truck, label: 'Waybills' },
  { icon: CreditCard, label: 'Payments Ledger' },
  { icon: FolderKanban, label: 'Projects' },
  { icon: Users, label: 'Client Management' },
]

const drawerManagement = [
  { icon: ShieldCheck, label: 'Compliance Hub' },
  { icon: ShieldAlert, label: 'Audit Hub' },
  { icon: Package, label: 'Item Library' },
  { icon: Layers, label: 'Bill of Quantities' },
  { icon: FileQuestion, label: 'RFQ Module' },
  { icon: Settings, label: 'Settings' },
]

export default function MorflaxDashboard() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [activeTenant, setActiveTenant] = useState('BIGDROPS Nigeria Ltd')
  const [outstandingAmount, setOutstandingAmount] = useState(12540000)
  const [collectedAmount, setCollectedAmount] = useState(8920000)
  const [notifScrollRef, setNotifScrollRef] = useState<HTMLDivElement | null>(null)
  const [touchStart, setTouchStart] = useState<number | null>(null)

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setOutstandingAmount((p) => p + Math.floor((Math.random() - 0.45) * 80000))
      setCollectedAmount((p) => p + Math.floor(Math.random() * 35000))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

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

  const handleNotifTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleNotifTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null || !notifScrollRef) return
    const diff = touchStart - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) {
      notifScrollRef.scrollBy({ left: diff > 0 ? -300 : 300, behavior: 'smooth' })
    }
    setTouchStart(null)
  }

  const timestamp = new Date().toLocaleString('en-NG', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false,
  })

  return (
    <div className="morflax-dashboard">
      <div className="morflax-shell">
        <nav className="morflax-nav">
          <span className="morflax-nav-brand">BIGDROPS</span>
          <div className="morflax-nav-actions">
            <button
              className="morflax-nav-btn"
              onClick={() => showToast('Search activated')}
              aria-label="Search"
            >
              <Search />
            </button>
            <button
              className="morflax-nav-btn"
              onClick={() => showToast('8 unread notifications')}
              aria-label="Notifications"
            >
              <Bell />
            </button>
          </div>
        </nav>

        <div className="morflax-hero">
          <div className="morflax-hero-wordmark">BIGDROPS</div>
          <p className="morflax-hero-sub">
            Invoice management and financial operations for modern enterprises.
          </p>
          <div className="morflax-hero-meta">
            <div className="morflax-hero-badge">
              <span className="morflax-hero-pulse" />
              LIVE
            </div>
            <span className="morflax-hero-timestamp">{timestamp}</span>
          </div>
        </div>

        <main className="morflax-main no-scrollbar">
          <section className="morflax-section morflax-section--top">
            <div className="morflax-section-label">Financial Overview</div>
            <div className="morflax-kpi-grid">
              <div className="morflax-kpi-card">
                <div className="morflax-kpi-header">
                  <span className="morflax-kpi-label">Outstanding</span>
                  <div className="morflax-kpi-icon">
                    <TrendingUp />
                  </div>
                </div>
                <div className="morflax-kpi-value">{formatCurrency(outstandingAmount)}</div>
                <span className="morflax-kpi-sub">48 Invoices Active</span>
                <Sparkline baseValue={12.5} volatility={0.12} />
              </div>

              <div className="morflax-kpi-card">
                <div className="morflax-kpi-header">
                  <span className="morflax-kpi-label">Due This Week</span>
                  <div className="morflax-kpi-icon">
                    <Clock />
                  </div>
                </div>
                <div className="morflax-kpi-value">₦3.24M</div>
                <span className="morflax-kpi-sub">9 Action Needed</span>
                <Sparkline baseValue={3.2} volatility={0.08} />
              </div>

              <div className="morflax-kpi-card">
                <div className="morflax-kpi-header">
                  <span className="morflax-kpi-label">Payments Recv.</span>
                  <div className="morflax-kpi-icon">
                    <ArrowUpRight />
                  </div>
                </div>
                <div className="morflax-kpi-value">{formatCurrency(collectedAmount)}</div>
                <div className="morflax-kpi-tag morflax-kpi-tag--positive">
                  <ArrowUpRight style={{ width: 12, height: 12 }} />
                  +14% vs last month
                </div>
                <Sparkline baseValue={8.9} volatility={0.1} />
              </div>

              <div className="morflax-kpi-card">
                <div className="morflax-kpi-header">
                  <span className="morflax-kpi-label">Overdue</span>
                  <div className="morflax-kpi-icon">
                    <AlertCircle />
                  </div>
                </div>
                <div className="morflax-kpi-value">₦1.18M</div>
                <div className="morflax-kpi-tag morflax-kpi-tag--negative">
                  <ArrowDownRight style={{ width: 12, height: 12 }} />
                  6 Overdue
                </div>
                <Sparkline baseValue={1.18} volatility={0.06} color="#a3a7ad" />
              </div>
            </div>
          </section>

          <section className="morflax-scroll-container">
            <div className="morflax-section-label">Cash Flow Forecast</div>
            <CashFlowChart collected={collectedAmount} outstanding={outstandingAmount} />
          </section>

          <section className="morflax-section">
            <div className="morflax-section-label">Recent Notifications</div>
            <div
              className="morflax-notifications-track no-scrollbar"
              ref={setNotifScrollRef}
              onTouchStart={handleNotifTouchStart}
              onTouchEnd={handleNotifTouchEnd}
            >
              {notificationsList.map((n, i) => (
                <div className="morflax-notification-card" key={i}>
                  <div className="morflax-notification-top">
                    <span className="morflax-notification-type">{n.type}</span>
                    <span className="morflax-notification-time">{n.time}</span>
                  </div>
                  <div className="morflax-notification-ref">{n.ref}</div>
                  <div className="morflax-notification-client">{n.client}</div>
                  <div className="morflax-notification-amount">{n.amount}</div>
                  <div className="morflax-notification-desc">{n.desc}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="morflax-section">
            <div className="morflax-section-label">Recent Documents</div>
            <div className="morflax-doc-list">
              {documents.map((doc, i) => {
                const Icon = docTypeIcons[doc.type] || FileText
                return (
                  <div className="morflax-doc-row" key={i} onClick={() => showToast(`Opened ${doc.ref}`)}>
                    <div className="morflax-doc-icon">
                      <Icon />
                    </div>
                    <div className="morflax-doc-info">
                      <div className="morflax-doc-ref">{doc.ref}</div>
                      <div className="morflax-doc-client">{doc.client}</div>
                    </div>
                    <div className="morflax-doc-meta">
                      <div className="morflax-doc-amount">{doc.amount || '—'}</div>
                      <div className="morflax-doc-date">{doc.date}</div>
                      <span className="morflax-doc-status">{doc.status}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="morflax-section">
            <div className="morflax-section-label">Activity Feed</div>
            <div className="morflax-activity-list">
              {activityItems.map((item, i) => {
                const Icon = item.icon
                return (
                  <div className="morflax-activity-item" key={i}>
                    <div className={`morflax-activity-icon morflax-activity-icon--${item.variant}`}>
                      <Icon />
                    </div>
                    <div className="morflax-activity-text">{item.text}</div>
                    <span className="morflax-activity-time">{item.time}</span>
                  </div>
                )
              })}
            </div>
          </section>
        </main>

        <button
          className="morflax-fab"
          onClick={() => showToast('Create Invoice')}
          aria-label="Create Invoice"
        >
          <Plus />
        </button>

        <div
          className={`morflax-drawer-backdrop ${drawerOpen ? 'morflax-drawer-backdrop--open' : ''}`}
          onClick={toggleDrawer}
        />

        <div className={`morflax-drawer ${drawerOpen ? 'morflax-drawer--open' : ''}`}>
          <div className="morflax-drawer-header">
            <span className="morflax-drawer-title">BIGDROPS</span>
            <button className="morflax-drawer-close" onClick={toggleDrawer} aria-label="Close menu">
              <X />
            </button>
          </div>

          <div className="morflax-drawer-body">
            <div className="morflax-drawer-section-label">Active Workspace</div>
            <button className="morflax-drawer-workspace-btn" onClick={handleTenantSwitch}>
              <Building2 style={{ width: 16, height: 16, color: 'var(--morflax-ink)' }} />
              <span>{activeTenant}</span>
              <ChevronDown />
            </button>

            <div className="morflax-drawer-section-label">Core Modules</div>
            {drawerModules.map((mod) => {
              const Icon = mod.icon
              return (
                <button
                  key={mod.label}
                  className={`morflax-drawer-module ${mod.active ? 'morflax-drawer-module--active' : ''}`}
                  onClick={() => handleModuleSelect(mod.label)}
                >
                  <Icon />
                  <span>{mod.label}</span>
                </button>
              )
            })}

            <div className="morflax-drawer-section-label" style={{ marginTop: 24 }}>Management</div>
            {drawerManagement.map((mod) => {
              const Icon = mod.icon
              return (
                <button
                  key={mod.label}
                  className="morflax-drawer-module"
                  onClick={() => handleModuleSelect(mod.label)}
                >
                  <Icon />
                  <span>{mod.label}</span>
                </button>
              )
            })}
          </div>

          <div className="morflax-drawer-footer">
            <button
              className="morflax-drawer-signout"
              onClick={() => { setDrawerOpen(false); showToast('Signed out') }}
            >
              <LogOut />
              Sign Out
            </button>
            <div className="morflax-drawer-version">BIGDROPS Mode System v2.4</div>
          </div>
        </div>

        <nav className="morflax-bottom-nav">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                className={`morflax-bottom-nav-item ${item.active ? 'morflax-bottom-nav-item--active' : ''}`}
                onClick={() => {
                  if (item.label === 'More') toggleDrawer()
                  else showToast(`Switched to ${item.label}`)
                }}
              >
                <Icon />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {toast && (
          <div className="morflax-toast">{toast}</div>
        )}
      </div>
    </div>
  )
}

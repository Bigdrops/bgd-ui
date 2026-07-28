import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Search, Bell, ArrowRight, Plus, X, Eye, Truck, Check,
  LayoutDashboard, FileText, Folder, Menu, FileSpreadsheet,
  ClipboardCheck, Mail, CreditCard, FolderKanban, Users,
  ShieldCheck, Package, Layers, FileQuestion, Building2,
  ChevronDown, Settings, ShieldAlert, LogOut, Clock,
  TrendingUp, AlertCircle, BellRing, Sun, Moon,
} from 'lucide-react'
import './prav-dashboard.css'

const notificationsList = [
  { type: 'Invoice', ref: '#INV-000042', client: 'Zenith Manufacturing Ltd', amount: '₦2,450,000', time: '12m ago', desc: 'New invoice generated & dispatched.' },
  { type: 'Quotation', ref: '#QUO-000128', client: 'Apex Construction', amount: '₦4,120,000', time: '45m ago', desc: 'Quotation reviewed by client.' },
  { type: 'Invoice', ref: '#INV-000048', client: 'Nova Logistics', amount: '₦820,000', time: '2h ago', desc: 'Payment reminder auto-queued.' },
  { type: 'Quotation', ref: '#QUO-000130', client: 'GreenFarm Foods', amount: '₦1,150,000', time: '3h ago', desc: 'Draft quotation updated with VAT.' },
  { type: 'Invoice', ref: '#INV-000051', client: 'Sterling Supplies', amount: '₦3,100,000', time: '5h ago', desc: 'Direct debit notice acknowledged.' },
  { type: 'Invoice', ref: '#INV-000054', client: 'Prime Energy', amount: '₦540,000', time: '6h ago', desc: 'Partial payment reconciled.' },
]

function StackedColumnChart({ data, height = 52 }: { data: { segments: number[] }[]; height?: number }) {
  const maxTotal = Math.max(...data.map(d => d.segments.reduce((a, b) => a + b, 0)))
  const colors = ['var(--prav-chart-1)', 'var(--prav-chart-2)', 'var(--prav-chart-3)']

  return (
    <div className="prav-stacked-bar-chart" style={{ height }}>
      {data.map((col, ci) => {
        const total = col.segments.reduce((a, b) => a + b, 0)
        return (
          <div key={ci} className="prav-stacked-col">
            {col.segments.map((seg, si) => (
              <div
                key={si}
                className="prav-stacked-seg"
                style={{
                  height: `${(seg / maxTotal) * 100}%`,
                  background: colors[si % colors.length],
                  opacity: 1 - si * 0.15,
                }}
              />
            ))}
          </div>
        )
      })}
    </div>
  )
}

function SteppedChart({ expected, collected }: { expected: number; collected: number }) {
  const [history, setHistory] = useState<{ col: number; exp: number }[]>(() => {
    const arr: { col: number; exp: number }[] = []
    for (let i = 0; i < 30; i++) {
      arr.push({
        col: collected * (0.6 + Math.sin(i * 0.12) * 0.2 + Math.random() * 0.05),
        exp: expected * (0.7 + Math.sin(i * 0.1) * 0.15),
      })
    }
    return arr
  })

  const animRef = useRef<number | null>(null)
  const lastTick = useRef(performance.now())

  useEffect(() => {
    const frame = (time: number) => {
      if (time - lastTick.current > 500) {
        lastTick.current = time
        setHistory(prev => {
          const last = prev[prev.length - 1]
          return [...prev.slice(1), {
            col: Math.max(0, last.col + (Math.random() - 0.45) * 120000),
            exp: Math.max(0, last.exp + (Math.random() - 0.48) * 90000),
          }]
        })
      }
      animRef.current = requestAnimationFrame(frame)
    }
    animRef.current = requestAnimationFrame(frame)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [])

  const width = 400
  const height = 120
  const maxVal = Math.max(...history.map(d => Math.max(d.col, d.exp))) * 1.1 || 1

  const buildSteppedPath = (vals: number[]) => {
    const pts: string[] = []
    for (let i = 0; i < vals.length; i++) {
      const x = (i / (vals.length - 1)) * width
      const y = height - (vals[i] / maxVal) * (height - 20) - 10
      if (i === 0) {
        pts.push(`M ${x.toFixed(1)},${y.toFixed(1)}`)
      } else {
        const prevX = ((i - 1) / (vals.length - 1)) * width
        pts.push(`L ${x.toFixed(1)},${height - (vals[i - 1] / maxVal) * (height - 20) - 10}`)
        pts.push(`L ${x.toFixed(1)},${y.toFixed(1)}`)
      }
    }
    return pts.join(' ')
  }

  const colVals = history.map(d => d.col)
  const expVals = history.map(d => d.exp)
  const colPath = buildSteppedPath(colVals)
  const expPath = buildSteppedPath(expVals)

  const lastColY = height - (colVals[colVals.length - 1] / maxVal) * (height - 20) - 10
  const lastX = width

  return (
    <div className="prav-stepped-chart">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {[30, 60, 90].map(y => (
          <line key={y} x1="0" y1={y} x2={width} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" strokeDasharray="4,4" />
        ))}
        <path d={expPath} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="4,3" className="prav-chart-line" />
        <path d={colPath} fill="none" stroke="var(--prav-positive)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="prav-chart-line" />
        <circle cx={lastX} cy={lastColY} r="3" fill="var(--prav-positive)" className="prav-chart-dot-pulse" />
      </svg>
    </div>
  )
}

export default function PravDashboard() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [activeTenant, setActiveTenant] = useState('BIGDROPS Nigeria Ltd')
  const [collectedAmount, setCollectedAmount] = useState(8920000)
  const [outstandingAmount, setOutstandingAmount] = useState(12540000)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const touchStartXRef = useRef(0)
  const touchEndXRef = useRef(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCollectedAmount(prev => prev + Math.floor(Math.random() * 45000))
      setOutstandingAmount(prev => Math.max(0, prev - Math.floor(Math.random() * 25000)))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % notificationsList.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 2200)
  }, [])

  const toggleDrawer = useCallback(() => setIsDrawerOpen(prev => !prev), [])

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }, [])

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndXRef.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return
    const distance = touchStartXRef.current - touchEndXRef.current
    if (distance > 40) {
      setCurrentSlideIndex(prev => (prev + 1) % notificationsList.length)
    } else if (distance < -40) {
      setCurrentSlideIndex(prev => (prev - 1 + notificationsList.length) % notificationsList.length)
    }
    touchStartXRef.current = 0
    touchEndXRef.current = 0
  }

  const handleModuleSelect = (moduleName: string) => {
    setIsDrawerOpen(false)
    showToast(`Opened ${moduleName}`)
  }

  const handleTenantSwitch = () => {
    const next = activeTenant === 'BIGDROPS Nigeria Ltd' ? 'BIGDROPS Ghana Hub' : 'BIGDROPS Nigeria Ltd'
    setActiveTenant(next)
    showToast(`Switched workspace to ${next}`)
  }

  const outstandingKpiData = [
    { segments: [14, 3, 1] }, { segments: [13.5, 3.2, 1.1] }, { segments: [13, 3.4, 1.2] },
    { segments: [12.8, 3.5, 1.15] }, { segments: [12.6, 3.6, 1.1] }, { segments: [12.5, 3.7, 1.0] },
    { segments: [12.54, 3.24, 1.18] },
  ]
  const dueKpiData = [
    { segments: [2.8, 0.4] }, { segments: [2.9, 0.35] }, { segments: [3, 0.3] },
    { segments: [3.1, 0.28] }, { segments: [3, 0.32] }, { segments: [3.2, 0.25] },
    { segments: [3.24, 0.22] },
  ]
  const paymentsKpiData = [
    { segments: [6.2, 1.2] }, { segments: [6.8, 1.3] }, { segments: [7.1, 1.4] },
    { segments: [7.6, 1.5] }, { segments: [8, 1.6] }, { segments: [8.5, 1.7] },
    { segments: [8.92, 1.8] },
  ]
  const overdueKpiData = [
    { segments: [1.5, 0.3] }, { segments: [1.4, 0.28] }, { segments: [1.3, 0.26] },
    { segments: [1.25, 0.24] }, { segments: [1.2, 0.22] }, { segments: [1.18, 0.2] },
    { segments: [1.18, 0.18] },
  ]

  const cashFlowSegments = [
    { label: 'Receivables', value: 62, color: 'var(--prav-positive)' },
    { label: 'Pending', value: 24, color: 'var(--prav-muted)' },
    { label: 'Overdue', value: 14, color: 'var(--prav-negative)' },
  ]

  return (
    <div className="prav-dashboard" data-theme={theme} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {toastMessage && <div className="prav-toast">{toastMessage}</div>}

      {isDrawerOpen && <div className="prav-drawer-overlay" onClick={toggleDrawer} />}

      <div className="prav-drawer" style={{ transform: isDrawerOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
        <div>
          <div className="prav-drawer-header">
            <span className="prav-brand">BIGDROPS</span>
            <button onClick={toggleDrawer} className="prav-drawer-close">
              <X size={14} color="var(--prav-text)" />
            </button>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div className="prav-drawer-section-label" style={{ marginTop: 0 }}>Active Workspace</div>
            <button onClick={handleTenantSwitch} className="prav-tenant-btn">
              <Building2 size={14} color="var(--prav-text)" />
              <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{activeTenant}</span>
              <ChevronDown size={14} color="var(--prav-muted)" />
            </button>
          </div>

          <div className="prav-drawer-profile">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120" alt="Chinedu Okonkwo" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--prav-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Chinedu Okonkwo</div>
              <div style={{ fontSize: 11, color: 'var(--prav-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Senior Operations Lead</div>
            </div>
          </div>

          <div className="prav-drawer-modules">
            <div className="prav-drawer-section-label">Core Modules</div>
            {[
              { icon: <FileText size={14} />, name: 'Invoices', active: true },
              { icon: <FileSpreadsheet size={14} />, name: 'Quotations' },
              { icon: <ClipboardCheck size={14} />, name: 'Customer Service Reports (CSR)' },
              { icon: <Truck size={14} />, name: 'Waybills (Ext & Int)' },
              { icon: <CreditCard size={14} />, name: 'Payments Ledger' },
              { icon: <FolderKanban size={14} />, name: 'Projects Engagement' },
              { icon: <Users size={14} />, name: 'Client Management' },
            ].map(mod => (
              <button key={mod.name} onClick={() => handleModuleSelect(mod.name)} className={`prav-drawer-module-btn ${mod.active ? 'prav-drawer-module-btn--active' : ''}`}>
                {mod.icon}<span>{mod.name}</span>
              </button>
            ))}

            <div className="prav-drawer-section-label">Management & Governance</div>
            {[
              { icon: <ShieldCheck size={14} />, name: 'Compliance Hub' },
              { icon: <ShieldAlert size={14} />, name: 'Audit Hub & Token Ledger' },
              { icon: <Package size={14} />, name: 'Item Library' },
              { icon: <Layers size={14} />, name: 'Bill of Quantities (BOQ)' },
              { icon: <FileQuestion size={14} />, name: 'Request for Quotation (RFQ)' },
              { icon: <Settings size={14} />, name: 'Settings' },
            ].map(mod => (
              <button key={mod.name} onClick={() => handleModuleSelect(mod.name)} className="prav-drawer-module-btn">
                {mod.icon}<span>{mod.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="prav-drawer-footer">
          <button onClick={() => { setIsDrawerOpen(false); showToast('Signed out successfully') }} className="prav-drawer-signout">
            <LogOut size={14} /><span>Sign Out</span>
          </button>
          <div className="prav-drawer-version">BIGDROPS Mode System v2.4</div>
        </div>
      </div>

      <div className="prav-shell">
        <header className="prav-header">
          <div className="prav-header-left">
            <button onClick={toggleDrawer} className="prav-icon-btn" aria-label="Toggle Navigation Drawer">
              <Menu size={16} color="var(--prav-text)" />
            </button>
            <span className="prav-brand">BIGDROPS</span>
            <span className="prav-live-badge"><span className="prav-pulsing-dot" />LIVE</span>
          </div>

          <div className="prav-header-right">
            <button onClick={() => showToast('Search query initialized')} className="prav-icon-btn" aria-label="Search">
              <Search size={15} color="var(--prav-text)" />
            </button>
            <button onClick={() => showToast('8 updates in system ledger')} className="prav-icon-btn" aria-label="Notifications" style={{ position: 'relative' }}>
              <Bell size={15} color="var(--prav-text)" />
              <span style={{ position: 'absolute', top: 3, right: 3, width: 7, height: 7, background: 'var(--prav-positive)', borderRadius: '50%', border: '1.5px solid var(--prav-surface)' }} />
            </button>

            <div className="prav-theme-pill" data-theme={theme} onClick={toggleTheme} role="button" tabIndex={0} aria-label="Toggle theme" onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') toggleTheme() }}>
              <div className="prav-theme-pill-thumb">
                <Sun size={14} className="prav-theme-pill-icon prav-theme-pill-icon--sun" />
                <Moon size={14} className="prav-theme-pill-icon prav-theme-pill-icon--moon" />
              </div>
              <span className="prav-theme-pill-label prav-theme-pill-label--light">Light</span>
              <span className="prav-theme-pill-label prav-theme-pill-label--dark">Dark</span>
            </div>
          </div>
        </header>

        <div className="prav-scroll no-scrollbar">
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--prav-border-subtle)' }}>
            <button onClick={handleTenantSwitch} className="prav-tenant-btn">
              <Building2 size={14} color="var(--prav-text)" />
              <span style={{ flex: 1, textAlign: 'left' }}>{activeTenant}</span>
              <ChevronDown size={14} color="var(--prav-muted)" />
            </button>
          </div>

          <div className="prav-notification-carousel">
            <div className="prav-card prav-carousel-card" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
              <div className="prav-carousel-icon">
                {notificationsList[currentSlideIndex].type === 'Invoice' ? <FileText size={14} color="var(--prav-text)" /> : <FileSpreadsheet size={14} color="var(--prav-text)" />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--prav-text)' }}>{notificationsList[currentSlideIndex].type} {notificationsList[currentSlideIndex].ref}</div>
                <div style={{ fontSize: 12, color: 'var(--prav-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{notificationsList[currentSlideIndex].desc}</div>
              </div>
              <span style={{ fontSize: 11, color: 'var(--prav-muted)', flexShrink: 0 }}>{notificationsList[currentSlideIndex].time}</span>
            </div>
            <div className="prav-carousel-dots">
              {notificationsList.map((_, i) => (
                <div key={i} className={`prav-dot ${i === currentSlideIndex ? 'prav-dot--active' : 'prav-dot--inactive'}`} />
              ))}
            </div>
          </div>

          <section className="prav-section">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h2 className="prav-section-label">Financial Snapshot</h2>
              <div className="prav-live-badge"><span className="prav-pulsing-dot" />REAL-TIME</div>
            </div>
            <div className="prav-kpi-grid">
              {[
                { label: 'Outstanding', value: `₦${(outstandingAmount / 1000000).toFixed(2)}M`, sub: '48 Invoices Active', data: outstandingKpiData, icon: <Clock size={14} />, iconBg: 'var(--prav-accent-soft)', iconColor: 'var(--prav-text)' },
                { label: 'Due This Week', value: '₦3.24M', sub: '9 Action Needed', data: dueKpiData, icon: <AlertCircle size={14} />, iconBg: 'var(--prav-negative-soft)', iconColor: 'var(--prav-negative)' },
                { label: 'Payments Recv.', value: `₦${(collectedAmount / 1000000).toFixed(2)}M`, sub: '+14% vs last month', data: paymentsKpiData, icon: <TrendingUp size={14} />, iconBg: 'var(--prav-positive-soft)', iconColor: 'var(--prav-positive)' },
                { label: 'Overdue', value: '₦1.18M', sub: '6 Overdue', data: overdueKpiData, icon: <ShieldAlert size={14} />, iconBg: 'var(--prav-accent-soft)', iconColor: 'var(--prav-text)' },
              ].map(kpi => (
                <div key={kpi.label} className="prav-card prav-kpi-card">
                  <div className="prav-kpi-header">
                    <span className="prav-section-label" style={{ fontSize: 10 }}>{kpi.label}</span>
                    <div className="prav-kpi-icon" style={{ background: kpi.iconBg, color: kpi.iconColor }}>{kpi.icon}</div>
                  </div>
                  <div className="prav-kpi-value" style={{ fontSize: 22, color: 'var(--prav-text)', margin: '4px 0 8px' }}>{kpi.value}</div>
                  <span className="prav-kpi-sub">{kpi.sub}</span>
                  <StackedColumnChart data={kpi.data} height={52} />
                </div>
              ))}
            </div>
          </section>

          <section className="prav-section">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <h2 className="prav-section-label">Cash Flow Forecast</h2>
              <div className="prav-cashflow-live">
                <span className="prav-pulsing-dot" />
                <span style={{ fontSize: 9, color: 'var(--prav-positive)', fontFamily: 'monospace', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>LIVE</span>
              </div>
            </div>
            <div className="prav-cashflow-card">
              <div className="prav-cashflow-header">
                <span className="prav-kpi-value" style={{ fontSize: 16 }}>Cash Flow Forecast</span>
              </div>

              <SteppedChart collected={collectedAmount} expected={15700000} />

              <div className="prav-segment-bar">
                {cashFlowSegments.map(seg => (
                  <div key={seg.label} className="prav-segment-bar-seg" style={{ width: `${seg.value}%`, background: seg.color }} />
                ))}
              </div>

              <div className="prav-segment-legend">
                {cashFlowSegments.map(seg => (
                  <div key={seg.label} className="prav-segment-legend-item">
                    <div className="prav-segment-legend-dot" style={{ background: seg.color }} />
                    <span className="prav-segment-legend-label">{seg.label}</span>
                    <span className="prav-segment-legend-value">{seg.value}%</span>
                  </div>
                ))}
              </div>

              <div className="prav-stats-row">
                <div className="prav-stat-item">
                  <div className="prav-stat-label">Expected</div>
                  <div className="prav-kpi-value" style={{ fontSize: 15 }}>₦15.7M</div>
                </div>
                <div className="prav-stat-item">
                  <div className="prav-stat-label prav-stat-label--accent">Collected</div>
                  <div className="prav-kpi-value" style={{ fontSize: 15, color: 'var(--prav-positive)' }}>₦{(collectedAmount / 1000000).toFixed(2)}M</div>
                </div>
                <div className="prav-stat-item">
                  <div className="prav-stat-label">Rate</div>
                  <div className="prav-kpi-value" style={{ fontSize: 15 }}>{((collectedAmount / 15700000) * 100).toFixed(1)}%</div>
                </div>
              </div>
            </div>
          </section>

          <section className="prav-section prav-section--tight">
            <h2 className="prav-section-label" style={{ marginBottom: 10 }}>Recently Created Documents</h2>
            <div className="prav-card prav-doc-list">
              {[
                { type: 'Invoice', ref: '#INV-000042', client: 'Zenith Manufacturing Ltd', amount: '₦2,450,000', date: 'Aug 26, 2026', status: 'Active', statusType: 'primary' as const, icon: <FileText size={16} />, iconBg: 'var(--prav-accent)', iconFg: 'var(--prav-fab-text)' },
                { type: 'Quotation', ref: '#QUO-000128', client: 'Apex Construction', amount: '₦4,120,000', date: 'Aug 25, 2026', status: 'Approved', statusType: 'secondary' as const, icon: <FileSpreadsheet size={16} />, iconBg: 'var(--prav-surface-alt)', iconFg: 'var(--prav-text)' },
                { type: 'CSR Log', ref: '#CSR-000089', client: 'GreenFarm Foods', amount: '', date: 'Aug 24, 2026', status: 'Signed', statusType: 'secondary' as const, icon: <ClipboardCheck size={16} />, iconBg: 'var(--prav-surface-alt)', iconFg: 'var(--prav-text)' },
                { type: 'Waybill (Ext)', ref: '#WBL-E-000054', client: 'Nova Logistics', amount: '14 Items', date: 'Aug 23, 2026', status: 'In Transit', statusType: 'primary' as const, icon: <Truck size={16} />, iconBg: 'var(--prav-accent)', iconFg: 'var(--prav-fab-text)' },
                { type: 'Correspondence', ref: '#COR-000031', client: 'Sterling Supplies', amount: 'SLA Rev', date: 'Aug 22, 2026', status: 'Sent', statusType: 'secondary' as const, icon: <Mail size={16} />, iconBg: 'var(--prav-surface-alt)', iconFg: 'var(--prav-text)' },
                { type: 'RFQ', ref: '#RFQ-000019', client: 'Prime Energy', amount: '₦8,500,000', date: 'Aug 21, 2026', status: 'Tender', statusType: 'primary' as const, icon: <FileQuestion size={16} />, iconBg: 'var(--prav-accent)', iconFg: 'var(--prav-fab-text)' },
              ].map((doc, idx, arr) => (
                <div key={idx} onClick={() => showToast(`Opening ${doc.type} ${doc.ref}`)} className="prav-doc-item" style={{ borderBottom: idx < arr.length - 1 ? '1px solid var(--prav-border-subtle)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="prav-doc-icon" style={{ background: doc.iconBg, color: doc.iconFg }}>{doc.icon}</div>
                    <div>
                      <div className="prav-doc-meta">
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--prav-text)' }}>{doc.type}</span>
                        <span className="prav-doc-ref">{doc.ref}</span>
                      </div>
                      <div className="prav-doc-client">{doc.client}</div>
                      <div className="prav-doc-date">{doc.date}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {doc.amount && <div className="prav-kpi-value" style={{ fontSize: 15, color: 'var(--prav-text)' }}>{doc.amount}</div>}
                    <span className={`prav-badge prav-badge--${doc.statusType}`}>{doc.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="prav-section prav-section--tight">
            <h2 className="prav-section-label" style={{ marginBottom: 10 }}>Recent Activity</h2>
            <div className="prav-card" style={{ padding: '12px 14px' }}>
              {[
                { icon: <Check size={12} />, iconBg: 'var(--prav-positive-soft)', iconColor: 'var(--prav-positive)', text: <>Payment <strong>₦540,000</strong> for Prime Energy</>, time: '12m ago' },
                { icon: <Eye size={12} />, iconBg: 'var(--prav-accent-soft)', iconColor: 'var(--prav-text-secondary)', text: <>Zenith Mfg viewed Invoice <span style={{ fontFamily: 'monospace', fontSize: 10 }}>#INV-000043</span></>, time: '1h ago' },
                { icon: <Truck size={12} />, iconBg: 'var(--prav-accent-soft)', iconColor: 'var(--prav-text-secondary)', text: <>Waybill <span style={{ fontFamily: 'monospace', fontSize: 10 }}>#WBL-E-000054</span> generated for Nova Logistics</>, time: '3h ago' },
                { icon: <Check size={12} />, iconBg: 'var(--prav-positive-soft)', iconColor: 'var(--prav-positive)', text: <>Quotation <span style={{ fontFamily: 'monospace', fontSize: 10 }}>#QUO-000128</span> approved by <strong>Apex Construction</strong></>, time: 'Yesterday 4:15 PM' },
              ].map((item, idx) => (
                <div key={idx} className="prav-activity-item">
                  <div className="prav-activity-icon" style={{ background: item.iconBg, color: item.iconColor }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <p className="prav-activity-text">{item.text}</p>
                    <span className="prav-activity-time">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
              <button onClick={() => handleModuleSelect('Audit Hub')} className="prav-audit-btn">
                <ShieldAlert size={13} /><span>Open Compiled Audit Hub</span><ArrowRight size={12} />
              </button>
            </div>
          </section>
        </div>

        <button onClick={() => showToast('Select Document Type to Create')} className="prav-fab" aria-label="Create Document">
          <Plus size={22} strokeWidth={2.5} />
        </button>

        <nav className="prav-bottom-nav">
          {[
            { icon: <LayoutDashboard size={16} />, label: 'Home', active: true },
            { icon: <FileText size={16} />, label: 'Docs' },
            { icon: <Truck size={16} />, label: 'Dispatch' },
            { icon: <Folder size={16} />, label: 'Projects' },
            { icon: <Menu size={16} />, label: 'More', onClick: toggleDrawer },
          ].map(item => (
            <button key={item.label} onClick={item.onClick || (() => showToast(`Switched to ${item.label}`))} className={`prav-nav-item ${item.active ? 'prav-nav-item--active' : ''}`}>
              {item.icon}<span className={`prav-nav-label ${item.active ? 'prav-nav-label--active' : ''}`}>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="prav-home-indicator">
          <div className="prav-home-indicator-bar" />
        </div>
      </div>
    </div>
  )
}

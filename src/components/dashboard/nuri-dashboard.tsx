import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Search, Bell, ArrowRight, Plus, X, Eye, Truck, Check,
  LayoutDashboard, FileText, Folder, Menu, FileSpreadsheet,
  ClipboardCheck, Mail, CreditCard, FolderKanban, Users,
  ShieldCheck, Package, Layers, FileQuestion, Building2,
  ChevronDown, Settings, ShieldAlert, LogOut, Clock,
  TrendingUp, AlertCircle, Sun, Moon,
} from 'lucide-react'
import './nuri-dashboard.css'

const notificationsList = [
  { type: 'Invoice', ref: '#INV-000042', client: 'Zenith Manufacturing Ltd', amount: '₦2,450,000', time: '12m ago', desc: 'New invoice generated & dispatched.' },
  { type: 'Quotation', ref: '#QUO-000128', client: 'Apex Construction', amount: '₦4,120,000', time: '45m ago', desc: 'Quotation reviewed by client.' },
  { type: 'Invoice', ref: '#INV-000048', client: 'Nova Logistics', amount: '₦820,000', time: '2h ago', desc: 'Payment reminder auto-queued.' },
  { type: 'Quotation', ref: '#QUO-000130', client: 'GreenFarm Foods', amount: '₦1,150,000', time: '3h ago', desc: 'Draft quotation updated with VAT.' },
  { type: 'Invoice', ref: '#INV-000051', client: 'Sterling Supplies', amount: '₦3,100,000', time: '5h ago', desc: 'Direct debit notice acknowledged.' },
  { type: 'Invoice', ref: '#INV-000054', client: 'Prime Energy', amount: '₦540,000', time: '6h ago', desc: 'Partial payment reconciled.' },
]

function TimelineChart({ data, color, height = 40 }: { data: number[]; color: string; height?: number }) {
  const width = 300
  const min = Math.min(...data) * 0.92
  const max = Math.max(...data) * 1.04
  const range = max - min || 1
  const coords = data.map((val, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((val - min) / range) * (height - 8) - 4,
  }))
  const smoothPath = coords.reduce((acc, point, i, arr) => {
    if (i === 0) return `M ${point.x},${point.y}`
    const prev = arr[i - 1]
    const cpx1 = prev.x + (point.x - prev.x) * 0.35
    const cpx2 = prev.x + (point.x - prev.x) * 0.65
    return `${acc} C ${cpx1},${prev.y} ${cpx2},${point.y} ${point.x},${point.y}`
  }, '')
  const areaPath = `${smoothPath} L ${width},${height} L 0,${height} Z`
  return (
    <svg className="nuri-timeline-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`nuri-tg-${color.replace(/[^a-z0-9]/gi, '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#nuri-tg-${color.replace(/[^a-z0-9]/gi, '')})`} />
      <path d={smoothPath} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx={coords[coords.length - 1].x} cy={coords[coords.length - 1].y} r="2.5" fill={color} />
    </svg>
  )
}

function LiveTimeline({ baseValue, volatility, color }: { baseValue: number; volatility: number; color: string }) {
  const [points, setPoints] = useState<number[]>(() => {
    const arr: number[] = []; let val = baseValue
    for (let i = 0; i < 20; i++) { val += (Math.random() - 0.48) * volatility; arr.push(val) }
    return arr
  })
  const animRef = useRef<number | null>(null)
  const lastTick = useRef(performance.now())
  useEffect(() => {
    const frame = (time: number) => {
      if (time - lastTick.current > 550) {
        lastTick.current = time
        setPoints(prev => { const last = prev[prev.length - 1]; return [...prev.slice(1), Math.max(0, last + (Math.random() - 0.48) * volatility)] })
      }
      animRef.current = requestAnimationFrame(frame)
    }
    animRef.current = requestAnimationFrame(frame)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [volatility])
  return <TimelineChart data={points} color={color} />
}

function CumulativeWave({ collected, expected }: { collected: number; expected: number }) {
  const [history, setHistory] = useState<{ col: number; exp: number }[]>(() => {
    const arr: { col: number; exp: number }[] = []
    for (let i = 0; i < 28; i++) {
      arr.push({ col: collected * (0.55 + Math.sin(i * 0.11) * 0.22 + Math.random() * 0.04), exp: expected * (0.65 + Math.sin(i * 0.09) * 0.18) })
    }
    return arr
  })
  useEffect(() => {
    const interval = setInterval(() => {
      setHistory(prev => { const last = prev[prev.length - 1]; return [...prev.slice(1), { col: Math.max(0, last.col + (Math.random() - 0.44) * 130000), exp: Math.max(0, last.exp + (Math.random() - 0.47) * 95000) }] })
    }, 650)
    return () => clearInterval(interval)
  }, [])

  const width = 380, height = 120
  const maxVal = Math.max(...history.map(d => Math.max(d.col, d.exp))) * 1.1 || 1
  const buildSmoothPath = (vals: number[]) => {
    const coords = vals.map((v, i) => ({ x: (i / (vals.length - 1)) * width, y: height - (v / maxVal) * (height - 16) - 8 }))
    return coords.reduce((acc, point, i, arr) => {
      if (i === 0) return `M ${point.x},${point.y}`
      const prev = arr[i - 1]; const cpx1 = prev.x + (point.x - prev.x) * 0.3; const cpx2 = prev.x + (point.x - prev.x) * 0.7
      return `${acc} C ${cpx1},${prev.y} ${cpx2},${point.y} ${point.x},${point.y}`
    }, '')
  }
  const colPath = buildSmoothPath(history.map(d => d.col))
  const expPath = buildSmoothPath(history.map(d => d.exp))
  const colCoords = history.map((d, i) => ({ x: (i / (history.length - 1)) * width, y: height - (d.col / maxVal) * (height - 16) - 8 }))
  const lastPt = colCoords[colCoords.length - 1]
  const areaPath = `${colPath} L ${width},${height} L 0,${height} Z`

  return (
    <svg className="nuri-cashflow-chart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="nuri-cf-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--nuri-chart-stroke)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="var(--nuri-chart-stroke)" stopOpacity="0.01" />
        </linearGradient>
      </defs>
      {[30, 60, 90].map(y => <line key={y} x1="0" y1={y} x2={width} y2={y} stroke="var(--nuri-timeline-color)" strokeWidth="0.5" strokeDasharray="3,3" />)}
      <path d={areaPath} fill="url(#nuri-cf-fill)" />
      <path d={expPath} fill="none" stroke="var(--nuri-text-muted)" strokeWidth="1" strokeDasharray="4,3" opacity={0.4} />
      <path d={colPath} fill="none" stroke="var(--nuri-chart-stroke)" strokeWidth="2" strokeLinecap="round" />
      <circle cx={lastPt.x} cy={lastPt.y} r="4" fill="var(--nuri-chart-stroke)" opacity={0.2}>
        <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx={lastPt.x} cy={lastPt.y} r="2.5" fill="var(--nuri-chart-stroke)" />
    </svg>
  )
}

function DatabaseIcon({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>
}

export default function NuriDashboard() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [activeTenant, setActiveTenant] = useState('BIGDROPS Nigeria Ltd')
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [collectedAmount, setCollectedAmount] = useState(8920000)
  const [outstandingAmount, setOutstandingAmount] = useState(12540000)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const touchStartXRef = useRef(0)
  const touchEndXRef = useRef(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCollectedAmount(p => p + Math.floor(Math.random() * 45000))
      setOutstandingAmount(p => Math.max(0, p - Math.floor(Math.random() * 25000)))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlideIndex(p => (p + 1) % notificationsList.length), 4500)
    return () => clearInterval(timer)
  }, [])

  const showToast = useCallback((msg: string) => { setToastMessage(msg); setTimeout(() => setToastMessage(null), 2200) }, [])
  const toggleDrawer = useCallback(() => setIsDrawerOpen(p => !p), [])
  const toggleTheme = useCallback(() => setTheme(p => p === 'light' ? 'dark' : 'light'), [])

  const handleTouchStart = (e: React.TouchEvent) => { touchStartXRef.current = e.targetTouches[0].clientX }
  const handleTouchMove = (e: React.TouchEvent) => { touchEndXRef.current = e.targetTouches[0].clientX }
  const handleTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return
    const d = touchStartXRef.current - touchEndXRef.current
    if (d > 40) setCurrentSlideIndex(p => (p + 1) % notificationsList.length)
    else if (d < -40) setCurrentSlideIndex(p => (p - 1 + notificationsList.length) % notificationsList.length)
    touchStartXRef.current = 0; touchEndXRef.current = 0
  }

  const handleModuleSelect = (name: string) => { setIsDrawerOpen(false); showToast(`Opened ${name}`) }
  const handleTenantSwitch = () => {
    const next = activeTenant === 'BIGDROPS Nigeria Ltd' ? 'BIGDROPS Ghana Hub' : 'BIGDROPS Nigeria Ltd'
    setActiveTenant(next); showToast(`Switched workspace to ${next}`)
  }

  const kpis = [
    { label: 'Outstanding', value: `₦${(outstandingAmount / 1000000).toFixed(2)}M`, sub: '48 Invoices Active', data: [14.2, 13.8, 13.5, 13.1, 12.8, 12.5, 12.54], color: 'var(--nuri-chart-stroke)', icon: <Clock size={14} />, vol: 0.12 },
    { label: 'Due This Week', value: '₦3.24M', sub: '9 Action Needed', data: [2.8, 2.9, 3.0, 3.1, 3.0, 3.2, 3.24], color: 'var(--nuri-badge-overdue-text)', icon: <AlertCircle size={14} />, vol: 0.06 },
    { label: 'Payments Recv.', value: `₦${(collectedAmount / 1000000).toFixed(2)}M`, sub: '+14% vs last month', data: [6.2, 6.8, 7.1, 7.6, 8.0, 8.5, 8.92], color: 'var(--nuri-badge-positive-text)', icon: <TrendingUp size={14} />, vol: 0.1 },
    { label: 'Overdue', value: '₦1.18M', sub: '6 Overdue', data: [1.5, 1.4, 1.3, 1.25, 1.2, 1.18, 1.18], color: 'var(--nuri-text-muted)', icon: <ShieldAlert size={14} />, vol: 0.04 },
  ]

  const cashFlowSegments = [
    { label: 'Receivables', value: 62, color: 'var(--nuri-chart-stroke)' },
    { label: 'Pending', value: 24, color: 'var(--nuri-chart-secondary)' },
    { label: 'Overdue', value: 14, color: 'var(--nuri-text-muted)' },
  ]

  const documents = [
    { type: 'Invoice', ref: '#INV-000042', client: 'Zenith Manufacturing Ltd', amount: '₦2,450,000', date: 'Aug 26, 2026', status: 'Active', cls: 'invoice' },
    { type: 'Quotation', ref: '#QUO-000128', client: 'Apex Construction', amount: '₦4,120,000', date: 'Aug 25, 2026', status: 'Approved', cls: 'estimate' },
    { type: 'CSR Log', ref: '#CSR-000089', client: 'GreenFarm Foods', amount: '', date: 'Aug 24, 2026', status: 'Signed', cls: 'receipt' },
    { type: 'Waybill (Ext)', ref: '#WBL-E-000054', client: 'Nova Logistics', amount: '14 Items', date: 'Aug 23, 2026', status: 'In Transit', cls: 'credit' },
    { type: 'Correspondence', ref: '#COR-000031', client: 'Sterling Supplies', amount: 'SLA Rev', date: 'Aug 22, 2026', status: 'Sent', cls: 'estimate' },
    { type: 'RFQ', ref: '#RFQ-000019', client: 'Prime Energy', amount: '₦8,500,000', date: 'Aug 21, 2026', status: 'Tender', cls: 'invoice' },
  ]

  return (
    <div className="nuri-workspace" data-theme={theme}>
      {toastMessage && <div className="nuri-toast">{toastMessage}</div>}
      {isDrawerOpen && <div className="nuri-overlay" onClick={toggleDrawer} />}

      {/* Drawer */}
      <div className="nuri-drawer" style={{ transform: isDrawerOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid var(--nuri-border)', marginBottom: 16 }}>
          <span className="nuri-brand">BIGDROPS</span>
          <button onClick={toggleDrawer} className="nuri-icon-btn"><X size={16} /></button>
        </div>
        <div style={{ marginBottom: 16 }}>
          <div className="nuri-section-label" style={{ marginBottom: 6, paddingLeft: 4 }}>Active Workspace</div>
          <button onClick={handleTenantSwitch} className="nuri-tenant-selector" style={{ margin: 0, width: '100%' }}>
            <Building2 size={14} /><span className="nuri-tenant-name">{activeTenant}</span><ChevronDown size={14} className="nuri-tenant-chevron" />
          </button>
        </div>
        <div className="nuri-drawer-profile">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120" alt="Profile" className="nuri-avatar" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="nuri-doc-name">Chinedu Okonkwo</div>
            <div className="nuri-doc-meta">Senior Operations Lead</div>
          </div>
        </div>
        <div className="nuri-drawer-scroll no-scrollbar">
          <div className="nuri-section-label" style={{ marginBottom: 8 }}>Core Modules</div>
          {[
            { icon: <FileText size={14} />, name: 'Invoices', active: true },
            { icon: <FileSpreadsheet size={14} />, name: 'Quotations' },
            { icon: <ClipboardCheck size={14} />, name: 'CSR' },
            { icon: <Truck size={14} />, name: 'Waybills' },
            { icon: <CreditCard size={14} />, name: 'Payments' },
            { icon: <FolderKanban size={14} />, name: 'Projects' },
            { icon: <Users size={14} />, name: 'Clients' },
          ].map(m => (
            <button key={m.name} onClick={() => handleModuleSelect(m.name)} className={`nuri-drawer-item ${m.active ? 'nuri-drawer-item--active' : ''}`}>
              {m.icon}<span>{m.name}</span>
            </button>
          ))}
          <div className="nuri-section-label" style={{ marginTop: 14, marginBottom: 8 }}>Governance</div>
          {[
            { icon: <ShieldCheck size={14} />, name: 'Compliance' },
            { icon: <ShieldAlert size={14} />, name: 'Audit Hub' },
            { icon: <Package size={14} />, name: 'Item Library' },
            { icon: <Layers size={14} />, name: 'BOQ' },
            { icon: <FileQuestion size={14} />, name: 'RFQ' },
            { icon: <Settings size={14} />, name: 'Settings' },
          ].map(m => (
            <button key={m.name} onClick={() => handleModuleSelect(m.name)} className="nuri-drawer-item">
              {m.icon}<span>{m.name}</span>
            </button>
          ))}
        </div>
        <div className="nuri-drawer-footer">
          <button onClick={() => { setIsDrawerOpen(false); showToast('Signed out') }} className="nuri-signout-btn"><LogOut size={14} /><span>Sign Out</span></button>
          <div className="nuri-version">BIGDROPS v2.4</div>
        </div>
      </div>

      {/* Main */}
      <div className="nuri-main">
        <header className="nuri-header">
          <div className="nuri-header-left">
            <button onClick={toggleDrawer} className="nuri-icon-btn" aria-label="Toggle Navigation Drawer"><Menu size={16} /></button>
            <span className="nuri-brand">BIGDROPS</span>
            <span className="nuri-live-badge"><span className="nuri-live-dot" />LIVE</span>
          </div>
          <div className="nuri-header-right">
            <button onClick={() => showToast('Search')} className="nuri-icon-btn" aria-label="Search"><Search size={15} /></button>
            <button onClick={() => showToast('8 updates')} className="nuri-icon-btn" aria-label="Notifications">
              <Bell size={15} />
              <span className="nuri-notif-dot" />
            </button>
            <button className="nuri-theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              <div className="nuri-theme-thumb">
                <Sun size={14} className="nuri-theme-icon" style={{ opacity: theme === 'light' ? 1 : 0, position: theme === 'light' ? 'relative' : 'absolute' }} />
                <Moon size={14} className="nuri-theme-icon" style={{ opacity: theme === 'dark' ? 1 : 0, position: theme === 'dark' ? 'relative' : 'absolute', transform: theme === 'dark' ? 'rotate(0deg)' : 'rotate(-90deg)' }} />
              </div>
            </button>
          </div>
        </header>

        <div className="nuri-scroll-area no-scrollbar">
          <button onClick={handleTenantSwitch} className="nuri-tenant-selector">
            <div className="nuri-tenant-avatar"><DatabaseIcon size={14} /></div>
            <span className="nuri-tenant-name">{activeTenant}</span>
            <ChevronDown size={14} className="nuri-tenant-chevron" />
          </button>

          <div className="nuri-section" style={{ marginTop: 16 }}>
            <div className="nuri-notification-carousel" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
              {notificationsList.map((n, i) => (
                <div key={i} className="nuri-notification-card" onClick={() => showToast(`Opened ${n.type} ${n.ref}`)}>
                  <div className="nuri-notif-type">{n.type}</div>
                  <div className="nuri-notif-title">{n.client}</div>
                  <div className="nuri-notif-body">{n.desc}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="nuri-notif-time">{n.time}</span>
                    <span className="nuri-kpi-value" style={{ fontSize: 14 }}>{n.amount}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="nuri-pagination">
              {notificationsList.map((_, i) => (
                <div key={i} className={`nuri-dot ${i === currentSlideIndex ? 'active' : ''}`} />
              ))}
            </div>
          </div>

          <div className="nuri-section">
            <div className="nuri-section-header">
              <h2 className="nuri-section-title">Financial Snapshot</h2>
              <span className="nuri-section-link">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</span>
            </div>
            <div className="nuri-kpi-grid">
              {kpis.map(kpi => (
                <div key={kpi.label} className="nuri-kpi-card">
                  <div className="nuri-kpi-label">{kpi.label}</div>
                  <div className="nuri-kpi-value">{kpi.value}</div>
                  <div className="nuri-kpi-sub">{kpi.sub}</div>
                  <LiveTimeline baseValue={kpi.data[kpi.data.length - 1]} volatility={kpi.vol} color={kpi.color} />
                </div>
              ))}
            </div>
          </div>

          <div className="nuri-section">
            <div className="nuri-section-header">
              <h2 className="nuri-section-title">Cash Flow Forecast</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span className="nuri-live-dot" /><span style={{ fontSize: 10, fontWeight: 700, color: 'var(--nuri-badge-live-text)', letterSpacing: '0.08em' }}>LIVE</span>
              </div>
            </div>
            <div className="nuri-cashflow-card">
              <CumulativeWave collected={collectedAmount} expected={15700000} />
              <div className="nuri-segment-bar-track">
                {cashFlowSegments.map(seg => (
                  <div key={seg.label} className="nuri-segment-fill" style={{ width: `${seg.value}%`, background: seg.color }} />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                {cashFlowSegments.map(seg => (
                  <div key={seg.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 4, background: seg.color }} />
                    <span style={{ fontSize: 11, color: 'var(--nuri-text-secondary)' }}>{seg.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--nuri-text)' }}>{seg.value}%</span>
                  </div>
                ))}
              </div>
              <div className="nuri-cashflow-stats">
                <div className="nuri-cashflow-stat">
                  <div className="nuri-cashflow-stat-label">Expected</div>
                  <div className="nuri-cashflow-stat-value">₦15.7M</div>
                </div>
                <div className="nuri-cashflow-stat">
                  <div className="nuri-cashflow-stat-label" style={{ color: 'var(--nuri-badge-positive-text)' }}>Collected</div>
                  <div className="nuri-cashflow-stat-value" style={{ color: 'var(--nuri-badge-positive-text)' }}>₦{(collectedAmount / 1000000).toFixed(2)}M</div>
                </div>
                <div className="nuri-cashflow-stat">
                  <div className="nuri-cashflow-stat-label">Rate</div>
                  <div className="nuri-cashflow-stat-value">{((collectedAmount / 15700000) * 100).toFixed(1)}%</div>
                </div>
              </div>
            </div>
          </div>

          <div className="nuri-section">
            <h2 className="nuri-section-title" style={{ marginBottom: 10 }}>Recently Created Documents</h2>
            <div className="nuri-doc-list">
              {documents.map((doc, idx) => (
                <div key={idx} className="nuri-doc-item" onClick={() => showToast(`Opening ${doc.type} ${doc.ref}`)}>
                  <div className={`nuri-doc-icon ${doc.cls}`}>
                    {doc.cls === 'invoice' ? <FileText size={15} /> : doc.cls === 'estimate' ? <FileSpreadsheet size={15} /> : doc.cls === 'receipt' ? <ClipboardCheck size={15} /> : <Truck size={15} />}
                  </div>
                  <div className="nuri-doc-info">
                    <div className="nuri-doc-name">{doc.type} {doc.ref}</div>
                    <div className="nuri-doc-meta">{doc.client} · {doc.date}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {doc.amount && <div className="nuri-doc-amount">{doc.amount}</div>}
                    <div className="nuri-kpi-sub" style={{ fontSize: 10, justifyContent: 'flex-end' }}>{doc.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="nuri-section" style={{ paddingBottom: 24 }}>
            <h2 className="nuri-section-title" style={{ marginBottom: 10 }}>Recent Activity</h2>
            <div className="nuri-card" style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { icon: <Check size={12} />, bg: 'var(--nuri-badge-positive-bg)', color: 'var(--nuri-badge-positive-text)', text: <>Payment <strong>₦540,000</strong> for Prime Energy</>, time: '12m ago' },
                { icon: <Eye size={12} />, bg: 'var(--nuri-accent-soft)', color: 'var(--nuri-accent)', text: <>Zenith Mfg viewed Invoice #INV-000043</>, time: '1h ago' },
                { icon: <Truck size={12} />, bg: 'var(--nuri-accent-soft)', color: 'var(--nuri-accent)', text: <>Waybill #WBL-E-000054 generated for Nova Logistics</>, time: '3h ago' },
                { icon: <Check size={12} />, bg: 'var(--nuri-badge-positive-bg)', color: 'var(--nuri-badge-positive-text)', text: <>Quotation #QUO-000128 approved by <strong>Apex Construction</strong></>, time: 'Yesterday 4:15 PM' },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 9999, background: item.bg, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 12, color: 'var(--nuri-text)', margin: 0, lineHeight: 1.4 }}>{item.text}</p>
                    <span style={{ fontSize: 10, color: 'var(--nuri-text-muted)' }}>{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
              <button onClick={() => handleModuleSelect('Audit Hub')} className="nuri-cta-btn">
                <ShieldAlert size={13} /><span>Open Compiled Audit Hub</span><ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>

        <button onClick={() => showToast('Create Document')} className="nuri-fab" aria-label="Create Document"><Plus size={22} strokeWidth={2.5} /></button>

        <nav className="nuri-bottom-nav">
          {[
            { icon: <LayoutDashboard size={16} />, label: 'Home', active: true },
            { icon: <FileText size={16} />, label: 'Docs' },
            { icon: <Truck size={16} />, label: 'Dispatch' },
            { icon: <Folder size={16} />, label: 'Projects' },
            { icon: <Menu size={16} />, label: 'More', onClick: toggleDrawer },
          ].map(item => (
            <button key={item.label} onClick={item.onClick || (() => showToast(item.label))} className={`nuri-nav-item ${item.active ? 'nuri-nav-item--active' : ''}`}>
              {item.icon}<span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="nuri-home-indicator"><div className="nuri-home-bar" /></div>
      </div>
    </div>
  )
}

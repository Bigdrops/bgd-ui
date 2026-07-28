import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Search, Bell, ArrowRight, Plus, X, Eye, Truck, Check,
  LayoutDashboard, FileText, Folder, Menu, FileSpreadsheet,
  ClipboardCheck, CreditCard, FolderKanban, Users,
  ShieldCheck, Package, Layers, FileQuestion, Building2,
  ChevronDown, Settings, ShieldAlert, LogOut, Clock,
  TrendingUp, AlertCircle,
} from 'lucide-react'
import './runway-dashboard.css'

const notificationsList = [
  { type: 'Invoice', ref: '#INV-000042', client: 'Zenith Manufacturing Ltd', amount: '₦2,450,000', time: '12m ago', desc: 'New invoice generated & dispatched.' },
  { type: 'Quotation', ref: '#QUO-000128', client: 'Apex Construction', amount: '₦4,120,000', time: '45m ago', desc: 'Quotation reviewed by client.' },
  { type: 'Invoice', ref: '#INV-000048', client: 'Nova Logistics', amount: '₦820,000', time: '2h ago', desc: 'Payment reminder auto-queued.' },
  { type: 'Quotation', ref: '#QUO-000130', client: 'GreenFarm Foods', amount: '₦1,150,000', time: '3h ago', desc: 'Draft quotation updated with VAT.' },
  { type: 'Invoice', ref: '#INV-000051', client: 'Sterling Supplies', amount: '₦3,100,000', time: '5h ago', desc: 'Direct debit notice acknowledged.' },
  { type: 'Invoice', ref: '#INV-000054', client: 'Prime Energy', amount: '₦540,000', time: '6h ago', desc: 'Partial payment reconciled.' },
]

const documents = [
  { type: 'Invoice', ref: '#INV-000042', client: 'Zenith Manufacturing Ltd', amount: '₦2,450,000', date: 'Aug 26, 2026', status: 'Active' },
  { type: 'Quotation', ref: '#QUO-000128', client: 'Apex Construction', amount: '₦4,120,000', date: 'Aug 25, 2026', status: 'Approved' },
  { type: 'CSR Log', ref: '#CSR-000089', client: 'GreenFarm Foods', amount: '', date: 'Aug 24, 2026', status: 'Signed' },
  { type: 'Waybill', ref: '#WBL-E-000054', client: 'Nova Logistics', amount: '14 Items', date: 'Aug 23, 2026', status: 'In Transit' },
  { type: 'Correspondence', ref: '#COR-000031', client: 'Sterling Supplies', amount: 'SLA Rev', date: 'Aug 22, 2026', status: 'Sent' },
  { type: 'RFQ', ref: '#RFQ-000019', client: 'Prime Energy', amount: '₦8,500,000', date: 'Aug 21, 2026', status: 'Tender' },
]

function TimelineChart({ data, strokeColor, fillColor, height = 40 }: { data: number[]; strokeColor: string; fillColor: string; height?: number }) {
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
    <svg className="runway-timeline-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`runway-grad-${strokeColor.replace(/[^a-z0-9]/gi, '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fillColor} stopOpacity="0.2" />
          <stop offset="100%" stopColor={fillColor} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#runway-grad-${strokeColor.replace(/[^a-z0-9]/gi, '')})`} />
      <path d={smoothPath} fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx={coords[coords.length - 1].x} cy={coords[coords.length - 1].y} r="2.5" fill={strokeColor} />
    </svg>
  )
}

function LiveTimeline({ baseValue, volatility, strokeColor, fillColor }: { baseValue: number; volatility: number; strokeColor: string; fillColor: string }) {
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
  return <TimelineChart data={points} strokeColor={strokeColor} fillColor={fillColor} />
}

function CashFlowChart({ collected, expected }: { collected: number; expected: number }) {
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
    <svg className="runway-cashflow-chart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="runway-cf-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f9a600" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#f9a600" stopOpacity="0.01" />
        </linearGradient>
      </defs>
      {[30, 60, 90].map(y => <line key={y} x1="0" y1={y} x2={width} y2={y} stroke="#e3dfd5" strokeWidth="0.5" strokeDasharray="3,3" />)}
      <path d={areaPath} fill="url(#runway-cf-fill)" />
      <path d={expPath} fill="none" stroke="#8f897e" strokeWidth="1" strokeDasharray="4,3" opacity={0.5} />
      <path d={colPath} fill="none" stroke="#f9a600" strokeWidth="2" strokeLinecap="round" />
      <circle cx={lastPt.x} cy={lastPt.y} r="4" fill="#f9a600" opacity={0.2}>
        <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx={lastPt.x} cy={lastPt.y} r="2.5" fill="#f9a600" />
    </svg>
  )
}

export default function RunwayDashboard() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [activeTenant, setActiveTenant] = useState('BIGDROPS Nigeria Ltd')
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [collectedAmount, setCollectedAmount] = useState(8920000)
  const [outstandingAmount, setOutstandingAmount] = useState(12540000)
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
    { label: 'Outstanding', value: `₦${(outstandingAmount / 1000000).toFixed(2)}M`, sub: '48 Invoices Active', data: [14.2, 13.8, 13.5, 13.1, 12.8, 12.5, 12.54], vol: 0.12 },
    { label: 'Due This Week', value: '₦3.24M', sub: '9 Action Needed', data: [2.8, 2.9, 3.0, 3.1, 3.0, 3.2, 3.24], vol: 0.06 },
    { label: 'Payments Recv.', value: `₦${(collectedAmount / 1000000).toFixed(2)}M`, sub: '+14% vs last month', data: [6.2, 6.8, 7.1, 7.6, 8.0, 8.5, 8.92], vol: 0.1 },
    { label: 'Overdue', value: '₦1.18M', sub: '6 Overdue', data: [1.5, 1.4, 1.3, 1.25, 1.2, 1.18, 1.18], vol: 0.04 },
  ]

  return (
    <div className="runway-workspace">
      {toastMessage && <div className="runway-toast">{toastMessage}</div>}
      {isDrawerOpen && <div className="runway-overlay" onClick={toggleDrawer} />}

      <div className="runway-drawer" style={{ transform: isDrawerOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
        <div className="runway-drawer-header">
          <span className="runway-brand">bigdrops</span>
          <button onClick={toggleDrawer} className="runway-icon-btn"><X size={16} /></button>
        </div>
        <div className="runway-drawer-scroll">
          <div className="runway-drawer-label">Active Workspace</div>
          <button onClick={handleTenantSwitch} className="runway-tenant-btn" style={{ margin: '0 0 16px', width: '100%' }}>
            <div className="runway-tenant-avatar"><Building2 size={14} /></div>
            <span className="runway-tenant-name">{activeTenant}</span>
            <ChevronDown size={14} style={{ color: 'var(--runway-driftwood)' }} />
          </button>
          <div className="runway-drawer-label">Core Modules</div>
          {[
            { icon: <FileText size={14} />, name: 'Invoices', active: true },
            { icon: <FileSpreadsheet size={14} />, name: 'Quotations' },
            { icon: <ClipboardCheck size={14} />, name: 'CSR' },
            { icon: <Truck size={14} />, name: 'Waybills' },
            { icon: <CreditCard size={14} />, name: 'Payments' },
            { icon: <FolderKanban size={14} />, name: 'Projects' },
            { icon: <Users size={14} />, name: 'Clients' },
          ].map(m => (
            <button key={m.name} onClick={() => handleModuleSelect(m.name)} className={`runway-drawer-item ${m.active ? 'active' : ''}`}>
              {m.icon}<span>{m.name}</span>
            </button>
          ))}
          <div className="runway-drawer-label" style={{ marginTop: 14 }}>Governance</div>
          {[
            { icon: <ShieldCheck size={14} />, name: 'Compliance' },
            { icon: <ShieldAlert size={14} />, name: 'Audit Hub' },
            { icon: <Package size={14} />, name: 'Item Library' },
            { icon: <Layers size={14} />, name: 'BOQ' },
            { icon: <FileQuestion size={14} />, name: 'RFQ' },
            { icon: <Settings size={14} />, name: 'Settings' },
          ].map(m => (
            <button key={m.name} onClick={() => handleModuleSelect(m.name)} className="runway-drawer-item">
              {m.icon}<span>{m.name}</span>
            </button>
          ))}
        </div>
        <div className="runway-drawer-footer">
          <button onClick={() => { setIsDrawerOpen(false); showToast('Signed out') }} className="runway-signout-btn"><LogOut size={14} /><span>Sign Out</span></button>
          <div className="runway-version">BIGDROPS v2.4</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <header className="runway-header">
          <div className="runway-header-left">
            <button onClick={toggleDrawer} className="runway-icon-btn" aria-label="Menu"><Menu size={15} /></button>
            <span className="runway-brand">bigdrops</span>
          </div>
          <div className="runway-header-right">
            <button onClick={() => showToast('Search')} className="runway-icon-btn" aria-label="Search"><Search size={15} /></button>
            <button onClick={() => showToast('8 updates')} className="runway-icon-btn" aria-label="Notifications">
              <Bell size={15} />
              <span className="runway-notif-dot" />
            </button>
          </div>
        </header>

        <div className="runway-scroll-area no-scrollbar">
          <button onClick={handleTenantSwitch} className="runway-tenant-btn">
            <div className="runway-tenant-avatar"><Building2 size={14} /></div>
            <span className="runway-tenant-name">{activeTenant}</span>
            <ChevronDown size={14} style={{ color: 'var(--runway-driftwood)' }} />
          </button>

          <div className="runway-section" style={{ marginTop: 16 }}>
            <div className="runway-notification-carousel" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
              {notificationsList.map((n, i) => (
                <div key={i} className="runway-notification-card" onClick={() => showToast(`Opened ${n.type} ${n.ref}`)}>
                  <span className={`runway-notif-type ${n.type.toLowerCase()}`}>{n.type}</span>
                  <div className="runway-notif-title">{n.client}</div>
                  <div className="runway-notif-body">{n.desc}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="runway-notif-time">{n.time}</span>
                    <span className="runway-notif-amount">{n.amount}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="runway-pagination">
              {notificationsList.map((_, i) => (
                <div key={i} className={`runway-dot ${i === currentSlideIndex ? 'active' : ''}`} />
              ))}
            </div>
          </div>

          <div className="runway-section">
            <div className="runway-section-header">
              <h2 className="runway-section-title">Financial Snapshot</h2>
              <span className="runway-section-link">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</span>
            </div>
            <div className="runway-kpi-grid">
              {kpis.map(kpi => (
                <div key={kpi.label} className="runway-kpi-card">
                  <div className="runway-kpi-label">{kpi.label}</div>
                  <div className="runway-kpi-value">{kpi.value}</div>
                  <div className="runway-kpi-sub">{kpi.sub}</div>
                  <div className="runway-kpi-chart">
                    <LiveTimeline baseValue={kpi.data[kpi.data.length - 1]} volatility={kpi.vol} strokeColor="#f0624f" fillColor="#f0624f" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="runway-section">
            <div className="runway-section-header">
              <h2 className="runway-section-title">Cash Flow Forecast</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span className="runway-live-dot" /><span style={{ fontSize: 10, fontWeight: 600, color: 'var(--runway-terracotta)', letterSpacing: '0.08em' }}>LIVE</span>
              </div>
            </div>
            <div className="runway-cashflow-card">
              <CashFlowChart collected={collectedAmount} expected={15700000} />
              <div className="runway-segment-bar">
                <div className="runway-segment collected" style={{ width: '45%' }} />
                <div className="runway-segment pending" style={{ width: '24%' }} />
                <div className="runway-segment overdue" style={{ width: '14%' }} />
              </div>
              <div className="runway-legend">
                {[
                  { label: 'Receivables', value: '45%', color: 'var(--runway-amber)' },
                  { label: 'Pending', value: '24%', color: 'var(--runway-wisteria)' },
                  { label: 'Overdue', value: '14%', color: 'var(--runway-terracotta)' },
                ].map(seg => (
                  <div key={seg.label} className="runway-legend-item">
                    <div className="runway-legend-dot" style={{ background: seg.color }} />
                    <span className="runway-legend-label">{seg.label}</span>
                    <span className="runway-legend-value">{seg.value}</span>
                  </div>
                ))}
              </div>
              <div className="runway-cashflow-stats">
                <div>
                  <div className="runway-cashflow-stat-label">Expected</div>
                  <div className="runway-cashflow-stat-value">₦15.7M</div>
                </div>
                <div>
                  <div className="runway-cashflow-stat-label" style={{ color: 'var(--runway-amber)' }}>Collected</div>
                  <div className="runway-cashflow-stat-value" style={{ color: 'var(--runway-amber)' }}>₦{(collectedAmount / 1000000).toFixed(2)}M</div>
                </div>
                <div>
                  <div className="runway-cashflow-stat-label">Rate</div>
                  <div className="runway-cashflow-stat-value">{((collectedAmount / 15700000) * 100).toFixed(1)}%</div>
                </div>
              </div>
            </div>
          </div>

          <div className="runway-section">
            <h2 className="runway-section-title" style={{ marginBottom: 10 }}>Recently Created Documents</h2>
            <div className="runway-doc-list">
              {documents.map((doc, idx) => (
                <div key={idx} className="runway-doc-item" onClick={() => showToast(`Opening ${doc.type} ${doc.ref}`)}>
                  <div className={`runway-doc-icon ${doc.type === 'Invoice' ? 'invoice' : doc.type === 'Quotation' ? 'quotation' : doc.type === 'CSR Log' ? 'csr' : 'waybill'}`}>
                    {doc.type === 'Invoice' ? <FileText size={14} /> : doc.type === 'Quotation' ? <FileSpreadsheet size={14} /> : doc.type === 'CSR Log' ? <ClipboardCheck size={14} /> : <Truck size={14} />}
                  </div>
                  <div className="runway-doc-info">
                    <div className="runway-doc-name">{doc.type} {doc.ref}</div>
                    <div className="runway-doc-meta">{doc.client} · {doc.date}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {doc.amount && <div className="runway-doc-amount">{doc.amount}</div>}
                    <div className="runway-doc-status">{doc.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="runway-section" style={{ paddingBottom: 24 }}>
            <h2 className="runway-section-title" style={{ marginBottom: 10 }}>Recent Activity</h2>
            <div className="runway-card" style={{ padding: '12px 14px' }}>
              {[
                { icon: <Check size={12} />, cls: 'payment', text: <>Payment <strong>₦540,000</strong> for Prime Energy</>, time: '12m ago' },
                { icon: <Eye size={12} />, cls: 'view', text: <>Zenith Mfg viewed Invoice #INV-000043</>, time: '1h ago' },
                { icon: <Truck size={12} />, cls: 'waybill', text: <>Waybill #WBL-E-000054 generated for Nova Logistics</>, time: '3h ago' },
                { icon: <Check size={12} />, cls: 'approved', text: <>Quotation #QUO-000128 approved by <strong>Apex Construction</strong></>, time: 'Yesterday 4:15 PM' },
              ].map((item, idx) => (
                <div key={idx} className="runway-activity-item">
                  <div className={`runway-activity-icon ${item.cls}`}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <p className="runway-activity-text">{item.text}</p>
                    <span className="runway-activity-time">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
              <button onClick={() => handleModuleSelect('Audit Hub')} className="runway-cta-btn">
                <ShieldAlert size={13} /><span>Open Audit Hub</span><ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>

        <button onClick={() => showToast('Create Invoice')} className="runway-fab" aria-label="Create Invoice"><Plus size={22} strokeWidth={2.5} /></button>

        <nav className="runway-bottom-nav">
          {[
            { icon: <LayoutDashboard size={16} />, label: 'Home', active: true },
            { icon: <FileText size={16} />, label: 'Docs' },
            { icon: <Truck size={16} />, label: 'Dispatch' },
            { icon: <Folder size={16} />, label: 'Projects' },
            { icon: <Menu size={16} />, label: 'More', onClick: toggleDrawer },
          ].map(item => (
            <button key={item.label} onClick={item.onClick || (() => showToast(item.label))} className={`runway-nav-item ${item.active ? 'active' : ''}`}>
              {item.icon}<span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="runway-home-indicator"><div className="runway-home-bar" /></div>
      </div>
    </div>
  )
}

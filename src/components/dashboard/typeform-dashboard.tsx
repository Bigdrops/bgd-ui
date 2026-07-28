import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Search, Bell, ArrowRight, Plus, X, Eye, Truck, Check,
  LayoutDashboard, FileText, Folder, Menu, FileSpreadsheet,
  ClipboardCheck, Mail, CreditCard, FolderKanban, Users,
  ShieldCheck, Package, Layers, FileQuestion, Building2,
  ChevronDown, Settings, ShieldAlert, LogOut, Clock,
  TrendingUp, AlertCircle, BellRing, Sun, Moon,
} from 'lucide-react'
import './typeform-dashboard.css'

const notificationsList = [
  { type: 'Invoice', ref: '#INV-000042', client: 'Zenith Manufacturing Ltd', amount: '₦2,450,000', time: '12m ago', desc: 'New invoice generated & dispatched.' },
  { type: 'Quotation', ref: '#QUO-000128', client: 'Apex Construction', amount: '₦4,120,000', time: '45m ago', desc: 'Quotation reviewed by client.' },
  { type: 'Invoice', ref: '#INV-000048', client: 'Nova Logistics', amount: '₦820,000', time: '2h ago', desc: 'Payment reminder auto-queued.' },
  { type: 'Quotation', ref: '#QUO-000130', client: 'GreenFarm Foods', amount: '₦1,150,000', time: '3h ago', desc: 'Draft quotation updated with VAT.' },
  { type: 'Invoice', ref: '#INV-000051', client: 'Sterling Supplies', amount: '₦3,100,000', time: '5h ago', desc: 'Direct debit notice acknowledged.' },
  { type: 'Invoice', ref: '#INV-000054', client: 'Prime Energy', amount: '₦540,000', time: '6h ago', desc: 'Partial payment reconciled.' },
]

function AreaChart({ data, color, height = 120 }: { data: number[]; color: string; height?: number }) {
  const width = 400
  const min = Math.min(...data) * 0.9
  const max = Math.max(...data) * 1.05
  const range = max - min || 1

  const coords = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((val - min) / range) * (height - 16) - 8
    return { x: +x.toFixed(1), y: +y.toFixed(1) }
  })

  const smoothPath = coords.reduce((acc, point, i, arr) => {
    if (i === 0) return `M ${point.x},${point.y}`
    const prev = arr[i - 1]
    const cpx1 = prev.x + (point.x - prev.x) * 0.4
    const cpx2 = prev.x + (point.x - prev.x) * 0.6
    return `${acc} C ${cpx1},${prev.y} ${cpx2},${point.y} ${point.x},${point.y}`
  }, '')

  const areaPath = `${smoothPath} L ${width},${height} L 0,${height} Z`

  return (
    <div className="td-area-chart" style={{ height }}>
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id={`td-area-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#td-area-${color.replace('#', '')})`} className="td-area-chart-fill" />
        <path d={smoothPath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="td-area-chart-path" />
        <circle cx={coords[coords.length - 1].x} cy={coords[coords.length - 1].y} r="4" fill={color} style={{ opacity: 0 }} >
          <animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="1.2s" fill="freeze" />
        </circle>
      </svg>
    </div>
  )
}

function LiveAreaChart({ baseValue, volatility, color }: { baseValue: number; volatility: number; color: string }) {
  const [points, setPoints] = useState<number[]>(() => {
    const arr: number[] = []
    let val = baseValue
    for (let i = 0; i < 24; i++) {
      val += (Math.random() - 0.48) * volatility
      arr.push(val)
    }
    return arr
  })

  const animRef = useRef<number | null>(null)
  const lastTick = useRef(performance.now())

  useEffect(() => {
    const frame = (time: number) => {
      if (time - lastTick.current > 500) {
        lastTick.current = time
        setPoints(prev => {
          const last = prev[prev.length - 1]
          return [...prev.slice(1), Math.max(0, last + (Math.random() - 0.48) * volatility)]
        })
      }
      animRef.current = requestAnimationFrame(frame)
    }
    animRef.current = requestAnimationFrame(frame)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [volatility])

  return <AreaChart data={points} color={color} height={60} />
}

function StreamChart({ collected, expected }: { collected: number; expected: number }) {
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

  useEffect(() => {
    const interval = setInterval(() => {
      setHistory(prev => {
        const last = prev[prev.length - 1]
        return [...prev.slice(1), {
          col: Math.max(0, last.col + (Math.random() - 0.45) * 120000),
          exp: Math.max(0, last.exp + (Math.random() - 0.48) * 90000),
        }]
      })
    }, 600)
    return () => clearInterval(interval)
  }, [])

  const width = 400
  const height = 140
  const maxVal = Math.max(...history.map(d => Math.max(d.col, d.exp))) * 1.1 || 1

  const buildSmoothPath = (vals: number[]) => {
    const coords = vals.map((v, i) => ({
      x: (i / (vals.length - 1)) * width,
      y: height - (v / maxVal) * (height - 20) - 10,
    }))
    return coords.reduce((acc, point, i, arr) => {
      if (i === 0) return `M ${point.x},${point.y}`
      const prev = arr[i - 1]
      const cpx1 = prev.x + (point.x - prev.x) * 0.35
      const cpx2 = prev.x + (point.x - prev.x) * 0.65
      return `${acc} C ${cpx1},${prev.y} ${cpx2},${point.y} ${point.x},${point.y}`
    }, '')
  }

  const colVals = history.map(d => d.col)
  const expVals = history.map(d => d.exp)
  const colPath = buildSmoothPath(colVals)
  const expPath = buildSmoothPath(expVals)
  const colCoords = colVals.map((v, i) => ({
    x: (i / (colVals.length - 1)) * width,
    y: height - (v / maxVal) * (height - 20) - 10,
  }))
  const lastPt = colCoords[colCoords.length - 1]
  const areaPath = `${colPath} L ${width},${height} L 0,${height} Z`

  return (
    <div className="td-stream-chart" style={{ height }}>
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="td-stream-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--td-chart-1)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--td-chart-1)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[35, 70, 105].map(y => (
          <line key={y} x1="0" y1={y} x2={width} y2={y} stroke="var(--td-border-subtle)" strokeWidth="0.5" strokeDasharray="4,4" />
        ))}
        <path d={areaPath} fill="url(#td-stream-grad)" />
        <path d={expPath} fill="none" stroke="var(--td-text-muted)" strokeWidth="1" strokeDasharray="4,3" opacity={0.5} />
        <path d={colPath} fill="none" stroke="var(--td-chart-1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={lastPt.x} cy={lastPt.y} r="5" fill="var(--td-chart-1)" opacity={0.2}>
          <animate attributeName="r" values="5;8;5" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx={lastPt.x} cy={lastPt.y} r="3" fill="var(--td-chart-1)" />
      </svg>
    </div>
  )
}

export default function TypeformDashboard() {
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

  const outstandingKpiData = [14.2, 13.8, 13.5, 13.1, 12.8, 12.5, 12.54]
  const dueKpiData = [2.8, 2.9, 3.0, 3.1, 3.0, 3.2, 3.24]
  const paymentsKpiData = [6.2, 6.8, 7.1, 7.6, 8.0, 8.5, 8.92]
  const overdueKpiData = [1.5, 1.4, 1.3, 1.25, 1.2, 1.18, 1.18]

  const cashFlowSegments = [
    { label: 'Receivables', value: 62, color: 'var(--td-chart-1)' },
    { label: 'Pending', value: 24, color: 'var(--td-chart-2)' },
    { label: 'Overdue', value: 14, color: 'var(--td-chart-4)' },
  ]

  const now = new Date()
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })

  return (
    <div className="typeform-dashboard" data-theme={theme} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {toastMessage && <div className="td-toast">{toastMessage}</div>}

      {isDrawerOpen && <div className="td-drawer-overlay" onClick={toggleDrawer} />}

      <div className="td-drawer" style={{ transform: isDrawerOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid var(--td-drawer-border)', marginBottom: 16 }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 400, color: 'var(--td-text-primary)' }}>BIGDROPS</span>
          <button onClick={toggleDrawer} style={{ padding: 6, borderRadius: 8, background: 'var(--td-surface)', border: '1px solid var(--td-border-subtle)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} color="var(--td-text-primary)" />
          </button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div className="td-section-label" style={{ marginBottom: 6, paddingLeft: 4 }}>Active Workspace</div>
          <button onClick={handleTenantSwitch} style={{ width: '100%', background: 'var(--td-surface)', border: '1px solid var(--td-border-subtle)', borderRadius: 12, padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
              <Building2 size={16} color="var(--td-text-primary)" />
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--td-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{activeTenant}</span>
            </div>
            <ChevronDown size={14} color="var(--td-text-muted)" />
          </button>
        </div>

        <div className="td-card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120" alt="Profile" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--td-border)' }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--td-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Chinedu Okonkwo</div>
            <div style={{ fontSize: 11, color: 'var(--td-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Senior Operations Lead</div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }} className="no-scrollbar">
          <div className="td-section-label" style={{ marginBottom: 8, paddingLeft: 4 }}>Core Modules</div>
          {[
            { icon: <FileText size={14} />, name: 'Invoices', active: true },
            { icon: <FileSpreadsheet size={14} />, name: 'Quotations' },
            { icon: <ClipboardCheck size={14} />, name: 'Customer Service Reports (CSR)' },
            { icon: <Truck size={14} />, name: 'Waybills (Ext & Int)' },
            { icon: <CreditCard size={14} />, name: 'Payments Ledger' },
            { icon: <FolderKanban size={14} />, name: 'Projects Engagement' },
            { icon: <Users size={14} />, name: 'Client Management' },
          ].map(mod => (
            <button key={mod.name} onClick={() => handleModuleSelect(mod.name)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, background: mod.active ? 'var(--td-accent-soft)' : 'transparent', border: 'none', cursor: 'pointer', color: mod.active ? 'var(--td-accent)' : 'var(--td-text-secondary)', fontSize: 13, fontWeight: mod.active ? 600 : 400, textAlign: 'left', marginBottom: 2 }}>
              {mod.icon}<span>{mod.name}</span>
            </button>
          ))}

          <div className="td-section-label" style={{ marginTop: 16, marginBottom: 8, paddingLeft: 4 }}>Management & Governance</div>
          {[
            { icon: <ShieldCheck size={14} />, name: 'Compliance Hub' },
            { icon: <ShieldAlert size={14} />, name: 'Audit Hub & Token Ledger' },
            { icon: <Package size={14} />, name: 'Item Library' },
            { icon: <Layers size={14} />, name: 'Bill of Quantities (BOQ)' },
            { icon: <FileQuestion size={14} />, name: 'Request for Quotation (RFQ)' },
            { icon: <Settings size={14} />, name: 'Settings' },
          ].map(mod => (
            <button key={mod.name} onClick={() => handleModuleSelect(mod.name)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--td-text-secondary)', fontSize: 13, fontWeight: 400, textAlign: 'left', marginBottom: 2 }}>
              {mod.icon}<span>{mod.name}</span>
            </button>
          ))}
        </div>

        <div style={{ paddingTop: 12, borderTop: '1px solid var(--td-drawer-border)', marginTop: 12 }}>
          <button onClick={() => { setIsDrawerOpen(false); showToast('Signed out successfully') }} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 12px', borderRadius: 12, background: 'var(--td-fab-bg)', color: 'var(--td-fab-text)', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' as const }}>
            <LogOut size={14} /><span>Sign Out</span>
          </button>
          <div style={{ textAlign: 'center', fontSize: 10, color: 'var(--td-text-muted)', marginTop: 8, letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>BIGDROPS Mode System v2.4</div>
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: 430, height: '100vh', background: 'var(--td-canvas)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '1px solid var(--td-border-subtle)', borderRight: '1px solid var(--td-border-subtle)' }}>
        {/* Header */}
        <header style={{ background: 'var(--td-surface)', padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 30, flexShrink: 0, borderBottom: '1px solid var(--td-border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={toggleDrawer} style={{ padding: 7, borderRadius: 10, background: 'var(--td-surface-alt)', border: '1px solid var(--td-border-subtle)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Toggle Navigation Drawer">
              <Menu size={16} color="var(--td-text-primary)" />
            </button>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 400, color: 'var(--td-text-primary)', letterSpacing: '-0.01em' }}>BIGDROPS</span>
            <span className="td-live-badge"><span className="td-pulsing-dot" />LIVE</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button onClick={() => showToast('Search query initialized')} style={{ padding: 7, borderRadius: 10, background: 'var(--td-surface-alt)', border: '1px solid var(--td-border-subtle)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Search">
              <Search size={15} color="var(--td-text-primary)" />
            </button>
            <button onClick={() => showToast('8 updates in system ledger')} style={{ position: 'relative', padding: 7, borderRadius: 10, background: 'var(--td-surface-alt)', border: '1px solid var(--td-border-subtle)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Notifications">
              <Bell size={15} color="var(--td-text-primary)" />
              <span style={{ position: 'absolute', top: 3, right: 3, width: 7, height: 7, background: 'var(--td-accent)', borderRadius: '50%', border: '1.5px solid var(--td-surface)' }} />
            </button>

            {/* Theme Toggle Pill */}
            <div className="td-theme-pill" data-theme={theme} onClick={toggleTheme} role="button" tabIndex={0} aria-label="Toggle theme" onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') toggleTheme() }}>
              <div className="td-theme-pill-thumb">
                <Sun size={14} color="var(--td-fab-text)" className="td-theme-pill-icon td-theme-pill-icon--sun" />
                <Moon size={14} color="var(--td-fab-text)" className="td-theme-pill-icon td-theme-pill-icon--moon" />
              </div>
              <span className="td-theme-pill-label td-theme-pill-label--light">Light</span>
              <span className="td-theme-pill-label td-theme-pill-label--dark">Dark</span>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="td-scroll-container no-scrollbar" style={{ padding: '0' }}>
          {/* Tenant Selector */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--td-border-subtle)' }}>
            <button onClick={handleTenantSwitch} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 12, background: 'var(--td-surface-alt)', border: '1px solid var(--td-border-subtle)', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: 'var(--td-text-primary)', width: '100%' }}>
              <Database size={14} />
              <span style={{ flex: 1, textAlign: 'left' }}>{activeTenant}</span>
              <ChevronDown size={14} color="var(--td-text-muted)" />
            </button>
          </div>

          {/* Notification Carousel */}
          <div style={{ padding: '12px 16px' }}>
            <div className="td-card" style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--td-accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {notificationsList[currentSlideIndex].type === 'Invoice' ? <FileText size={14} color="var(--td-accent)" /> : <FileSpreadsheet size={14} color="var(--td-accent)" />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--td-text-primary)' }}>{notificationsList[currentSlideIndex].type} {notificationsList[currentSlideIndex].ref}</div>
                <div style={{ fontSize: 12, color: 'var(--td-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{notificationsList[currentSlideIndex].desc}</div>
              </div>
              <span style={{ fontSize: 11, color: 'var(--td-text-muted)', flexShrink: 0 }}>{notificationsList[currentSlideIndex].time}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 8 }}>
              {notificationsList.map((_, i) => (
                <div key={i} style={{ width: i === currentSlideIndex ? 16 : 4, height: 4, borderRadius: 80, background: i === currentSlideIndex ? 'var(--td-accent)' : 'var(--td-border)', transition: 'all 0.3s' }} />
              ))}
            </div>
          </div>

          {/* Financial Snapshot */}
          <section style={{ padding: '8px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h2 className="td-section-label">Financial Snapshot</h2>
              <span style={{ fontSize: 11, color: 'var(--td-text-muted)', fontFamily: 'monospace' }}>{timeStr}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { label: 'Outstanding', value: `₦${(outstandingAmount / 1000000).toFixed(2)}M`, sub: '48 Invoices Active', data: outstandingKpiData, color: 'var(--td-chart-1)', icon: <Clock size={14} />, iconBg: 'var(--td-accent-soft)', iconColor: 'var(--td-accent)' },
                { label: 'Due This Week', value: '₦3.24M', sub: '9 Action Needed', data: dueKpiData, color: 'var(--td-negative)', icon: <AlertCircle size={14} />, iconBg: 'var(--td-negative-soft)', iconColor: 'var(--td-negative)' },
                { label: 'Payments Recv.', value: `₦${(collectedAmount / 1000000).toFixed(2)}M`, sub: '+14% vs last month', data: paymentsKpiData, color: 'var(--td-positive)', icon: <TrendingUp size={14} />, iconBg: 'var(--td-positive-soft)', iconColor: 'var(--td-positive)' },
                { label: 'Overdue', value: '₦1.18M', sub: '6 Overdue', data: overdueKpiData, color: 'var(--td-text-muted)', icon: <ShieldAlert size={14} />, iconBg: 'var(--td-accent-soft)', iconColor: 'var(--td-accent)' },
              ].map(kpi => (
                <div key={kpi.label} className="td-card" style={{ padding: '14px 14px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span className="td-section-label" style={{ fontSize: 10 }}>{kpi.label}</span>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: kpi.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: kpi.iconColor }}>
                      {kpi.icon}
                    </div>
                  </div>
                  <div className="td-kpi-value" style={{ fontSize: 22, color: 'var(--td-text-primary)', lineHeight: 1.1, margin: '4px 0 8px' }}>{kpi.value}</div>
                  <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--td-text-muted)', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 6 }}>{kpi.sub}</span>
                  <LiveAreaChart baseValue={kpi.data[kpi.data.length - 1]} volatility={kpi.label.includes('Outstanding') ? 0.12 : kpi.label.includes('Due') ? 0.06 : kpi.label.includes('Payments') ? 0.1 : 0.04} color={kpi.color} />
                </div>
              ))}
            </div>
          </section>

          {/* Cash Flow Forecast */}
          <section style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <h2 className="td-section-label">Cash Flow Forecast</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span className="td-pulsing-dot" />
                <span style={{ fontSize: 9, color: 'var(--td-positive)', fontFamily: 'monospace', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>LIVE</span>
              </div>
            </div>
            <div className="td-card" style={{ padding: 16 }}>
              <StreamChart collected={collectedAmount} expected={15700000} />
              <div style={{ marginTop: 12, display: 'flex', gap: 2, height: 8, borderRadius: 80, overflow: 'hidden' }}>
                {cashFlowSegments.map(seg => (
                  <div key={seg.label} style={{ width: `${seg.value}%`, background: seg.color, borderRadius: 80, transition: 'width 0.5s ease' }} />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, gap: 8 }}>
                {cashFlowSegments.map(seg => (
                  <div key={seg.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 3, background: seg.color }} />
                    <span style={{ fontSize: 11, color: 'var(--td-text-muted)' }}>{seg.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--td-text-primary)' }}>{seg.value}%</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--td-border-subtle)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 9, color: 'var(--td-text-muted)', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Expected</div>
                  <div className="td-kpi-value" style={{ fontSize: 15, color: 'var(--td-text-primary)' }}>₦15.7M</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 9, color: 'var(--td-positive)', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Collected</div>
                  <div className="td-kpi-value" style={{ fontSize: 15, color: 'var(--td-positive)' }}>₦{(collectedAmount / 1000000).toFixed(2)}M</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 9, color: 'var(--td-text-muted)', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Rate</div>
                  <div className="td-kpi-value" style={{ fontSize: 15, color: 'var(--td-text-primary)' }}>{((collectedAmount / 15700000) * 100).toFixed(1)}%</div>
                </div>
              </div>
            </div>
          </section>

          {/* Recently Created Documents */}
          <section style={{ padding: '0 16px 16px' }}>
            <h2 className="td-section-label" style={{ marginBottom: 10, paddingLeft: 0 }}>Recently Created Documents</h2>
            <div className="td-card" style={{ overflow: 'hidden' }}>
              {[
                { type: 'Invoice', ref: '#INV-000042', client: 'Zenith Manufacturing Ltd', amount: '₦2,450,000', date: 'Aug 26, 2026', status: 'Active', statusType: 'primary' as const, icon: <FileText size={16} />, iconBg: 'var(--td-accent)', iconFg: '#fff' },
                { type: 'Quotation', ref: '#QUO-000128', client: 'Apex Construction', amount: '₦4,120,000', date: 'Aug 25, 2026', status: 'Approved', statusType: 'secondary' as const, icon: <FileSpreadsheet size={16} />, iconBg: 'var(--td-surface-alt)', iconFg: 'var(--td-text-primary)' },
                { type: 'CSR Log', ref: '#CSR-000089', client: 'GreenFarm Foods', amount: '', date: 'Aug 24, 2026', status: 'Signed', statusType: 'secondary' as const, icon: <ClipboardCheck size={16} />, iconBg: 'var(--td-surface-alt)', iconFg: 'var(--td-text-primary)' },
                { type: 'Waybill (Ext)', ref: '#WBL-E-000054', client: 'Nova Logistics', amount: '14 Items', date: 'Aug 23, 2026', status: 'In Transit', statusType: 'primary' as const, icon: <Truck size={16} />, iconBg: 'var(--td-accent)', iconFg: '#fff' },
                { type: 'Correspondence', ref: '#COR-000031', client: 'Sterling Supplies', amount: 'SLA Rev', date: 'Aug 22, 2026', status: 'Sent', statusType: 'secondary' as const, icon: <Mail size={16} />, iconBg: 'var(--td-surface-alt)', iconFg: 'var(--td-text-primary)' },
                { type: 'RFQ', ref: '#RFQ-000019', client: 'Prime Energy', amount: '₦8,500,000', date: 'Aug 21, 2026', status: 'Tender', statusType: 'primary' as const, icon: <FileQuestion size={16} />, iconBg: 'var(--td-accent)', iconFg: '#fff' },
              ].map((doc, idx, arr) => (
                <div key={idx} onClick={() => showToast(`Opening ${doc.type} ${doc.ref}`)} style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderBottom: idx < arr.length - 1 ? '1px solid var(--td-border-subtle)' : 'none', transition: 'background 0.15s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: doc.iconBg, color: doc.iconFg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {doc.icon}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--td-text-primary)' }}>{doc.type}</span>
                        <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--td-text-muted)' }}>{doc.ref}</span>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--td-text-muted)' }}>{doc.client}</div>
                      <div style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--td-text-muted)' }}>{doc.date}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {doc.amount && <div className="td-kpi-value" style={{ fontSize: 15, color: 'var(--td-text-primary)' }}>{doc.amount}</div>}
                    <span className={`td-badge td-badge--${doc.statusType}`}>{doc.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Activity */}
          <section style={{ padding: '0 16px 16px' }}>
            <h2 className="td-section-label" style={{ marginBottom: 10, paddingLeft: 0 }}>Recent Activity</h2>
            <div className="td-card" style={{ padding: '12px 14px' }}>
              {[
                { icon: <Check size={12} />, iconBg: 'var(--td-positive-soft)', iconColor: 'var(--td-positive)', text: <>Payment <strong>₦540,000</strong> for Prime Energy</>, time: '12m ago' },
                { icon: <Eye size={12} />, iconBg: 'var(--td-accent-soft)', iconColor: 'var(--td-accent)', text: <>Zenith Mfg viewed Invoice <span style={{ fontFamily: 'monospace', fontSize: 10 }}>#INV-000043</span></>, time: '1h ago' },
                { icon: <Truck size={12} />, iconBg: 'var(--td-accent-soft)', iconColor: 'var(--td-accent)', text: <>Waybill <span style={{ fontFamily: 'monospace', fontSize: 10 }}>#WBL-E-000054</span> generated for Nova Logistics</>, time: '3h ago' },
                { icon: <Check size={12} />, iconBg: 'var(--td-positive-soft)', iconColor: 'var(--td-positive)', text: <>Quotation <span style={{ fontFamily: 'monospace', fontSize: 10 }}>#QUO-000128</span> approved by <strong>Apex Construction</strong></>, time: 'Yesterday 4:15 PM' },
              ].map((item, idx, arr) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, paddingBottom: idx < arr.length - 1 ? 10 : 0, marginBottom: idx < arr.length - 1 ? 10 : 0, borderBottom: idx < arr.length - 1 ? '1px solid var(--td-border-subtle)' : 'none' }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, background: item.iconBg, color: item.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    {item.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 12, color: 'var(--td-text-primary)', margin: 0, lineHeight: 1.4 }}>{item.text}</p>
                    <span style={{ fontSize: 10, color: 'var(--td-text-muted)' }}>{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
              <button onClick={() => handleModuleSelect('Audit Hub')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 12, background: 'var(--td-fab-bg)', color: 'var(--td-fab-text)', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' as const }}>
                <ShieldAlert size={13} /><span>Open Compiled Audit Hub</span><ArrowRight size={12} />
              </button>
            </div>
          </section>
        </div>

        {/* FAB */}
        <button onClick={() => showToast('Select Document Type to Create')} className="td-fab" aria-label="Create Document">
          <Plus size={22} strokeWidth={2.5} />
        </button>

        {/* Bottom Nav */}
        <nav className="td-bottom-nav">
          {[
            { icon: <LayoutDashboard size={16} />, label: 'Home', active: true },
            { icon: <FileText size={16} />, label: 'Docs' },
            { icon: <Truck size={16} />, label: 'Dispatch' },
            { icon: <Folder size={16} />, label: 'Projects' },
            { icon: <Menu size={16} />, label: 'More', onClick: toggleDrawer },
          ].map(item => (
            <button key={item.label} onClick={item.onClick || (() => showToast(`Switched to ${item.label}`))} className={`td-bottom-nav-item ${item.active ? 'td-bottom-nav-item--active' : ''}`}>
              {item.icon}<span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Home Indicator */}
        <div className="td-home-indicator">
          <div className="td-home-indicator-bar" />
        </div>
      </div>
    </div>
  )
}

function Database({ size, color }: { size: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  )
}

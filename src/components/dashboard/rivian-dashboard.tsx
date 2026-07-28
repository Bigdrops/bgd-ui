import { useState, useEffect, useRef } from 'react'
import {
  Activity, TrendingUp, TrendingDown, Clock, AlertTriangle,
  FileText, FileSpreadsheet, ClipboardCheck, Truck, Mail,
  FileQuestion, Plus, Search, Bell, ChevronDown, Eye, Check,
  BarChart3, Zap, Database, ExternalLink, MoreHorizontal,
} from 'lucide-react'
import './rivian.css'

function LiveSparkline({ baseValue, volatility, color }: { baseValue: number; volatility: number; color: string }) {
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
  const lastTick = useRef(performance.now())

  useEffect(() => {
    const frame = (time: number) => {
      if (time - lastTick.current > 450) {
        lastTick.current = time
        setPoints(prev => {
          const last = prev[prev.length - 1]
          return [...prev.slice(1), Math.max(0, last + (Math.random() - 0.48) * volatility)]
        })
      }
      animRef.current = requestAnimationFrame(frame)
    }
    const animRef = { current: requestAnimationFrame(frame) }
    return () => cancelAnimationFrame(animRef.current)
  }, [volatility])

  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1
  const w = 160
  const h = 36

  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w
    const y = h - ((p - min) / range) * (h - 8) - 4
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })

  const linePath = `M ${coords.join(' L ')}`
  const areaPath = `M 0,${h} L ${coords.join(' L ')} L ${w},${h} Z`
  const last = coords[coords.length - 1].split(',')

  return (
    <div style={{ width: '100%', height: h, position: 'relative' }}>
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <path d={areaPath} fill={color} opacity={0.08} />
        <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={parseFloat(last[0])} cy={parseFloat(last[1])} r="3" fill={color} />
      </svg>
    </div>
  )
}

const notificationsList = [
  { type: 'Invoice', ref: '#INV-000042', client: 'Zenith Manufacturing Ltd', amount: '₦2,450,000', time: '12m ago', desc: 'New invoice generated & dispatched.' },
  { type: 'Quotation', ref: '#QUO-000128', client: 'Apex Construction', amount: '₦4,120,000', time: '45m ago', desc: 'Quotation reviewed by client.' },
  { type: 'Invoice', ref: '#INV-000048', client: 'Nova Logistics', amount: '₦820,000', time: '2h ago', desc: 'Payment reminder auto-queued.' },
  { type: 'Quotation', ref: '#QUO-000130', client: 'GreenFarm Foods', amount: '₦1,150,000', time: '3h ago', desc: 'Draft quotation updated with VAT.' },
  { type: 'Invoice', ref: '#INV-000051', client: 'Sterling Supplies', amount: '₦3,100,000', time: '5h ago', desc: 'Direct debit notice acknowledged.' },
  { type: 'Invoice', ref: '#INV-000054', client: 'Prime Energy', amount: '₦540,000', time: '6h ago', desc: 'Partial payment reconciled.' },
]

export default function RivianDashboard() {
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

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 2200)
  }

  const toggleDrawer = () => setIsDrawerOpen(prev => !prev)

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

  const kpis = [
    { label: 'Monthly Recurring Revenue', value: '₦12.4M', change: '+18.2%', changeType: 'up' as const, sparkData: [8.2, 8.9, 9.1, 9.8, 10.2, 10.9, 11.4, 11.8, 12.1, 12.4], color: '#151515' },
    { label: 'Burn Rate', value: '₦3.2M', change: '-5.1%', changeType: 'down' as const, sparkData: [4.1, 3.9, 3.8, 3.7, 3.5, 3.4, 3.3, 3.3, 3.2, 3.2], color: '#151515' },
    { label: 'Cash Runway', value: '14.2 mo', change: '+2.1 mo', changeType: 'up' as const, sparkData: [10, 10.5, 11, 11.5, 12, 12.5, 13, 13.2, 13.8, 14.2], color: '#151515' },
    { label: 'Active Customers', value: '2,847', change: '+312', changeType: 'up' as const, sparkData: [2100, 2200, 2300, 2400, 2500, 2600, 2700, 2750, 2800, 2847], color: '#151515' },
  ]

  const cashFlowData = [
    { label: 'Receivables', value: 62, color: '#151515' },
    { label: 'Pending', value: 24, color: '#616161' },
    { label: 'Overdue', value: 14, color: '#b8b8b8' },
  ]

  const documents = [
    { name: 'Q4 Financial Report.pdf', type: 'pdf', size: '2.4 MB', status: 'Approved', statusColor: '#151515' },
    { name: 'Client Proposal - Zenith.docx', type: 'doc', size: '1.1 MB', status: 'In Transit', statusColor: '#616161' },
    { name: 'Tax Certificate 2026.pdf', type: 'pdf', size: '890 KB', status: 'Active', statusColor: '#151515' },
    { name: 'Invoice Batch #0042.xlsx', type: 'xls', size: '3.2 MB', status: 'Signed', statusColor: '#151515' },
    { name: 'Vendor Agreement.pdf', type: 'pdf', size: '1.8 MB', status: 'Sent', statusColor: '#616161' },
    { name: 'Compliance Audit.pdf', type: 'pdf', size: '4.1 MB', status: 'Tender', statusColor: '#b8b8b8' },
  ]

  const fileIcon = (type: string) => {
    if (type === 'pdf') return <FileText size={14} strokeWidth={1.5} />
    if (type === 'xls') return <FileSpreadsheet size={14} strokeWidth={1.5} />
    return <FileText size={14} strokeWidth={1.5} />
  }

  const now = new Date()
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })

  return (
    <div className="rivian-workspace" style={{ minHeight: '100vh', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, fontFamily: "'Inter', sans-serif" }}>
      {/* Toast */}
      {toastMessage && (
        <div style={{ position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 200, background: '#151515', color: '#ffffff', padding: '12px 24px', borderRadius: 40, fontSize: 14, fontWeight: 500, boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}>
          {toastMessage}
        </div>
      )}

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div onClick={toggleDrawer} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 40 }} />
      )}

      {/* Navigation Drawer */}
      <div style={{ position: 'fixed', top: 0, left: isDrawerOpen ? 0 : '-300px', width: 280, height: '100vh', background: '#151515', zIndex: 50, transition: 'left 0.3s ease', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ fontSize: 20, fontWeight: 600, color: '#ffffff', marginBottom: 24, letterSpacing: '-0.01em' }}>BIGDROPS</div>
        {['Dashboard', 'Invoices', 'Quotations', 'Clients', 'Reports', 'Settings'].map((mod) => (
          <button key={mod} onClick={() => { setIsDrawerOpen(false); showToast(`Opened ${mod}`) }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 16px', borderRadius: 40, background: 'transparent', border: 'none', color: '#b8b8b8', fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s' }} onMouseEnter={e => { e.currentTarget.style.background = '#f2f2f2'; e.currentTarget.style.color = '#151515' }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#b8b8b8' }}>
          {mod}
        </button>
        ))}
      </div>

      {/* Main Card */}
      <div className="rivian-card" style={{ width: '100%', maxWidth: 430, height: '100vh', background: '#ffffff', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid #e5e7eb' }}>
        {/* Header */}
        <header style={{ background: '#ffffff', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 30, flexShrink: 0, borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={toggleDrawer} style={{ padding: 8, borderRadius: 12, background: '#f2f2f2', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Toggle Navigation Drawer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="2" rx="1" fill="#151515" /><rect x="3" y="11" width="18" height="2" rx="1" fill="#151515" /><rect x="3" y="16" width="18" height="2" rx="1" fill="#151515" /></svg>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 600, color: '#151515', letterSpacing: '-0.02em' }}>BIGDROPS</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#f2f2f2', padding: '2px 8px', borderRadius: 40, fontSize: 10, color: '#616161', fontWeight: 600 }}>
                <span style={{ width: 5, height: 5, background: '#151515', borderRadius: '50%', boxShadow: '0 0 0 0 rgba(21,21,21,0.7)', animation: 'rivian-pulse 1.5s infinite' }} />
                LIVE
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => showToast('Search query initialized')} style={{ padding: 8, borderRadius: 12, background: '#f2f2f2', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Search">
              <Search size={16} color="#151515" />
            </button>
            <button onClick={() => showToast('8 updates in system ledger')} style={{ position: 'relative', padding: 8, borderRadius: 12, background: '#f2f2f2', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Notifications">
              <Bell size={16} color="#151515" />
              <span style={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, background: '#ffac00', borderRadius: '50%', border: '1.5px solid #ffffff' }} />
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '0 0 80px 0' }} className="no-scrollbar">
          {/* Tenant Selector */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
            <button onClick={() => { setActiveTenant(prev => prev === 'BIGDROPS Nigeria Ltd' ? 'BIGDROPS Ghana Hub' : 'BIGDROPS Nigeria Ltd'); showToast('Workspace switched') }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 40, background: '#f2f2f2', border: '1px solid #e5e7eb', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#151515', width: '100%' }}>
              <Database size={14} strokeWidth={1.5} />
              <span style={{ flex: 1, textAlign: 'left' }}>{activeTenant}</span>
              <ChevronDown size={14} color="#616161" />
            </button>
          </div>

          {/* Notification Carousel */}
          <div style={{ padding: '12px 16px' }}>
            <div style={{ background: '#f2f2f2', borderRadius: 20, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, border: '1px solid #e5e7eb' }} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {notificationsList[currentSlideIndex].type === 'Invoice' ? <FileText size={14} color="#151515" /> : <FileSpreadsheet size={14} color="#151515" />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#151515' }}>{notificationsList[currentSlideIndex].type} {notificationsList[currentSlideIndex].ref}</div>
                <div style={{ fontSize: 12, color: '#616161', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{notificationsList[currentSlideIndex].desc}</div>
              </div>
              <span style={{ fontSize: 11, color: '#b8b8b8', flexShrink: 0 }}>{notificationsList[currentSlideIndex].time}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 8 }}>
              {notificationsList.map((_, i) => (
                <div key={i} style={{ width: i === currentSlideIndex ? 16 : 4, height: 4, borderRadius: 2, background: i === currentSlideIndex ? '#151515' : '#e5e7eb', transition: 'all 0.3s' }} />
              ))}
            </div>
          </div>

          {/* Financial Snapshot */}
          <section style={{ padding: '8px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h2 style={{ fontSize: 11, fontWeight: 600, color: '#616161', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Financial Snapshot</h2>
              <span style={{ fontSize: 11, color: '#b8b8b8' }}>{timeStr}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {kpis.map((kpi) => (
                <div key={kpi.label} style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 20, padding: '14px 14px 10px' }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: '#616161', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 4 }}>{kpi.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 600, color: '#151515', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{kpi.value}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, marginBottom: 8 }}>
                    {kpi.changeType === 'up' ? <TrendingUp size={12} color="#151515" /> : <TrendingDown size={12} color="#616161" />}
                    <span style={{ fontSize: 11, fontWeight: 500, color: kpi.changeType === 'up' ? '#151515' : '#616161' }}>{kpi.change}</span>
                  </div>
                  <LiveSparkline baseValue={kpi.sparkData[kpi.sparkData.length - 1]} volatility={kpi.label.includes('Revenue') ? 80000 : kpi.label.includes('Burn') ? 30000 : kpi.label.includes('Runway') ? 0.1 : 20} color={kpi.color} />
                </div>
              ))}
            </div>
          </section>

          {/* Cash Flow Forecast */}
          <section style={{ padding: '16px' }}>
            <h2 style={{ fontSize: 11, fontWeight: 600, color: '#616161', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 12 }}>Cash Flow Forecast</h2>
            <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 20, padding: 16 }}>
              <div style={{ display: 'flex', gap: 2, height: 10, borderRadius: 40, overflow: 'hidden', marginBottom: 12 }}>
                {cashFlowData.map((seg) => (
                  <div key={seg.label} style={{ width: `${seg.value}%`, background: seg.color, borderRadius: 40, transition: 'width 0.5s ease' }} />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                {cashFlowData.map((seg) => (
                  <div key={seg.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: seg.color }} />
                    <span style={{ fontSize: 12, color: '#616161' }}>{seg.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#151515' }}>{seg.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Telemetry Stream */}
          <section style={{ padding: '0 16px 16px' }}>
            <h2 style={{ fontSize: 11, fontWeight: 600, color: '#616161', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 12 }}>Telemetry Stream</h2>
            <div style={{ background: '#151515', borderRadius: 20, padding: 16, position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <Zap size={14} color="#ffac00" />
                <span style={{ fontSize: 12, fontWeight: 500, color: '#b8b8b8' }}>Live Event Feed</span>
                <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#ffac00', animation: 'rivian-pulse 1.5s infinite' }} />
              </div>
              <TelemetryStream />
            </div>
          </section>

          {/* Activity Feed */}
          <section style={{ padding: '0 16px 16px' }}>
            <h2 style={{ fontSize: 11, fontWeight: 600, color: '#616161', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 12 }}>Activity Feed</h2>
            <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 20, padding: '4px 0' }}>
              {notificationsList.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: idx < notificationsList.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f2f2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {item.type === 'Invoice' ? <FileText size={14} color="#151515" /> : <FileSpreadsheet size={14} color="#151515" />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#151515' }}>{item.type} {item.ref}</div>
                    <div style={{ fontSize: 12, color: '#616161' }}>{item.client} — {item.amount}</div>
                  </div>
                  <span style={{ fontSize: 11, color: '#b8b8b8', flexShrink: 0 }}>{item.time}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Document Management */}
          <section style={{ padding: '0 16px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h2 style={{ fontSize: 11, fontWeight: 600, color: '#616161', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Documents</h2>
              <button onClick={() => showToast('Upload new document')} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 40, background: '#151515', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#ffffff' }}>
                <Plus size={12} /> Upload
              </button>
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 20, padding: '4px 0' }}>
              {documents.map((doc, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: idx < documents.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f2f2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#151515' }}>
                    {fileIcon(doc.type)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#151515', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</div>
                    <div style={{ fontSize: 12, color: '#616161' }}>{doc.size}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 500, color: doc.statusColor, padding: '2px 8px', borderRadius: 40, background: doc.statusColor === '#151515' ? '#f2f2f2' : '#f2f2f2' }}>{doc.status}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* FAB */}
        <button onClick={() => showToast('New document created')} className="rivian-fab" style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 50, width: 56, height: 56, borderRadius: 40, background: '#ffac00', color: '#151515', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 24px rgba(255,172,0,0.3)', transition: 'transform 0.15s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
          <Plus size={24} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}

function TelemetryStream() {
  const [events, setEvents] = useState(() => {
    const initial = [
      { id: 1, type: 'invoice', msg: 'Invoice #INV-000042 dispatched to Zenith Manufacturing', time: '12m ago', color: '#ffac00' },
      { id: 2, type: 'payment', msg: 'Payment ₦2,450,000 received from Apex Construction', time: '28m ago', color: '#ffffff' },
      { id: 3, type: 'quotation', msg: 'Quotation #QUO-000128 approved by Nova Logistics', time: '45m ago', color: '#ffac00' },
      { id: 4, type: 'system', msg: 'Automated reconciliation completed for batch #0038', time: '1h ago', color: '#b8b8b8' },
    ]
    return initial
  })

  useEffect(() => {
    const msgs = [
      { type: 'invoice', msg: 'Invoice #INV-000055 generated for Sterling Supplies', color: '#ffac00' },
      { type: 'payment', msg: 'Partial payment ₦540,000 reconciled from Prime Energy', color: '#ffffff' },
      { type: 'quotation', msg: 'Quotation #QUO-000131 sent to GreenFarm Foods', color: '#ffac00' },
      { type: 'system', msg: 'Tax certificate auto-renewal triggered', color: '#b8b8b8' },
      { type: 'invoice', msg: 'Invoice #INV-000056 pending approval', color: '#ffac00' },
    ]
    let counter = 5
    const interval = setInterval(() => {
      const next = msgs[counter % msgs.length]
      setEvents(prev => [{ id: counter, ...next, time: 'just now' }, ...prev.slice(0, 5)])
      counter++
    }, 3200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 160, overflow: 'hidden' }}>
      {events.map((evt) => (
        <div key={evt.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 12, background: 'rgba(242,242,242,0.06)', animation: 'rivian-slide-in 0.3s ease' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: evt.color, flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: '#e5e7eb', flex: 1 }}>{evt.msg}</span>
          <span style={{ fontSize: 10, color: '#616161', flexShrink: 0 }}>{evt.time}</span>
        </div>
      ))}
    </div>
  )
}

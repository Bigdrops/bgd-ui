import { useState, useEffect, useRef } from 'react'
import {
  Shield, Bell, Search, TrendingUp, Clock, AlertTriangle,
  Plus, FileText, FileSpreadsheet, Truck, Mail,
  ClipboardCheck, Eye, Check, ArrowRight, Zap,
  ShieldCheck, Folder, Layers, ChevronDown,
} from 'lucide-react'
import './dashlane.css'
import './index.css'

interface SparklineProps {
  baseValue: number
  volatility: number
  color: string
}

function Sparkline({ baseValue, volatility, color }: SparklineProps) {
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

  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1
  const w = 160
  const h = 32

  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w
    const y = h - ((p - min) / range) * (h - 6) - 3
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })

  const line = `M ${coords.join(' L ')}`
  const area = `M 0,${h} L ${coords.join(' L ')} L ${w},${h} Z`
  const last = coords[coords.length - 1].split(',')
  const lx = parseFloat(last[0])
  const ly = parseFloat(last[1])

  return (
    <div className="dash-sparkline-container">
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id={`sg-${baseValue}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#sg-${baseValue})`} />
        <path d={line} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={lx} cy={ly} r="2.5" fill={color} />
      </svg>
    </div>
  )
}

const NOTIFICATIONS = [
  { type: 'Invoice', ref: '#INV-000042', client: 'Zenith Manufacturing Ltd', amount: '₦2,450,000', time: '12m ago', desc: 'New invoice generated & dispatched.' },
  { type: 'Quotation', ref: '#QUO-000128', client: 'Apex Construction', amount: '₦4,120,000', time: '45m ago', desc: 'Quotation reviewed by client.' },
  { type: 'Invoice', ref: '#INV-000048', client: 'Nova Logistics', amount: '₦820,000', time: '2h ago', desc: 'Payment reminder auto-queued.' },
  { type: 'Quotation', ref: '#QUO-000130', client: 'GreenFarm Foods', amount: '₦1,150,000', time: '3h ago', desc: 'Draft quotation updated with VAT.' },
  { type: 'Invoice', ref: '#INV-000051', client: 'Sterling Supplies', amount: '₦3,100,000', time: '5h ago', desc: 'Direct debit notice acknowledged.' },
  { type: 'Invoice', ref: '#INV-000054', client: 'Prime Energy', amount: '₦540,000', time: '6h ago', desc: 'Partial payment reconciled.' },
]

const TELEMETRY_EVENTS = [
  { type: 'payment', icon: Check, color: 'var(--mint)', bg: 'var(--mint-10)', label: 'Payment received', detail: '₦540,000 — Prime Energy' },
  { type: 'view', icon: Eye, color: 'var(--iris)', bg: 'var(--iris-20)', label: 'Document viewed', detail: 'Zenith Mfg opened #INV-000043' },
  { type: 'shipment', icon: Truck, color: 'var(--cream-60)', bg: 'var(--cream-10)', label: 'Shipment dispatched', detail: '#WBL-E-000054 — Nova Logistics' },
  { type: 'approval', icon: ShieldCheck, color: 'var(--mint)', bg: 'var(--mint-10)', label: 'Quotation approved', detail: '#QUO-000128 — Apex Construction' },
  { type: 'alert', icon: AlertTriangle, color: '#f0a060', bg: 'rgba(240,160,96,0.12)', label: 'Payment overdue', detail: '#INV-000038 — 3 days past due' },
  { type: 'creation', icon: FileText, color: 'var(--iris)', bg: 'var(--iris-20)', label: 'Invoice created', detail: '#INV-000061 — Sterling Supplies' },
]

const ACTIVITIES = [
  { icon: Check, iconBg: 'var(--mint-10)', iconColor: 'var(--mint)', text: <>Payment <strong>₦540,000</strong> received from <strong>Prime Energy</strong></>, time: '12m ago' },
  { icon: Eye, iconBg: 'var(--cream-10)', iconColor: 'var(--cream-60)', text: <><strong>Zenith Mfg</strong> viewed Invoice <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10 }}>#INV-000043</span></>, time: '1h ago' },
  { icon: Truck, iconBg: 'var(--cream-10)', iconColor: 'var(--cream-60)', text: <>Waybill <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10 }}>#WBL-E-000054</span> generated for <strong>Nova Logistics</strong></>, time: '3h ago' },
  { icon: Check, iconBg: 'var(--mint-10)', iconColor: 'var(--mint)', text: <>Quotation <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10 }}>#QUO-000128</span> approved by <strong>Apex Construction</strong></>, time: 'Yesterday' },
]

const DOCUMENTS = [
  { icon: FileText, label: 'Invoice', ref: '#INV-000042', client: 'Zenith Manufacturing Ltd', date: 'Aug 26, 2026', amount: '₦2,450,000', status: 'Active', statusColor: 'var(--mint)' },
  { icon: FileSpreadsheet, label: 'Quotation', ref: '#QUO-000128', client: 'Apex Construction', date: 'Aug 25, 2026', amount: '₦4,120,000', status: 'Approved', statusColor: 'var(--cream-60)' },
  { icon: ClipboardCheck, label: 'CSR Log', ref: '#CSR-000089', client: 'GreenFarm Foods', date: 'Aug 24, 2026', amount: null, status: 'Signed', statusColor: 'var(--cream-60)' },
  { icon: Truck, label: 'Waybill', ref: '#WBL-E-000054', client: 'Nova Logistics', date: 'Aug 23, 2026', amount: null, status: 'In Transit', statusColor: 'var(--mint)' },
  { icon: Mail, label: 'Correspondence', ref: '#COR-000031', client: 'Sterling Supplies', date: 'Aug 22, 2026', amount: null, status: 'Sent', statusColor: 'var(--cream-60)' },
]

function DashlaneHeader({ onSearch }: { onSearch: () => void }) {
  return (
    <header style={{ background: 'var(--plum)', borderBottom: '1px solid var(--sand)', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Shield size={20} color="var(--mint)" strokeWidth={1.5} />
        <span style={{ fontSize: 16, fontWeight: 300, letterSpacing: '-0.01em' }}>BIGDROPS</span>
        <span className="dash-live-badge">
          <span className="dash-pulsing-dot" />
          LIVE
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button className="dash-icon-btn" onClick={onSearch} aria-label="Search">
          <Search size={16} strokeWidth={1.5} />
        </button>
        <button className="dash-icon-btn" aria-label="Notifications" style={{ position: 'relative' }}>
          <Bell size={16} strokeWidth={1.5} />
          <span style={{ position: 'absolute', top: 4, right: 4, width: 6, height: 6, background: 'var(--mint)', borderRadius: '50%' }} />
        </button>
        <span className="dash-overline" style={{ color: 'var(--cream-30)' }}>
          {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
        </span>
      </div>
    </header>
  )
}

function FinancialSnapshot({ collected, outstanding }: { collected: number; outstanding: number }) {
  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span className="dash-section-title" style={{ margin: 0 }}>Financial Snapshot</span>
        <span className="dash-live-badge" style={{ fontSize: 9, padding: '2px 8px' }}>
          <span className="dash-pulsing-dot" style={{ width: 4, height: 4 }} />
          REAL-TIME STREAM
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div className="dash-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span className="dash-overline">Outstanding</span>
            <div style={{ width: 28, height: 28, background: 'var(--aubergine)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={14} color="var(--cream-60)" strokeWidth={1.5} />
            </div>
          </div>
          <div className="dash-kpi-value" style={{ marginBottom: 4 }}>₦{(outstanding / 1000000).toFixed(2)}M</div>
          <span className="dash-overline" style={{ fontSize: 9, color: 'var(--cream-30)', marginBottom: 8, display: 'block' }}>48 Invoices Active</span>
          <Sparkline baseValue={12.5} volatility={0.12} color="var(--mint)" />
        </div>

        <div className="dash-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span className="dash-overline">Due This Week</span>
            <div style={{ width: 28, height: 28, background: 'var(--aubergine)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={14} color="#f0a060" strokeWidth={1.5} />
            </div>
          </div>
          <div className="dash-kpi-value" style={{ marginBottom: 4 }}>₦3.24M</div>
          <span style={{ fontSize: 9, color: 'var(--canvas)', background: '#f0a060', padding: '2px 6px', borderRadius: 4, fontFamily: 'DM Mono, monospace', letterSpacing: '0.06em', textTransform: 'uppercase' as const, fontWeight: 500, display: 'inline-block' }}>9 Action Needed</span>
          <div style={{ marginTop: 8 }}>
            <Sparkline baseValue={3.2} volatility={0.06} color="#f0a060" />
          </div>
        </div>

        <div className="dash-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span className="dash-overline">Payments Recv.</span>
            <div style={{ width: 28, height: 28, background: 'var(--mint-10)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={14} color="var(--mint)" strokeWidth={1.5} />
            </div>
          </div>
          <div className="dash-kpi-value" style={{ marginBottom: 4 }}>₦{(collected / 1000000).toFixed(2)}M</div>
          <span className="dash-overline" style={{ fontSize: 9, color: 'var(--cream-30)', marginBottom: 8, display: 'block' }}>+14% vs last month</span>
          <Sparkline baseValue={8.9} volatility={0.1} color="var(--mint)" />
        </div>

        <div className="dash-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span className="dash-overline">MRR</span>
            <div style={{ width: 28, height: 28, background: 'var(--mint-10)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={14} color="var(--mint)" strokeWidth={1.5} />
            </div>
          </div>
          <div className="dash-kpi-value" style={{ marginBottom: 4 }}>₦4.82M</div>
          <span className="dash-overline" style={{ fontSize: 9, color: 'var(--cream-30)', marginBottom: 8, display: 'block' }}>Recurring Revenue</span>
          <Sparkline baseValue={4.8} volatility={0.08} color="var(--iris)" />
        </div>
      </div>
    </section>
  )
}

function CashFlowForecast({ collected, expected }: { collected: number; expected: number }) {
  const collectedPct = (collected / expected) * 100
  const outstandingPct = 100 - collectedPct
  const overduePct = Math.min(outstandingPct * 0.35, 30)
  const pendingPct = outstandingPct - overduePct

  return (
    <section className="dash-card-accent">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <span style={{ fontWeight: 300, fontSize: 16 }}>Cash Flow Forecast</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 6, height: 6, background: 'var(--mint)', borderRadius: '50%', display: 'inline-block', animation: 'dash-pulse 1.6s infinite' }} />
          <span className="dash-overline" style={{ color: 'var(--mint)', fontSize: 9 }}>TELEMETRY STREAM</span>
        </div>
      </div>

      <div className="dash-stacked-bar" style={{ marginBottom: 14 }}>
        <div className="dash-stacked-segment" style={{ flex: collectedPct, background: 'var(--mint)', borderRadius: 4 }} />
        <div className="dash-stacked-segment" style={{ flex: pendingPct, background: 'var(--iris)', borderRadius: 4 }} />
        <div className="dash-stacked-segment" style={{ flex: overduePct, background: '#f0a060', borderRadius: 4 }} />
      </div>

      <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, background: 'var(--mint)', borderRadius: 2, display: 'inline-block' }} />
          <span className="dash-overline" style={{ fontSize: 9 }}>Collected</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, background: 'var(--iris)', borderRadius: 2, display: 'inline-block' }} />
          <span className="dash-overline" style={{ fontSize: 9 }}>Pending</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, background: '#f0a060', borderRadius: 2, display: 'inline-block' }} />
          <span className="dash-overline" style={{ fontSize: 9 }}>Overdue</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        <div style={{ background: 'var(--cream-10)', borderRadius: 4, padding: '8px 10px', textAlign: 'center' }}>
          <div className="dash-overline" style={{ fontSize: 9, marginBottom: 2 }}>Expected</div>
          <div className="dash-kpi-value-sm">₦{(expected / 1000000).toFixed(1)}M</div>
        </div>
        <div style={{ background: 'var(--mint-10)', borderRadius: 4, padding: '8px 10px', textAlign: 'center' }}>
          <div className="dash-overline" style={{ fontSize: 9, marginBottom: 2, color: 'var(--mint)' }}>Collected</div>
          <div className="dash-kpi-value-sm" style={{ color: 'var(--mint)' }}>₦{(collected / 1000000).toFixed(2)}M</div>
        </div>
        <div style={{ background: 'var(--cream-10)', borderRadius: 4, padding: '8px 10px', textAlign: 'center' }}>
          <div className="dash-overline" style={{ fontSize: 9, marginBottom: 2 }}>Rate</div>
          <div className="dash-kpi-value-sm">{collectedPct.toFixed(1)}%</div>
        </div>
      </div>
    </section>
  )
}

function TelemetryStream() {
  const [events, setEvents] = useState(() => TELEMETRY_EVENTS.slice(0, 4))

  useEffect(() => {
    const interval = setInterval(() => {
      setEvents(prev => {
        const next = { ...TELEMETRY_EVENTS[Math.floor(Math.random() * TELEMETRY_EVENTS.length)] }
        return [next, ...prev].slice(0, 5)
      })
    }, 3200)
    return () => clearInterval(interval)
  }, [])

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span className="dash-section-title" style={{ margin: 0 }}>Telemetry Stream</span>
        <span className="dash-overline" style={{ fontSize: 9 }}>{events.length} events</span>
      </div>
      <div className="dash-card dash-telemetry-stream">
        {events.map((ev, i) => (
          <div key={`${ev.type}-${i}-${ev.detail}`} className="dash-telemetry-event" style={{ background: ev.bg }}>
            <ev.icon size={13} color={ev.color} strokeWidth={1.5} style={{ flexShrink: 0 }} />
            <span style={{ color: ev.color, fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: '0.04em', flexShrink: 0, textTransform: 'uppercase' as const }}>{ev.label}</span>
            <span style={{ color: 'var(--cream-60)', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{ev.detail}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function ActivityFeed() {
  return (
    <section>
      <span className="dash-section-title">Recent Activity</span>
      <div className="dash-card">
        {ACTIVITIES.map((act, i) => (
          <div key={i} className="dash-activity-item">
            <div style={{ width: 24, height: 24, background: act.iconBg, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
              <act.icon size={12} color={act.iconColor} strokeWidth={2} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, color: 'var(--cream)', margin: 0, lineHeight: 1.4 }}>{act.text}</p>
              <span className="dash-overline" style={{ fontSize: 9 }}>{act.time}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function DocumentManagement({ onSelect }: { onSelect: (label: string) => void }) {
  return (
    <section>
      <span className="dash-section-title">Document Management</span>
      <div className="dash-card" style={{ padding: '4px 16px' }}>
        {DOCUMENTS.map((doc, i) => (
          <div key={i} className="dash-doc-row" onClick={() => onSelect(doc.ref)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
              <div style={{ width: 36, height: 36, background: i % 2 === 0 ? 'var(--mint-10)' : 'var(--aubergine)', border: i % 2 !== 0 ? '1px solid var(--sand)' : 'none', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <doc.icon size={16} color={i % 2 === 0 ? 'var(--mint)' : 'var(--cream-60)'} strokeWidth={1.5} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: 11, color: 'var(--cream)', fontWeight: 500 }}>{doc.label}</span>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--cream-30)' }}>{doc.ref}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--cream-60)' }}>{doc.client}</div>
                <span className="dash-overline" style={{ fontSize: 9 }}>{doc.date}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 8 }}>
              {doc.amount && <div className="dash-kpi-value-sm" style={{ fontSize: 14, marginBottom: 3 }}>{doc.amount}</div>}
              <span style={{ fontSize: 9, fontFamily: 'DM Mono, monospace', letterSpacing: '0.06em', textTransform: 'uppercase' as const, padding: '2px 8px', borderRadius: 4, background: doc.statusColor === 'var(--mint)' ? 'var(--mint-10)' : 'var(--cream-10)', color: doc.statusColor, fontWeight: 500, display: 'inline-block' }}>{doc.status}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function DashlaneDashboard() {
  const [collected, setCollected] = useState(8920000)
  const [outstanding, setOutstanding] = useState(12540000)
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [fabOpen, setFabOpen] = useState(false)

  const EXPECTED = 15700000

  useEffect(() => {
    const interval = setInterval(() => {
      setCollected(prev => prev + Math.floor(Math.random() * 45000))
      setOutstanding(prev => Math.max(0, prev - Math.floor(Math.random() * 25000)))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 2200)
  }

  return (
    <div className="dashlane-workspace">
      <DashlaneHeader onSearch={() => showToast('Search initialized')} />

      <main style={{ padding: '20px 16px', paddingBottom: 120, display: 'flex', flexDirection: 'column', gap: 24, overflowY: 'auto' }}>
        <FinancialSnapshot collected={collected} outstanding={outstanding} />
        <CashFlowForecast collected={collected} expected={EXPECTED} />
        <TelemetryStream />
        <ActivityFeed />
        <DocumentManagement onSelect={(ref) => showToast(`Opening ${ref}`)} />
      </main>

      <button
        className="dash-fab"
        onClick={() => setFabOpen(prev => !prev)}
        aria-label="Create Document"
      >
        <Plus size={24} strokeWidth={2} style={{ transform: fabOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {fabOpen && (
        <div style={{ position: 'fixed', bottom: 96, right: 24, zIndex: 9998, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
          {[
            { icon: FileText, label: 'Invoice', color: 'var(--mint)' },
            { icon: FileSpreadsheet, label: 'Quotation', color: 'var(--iris)' },
            { icon: ClipboardCheck, label: 'CSR Log', color: 'var(--cream-60)' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => { setFabOpen(false); showToast(`Create ${item.label}`) }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--plum)', border: '1px solid var(--sand)', borderRadius: 9999, padding: '8px 16px', cursor: 'pointer', color: item.color, fontFamily: 'DM Mono, monospace', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' as const, transition: 'background 0.12s' }}
            >
              <item.icon size={14} strokeWidth={1.5} />
              {item.label}
            </button>
          ))}
        </div>
      )}

      {fabOpen && (
        <div
          onClick={() => setFabOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9997 }}
        />
      )}

      {toastMsg && <div className="dash-toast">{toastMsg}</div>}
    </div>
  )
}

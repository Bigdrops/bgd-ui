import { useState, useEffect, useRef, type TouchEvent } from 'react'
import {
  Search, Bell, ArrowRight, Plus, X, Eye, Truck, Check,
  LayoutDashboard, FileText, Folder, Menu, FileSpreadsheet,
  ClipboardCheck, Mail, CreditCard, FolderKanban, Users,
  ShieldCheck, Package, Layers, FileQuestion, Building2,
  ChevronDown, Settings, ShieldAlert, LogOut, Clock,
  TrendingUp, AlertCircle, BellRing,
} from 'lucide-react'
import './paradigm.css'

const PANEL_CLOSED = "M10 5.5 C10 4.793 10 4.439 9.780 4.220 C9.560 4 9.207 4 8.5 4 H8.5 C6.379 4 5.318 4 4.659 4.659 C4 5.318 4 6.379 4 8.5 V15.5 C4 17.621 4 18.682 4.659 19.341 C5.318 20 6.379 20 8.5 20 H8.5 C9.207 20 9.561 20 9.780 19.780 C10 19.561 10 19.207 10 18.5 V5.5 Z"
const PANEL_OPEN = "M14 6 C14 5.057 14 4.586 13.707 4.293 C13.414 4 12.943 4 12 4 H10 C7.172 4 5.757 4 4.879 4.879 C4 5.757 4 7.172 4 10 V14 C4 16.828 4 18.243 4.879 19.121 C5.757 20 7.172 20 10 20 H12 C12.943 20 13.414 20 13.707 19.707 C14 19.414 14 18.943 14 18 V6 Z"

interface LiveSparklineProps {
  baseValue: number
  volatility: number
  color: string
}

function LiveSparkline({ baseValue, volatility, color }: LiveSparklineProps) {
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
      if (time - lastUpdateRef.current > 450) {
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
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [volatility])

  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1
  const width = 160
  const height = 36

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
    <div className="relative w-full h-[36px] overflow-hidden">
      <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id={`pd-spark-${baseValue}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#pd-spark-${baseValue})`} />
        <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={latestX} cy={latestY} r="2.5" fill={color} />
      </svg>
    </div>
  )
}

interface LiveTelemetryGraphProps {
  expectedTotal: number
  collectedTotal: number
}

function LiveTelemetryGraph({ expectedTotal, collectedTotal }: LiveTelemetryGraphProps) {
  const [dataStream, setDataStream] = useState<{ exp: number; col: number }[]>(() => {
    const initial: { exp: number; col: number }[] = []
    for (let i = 0; i < 40; i++) {
      initial.push({
        exp: expectedTotal * (0.8 + Math.sin(i * 0.1) * 0.15),
        col: collectedTotal * (0.75 + Math.cos(i * 0.12) * 0.18),
      })
    }
    return initial
  })

  const animRef = useRef<number | null>(null)
  const lastTickRef = useRef<number>(performance.now())

  useEffect(() => {
    const updateGraph = (time: number) => {
      if (time - lastTickRef.current > 350) {
        lastTickRef.current = time
        setDataStream((prev) => {
          const lastExp = prev[prev.length - 1].exp
          const lastCol = prev[prev.length - 1].col
          const nextExp = Math.max(0, lastExp + (Math.random() - 0.45) * 120000)
          const nextCol = Math.max(0, lastCol + (Math.random() - 0.48) * 90000)
          return [...prev.slice(1), { exp: nextExp, col: nextCol }]
        })
      }
      animRef.current = requestAnimationFrame(updateGraph)
    }
    animRef.current = requestAnimationFrame(updateGraph)
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [])

  const maxVal = Math.max(...dataStream.map(d => Math.max(d.exp, d.col))) * 1.1 || 1
  const width = 350
  const height = 110

  const expCoords = dataStream.map((d, i) => {
    const x = (i / (dataStream.length - 1)) * width
    const y = height - (d.exp / maxVal) * (height - 15) - 8
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })

  const colCoords = dataStream.map((d, i) => {
    const x = (i / (dataStream.length - 1)) * width
    const y = height - (d.col / maxVal) * (height - 15) - 8
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })

  const expLine = `M ${expCoords.join(' L ')}`
  const colLine = `M ${colCoords.join(' L ')}`
  const colArea = `M 0,${height} L ${colCoords.join(' L ')} L ${width},${height} Z`

  const latestCol = colCoords[colCoords.length - 1].split(',')
  const headX = parseFloat(latestCol[0])
  const headY = parseFloat(latestCol[1])

  return (
    <div className="h-32 w-full relative flex items-center justify-center overflow-hidden">
      <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="pd-telemetry-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7f90ce" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#7f90ce" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <line x1="0" y1="25" x2="350" y2="25" stroke="rgba(219,219,238,0.3)" strokeWidth="0.5" strokeDasharray="2,4" />
        <line x1="0" y1="60" x2="350" y2="60" stroke="rgba(219,219,238,0.3)" strokeWidth="0.5" strokeDasharray="2,4" />
        <line x1="0" y1="95" x2="350" y2="95" stroke="rgba(219,219,238,0.3)" strokeWidth="0.5" strokeDasharray="2,4" />
        <path d={colArea} fill="url(#pd-telemetry-grad)" />
        <path d={expLine} fill="none" stroke="rgba(127,144,206,0.4)" strokeWidth="1" strokeDasharray="3,3" />
        <path d={colLine} fill="none" stroke="#7f90ce" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={headX} cy={headY} r="3" fill="#7f90ce" />
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

export default function ParadigmDashboard() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [activeTenant, setActiveTenant] = useState('BIGDROPS Nigeria Ltd')
  const [collectedAmount, setCollectedAmount] = useState(8920000)
  const [outstandingAmount, setOutstandingAmount] = useState(12540000)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const touchStartXRef = useRef(0)
  const touchEndXRef = useRef(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const inc1 = Math.floor(Math.random() * 45000)
      const inc2 = Math.floor(Math.random() * 25000)
      setCollectedAmount((prev) => prev + inc1)
      setOutstandingAmount((prev) => Math.max(0, prev - inc2))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % notificationsList.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 2200)
  }

  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev)

  const handleModuleSelect = (moduleName: string) => {
    setIsDrawerOpen(false)
    showToast(`Opened ${moduleName}`)
  }

  const handleTenantSwitch = () => {
    const nextTenant = activeTenant === 'BIGDROPS Nigeria Ltd' ? 'BIGDROPS Ghana Hub' : 'BIGDROPS Nigeria Ltd'
    setActiveTenant(nextTenant)
    showToast(`Switched workspace to ${nextTenant}`)
  }

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.targetTouches[0].clientX
  }

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    touchEndXRef.current = event.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return
    const distance = touchStartXRef.current - touchEndXRef.current
    const minSwipeDistance = 40

    if (distance > minSwipeDistance) {
      setCurrentSlideIndex((prev) => (prev + 1) % notificationsList.length)
    } else if (distance < -minSwipeDistance) {
      setCurrentSlideIndex((prev) => (prev - 1 + notificationsList.length) % notificationsList.length)
    }

    touchStartXRef.current = 0
    touchEndXRef.current = 0
  }

  return (
    <div className="pd-workspace min-h-screen bg-[#f6f7f8] flex items-center justify-center p-0 sm:p-4 md:p-6 antialiased">
      <div className="w-full max-w-[430px] h-[100vh] sm:h-[900px] bg-[#ffffff] relative overflow-hidden sm:rounded-[4px] border-0 sm:border-[1px] border-[#dbdbee] flex flex-col justify-between">
        <header className="pd-hero-header px-4 py-3.5 flex items-center justify-between z-30 shrink-0">
          <div className="flex items-center space-x-2.5">
            <button onClick={toggleDrawer} className="pd-btn-icon-dark p-2 flex items-center justify-center" aria-label="Toggle Navigation Drawer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-[#ffffff]">
                <path d="M11 3H13C16.7712 3 18.6569 3 19.8284 4.17157C21 5.34315 21 7.22876 21 11V13C21 16.7712 21 18.6569 19.8284 19.8284C18.6569 21 16.7712 21 13 21H11C7.2288 21 5.3431 21 4.1716 19.8284C3 18.6569 3 16.7712 3 13V11C3 7.22876 3 5.34315 4.1716 4.17157C5.3431 3 7.2288 3 11 3Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d={isDrawerOpen ? PANEL_OPEN : PANEL_CLOSED} fill="#080b12" style={{ transition: "d 0.35s ease" }} />
              </svg>
            </button>
            <span className="pd-brand">BIGDROPS</span>
          </div>

          <div className="flex items-center space-x-2">
            <button onClick={() => showToast('Search query initialized')} className="pd-btn-icon-dark p-2 flex items-center justify-center" aria-label="Search">
              <Search className="w-4 h-4 text-[#ffffff]" />
            </button>
            <button onClick={() => showToast('8 updates in system ledger')} className="relative p-2 flex items-center justify-center pd-btn-icon-dark" aria-label="Notifications">
              <Bell className="w-4 h-4 text-[#ffffff]" />
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#0a33ff]" />
            </button>
            <div className="pd-avatar" onClick={toggleDrawer}>
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120" alt="Profile" className="w-full h-full rounded-[2px] object-cover" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto no-scrollbar pb-20">
          <section className="pd-hero-section px-4 py-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="pd-eyebrow-dark">FINANCIAL SNAPSHOT</span>
              <div className="pd-live-badge-dark">
                <span className="pd-pulse-dot-dark" />
                <span>REAL-TIME</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Outstanding', value: `₦${(outstandingAmount / 1000000).toFixed(2)}M`, sub: '48 ACTIVE', icon: Clock, sparkColor: '#7f90ce', sparkBase: 12.5, sparkVol: 0.12 },
                { label: 'Due This Week', value: '₦3.24M', sub: '9 ACTION', icon: AlertCircle, sparkColor: '#7f90ce', sparkBase: 3.2, sparkVol: 0.06, action: true },
                { label: 'Payments Recv.', value: `₦${(collectedAmount / 1000000).toFixed(2)}M`, sub: '+14% VS LAST', icon: TrendingUp, sparkColor: '#0a33ff', sparkBase: 8.9, sparkVol: 0.1, accent: true },
                { label: 'Overdue', value: '₦1.18M', sub: '6 OVERDUE', icon: ShieldAlert, sparkColor: '#580101', sparkBase: 1.1, sparkVol: 0.04, danger: true },
              ].map((card, i) => (
                <div key={i} className="pd-card p-3 flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <span className="pd-label">{card.label}</span>
                    <div className={`pd-icon-box ${card.accent ? 'pd-icon-box--accent' : card.danger ? 'pd-icon-box--danger' : ''}`}>
                      <card.icon className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="my-1.5">
                    <div className="pd-stat-value">{card.value}</div>
                    <span className={`pd-badge ${card.action ? 'pd-badge--action' : card.danger ? 'pd-badge--danger' : ''}`}>{card.sub}</span>
                  </div>
                  <LiveSparkline baseValue={card.sparkBase} volatility={card.sparkVol} color={card.sparkColor} />
                </div>
              ))}
            </div>
          </section>

          <div className="px-4 py-3 space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="pd-eyebrow">NOTIFICATIONS</span>
              <span className="pd-mono text-[10px] text-[#6c6d73]">{notificationsList.length} items</span>
            </div>

            <div className="pd-card p-3 relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
              onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
              <div className="flex items-start justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                  <span className="pd-badge">{notificationsList[currentSlideIndex].type}</span>
                  <span className="pd-mono text-[10px] text-[#6c6d73]">{notificationsList[currentSlideIndex].ref}</span>
                </div>
                <span className="pd-mono text-[10px] text-[#6c6d73]">{notificationsList[currentSlideIndex].time}</span>
              </div>

              <div className="py-1">
                <h3 className="text-[13px] font-medium text-[#080b12]">{notificationsList[currentSlideIndex].client}</h3>
                <p className="text-[11px] text-[#6c6d73] mt-0.5">{notificationsList[currentSlideIndex].desc}</p>
              </div>

              <div className="mt-2 pt-2 border-t border-[#dbdbee] flex items-center justify-between">
                <span className="pd-stat-sm">{notificationsList[currentSlideIndex].amount}</span>
                <button onClick={() => showToast(`Opened ${notificationsList[currentSlideIndex].type} ${notificationsList[currentSlideIndex].ref}`)} className="pd-btn-accent text-[10px] px-2.5 py-1">
                  <span>VIEW</span><ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="flex justify-center space-x-1 mt-2">
                {notificationsList.map((_, idx) => (
                  <button key={idx} onClick={() => setCurrentSlideIndex(idx)}
                    className={`h-1 rounded-full transition-all duration-300 ${idx === currentSlideIndex ? 'w-4 bg-[#080b12]' : 'w-1 bg-[#dbdbee]'}`}
                    aria-label={`Slide ${idx + 1}`} />
                ))}
              </div>
            </div>
          </div>

          <div className="px-4 py-3 space-y-2">
            <span className="pd-eyebrow">DOCUMENTS</span>

            <div className="pd-card divide-y divide-[#dbdbee] overflow-hidden">
              {[
                { icon: FileText, type: 'Invoice', ref: '#INV-000042', client: 'Zenith Manufacturing Ltd', amount: '₦2,450,000', date: 'Aug 26, 2026', status: 'Active', badgeClass: 'pd-badge--forest' },
                { icon: FileSpreadsheet, type: 'Quotation', ref: '#QUO-000128', client: 'Apex Construction', amount: '₦4,120,000', date: 'Aug 25, 2026', status: 'Approved', badgeClass: '' },
                { icon: ClipboardCheck, type: 'CSR Log', ref: '#CSR-000089', client: 'GreenFarm Foods', amount: 'Service Log', date: 'Aug 24, 2026', status: 'Signed', badgeClass: '' },
                { icon: Truck, type: 'Waybill (Ext)', ref: '#WBL-E-000054', client: 'Nova Logistics', amount: '14 Items', date: 'Aug 23, 2026', status: 'In Transit', badgeClass: 'pd-badge--forest' },
                { icon: Mail, type: 'Correspondence', ref: '#COR-000031', client: 'Sterling Supplies', amount: 'SLA Rev', date: 'Aug 22, 2026', status: 'Sent', badgeClass: '' },
                { icon: FileQuestion, type: 'RFQ', ref: '#RFQ-000019', client: 'Prime Energy', amount: '₦8,500,000', date: 'Aug 21, 2026', status: 'Tender', badgeClass: 'pd-badge--mulberry' },
              ].map((doc, i) => (
                <div key={i} className="p-3 flex items-center justify-between pd-row-hover" onClick={() => showToast(`Opening ${doc.type} ${doc.ref}`)}>
                  <div className="flex items-center space-x-2.5">
                    <div className={`pd-icon-box ${i % 2 === 0 ? 'pd-icon-box--accent' : ''}`}>
                      <doc.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="pd-label">{doc.type}</span>
                        <span className="pd-mono text-[10px] text-[#6c6d73]">{doc.ref}</span>
                      </div>
                      <p className="text-[11px] text-[#6c6d73]">{doc.client}</p>
                      <span className="pd-mono text-[9px] text-[#6c6d73]">{doc.date}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="pd-stat-sm">{doc.amount}</div>
                    <span className={`pd-status-badge ${doc.badgeClass}`}>{doc.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-4 py-3 space-y-2">
            <div className="pd-gilded-panel p-3 space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="pd-serif-lg">Cash Flow Forecast</span>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7f90ce] animate-pulse" />
                  <span className="pd-mono text-[9px] text-[#7f90ce] tracking-[0.06em] uppercase">TELEMETRY</span>
                </div>
              </div>

              <LiveTelemetryGraph expectedTotal={15700000} collectedTotal={collectedAmount} />

              <div className="pt-2 border-t border-[#dbdbee] grid grid-cols-3 text-center gap-1">
                <div className="bg-[#f6f7f8] p-1.5 rounded-[4px]">
                  <div className="pd-mono text-[8px] text-[#6c6d73] tracking-[0.06em]">EXPECTED</div>
                  <div className="pd-stat-sm text-[#080b12]">₦15.7M</div>
                </div>
                <div className="bg-[#f6f7f8] p-1.5 rounded-[4px]">
                  <div className="pd-mono text-[8px] text-[#0a33ff] tracking-[0.06em]">COLLECTED</div>
                  <div className="pd-stat-sm text-[#0a33ff]">₦{(collectedAmount / 1000000).toFixed(2)}M</div>
                </div>
                <div className="bg-[#f6f7f8] p-1.5 rounded-[4px]">
                  <div className="pd-mono text-[8px] text-[#6c6d73] tracking-[0.06em]">RATE</div>
                  <div className="pd-stat-sm text-[#080b12]">{((collectedAmount / 15700000) * 100).toFixed(1)}%</div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-3 space-y-2 pt-1">
            <span className="pd-eyebrow">ACTIVITY</span>

            <div className="pd-card p-3 space-y-2.5">
              {[
                { icon: Check, accent: true, text: <><span className="font-medium">₦540,000</span> payment for <span>Prime Energy</span></>, time: '12m ago' },
                { icon: Eye, accent: false, text: <><span>Zenith Mfg</span> viewed Invoice <span className="pd-mono text-[10px]">#INV-000043</span></>, time: '1h ago' },
                { icon: Truck, accent: false, text: <>Waybill <span className="pd-mono text-[10px]">#WBL-E-000054</span> generated for <span>Nova Logistics</span></>, time: '3h ago' },
                { icon: Check, accent: true, text: <>Quotation <span className="pd-mono text-[10px]">#QUO-000128</span> approved by <span className="font-medium">Apex Construction</span></>, time: 'Yesterday 4:15 PM' },
              ].map((item, i) => (
                <div key={i} className={`flex items-start space-x-2.5 ${i < 3 ? 'pb-2 border-b border-[#dbdbee]' : ''}`}>
                  <div className={`pd-icon-box ${item.accent ? 'pd-icon-box--accent' : ''} mt-0.5`}>
                    <item.icon className="w-3 h-3" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] text-[#080b12]">{item.text}</p>
                    <span className="pd-mono text-[9px] text-[#6c6d73]">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-1 text-center">
              <button onClick={() => handleModuleSelect('Audit Hub')} className="pd-btn-accent text-[10px] px-3 py-1.5 inline-flex items-center space-x-1.5">
                <ShieldAlert className="w-3 h-3" /><span>OPEN AUDIT HUB</span><ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </main>

        <div className="absolute bottom-16 right-4 z-30">
          <button onClick={() => showToast('Select Document Type to Create')} className="pd-fab" aria-label="Create Document">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={toggleDrawer} />

        <div className={`pd-drawer ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-[#dbdbee]">
              <h3 className="pd-brand">BIGDROPS</h3>
              <button onClick={toggleDrawer} className="pd-btn-icon p-1.5"><X className="w-3.5 h-3.5" /></button>
            </div>

            <div className="space-y-1">
              <span className="pd-mono text-[9px] text-[#6c6d73] tracking-[0.14em] px-1 uppercase">Active Workspace</span>
              <button onClick={handleTenantSwitch} className="pd-drawer-btn w-full">
                <div className="flex items-center space-x-2 overflow-hidden">
                  <Building2 className="w-3.5 h-3.5 text-[#0a33ff] shrink-0" />
                  <span className="text-[11px] font-medium text-[#080b12] truncate">{activeTenant}</span>
                </div>
                <ChevronDown className="w-3 h-3 text-[#6c6d73] shrink-0 ml-1" />
              </button>
            </div>

            <div className="pd-card p-2.5 flex items-center space-x-2" style={{ boxShadow: 'rgb(255,255,255) 0 0 24px inset' }}>
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120" alt="Chinedu Okonkwo" className="w-8 h-8 rounded-[2px] object-cover" style={{ border: '1px solid #dbdbee' }} />
              <div className="flex-1 min-w-0">
                <h4 className="text-[11px] font-medium text-[#080b12] truncate">Chinedu Okonkwo</h4>
                <p className="text-[9px] text-[#6c6d73] truncate">Senior Operations Lead</p>
              </div>
            </div>

            <div className="space-y-0.5 overflow-y-auto max-h-[360px] no-scrollbar pr-1">
              <div className="pd-mono text-[9px] text-[#6c6d73] tracking-[0.14em] mb-1 px-1 uppercase">Core</div>
              {[
                { icon: FileText, label: 'Invoices', active: true },
                { icon: FileSpreadsheet, label: 'Quotations' },
                { icon: ClipboardCheck, label: 'CSR' },
                { icon: Truck, label: 'Waybills' },
                { icon: CreditCard, label: 'Payments' },
                { icon: FolderKanban, label: 'Projects' },
                { icon: Users, label: 'Clients' },
              ].map((item, i) => (
                <button key={i} onClick={() => handleModuleSelect(item.label)}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-[4px] text-[11px] ${item.active ? 'bg-[#080b12] text-[#ffffff]' : 'text-[#4f535e] hover:bg-[#f6f7f8]'}`}>
                  <item.icon className="w-3 h-3" /><span>{item.label}</span>
                </button>
              ))}

              <div className="pd-mono text-[9px] text-[#6c6d73] tracking-[0.14em] mt-2 mb-1 px-1 uppercase">Governance</div>
              {[
                { icon: ShieldCheck, label: 'Compliance' },
                { icon: ShieldAlert, label: 'Audit Hub' },
                { icon: Package, label: 'Item Library' },
                { icon: Layers, label: 'BOQ' },
                { icon: FileQuestion, label: 'RFQ' },
                { icon: Settings, label: 'Settings' },
              ].map((item, i) => (
                <button key={i} onClick={() => handleModuleSelect(item.label)}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[4px] text-[11px] text-[#4f535e] hover:bg-[#f6f7f8]">
                  <item.icon className="w-3 h-3" /><span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[#dbdbee] space-y-2">
            <button onClick={() => { setIsDrawerOpen(false); showToast('Signed out successfully') }}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-[4px] bg-[#080b12] text-[#ffffff] text-[11px] font-medium tracking-[0.06em] uppercase transition-transform active:scale-95">
              <LogOut className="w-3 h-3" /><span>Sign Out</span>
            </button>
            <div className="text-center text-[9px] text-[#6c6d73] tracking-[0.14em] uppercase">
              <span>Paradigm System v2.4</span>
            </div>
          </div>
        </div>

        <nav className="pd-nav">
          <button className="pd-nav-item pd-nav-item--active"><LayoutDashboard className="w-4 h-4" /><span>Home</span></button>
          <button onClick={() => showToast('Switched to Documents')} className="pd-nav-item"><FileText className="w-4 h-4" /><span>Docs</span></button>
          <button onClick={() => showToast('Switched to Logistics')} className="pd-nav-item"><Truck className="w-4 h-4" /><span>Dispatch</span></button>
          <button onClick={() => showToast('Switched to Projects')} className="pd-nav-item"><Folder className="w-4 h-4" /><span>Projects</span></button>
          <button onClick={toggleDrawer} className="pd-nav-item"><Menu className="w-4 h-4" /><span>More</span></button>
        </nav>

        <div className="w-full pb-1.5 flex justify-center z-30 bg-[#ffffff]">
          <div className="w-28 h-1 bg-[#dbdbee] rounded-full" />
        </div>

        {toastMessage && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#080b12] text-[#ffffff] text-[10px] font-medium px-4 py-2 rounded-[4px] shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200 whitespace-nowrap">
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  )
}

import { useState, useEffect, useRef, type TouchEvent } from 'react'
import {
  Search, Bell, ArrowRight, Plus, X, Eye, Truck, Check,
  LayoutDashboard, FileText, Folder, Menu, FileSpreadsheet,
  ClipboardCheck, Mail, CreditCard, FolderKanban, Users,
  ShieldCheck, Package, Layers, FileQuestion, Building2,
  ChevronDown, Settings, ShieldAlert, LogOut, Clock,
  TrendingUp, AlertCircle, BellRing,
} from 'lucide-react'
import './operate.css'

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
          <linearGradient id={`op-spark-${baseValue}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#op-spark-${baseValue})`} />
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
          <linearGradient id="op-telemetry-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#85c093" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#85c093" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <line x1="0" y1="25" x2="350" y2="25" stroke="#cad3d2" strokeWidth="0.5" strokeDasharray="2,4" />
        <line x1="0" y1="60" x2="350" y2="60" stroke="#cad3d2" strokeWidth="0.5" strokeDasharray="2,4" />
        <line x1="0" y1="95" x2="350" y2="95" stroke="#cad3d2" strokeWidth="0.5" strokeDasharray="2,4" />
        <path d={colArea} fill="url(#op-telemetry-grad)" />
        <path d={expLine} fill="none" stroke="#007010" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
        <path d={colLine} fill="none" stroke="#85c093" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={headX} cy={headY} r="3" fill="#85c093" />
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

export default function OperateDashboard() {
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
    <div className="op-workspace min-h-screen bg-[#e0e0e0] flex items-center justify-center p-0 sm:p-4 md:p-6 antialiased">
      <div className="w-full max-w-[430px] h-[100vh] sm:h-[900px] bg-[#e0e0e0] relative overflow-hidden sm:rounded-[12px] border-0 sm:border-[0.5px] border-[#cad3d2] flex flex-col justify-between">
        <header className="bg-[#ffffff] px-4 py-3 flex items-center justify-between z-30 shrink-0" style={{ boxShadow: 'inset 0 -0.5px 0 0 #cad3d2' }}>
          <div className="flex items-center space-x-2.5">
            <button
              onClick={toggleDrawer}
              className="op-btn-icon p-2 flex items-center justify-center"
              aria-label="Toggle Navigation Drawer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-[#09352e]">
                <path
                  d="M11 3H13C16.7712 3 18.6569 3 19.8284 4.17157C21 5.34315 21 7.22876 21 11V13C21 16.7712 21 18.6569 19.8284 19.8284C18.6569 21 16.7712 21 13 21H11C7.2288 21 5.3431 21 4.1716 19.8284C3 18.6569 3 16.7712 3 13V11C3 7.22876 3 5.34315 4.1716 4.17157C5.3431 3 7.2288 3 11 3Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={isDrawerOpen ? PANEL_OPEN : PANEL_CLOSED}
                  fill="#ffffff"
                  style={{ transition: "d 0.35s ease" }}
                />
              </svg>
            </button>
            <div className="flex items-center space-x-2">
              <span className="op-brand text-[#09352e] text-lg tracking-[+0.30em]">BIGDROPS</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => showToast('Search query initialized')}
              className="op-btn-icon p-2 flex items-center justify-center"
              aria-label="Search"
            >
              <Search className="w-4 h-4 text-[#09352e]" />
            </button>
            <button
              onClick={() => showToast('8 updates in system ledger')}
              className="relative p-2 flex items-center justify-center op-btn-icon"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-[#09352e]" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#85c093]" />
            </button>
            <div className="op-avatar" onClick={toggleDrawer}>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
                alt="Profile"
                className="w-full h-full rounded-[2px] object-cover"
              />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto no-scrollbar px-3 py-3 space-y-3 pb-20">
          <section className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center space-x-2">
                <span className="op-bracket-label">[ Financial Snapshot ]</span>
              </div>
              <div className="op-live-badge">
                <span className="op-pulse-dot" />
                <span>STREAM</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="op-card p-3 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="op-label">Outstanding</span>
                  <div className="op-icon-box">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="my-1.5">
                  <div className="op-stat-value">
                    ₦{(outstandingAmount / 1000000).toFixed(2)}M
                  </div>
                  <span className="op-tag">48 ACTIVE</span>
                </div>
                <LiveSparkline baseValue={12.5} volatility={0.12} color="#09352e" />
              </div>

              <div className="op-card p-3 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="op-label">Due This Week</span>
                  <div className="op-icon-box">
                    <AlertCircle className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="my-1.5">
                  <div className="op-stat-value">₦3.24M</div>
                  <span className="op-tag op-tag--action">9 ACTION</span>
                </div>
                <LiveSparkline baseValue={3.2} volatility={0.06} color="#09352e" />
              </div>

              <div className="op-card p-3 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="op-label">Payments Recv.</span>
                  <div className="op-icon-box op-icon-box--accent">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="my-1.5">
                  <div className="op-stat-value">
                    ₦{(collectedAmount / 1000000).toFixed(2)}M
                  </div>
                  <span className="op-tag">+14% VS LAST</span>
                </div>
                <LiveSparkline baseValue={8.9} volatility={0.1} color="#85c093" />
              </div>

              <div className="op-card p-3 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="op-label">Overdue</span>
                  <div className="op-icon-box op-icon-box--dark">
                    <ShieldAlert className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="my-1.5">
                  <div className="op-stat-value">₦1.18M</div>
                  <span className="op-tag op-tag--alert">6 OVERDUE</span>
                </div>
                <LiveSparkline baseValue={1.1} volatility={0.04} color="#09352e" />
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <div className="flex justify-between items-baseline px-1">
              <span className="op-bracket-label">[ Notifications ]</span>
              <span className="op-mono text-[10px] text-[#6c7a79]">
                {notificationsList.length} items
              </span>
            </div>

            <div
              className="op-card p-3 relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="flex items-start justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                  <span className="op-pill">{notificationsList[currentSlideIndex].type}</span>
                  <span className="op-mono text-[10px] text-[#6c7a79]">{notificationsList[currentSlideIndex].ref}</span>
                </div>
                <span className="op-mono text-[10px] text-[#6c7a79]">{notificationsList[currentSlideIndex].time}</span>
              </div>

              <div className="py-1">
                <h3 className="text-[13px] font-medium text-[#09352e]">{notificationsList[currentSlideIndex].client}</h3>
                <p className="text-[11px] text-[#6c7a79] mt-0.5">{notificationsList[currentSlideIndex].desc}</p>
              </div>

              <div className="mt-2 pt-2 flex items-center justify-between" style={{ borderTop: '0.5px solid #cad3d2' }}>
                <span className="op-stat-sm">{notificationsList[currentSlideIndex].amount}</span>
                <button
                  onClick={() => showToast(`Opened ${notificationsList[currentSlideIndex].type} ${notificationsList[currentSlideIndex].ref}`)}
                  className="op-btn-primary text-[10px] px-2.5 py-1"
                >
                  <span>VIEW</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="flex justify-center space-x-1 mt-2">
                {notificationsList.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      idx === currentSlideIndex ? 'w-4 bg-[#09352e]' : 'w-1 bg-[#cad3d2]'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <span className="op-bracket-label px-1">[ Documents ]</span>

            <div className="op-card border divide-y" style={{ borderColor: '#cad3d2' }}>
              <div className="p-3 flex items-center justify-between op-row-hover" onClick={() => showToast('Opening Invoice #INV-000042')}>
                <div className="flex items-center space-x-2.5">
                  <div className="op-icon-box op-icon-box--dark">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="op-label">Invoice</span>
                      <span className="op-mono text-[10px] text-[#6c7a79]">#INV-000042</span>
                    </div>
                    <p className="text-[11px] text-[#6c7a79]">Zenith Manufacturing Ltd</p>
                    <span className="op-mono text-[9px] text-[#6c7a79]">Aug 26, 2026</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="op-stat-sm">₦2,450,000</div>
                  <span className="op-tag op-tag--filled">ACTIVE</span>
                </div>
              </div>

              <div className="p-3 flex items-center justify-between op-row-hover" onClick={() => showToast('Opening Quotation #QUO-000128')}>
                <div className="flex items-center space-x-2.5">
                  <div className="op-icon-box">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="op-label">Quotation</span>
                      <span className="op-mono text-[10px] text-[#6c7a79]">#QUO-000128</span>
                    </div>
                    <p className="text-[11px] text-[#6c7a79]">Apex Construction</p>
                    <span className="op-mono text-[9px] text-[#6c7a79]">Aug 25, 2026</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="op-stat-sm">₦4,120,000</div>
                  <span className="op-tag">APPROVED</span>
                </div>
              </div>

              <div className="p-3 flex items-center justify-between op-row-hover" onClick={() => showToast('Opening CSR #CSR-000089')}>
                <div className="flex items-center space-x-2.5">
                  <div className="op-icon-box">
                    <ClipboardCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="op-label">CSR Log</span>
                      <span className="op-mono text-[10px] text-[#6c7a79]">#CSR-000089</span>
                    </div>
                    <p className="text-[11px] text-[#6c7a79]">GreenFarm Foods</p>
                    <span className="op-mono text-[9px] text-[#6c7a79]">Aug 24, 2026</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-[#6c7a79]">Service Log</div>
                  <span className="op-tag">SIGNED</span>
                </div>
              </div>

              <div className="p-3 flex items-center justify-between op-row-hover" onClick={() => showToast('Opening Waybill #WBL-E-000054')}>
                <div className="flex items-center space-x-2.5">
                  <div className="op-icon-box op-icon-box--dark">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="op-label">Waybill (Ext)</span>
                      <span className="op-mono text-[10px] text-[#6c7a79]">#WBL-E-000054</span>
                    </div>
                    <p className="text-[11px] text-[#6c7a79]">Nova Logistics</p>
                    <span className="op-mono text-[9px] text-[#6c7a79]">Aug 23, 2026</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-[#6c7a79]">14 Items</div>
                  <span className="op-tag op-tag--filled">TRANSIT</span>
                </div>
              </div>

              <div className="p-3 flex items-center justify-between op-row-hover" onClick={() => showToast('Opening Correspondence #COR-000031')}>
                <div className="flex items-center space-x-2.5">
                  <div className="op-icon-box">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="op-label">Correspondence</span>
                      <span className="op-mono text-[10px] text-[#6c7a79]">#COR-000031</span>
                    </div>
                    <p className="text-[11px] text-[#6c7a79]">Sterling Supplies</p>
                    <span className="op-mono text-[9px] text-[#6c7a79]">Aug 22, 2026</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-[#6c7a79]">SLA Rev</div>
                  <span className="op-tag">SENT</span>
                </div>
              </div>

              <div className="p-3 flex items-center justify-between op-row-hover" onClick={() => showToast('Opening RFQ #RFQ-000019')}>
                <div className="flex items-center space-x-2.5">
                  <div className="op-icon-box">
                    <FileQuestion className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="op-label">RFQ</span>
                      <span className="op-mono text-[10px] text-[#6c7a79]">#RFQ-000019</span>
                    </div>
                    <p className="text-[11px] text-[#6c7a79]">Prime Energy</p>
                    <span className="op-mono text-[9px] text-[#6c7a79]">Aug 21, 2026</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="op-stat-sm">₦8,500,000</div>
                  <span className="op-tag op-tag--filled">TENDER</span>
                </div>
              </div>
            </div>
          </section>

          <section className="op-dark-panel p-3 space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="op-brand-sm text-[#ffffff]">CASH FLOW</span>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#85c093]" />
                <span className="op-mono text-[9px] text-[#85c093] tracking-[+0.30em]">TELEMETRY</span>
              </div>
            </div>

            <LiveTelemetryGraph expectedTotal={15700000} collectedTotal={collectedAmount} />

            <div className="pt-2 grid grid-cols-3 text-center gap-1" style={{ borderTop: '0.5px solid rgba(255,255,255,0.1)' }}>
              <div className="p-1.5 rounded-[4px]" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="op-mono text-[8px] text-[rgba(255,255,255,0.5)] tracking-[+0.30em]">EXPECTED</div>
                <div className="op-stat-sm text-[#ffffff]">₦15.7M</div>
              </div>
              <div className="p-1.5 rounded-[4px]" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="op-mono text-[8px] text-[#85c093] tracking-[+0.30em]">COLLECTED</div>
                <div className="op-stat-sm text-[#85c093]">
                  ₦{(collectedAmount / 1000000).toFixed(2)}M
                </div>
              </div>
              <div className="p-1.5 rounded-[4px]" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="op-mono text-[8px] text-[rgba(255,255,255,0.5)] tracking-[+0.30em]">RATE</div>
                <div className="op-stat-sm text-[#ffffff]">
                  {((collectedAmount / 15700000) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-2 pt-1">
            <span className="op-bracket-label px-1">[ Activity ]</span>

            <div className="op-card p-3 space-y-2.5">
              <div className="flex items-start space-x-2 pb-2" style={{ borderBottom: '0.5px solid #cad3d2' }}>
                <div className="op-icon-box op-icon-box--moss mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] text-[#09352e]">
                    Payment <span className="font-medium">₦540,000</span> for <span>Prime Energy</span>
                  </p>
                  <span className="op-mono text-[9px] text-[#6c7a79]">12m ago</span>
                </div>
              </div>

              <div className="flex items-start space-x-2 pb-2" style={{ borderBottom: '0.5px solid #cad3d2' }}>
                <div className="op-icon-box mt-0.5">
                  <Eye className="w-3 h-3" />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] text-[#09352e]">
                    <span>Zenith Mfg</span> viewed Invoice <span className="op-mono text-[9px]">#INV-000043</span>
                  </p>
                  <span className="op-mono text-[9px] text-[#6c7a79]">1h ago</span>
                </div>
              </div>

              <div className="flex items-start space-x-2 pb-2" style={{ borderBottom: '0.5px solid #cad3d2' }}>
                <div className="op-icon-box mt-0.5">
                  <Truck className="w-3 h-3" />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] text-[#09352e]">
                    Waybill <span className="op-mono text-[9px]">#WBL-E-000054</span> generated for <span>Nova Logistics</span>
                  </p>
                  <span className="op-mono text-[9px] text-[#6c7a79]">3h ago</span>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <div className="op-icon-box op-icon-box--moss mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] text-[#09352e]">
                    Quotation <span className="op-mono text-[9px]">#QUO-000128</span> approved by <span className="font-medium">Apex Construction</span>
                  </p>
                  <span className="op-mono text-[9px] text-[#6c7a79]">Yesterday 4:15 PM</span>
                </div>
              </div>
            </div>

            <div className="pt-1 text-center">
              <button
                onClick={() => handleModuleSelect('Audit Hub')}
                className="op-btn-primary text-[10px] px-3 py-1.5 inline-flex items-center space-x-1.5"
              >
                <ShieldAlert className="w-3 h-3" />
                <span>OPEN AUDIT HUB</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </section>
        </main>

        <div className="absolute bottom-16 right-4 z-30">
          <button
            onClick={() => showToast('Select Document Type to Create')}
            className="op-fab"
            aria-label="Create Document"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div
          className={`absolute inset-0 z-50 transition-opacity duration-300 ${
            isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{ background: 'rgba(9,53,46,0.3)' }}
          onClick={toggleDrawer}
        />

        <div className={`op-drawer ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2" style={{ borderBottom: '0.5px solid #cad3d2' }}>
              <span className="op-brand-sm text-[#09352e]">BIGDROPS</span>
              <button onClick={toggleDrawer} className="op-btn-icon p-1.5">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1">
              <span className="op-mono text-[9px] text-[#6c7a79] tracking-[+0.30em] px-1">WORKSPACE</span>
              <button onClick={handleTenantSwitch} className="op-drawer-btn w-full">
                <div className="flex items-center space-x-2 overflow-hidden">
                  <Building2 className="w-3.5 h-3.5 text-[#09352e] shrink-0" />
                  <span className="text-[11px] font-medium text-[#09352e] truncate">{activeTenant}</span>
                </div>
                <ChevronDown className="w-3 h-3 text-[#6c7a79] shrink-0 ml-1" />
              </button>
            </div>

            <div className="op-card p-2.5 flex items-center space-x-2">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
                alt="Chinedu Okonkwo"
                className="w-8 h-8 rounded-[2px] object-cover"
                style={{ border: '0.5px solid #09352e' }}
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-[11px] font-medium text-[#09352e] truncate">Chinedu Okonkwo</h4>
                <p className="text-[9px] text-[#6c7a79] truncate">Senior Operations Lead</p>
              </div>
            </div>

            <div className="space-y-0.5 overflow-y-auto max-h-[360px] no-scrollbar pr-1">
              <div className="op-mono text-[9px] text-[#6c7a79] tracking-[+0.30em] mb-1 px-1">CORE</div>
              <button onClick={() => handleModuleSelect('Invoices')} className="op-drawer-item op-drawer-item--active">
                <FileText className="w-3 h-3" /><span>Invoices</span>
              </button>
              <button onClick={() => handleModuleSelect('Quotations')} className="op-drawer-item">
                <FileSpreadsheet className="w-3 h-3" /><span>Quotations</span>
              </button>
              <button onClick={() => handleModuleSelect('CSR')} className="op-drawer-item">
                <ClipboardCheck className="w-3 h-3" /><span>CSR</span>
              </button>
              <button onClick={() => handleModuleSelect('Waybills')} className="op-drawer-item">
                <Truck className="w-3 h-3" /><span>Waybills</span>
              </button>
              <button onClick={() => handleModuleSelect('Payments')} className="op-drawer-item">
                <CreditCard className="w-3 h-3" /><span>Payments</span>
              </button>
              <button onClick={() => handleModuleSelect('Projects')} className="op-drawer-item">
                <FolderKanban className="w-3 h-3" /><span>Projects</span>
              </button>
              <button onClick={() => handleModuleSelect('Clients')} className="op-drawer-item">
                <Users className="w-3 h-3" /><span>Clients</span>
              </button>
              <div className="op-mono text-[9px] text-[#6c7a79] tracking-[+0.30em] mt-2 mb-1 px-1">GOVERNANCE</div>
              <button onClick={() => handleModuleSelect('Compliance')} className="op-drawer-item">
                <ShieldCheck className="w-3 h-3" /><span>Compliance</span>
              </button>
              <button onClick={() => handleModuleSelect('Audit Hub')} className="op-drawer-item">
                <ShieldAlert className="w-3 h-3" /><span>Audit Hub</span>
              </button>
              <button onClick={() => handleModuleSelect('Item Library')} className="op-drawer-item">
                <Package className="w-3 h-3" /><span>Item Library</span>
              </button>
              <button onClick={() => handleModuleSelect('BOQ')} className="op-drawer-item">
                <Layers className="w-3 h-3" /><span>BOQ</span>
              </button>
              <button onClick={() => handleModuleSelect('RFQ')} className="op-drawer-item">
                <FileQuestion className="w-3 h-3" /><span>RFQ</span>
              </button>
              <button onClick={() => handleModuleSelect('Settings')} className="op-drawer-item">
                <Settings className="w-3 h-3" /><span>Settings</span>
              </button>
            </div>
          </div>

          <div className="pt-2 space-y-2" style={{ borderTop: '0.5px solid #cad3d2' }}>
            <button
              onClick={() => { setIsDrawerOpen(false); showToast('Signed out successfully') }}
              className="op-drawer-signout w-full"
            >
              <LogOut className="w-3 h-3" />
              <span>SIGN OUT</span>
            </button>
            <div className="text-center">
              <span className="op-mono text-[8px] text-[#6c7a79] tracking-[+0.30em]">OPERATE v2.4</span>
            </div>
          </div>
        </div>

        <nav className="op-nav">
          <button className="op-nav-item op-nav-item--active">
            <LayoutDashboard className="w-4 h-4" />
            <span>Home</span>
          </button>
          <button onClick={() => showToast('Switched to Documents')} className="op-nav-item">
            <FileText className="w-4 h-4" />
            <span>Docs</span>
          </button>
          <button onClick={() => showToast('Switched to Logistics')} className="op-nav-item">
            <Truck className="w-4 h-4" />
            <span>Dispatch</span>
          </button>
          <button onClick={() => showToast('Switched to Projects')} className="op-nav-item">
            <Folder className="w-4 h-4" />
            <span>Projects</span>
          </button>
          <button onClick={toggleDrawer} className="op-nav-item">
            <Menu className="w-4 h-4" />
            <span>More</span>
          </button>
        </nav>

        <div className="op-home-indicator">
          <div className="w-24 h-0.5 bg-[#cad3d2] rounded-full" />
        </div>

        {toastMessage && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#09352e] text-[#85c093] text-[10px] font-medium px-3 py-1.5 rounded-[4px] shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200 whitespace-nowrap op-mono tracking-[+0.30em]">
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  )
}

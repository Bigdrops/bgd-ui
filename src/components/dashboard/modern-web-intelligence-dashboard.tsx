import { useState, useEffect, useRef } from 'react'
import {
  Search, Bell, ArrowRight, Plus, X, Eye, Truck, Check,
  LayoutDashboard, FileText, Folder, Menu, FileSpreadsheet,
  ClipboardCheck, Mail, CreditCard, FolderKanban, Users,
  ShieldCheck, Package, Layers, FileQuestion, Building2,
  ChevronDown, Settings, ShieldAlert, LogOut, Clock,
  TrendingUp, AlertCircle, BellRing,
} from 'lucide-react'
import { InfiniteNotificationCarousel } from '@/components/ui/infinite-notification-carousel'
import type { NotificationSlide } from '@/components/ui/infinite-notification-carousel'
import './index.css'

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
          <linearGradient id={`spark-grad-${baseValue}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#spark-grad-${baseValue})`} />
        <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={latestX} cy={latestY} r="3.5" fill={color} className="animate-ping opacity-75" />
        <circle cx={latestX} cy={latestY} r="2.5" fill="#ffffff" stroke={color} strokeWidth="1.5" />
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
          <linearGradient id="telemetry-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c8f169" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#c8f169" stopOpacity="0.0" />
          </linearGradient>
          <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <line x1="0" y1="25" x2="350" y2="25" stroke="rgba(252,252,252,0.06)" strokeWidth="1" />
        <line x1="0" y1="60" x2="350" y2="60" stroke="rgba(252,252,252,0.06)" strokeWidth="1" />
        <line x1="0" y1="95" x2="350" y2="95" stroke="rgba(252,252,252,0.06)" strokeWidth="1" />
        <path d={colArea} fill="url(#telemetry-grad)" />
        <path d={expLine} fill="none" stroke="#78c51c" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6" />
        <path d={colLine} fill="none" stroke="#c8f169" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" filter="url(#neon-glow)" />
        <circle cx={headX} cy={headY} r="5" fill="#ffffff" className="animate-ping opacity-80" />
        <circle cx={headX} cy={headY} r="3.5" fill="#c8f169" />
      </svg>
    </div>
  )
}

const notificationsList: NotificationSlide[] = [
  { type: 'Invoice', ref: '#INV-000042', client: 'Zenith Manufacturing Ltd', amount: '₦2,450,000', time: '12m ago', desc: 'New invoice generated & dispatched.' },
  { type: 'Quotation', ref: '#QUO-000128', client: 'Apex Construction', amount: '₦4,120,000', time: '45m ago', desc: 'Quotation reviewed by client.' },
  { type: 'Invoice', ref: '#INV-000048', client: 'Nova Logistics', amount: '₦820,000', time: '2h ago', desc: 'Payment reminder auto-queued.' },
  { type: 'Quotation', ref: '#QUO-000130', client: 'GreenFarm Foods', amount: '₦1,150,000', time: '3h ago', desc: 'Draft quotation updated with VAT.' },
  { type: 'Invoice', ref: '#INV-000051', client: 'Sterling Supplies', amount: '₦3,100,000', time: '5h ago', desc: 'Direct debit notice acknowledged.' },
  { type: 'Invoice', ref: '#INV-000054', client: 'Prime Energy', amount: '₦540,000', time: '6h ago', desc: 'Partial payment reconciled.' },
]

export default function ModernWebIntelligenceDashboard() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [activeTenant, setActiveTenant] = useState('BIGDROPS Nigeria Ltd')
  const [collectedAmount, setCollectedAmount] = useState(8920000)
  const [outstandingAmount, setOutstandingAmount] = useState(12540000)

  useEffect(() => {
    const interval = setInterval(() => {
      const inc1 = Math.floor(Math.random() * 45000)
      const inc2 = Math.floor(Math.random() * 25000)
      setCollectedAmount((prev) => prev + inc1)
      setOutstandingAmount((prev) => Math.max(0, prev - inc2))
    }, 5000)
    return () => clearInterval(interval)
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

  const handleNotificationAction = (slide: NotificationSlide) => {
    showToast(`Opened ${slide.type} ${slide.ref}`)
  }

  return (
    <div className="dashboard-workspace min-h-screen bg-[#043f2e] flex items-start justify-center p-0 sm:p-4 md:p-6 antialiased">
      <div className="w-full max-w-[430px] min-h-screen sm:min-h-0 bg-[#eef2e3] relative overflow-hidden sm:rounded-[32px] border-0 sm:border-[8px] border-[#043f2e] flex flex-col justify-between">
        <header className="bg-[#fcfcfc] px-4 py-3.5 flex items-center justify-between z-30 shrink-0 border-b border-[#043f2e]/10">
          <div className="flex items-center space-x-2.5">
            <button
              onClick={toggleDrawer}
              className="p-2 rounded-[4px] bg-[#eef2e3] text-[#043f2e] transition-transform active:scale-95 border border-[#043f2e]/20 flex items-center justify-center"
              aria-label="Toggle Navigation Drawer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-[#043f2e]">
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
                  fill="#fcfcfc"
                  style={{ transition: "d 0.35s ease" }}
                />
              </svg>
            </button>
            <div className="flex items-center space-x-2">
              <span className="font-grenette text-[#043f2e] text-xl tracking-tight">BIGDROPS</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => showToast('Search query initialized')}
              className="p-2 rounded-[4px] bg-[#eef2e3] text-[#043f2e] hover:bg-[#c8f169] transition-transform active:scale-95 border border-[#043f2e]/20 flex items-center justify-center"
              aria-label="Search"
            >
              <Search className="w-4 h-4 text-[#043f2e]" />
            </button>
            <button
              onClick={() => showToast('8 updates in system ledger')}
              className="relative p-2 rounded-[4px] bg-[#eef2e3] text-[#043f2e] hover:bg-[#c8f169] transition-transform active:scale-95 border border-[#043f2e]/20 flex items-center justify-center"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-[#043f2e]" />
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#c8f169]" />
            </button>
            <div
              className="relative w-8 h-8 rounded-[4px] bg-[#043f2e] p-0.5 cursor-pointer transition-transform active:scale-95 border border-[#043f2e]"
              onClick={toggleDrawer}
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
                alt="Profile"
                className="w-full h-full rounded-[2px] object-cover"
              />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto no-scrollbar px-3.5 py-4 space-y-5 pb-20">
          <section className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <h2 className="text-[12px] uppercase tracking-[0.06em] text-[#043f2e] font-medium">Financial Snapshot</h2>
              <div className="live-badge">
                <span className="pulsing-dot" />
                <span>REAL-TIME STREAM</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-[#fcfcfc] p-3.5 rounded-[16px] border border-[#043f2e]/10 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#242423] font-normal">Outstanding</span>
                  <div className="w-7 h-7 rounded-[4px] bg-[#c8f169] flex items-center justify-center text-[#000000]">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="my-2">
                  <div className="font-grenette text-2xl text-[#043f2e] tracking-[-0.02em]">
                    ₦{(outstandingAmount / 1000000).toFixed(2)}M
                  </div>
                  <span className="text-[10px] text-[#043f2e] font-medium uppercase tracking-[0.06em]">48 Invoices Active</span>
                </div>
                <LiveSparkline baseValue={12.5} volatility={0.12} color="#043f2e" />
              </div>

              <div className="bg-[#fcfcfc] p-3.5 rounded-[16px] border border-[#043f2e]/10 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#242423] font-normal">Due This Week</span>
                  <div className="w-7 h-7 rounded-[4px] bg-[#c8f169] flex items-center justify-center text-[#000000]">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                </div>
                <div className="my-2">
                  <div className="font-grenette text-2xl text-[#043f2e] tracking-[-0.02em]">₦3.24M</div>
                  <span className="text-[10px] text-[#000000] font-medium bg-[#c8f169] px-1 rounded-[4px] uppercase tracking-[0.06em]">9 Action Needed</span>
                </div>
                <LiveSparkline baseValue={3.2} volatility={0.06} color="#043f2e" />
              </div>

              <div className="bg-[#fcfcfc] p-3.5 rounded-[16px] border border-[#043f2e]/10 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#242423] font-normal">Payments Recv.</span>
                  <div className="w-7 h-7 rounded-[4px] bg-[#043f2e] flex items-center justify-center text-[#c8f169]">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="my-2">
                  <div className="font-grenette text-2xl text-[#043f2e] tracking-[-0.02em]">
                    ₦{(collectedAmount / 1000000).toFixed(2)}M
                  </div>
                  <span className="text-[10px] text-[#043f2e] uppercase tracking-[0.06em] font-medium">+14% vs last month</span>
                </div>
                <LiveSparkline baseValue={8.9} volatility={0.1} color="#78c51c" />
              </div>

              <div className="bg-[#fcfcfc] p-3.5 rounded-[16px] border border-[#043f2e]/10 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#242423] font-normal">Overdue</span>
                  <div className="w-7 h-7 rounded-[4px] bg-[#043f2e] flex items-center justify-center text-[#fcfcfc]">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                </div>
                <div className="my-2">
                  <div className="font-grenette text-2xl text-[#043f2e] tracking-[-0.02em]">₦1.18M</div>
                  <span className="text-[10px] text-[#000000] font-medium bg-[#c8f169] px-1 rounded-[4px] uppercase tracking-[0.06em]">6 Overdue</span>
                </div>
                <LiveSparkline baseValue={1.1} volatility={0.04} color="#043f2e" />
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <div className="flex justify-between items-baseline px-1">
              <h2 className="text-[12px] uppercase tracking-[0.06em] text-[#043f2e] font-medium flex items-center">
                <BellRing className="w-3.5 h-3.5 mr-1.5 text-[#244cff]" /> Recent Notifications Feed
              </h2>
              <span className="text-[10px] font-mono text-[#043f2e]/70">
                {notificationsList.length} items
              </span>
            </div>

            <div className="bg-[#fcfcfc] rounded-[16px] p-4 border border-[#043f2e]/15 shadow-sm relative overflow-hidden cursor-grab active:cursor-grabbing select-none">
              <InfiniteNotificationCarousel
                slides={notificationsList}
                autoplayInterval={4500}
                onSlideAction={handleNotificationAction}
              />
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-[12px] uppercase tracking-[0.06em] text-[#043f2e] font-medium px-1">Recently Created Documents</h2>

            <div className="bg-[#fcfcfc] rounded-[16px] border border-[#043f2e]/10 divide-y divide-[#043f2e]/10 overflow-hidden">
              <div
                className="p-3.5 flex items-center justify-between hover:bg-[#eef2e3] transition-colors cursor-pointer active:scale-97"
                onClick={() => showToast('Opening Invoice #INV-000042')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-[4px] bg-[#043f2e] text-[#fcfcfc] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-[#c8f169]" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-[#043f2e] font-medium">Invoice</span>
                      <span className="text-[10px] font-mono text-[#242423]">#INV-000042</span>
                    </div>
                    <p className="text-[11px] text-[#242423]">Zenith Manufacturing Ltd</p>
                    <span className="text-[10px] text-[#043f2e]/70 font-mono">Aug 26, 2026</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-grenette text-lg text-[#043f2e]">₦2,450,000</div>
                  <span className="inline-block text-[9px] text-[#000000] bg-[#c8f169] px-2 py-0.5 rounded-[4px] font-medium uppercase tracking-[0.06em] mt-0.5">Active</span>
                </div>
              </div>

              <div
                className="p-3.5 flex items-center justify-between hover:bg-[#eef2e3] transition-colors cursor-pointer active:scale-97"
                onClick={() => showToast('Opening Quotation #QUO-000128')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-[4px] bg-[#eef2e3] text-[#043f2e] flex items-center justify-center shrink-0 border border-[#043f2e]/20">
                    <FileSpreadsheet className="w-5 h-5 text-[#043f2e]" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-[#043f2e] font-medium">Quotation</span>
                      <span className="text-[10px] font-mono text-[#242423]">#QUO-000128</span>
                    </div>
                    <p className="text-[11px] text-[#242423]">Apex Construction</p>
                    <span className="text-[10px] text-[#043f2e]/70 font-mono">Aug 25, 2026</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-grenette text-lg text-[#043f2e]">₦4,120,000</div>
                  <span className="inline-block text-[9px] text-[#043f2e] bg-[#eef2e3] px-2 py-0.5 rounded-[4px] border border-[#043f2e]/20 font-medium uppercase tracking-[0.06em] mt-0.5">Approved</span>
                </div>
              </div>

              <div
                className="p-3.5 flex items-center justify-between hover:bg-[#eef2e3] transition-colors cursor-pointer active:scale-97"
                onClick={() => showToast('Opening CSR #CSR-000089')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-[4px] bg-[#eef2e3] text-[#043f2e] flex items-center justify-center shrink-0 border border-[#043f2e]/20">
                    <ClipboardCheck className="w-5 h-5 text-[#043f2e]" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-[#043f2e] font-medium">CSR Log</span>
                      <span className="text-[10px] font-mono text-[#242423]">#CSR-000089</span>
                    </div>
                    <p className="text-[11px] text-[#242423]">GreenFarm Foods</p>
                    <span className="text-[10px] text-[#043f2e]/70 font-mono">Aug 24, 2026</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#043f2e]">Service Log</div>
                  <span className="inline-block text-[9px] text-[#043f2e] bg-[#eef2e3] px-2 py-0.5 rounded-[4px] border border-[#043f2e]/20 font-medium uppercase tracking-[0.06em] mt-0.5">Signed</span>
                </div>
              </div>

              <div
                className="p-3.5 flex items-center justify-between hover:bg-[#eef2e3] transition-colors cursor-pointer active:scale-97"
                onClick={() => showToast('Opening Waybill #WBL-E-000054')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-[4px] bg-[#043f2e] text-[#fcfcfc] flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5 text-[#c8f169]" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-[#043f2e] font-medium">Waybill (Ext)</span>
                      <span className="text-[10px] font-mono text-[#242423]">#WBL-E-000054</span>
                    </div>
                    <p className="text-[11px] text-[#242423]">Nova Logistics</p>
                    <span className="text-[10px] text-[#043f2e]/70 font-mono">Aug 23, 2026</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#043f2e]">14 Items</div>
                  <span className="inline-block text-[9px] text-[#000000] bg-[#c8f169] px-2 py-0.5 rounded-[4px] font-medium uppercase tracking-[0.06em] mt-0.5">In Transit</span>
                </div>
              </div>

              <div
                className="p-3.5 flex items-center justify-between hover:bg-[#eef2e3] transition-colors cursor-pointer active:scale-97"
                onClick={() => showToast('Opening Correspondence #COR-000031')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-[4px] bg-[#eef2e3] text-[#043f2e] flex items-center justify-center shrink-0 border border-[#043f2e]/20">
                    <Mail className="w-5 h-5 text-[#043f2e]" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-[#043f2e] font-medium">Correspondence</span>
                      <span className="text-[10px] font-mono text-[#242423]">#COR-000031</span>
                    </div>
                    <p className="text-[11px] text-[#242423]">Sterling Supplies</p>
                    <span className="text-[10px] text-[#043f2e]/70 font-mono">Aug 22, 2026</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#043f2e]">SLA Rev</div>
                  <span className="inline-block text-[9px] text-[#043f2e] bg-[#eef2e3] px-2 py-0.5 rounded-[4px] border border-[#043f2e]/20 font-medium uppercase tracking-[0.06em] mt-0.5">Sent</span>
                </div>
              </div>

              <div
                className="p-3.5 flex items-center justify-between hover:bg-[#eef2e3] transition-colors cursor-pointer active:scale-97"
                onClick={() => showToast('Opening RFQ #RFQ-000019')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-[4px] bg-[#eef2e3] text-[#043f2e] flex items-center justify-center shrink-0 border border-[#043f2e]/20">
                    <FileQuestion className="w-5 h-5 text-[#043f2e]" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-[#043f2e] font-medium">RFQ</span>
                      <span className="text-[10px] font-mono text-[#242423]">#RFQ-000019</span>
                    </div>
                    <p className="text-[11px] text-[#242423]">Prime Energy</p>
                    <span className="text-[10px] text-[#043f2e]/70 font-mono">Aug 21, 2026</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-grenette text-lg text-[#043f2e]">₦8,500,000</div>
                  <span className="inline-block text-[9px] text-[#000000] bg-[#c8f169] px-2 py-0.5 rounded-[4px] font-medium uppercase tracking-[0.06em] mt-0.5">Tender</span>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-[#043f2e] rounded-[16px] p-4 text-[#fcfcfc] space-y-2.5 relative overflow-hidden">
            <div className="flex justify-between items-baseline">
              <span className="font-grenette text-lg text-[#fcfcfc]">Cash Flow Forecast</span>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#c8f169] animate-ping" />
                <span className="text-[10px] text-[#c8f169] font-mono tracking-[0.06em] uppercase">TELEMETRY STREAM</span>
              </div>
            </div>

            <LiveTelemetryGraph expectedTotal={15700000} collectedTotal={collectedAmount} />

            <div className="pt-2 border-t border-[#fcfcfc]/10 grid grid-cols-3 text-center gap-1.5">
              <div className="bg-[#fcfcfc]/5 p-1.5 rounded-[4px]">
                <div className="text-[9px] text-[#fcfcfc]/70 uppercase tracking-[0.06em]">Expected</div>
                <div className="font-grenette text-sm text-[#fcfcfc]">₦15.7M</div>
              </div>
              <div className="bg-[#fcfcfc]/5 p-1.5 rounded-[4px]">
                <div className="text-[9px] text-[#c8f169] uppercase tracking-[0.06em]">Collected</div>
                <div className="font-grenette text-sm text-[#c8f169]">
                  ₦{(collectedAmount / 1000000).toFixed(2)}M
                </div>
              </div>
              <div className="bg-[#fcfcfc]/5 p-1.5 rounded-[4px]">
                <div className="text-[9px] text-[#fcfcfc]/70 uppercase tracking-[0.06em]">Rate</div>
                <div className="font-grenette text-sm text-[#fcfcfc]">
                  {((collectedAmount / 15700000) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-2 pt-1">
            <h2 className="text-[12px] uppercase tracking-[0.06em] text-[#043f2e] font-medium px-1">Recent Activity</h2>

            <div className="bg-[#fcfcfc] rounded-[16px] p-3.5 border border-[#043f2e]/10 space-y-3">
              <div className="flex items-start space-x-2.5 pb-2.5 border-b border-[#043f2e]/10">
                <div className="w-5 h-5 rounded-[4px] bg-[#c8f169] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#000000]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[#043f2e]">
                    Payment <span className="font-medium">₦540,000</span> for <span className="font-normal">Prime Energy</span>
                  </p>
                  <span className="text-[10px] text-[#242423]">12m ago</span>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 pb-2.5 border-b border-[#043f2e]/10">
                <div className="w-5 h-5 rounded-[4px] bg-[#eef2e3] border border-[#043f2e]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Eye className="w-3 h-3 text-[#043f2e]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[#043f2e]">
                    <span>Zenith Mfg</span> viewed Invoice <span className="font-mono text-[10px]">#INV-000043</span>
                  </p>
                  <span className="text-[10px] text-[#242423]">1h ago</span>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 pb-2.5 border-b border-[#043f2e]/10">
                <div className="w-5 h-5 rounded-[4px] bg-[#eef2e3] border border-[#043f2e]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Truck className="w-3 h-3 text-[#043f2e]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[#043f2e]">
                    Waybill <span className="font-mono text-[10px]">#WBL-E-000054</span> generated for <span>Nova Logistics</span>
                  </p>
                  <span className="text-[10px] text-[#242423]">3h ago</span>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <div className="w-5 h-5 rounded-[4px] bg-[#c8f169] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#000000]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[#043f2e]">
                    Quotation <span className="font-mono text-[10px]">#QUO-000128</span> approved by <span className="font-medium">Apex Construction</span>
                  </p>
                  <span className="text-[10px] text-[#242423]">Yesterday 4:15 PM</span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => handleModuleSelect('Audit Hub')}
                className="text-xs text-[#000000] font-medium tracking-[0.06em] uppercase inline-flex items-center space-x-1.5 py-1.5 px-4 rounded-[4px] bg-[#c8f169] border border-[#000000]/20 transition-transform active:scale-95 shadow-sm"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-[#000000]" />
                <span>Open Compiled Audit Hub</span>
                <ArrowRight className="w-3 h-3 text-[#000000]" />
              </button>
            </div>
          </section>
        </main>

        <div className="absolute bottom-16 right-4 z-30">
          <button
            onClick={() => showToast('Select Document Type to Create')}
            className="w-12 h-12 rounded-[4px] bg-[#c8f169] text-[#000000] flex items-center justify-center transition-transform active:scale-95 border border-[#043f2e]/20"
            aria-label="Create Document"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        <div
          className={`absolute inset-0 bg-[#043f2e]/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
            isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={toggleDrawer}
        />

        <div
          className={`absolute top-0 left-0 bottom-0 w-[82%] max-w-[310px] bg-[#eef2e3] text-[#043f2e] z-50 transition-transform duration-350 ease-out flex flex-col justify-between p-4 border-r border-[#043f2e]/20 ${
            isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#043f2e]/10">
              <h3 className="font-grenette text-xl text-[#043f2e]">BIGDROPS</h3>
              <button
                onClick={toggleDrawer}
                className="p-1.5 rounded-[4px] bg-[#fcfcfc] text-[#043f2e] transition-transform active:scale-95 border border-[#043f2e]/20"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-[#043f2e] uppercase tracking-[0.06em] px-1 font-medium">Active Workspace</span>
              <button
                onClick={handleTenantSwitch}
                className="w-full bg-[#fcfcfc] border border-[#043f2e]/20 rounded-[4px] p-2.5 flex items-center justify-between text-left transition-colors hover:bg-[#c8f169]/30"
              >
                <div className="flex items-center space-x-2 overflow-hidden">
                  <Building2 className="w-4 h-4 text-[#043f2e] shrink-0" />
                  <span className="text-xs font-medium text-[#043f2e] truncate">{activeTenant}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#242423] shrink-0 ml-1" />
              </button>
            </div>

            <div className="bg-[#fcfcfc] border border-[#043f2e]/10 rounded-[16px] p-2.5 flex items-center space-x-2.5">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
                alt="Chinedu Okonkwo"
                className="w-9 h-9 rounded-[4px] object-cover border border-[#043f2e]"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-medium text-[#043f2e] truncate">Chinedu Okonkwo</h4>
                <p className="text-[10px] text-[#242423] truncate">Senior Operations Lead</p>
              </div>
            </div>

            <div className="space-y-1 overflow-y-auto max-h-[360px] no-scrollbar pr-1">
              <div className="text-[10px] text-[#043f2e] uppercase tracking-[0.06em] mb-1 px-1 font-medium">Core Modules</div>
              <button onClick={() => handleModuleSelect('Invoices')} className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[4px] bg-[#c8f169] text-[#000000] text-xs font-medium uppercase tracking-[0.06em]">
                <FileText className="w-3.5 h-3.5 text-[#000000]" /><span>Invoices</span>
              </button>
              <button onClick={() => handleModuleSelect('Quotations')} className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[4px] text-[#043f2e] hover:bg-[#fcfcfc] text-xs font-normal uppercase tracking-[0.06em]">
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#043f2e]" /><span>Quotations</span>
              </button>
              <button onClick={() => handleModuleSelect('CSR')} className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[4px] text-[#043f2e] hover:bg-[#fcfcfc] text-xs font-normal uppercase tracking-[0.06em]">
                <ClipboardCheck className="w-3.5 h-3.5 text-[#043f2e]" /><span>Customer Service Reports (CSR)</span>
              </button>
              <button onClick={() => handleModuleSelect('Waybills')} className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[4px] text-[#043f2e] hover:bg-[#fcfcfc] text-xs font-normal uppercase tracking-[0.06em]">
                <Truck className="w-3.5 h-3.5 text-[#043f2e]" /><span>Waybills (Ext & Int)</span>
              </button>
              <button onClick={() => handleModuleSelect('Payments')} className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[4px] text-[#043f2e] hover:bg-[#fcfcfc] text-xs font-normal uppercase tracking-[0.06em]">
                <CreditCard className="w-3.5 h-3.5 text-[#043f2e]" /><span>Payments Ledger</span>
              </button>
              <button onClick={() => handleModuleSelect('Projects')} className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[4px] text-[#043f2e] hover:bg-[#fcfcfc] text-xs font-normal uppercase tracking-[0.06em]">
                <FolderKanban className="w-3.5 h-3.5 text-[#043f2e]" /><span>Projects Engagement</span>
              </button>
              <button onClick={() => handleModuleSelect('Clients')} className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[4px] text-[#043f2e] hover:bg-[#fcfcfc] text-xs font-normal uppercase tracking-[0.06em]">
                <Users className="w-3.5 h-3.5 text-[#043f2e]" /><span>Client Management</span>
              </button>
              <div className="text-[10px] text-[#043f2e] uppercase tracking-[0.06em] mt-3 mb-1 px-1 font-medium">Management & Governance</div>
              <button onClick={() => handleModuleSelect('Compliance')} className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[4px] text-[#043f2e] hover:bg-[#fcfcfc] text-xs font-normal uppercase tracking-[0.06em]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#043f2e]" /><span>Compliance Hub</span>
              </button>
              <button onClick={() => handleModuleSelect('Audit Hub')} className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[4px] text-[#043f2e] hover:bg-[#fcfcfc] text-xs font-normal uppercase tracking-[0.06em]">
                <ShieldAlert className="w-3.5 h-3.5 text-[#043f2e]" /><span>Audit Hub & Token Ledger</span>
              </button>
              <button onClick={() => handleModuleSelect('Item Library')} className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[4px] text-[#043f2e] hover:bg-[#fcfcfc] text-xs font-normal uppercase tracking-[0.06em]">
                <Package className="w-3.5 h-3.5 text-[#043f2e]" /><span>Item Library</span>
              </button>
              <button onClick={() => handleModuleSelect('BOQ')} className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[4px] text-[#043f2e] hover:bg-[#fcfcfc] text-xs font-normal uppercase tracking-[0.06em]">
                <Layers className="w-3.5 h-3.5 text-[#043f2e]" /><span>Bill of Quantities (BOQ)</span>
              </button>
              <button onClick={() => handleModuleSelect('RFQ')} className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[4px] text-[#043f2e] hover:bg-[#fcfcfc] text-xs font-normal uppercase tracking-[0.06em]">
                <FileQuestion className="w-3.5 h-3.5 text-[#043f2e]" /><span>Request for Quotation (RFQ)</span>
              </button>
              <button onClick={() => handleModuleSelect('Settings')} className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[4px] text-[#043f2e] hover:bg-[#fcfcfc] text-xs font-normal uppercase tracking-[0.06em]">
                <Settings className="w-3.5 h-3.5 text-[#043f2e]" /><span>Settings</span>
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-[#043f2e]/10 space-y-2">
            <button
              onClick={() => { setIsDrawerOpen(false); showToast('Signed out successfully') }}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-[4px] bg-[#043f2e] text-[#fcfcfc] text-xs font-medium uppercase tracking-[0.06em] transition-transform active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5 text-[#c8f169]" />
              <span>Sign Out</span>
            </button>
            <div className="text-center text-[10px] text-[#043f2e]/70 tracking-[0.06em] uppercase">
              <span>BIGDROPS Mode System v2.4</span>
            </div>
          </div>
        </div>

        <nav className="bg-[#fcfcfc] border-t border-[#043f2e]/10 px-2 py-2 flex justify-around items-center z-30 shrink-0">
          <button className="flex flex-col items-center justify-center text-[#043f2e] space-y-0.5 transition-transform active:scale-95 w-12">
            <LayoutDashboard className="w-4 h-4 text-[#043f2e]" />
            <span className="text-[10px] font-medium text-[#043f2e]">Home</span>
          </button>
          <button onClick={() => showToast('Switched to Documents')} className="flex flex-col items-center justify-center text-[#242423] hover:text-[#043f2e] space-y-0.5 transition-transform active:scale-95 w-12">
            <FileText className="w-4 h-4" />
            <span className="text-[10px] font-normal">Docs</span>
          </button>
          <button onClick={() => showToast('Switched to Logistics')} className="flex flex-col items-center justify-center text-[#242423] hover:text-[#043f2e] space-y-0.5 transition-transform active:scale-95 w-12">
            <Truck className="w-4 h-4" />
            <span className="text-[10px] font-normal">Dispatch</span>
          </button>
          <button onClick={() => showToast('Switched to Projects')} className="flex flex-col items-center justify-center text-[#242423] hover:text-[#043f2e] space-y-0.5 transition-transform active:scale-95 w-12">
            <Folder className="w-4 h-4" />
            <span className="text-[10px] font-normal">Projects</span>
          </button>
          <button onClick={toggleDrawer} className="flex flex-col items-center justify-center text-[#242423] hover:text-[#043f2e] space-y-0.5 transition-transform active:scale-95 w-12">
            <Menu className="w-4 h-4" />
            <span className="text-[10px] font-normal">More</span>
          </button>
        </nav>

        <div className="w-full bg-[#fcfcfc] pb-1.5 flex justify-center z-30">
          <div className="w-28 h-1 bg-[#043f2e]/20 rounded-full" />
        </div>

        {toastMessage && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#043f2e] text-[#c8f169] text-xs font-medium px-4 py-2 rounded-[4px] shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200 whitespace-nowrap">
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  )
}

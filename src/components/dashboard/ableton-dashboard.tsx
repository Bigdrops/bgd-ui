import { useState, useEffect, useRef, type TouchEvent } from 'react'
import './ableton-dashboard.css'

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
  { type: 'Waybill (Ext)', ref: '#WBL-E-000054', client: 'Nova Logistics', amount: '14 Items', date: 'Aug 23, 2026', status: 'In Transit' },
  { type: 'Correspondence', ref: '#COR-000031', client: 'Sterling Supplies', amount: 'SLA Rev', date: 'Aug 22, 2026', status: 'Sent' },
  { type: 'RFQ', ref: '#RFQ-000019', client: 'Prime Energy', amount: '₦8,500,000', date: 'Aug 21, 2026', status: 'Tender' },
]

const activityFeed = [
  { time: '12m', text: '<strong>Zenith Manufacturing Ltd</strong> received invoice #INV-000042 via email delivery.' },
  { time: '45m', text: '<strong>Apex Construction</strong> approved quotation #QUO-000128 after internal review.' },
  { time: '2h', text: 'Payment reminder auto-queued for <strong>Nova Logistics</strong> — #INV-000048.' },
  { time: '3h', text: '<strong>GreenFarm Foods</strong> updated draft quotation #QUO-000130 with VAT line item.' },
  { time: '5h', text: '<strong>Sterling Supplies</strong> acknowledged direct debit notice for #INV-000051.' },
  { time: '6h', text: 'Partial payment of ₦540,000 reconciled for <strong>Prime Energy</strong> — #INV-000054.' },
]

function formatNaira(val: number): string {
  if (val >= 1_000_000) return `₦${(val / 1_000_000).toFixed(2)}M`
  return `₦${val.toLocaleString()}`
}

interface LiveSparklineProps {
  baseValue: number
  volatility: number
}

function LiveSparkline({ baseValue, volatility }: LiveSparklineProps) {
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
  const lastUpdateRef = useRef(performance.now())

  useEffect(() => {
    const handleFrame = (time: number) => {
      if (time - lastUpdateRef.current > 800) {
        lastUpdateRef.current = time
        setPoints(prev => {
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
  const width = 200
  const height = 32

  const pathCoords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * width
    const y = height - ((p - min) / range) * (height - 6) - 3
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })

  const linePath = `M ${pathCoords.join(' L ')}`

  return (
    <div className="ableton-sparkline">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <path
          d={linePath}
          fill="none"
          stroke="#000000"
          strokeWidth="1.5"
          strokeLinecap="square"
          strokeLinejoin="miter"
          className="ableton-draw-line"
        />
      </svg>
    </div>
  )
}

function CashFlowForecast() {
  const [dataStream, setDataStream] = useState<{ month: string; inflow: number; outflow: number }[]>([
    { month: 'JAN', inflow: 4200000, outflow: 3100000 },
    { month: 'FEB', inflow: 3800000, outflow: 3400000 },
    { month: 'MAR', inflow: 5100000, outflow: 2900000 },
    { month: 'APR', inflow: 4600000, outflow: 3600000 },
    { month: 'MAY', inflow: 6200000, outflow: 4100000 },
    { month: 'JUN', inflow: 5800000, outflow: 3800000 },
    { month: 'JUL', inflow: 7400000, outflow: 4500000 },
    { month: 'AUG', inflow: 6900000, outflow: 4200000 },
    { month: 'SEP', inflow: 8100000, outflow: 5000000 },
    { month: 'OCT', inflow: 7600000, outflow: 4800000 },
    { month: 'NOV', inflow: 9200000, outflow: 5400000 },
    { month: 'DEC', inflow: 8800000, outflow: 5100000 },
  ])

  const animRef = useRef<number | null>(null)
  const lastTick = useRef(performance.now())

  useEffect(() => {
    const tick = (time: number) => {
      if (time - lastTick.current > 3000) {
        lastTick.current = time
        setDataStream(prev => {
          const updated = prev.map(p => ({
            ...p,
            inflow: Math.max(1000000, p.inflow + (Math.random() - 0.48) * 300000),
            outflow: Math.max(1000000, p.outflow + (Math.random() - 0.52) * 200000),
          }))
          return updated
        })
      }
      animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [])

  const maxVal = Math.max(...dataStream.map(d => Math.max(d.inflow, d.outflow))) * 1.1 || 1
  const width = 600
  const height = 180
  const padding = { top: 12, bottom: 28, left: 0, right: 0 }
  const chartH = height - padding.top - padding.bottom
  const chartW = width

  const inflowCoords = dataStream.map((d, i) => {
    const x = (i / (dataStream.length - 1)) * chartW
    const y = padding.top + chartH - (d.inflow / maxVal) * chartH
    return { x: +x.toFixed(1), y: +y.toFixed(1) }
  })

  const outflowCoords = dataStream.map((d, i) => {
    const x = (i / (dataStream.length - 1)) * chartW
    const y = padding.top + chartH - (d.outflow / maxVal) * chartH
    return { x: +x.toFixed(1), y: +y.toFixed(1) }
  })

  const inflowPath = `M ${inflowCoords.map(c => `${c.x},${c.y}`).join(' L ')}`
  const outflowPath = `M ${outflowCoords.map(c => `${c.x},${c.y}`).join(' L ')}`

  const gridLines = [0.25, 0.5, 0.75].map(ratio => {
    const y = padding.top + chartH * (1 - ratio)
    return y.toFixed(1)
  })

  const latestInflow = inflowCoords[inflowCoords.length - 1]
  const latestOutflow = outflowCoords[outflowCoords.length - 1]

  return (
    <div className="ableton-cashflow">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {gridLines.map((y, i) => (
          <line
            key={i}
            x1="0"
            y1={y}
            x2={width}
            y2={y}
            className="ableton-cashflow__gridline"
          />
        ))}
        <path
          d={inflowPath}
          fill="none"
          stroke="#000000"
          strokeWidth="1.5"
          strokeLinecap="square"
          strokeLinejoin="miter"
          className="ableton-draw-line"
        />
        <path
          d={outflowPath}
          fill="none"
          stroke="#000000"
          strokeWidth="1.5"
          strokeDasharray="6,4"
          strokeLinecap="square"
          strokeLinejoin="miter"
          className="ableton-draw-line"
          opacity="0.4"
        />
        <circle cx={latestInflow.x} cy={latestInflow.y} r="3" fill="#000000" />
        <circle cx={latestOutflow.x} cy={latestOutflow.y} r="3" fill="#000000" opacity="0.4" />
        {dataStream.map((d, i) => {
          const x = (i / (dataStream.length - 1)) * chartW
          return (
            <text
              key={d.month}
              x={x}
              y={height - 6}
              className="ableton-cashflow__label"
              textAnchor="middle"
              fontSize="9"
            >
              {d.month}
            </text>
          )
        })}
      </svg>
      <div style={{ display: 'flex', gap: 24, marginTop: 8, fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 16, height: 1.5, background: '#000000', display: 'inline-block' }} />
          <span style={{ opacity: 0.5 }}>Inflow</span>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 16, height: 1.5, background: '#000000', display: 'inline-block', opacity: 0.4 }} />
          <span style={{ opacity: 0.5 }}>Outflow</span>
        </span>
      </div>
    </div>
  )
}

export default function AbletonDashboard() {
  const [outstandingAmount, setOutstandingAmount] = useState(12540000)
  const [collectedAmount, setCollectedAmount] = useState(8920000)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [docFilter, setDocFilter] = useState('All')
  const touchStartXRef = useRef(0)
  const touchEndXRef = useRef(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const inc1 = Math.floor(Math.random() * 45000)
      const inc2 = Math.floor(Math.random() * 25000)
      setCollectedAmount(prev => prev + inc1)
      setOutstandingAmount(prev => Math.max(0, prev - inc2))
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
      setCurrentSlideIndex(prev => (prev + 1) % notificationsList.length)
    } else if (distance < -minSwipeDistance) {
      setCurrentSlideIndex(prev => (prev - 1 + notificationsList.length) % notificationsList.length)
    }
    touchStartXRef.current = 0
    touchEndXRef.current = 0
  }

  const dueThisWeek = 3240000
  const overdueAmount = 1180000
  const overdueCount = 6

  const filteredDocs = docFilter === 'All'
    ? documents
    : documents.filter(d => d.type === docFilter)

  return (
    <div className="ableton-workspace">
      {/* Drawer overlay */}
      <div
        className={`ableton-drawer-overlay ${isDrawerOpen ? 'ableton-drawer-overlay--open' : ''}`}
        onClick={toggleDrawer}
      />
      <nav className={`ableton-drawer ${isDrawerOpen ? 'ableton-drawer--open' : ''}`}>
        <div className="ableton-drawer__header">
          <span className="ableton-drawer__title">Modules</span>
          <button className="ableton-drawer__close" onClick={toggleDrawer}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="square">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <ul className="ableton-drawer__nav">
          {['Dashboard', 'Invoices', 'Quotations', 'CSR Logs', 'Waybills', 'Correspondence', 'Settings'].map(item => (
            <li
              key={item}
              className={`ableton-drawer__nav-item ${item === 'Dashboard' ? 'ableton-drawer__nav-item--active' : ''}`}
              onClick={() => { setIsDrawerOpen(false); showToast(`Opened ${item}`) }}
            >
              {item}
            </li>
          ))}
        </ul>
      </nav>

      {/* Top Nav */}
      <header className="ableton-nav">
        <div className="ableton-nav__inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={toggleDrawer}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
              aria-label="Open menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="square">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <span className="ableton-nav__brand">BIGDROPS</span>
          </div>
          <ul className="ableton-nav__links">
            <li onClick={() => showToast('Dashboard view')}>Dashboard</li>
            <li onClick={() => showToast('Invoices module')}>Invoices</li>
            <li onClick={() => showToast('Quotations module')}>Quotations</li>
            <li onClick={() => showToast('Reports view')}>Reports</li>
          </ul>
          <div className="ableton-nav__actions">
            <button className="ableton-nav__btn" onClick={() => showToast('Search initiated')}>
              Search
            </button>
            <button className="ableton-nav__btn--primary ableton-nav__btn" onClick={() => showToast('New document created')}>
              + New
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="ableton-hero">
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=1600"
          alt="Abstract studio workspace"
          className="ableton-hero__img"
        />
        <div className="ableton-hero__scrim" />
        <div className="ableton-hero__content">
          <h1 className="ableton-hero__title">BIGDROPS</h1>
          <p className="ableton-hero__subtitle">Invoice management workspace — {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="ableton-shell">
        {/* KPI Section */}
        <section className="ableton-section">
          <div className="ableton-section__header">
            <h2 className="ableton-section__title">Financial Overview</h2>
            <div className="ableton-section__filters">
              <button className="ableton-section__filter ableton-section__filter--active">This Month</button>
              <button className="ableton-section__filter" onClick={() => showToast('Quarterly view')}>Quarter</button>
              <button className="ableton-section__filter" onClick={() => showToast('Yearly view')}>Year</button>
            </div>
          </div>
          <div className="ableton-kpi-grid">
            <div className="ableton-kpi-card">
              <div className="ableton-kpi-card__label">Outstanding</div>
              <div className="ableton-kpi-card__value">{formatNaira(outstandingAmount)}</div>
              <div className="ableton-kpi-card__delta">48 Invoices Active</div>
              <div className="ableton-kpi-card__spark">
                <LiveSparkline baseValue={outstandingAmount} volatility={80000} />
              </div>
            </div>
            <div className="ableton-kpi-card">
              <div className="ableton-kpi-card__label">Due This Week</div>
              <div className="ableton-kpi-card__value">{formatNaira(dueThisWeek)}</div>
              <div className="ableton-kpi-card__delta">9 Action Needed</div>
              <div className="ableton-kpi-card__spark">
                <LiveSparkline baseValue={dueThisWeek} volatility={40000} />
              </div>
            </div>
            <div className="ableton-kpi-card">
              <div className="ableton-kpi-card__label">Payments Recv.</div>
              <div className="ableton-kpi-card__value">{formatNaira(collectedAmount)}</div>
              <div className="ableton-kpi-card__delta">+14% vs last month</div>
              <div className="ableton-kpi-card__spark">
                <LiveSparkline baseValue={collectedAmount} volatility={60000} />
              </div>
            </div>
            <div className="ableton-kpi-card">
              <div className="ableton-kpi-card__label">Overdue</div>
              <div className="ableton-kpi-card__value">{formatNaira(overdueAmount)}</div>
              <div className="ableton-kpi-card__delta">{overdueCount} Overdue</div>
              <div className="ableton-kpi-card__spark">
                <LiveSparkline baseValue={overdueAmount} volatility={30000} />
              </div>
            </div>
          </div>
        </section>

        {/* Cash Flow Forecast */}
        <section className="ableton-section">
          <div className="ableton-section__header">
            <h2 className="ableton-section__title">Cash Flow Forecast</h2>
            <div className="ableton-section__filters">
              <button className="ableton-section__filter ableton-section__filter--active">12 Months</button>
              <button className="ableton-section__filter" onClick={() => showToast('6-month view')}>6 Months</button>
            </div>
          </div>
          <CashFlowForecast />
        </section>

        {/* Notifications */}
        <section className="ableton-section">
          <div className="ableton-section__header">
            <h2 className="ableton-section__title">Notifications</h2>
            <div className="ableton-section__filters">
              <button className="ableton-section__filter ableton-section__filter--active">All</button>
              <button className="ableton-section__filter" onClick={() => showToast('Invoices only')}>Invoices</button>
              <button className="ableton-section__filter" onClick={() => showToast('Quotations only')}>Quotations</button>
            </div>
          </div>
          <div
            className="ableton-notifications"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="ableton-notifications__track"
              style={{ transform: `translateX(-${currentSlideIndex * 100}%)` }}
            >
              {notificationsList.map((n, i) => (
                <div className="ableton-notification-slide" key={i}>
                  <div className="ableton-notification-slide__top">
                    <span className={`ableton-tag ableton-tag--${n.type.toLowerCase()}`}>
                      {n.type}
                    </span>
                    <span className="ableton-notification-slide__ref">{n.ref}</span>
                    <span className="ableton-notification-slide__time">{n.time}</span>
                  </div>
                  <div className="ableton-notification-slide__client">{n.client}</div>
                  <div className="ableton-notification-slide__desc">{n.desc}</div>
                  <div className="ableton-notification-slide__bottom">
                    <span className="ableton-notification-slide__amount">{n.amount}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 12 }}>
              {notificationsList.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlideIndex(i)}
                  style={{
                    width: i === currentSlideIndex ? 24 : 6,
                    height: 6,
                    background: i === currentSlideIndex ? '#000000' : '#eeeeee',
                    border: 'none',
                    borderRadius: 0,
                    cursor: 'pointer',
                    transition: 'all 0.25s',
                  }}
                  aria-label={`Go to notification ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Documents */}
        <section className="ableton-section">
          <div className="ableton-section__header">
            <h2 className="ableton-section__title">Documents</h2>
            <div className="ableton-section__filters">
              {['All', 'Invoice', 'Quotation', 'CSR Log', 'Waybill (Ext)', 'Correspondence', 'RFQ'].map(f => (
                <button
                  key={f}
                  className={`ableton-section__filter ${docFilter === f ? 'ableton-section__filter--active' : ''}`}
                  onClick={() => setDocFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="ableton-doclist">
            <div style={{ display: 'grid', gridTemplateColumns: '100px 130px 1fr 140px 110px 90px', padding: '8px 0', borderBottom: '1px solid #000000' }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.4 }}>Type</span>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.4 }}>Ref</span>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.4 }}>Client</span>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.4 }}>Amount</span>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.4 }}>Date</span>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.4 }}>Status</span>
            </div>
            {filteredDocs.map((doc, i) => (
              <div
                key={i}
                className="ableton-doclist__row"
                onClick={() => showToast(`Opened ${doc.ref}`)}
              >
                <span className="ableton-doclist__cell">
                  <span className={`ableton-tag ableton-tag--${doc.type.toLowerCase().replace(/[^a-z]/g, '')}`}>
                    {doc.type}
                  </span>
                </span>
                <span className="ableton-doclist__cell ableton-doclist__cell--ref">{doc.ref}</span>
                <span className="ableton-doclist__cell">{doc.client}</span>
                <span className="ableton-doclist__cell ableton-doclist__cell--amount">{doc.amount}</span>
                <span className="ableton-doclist__cell">{doc.date}</span>
                <span className="ableton-doclist__cell ableton-doclist__cell--status">{doc.status}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Activity Feed */}
        <section className="ableton-section" style={{ paddingBottom: 120 }}>
          <div className="ableton-section__header">
            <h2 className="ableton-section__title">Activity</h2>
          </div>
          <ul className="ableton-feed">
            {activityFeed.map((item, i) => (
              <li key={i} className="ableton-feed__item">
                <span className="ableton-feed__time">{item.time}</span>
                <span
                  className="ableton-feed__text"
                  dangerouslySetInnerHTML={{ __html: item.text }}
                />
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Bottom Nav */}
      <nav className="ableton-bottom-nav">
        <ul className="ableton-bottom-nav__links">
          <li className="active">Dashboard</li>
          <li onClick={() => showToast('Invoices module')}>Invoices</li>
          <li onClick={() => showToast('Quotations module')}>Quotations</li>
          <li onClick={() => showToast('Reports view')}>Reports</li>
          <li onClick={() => showToast('Settings view')}>Settings</li>
        </ul>
      </nav>

      {/* Toast */}
      <div className={`ableton-toast ${toastMessage ? 'ableton-toast--visible' : ''}`}>
        {toastMessage}
      </div>
    </div>
  )
}

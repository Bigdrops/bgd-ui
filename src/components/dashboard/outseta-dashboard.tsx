import { useState, useEffect, useRef, useCallback } from 'react';
import './outseta-dashboard.css';

interface Notification {
  id: number;
  icon: string;
  message: string;
  time: string;
  type: 'info' | 'warning' | 'success';
}

interface KPIData {
  label: string;
  value: string;
  subtitle: string;
  percentage: number;
  color: string;
}

interface DocumentItem {
  id: number;
  type: string;
  number: string;
  client: string;
  amount: string;
  date: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
}

interface ActivityItem {
  id: number;
  icon: string;
  action: string;
  target: string;
  time: string;
  user: string;
}

interface CashFlowData {
  month: string;
  expected: number;
  collected: number;
}

const notifications: Notification[] = [
  { id: 1, icon: '💰', message: 'Payment of ₦2.4M received from Acme Corp', time: '2m ago', type: 'success' },
  { id: 2, icon: '⚠️', message: 'Invoice #INV-2024-089 due tomorrow', time: '15m ago', type: 'warning' },
  { id: 3, icon: '📄', message: 'New estimate approved by TechStart Ltd', time: '1h ago', type: 'info' },
  { id: 4, icon: '🎯', message: 'Monthly target reached: ₦8.5M collected', time: '2h ago', type: 'success' },
  { id: 5, icon: '🔔', message: '3 invoices overdue by more than 30 days', time: '3h ago', type: 'warning' },
  { id: 6, icon: '✅', message: 'Recurring invoice generated for CloudBase', time: '5h ago', type: 'info' },
];

const kpis: KPIData[] = [
  { label: 'Outstanding', value: '₦12.54M', subtitle: '48 Invoices Active', percentage: 72, color: 'var(--outseta-fuchsia)' },
  { label: 'Due This Week', value: '₦3.24M', subtitle: '9 Action Needed', percentage: 28, color: '#f59e0b' },
  { label: 'Payments Recv.', value: '₦8.92M', subtitle: '+14% vs last month', percentage: 65, color: '#10b981' },
  { label: 'Overdue', value: '₦1.18M', subtitle: '6 Overdue', percentage: 12, color: '#ef4444' },
];

const documents: DocumentItem[] = [
  { id: 1, type: 'Invoice', number: 'INV-2024-092', client: 'Acme Corporation', amount: '₦2,450,000', date: 'Today', status: 'sent' },
  { id: 2, type: 'Estimate', number: 'EST-2024-045', client: 'TechStart Ltd', amount: '₦890,000', date: 'Today', status: 'draft' },
  { id: 3, type: 'Invoice', number: 'INV-2024-091', client: 'CloudBase Solutions', amount: '₦1,200,000', date: 'Yesterday', status: 'paid' },
  { id: 4, type: 'Invoice', number: 'INV-2024-090', client: 'DataFlow Inc', amount: '₦3,100,000', date: 'Yesterday', status: 'overdue' },
  { id: 5, type: 'Credit', number: 'CRD-2024-012', client: 'GreenTech Labs', amount: '₦450,000', date: '2 days ago', status: 'paid' },
  { id: 6, type: 'Invoice', number: 'INV-2024-089', client: 'Nexus Digital', amount: '₦1,780,000', date: '2 days ago', status: 'sent' },
];

const activities: ActivityItem[] = [
  { id: 1, icon: '✏️', action: 'Edited', target: 'Invoice #INV-2024-092', time: '10 minutes ago', user: 'You' },
  { id: 2, icon: '📧', action: 'Sent', target: 'Estimate #EST-2024-045', time: '1 hour ago', user: 'You' },
  { id: 3, icon: '✅', action: 'Marked paid', target: 'Invoice #INV-2024-091', time: '3 hours ago', user: 'System' },
  { id: 4, icon: '🔄', action: 'Recurring created', target: 'Invoice #INV-2024-093', time: '5 hours ago', user: 'Scheduler' },
];

const cashFlowData: CashFlowData[] = [
  { month: 'Jan', expected: 8.2, collected: 7.1 },
  { month: 'Feb', expected: 9.1, collected: 8.5 },
  { month: 'Mar', expected: 7.8, collected: 6.9 },
  { month: 'Apr', expected: 10.2, collected: 9.8 },
  { month: 'May', expected: 11.5, collected: 10.2 },
  { month: 'Jun', expected: 9.8, collected: 8.9 },
];

const tenants = [
  { id: 1, name: 'BIGDROPS Inc', color: '#df37a7' },
  { id: 2, name: 'TechVentures Ltd', color: '#8b5cf6' },
  { id: 3, name: 'DataCorp Africa', color: '#06b6d4' },
];

const navItems = [
  { icon: '📊', label: 'Dashboard', active: true },
  { icon: '📄', label: 'Invoices', active: false },
  { icon: '👥', label: 'Clients', active: false },
  { icon: '📈', label: 'Reports', active: false },
  { icon: '⚙️', label: 'Settings', active: false },
];

export default function OutsetaDashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTenant, setActiveTenant] = useState(tenants[0]);
  const [showTenantDropdown, setShowTenantDropdown] = useState(false);
  const [showNavDrawer, setShowNavDrawer] = useState(false);
  const [activeNotification, setActiveNotification] = useState(0);
  const [toasts, setToasts] = useState<{ id: number; message: string; type: string }[]>([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveNotification((prev) => (prev + 1) % notifications.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const showToast = useCallback((message: string, type: string = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    if (Math.abs(swipeDistance) > 50) {
      if (swipeDistance > 0) {
        setActiveNotification((prev) => (prev + 1) % notifications.length);
      } else {
        setActiveNotification((prev) => (prev - 1 + notifications.length) % notifications.length);
      }
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    showToast(`${!darkMode ? 'Dark' : 'Light'} mode activated`, 'info');
  };

  const RingChart = ({ percentage, color, size = 80, strokeWidth = 8 }: { percentage: number; color: string; size?: number; strokeWidth?: number }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <svg width={size} height={size} className="outseta-ring-chart">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--outseta-border)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="outseta-ring-progress"
        />
      </svg>
    );
  };

  const CashFlowBar = ({ data, maxValue }: { data: CashFlowData; maxValue: number }) => {
    const expectedHeight = (data.expected / maxValue) * 100;
    const collectedHeight = (data.collected / maxValue) * 100;

    return (
      <div className="outseta-cashflow-bar-group">
        <div className="outseta-cashflow-bars">
          <div
            className="outseta-cashflow-bar outseta-cashflow-expected"
            style={{ height: `${expectedHeight}%` }}
          />
          <div
            className="outseta-cashflow-bar outseta-cashflow-collected"
            style={{ height: `${collectedHeight}%` }}
          />
        </div>
        <span className="outseta-cashflow-label">{data.month}</span>
      </div>
    );
  };

  return (
    <div className="outseta-dashboard" data-theme={darkMode ? 'dark' : 'light'}>
      <header className="outseta-header">
        <div className="outseta-header-left">
          <button className="outseta-menu-btn" onClick={() => setShowNavDrawer(true)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className="outseta-brand">
            <h1 className="outseta-logo">BIGDROPS</h1>
            <span className="outseta-live-badge">LIVE</span>
          </div>
        </div>
        <div className="outseta-header-right">
          <button className={`outseta-icon-btn ${searchFocused ? 'active' : ''}`} onClick={() => setSearchFocused(!searchFocused)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
          <button className="outseta-icon-btn outseta-notification-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="outseta-notification-dot"></span>
          </button>
          <button className="outseta-theme-toggle" onClick={toggleTheme}>
            <span className={`outseta-theme-thumb ${darkMode ? 'dark' : 'light'}`}></span>
            <svg className="outseta-sun-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
            <svg className="outseta-moon-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>
        </div>
      </header>

      <div className="outseta-search-bar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input type="text" placeholder="Search invoices, clients, or amounts..." />
      </div>

      <div className="outseta-tenant-section">
        <button className="outseta-tenant-btn" onClick={() => setShowTenantDropdown(!showTenantDropdown)}>
          <span className="outseta-tenant-avatar" style={{ background: activeTenant.color }}>
            {activeTenant.name.charAt(0)}
          </span>
          <span className="outseta-tenant-name">{activeTenant.name}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        {showTenantDropdown && (
          <div className="outseta-tenant-dropdown">
            {tenants.map((tenant) => (
              <button
                key={tenant.id}
                className={`outseta-tenant-option ${tenant.id === activeTenant.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveTenant(tenant);
                  setShowTenantDropdown(false);
                  showToast(`Switched to ${tenant.name}`, 'success');
                }}
              >
                <span className="outseta-tenant-avatar" style={{ background: tenant.color }}>
                  {tenant.name.charAt(0)}
                </span>
                <span>{tenant.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <section className="outseta-hero-gradient">
        <div className="outseta-hero-content">
          <span className="outseta-eyebrow">OVERVIEW</span>
          <h2 className="outseta-hero-title">Financial Snapshot</h2>
          <p className="outseta-hero-subtitle">Your business at a glance</p>
        </div>
      </section>

      <section className="outseta-notifications">
        <div
          className="outseta-notification-carousel"
          ref={notificationRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {notifications.map((notif, index) => (
            <div
              key={notif.id}
              className={`outseta-notification-card ${index === activeNotification ? 'active' : ''} ${notif.type}`}
            >
              <span className="outseta-notif-icon">{notif.icon}</span>
              <div className="outseta-notif-content">
                <p className="outseta-notif-message">{notif.message}</p>
                <span className="outseta-notif-time">{notif.time}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="outseta-pagination-dots">
          {notifications.map((_, index) => (
            <button
              key={index}
              className={`outseta-dot ${index === activeNotification ? 'active' : ''}`}
              onClick={() => setActiveNotification(index)}
            />
          ))}
        </div>
      </section>

      <section className="outseta-kpi-section">
        <div className="outseta-kpi-grid">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="outseta-kpi-card">
              <div className="outseta-kpi-chart">
                <RingChart percentage={kpi.percentage} color={kpi.color} />
                <span className="outseta-kpi-percentage">{kpi.percentage}%</span>
              </div>
              <div className="outseta-kpi-info">
                <span className="outseta-kpi-label">{kpi.label}</span>
                <span className="outseta-kpi-value">{kpi.value}</span>
                <span className="outseta-kpi-subtitle">{kpi.subtitle}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="outseta-cashflow-section">
        <div className="outseta-section-header">
          <div>
            <span className="outseta-eyebrow">FORECAST</span>
            <h3 className="outseta-section-title">Cash Flow Forecast</h3>
          </div>
        </div>
        <div className="outseta-cashflow-chart">
          {cashFlowData.map((data) => (
            <CashFlowBar key={data.month} data={data} maxValue={12} />
          ))}
        </div>
        <div className="outseta-cashflow-segment">
          <div className="outseta-segment-bar">
            <div className="outseta-segment expected" style={{ width: '55%' }}></div>
            <div className="outseta-segment collected" style={{ width: '45%' }}></div>
          </div>
          <div className="outseta-segment-legend">
            <span className="outseta-legend-item">
              <span className="outseta-legend-dot expected"></span>
              Expected: ₦56.6M
            </span>
            <span className="outseta-legend-item">
              <span className="outseta-legend-dot collected"></span>
              Collected: ₦51.4M
            </span>
            <span className="outseta-legend-item">
              <span className="outseta-legend-dot rate"></span>
              Collection Rate: 90.8%
            </span>
          </div>
        </div>
      </section>

      <section className="outseta-documents-section">
        <div className="outseta-section-header">
          <div>
            <span className="outseta-eyebrow">DOCUMENTS</span>
            <h3 className="outseta-section-title">Recently Created</h3>
          </div>
          <button className="outseta-view-all-btn">View All</button>
        </div>
        <div className="outseta-documents-list">
          {documents.map((doc) => (
            <div key={doc.id} className="outseta-document-card">
              <div className="outseta-doc-icon">
                {doc.type === 'Invoice' ? '📄' : doc.type === 'Estimate' ? '📋' : '💱'}
              </div>
              <div className="outseta-doc-info">
                <div className="outseta-doc-header">
                  <span className="outseta-doc-type">{doc.type}</span>
                  <span className={`outseta-doc-status ${doc.status}`}>{doc.status}</span>
                </div>
                <span className="outseta-doc-number">{doc.number}</span>
                <span className="outseta-doc-client">{doc.client}</span>
              </div>
              <div className="outseta-doc-amount">
                <span className="outseta-doc-value">{doc.amount}</span>
                <span className="outseta-doc-date">{doc.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="outseta-activity-section">
        <div className="outseta-section-header">
          <div>
            <span className="outseta-eyebrow">HISTORY</span>
            <h3 className="outseta-section-title">Recent Activity</h3>
          </div>
        </div>
        <div className="outseta-activity-list">
          {activities.map((activity) => (
            <div key={activity.id} className="outseta-activity-item">
              <span className="outseta-activity-icon">{activity.icon}</span>
              <div className="outseta-activity-content">
                <p className="outseta-activity-text">
                  <strong>{activity.user}</strong> {activity.action} <span className="outseta-activity-target">{activity.target}</span>
                </p>
                <span className="outseta-activity-time">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <button className="outseta-fab" onClick={() => showToast('Quick action menu coming soon!', 'info')}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>

      <nav className="outseta-bottom-nav">
        {navItems.map((item) => (
          <button key={item.label} className={`outseta-nav-item ${item.active ? 'active' : ''}`}>
            <span className="outseta-nav-icon">{item.icon}</span>
            <span className="outseta-nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="outseta-home-indicator"></div>

      {showNavDrawer && (
        <>
          <div className="outseta-drawer-overlay" onClick={() => setShowNavDrawer(false)} />
          <div className="outseta-nav-drawer">
            <div className="outseta-drawer-header">
              <span className="outseta-tenant-avatar large" style={{ background: activeTenant.color }}>
                {activeTenant.name.charAt(0)}
              </span>
              <div className="outseta-drawer-tenant-info">
                <h3>{activeTenant.name}</h3>
                <span>Admin Access</span>
              </div>
            </div>
            <div className="outseta-drawer-nav">
              {navItems.map((item) => (
                <button key={item.label} className={`outseta-drawer-nav-item ${item.active ? 'active' : ''}`}>
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
            <div className="outseta-drawer-footer">
              <button className="outseta-drawer-logout">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}

      <div className="outseta-toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`outseta-toast ${toast.type}`}>
            <span className="outseta-toast-icon">
              {toast.type === 'success' ? '✓' : toast.type === 'warning' ? '⚠' : 'ℹ'}
            </span>
            <span className="outseta-toast-message">{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

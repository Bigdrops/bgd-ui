import { Menu, X } from 'lucide-react'
import { useState } from 'react'

interface TopBarProps {
  onToggleTheme?: () => void
  themeIsDark?: boolean
  onNavigate?: (page: string) => void
  currentPage?: string
}

export function TopBar({ onToggleTheme, themeIsDark, onNavigate, currentPage }: TopBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <nav className="mp-nav" id="mp-nav">
        <a href="/" className="mp-brand">
          <span className="mp-brand-icon">□△</span>
          BGD UI
        </a>

        <div className="mp-nav-links">
          <a
            href="#workspaces"
            className={`mp-nav-link ${currentPage === 'workspaces' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); onNavigate?.('workspaces') }}
          >
            Gallery
          </a>
        </div>

        <div className="mp-nav-actions">
          <a href="#workspaces" className="btn-ghost" onClick={(e) => { e.preventDefault(); onNavigate?.('workspaces') }}>
            Explore
          </a>
          <button
            className="mp-hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99,
          background: 'rgba(0, 0, 0, 0.3)',
          opacity: mobileMenuOpen ? 1 : 0,
          pointerEvents: mobileMenuOpen ? 'auto' : 'none',
          transition: 'opacity 0.35s ease',
        }}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Menu */}
      <nav
        id="mp-mobile-menu"
        aria-label="Mobile navigation"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '100%',
          maxWidth: 340,
          height: '100vh',
          zIndex: 100,
          background: 'var(--mp-surface-canvas)',
          borderLeft: '1px solid var(--mp-color-smoke)',
          transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
          padding: '2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--mp-space-4)',
          overflowY: 'auto',
        }}
      >
        <button
          className="btn-ghost"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close navigation menu"
          style={{ position: 'absolute', top: '1rem', right: '1rem', minWidth: 44, minHeight: 44 }}
        >
          <X size={18} />
        </button>

        <div style={{ marginTop: 'var(--mp-space-48)', display: 'flex', flexDirection: 'column', gap: 'var(--mp-space-4)' }}>
          <a
            href="#workspaces"
            className="mp-nav-link"
            style={{ fontSize: 20, padding: '14px 0', borderBottom: '1px solid var(--mp-color-smoke)', display: 'block' }}
            onClick={(e) => { e.preventDefault(); onNavigate?.('workspaces'); setMobileMenuOpen(false) }}
          >
            Gallery
          </a>
          <hr style={{ border: 'none', borderTop: '1px solid var(--mp-color-smoke)', margin: 'var(--mp-space-12) 0' }} />
          <div style={{ marginTop: 'var(--mp-space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--mp-space-8)' }}>
            <a
              href="#workspaces"
              className="btn-electric"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={(e) => { e.preventDefault(); onNavigate?.('workspaces'); setMobileMenuOpen(false) }}
            >
              Explore
            </a>
          </div>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 'var(--mp-space-16)', borderTop: '1px solid var(--mp-color-smoke)', fontFamily: 'var(--mp-font-display)', fontSize: 16, color: 'var(--mp-color-ash)' }}>
          <span>BGD UI Shell</span>
          <span style={{ display: 'block', marginTop: 4, opacity: 0.5 }}>v2.1 · 2026</span>
        </div>
      </nav>
    </>
  )
}

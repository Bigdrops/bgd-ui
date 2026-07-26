import { ArrowRight } from 'lucide-react'

interface HeroProps {
  onNavigateToShell?: () => void
}

export function Hero({ onNavigateToShell }: HeroProps) {
  return (
    <section className="mp-hero">
      <div className="mp-container">
        <div className="mp-hero-inner" style={{ gridTemplateColumns: '1fr' }}>
          <div className="mp-hero-content" style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', alignItems: 'center' }}>
            <div className="mp-hero-eyebrow">
              <span className="dot" />
              v1.0.0 — Now in Public Beta
            </div>

            <h1>
              Invoice workspaces built with{' '}
              <span className="highlight">Moving Parts</span>
            </h1>

            <p style={{
              fontFamily: 'var(--mp-font-display)',
              fontSize: 18,
              lineHeight: 1.6,
              color: 'var(--mp-color-ash)',
              maxWidth: 520,
            }}>
              A gallery of independent invoice implementations. Each workspace
              uses a unique design language — no shared styles, no reused components.
            </p>

            <div className="mp-hero-actions" style={{ justifyContent: 'center' }}>
              <button className="btn-electric" onClick={onNavigateToShell}>
                Browse Workspaces
                <ArrowRight size={18} />
              </button>
              <button className="btn-ghost" onClick={onNavigateToShell}>
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

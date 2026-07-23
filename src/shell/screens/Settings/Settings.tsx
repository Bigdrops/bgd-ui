import { ArrowLeft } from 'lucide-react'

interface SettingsProps {
  workspaceCount: number
  onBack: () => void
}

export function Settings({ workspaceCount, onBack }: SettingsProps) {
  return (
    <div className="mp-section" style={{ paddingTop: 0 }}>
      <button
        type="button"
        className="btn-ghost"
        onClick={onBack}
        style={{ marginBottom: 'var(--mp-space-16)' }}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="mp-section-label">
        <h2>Settings</h2>
      </div>

      <div style={{
        border: '1px solid var(--mp-color-smoke)',
        borderRadius: 'var(--mp-radius-cards)',
        overflow: 'hidden',
      }}>
        <Row label="Workspaces" value={String(workspaceCount)} />
        <Divider />
        <Row label="Version" value="0.1.0" />
        <Divider />
        <Row label="Product" value="BGD Invoice Workspaces" />
      </div>

      <p style={{
        marginTop: 'var(--mp-space-24)',
        fontFamily: 'var(--mp-font-display)',
        fontSize: 16,
        color: 'var(--mp-color-ash)',
        textAlign: 'center',
      }}>
        BGD UI · Offline-first mobile UI library
      </p>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 'var(--mp-space-12) var(--mp-space-16)',
      fontFamily: 'var(--mp-font-display)',
      fontSize: 16,
    }}>
      <span style={{ color: 'var(--mp-color-onyx)' }}>
        {label}
      </span>
      <span style={{ color: 'var(--mp-color-ash)' }}>
        {value}
      </span>
    </div>
  )
}

function Divider() {
  return <div style={{ height: 1, background: 'var(--mp-color-smoke)', margin: '0 var(--mp-space-16)' }} />
}

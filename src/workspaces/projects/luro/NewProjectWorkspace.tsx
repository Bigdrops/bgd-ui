import { useState, useEffect, useRef, type ChangeEvent } from 'react'
import {
  Plus, X, Save, Building2, MapPin, Hash, Calendar, FileText, DollarSign, Check, ChevronDown,
} from 'lucide-react'
import './index.css'

const token = {
  bg: '#10020a',
  card: '#1e0313',
  cardInner: '#f2f2f2',
  text: '#ffffff',
  textSoft: 'rgba(255,255,255,0.7)',
  textMuted: 'rgba(255,255,255,0.6)',
  accent: '#ff0068',
  border: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.12)',
  glow: 'rgba(255,0,104,0.54) 0px 0px 33px 0px, rgba(255,0,104,0.4) 0px 0px 99px -21px',
  glowSm: 'rgba(255,0,104,0.36) 0px 0px 40px 0px',
}

const fontBody = "'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
const fontMono = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"

const clients = [
  { id: 'c1', name: 'Dangote Cement' },
  { id: 'c2', name: 'Beta Construction' },
  { id: 'c3', name: 'Gamma Industries' },
  { id: 'c4', name: 'Shell Petroleum' },
]

function GlowCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={`mb-4 ${className}`}
      style={{
        background: token.card,
        borderRadius: 24,
        padding: 24,
        boxShadow: token.glow,
      }}
    >
      {children}
    </section>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 w-full min-w-0">
      <label
        className="text-[10px] font-medium uppercase tracking-widest"
        style={{ fontFamily: fontBody, color: token.textMuted, letterSpacing: '0.12em' }}
      >
        {label}{required && <span style={{ color: token.accent }}> *</span>}
      </label>
      {children}
    </div>
  )
}

function TextInput({
  value, onChange, placeholder, type = 'text', autoFocus,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; autoFocus?: boolean
}) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      type={type} value={value} autoFocus={autoFocus}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      placeholder={placeholder}
      className="w-full px-4 py-3 text-[14px] outline-none transition-colors"
      style={{
        fontFamily: fontBody,
        borderRadius: 12,
        border: `1px solid ${focused ? token.accent : token.borderStrong}`,
        color: token.text,
        background: 'rgba(255,255,255,0.03)',
        letterSpacing: '-0.012em',
        boxShadow: focused ? token.glowSm : 'none',
      }}
    />
  )
}

function TextArea({
  value, onChange, placeholder,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string
}) {
  const [focused, setFocused] = useState(false)
  return (
    <textarea
      value={value} rows={4}
      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      placeholder={placeholder}
      className="w-full px-4 py-3 text-[14px] outline-none resize-y transition-colors"
      style={{
        fontFamily: fontBody,
        borderRadius: 12,
        border: `1px solid ${focused ? token.accent : token.borderStrong}`,
        color: token.text,
        background: 'rgba(255,255,255,0.03)',
        letterSpacing: '-0.012em',
        minHeight: 96,
        boxShadow: focused ? token.glowSm : 'none',
      }}
    />
  )
}

function Select({
  value, onChange, options,
}: {
  value: string; onChange: (v: string) => void; options: { value: string; label: string }[]
}) {
  const [focused, setFocused] = useState(false)
  return (
    <select
      value={value}
      onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      className="w-full px-4 py-3 text-[14px] outline-none appearance-none"
      style={{
        fontFamily: fontBody,
        borderRadius: 12,
        border: `1px solid ${focused ? token.accent : token.borderStrong}`,
        color: token.text,
        background: 'rgba(255,255,255,0.03)',
        letterSpacing: '-0.012em',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23ffffff\' opacity=\'0.5\' d=\'M6 8L1 3h10z\'/%3E%3C/svg%3E")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 16px center',
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} style={{ background: token.card, color: token.text }}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

function GhostButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      className="inline-flex items-center justify-center gap-2 px-5 py-3 text-[12px] font-medium uppercase tracking-widest transition-all"
      style={{
        fontFamily: fontBody,
        borderRadius: 180,
        border: `1px solid ${hover ? token.text : token.borderStrong}`,
        color: hover ? token.text : token.textMuted,
        background: 'transparent',
        letterSpacing: '0.08em',
      }}
    >
      {children}
    </button>
  )
}

function PrimaryButton({ children, onClick, full, loading }: { children: React.ReactNode; onClick?: () => void; full?: boolean; loading?: boolean }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      disabled={loading}
      className={`inline-flex items-center justify-center gap-2 text-[12px] font-medium uppercase tracking-widest transition-all ${full ? 'w-full' : ''}`}
      style={{
        fontFamily: fontBody,
        borderRadius: 180,
        padding: '14px 28px',
        background: hover ? '#cc0055' : token.accent,
        color: token.text,
        border: 'none',
        letterSpacing: '0.08em',
        boxShadow: hover ? token.glow : 'none',
        opacity: loading ? 0.6 : 1,
        cursor: loading ? 'not-allowed' : 'pointer',
      }}
    >
      {loading ? 'Creating...' : children}
    </button>
  )
}

export default function NewProjectWorkspace() {
  const [form, setForm] = useState({
    name: '',
    clientId: '',
    clientName: '',
    startDate: new Date().toISOString().split('T')[0],
    projectValue: '',
    location: '',
    poNumber: '',
    status: 'active',
    notes: '',
  })
  const [showClients, setShowClients] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const showToast = (msg: string) => {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 2500)
  }

  const set = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSave = () => {
    if (!form.name.trim()) {
      showToast('Project name is required')
      return
    }
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      showToast(`Project "${form.name}" created`)
    }, 1200)
  }

  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    return () => { document.head.removeChild(link) }
  }, [])

  return (
    <div style={{ background: token.bg, minHeight: '100vh', fontFamily: fontBody }} className="pb-32">
      <div className="max-w-xl mx-auto px-4 pt-6 sm:px-6 sm:pt-8">
        <div className="text-center mb-6">
          <h1
            className="text-[28px] font-bold leading-[1.0] tracking-tight"
            style={{ fontFamily: fontBody, color: token.text, letterSpacing: '-0.046em' }}
          >
            New Project
          </h1>
          <p
            className="text-[13px] mt-2"
            style={{ fontFamily: fontBody, color: token.textMuted, letterSpacing: '-0.012em' }}
          >
            Create a project tree for a job or contract
          </p>
        </div>

        <GlowCard>
          <div className="flex flex-col gap-4">
            <Field label="Project Name" required>
              <TextInput
                value={form.name}
                onChange={(v) => set('name', v)}
                placeholder="e.g. Transformer Maintenance – Dangote Cement"
                autoFocus
              />
            </Field>

            <Field label="Client">
              <div className="relative">
                <button
                  onClick={() => setShowClients(!showClients)}
                  className="w-full px-4 py-3 text-[14px] text-left flex items-center gap-3 transition-colors"
                  style={{
                    fontFamily: fontBody,
                    borderRadius: 12,
                    border: `1px solid ${token.borderStrong}`,
                    color: form.clientId ? token.text : token.textMuted,
                    background: 'rgba(255,255,255,0.03)',
                    letterSpacing: '-0.012em',
                  }}
                >
                  <Building2 size={15} style={{ color: token.textMuted }} />
                  <span className="flex-1">{form.clientName || 'Select client...'}</span>
                  <ChevronDown size={14} style={{ color: token.textMuted, transition: 'transform 0.2s', transform: showClients ? 'rotate(180deg)' : 'none' }} />
                </button>
                {showClients && (
                  <div
                    className="absolute left-0 right-0 top-full mt-1 z-10 overflow-hidden"
                    style={{ borderRadius: 12, border: `1px solid ${token.borderStrong}`, background: token.card, boxShadow: token.glow }}
                  >
                    {clients.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => { set('clientId', c.id); set('clientName', c.name); setShowClients(false) }}
                        className="w-full px-4 py-2.5 text-left text-[13px] flex items-center gap-3 transition-colors hover:bg-white/5"
                        style={{ color: form.clientId === c.id ? token.accent : token.text }}
                      >
                        <Building2 size={14} style={{ color: form.clientId === c.id ? token.accent : token.textMuted }} />
                        {c.name}
                        {form.clientId === c.id && <Check size={13} style={{ color: token.accent }} className="ml-auto" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Start Date">
                <TextInput type="date" value={form.startDate} onChange={(v) => set('startDate', v)} />
              </Field>
              <Field label="Project Value">
                <div className="relative">
                  <span
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px]"
                    style={{ color: token.textMuted, letterSpacing: '-0.012em' }}
                  >₦</span>
                  <TextInput
                    value={form.projectValue}
                    onChange={(v) => set('projectValue', v)}
                    placeholder="Optional"
                  />
                </div>
              </Field>
            </div>

            <Field label="Site / Location">
              <TextInput
                value={form.location}
                onChange={(v) => set('location', v)}
                placeholder="e.g. Block B, Dangote Cement Plant, Ibese"
              />
            </Field>

            <Field label="P.O. Number">
              <TextInput
                value={form.poNumber}
                onChange={(v) => set('poNumber', v)}
                placeholder="Optional — can be added later"
              />
            </Field>

            <Field label="Status">
              <Select
                value={form.status}
                onChange={(v) => set('status', v)}
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'on_hold', label: 'On Hold' },
                  { value: 'cancelled', label: 'Cancelled' },
                ]}
              />
            </Field>

            <Field label="Notes">
              <TextArea
                value={form.notes}
                onChange={(v) => set('notes', v)}
                placeholder="Optional internal notes about this project"
              />
            </Field>
          </div>
        </GlowCard>

        <div className="flex gap-3 mt-2">
          <GhostButton onClick={() => showToast('Changes discarded')}>Cancel</GhostButton>
          <div className="flex-1" />
          <PrimaryButton onClick={handleSave} loading={saving}>
            <Plus size={14} /> Create Project
          </PrimaryButton>
        </div>
      </div>

      <button
        onClick={handleSave}
        aria-label="Create project"
        className="fixed bottom-6 right-5 z-50 flex items-center justify-center"
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: token.accent,
          color: token.text,
          border: 'none',
          boxShadow: token.glow,
        }}
      >
        <Plus size={24} />
      </button>

      <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[60] pointer-events-none w-[calc(100%-32px)] max-w-sm">
        <div
          className="rounded-[12px] px-5 py-3 text-[12px] font-medium text-center uppercase tracking-widest transition-all duration-300"
          style={{
            fontFamily: fontBody,
            background: token.card,
            color: token.text,
            border: `1px solid ${token.borderStrong}`,
            boxShadow: token.glow,
            letterSpacing: '0.08em',
            opacity: toast ? 1 : 0,
            transform: toast ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
          }}
        >
          {toast}
        </div>
      </div>
    </div>
  )
}

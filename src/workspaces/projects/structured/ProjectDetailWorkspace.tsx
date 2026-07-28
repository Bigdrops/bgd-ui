import { useState, useEffect, useRef, type ChangeEvent } from 'react'
import {
  FolderKanban, Building2, MapPin, Hash, Calendar, DollarSign,
  ChevronRight, Pencil, X, Check, Save, FileText, Receipt,
  ClipboardList, Truck, Plus, Copy,
} from 'lucide-react'
import './index.css'

const token = {
  bg: '#c4c3b6',
  card: '#e7e5e4',
  cardLight: '#ebebeb',
  ink: '#000000',
  inkSoft: '#595855',
  inkMuted: '#808080',
  border: '#dfdcd5',
  white: '#ffffff',
  emerald: '#065f46',
  emeraldLight: '#d1fae5',
  amber: '#b45309',
  amberLight: '#fef3c7',
  red: '#dc2626',
  blue: '#1d4ed8',
  blueLight: '#dbeafe',
  purple: '#6b21a8',
  purpleLight: '#f3e8ff',
}

const fontBody = "'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
const fontDisplay = "'Playfair Display', ui-serif, Georgia, serif"
const fontMono = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"

const sampleProject = {
  id: 'prj-001',
  name: 'Transformer Maintenance – Dangote Cement',
  code: 'PRJ-2026-042',
  clientName: 'Dangote Cement Plc',
  location: 'Block B, Dangote Cement Plant, Ibese',
  poNumber: 'PO-2026-8812',
  startDate: '2026-03-15',
  projectValue: 18450000,
  status: 'active',
  notes: 'Regular maintenance contract. Quarterly inspections required. Contact: Eng. Adeyemi at site.',
}

const sampleFinancials = {
  totalInvoiced: 12450000,
  cashCollected: 8230000,
  whtCollected: 249000,
  outstanding: 4220000,
  invoiceCount: 12,
}

const timeline = [
  { id: 't1', type: 'invoice', label: 'Invoice INV-2026-0421', desc: '₦2,400,000', date: '2026-07-20', status: 'Paid' },
  { id: 't2', type: 'payment', label: 'Payment Received', desc: '₦1,200,000', date: '2026-07-15', status: 'Completed' },
  { id: 't3', type: 'csr', label: 'CSR CSR-2026-018', desc: 'Site inspection report', date: '2026-07-10', status: 'Approved' },
  { id: 't4', type: 'invoice', label: 'Invoice INV-2026-0398', desc: '₦850,000', date: '2026-07-05', status: 'Pending' },
  { id: 't5', type: 'waybill', label: 'Waybill WB-2026-112', desc: 'Equipment delivery', date: '2026-06-28', status: 'Delivered' },
  { id: 't6', type: 'quotation', label: 'Quotation QOT-2026-055', desc: '₦3,200,000', date: '2026-06-20', status: 'Accepted' },
]

const commercialDocs = [
  { id: 'd1', type: 'invoice', number: 'INV-2026-0421', title: 'Q2 Maintenance – Phase 3', date: '2026-07-20', amount: 2400000, status: 'Paid', balance: 0 },
  { id: 'd2', type: 'invoice', number: 'INV-2026-0398', title: 'Transformer Parts Replacement', date: '2026-07-05', amount: 850000, status: 'Pending', balance: 850000 },
  { id: 'd3', type: 'quotation', number: 'QOT-2026-055', title: 'Annual Maintenance Renewal', date: '2026-06-20', amount: 3200000, status: 'Accepted' },
  { id: 'd4', type: 'invoice', number: 'INV-2026-0350', title: 'Emergency Repairs – Unit 4', date: '2026-06-10', amount: 1800000, status: 'Overdue', balance: 1800000 },
]

const externalDocs = [
  { id: 'e1', type: 'PO', label: 'Purchase Order – PO-2026-8812', summary: 'Maintenance supplies & equipment', date: '2026-03-10' },
  { id: 'e2', type: 'Receipt', label: 'Advance Payment Receipt', summary: '₦500,000 advance for mobilization', date: '2026-03-12' },
]

function PillBadge({ label, variant = 'default' }: { label: string; variant?: 'default' | 'emerald' | 'amber' | 'red' | 'blue' | 'purple' }) {
  const colors: Record<string, { bg: string; text: string }> = {
    default: { bg: token.cardLight, text: token.inkSoft },
    emerald: { bg: token.emeraldLight, text: token.emerald },
    amber: { bg: token.amberLight, text: token.amber },
    red: { bg: '#fee2e2', text: token.red },
    blue: { bg: token.blueLight, text: token.blue },
    purple: { bg: token.purpleLight, text: token.purple },
  }
  const c = colors[variant]
  return (
    <span
      className="inline-block text-[10px] font-medium uppercase tracking-wider px-[9px] py-[4px] leading-none rounded-full"
      style={{ fontFamily: fontMono, background: c.bg, color: c.text }}
    >
      {label}
    </span>
  )
}

function DetailCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={`mb-3 ${className}`}
      style={{
        background: token.card,
        border: 'none',
        borderRadius: 9,
        overflow: 'hidden',
      }}
    >
      {children}
    </section>
  )
}

function StatCard({ label, value, accentColor, valueColor }: { label: string; value: string; accentColor: string; valueColor?: string }) {
  return (
    <div
      className="flex flex-col gap-0.5 px-4 py-3"
      style={{
        background: token.card,
        borderRadius: 9,
        borderLeft: `4px solid ${accentColor}`,
      }}
    >
      <span
        className="text-[10px] font-semibold uppercase tracking-wider"
        style={{ fontFamily: fontBody, color: token.inkSoft }}
      >
        {label}
      </span>
      <span
        className="text-[22px] font-extrabold leading-tight"
        style={{ fontFamily: fontBody, color: valueColor || token.ink, letterSpacing: '-0.01em' }}
      >
        {value}
      </span>
    </div>
  )
}

function SectionHeader({ title, count, action }: { title: string; count?: number; action?: React.ReactNode }) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3"
      style={{ borderBottom: `1px solid ${token.border}` }}
    >
      <div className="flex items-center gap-2">
        <span
          className="text-[15px] font-medium"
          style={{ fontFamily: fontDisplay, color: token.ink, letterSpacing: '-0.01em' }}
        >
          {title}
        </span>
        {count !== undefined && (
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{ fontFamily: fontMono, background: token.cardLight, color: token.inkSoft }}
          >
            {count}
          </span>
        )}
      </div>
      {action}
    </div>
  )
}

function DetailRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2" style={{ borderBottom: `1px solid ${token.border}` }}>
      <Icon size={15} style={{ color: token.inkSoft, flexShrink: 0 }} />
      <span className="text-[12px]" style={{ fontFamily: fontBody, color: token.inkSoft, letterSpacing: '-0.01em' }}>
        {label}:
      </span>
      <span className="text-[13px] font-medium" style={{ fontFamily: fontBody, color: token.ink, letterSpacing: '-0.01em' }}>
        {value}
      </span>
    </div>
  )
}

function EditField({ label, value, onChange, type = 'text', placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[9px] font-semibold uppercase tracking-widest" style={{ fontFamily: fontBody, color: token.inkSoft }}>
        {label}
      </label>
      <input
        type={type} value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-1.5 text-[13px] outline-none"
        style={{
          fontFamily: fontBody,
          borderRadius: 9,
          border: `1px solid ${token.border}`,
          color: token.ink,
          background: token.white,
          letterSpacing: '-0.01em',
        }}
      />
    </div>
  )
}

function GhostButton({ children, onClick, small }: { children: React.ReactNode; onClick?: () => void; small?: boolean }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      className={`inline-flex items-center justify-center gap-1.5 font-medium transition-colors ${small ? 'text-[10px] px-2.5 py-1' : 'text-[11px] px-4 py-2'}`}
      style={{
        fontFamily: fontBody,
        borderRadius: 28.8,
        border: `1px solid ${hover ? token.ink : token.border}`,
        color: token.ink,
        background: hover ? token.cardLight : 'transparent',
        letterSpacing: '-0.01em',
      }}
    >
      {children}
    </button>
  )
}

function PrimaryButton({ children, onClick, full }: { children: React.ReactNode; onClick?: () => void; full?: boolean }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all ${full ? 'w-full' : ''}`}
      style={{
        fontFamily: fontBody,
        borderRadius: 28.8,
        background: hover ? '#1a1a1a' : token.ink,
        color: token.white,
        padding: '10px 20px',
        fontSize: 12,
        letterSpacing: '-0.01em',
        border: 'none',
      }}
    >
      {children}
    </button>
  )
}

function formatCurrency(val: number): string {
  return `₦${val.toLocaleString()}`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getStatusVariant(status: string): 'emerald' | 'amber' | 'red' | 'blue' | 'purple' | 'default' {
  const map: Record<string, 'emerald' | 'amber' | 'red' | 'blue' | 'purple' | 'default'> = {
    active: 'emerald', Paid: 'emerald', Completed: 'emerald', Approved: 'emerald', Delivered: 'emerald', Accepted: 'emerald',
    pending: 'amber', Pending: 'amber', on_hold: 'amber',
    overdue: 'red', Overdue: 'red', cancelled: 'red',
  }
  return map[status] || 'default'
}

function typeIcon(type: string) {
  switch (type) {
    case 'invoice': return Receipt
    case 'quotation': return FileText
    case 'csr': return ClipboardList
    case 'waybill': return Truck
    case 'payment': return DollarSign
    default: return FileText
  }
}

function typeColor(type: string) {
  switch (type) {
    case 'invoice': return token.blueLight
    case 'quotation': return token.purpleLight
    case 'csr': return token.emeraldLight
    case 'waybill': return token.amberLight
    default: return token.cardLight
  }
}

function typeIconColor(type: string) {
  switch (type) {
    case 'invoice': return token.blue
    case 'quotation': return token.purple
    case 'csr': return token.emerald
    case 'waybill': return token.amber
    default: return token.inkSoft
  }
}

export default function ProjectDetailWorkspace() {
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ ...sampleProject })
  const [toast, setToast] = useState('')
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const showToast = (msg: string) => {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 2000)
  }

  const startEdit = () => {
    setEditForm({ ...sampleProject })
    setEditing(true)
  }

  const cancelEdit = () => {
    setEditing(false)
    showToast('Edit cancelled')
  }

  const saveEdit = () => {
    Object.assign(sampleProject, editForm)
    setEditing(false)
    showToast('Project updated')
  }

  const copyCode = () => {
    navigator.clipboard.writeText(sampleProject.code).then(
      () => showToast('Project code copied'),
      () => showToast('Copy failed'),
    )
  }

  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    return () => { document.head.removeChild(link) }
  }, [])

  const p = sampleProject
  const f = sampleFinancials

  return (
    <div style={{ background: token.bg, minHeight: '100vh', fontFamily: fontBody }} className="pb-28">
      <div className="max-w-3xl mx-auto px-3 pt-4 sm:px-5 sm:pt-6">
        {/* HEADER — VIEW MODE */}
        <DetailCard>
          <div
            className="px-4 py-4 flex flex-col gap-0.5"
            style={{ borderLeft: '4px solid #065f46' }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-9 h-9 rounded-[9px] flex items-center justify-center shrink-0"
                  style={{ background: token.emeraldLight, color: token.emerald }}
                >
                  <FolderKanban size={17} />
                </div>
                <h1
                  className="text-[20px] font-extrabold leading-tight"
                  style={{ fontFamily: fontBody, color: token.ink, letterSpacing: '-0.01em' }}
                >
                  {p.name}
                </h1>
              </div>
              {!editing && (
                <button
                  onClick={startEdit}
                  className="flex items-center gap-1.5 shrink-0"
                  style={{
                    fontFamily: fontBody, fontSize: 11, fontWeight: 500,
                    borderRadius: 28.8, border: `1px solid ${token.border}`,
                    padding: '6px 12px', color: token.emerald, background: token.emeraldLight,
                    letterSpacing: '-0.01em',
                  }}
                >
                  <Pencil size={12} /> Edit
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <PillBadge label={p.status === 'active' ? 'Active' : p.status} variant={getStatusVariant(p.status)} />
              {p.code && (
                <button
                  onClick={copyCode}
                  className="inline-flex items-center gap-1 text-[10px] font-mono tracking-wider"
                  style={{ fontFamily: fontMono, color: token.inkSoft, border: `1px solid ${token.border}`, borderRadius: 9999, padding: '3px 8px', background: token.white }}
                >
                  <Copy size={10} /> {p.code}
                </button>
              )}
            </div>

            {!editing && (
              <div className="mt-1 flex flex-col">
                <DetailRow icon={Building2} label="Client" value={p.clientName} />
                <DetailRow icon={MapPin} label="Location" value={p.location} />
                <DetailRow icon={Hash} label="PO" value={p.poNumber} />
                <DetailRow icon={Calendar} label="Started" value={formatDate(p.startDate)} />
                <DetailRow icon={DollarSign} label="Value" value={formatCurrency(p.projectValue)} />
                {p.notes && (
                  <div className="px-4 py-2 text-[12px] italic" style={{ color: token.inkSoft, borderBottom: `1px solid ${token.border}` }}>
                    {p.notes}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* HEADER — EDIT MODE */}
          {editing && (
            <div className="px-4 pb-4 pt-2 flex flex-col gap-2.5" style={{ background: token.cardLight, borderTop: `1px solid ${token.border}` }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="md:col-span-2">
                  <EditField label="Project Name" value={editForm.name} onChange={(v) => setEditForm((prev) => ({ ...prev, name: v }))} />
                </div>
                <EditField label="Status" value={editForm.status} onChange={(v) => setEditForm((prev) => ({ ...prev, status: v }))} />
                <EditField label="Start Date" type="date" value={editForm.startDate} onChange={(v) => setEditForm((prev) => ({ ...prev, startDate: v }))} />
                <EditField label="Project Value (₦)" value={String(editForm.projectValue)} onChange={(v) => setEditForm((prev) => ({ ...prev, projectValue: Number(v) || 0 }))} />
                <EditField label="P.O. Number" value={editForm.poNumber} onChange={(v) => setEditForm((prev) => ({ ...prev, poNumber: v }))} />
                <div className="md:col-span-2">
                  <EditField label="Site / Location" value={editForm.location} onChange={(v) => setEditForm((prev) => ({ ...prev, location: v }))} />
                </div>
                <div className="md:col-span-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-semibold uppercase tracking-widest" style={{ fontFamily: fontBody, color: token.inkSoft }}>Notes</label>
                    <textarea
                      value={editForm.notes} rows={3}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setEditForm((prev) => ({ ...prev, notes: e.target.value }))}
                      className="w-full px-3 py-1.5 text-[13px] outline-none resize-y"
                      style={{ fontFamily: fontBody, borderRadius: 9, border: `1px solid ${token.border}`, color: token.ink, background: token.white, minHeight: 72, letterSpacing: '-0.01em' }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-1">
                <GhostButton onClick={cancelEdit}><X size={12} /> Cancel</GhostButton>
                <PrimaryButton onClick={saveEdit}><Save size={12} /> Save Changes</PrimaryButton>
              </div>
            </div>
          )}
        </DetailCard>

        {/* STATS */}
        <DetailCard>
          <SectionHeader title="Financial Overview" />
          <div className="grid grid-cols-2 gap-2 p-3">
            <StatCard label="Total Invoiced" value={formatCurrency(f.totalInvoiced)} accentColor={token.blue} />
            <StatCard label="Cash Collected" value={formatCurrency(f.cashCollected)} accentColor={token.emerald} valueColor={token.emerald} />
            <StatCard label="WHT Collected" value={formatCurrency(f.whtCollected)} accentColor={token.emerald} valueColor={token.emerald} />
            <StatCard label="Outstanding" value={formatCurrency(f.outstanding)} accentColor={f.outstanding > 0 ? token.red : token.ink} valueColor={f.outstanding > 0 ? token.red : token.ink} />
            <div className="col-span-2">
              <StatCard label="Invoice Count" value={String(f.invoiceCount)} accentColor={token.purple} />
            </div>
          </div>
        </DetailCard>

        {/* TIMELINE / OPERATING STREAM */}
        <DetailCard>
          <SectionHeader title="Latest Activity" count={timeline.length} />
          {timeline.length === 0 ? (
            <div className="px-4 py-6 text-center text-[12px]" style={{ color: token.inkMuted }}>
              No activity recorded yet for this project.
            </div>
          ) : (
            <div className="flex flex-col">
              {timeline.slice(0, 10).map((event) => {
                const Icon = typeIcon(event.type)
                return (
                  <div
                    key={event.id}
                    className="flex items-center gap-3 px-4 py-2.5"
                    style={{ borderBottom: `1px solid ${token.border}` }}
                  >
                    <div
                      className="w-8 h-8 rounded-[9px] flex items-center justify-center shrink-0"
                      style={{ background: typeColor(event.type) }}
                    >
                      <Icon size={14} style={{ color: typeIconColor(event.type) }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[12px] font-medium" style={{ fontFamily: fontBody, color: token.ink, letterSpacing: '-0.01em' }}>
                          {event.label}
                        </span>
                        <span className="text-[10px]" style={{ fontFamily: fontMono, color: token.inkMuted }}>
                          {event.desc}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px]" style={{ fontFamily: fontBody, color: token.inkMuted }}>
                          {formatDate(event.date)}
                        </span>
                        <PillBadge label={event.status} variant={getStatusVariant(event.status)} />
                      </div>
                    </div>
                    <ChevronRight size={14} style={{ color: token.inkMuted, flexShrink: 0 }} />
                  </div>
                )
              })}
            </div>
          )}
        </DetailCard>

        {/* COMMERCIAL DOCUMENTS */}
        <DetailCard>
          <SectionHeader
            title="Commercial"
            count={commercialDocs.length}
            action={
              <button
                className="flex items-center gap-1 text-[10px] font-medium"
                style={{ fontFamily: fontBody, color: token.emerald, letterSpacing: '-0.01em' }}
                onClick={() => showToast('Create document')}
              >
                <Plus size={12} /> New
              </button>
            }
          />
          {commercialDocs.length === 0 ? (
            <div className="px-4 py-6 text-center text-[12px]" style={{ color: token.inkMuted }}>
              No quotations or invoices yet.
            </div>
          ) : (
            <div className="flex flex-col">
              {commercialDocs.map((doc) => {
                const Icon = doc.type === 'invoice' ? Receipt : FileText
                const badgeVariant = doc.type === 'invoice' ? 'blue' : 'purple'
                const statusVariant = getStatusVariant(doc.status)
                return (
                  <div
                    key={doc.id}
                    className="flex items-center gap-3 px-4 py-3"
                    style={{ borderBottom: `1px solid ${token.border}` }}
                  >
                    <div
                      className="w-9 h-9 rounded-[9px] flex items-center justify-center shrink-0"
                      style={{ background: typeColor(doc.type) }}
                    >
                      <Icon size={15} style={{ color: typeIconColor(doc.type) }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[13px] font-medium" style={{ fontFamily: fontBody, color: token.ink, letterSpacing: '-0.01em' }}>
                          {doc.number}
                        </span>
                        <PillBadge label={doc.type === 'invoice' ? 'Invoice' : 'Quotation'} variant={badgeVariant} />
                        <PillBadge label={doc.status} variant={statusVariant} />
                      </div>
                      {doc.title && (
                        <div className="text-[11px] mt-0.5" style={{ fontFamily: fontBody, color: token.inkSoft, letterSpacing: '-0.01em' }}>
                          {doc.title}
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px]" style={{ fontFamily: fontBody, color: token.inkMuted }}>
                          {formatDate(doc.date)}
                        </span>
                        {'balance' in doc && (doc as any).balance > 0 && (
                          <span className="text-[10px] font-medium" style={{ fontFamily: fontMono, color: token.red }}>
                            Balance: {formatCurrency((doc as any).balance)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[13px] font-semibold" style={{ fontFamily: fontBody, color: doc.type === 'invoice' && 'balance' in doc && (doc as any).balance > 0 ? token.red : token.ink, letterSpacing: '-0.01em' }}>
                        {formatCurrency(doc.amount)}
                      </div>
                      {'balance' in doc && doc.balance === 0 && (
                        <div className="text-[9px] font-medium" style={{ fontFamily: fontMono, color: token.emerald }}>Paid</div>
                      )}
                    </div>
                    <ChevronRight size={14} style={{ color: token.inkMuted, flexShrink: 0 }} />
                  </div>
                )
              })}
            </div>
          )}
        </DetailCard>

        {/* EXTERNAL DOCUMENTS */}
        <DetailCard>
          <SectionHeader
            title="External Documents"
            count={externalDocs.length}
            action={
              <button
                className="flex items-center gap-1 text-[10px] font-medium"
                style={{ fontFamily: fontBody, color: token.emerald, letterSpacing: '-0.01em' }}
                onClick={() => showToast('Add external file')}
              >
                <Plus size={12} /> Add File
              </button>
            }
          />
          {externalDocs.length === 0 ? (
            <div
              className="mx-4 my-4 px-4 py-8 text-center text-[12px] rounded-[9px]"
              style={{ border: `1.5px dashed ${token.border}`, color: token.inkMuted }}
            >
              No external files yet. Add purchase orders or receipts.
            </div>
          ) : (
            <div className="flex flex-col">
              {externalDocs.map((doc) => {
                const typeVariant = doc.type === 'PO' ? 'blue' : doc.type === 'Receipt' ? 'emerald' : 'default'
                return (
                  <div
                    key={doc.id}
                    className="flex items-center gap-3 px-4 py-3"
                    style={{ borderBottom: `1px solid ${token.border}` }}
                  >
                    <div
                      className="w-9 h-9 rounded-[9px] flex items-center justify-center shrink-0"
                      style={{ background: typeColor(doc.type) }}
                    >
                      <FileText size={15} style={{ color: typeIconColor(doc.type) }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] font-medium" style={{ fontFamily: fontBody, color: token.ink, letterSpacing: '-0.01em' }}>
                          {doc.label}
                        </span>
                        <PillBadge label={doc.type} variant={typeVariant} />
                      </div>
                      <div className="text-[11px] mt-0.5" style={{ fontFamily: fontBody, color: token.inkSoft, letterSpacing: '-0.01em' }}>
                        {doc.summary}
                      </div>
                      <div className="text-[10px] mt-0.5" style={{ fontFamily: fontBody, color: token.inkMuted }}>
                        {formatDate(doc.date)}
                      </div>
                    </div>
                    <ChevronRight size={14} style={{ color: token.inkMuted, flexShrink: 0 }} />
                  </div>
                )
              })}
            </div>
          )}
        </DetailCard>

        {/* BOTTOM ACTION */}
        <div className="flex justify-center pt-2 pb-4">
          <GhostButton onClick={() => showToast('Project detail refreshed')}>
            Refresh Data
          </GhostButton>
        </div>
      </div>

      {/* TOAST */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] pointer-events-none w-[calc(100%-32px)] max-w-sm">
        <div
          className="rounded-[9px] px-5 py-2.5 text-[11px] font-medium text-center transition-all duration-300"
          style={{
            fontFamily: fontBody,
            background: token.ink,
            color: token.white,
            letterSpacing: '-0.01em',
            opacity: toast ? 1 : 0,
            transform: toast ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.95)',
          }}
        >
          {toast}
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

function Collapsible({ title, children, open: d = false }: { title: string; children: React.ReactNode; open?: boolean }) {
  const [open, setOpen] = useState(d)
  return (
    <div className="rw-collapsible">
      <button type="button" onClick={() => setOpen(!open)} style={{ width: '100%', textAlign: 'left', padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'transparent', border: 'none', fontWeight: 600, fontSize: '15px', color: '#261b07', fontFamily: 'inherit', userSelect: 'none' }}>
        <span>{title}</span>
        <ChevronDown size={14} style={{ color: '#8f897e', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>
      {open && <div style={{ padding: '0 16px 16px' }}>{children}</div>}
    </div>
  )
}

export function AdditionalInfo({ notes, terms, onUpdate }: { notes: string; terms: string; onUpdate: (v: { notes?: string; terms?: string }) => void }) {
  return (
    <Collapsible title="Additional Information">
      <div className="rw-field"><label className="rw-label">Notes</label><textarea value={notes} onChange={e => onUpdate({ notes: e.target.value })} placeholder="Thank you for your business..." className="rw-textarea" /></div>
      <div className="rw-field"><label className="rw-label">Terms & Conditions</label><textarea value={terms} onChange={e => onUpdate({ terms: e.target.value })} placeholder="Payment due within 30 days..." className="rw-textarea" /></div>
    </Collapsible>
  )
}

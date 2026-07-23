import { useState, useRef, useEffect } from 'react'
import { Check } from 'lucide-react'
import { CLIENTS } from './data'
import type { InvoiceData } from './types'
export function InvoiceHeader({ data, onUpdate }: { data: InvoiceData; onUpdate: (p: Partial<InvoiceData>) => void }) {
  const [clientOpen, setClientOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => { const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) { setClientOpen(false); setSearch('') } }; document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h) }, [])
  const filtered = CLIENTS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
  return (
    <div>
      <div className="nr-badge nr-badge-plum" style={{ marginBottom: '12px' }}>Invoice</div>
      <div className="nr-field"><label className="nr-label">Title <span style={{ color: '#6b7280' }}>(optional)</span></label><input type="text" value={data.title} onChange={e => onUpdate({ title: e.target.value })} placeholder="e.g. Design & Strategy" className="nr-input" /></div>
      <div className="nr-field" ref={ref}>
        <label className="nr-label">Client <span style={{ color: '#dc2626' }}>*</span></label>
        <div style={{ position: 'relative' }}>
          <input type="text" value={clientOpen ? search : (data.client?.name || '')} onChange={e => { setSearch(e.target.value); if (!clientOpen) setClientOpen(true) }} onFocus={() => setClientOpen(true)} placeholder="Search or type client name" className="nr-input" autoComplete="off" />
          {clientOpen && <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '24px', maxHeight: '200px', overflowY: 'auto', marginTop: '4px' }}>
            {filtered.map(c => <button key={c.id} type="button" onClick={() => { onUpdate({ client: c }); setClientOpen(false); setSearch('') }} style={{ width: '100%', textAlign: 'left', padding: '12px 18px', fontSize: '14px', background: data.client?.id === c.id ? '#f7f2ff' : 'transparent', border: 'none', cursor: 'pointer', color: '#2c232e', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #f7f2ff' }}><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 500 }}>{c.name}</div><div style={{ fontSize: '12px', color: '#6b7280' }}>{c.email}</div></div>{data.client?.id === c.id && <Check size={14} color="#beaaff" />}</button>)}
          </div>}
        </div>
      </div>
      <div className="nr-field-row">
        <div className="nr-field"><label className="nr-label">Document #</label><input type="text" value={data.invoiceNumber} onChange={e => onUpdate({ invoiceNumber: e.target.value })} className="nr-input" /></div>
        <div className="nr-field"><label className="nr-label">Reference</label><input type="text" value={data.referenceNumber} onChange={e => onUpdate({ referenceNumber: e.target.value })} placeholder="PO-12345" className="nr-input" /></div>
      </div>
      <div className="nr-field-row">
        <div className="nr-field"><label className="nr-label">Issue Date</label><input type="date" value={data.issueDate} onChange={e => onUpdate({ issueDate: e.target.value })} className="nr-input" /></div>
        <div className="nr-field"><label className="nr-label">Due Date</label><input type="date" value={data.dueDate} onChange={e => onUpdate({ dueDate: e.target.value })} className="nr-input" /></div>
      </div>
    </div>
  )
}

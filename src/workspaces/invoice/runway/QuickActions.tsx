import { useState, useRef, useEffect } from 'react'
import { MoreHorizontal, Save, Trash2 } from 'lucide-react'

export function QuickActions({ onSave, onClearAll }: { onSave: () => void; onClearAll: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => { const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }; document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h) }, [])
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button type="button" onClick={() => setOpen(!open)} style={{ width: '36px', height: '36px', padding: 0, border: '1.5px solid #e3dfd5', borderRadius: '8px', background: open ? '#261b07' : 'transparent', color: open ? '#fff' : '#261b07', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
        <MoreHorizontal size={14} />
      </button>
      {open && <div className="rw-menu" style={{ right: 0, top: '100%', marginTop: '8px' }}>
        <button type="button" className="rw-menu-item" onClick={() => { onSave(); setOpen(false) }}><Save size={12} /> Save</button>
        <button type="button" className="rw-menu-item" style={{ color: '#dc2626' }} onClick={() => { onClearAll(); setOpen(false) }}><Trash2 size={12} /> Clear All</button>
      </div>}
    </div>
  )
}

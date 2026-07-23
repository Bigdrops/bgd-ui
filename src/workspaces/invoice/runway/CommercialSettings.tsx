import { useState, useCallback } from 'react'
import { Plus, Trash2, ChevronDown } from 'lucide-react'
import { uid } from './data'
import type { CommercialSettings as CS, AdditionalCharge } from './types'

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

function Segment({ options, value, onChange }: { options: { value: string; label: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="rw-segment">
      {options.map(o => <button key={o.value} type="button" onClick={() => onChange(o.value)} className={`rw-seg-item ${value === o.value ? 'rw-seg-active' : ''}`}>{o.label}</button>)}
    </div>
  )
}

export function CommercialSettings({ settings, onUpdate }: { settings: CS; onUpdate: (s: CS) => void }) {
  const addCharge = useCallback(() => onUpdate({ ...settings, charges: [...settings.charges, { id: uid(), label: 'Charge', value: 0, taxable: false }] }), [settings])
  const updateCharge = useCallback((id: string, patch: Partial<AdditionalCharge>) => onUpdate({ ...settings, charges: settings.charges.map(c => c.id === id ? { ...c, ...patch } : c) }), [settings])
  const removeCharge = useCallback((id: string) => onUpdate({ ...settings, charges: settings.charges.filter(c => c.id !== id) }), [settings])

  return (
    <Collapsible title="Commercial Settings">
      <div className="rw-field">
        <label className="rw-label">Payment Terms</label>
        <select value={settings.paymentTerms} onChange={e => onUpdate({ ...settings, paymentTerms: e.target.value })} className="rw-select">
          <option value="">Select terms</option>
          {['Due on Receipt', 'Net 7', 'Net 14', 'Net 30', 'Net 60'].map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="rw-field">
        <div className="rw-toggle-wrap"><span className="rw-label" style={{ margin: 0 }}>Discount</span><button type="button" onClick={() => onUpdate({ ...settings, discount: { ...settings.discount, enabled: !settings.discount.enabled } })} className={`rw-switch ${settings.discount.enabled ? 'rw-switch-on' : ''}`} /></div>
        {settings.discount.enabled && <div style={{ marginTop: '10px' }}>
          <div className="rw-field-row">
            <div className="rw-field"><label className="rw-label">Value</label><input type="number" value={settings.discount.value || ''} onChange={e => onUpdate({ ...settings, discount: { ...settings.discount, value: parseFloat(e.target.value) || 0 } })} min="0" step="0.01" className="rw-input rw-input-compact" /></div>
            <div className="rw-field"><label className="rw-label">Type</label><Segment options={[{ value: 'percentage', label: '%' }, { value: 'flat', label: 'Flat' }]} value={settings.discount.type} onChange={v => onUpdate({ ...settings, discount: { ...settings.discount, type: v as 'percentage' | 'flat' } })} /></div>
          </div>
          <div className="rw-field" style={{ marginTop: '10px' }}><label className="rw-label">Timing</label><Segment options={[{ value: 'beforeTax', label: 'Before Tax' }, { value: 'afterTax', label: 'After Tax' }]} value={settings.discount.timing} onChange={v => onUpdate({ ...settings, discount: { ...settings.discount, timing: v as 'beforeTax' | 'afterTax' } })} /></div>
        </div>}
      </div>
      <div className="rw-field">
        <div className="rw-toggle-wrap"><span className="rw-label" style={{ margin: 0 }}>VAT</span><button type="button" onClick={() => onUpdate({ ...settings, vat: { ...settings.vat, enabled: !settings.vat.enabled } })} className={`rw-switch ${settings.vat.enabled ? 'rw-switch-on' : ''}`} /></div>
        {settings.vat.enabled && <div style={{ marginTop: '10px' }}><label className="rw-label">Rate (%)</label><input type="number" value={settings.vat.rate || ''} onChange={e => onUpdate({ ...settings, vat: { ...settings.vat, rate: parseFloat(e.target.value) || 0 } })} min="0" step="0.01" className="rw-input rw-input-compact" /></div>}
      </div>
      <div className="rw-field">
        <div className="rw-toggle-wrap"><span className="rw-label" style={{ margin: 0 }}>WHT</span><button type="button" onClick={() => onUpdate({ ...settings, wht: { ...settings.wht, enabled: !settings.wht.enabled } })} className={`rw-switch ${settings.wht.enabled ? 'rw-switch-on' : ''}`} /></div>
        {settings.wht.enabled && <div style={{ marginTop: '10px' }}><div className="rw-field-row"><div className="rw-field"><label className="rw-label">Rate</label><input type="number" value={settings.wht.rate || ''} onChange={e => onUpdate({ ...settings, wht: { ...settings.wht, rate: parseFloat(e.target.value) || 0 } })} min="0" step="0.01" className="rw-input rw-input-compact" /></div><div className="rw-field"><label className="rw-label">Unit</label><Segment options={[{ value: 'percentage', label: '%' }, { value: 'flat', label: 'Flat' }]} value={settings.wht.unit} onChange={v => onUpdate({ ...settings, wht: { ...settings.wht, unit: v as 'percentage' | 'flat' } })} /></div></div></div>}
      </div>
      <div className="rw-field">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}><span className="rw-label" style={{ margin: 0 }}>Additional Charges</span><button type="button" onClick={addCharge} className="rw-btn rw-btn-sm">+ Add</button></div>
        {settings.charges.map(c => (
          <div key={c.id} className="rw-charge-row">
            <input type="text" value={c.label} onChange={e => updateCharge(c.id, { label: e.target.value })} placeholder="Label" className="rw-input rw-input-compact" style={{ flex: 2, minWidth: '120px' }} />
            <input type="number" value={c.value || ''} onChange={e => updateCharge(c.id, { value: parseFloat(e.target.value) || 0 })} min="0" step="0.01" className="rw-input rw-input-compact" style={{ flex: 1, minWidth: '80px' }} />
            <span onClick={() => updateCharge(c.id, { taxable: !c.taxable })} className={`rw-charge-status ${c.taxable ? 'rw-charge-tax' : 'rw-charge-nontax'}`}>{c.taxable ? 'Taxable' : 'Non-taxable'}</span>
            <button type="button" onClick={() => removeCharge(c.id)} style={{ width: '36px', height: '36px', padding: 0, border: 'none', background: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8f897e', fontSize: '18px', flexShrink: 0 }}>&#10005;</button>
          </div>
        ))}
      </div>
    </Collapsible>
  )
}

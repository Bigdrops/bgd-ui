import { useState, useCallback } from 'react'
import { Plus, Trash2, Copy, ArrowUp, ArrowDown } from 'lucide-react'
import { uid, emptyItem, emptyGroup, UNITS } from './data'
import type { LineItem, LineGroup, InvoiceData, UnitType } from './types'
function ItemCard({ item, row, onPatch, onInsert, onUp, onDown, onDup, onDel }: { item: LineItem; row: number; onPatch: (p: Partial<LineItem>) => void; onInsert: () => void; onUp: () => void; onDown: () => void; onDup: () => void; onDel: () => void }) {
  const [subOpen, setSubOpen] = useState(false)
  const total = item.quantity * item.unitPrice
  return (
    <div className="nr-item">
      <span className="nr-item-num">#{item.number}</span>
      <div className="nr-field"><label className="nr-label">Description <span style={{ color: '#dc2626' }}>*</span></label><textarea value={item.description} onChange={e => onPatch({ description: e.target.value })} placeholder="Item description..." style={{ width: '100%', minHeight: '40px', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '9999px', fontSize: '14px', lineHeight: 1.5, resize: 'vertical', background: 'rgba(255,255,255,0.6)', color: '#2c232e', outline: 'none', fontFamily: 'inherit' }} /></div>
      {!subOpen && <span onClick={() => setSubOpen(true)} style={{ fontSize: '13px', color: '#beaaff', cursor: 'pointer', display: 'inline-block', marginTop: '2px', fontWeight: 500 }}>+ Add sub-description</span>}
      {subOpen && <div className="nr-field" style={{ marginTop: '8px' }}><textarea value={item.subDescription} onChange={e => onPatch({ subDescription: e.target.value })} placeholder="Sub-description..." style={{ width: '100%', minHeight: '40px', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '9999px', fontSize: '14px', lineHeight: 1.5, resize: 'vertical', background: 'rgba(255,255,255,0.6)', color: '#2c232e', outline: 'none', fontFamily: 'inherit' }} /></div>}
      <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
        <div className="nr-field" style={{ flex: 1 }}><label className="nr-label">Qty</label><input type="number" value={item.quantity || ''} onChange={e => onPatch({ quantity: parseFloat(e.target.value) || 0 })} placeholder="0" className="nr-input nr-input-compact" /></div>
        <div className="nr-field" style={{ flex: 1 }}><label className="nr-label">Unit</label><input type="text" value={item.unit} onChange={e => onPatch({ unit: e.target.value as UnitType })} placeholder="pcs" className="nr-input nr-input-compact" /></div>
        <div className="nr-field" style={{ flex: 1 }}><label className="nr-label">Unit Price</label><input type="number" value={item.unitPrice || ''} onChange={e => onPatch({ unitPrice: parseFloat(e.target.value) || 0 })} placeholder="0.00" className="nr-input nr-input-compact" /></div>
      </div>
      <div className="nr-item-total">{total.toLocaleString()}</div>
      <div className="nr-item-actions">
        <button type="button" onClick={onInsert} className="nr-btn nr-btn-sm">+ Insert</button>
        <button type="button" onClick={onUp} className="nr-btn nr-btn-sm">Up</button>
        <button type="button" onClick={onDown} className="nr-btn nr-btn-sm">Down</button>
        <button type="button" onClick={onDup} className="nr-btn nr-btn-sm">Duplicate</button>
        <button type="button" onClick={onDel} className="nr-btn nr-btn-sm nr-btn-danger">Delete</button>
      </div>
    </div>
  )
}
export function LineItemsSection({ data, onUpdate }: { data: InvoiceData; onUpdate: (p: Partial<InvoiceData>) => void }) {
  let rowC = 0
  const setGroups = (groups: LineGroup[]) => onUpdate({ groups })
  const setStandalone = (standaloneItems: LineItem[]) => onUpdate({ standaloneItems })
  const addStandalone = useCallback(() => { const n = data.standaloneItems.length + data.groups.reduce((s, g) => s + g.items.length, 0) + 1; setStandalone([...data.standaloneItems, emptyItem(n)]) }, [data])
  const addGroup = useCallback(() => setGroups([...data.groups, emptyGroup(data.groups.length)]), [data.groups])
  const updateItem = useCallback((list: 's' | 'g', gid: string | null, itemId: string, patch: Partial<LineItem>) => { if (list === 's') setStandalone(data.standaloneItems.map(i => i.id === itemId ? { ...i, ...patch } : i)); else setGroups(data.groups.map(g => g.id === gid ? { ...g, items: g.items.map(i => i.id === itemId ? { ...i, ...patch } : i) } : g)) }, [data])
  const removeItem = useCallback((list: 's' | 'g', gid: string | null, itemId: string) => { if (list === 's') setStandalone(data.standaloneItems.filter(i => i.id !== itemId)); else setGroups(data.groups.map(g => g.id === gid ? { ...g, items: g.items.filter(i => i.id !== itemId) } : g)) }, [data])
  const insertBelow = useCallback((list: 's' | 'g', gid: string | null, itemId: string) => { if (list === 's') { const idx = data.standaloneItems.findIndex(i => i.id === itemId); const items = [...data.standaloneItems]; items.splice(idx + 1, 0, emptyItem(idx + 2)); setStandalone(items) } else setGroups(data.groups.map(g => { if (g.id !== gid) return g; const idx = g.items.findIndex(i => i.id === itemId); const items = [...g.items]; items.splice(idx + 1, 0, emptyItem(idx + 2)); return { ...g, items } })) }, [data])
  const moveItem = useCallback((list: 's' | 'g', gid: string | null, itemId: string, dir: 'up' | 'down') => { const swap = (items: LineItem[]) => { const idx = items.findIndex(i => i.id === itemId); const ni = dir === 'up' ? idx - 1 : idx + 1; if (ni < 0 || ni >= items.length) return items; const a = [...items]; [a[idx], a[ni]] = [a[ni], a[idx]]; return a }; if (list === 's') setStandalone(swap(data.standaloneItems)); else setGroups(data.groups.map(g => g.id === gid ? { ...g, items: swap(g.items) } : g)) }, [data])
  const dupItem = useCallback((list: 's' | 'g', gid: string | null, itemId: string) => { const dup = (items: LineItem[]) => { const idx = items.findIndex(i => i.id === itemId); const d = { ...items[idx], id: uid() }; const a = [...items]; a.splice(idx + 1, 0, d); return a }; if (list === 's') setStandalone(dup(data.standaloneItems)); else setGroups(data.groups.map(g => g.id === gid ? { ...g, items: dup(g.items) } : g)) }, [data])
  const updateGroup = useCallback((gid: string, p: Partial<LineGroup>) => setGroups(data.groups.map(g => g.id === gid ? { ...g, ...p } : g)), [data.groups])
  const removeGroup = useCallback((gid: string) => { const g = data.groups.find(gr => gr.id === gid); if (g) { setStandalone([...data.standaloneItems, ...g.items]); setGroups(data.groups.filter(gr => gr.id !== gid)) } }, [data])
  const addItemToGroup = useCallback((gid: string) => setGroups(data.groups.map(g => g.id === gid ? { ...g, items: [...g.items, emptyItem(g.items.length + 1)] } : g)), [data.groups])
  const has = data.standaloneItems.length > 0 || data.groups.length > 0
  const renderCard = (item: LineItem, list: 's' | 'g', gid: string | null) => { rowC++; return <ItemCard key={item.id} item={item} row={rowC} onPatch={p => updateItem(list, gid, item.id, p)} onInsert={() => insertBelow(list, gid, item.id)} onUp={() => moveItem(list, gid, item.id, 'up')} onDown={() => moveItem(list, gid, item.id, 'down')} onDup={() => dupItem(list, gid, item.id)} onDel={() => removeItem(list, gid, item.id)} /> }
  return (
    <div>
      {!has && <div className="nr-card" style={{ padding: '48px 24px', textAlign: 'center' }}><div style={{ fontSize: '22px', fontWeight: 300, marginBottom: '8px', fontFamily: 'var(--font-serif)' }}>No items yet</div><p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>Add items or groups to start</p><div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}><button type="button" onClick={addStandalone} className="nr-btn nr-btn-primary">+ Add Row</button><button type="button" onClick={addGroup} className="nr-btn">+ Add Group</button></div></div>}
      {data.groups.length > 0 && <div>{data.groups.map(group => { const sub = group.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0); return (<div key={group.id} className="nr-group-card"><div className="nr-group-header"><input type="text" value={group.name} onChange={e => updateGroup(group.id, { name: e.target.value })} placeholder="Group name" className="nr-group-name" /><span className="nr-group-sub">{sub.toLocaleString()}</span><button type="button" onClick={() => removeGroup(group.id)} style={{ width: '36px', height: '36px', padding: 0, border: 'none', background: 'none', borderRadius: '9999px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontSize: '18px', flexShrink: 0 }}><Trash2 size={14} /></button></div>{group.items.map(item => renderCard(item, 'g', group.id))}<div className="nr-group-footer"><button type="button" onClick={() => addItemToGroup(group.id)} className="nr-btn nr-btn-sm">+ Add Item</button></div></div>) })}</div>}
      {data.standaloneItems.length > 0 && <div><div className="nr-section-label">Individual Items</div><div className="nr-group-card">{data.standaloneItems.map(item => renderCard(item, 's', null))}</div></div>}
      {has && <div className="nr-add-ctrl"><button type="button" onClick={addStandalone} className="nr-btn nr-btn-primary">+ Add Row</button><button type="button" onClick={addGroup} className="nr-btn">+ Add Group</button></div>}
    </div>
  )
}

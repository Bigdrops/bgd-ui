import { useState, useCallback } from 'react'
import { Plus, Trash2, Copy, ArrowUp, ArrowDown, CornerDownRight } from 'lucide-react'
import { uid, emptyItem, emptyGroup, UNITS } from './data'
import type { LineItem, LineGroup, InvoiceData, UnitType } from './types'

function ItemCard({ item, row, onPatch, onInsert, onUp, onDown, onDup, onDel }: {
  item: LineItem; row: number; onPatch: (p: Partial<LineItem>) => void; onInsert: () => void; onUp: () => void; onDown: () => void; onDup: () => void; onDel: () => void
}) {
  const [subOpen, setSubOpen] = useState(false)
  const total = item.quantity * item.unitPrice
  return (
    <div className="rw-item">
      <span className="rw-item-num">#{item.number}</span>
      <div className="rw-field">
        <label className="rw-label">Description <span style={{ color: '#dc2626' }}>*</span></label>
        <textarea value={item.description} onChange={e => onPatch({ description: e.target.value })} placeholder="Item description..."
          style={{ width: '100%', minHeight: '40px', padding: '8px 12px', border: '1.5px solid #e3dfd5', borderRadius: '8px', fontSize: '14px', lineHeight: 1.5, resize: 'vertical', background: '#fff', color: '#261b07', outline: 'none', fontFamily: 'inherit' }} />
      </div>
      {!subOpen && <span onClick={() => setSubOpen(true)} style={{ fontSize: '13px', color: '#f9a600', cursor: 'pointer', display: 'inline-block', marginTop: '2px' }}>+ Add sub-description</span>}
      {subOpen && <div className="rw-field" style={{ marginTop: '8px' }}>
        <textarea value={item.subDescription} onChange={e => onPatch({ subDescription: e.target.value })} placeholder="Sub-description..."
          style={{ width: '100%', minHeight: '40px', padding: '8px 12px', border: '1.5px solid #e3dfd5', borderRadius: '8px', fontSize: '14px', lineHeight: 1.5, resize: 'vertical', background: '#fff', color: '#261b07', outline: 'none', fontFamily: 'inherit' }} />
      </div>}
      <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
        <div className="rw-field" style={{ flex: 1 }}><label className="rw-label">Qty</label><input type="number" value={item.quantity || ''} onChange={e => onPatch({ quantity: parseFloat(e.target.value) || 0 })} placeholder="0" className="rw-input rw-input-compact" /></div>
        <div className="rw-field" style={{ flex: 1 }}><label className="rw-label">Unit</label><input type="text" value={item.unit} onChange={e => onPatch({ unit: e.target.value as UnitType })} placeholder="pcs" className="rw-input rw-input-compact" /></div>
        <div className="rw-field" style={{ flex: 1 }}><label className="rw-label">Unit Price</label><input type="number" value={item.unitPrice || ''} onChange={e => onPatch({ unitPrice: parseFloat(e.target.value) || 0 })} placeholder="0.00" className="rw-input rw-input-compact" /></div>
      </div>
      <div className="rw-item-total">{total.toLocaleString()}</div>
      <div className="rw-item-actions">
        <button type="button" onClick={onInsert} className="rw-btn rw-btn-sm">+ Insert</button>
        <button type="button" onClick={onUp} className="rw-btn rw-btn-sm">Up</button>
        <button type="button" onClick={onDown} className="rw-btn rw-btn-sm">Down</button>
        <button type="button" onClick={onDup} className="rw-btn rw-btn-sm">Duplicate</button>
        <button type="button" onClick={onDel} className="rw-btn rw-btn-sm rw-btn-danger">Delete</button>
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
  const updateItem = useCallback((list: 's' | 'g', gid: string | null, itemId: string, patch: Partial<LineItem>) => {
    if (list === 's') setStandalone(data.standaloneItems.map(i => i.id === itemId ? { ...i, ...patch } : i))
    else setGroups(data.groups.map(g => g.id === gid ? { ...g, items: g.items.map(i => i.id === itemId ? { ...i, ...patch } : i) } : g))
  }, [data])
  const removeItem = useCallback((list: 's' | 'g', gid: string | null, itemId: string) => {
    if (list === 's') setStandalone(data.standaloneItems.filter(i => i.id !== itemId))
    else setGroups(data.groups.map(g => g.id === gid ? { ...g, items: g.items.filter(i => i.id !== itemId) } : g))
  }, [data])
  const insertBelow = useCallback((list: 's' | 'g', gid: string | null, itemId: string) => {
    if (list === 's') { const idx = data.standaloneItems.findIndex(i => i.id === itemId); const items = [...data.standaloneItems]; items.splice(idx + 1, 0, emptyItem(idx + 2)); setStandalone(items) }
    else setGroups(data.groups.map(g => { if (g.id !== gid) return g; const idx = g.items.findIndex(i => i.id === itemId); const items = [...g.items]; items.splice(idx + 1, 0, emptyItem(idx + 2)); return { ...g, items } }))
  }, [data])
  const moveItem = useCallback((list: 's' | 'g', gid: string | null, itemId: string, dir: 'up' | 'down') => {
    const swap = (items: LineItem[]) => { const idx = items.findIndex(i => i.id === itemId); const ni = dir === 'up' ? idx - 1 : idx + 1; if (ni < 0 || ni >= items.length) return items; const a = [...items]; [a[idx], a[ni]] = [a[ni], a[idx]]; return a }
    if (list === 's') setStandalone(swap(data.standaloneItems))
    else setGroups(data.groups.map(g => g.id === gid ? { ...g, items: swap(g.items) } : g))
  }, [data])
  const dupItem = useCallback((list: 's' | 'g', gid: string | null, itemId: string) => {
    const dup = (items: LineItem[]) => { const idx = items.findIndex(i => i.id === itemId); const d = { ...items[idx], id: uid() }; const a = [...items]; a.splice(idx + 1, 0, d); return a }
    if (list === 's') setStandalone(dup(data.standaloneItems))
    else setGroups(data.groups.map(g => g.id === gid ? { ...g, items: dup(g.items) } : g))
  }, [data])
  const updateGroup = useCallback((gid: string, p: Partial<LineGroup>) => setGroups(data.groups.map(g => g.id === gid ? { ...g, ...p } : g)), [data.groups])
  const removeGroup = useCallback((gid: string) => { const g = data.groups.find(gr => gr.id === gid); if (g) { setStandalone([...data.standaloneItems, ...g.items]); setGroups(data.groups.filter(gr => gr.id !== gid)) } }, [data])
  const addItemToGroup = useCallback((gid: string) => setGroups(data.groups.map(g => g.id === gid ? { ...g, items: [...g.items, emptyItem(g.items.length + 1)] } : g)), [data.groups])
  const has = data.standaloneItems.length > 0 || data.groups.length > 0
  const renderCard = (item: LineItem, list: 's' | 'g', gid: string | null) => { rowC++; return <ItemCard key={item.id} item={item} row={rowC} onPatch={p => updateItem(list, gid, item.id, p)} onInsert={() => insertBelow(list, gid, item.id)} onUp={() => moveItem(list, gid, item.id, 'up')} onDown={() => moveItem(list, gid, item.id, 'down')} onDup={() => dupItem(list, gid, item.id)} onDel={() => removeItem(list, gid, item.id)} /> }

  return (
    <div>
      {!has && <div className="rw-card" style={{ padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>No items yet</div>
        <p style={{ fontSize: '14px', color: '#8f897e', marginBottom: '20px' }}>Add items or groups to start</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button type="button" onClick={addStandalone} className="rw-btn rw-btn-primary">+ Add Row</button>
          <button type="button" onClick={addGroup} className="rw-btn">+ Add Group</button>
        </div>
      </div>}
      {data.groups.length > 0 && <div>{data.groups.map(group => {
        const sub = group.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0)
        return (
          <div key={group.id} className="rw-group-card">
            <div className="rw-group-header">
              <input type="text" value={group.name} onChange={e => updateGroup(group.id, { name: e.target.value })} placeholder="Group name" className="rw-group-name" />
              <span className="rw-group-sub">{sub.toLocaleString()}</span>
              <button type="button" onClick={() => removeGroup(group.id)} style={{ width: '36px', height: '36px', padding: 0, border: 'none', background: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8f897e', fontSize: '18px', flexShrink: 0 }}><Trash2 size={14} /></button>
            </div>
            {group.items.map(item => renderCard(item, 'g', group.id))}
            <div className="rw-group-footer"><button type="button" onClick={() => addItemToGroup(group.id)} className="rw-btn rw-btn-sm">+ Add Item</button></div>
          </div>
        )
      })}</div>}
      {data.standaloneItems.length > 0 && <div><div className="rw-section-label">Individual Items</div><div className="rw-group-card">{data.standaloneItems.map(item => renderCard(item, 's', null))}</div></div>}
      {has && <div className="rw-add-ctrl"><button type="button" onClick={addStandalone} className="rw-btn rw-btn-primary">+ Add Row</button><button type="button" onClick={addGroup} className="rw-btn">+ Add Group</button></div>}
    </div>
  )
}

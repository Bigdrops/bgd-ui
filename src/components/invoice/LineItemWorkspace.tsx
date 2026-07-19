import { useState, useCallback, useRef, useEffect } from 'react'
import { Plus, ChevronDown, ChevronRight, Trash2, Copy, ArrowUp, ArrowDown, CornerDownRight, Camera, Type } from 'lucide-react'
import { cn, generateId, formatCurrency } from '@/lib/utils'
import type { LineItem, LineGroup, CustomColumn, UnitType, ConditionType } from '@/types/invoice'
import { createEmptyItem, createEmptyGroup } from '@/lib/mock-data'

interface LineItemWorkspaceProps {
  groups: LineGroup[]
  standaloneItems: LineItem[]
  onUpdateGroups: (groups: LineGroup[]) => void
  onUpdateStandalone: (items: LineItem[]) => void
  customColumns: CustomColumn[]
}

const UNITS: { value: UnitType; label: string }[] = [
  { value: 'pcs', label: 'Pcs' }, { value: 'kg', label: 'Kg' }, { value: 'lb', label: 'Lb' },
  { value: 'hr', label: 'Hr' }, { value: 'day', label: 'Day' }, { value: 'mth', label: 'Mth' },
  { value: 'lot', label: 'Lot' }, { value: 'set', label: 'Set' }, { value: 'box', label: 'Box' },
]

/* ── Item Actions Bar (inline, below each card) ── */
function ItemActions({
  onInsertBelow,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
}: {
  onInsertBelow: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onDuplicate: () => void
  onDelete: () => void
}) {
  const [showMore, setShowMore] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setShowMore(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="action-row" style={{ position: 'relative' }}>
      <button type="button" onClick={onInsertBelow}>
        <CornerDownRight size={12} /> Insert Below
      </button>
      <button type="button" onClick={onMoveUp}>
        <ArrowUp size={12} /> Up
      </button>
      <button type="button" onClick={onMoveDown}>
        <ArrowDown size={12} /> Down
      </button>
      <button type="button" onClick={onDuplicate}>
        <Copy size={12} /> Duplicate
      </button>
      <div className="flex-1" />
      <button type="button" onClick={onDelete} className="action-destructive">
        <Trash2 size={12} /> Delete
      </button>
    </div>
  )
}

/* ── Line Item Card — mobile-first stacked layout ── */
function LineItemCard({
  item,
  index,
  onUpdate,
  onInsertBelow,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onRemove,
}: {
  item: LineItem
  index: number
  onUpdate: (patch: Partial<LineItem>) => void
  onInsertBelow: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onDuplicate: () => void
  onRemove: () => void
}) {
  const [showSubDesc, setShowSubDesc] = useState(!!item.subDescription)
  const [showPhoto, setShowPhoto] = useState(!!item.imageUrl)
  const lineTotal = item.quantity * item.unitPrice * (1 - (item.discountOverride ?? 0) / 100)

  return (
    <div className="surface-card animate-fade-in" style={{ padding: '16px' }}>
      {/* Row 1: Description (full width) */}
      <input
        type="text"
        value={item.description}
        onChange={(e) => onUpdate({ description: e.target.value })}
        placeholder="Item description"
        className="input-field"
        style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink-black)', padding: '0 0 4px' }}
      />

      {/* Row 2: Sub-description + Photo buttons */}
      <div className="flex items-center gap-2" style={{ marginTop: '8px' }}>
        <button
          type="button"
          onClick={() => setShowSubDesc(!showSubDesc)}
          className={cn('btn-ghost', showSubDesc && 'btn-square')}
          style={{ fontSize: '11px', padding: '4px 10px' }}
        >
          <Type size={12} />
          Sub-desc
        </button>
        <button
          type="button"
          onClick={() => setShowPhoto(!showPhoto)}
          className={cn('btn-ghost', showPhoto && 'btn-square')}
          style={{ fontSize: '11px', padding: '4px 10px' }}
        >
          <Camera size={12} />
          Photo
        </button>
      </div>

      {/* Sub-description expanded */}
      {showSubDesc && (
        <div style={{ marginTop: '8px', animation: 'fade-in-up 0.2s ease-out' }}>
          <input
            type="text"
            value={item.subDescription ?? ''}
            onChange={(e) => onUpdate({ subDescription: e.target.value })}
            placeholder="Additional details"
            className="input-field input-field-sm"
          />
        </div>
      )}

      {/* Photo expanded */}
      {showPhoto && (
        <div style={{ marginTop: '8px', animation: 'fade-in-up 0.2s ease-out' }}>
          <input
            type="text"
            value={item.imageUrl ?? ''}
            onChange={(e) => onUpdate({ imageUrl: e.target.value })}
            placeholder="Image URL"
            className="input-field input-field-sm"
          />
        </div>
      )}

      {/* Row 3: Quantity + Rate */}
      <div className="grid grid-cols-2 gap-4" style={{ marginTop: '12px' }}>
        <div>
          <span className="typo-label" style={{ display: 'block', marginBottom: '4px' }}>Quantity</span>
          <input
            type="number"
            value={item.quantity || ''}
            onChange={(e) => onUpdate({ quantity: parseFloat(e.target.value) || 0 })}
            placeholder="0"
            className="input-field input-field-sm input-field-right"
          />
        </div>
        <div>
          <span className="typo-label" style={{ display: 'block', marginBottom: '4px' }}>Rate</span>
          <input
            type="number"
            value={item.unitPrice || ''}
            onChange={(e) => onUpdate({ unitPrice: parseFloat(e.target.value) || 0 })}
            placeholder="0.00"
            className="input-field input-field-sm input-field-right"
          />
        </div>
      </div>

      {/* Row 4: Unit + Make */}
      <div className="grid grid-cols-2 gap-4" style={{ marginTop: '10px' }}>
        <div>
          <span className="typo-label" style={{ display: 'block', marginBottom: '4px' }}>Unit</span>
          <select
            value={item.unit}
            onChange={(e) => onUpdate({ unit: e.target.value as UnitType })}
            className="input-select"
            style={{ width: '100%' }}
          >
            {UNITS.map((u) => (
              <option key={u.value} value={u.value}>{u.label}</option>
            ))}
          </select>
        </div>
        <div>
          <span className="typo-label" style={{ display: 'block', marginBottom: '4px' }}>Make</span>
          <input
            type="text"
            value={item.make ?? ''}
            onChange={(e) => onUpdate({ make: e.target.value })}
            placeholder="—"
            className="input-field input-field-sm"
          />
        </div>
      </div>

      {/* Row 5: Line Total */}
      <div
        className="flex items-center justify-between"
        style={{
          marginTop: '12px',
          padding: '8px 0',
          borderTop: '1px solid var(--bone)',
        }}
      >
        <span style={{ fontWeight: 700, fontSize: '12px', color: 'var(--ash)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</span>
        <span style={{
          fontWeight: 700,
          fontSize: '15px',
          fontVariantNumeric: 'tabular-nums',
          color: 'var(--ink-black)',
        }}>
          {formatCurrency(lineTotal)}
        </span>
      </div>

      {/* Row 6-7: Actions */}
      <ItemActions
        onInsertBelow={onInsertBelow}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onDuplicate={onDuplicate}
        onDelete={onRemove}
      />
    </div>
  )
}

/* ── Group Header ── */
function GroupHeader({
  group,
  onUpdate,
  onRemove,
  onAddItem,
  onToggleCollapse,
}: {
  group: LineGroup
  onUpdate: (patch: Partial<LineGroup>) => void
  onRemove: () => void
  onAddItem: () => void
  onToggleCollapse: () => void
}) {
  const subtotal = group.items.reduce((sum, item) =>
    sum + item.quantity * item.unitPrice * (1 - (item.discountOverride ?? 0) / 100), 0
  )

  return (
    <div
      className="flex items-center gap-3"
      style={{
        background: 'var(--parchment)',
        padding: '10px 16px',
        borderRadius: 'var(--radius) var(--radius) 0 0',
        borderBottom: '2px solid var(--ink-black)',
      }}
    >
      <button type="button" onClick={onToggleCollapse} className="btn-icon btn-icon-sm" style={{ color: 'var(--ink-black)' }}>
        {group.collapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
      </button>

      <input
        type="text"
        value={group.title}
        onChange={(e) => onUpdate({ title: e.target.value })}
        placeholder="Group title"
        style={{
          background: 'transparent',
          border: 'none',
          fontFamily: 'var(--font-body)',
          fontWeight: 700,
          fontSize: '13px',
          color: 'var(--ink-black)',
          flex: 1,
          outline: 'none',
          padding: '2px 0',
        }}
      />

      <span className="badge badge-white" style={{ fontSize: '9px' }}>
        {group.items.length} ITEM{group.items.length !== 1 ? 'S' : ''}
      </span>

      <span style={{
        fontWeight: 700,
        fontSize: '12px',
        fontVariantNumeric: 'tabular-nums',
        color: 'var(--ink-black)',
      }}>
        {formatCurrency(subtotal)}
      </span>

      <button type="button" onClick={onAddItem} className="btn-icon btn-icon-sm" style={{ color: 'var(--ink-black)' }}>
        <Plus size={14} />
      </button>
      <button type="button" onClick={onRemove} className="btn-icon btn-icon-sm" style={{ color: 'var(--ash)' }}>
        <Trash2 size={12} />
      </button>
    </div>
  )
}

/* ── Main Workspace ── */
export function LineItemWorkspace({ groups, standaloneItems, onUpdateGroups, onUpdateStandalone, customColumns }: LineItemWorkspaceProps) {
  // ── Standalone item operations ──
  const addStandaloneItem = useCallback(() => {
    onUpdateStandalone([...standaloneItems, createEmptyItem()])
  }, [standaloneItems, onUpdateStandalone])

  const updateStandaloneItem = useCallback((itemId: string, patch: Partial<LineItem>) => {
    onUpdateStandalone(standaloneItems.map((item) => (item.id === itemId ? { ...item, ...patch } : item)))
  }, [standaloneItems, onUpdateStandalone])

  const removeStandaloneItem = useCallback((itemId: string) => {
    onUpdateStandalone(standaloneItems.filter((item) => item.id !== itemId))
  }, [standaloneItems, onUpdateStandalone])

  const insertStandaloneBelow = useCallback((itemId: string) => {
    const idx = standaloneItems.findIndex((item) => item.id === itemId)
    const newItem = createEmptyItem()
    const newItems = [...standaloneItems]
    newItems.splice(idx + 1, 0, newItem)
    onUpdateStandalone(newItems)
  }, [standaloneItems, onUpdateStandalone])

  const moveStandaloneItem = useCallback((itemId: string, direction: 'up' | 'down') => {
    const idx = standaloneItems.findIndex((item) => item.id === itemId)
    const newIdx = direction === 'up' ? idx - 1 : idx + 1
    if (newIdx < 0 || newIdx >= standaloneItems.length) return
    const newItems = [...standaloneItems]
    ;[newItems[idx], newItems[newIdx]] = [newItems[newIdx], newItems[idx]]
    onUpdateStandalone(newItems)
  }, [standaloneItems, onUpdateStandalone])

  const duplicateStandaloneItem = useCallback((itemId: string) => {
    const idx = standaloneItems.findIndex((item) => item.id === itemId)
    const original = standaloneItems[idx]
    const duplicate = { ...original, id: generateId() }
    const newItems = [...standaloneItems]
    newItems.splice(idx + 1, 0, duplicate)
    onUpdateStandalone(newItems)
  }, [standaloneItems, onUpdateStandalone])

  // ── Group operations ──
  const addGroup = useCallback(() => {
    onUpdateGroups([...groups, createEmptyGroup()])
  }, [groups, onUpdateGroups])

  const updateGroup = useCallback((groupId: string, patch: Partial<LineGroup>) => {
    onUpdateGroups(groups.map((g) => (g.id === groupId ? { ...g, ...patch } : g)))
  }, [groups, onUpdateGroups])

  const removeGroup = useCallback((groupId: string) => {
    onUpdateGroups(groups.filter((g) => g.id !== groupId))
  }, [groups, onUpdateGroups])

  const addItemToGroup = useCallback((groupId: string) => {
    onUpdateGroups(groups.map((g) =>
      g.id === groupId ? { ...g, items: [...g.items, createEmptyItem(groupId)] } : g
    ))
  }, [groups, onUpdateGroups])

  const updateGroupItem = useCallback((groupId: string, itemId: string, patch: Partial<LineItem>) => {
    onUpdateGroups(groups.map((g) =>
      g.id === groupId
        ? { ...g, items: g.items.map((item) => (item.id === itemId ? { ...item, ...patch } : item)) }
        : g
    ))
  }, [groups, onUpdateGroups])

  const removeGroupItem = useCallback((groupId: string, itemId: string) => {
    onUpdateGroups(groups.map((g) =>
      g.id === groupId ? { ...g, items: g.items.filter((item) => item.id !== itemId) } : g
    ))
  }, [groups, onUpdateGroups])

  const insertGroupItemBelow = useCallback((groupId: string, itemId: string) => {
    onUpdateGroups(groups.map((g) => {
      if (g.id !== groupId) return g
      const idx = g.items.findIndex((item) => item.id === itemId)
      const newItem = createEmptyItem(groupId)
      const newItems = [...g.items]
      newItems.splice(idx + 1, 0, newItem)
      return { ...g, items: newItems }
    }))
  }, [groups, onUpdateGroups])

  const moveGroupItem = useCallback((groupId: string, itemId: string, direction: 'up' | 'down') => {
    onUpdateGroups(groups.map((g) => {
      if (g.id !== groupId) return g
      const idx = g.items.findIndex((item) => item.id === itemId)
      const newIdx = direction === 'up' ? idx - 1 : idx + 1
      if (newIdx < 0 || newIdx >= g.items.length) return g
      const newItems = [...g.items]
      ;[newItems[idx], newItems[newIdx]] = [newItems[newIdx], newItems[idx]]
      return { ...g, items: newItems }
    }))
  }, [groups, onUpdateGroups])

  const duplicateGroupItem = useCallback((groupId: string, itemId: string) => {
    onUpdateGroups(groups.map((g) => {
      if (g.id !== groupId) return g
      const idx = g.items.findIndex((item) => item.id === itemId)
      const original = g.items[idx]
      const duplicate = { ...original, id: generateId() }
      const newItems = [...g.items]
      newItems.splice(idx + 1, 0, duplicate)
      return { ...g, items: newItems }
    }))
  }, [groups, onUpdateGroups])

  const hasContent = standaloneItems.length > 0 || groups.length > 0

  return (
    <div>
      {/* ── Empty State ── */}
      {!hasContent && (
        <div className="surface-card" style={{ padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: '17px', color: 'var(--ink-black)', opacity: 0.15, marginBottom: '8px' }}>No items yet</div>
          <p style={{ fontSize: '13px', color: 'var(--ash)', marginBottom: '20px' }}>
            Add items or groups to start building your invoice
          </p>
          <div className="flex items-center justify-center gap-3">
            <button type="button" onClick={addStandaloneItem} className="btn-dark" style={{ fontSize: '12px', padding: '8px 18px' }}>
              <Plus size={14} />
              Add Item
            </button>
            <button type="button" onClick={addGroup} className="btn-pill" style={{ fontSize: '12px', padding: '7px 18px' }}>
              <Plus size={14} />
              Add Group
            </button>
          </div>
        </div>
      )}

      {/* ── Standalone Items ── */}
      {standaloneItems.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
          {standaloneItems.map((item, idx) => (
            <LineItemCard
              key={item.id}
              item={item}
              index={idx}
              onUpdate={(patch) => updateStandaloneItem(item.id, patch)}
              onInsertBelow={() => insertStandaloneBelow(item.id)}
              onMoveUp={() => moveStandaloneItem(item.id, 'up')}
              onMoveDown={() => moveStandaloneItem(item.id, 'down')}
              onDuplicate={() => duplicateStandaloneItem(item.id)}
              onRemove={() => removeStandaloneItem(item.id)}
            />
          ))}
        </div>
      )}

      {/* ── Groups ── */}
      {groups.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {groups.map((group) => (
            <div key={group.id} className="surface-card" style={{ overflow: 'visible', padding: 0 }}>
              <GroupHeader
                group={group}
                onUpdate={(patch) => updateGroup(group.id, patch)}
                onRemove={() => removeGroup(group.id)}
                onAddItem={() => addItemToGroup(group.id)}
                onToggleCollapse={() => updateGroup(group.id, { collapsed: !group.collapsed })}
              />
              {!group.collapsed && (
                <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {group.items.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                      <button type="button" onClick={() => addItemToGroup(group.id)} className="btn-ghost" style={{ fontSize: '11px' }}>
                        + Add item to this group
                      </button>
                    </div>
                  ) : (
                    group.items.map((item, idx) => (
                      <LineItemCard
                        key={item.id}
                        item={item}
                        index={idx}
                        onUpdate={(patch) => updateGroupItem(group.id, item.id, patch)}
                        onInsertBelow={() => insertGroupItemBelow(group.id, item.id)}
                        onMoveUp={() => moveGroupItem(group.id, item.id, 'up')}
                        onMoveDown={() => moveGroupItem(group.id, item.id, 'down')}
                        onDuplicate={() => duplicateGroupItem(group.id, item.id)}
                        onRemove={() => removeGroupItem(group.id, item.id)}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Bottom Actions (Row 6-7) ── */}
      {hasContent && (
        <div className="flex items-center gap-3" style={{ marginTop: '16px' }}>
          <button type="button" onClick={addStandaloneItem} className="btn-dark" style={{ fontSize: '12px', padding: '8px 18px' }}>
            <Plus size={14} />
            Add Item
          </button>
          <button type="button" onClick={addGroup} className="btn-pill" style={{ fontSize: '12px', padding: '7px 18px' }}>
            <Plus size={14} />
            Add Group
          </button>
        </div>
      )}
    </div>
  )
}

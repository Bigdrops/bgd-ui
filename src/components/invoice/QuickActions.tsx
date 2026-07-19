import { useState, useRef, useEffect } from 'react'
import { MoreHorizontal, Save, Trash2, FileText, Link } from 'lucide-react'

interface QuickActionsProps {
  onSave: () => void
  onCancel: () => void
  onClearAll: () => void
  onScrollToNotes: () => void
  onScrollToReferences: () => void
}

export function QuickActions({
  onSave,
  onCancel,
  onClearAll,
  onScrollToNotes,
  onScrollToReferences,
}: QuickActionsProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const actions = [
    { label: 'Save Changes', icon: Save, onClick: () => { onSave(); setOpen(false) } },
    { label: 'Cancel', icon: FileText, onClick: () => { onCancel(); setOpen(false) } },
    { label: 'Notes & Terms', icon: FileText, onClick: () => { onScrollToNotes(); setOpen(false) } },
    { label: 'Reference Links', icon: Link, onClick: () => { onScrollToReferences(); setOpen(false) } },
  ]

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="btn-icon"
        style={{
          background: open ? 'var(--ink-black)' : 'transparent',
          color: open ? 'var(--parchment)' : 'var(--ink-black)',
          borderRadius: 'var(--radius)',
        }}
      >
        <MoreHorizontal size={16} />
      </button>

      {open && (
        <div className="context-menu" style={{ right: 0, top: '100%', marginTop: '8px', width: '180px' }}>
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              className="context-menu-item"
            >
              <action.icon size={13} />
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

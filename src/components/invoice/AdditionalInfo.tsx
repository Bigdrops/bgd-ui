import { useState } from 'react'
import { ChevronDown, Plus, Trash2 } from 'lucide-react'
import type { AdditionalInfo } from '@/types/invoice'

interface AdditionalInfoProps {
  additional: AdditionalInfo
  onUpdate: (additional: AdditionalInfo) => void
  referencesRef: React.RefObject<HTMLDivElement | null>
}

function ExpandableSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div style={{ borderBottom: '1px solid var(--bone)' }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left flex items-center justify-between"
        style={{ padding: '14px 20px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--charcoal)' }}
      >
        <span style={{ fontWeight: 500, fontSize: '13px' }}>{title}</span>
        <ChevronDown size={14} style={{ color: 'rgba(34,34,34,0.3)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>
      {open && (
        <div style={{ padding: '0 20px 16px', animation: 'fade-in-up 0.2s ease-out' }}>
          {children}
        </div>
      )}
    </div>
  )
}

export function AdditionalInfoPanel({ additional, onUpdate, referencesRef }: AdditionalInfoProps) {
  return (
    <div className="surface-card" style={{ overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px 10px' }}>
        <span className="typo-eyebrow">Additional Information</span>
      </div>

      <ExpandableSection title="Notes" defaultOpen={false}>
        <textarea
          value={additional.notes}
          onChange={(e) => onUpdate({ ...additional, notes: e.target.value })}
          placeholder="Additional notes for this invoice..."
          rows={3}
          className="input-textarea"
        />
      </ExpandableSection>

      <ExpandableSection title="Terms & Conditions" defaultOpen={false}>
        <textarea
          value={additional.terms}
          onChange={(e) => onUpdate({ ...additional, terms: e.target.value })}
          placeholder="Payment terms, warranty, or legal notices..."
          rows={4}
          className="input-textarea"
        />
      </ExpandableSection>

      <ExpandableSection title="Signatory" defaultOpen={false}>
        <input
          type="text"
          value={additional.signatory}
          onChange={(e) => onUpdate({ ...additional, signatory: e.target.value })}
          placeholder="Authorized signatory name"
          className="input-field input-field-sm"
        />
      </ExpandableSection>

      <div ref={referencesRef}>
        <ExpandableSection title="Reference Links" defaultOpen={false}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {additional.referenceLinks.map((link, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => {
                    const links = [...additional.referenceLinks]
                    links[idx] = { ...links[idx], label: e.target.value }
                    onUpdate({ ...additional, referenceLinks: links })
                  }}
                  placeholder="Label"
                  className="input-field input-field-sm"
                  style={{ width: '80px', flex: 'none' }}
                />
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => {
                    const links = [...additional.referenceLinks]
                    links[idx] = { ...links[idx], url: e.target.value }
                    onUpdate({ ...additional, referenceLinks: links })
                  }}
                  placeholder="https://..."
                  className="input-field input-field-sm"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => {
                    onUpdate({
                      ...additional,
                      referenceLinks: additional.referenceLinks.filter((_, i) => i !== idx),
                    })
                  }}
                  className="btn-icon btn-icon-sm"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                onUpdate({
                  ...additional,
                  referenceLinks: [...additional.referenceLinks, { label: '', url: '' }],
                })
              }}
              className="btn-ghost"
              style={{ fontSize: '11px', alignSelf: 'flex-start' }}
            >
              <Plus size={12} />
              Add link
            </button>
          </div>
        </ExpandableSection>
      </div>
    </div>
  )
}

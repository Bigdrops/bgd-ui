import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { PAYMENT_TERMS } from '@/lib/mock-data'
import type { CommercialSettings } from '@/types/invoice'

interface CommercialSettingsProps {
  commercial: CommercialSettings
  onUpdate: (commercial: CommercialSettings) => void
}

function SettingsRow({
  label,
  summary,
  children,
  defaultOpen = false,
}: {
  label: string
  summary: string
  children: React.ReactNode
  defaultOpen?: boolean
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
        <div className="flex-1 min-w-0">
          <div style={{ fontWeight: 500, fontSize: '13px', color: 'var(--charcoal)' }}>{label}</div>
          <div style={{ fontSize: '12px', color: 'rgba(34,34,34,0.4)', marginTop: '2px' }}>{summary}</div>
        </div>
        <ChevronDown size={14} style={{ color: 'rgba(34,34,34,0.3)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0, marginLeft: '8px' }} />
      </button>
      {open && (
        <div style={{ padding: '0 20px 16px', animation: 'fade-in-up 0.2s ease-out' }}>
          {children}
        </div>
      )}
    </div>
  )
}

function ToggleGroup({
  options,
  value,
  onChange,
}: {
  options: Array<{ value: string; label: string }>
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="toggle-group">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`toggle-item ${value === opt.value ? 'toggle-item-active' : ''}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export function CommercialSettingsPanel({ commercial, onUpdate }: CommercialSettingsProps) {
  const discountSummary = commercial.discount.type === 'none'
    ? 'Not set'
    : commercial.discount.type === 'percentage'
      ? `${commercial.discount.value}%`
      : `₦${commercial.discount.value.toLocaleString()}`

  const vatSummary = commercial.vat.enabled ? `${commercial.vat.percentage}%` : 'Not set'

  const whtSummary = commercial.wht.type === 'none'
    ? 'Not set'
    : commercial.wht.type === 'percentage'
      ? `${commercial.wht.value}%`
      : `₦${commercial.wht.value.toLocaleString()}`

  const chargeSummary = commercial.additionalCharges.type === 'none'
    ? 'Not set'
    : commercial.additionalCharges.type === 'percentage'
      ? `${commercial.additionalCharges.value}%`
      : `₦${commercial.additionalCharges.value.toLocaleString()}`

  return (
    <div className="surface-card" style={{ overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px 10px' }}>
        <span className="typo-eyebrow">Commercial Settings</span>
      </div>

      {/* Payment Terms */}
      <SettingsRow label="Payment Terms" summary={commercial.paymentTerms?.label || 'Not set'}>
        <select
          value={commercial.paymentTerms?.id ?? ''}
          onChange={(e) => {
            const term = PAYMENT_TERMS.find((p) => p.id === e.target.value) ?? null
            onUpdate({ ...commercial, paymentTerms: term })
          }}
          className="input-select"
          style={{ width: '100%' }}
        >
          <option value="">None</option>
          {PAYMENT_TERMS.map((t) => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>
      </SettingsRow>

      {/* Discount — Percentage or Flat only */}
      <SettingsRow label="Discount" summary={discountSummary}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <ToggleGroup
            options={[
              { value: 'percentage', label: 'Percentage' },
              { value: 'flat', label: 'Flat Amount' },
            ]}
            value={commercial.discount.type === 'none' ? 'percentage' : commercial.discount.type}
            onChange={(v) => onUpdate({
              ...commercial,
              discount: { ...commercial.discount, type: v as any },
            })}
          />
          {commercial.discount.type !== 'none' && (
            <input
              type="number"
              value={commercial.discount.value}
              onChange={(e) => onUpdate({
                ...commercial,
                discount: { ...commercial.discount, value: parseFloat(e.target.value) || 0 },
              })}
              placeholder={commercial.discount.type === 'percentage' ? 'Percentage' : 'Amount'}
              className="input-field input-field-sm"
            />
          )}
          <ToggleGroup
            options={[
              { value: 'before_tax', label: 'Before Tax' },
              { value: 'after_tax', label: 'After Tax' },
            ]}
            value={commercial.discount.timing}
            onChange={(v) => onUpdate({
              ...commercial,
              discount: { ...commercial.discount, timing: v as any },
            })}
          />
        </div>
      </SettingsRow>

      {/* VAT — Percentage only */}
      <SettingsRow label="VAT" summary={vatSummary}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={commercial.vat.enabled ? commercial.vat.percentage : ''}
              onChange={(e) => onUpdate({
                ...commercial,
                vat: { enabled: true, percentage: parseFloat(e.target.value) || 0 },
              })}
              placeholder="Percentage"
              className="input-field input-field-sm"
              style={{ width: '120px' }}
              step="0.5"
            />
            <span style={{ fontSize: '12px', color: 'rgba(34,34,34,0.4)' }}>%</span>
          </div>
          <button
            type="button"
            onClick={() => onUpdate({ ...commercial, vat: { ...commercial.vat, enabled: false } })}
            className="btn-ghost"
            style={{ fontSize: '11px', alignSelf: 'flex-start' }}
          >
            Disable VAT
          </button>
        </div>
      </SettingsRow>

      {/* WHT — Percentage or Flat */}
      <SettingsRow label="Withholding Tax" summary={whtSummary}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <ToggleGroup
            options={[
              { value: 'percentage', label: 'Percentage' },
              { value: 'flat', label: 'Flat Amount' },
            ]}
            value={commercial.wht.type === 'none' ? 'percentage' : commercial.wht.type}
            onChange={(v) => onUpdate({
              ...commercial,
              wht: { ...commercial.wht, type: v as any },
            })}
          />
          {commercial.wht.type !== 'none' && (
            <input
              type="number"
              value={commercial.wht.value}
              onChange={(e) => onUpdate({
                ...commercial,
                wht: { ...commercial.wht, value: parseFloat(e.target.value) || 0 },
              })}
              placeholder="Amount"
              className="input-field input-field-sm"
            />
          )}
        </div>
      </SettingsRow>

      {/* Additional Charges — Percentage or Flat + timing */}
      <SettingsRow label="Additional Charges" summary={chargeSummary}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <ToggleGroup
            options={[
              { value: 'percentage', label: 'Percentage' },
              { value: 'flat', label: 'Flat Amount' },
            ]}
            value={commercial.additionalCharges.type === 'none' ? 'percentage' : commercial.additionalCharges.type}
            onChange={(v) => onUpdate({
              ...commercial,
              additionalCharges: { ...commercial.additionalCharges, type: v as any },
            })}
          />
          {commercial.additionalCharges.type !== 'none' && (
            <>
              <input
                type="number"
                value={commercial.additionalCharges.value}
                onChange={(e) => onUpdate({
                  ...commercial,
                  additionalCharges: { ...commercial.additionalCharges, value: parseFloat(e.target.value) || 0 },
                })}
                placeholder="Amount"
                className="input-field input-field-sm"
              />
              <ToggleGroup
                options={[
                  { value: 'before_tax', label: 'Before Tax' },
                  { value: 'after_tax', label: 'After Tax' },
                ]}
                value={commercial.additionalCharges.timing}
                onChange={(v) => onUpdate({
                  ...commercial,
                  additionalCharges: { ...commercial.additionalCharges, timing: v as any },
                })}
              />
            </>
          )}
        </div>
      </SettingsRow>
    </div>
  )
}

import { formatCurrency } from '@/lib/utils'
import type { InvoiceTotals } from '@/types/invoice'

interface LiveTotalsProps {
  totals: InvoiceTotals
}

function TotalRow({
  label,
  value,
  emphasis = false,
}: {
  label: string
  value: string
  emphasis?: boolean
}) {
  return (
    <div
      className="flex items-center justify-between"
      style={{
        padding: emphasis ? '12px 20px' : '6px 20px',
        background: emphasis ? 'var(--ink-black)' : 'transparent',
        borderRadius: emphasis ? '0 0 3px 3px' : undefined,
      }}
    >
      <span style={{
        fontWeight: emphasis ? 700 : 400,
        fontSize: emphasis ? '13px' : '12px',
        color: emphasis ? 'var(--parchment)' : 'var(--ash)',
        letterSpacing: emphasis ? '0.05em' : undefined,
        textTransform: emphasis ? 'uppercase' : undefined,
      }}>
        {label}
      </span>
      <span style={{
        fontWeight: emphasis ? 700 : 400,
        fontSize: emphasis ? '16px' : '13px',
        fontVariantNumeric: 'tabular-nums',
        color: emphasis ? 'var(--parchment)' : 'var(--ink-black)',
      }}>
        {value}
      </span>
    </div>
  )
}

export function LiveTotals({ totals }: LiveTotalsProps) {
  return (
    <div className="surface-card" style={{ overflow: 'hidden', padding: 0 }}>
      <div style={{ padding: '14px 20px 10px' }}>
        <span className="typo-eyebrow">Totals</span>
      </div>

      <div>
        <TotalRow label="Subtotal" value={formatCurrency(totals.subtotal)} />

        {totals.discount > 0 && (
          <TotalRow label="Discount" value={`−${formatCurrency(totals.discount)}`} />
        )}

        {totals.vat > 0 && (
          <TotalRow label="VAT" value={formatCurrency(totals.vat)} />
        )}

        {totals.wht > 0 && (
          <TotalRow label="WHT" value={`−${formatCurrency(totals.wht)}`} />
        )}

        {totals.additionalCharges > 0 && (
          <TotalRow label="Additional" value={formatCurrency(totals.additionalCharges)} />
        )}

        {totals.installTotal > 0 && (
          <TotalRow label="Install" value={formatCurrency(totals.installTotal)} />
        )}

        <TotalRow
          label="Grand Total"
          value={formatCurrency(totals.grandTotal)}
          emphasis
        />
      </div>

      {totals.amountInWords && (
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--bone)' }}>
          <p style={{
            fontWeight: 400,
            fontStyle: 'italic',
            fontSize: '12px',
            lineHeight: 1.6,
            color: 'var(--ash)',
          }}>
            {totals.amountInWords}
          </p>
        </div>
      )}
    </div>
  )
}

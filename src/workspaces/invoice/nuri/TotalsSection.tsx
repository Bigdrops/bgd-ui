import type { DocumentTotals } from './types'
function Row({ label, value, negate = false }: { label: string; value: string; negate?: boolean }) { return <div className="nr-total-row"><span className="nr-total-label">{label}</span><span className="nr-total-value">{negate ? '-' : ''}{value}</span></div> }
export function TotalsSection({ totals }: { totals: DocumentTotals }) {
  return (
    <div className="nr-card" style={{ padding: '22px', marginBottom: '16px' }}>
      <Row label="Subtotal" value={totals.subtotal.toLocaleString()} />
      {totals.discount > 0 && <Row label="Discount" value={totals.discount.toLocaleString()} negate />}
      {totals.taxedCharges > 0 && <Row label="Charges (taxed)" value={totals.taxedCharges.toLocaleString()} />}
      {totals.vat > 0 && <Row label="VAT" value={totals.vat.toLocaleString()} />}
      {totals.nonTaxedCharges > 0 && <Row label="Charges (non-taxable)" value={totals.nonTaxedCharges.toLocaleString()} />}
      {totals.wht > 0 && <Row label="WHT" value={totals.wht.toLocaleString()} negate />}
      <div className="nr-grand"><span>Grand Total</span><span>{totals.grandTotal.toLocaleString()}</span></div>
      {totals.amountInWords && <div className="nr-words">{totals.amountInWords}</div>}
    </div>
  )
}

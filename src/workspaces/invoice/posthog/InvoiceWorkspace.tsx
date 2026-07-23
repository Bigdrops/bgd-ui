import { useState, useCallback } from 'react'
import { sampleInvoice } from './data'
import type { InvoiceData, DocumentTotals } from './types'
import { InvoiceHeader } from './InvoiceHeader'
import { LineItemsSection } from './LineItemsSection'
import { CommercialSettings } from './CommercialSettings'
import { TotalsSection } from './TotalsSection'
import { AdditionalInfo } from './AdditionalInfo'
import { FloatingSave } from './FloatingSave'
import { QuickActions } from './QuickActions'
import './index.css'

function toWords(n: number): string {
  if (n === 0) return 'Zero Only'
  const o = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen']
  const t = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety']
  const h = (v: number): string => { if (v===0) return ''; if (v<20) return o[v]; if (v<100) return t[Math.floor(v/10)]+(v%10?' '+o[v%10]:''); return o[Math.floor(v/100)]+' Hundred'+(v%100?' and '+h(v%100):'') }
  const ni = Math.floor(n); const pf = Math.round((n-ni)*100)
  let r = ''
  if(ni>=1000000){r+=h(Math.floor(ni/1000000))+' Million ';const rm=ni%1000000;if(rm>=1000)r+=h(Math.floor(rm/1000))+' Thousand ';else if(rm>0)r+=h(rm)}
  else if(ni>=1000){r+=h(Math.floor(ni/1000))+' Thousand ';const rm=ni%1000;if(rm>0)r+=h(rm)}
  else r+=h(ni)
  r=r.trim();if(pf>0)r+=' and '+h(pf)+' Cents';return r+' Only'
}

function computeTotals(data: InvoiceData): DocumentTotals {
  const all = [...data.standaloneItems, ...data.groups.flatMap(g => g.items)]
  const subtotal = all.reduce((s, i) => s + i.quantity * i.unitPrice, 0)
  let discount = 0
  if (data.commercial.discount.enabled) discount = data.commercial.discount.type === 'percentage' ? subtotal * (data.commercial.discount.value / 100) : data.commercial.discount.value
  const afterDisc = subtotal - discount
  const taxedCharges = data.commercial.charges.filter(c => c.taxable).reduce((s, c) => s + c.value, 0)
  const nonTaxedCharges = data.commercial.charges.filter(c => !c.taxable).reduce((s, c) => s + c.value, 0)
  let vat = 0
  if (data.commercial.vat.enabled) vat = data.commercial.discount.timing === 'beforeTax' ? afterDisc * (data.commercial.vat.rate / 100) : subtotal * (data.commercial.vat.rate / 100)
  let wht = 0
  if (data.commercial.wht.enabled) wht = data.commercial.wht.unit === 'percentage' ? afterDisc * (data.commercial.wht.rate / 100) : data.commercial.wht.rate
  const grandTotal = Math.max(0, afterDisc + vat + taxedCharges - wht + nonTaxedCharges)
  return { subtotal, discount, vat, wht, taxedCharges, nonTaxedCharges, grandTotal, amountInWords: toWords(grandTotal) }
}

export default function InvoiceWorkspace() {
  const [data, setData] = useState<InvoiceData>(sampleInvoice)
  const [confirmClear, setConfirmClear] = useState(false)
  const update = useCallback((p: Partial<InvoiceData>) => setData(prev => ({ ...prev, ...p })), [])
  const totals = computeTotals(data)
  const handleSave = useCallback(() => console.log('Save PostHog:', data), [data])
  const handleClear = useCallback(() => {
    setData(prev => ({ ...prev, groups: [], standaloneItems: [], commercial: { paymentTerms: '', discount: { enabled: false, value: 0, type: 'percentage', timing: 'beforeTax' }, vat: { enabled: false, rate: 0 }, wht: { enabled: false, rate: 0, unit: 'percentage' }, charges: [] }, additional: { notes: '', terms: '' } }))
    setConfirmClear(false)
  }, [])
  return (
    <div className="ph-root" style={{ overflowX: 'hidden' }}>
      {confirmClear && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', padding: '16px' }} onClick={() => setConfirmClear(false)}>
          <div className="ph-card" style={{ maxWidth: '380px', width: '100%', padding: '24px' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Clear all data?</div>
            <p style={{ fontSize: '14px', color: '#4d4f46', lineHeight: 1.5, marginBottom: '20px' }}>This will remove all items, groups, charges, and notes.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" onClick={() => setConfirmClear(false)} className="ph-btn ph-btn-sm">Cancel</button>
              <button type="button" onClick={handleClear} className="ph-btn ph-btn-sm ph-btn-danger">Clear All</button>
            </div>
          </div>
        </div>
      )}
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '16px', minHeight: '100vh' }}>
        <div className="ph-card" style={{ marginBottom: '16px', padding: '20px' }}>
          <InvoiceHeader data={data} onUpdate={update} />
        </div>
        <div className="ph-toolbar">
          <button type="button" onClick={handleSave} className="ph-btn">Save</button>
          <button type="button" onClick={() => setConfirmClear(true)} className="ph-btn ph-btn-danger">Clear All</button>
        </div>
        <LineItemsSection data={data} onUpdate={update} />
        <CommercialSettings settings={data.commercial} onUpdate={c => update({ commercial: c })} />
        <TotalsSection totals={totals} />
        <AdditionalInfo notes={data.additional.notes} terms={data.additional.terms} onUpdate={a => update({ additional: { ...data.additional, ...a } })} />
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', marginBottom: '40px' }}>
          <button type="button" onClick={handleSave} className="ph-btn ph-btn-primary" style={{ flex: 1, fontSize: '16px', padding: '14px' }}>Save Document</button>
        </div>
      </div>
      <FloatingSave onSave={handleSave} />
    </div>
  )
}

import { useState, useCallback, useRef } from 'react'
import { InvoiceHeader } from './InvoiceHeader'
import { LineItemWorkspace } from './LineItemWorkspace'
import { CommercialSettingsPanel } from './CommercialSettings'
import { AdditionalInfoPanel } from './AdditionalInfo'
import { LiveTotals } from './LiveTotals'
import { QuickActions } from './QuickActions'
import { FloatingSave } from './FloatingSave'
import './index.css'

import type { Invoice, InvoiceTotals, LineItem } from '../../../types/invoice'
import { MOCK_CLIENTS, PAYMENT_TERMS, createEmptyItem, createEmptyGroup, getDefaultCommercial, getDefaultAdditional, getDefaultHeader, getDefaultCustomColumns } from '../../../lib/mock-data'
import { generateId } from '../../../lib/utils'

function samplePRAVData(): Invoice {
  const g1Items: LineItem[] = [
    { id: 'p1', description: 'Caterpillar 320F Hydraulic Excavator', subDescription: 'Long Reach', quantity: 1, unit: 'pcs', unitPrice: 45000000, make: 'Caterpillar', partNumber: '320FLR-NG', condition: 'new', groupId: 'g1' },
    { id: 'p2', description: 'CAT Engine Oil Filter — 1R-0750', quantity: 12, unit: 'pcs', unitPrice: 28500, groupId: 'g1' },
  ]
  const g2Items: LineItem[] = [
    { id: 'p3', description: 'Installation & Commissioning', subDescription: '5-day scope', quantity: 1, unit: 'lot', unitPrice: 3500000, groupId: 'g2' },
    { id: 'p4', description: 'Operator Training Program', quantity: 6, unit: 'day', unitPrice: 150000, groupId: 'g2' },
  ]
  return {
    header: { ...getDefaultHeader(), title: 'Supply of Industrial Equipment', clientId: 'c1', purchaseOrder: 'PO-2026-0847' },
    groups: [
      { id: 'g1', title: 'Equipment & Parts', collapsed: false, items: g1Items },
      { id: 'g2', title: 'Services & Logistics', collapsed: false, items: g2Items },
    ],
    standaloneItems: [],
    commercial: { ...getDefaultCommercial(), discount: { type: 'percentage', value: 5, timing: 'before_tax' } },
    additional: getDefaultAdditional(),
    customColumns: getDefaultCustomColumns(),
  }
}

export default function PRAVInvoiceWorkspace() {
  const [data, setData] = useState<Invoice>(samplePRAVData)
  const additionalRef = useRef<HTMLDivElement>(null)

  const allItems = [...data.standaloneItems, ...data.groups.flatMap((g) => g.items)]
  const subtotal = allItems.reduce((s, i) => s + i.quantity * i.unitPrice * (1 - (i.discountOverride ?? 0) / 100), 0)
  let discount = 0
  if (data.commercial.discount.type === 'percentage') discount = subtotal * (data.commercial.discount.value / 100)
  else if (data.commercial.discount.type === 'flat') discount = data.commercial.discount.value
  const afterDisc = subtotal - discount
  const vat = data.commercial.vat.enabled ? afterDisc * (data.commercial.vat.percentage / 100) : 0
  let wht = 0
  if (data.commercial.wht.type === 'percentage') wht = afterDisc * (data.commercial.wht.value / 100)
  else if (data.commercial.wht.type === 'flat') wht = data.commercial.wht.value
  const chargeItems = data.commercial.additionalCharges.items.filter((c) => c.title.trim() && c.value > 0).map((c) => ({ title: c.title, value: c.value }))
  const chargeTotal = chargeItems.reduce((s, c) => s + c.value, 0)
  const grand = Math.max(0, afterDisc + vat - wht + chargeTotal)

  const toWords = (n: number): string => {
    if (n === 0) return 'Zero Naira Only'
    const o = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen']
    const t = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety']
    const h = (n: number): string => { if (n===0) return ''; if (n<20) return o[n]; if (n<100) return t[Math.floor(n/10)]+(n%10?' '+o[n%10]:''); return o[Math.floor(n/100)]+' Hundred'+(n%100?' and '+h(n%100):'') }
    const ni = Math.floor(n); const k = Math.round((n-ni)*100)
    let r = ''
    if (ni>=1000000){r+=h(Math.floor(ni/1000000))+' Million ';const rm=ni%1000000;if(rm>=1000)r+=h(Math.floor(rm/1000))+' Thousand ';else if(rm>0)r+=h(rm)}
    else if(ni>=1000){r+=h(Math.floor(ni/1000))+' Thousand ';const rm=ni%1000;if(rm>0)r+=h(rm)}
    else r+=h(ni)
    r=r.trim()+' Naira'; if(k>0) r+=' and '+h(k)+' Kobo'; return r+' Only'
  }

  const updateHeader = useCallback((patch: Partial<Invoice['header']>) => {
    setData((p) => ({ ...p, header: { ...p.header, ...patch } }))
  }, [])

  const updateGroups = useCallback((groups: Invoice['groups']) => {
    setData((p) => ({ ...p, groups }))
  }, [])

  const updateStandalone = useCallback((standaloneItems: LineItem[]) => {
    setData((p) => ({ ...p, standaloneItems }))
  }, [])

  const updateCommercial = useCallback((commercial: Invoice['commercial']) => {
    setData((p) => ({ ...p, commercial }))
  }, [])

  const updateAdditional = useCallback((additional: Invoice['additional']) => {
    setData((p) => ({ ...p, additional }))
  }, [])

  const handleSave = useCallback(() => console.log('Save PRAV:', data), [data])

  const handleClearAll = useCallback(() => {
    setData((p) => ({
      ...p, groups: [], standaloneItems: [],
      commercial: { ...p.commercial, discount: { type: 'none', value: 0, timing: 'before_tax' }, vat: { enabled: true, percentage: 7.5 }, wht: { type: 'none', value: 0 }, additionalCharges: { items: [], timing: 'after_tax' } },
      additional: { notes: '', terms: '', signatory: '', signatureUrl: '', referenceLinks: [] },
    }))
  }, [])

  const totals: InvoiceTotals = { subtotal, discount, vat, wht, additionalCharges: chargeTotal, additionalChargeItems: chargeItems, installTotal: 0, grandTotal: grand, amountInWords: toWords(grand) }

  return (
    <div className="pav-root" style={{ overflowX: 'hidden' }}>
      <header className="sticky top-0 z-40" style={{ background: 'rgba(243,241,237,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--bone)' }}>
        <div className="flex items-center justify-between" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px', height: '52px' }}>
          <div className="flex items-center gap-3">
            <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--ink-black)' }}>BIGDROPS</span>
            <span style={{ color: 'var(--bone)', fontSize: '14px' }}>/</span>
            <span className="typo-label">Invoice — PRAV</span>
          </div>
          <QuickActions onSave={handleSave} onCancel={() => {}} onClearAll={handleClearAll} onScrollToAdditional={() => additionalRef.current?.scrollIntoView({ behavior: 'smooth' })} />
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
        <InvoiceHeader header={data.header} onUpdate={updateHeader} selectedClientId={data.header.clientId} />

        <div className="flex items-center gap-2" style={{ marginTop: '12px', marginBottom: '12px', padding: '8px 12px', background: 'var(--pure-white)', border: '1px solid var(--bone)', borderRadius: 'var(--radius)' }}>
          <button type="button" className="btn-square" style={{ fontSize: '11px', padding: '5px 12px' }}>Import Items</button>
          <button type="button" className="btn-square" style={{ fontSize: '11px', padding: '5px 12px' }}>Table Settings</button>
          <div className="flex-1" />
          <button type="button" onClick={handleClearAll} className="btn-ghost" style={{ fontSize: '11px', color: '#b91c1c', padding: '4px 8px' }}>Clear All</button>
        </div>

        <LineItemWorkspace groups={data.groups} standaloneItems={data.standaloneItems} onUpdateGroups={updateGroups} onUpdateStandalone={updateStandalone} customColumns={data.customColumns} />

        <div style={{ marginTop: '16px' }}><CommercialSettingsPanel commercial={data.commercial} onUpdate={updateCommercial} /></div>
        <div style={{ marginTop: '16px' }}><LiveTotals totals={totals} /></div>
        <div ref={additionalRef} style={{ marginTop: '16px', paddingBottom: '80px' }}><AdditionalInfoPanel additional={data.additional} onUpdate={updateAdditional} /></div>
      </main>

      <FloatingSave onSave={handleSave} />
    </div>
  )
}

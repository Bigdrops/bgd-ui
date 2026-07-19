import { useState, useCallback, useRef } from 'react'
import type { Invoice, InvoiceTotals, LineItem } from '@/types/invoice'
import { createSampleInvoice, createEmptyItem } from '@/lib/mock-data'
import { calculateTotals } from '@/lib/calculations'
import { toWords, generateId } from '@/lib/utils'
import { InvoiceHeader } from '@/components/invoice/InvoiceHeader'
import { LineItemWorkspace } from '@/components/invoice/LineItemWorkspace'
import { CommercialSettingsPanel } from '@/components/invoice/CommercialSettings'
import { AdditionalInfoPanel } from '@/components/invoice/AdditionalInfo'
import { LiveTotals } from '@/components/invoice/LiveTotals'
import { QuickActions } from '@/components/invoice/QuickActions'
import { FloatingSave } from '@/components/invoice/FloatingSave'

export default function App() {
  const [invoice, setInvoice] = useState<Invoice>(createSampleInvoice)

  const notesRef = useRef<HTMLDivElement>(null)
  const referencesRef = useRef<HTMLDivElement>(null)

  // Compute totals from both standalone items and grouped items
  const allItems = [...invoice.standaloneItems, ...invoice.groups.flatMap((g) => g.items)]
  const totals: InvoiceTotals = calculateTotals(
    [{ id: '_all', title: '', collapsed: false, items: allItems }],
    invoice.commercial
  )
  totals.amountInWords = toWords(totals.grandTotal)

  const updateHeader = useCallback((patch: Partial<Invoice['header']>) => {
    setInvoice((prev) => ({ ...prev, header: { ...prev.header, ...patch } }))
  }, [])

  const updateGroups = useCallback((groups: Invoice['groups']) => {
    setInvoice((prev) => ({ ...prev, groups }))
  }, [])

  const updateStandaloneItems = useCallback((standaloneItems: LineItem[]) => {
    setInvoice((prev) => ({ ...prev, standaloneItems }))
  }, [])

  const updateCommercial = useCallback((commercial: Invoice['commercial']) => {
    setInvoice((prev) => ({ ...prev, commercial }))
  }, [])

  const updateAdditional = useCallback((additional: Invoice['additional']) => {
    setInvoice((prev) => ({ ...prev, additional }))
  }, [])

  const scrollToNotes = useCallback(() => {
    notesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const scrollToReferences = useCallback(() => {
    referencesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const handleSave = useCallback(() => {
    console.log('Saving invoice:', invoice)
  }, [invoice])

  const handleCancel = useCallback(() => {}, [])

  const handleClearAll = useCallback(() => {
    setInvoice((prev) => ({
      ...prev,
      groups: [],
      standaloneItems: [],
      commercial: {
        ...prev.commercial,
        discount: { type: 'none', value: 0, timing: 'before_tax' },
        vat: { enabled: true, percentage: 7.5 },
        wht: { type: 'none', value: 0 },
        additionalCharges: { type: 'none', value: 0, timing: 'after_tax' },
      },
      additional: { notes: '', terms: '', signatory: '', referenceLinks: [] },
    }))
  }, [])

  return (
    <div className="min-h-screen surface-parchment">
      {/* ── Top Bar ── */}
      <header
        className="sticky top-0 z-40"
        style={{
          background: 'rgba(243, 241, 237, 0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--bone)',
        }}
      >
        <div className="mx-auto flex items-center justify-between" style={{ maxWidth: '1200px', padding: '0 24px', height: '56px' }}>
          <div className="flex items-center gap-3">
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '15px', color: 'var(--ink-black)' }}>BIGDROPS</span>
            <span style={{ color: 'var(--bone)', fontSize: '14px' }}>/</span>
            <span className="typo-label">Invoice</span>
          </div>
          <QuickActions
            onSave={handleSave}
            onCancel={handleCancel}
            onClearAll={handleClearAll}
            onScrollToNotes={scrollToNotes}
            onScrollToReferences={scrollToReferences}
          />
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="mx-auto" style={{ maxWidth: '1200px', padding: '24px' }}>
        {/* ── Invoice Header ── */}
        <InvoiceHeader
          header={invoice.header}
          onUpdate={updateHeader}
          selectedClientId={invoice.header.clientId}
        />

        {/* ── Action Bar (always visible) ── */}
        <div
          className="flex items-center gap-3"
          style={{ marginTop: '16px', marginBottom: '16px', padding: '12px 16px', background: 'var(--pure-white)', border: '1px solid var(--bone)', borderRadius: 'var(--radius)' }}
        >
          <button type="button" className="btn-square" style={{ fontSize: '12px', padding: '6px 14px' }}>
            Import Items
          </button>
          <button type="button" className="btn-square" style={{ fontSize: '12px', padding: '6px 14px' }}>
            Table Settings
          </button>
          <div className="flex-1" />
          <button type="button" onClick={handleClearAll} className="btn-ghost" style={{ fontSize: '12px', color: '#b91c1c' }}>
            Clear All
          </button>
        </div>

        {/* ── Content Grid ── */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Left: Line Items */}
          <LineItemWorkspace
            groups={invoice.groups}
            standaloneItems={invoice.standaloneItems}
            onUpdateGroups={updateGroups}
            onUpdateStandalone={updateStandaloneItems}
            customColumns={invoice.customColumns}
          />

          {/* Right: Sidebar */}
          <div className="space-y-4">
            <LiveTotals totals={totals} />

            <CommercialSettingsPanel
              commercial={invoice.commercial}
              onUpdate={updateCommercial}
            />

            <div ref={notesRef}>
              <AdditionalInfoPanel
                additional={invoice.additional}
                onUpdate={updateAdditional}
                referencesRef={referencesRef}
              />
            </div>
          </div>
        </div>
      </main>

      {/* ── Floating Save ── */}
      <FloatingSave onSave={handleSave} />
    </div>
  )
}

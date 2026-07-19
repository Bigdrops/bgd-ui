import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCK_CLIENTS } from '@/lib/mock-data'
import type { InvoiceHeader as InvoiceHeaderType } from '@/types/invoice'

interface InvoiceHeaderProps {
  header: InvoiceHeaderType
  onUpdate: (patch: Partial<InvoiceHeaderType>) => void
  selectedClientId: string
}

export function InvoiceHeader({ header, onUpdate }: InvoiceHeaderProps) {
  const [showClientDropdown, setShowClientDropdown] = useState(false)
  const [clientSearch, setClientSearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedClient = MOCK_CLIENTS.find((c) => c.id === header.clientId)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowClientDropdown(false)
        setClientSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredClients = MOCK_CLIENTS.filter((c) =>
    c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(clientSearch.toLowerCase())
  )

  return (
    <div className="surface-card" style={{ padding: '20px 24px' }}>
      {/* ── Row 1: Document type (static) + Invoice No + Status ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3" style={{ marginBottom: '16px' }}>
        <div>
          <span className="badge badge-dark" style={{ marginBottom: '8px' }}>Invoice</span>
          <input
            type="text"
            value={header.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Invoice title or subject"
            className="input-field"
            style={{
              fontWeight: 400,
              fontSize: '17px',
              lineHeight: '1.4',
              color: 'var(--ink-black)',
              borderBottom: 'none',
              padding: '0',
              marginTop: '4px',
            }}
          />
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div>
            <span className="typo-label" style={{ display: 'block', marginBottom: '4px' }}>Invoice No.</span>
            <input
              type="text"
              value={header.invoiceNumber}
              onChange={(e) => onUpdate({ invoiceNumber: e.target.value })}
              className="input-field input-field-sm"
              style={{ width: '140px', fontWeight: 700, fontSize: '13px' }}
            />
          </div>
          <div>
            <span className="typo-label" style={{ display: 'block', marginBottom: '4px' }}>Status</span>
            <span className={cn('badge', header.status === 'draft' ? 'badge-dark' : 'badge-white')}>
              {header.status}
            </span>
          </div>
        </div>
      </div>

      {/* ── Row 2: Client + PO + Dates ── */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-3"
        style={{ paddingTop: '16px', borderTop: '1px solid var(--bone)' }}
      >
        {/* Client Selector */}
        <div className="relative" ref={dropdownRef}>
          <span className="typo-label" style={{ display: 'block', marginBottom: '4px' }}>Bill To</span>
          <button
            type="button"
            onClick={() => setShowClientDropdown(!showClientDropdown)}
            className="w-full text-left"
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: showClientDropdown ? '2px solid var(--ink-black)' : '1px solid var(--bone)',
              padding: '6px 28px 6px 0',
              fontSize: '14px',
              fontFamily: 'var(--font-body)',
              color: selectedClient ? 'var(--ink-black)' : 'var(--ash)',
              cursor: 'pointer',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23181011' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 4px center',
              transition: 'border-color 0.2s',
            }}
          >
            {selectedClient?.name || 'Select client'}
          </button>

          {showClientDropdown && (
            <div
              className="absolute z-50 w-full"
              style={{
                top: '100%',
                marginTop: '4px',
                background: 'var(--pure-white)',
                border: '1px solid var(--bone)',
                borderRadius: 'var(--radius)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                maxHeight: '240px',
                overflowY: 'auto',
              }}
            >
              <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--bone)' }}>
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  className="input-field input-field-sm"
                  autoFocus
                />
              </div>
              <div className="scrollbar-thin" style={{ maxHeight: '180px', overflowY: 'auto', padding: '4px' }}>
                {filteredClients.map((client) => (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => {
                      onUpdate({ clientId: client.id })
                      setShowClientDropdown(false)
                      setClientSearch('')
                    }}
                    className="w-full text-left flex items-center gap-3"
                    style={{
                      padding: '10px 12px',
                      fontSize: '13px',
                      background: header.clientId === client.id ? 'rgba(24,16,17,0.04)' : 'transparent',
                      border: 'none',
                      borderRadius: 'var(--radius)',
                      cursor: 'pointer',
                      color: 'var(--ink-black)',
                      fontFamily: 'var(--font-body)',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={(e) => { if (header.clientId !== client.id) e.currentTarget.style.background = 'rgba(24,16,17,0.03)' }}
                    onMouseLeave={(e) => { if (header.clientId !== client.id) e.currentTarget.style.background = 'transparent' }}
                  >
                    <div className="flex-1 min-w-0">
                      <div style={{ fontWeight: 700 }}>{client.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--ash)', marginTop: '1px' }}>{client.email}</div>
                    </div>
                    {header.clientId === client.id && <Check size={14} color="var(--ink-black)" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Purchase Order */}
        <div>
          <span className="typo-label" style={{ display: 'block', marginBottom: '4px' }}>Purchase Order</span>
          <input
            type="text"
            value={header.purchaseOrder}
            onChange={(e) => onUpdate({ purchaseOrder: e.target.value })}
            placeholder="PO number"
            className="input-field"
          />
        </div>

        {/* Issue Date + Due Date on same row */}
        <div className="sm:col-span-2 grid grid-cols-2 gap-4">
          <div>
            <span className="typo-label" style={{ display: 'block', marginBottom: '4px' }}>Issue Date</span>
            <input
              type="date"
              value={header.issueDate}
              onChange={(e) => onUpdate({ issueDate: e.target.value })}
              className="input-field"
              style={{ fontSize: '13px' }}
            />
          </div>
          <div>
            <span className="typo-label" style={{ display: 'block', marginBottom: '4px' }}>Due Date</span>
            <input
              type="date"
              value={header.dueDate}
              onChange={(e) => onUpdate({ dueDate: e.target.value })}
              className="input-field"
              style={{ fontSize: '13px' }}
            />
          </div>
        </div>
      </div>

      {/* ── Custom Header Fields ── */}
      {header.customFields.length > 0 && (
        <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--bone)' }}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-3">
            {header.customFields.map((field, idx) => (
              <div key={idx}>
                <div className="flex items-center gap-1" style={{ marginBottom: '4px' }}>
                  <span className="typo-label">{field.label}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const fields = header.customFields.filter((_, i) => i !== idx)
                      onUpdate({ customFields: fields })
                    }}
                    className="btn-icon btn-icon-sm"
                    style={{ width: '16px', height: '16px', padding: '0' }}
                  >
                    <X size={10} />
                  </button>
                </div>
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => {
                    const fields = [...header.customFields]
                    fields[idx] = { ...fields[idx], value: e.target.value }
                    onUpdate({ customFields: fields })
                  }}
                  className="input-field"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Add Custom Field ── */}
      <div style={{ marginTop: '10px' }}>
        <button
          type="button"
          onClick={() => {
            const label = prompt('Field name:')
            if (label) {
              onUpdate({
                customFields: [...header.customFields, { label, value: '' }],
              })
            }
          }}
          className="btn-ghost"
          style={{ fontSize: '11px', padding: '4px 8px' }}
        >
          <Plus size={12} />
          Add field
        </button>
      </div>
    </div>
  )
}

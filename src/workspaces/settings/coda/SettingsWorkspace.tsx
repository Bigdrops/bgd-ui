import { useState, useRef, useEffect, type ChangeEvent } from 'react'
import {
  User, Building2, Palette, Landmark, PenSquare,
  Sun, Moon, Bell, FileText, Hash,
  Archive, Shield, ChevronRight, Save, X,
  Check, Smartphone, Mail, MessageSquare,
  type LucideIcon,
} from 'lucide-react'
import './index.css'

/* ---------------------------------------------------------
   Coda design tokens — Cream Parchment, Obsidian, Charcoal
   --------------------------------------------------------- */
const token = {
  bg: '#f8f9eb',
  card: '#ffffff',
  border: '#c0c2a9',
  borderStrong: '#000000',
  ink: '#000000',
  inkSoft: '#5a5a4f',
  inkMuted: '#7c7d76',
  bone: '#edeee1',
  charcoal: '#202020',
  mint: '#aafdc0',
  forest: '#003d21',
  lilac: '#d3beff',
  sky: '#b0f4ff',
  rose: '#ffc0e6',
  white: '#ffffff',
}

const fontDisplay = "'Archivo', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
const fontBody = "'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
const fontMono = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"

let uid = 100
const nextId = () => `id${uid++}`

/* ---------------------------------------------------------
   PRIMITIVES
   --------------------------------------------------------- */
function PillBadge({ label, variant = 'default' }: { label: string; variant?: 'default' | 'mint' | 'forest' }) {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    default: { bg: 'transparent', text: token.ink, border: token.border },
    mint: { bg: token.mint, text: token.forest, border: token.mint },
    forest: { bg: token.forest, text: token.white, border: token.forest },
  }
  const c = colors[variant]
  return (
    <span
      className="inline-block text-[10px] uppercase tracking-wider px-[9px] py-[4px] leading-none"
      style={{
        fontFamily: fontMono,
        borderRadius: 9999,
        border: `1.5px solid ${c.border}`,
        background: c.bg,
        color: c.text,
      }}
    >
      {label}
    </span>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={`mb-3 ${className}`}
      style={{
        background: token.card,
        border: `1.5px solid ${token.border}`,
        borderRadius: 22,
        overflow: 'hidden',
      }}
    >
      {children}
    </section>
  )
}

function GroupHeader({ icon: Icon, label, accent }: { icon: LucideIcon; label: string; accent: string }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3"
      style={{ borderBottom: `1.5px solid ${token.border}` }}
    >
      <div
        className="w-9 h-9 rounded-[9px] flex items-center justify-center shrink-0"
        style={{ background: accent, color: token.ink }}
      >
        <Icon size={17} strokeWidth={2} />
      </div>
      <span
        className="text-[15px] font-extrabold uppercase tracking-tight"
        style={{ fontFamily: fontDisplay, color: token.ink, letterSpacing: '-0.01em' }}
      >
        {label}
      </span>
    </div>
  )
}

function SettingRow({
  icon: Icon,
  label,
  description,
  control,
  onClick,
  expanded,
  accent,
}: {
  icon: LucideIcon
  label: string
  description?: string
  control?: React.ReactNode
  onClick?: () => void
  expanded?: boolean
  accent?: string
}) {
  const row = (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3.5 min-h-[52px] cursor-pointer select-none transition-colors hover:bg-[#f3f4e6]"
      style={{ borderBottom: `1px solid ${token.bone}` }}
    >
      <div
        className="w-9 h-9 rounded-[9px] flex items-center justify-center shrink-0"
        style={{ background: accent || token.bone, color: accent ? token.ink : token.inkSoft }}
      >
        <Icon size={17} strokeWidth={1.8} />
      </div>
      <div className="flex-1 min-w-0">
        <div
          className="text-[14px] font-medium leading-tight"
          style={{ fontFamily: fontBody, color: token.ink, letterSpacing: '-0.01em' }}
        >
          {label}
        </div>
        {description && (
          <div
            className="text-[12px] mt-0.5 leading-snug"
            style={{ fontFamily: fontBody, color: token.inkMuted, letterSpacing: '-0.01em' }}
          >
            {description}
          </div>
        )}
      </div>
      <div className="shrink-0 flex items-center">
        {control || <ChevronRight size={16} style={{ color: token.border, transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />}
      </div>
    </div>
  )
  return row
}

function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      aria-label={label || 'Toggle'}
      className="relative shrink-0 rounded-full transition-colors"
      style={{
        width: 44,
        height: 24,
        background: checked ? token.forest : token.border,
        border: `1.5px solid ${checked ? token.forest : token.border}`,
      }}
    >
      <span
        className="absolute rounded-full bg-white transition-transform"
        style={{
          width: 18,
          height: 18,
          top: 2,
          left: 2,
          transform: checked ? 'translateX(20px)' : 'none',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        }}
      />
    </button>
  )
}

function SegmentedControl({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div
      className="flex rounded-[9px] overflow-hidden"
      style={{ border: `1.5px solid ${token.border}` }}
    >
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="flex-1 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider transition-colors"
            style={{
              fontFamily: fontMono,
              background: active ? token.charcoal : 'transparent',
              color: active ? token.white : token.inkSoft,
              borderRight: opt !== options[options.length - 1] ? `1px solid ${token.border}` : 'none',
            }}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

function CollapsibleContent({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <div
      className="overflow-hidden transition-all duration-300 ease-in-out"
      style={{
        maxHeight: open ? 600 : 0,
        opacity: open ? 1 : 0,
      }}
    >
      <div className="px-4 pb-4 pt-1" style={{ background: token.bg }}>
        {children}
      </div>
    </div>
  )
}

function Field({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 w-full min-w-0">
      {label && (
        <label
          className="text-[10px] font-medium uppercase tracking-wider"
          style={{ fontFamily: fontMono, color: token.inkSoft }}
        >
          {label}
        </label>
      )}
      {children}
    </div>
  )
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      type={type}
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      placeholder={placeholder}
      className="w-full px-3 py-2 text-[13px] outline-none rounded-[9px] transition-colors"
      style={{
        fontFamily: fontBody,
        border: `1.5px solid ${focused ? token.borderStrong : token.border}`,
        color: token.ink,
        background: token.white,
        letterSpacing: '-0.01em',
      }}
    />
  )
}

function GhostButton({
  children,
  onClick,
  small,
  danger,
}: {
  children: React.ReactNode
  onClick?: () => void
  small?: boolean
  danger?: boolean
}) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`inline-flex items-center justify-center gap-1.5 font-medium transition-colors ${
        small ? 'text-[11px] px-3 py-1.5' : 'text-[12px] px-4 py-2'
      }`}
      style={{
        fontFamily: fontDisplay,
        borderRadius: 9,
        border: `1.5px solid ${
          danger && hover ? token.rose : hover ? token.borderStrong : token.border
        }`,
        color: danger && hover ? '#c41e3a' : token.ink,
        background: 'transparent',
        letterSpacing: '-0.01em',
        minHeight: small ? 32 : 38,
      }}
    >
      {children}
    </button>
  )
}

function PrimaryButton({
  children,
  onClick,
  full,
}: {
  children: React.ReactNode
  onClick?: () => void
  full?: boolean
}) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all ${
        full ? 'w-full' : ''
      }`}
      style={{
        fontFamily: fontDisplay,
        borderRadius: 13,
        background: hover ? '#2a2a2a' : token.charcoal,
        color: token.white,
        padding: '10px 20px',
        fontSize: 13,
        letterSpacing: '-0.01em',
        minHeight: 40,
        border: 'none',
      }}
    >
      {children}
    </button>
  )
}

/* ---------------------------------------------------------
   SETTINGS WORKSPACE
   --------------------------------------------------------- */
export default function SettingsWorkspace() {
  /* ── Account ── */
  const [userName, setUserName] = useState('Alex Morgan')
  const [userEmail, setUserEmail] = useState('alex@example.com')
  const [userPhone, setUserPhone] = useState('+1 (555) 123-4567')
  const [companyName, setCompanyName] = useState('Studio Coda')
  const [companyTagline, setCompanyTagline] = useState('Design & Development')
  const [companyAddress, setCompanyAddress] = useState('123 Creative Lane, Brooklyn, NY')

  /* ── Workspace ── */
  const [brandColor, setBrandColor] = useState('#003d21')
  const [bankName, setBankName] = useState('Merchant Bank')
  const [bankAccount, setBankAccount] = useState('•••• 4821')
  const [signatoryName, setSignatoryName] = useState('Alex Morgan')
  const [signatoryTitle, setSignatoryTitle] = useState('Creative Director')

  /* ── Preferences ── */
  const [themeMode, setThemeMode] = useState('system')
  const [notifEmail, setNotifEmail] = useState(true)
  const [notifPush, setNotifPush] = useState(true)
  const [notifSms, setNotifSms] = useState(false)
  const [docFormat, setDocFormat] = useState('pdf')
  const [invPrefix, setInvPrefix] = useState('INV')
  const [estPrefix, setEstPrefix] = useState('EST')

  /* ── System ── */
  const [archiveCount] = useState(24)
  const [isAdmin] = useState(false)

  /* ── UI State ── */
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [toast, setToast] = useState('')
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const showToast = (msg: string) => {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 2000)
  }

  const toggle = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  useEffect(() => {
    const link = document.createElement('link')
    link.href =
      'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    return () => {
      document.head.removeChild(link)
    }
  }, [])

  return (
    <div
      style={{ background: token.bg, minHeight: '100vh', fontFamily: fontBody }}
      className="pb-28"
    >
      <div className="max-w-2xl mx-auto px-3 pt-4 sm:px-5 sm:pt-6">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4 px-1">
          <h1
            className="text-[26px] font-extrabold uppercase tracking-tight"
            style={{
              fontFamily: fontDisplay,
              color: token.ink,
              letterSpacing: '-0.01em',
              lineHeight: 1.13,
            }}
          >
            Settings
          </h1>
          <PillBadge label="v2.1.0" variant="mint" />
        </div>

        {/* ──── ACCOUNT ──── */}
        <Card>
          <GroupHeader icon={User} label="Account" accent={token.lilac} />

          <SettingRow
            icon={User}
            label="User Profile"
            description="Name, email, phone"
            expanded={expanded.userProfile}
            onClick={() => toggle('userProfile')}
            accent={token.lilac}
          />
          <CollapsibleContent open={!!expanded.userProfile}>
            <div className="flex flex-col gap-2.5">
              <Field label="Full Name">
                <TextInput value={userName} onChange={setUserName} placeholder="Your name" />
              </Field>
              <Field label="Email">
                <TextInput value={userEmail} onChange={setUserEmail} placeholder="email@example.com" />
              </Field>
              <Field label="Phone">
                <TextInput value={userPhone} onChange={setUserPhone} placeholder="+1 (555) 000-0000" />
              </Field>
              <div className="flex gap-2 pt-1">
                <GhostButton
                  small
                  onClick={() => {
                    setUserName('Alex Morgan')
                    setUserEmail('alex@example.com')
                    setUserPhone('+1 (555) 123-4567')
                    showToast('Profile reset')
                  }}
                >
                  Reset
                </GhostButton>
                <GhostButton
                  small
                  onClick={() => showToast('Profile updated')}
                >
                  <Check size={12} /> Save
                </GhostButton>
              </div>
            </div>
          </CollapsibleContent>

          <SettingRow
            icon={Building2}
            label="Company Info"
            description="Business details"
            expanded={expanded.companyInfo}
            onClick={() => toggle('companyInfo')}
            accent={token.lilac}
          />
          <CollapsibleContent open={!!expanded.companyInfo}>
            <div className="flex flex-col gap-2.5">
              <Field label="Company Name">
                <TextInput value={companyName} onChange={setCompanyName} placeholder="Business name" />
              </Field>
              <Field label="Tagline">
                <TextInput value={companyTagline} onChange={setCompanyTagline} placeholder="Tagline" />
              </Field>
              <Field label="Address">
                <TextInput value={companyAddress} onChange={setCompanyAddress} placeholder="Address" />
              </Field>
              <div className="flex gap-2 pt-1">
                <GhostButton small onClick={() => showToast('Company info saved')}>
                  <Check size={12} /> Save
                </GhostButton>
              </div>
            </div>
          </CollapsibleContent>
        </Card>

        {/* ──── WORKSPACE ──── */}
        <Card>
          <GroupHeader icon={Palette} label="Workspace" accent={token.mint} />

          <SettingRow
            icon={Palette}
            label="Branding"
            description="Colors & logo"
            expanded={expanded.branding}
            onClick={() => toggle('branding')}
            accent={token.mint}
          />
          <CollapsibleContent open={!!expanded.branding}>
            <div className="flex flex-col gap-3">
              <div>
                <div
                  className="w-full h-20 rounded-[13px] flex items-center justify-center mb-2"
                  style={{ background: brandColor, border: `1.5px solid ${token.border}` }}
                >
                  <span
                    className="text-[11px] font-medium uppercase tracking-wider"
                    style={{ fontFamily: fontMono, color: token.white }}
                  >
                    Brand Preview
                  </span>
                </div>
                <Field label="Brand Color">
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="w-9 h-9 rounded-[9px] border-none cursor-pointer p-0.5"
                      style={{ background: 'transparent' }}
                    />
                    <span
                      className="text-[12px] font-mono"
                      style={{ fontFamily: fontMono, color: token.inkSoft }}
                    >
                      {brandColor}
                    </span>
                  </div>
                </Field>
              </div>
              <div
                className="rounded-[13px] px-4 py-3 flex items-center gap-3 cursor-pointer"
                style={{ border: `1.5px dashed ${token.border}` }}
              >
                <div
                  className="w-9 h-9 rounded-[9px] flex items-center justify-center"
                  style={{ background: token.bone }}
                >
                  <FileText size={16} style={{ color: token.inkSoft }} />
                </div>
                <span
                  className="text-[12px] font-medium"
                  style={{ color: token.inkSoft, letterSpacing: '-0.01em' }}
                >
                  Tap to upload logo
                </span>
              </div>
              <GhostButton small onClick={() => showToast('Branding saved')}>
                <Check size={12} /> Save Branding
              </GhostButton>
            </div>
          </CollapsibleContent>

          <SettingRow
            icon={Landmark}
            label="Banking"
            description="Bank accounts"
            expanded={expanded.banking}
            onClick={() => toggle('banking')}
            accent={token.mint}
          />
          <CollapsibleContent open={!!expanded.banking}>
            <div className="flex flex-col gap-2.5">
              <div
                className="rounded-[13px] px-4 py-3 flex items-center gap-3"
                style={{
                  border: `1.5px solid ${token.forest}`,
                  background: token.mint,
                }}
              >
                <div className="w-8 h-8 rounded-[9px] flex items-center justify-center shrink-0 bg-white">
                  <Landmark size={15} style={{ color: token.forest }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    className="text-[13px] font-medium"
                    style={{ fontFamily: fontBody, color: token.forest }}
                  >
                    {bankName}
                  </div>
                  <div
                    className="text-[11px]"
                    style={{ fontFamily: fontMono, color: token.forest, opacity: 0.7 }}
                  >
                    {bankAccount}
                  </div>
                </div>
                <Check size={14} style={{ color: token.forest }} />
              </div>
              <GhostButton small onClick={() => showToast('Add bank account')}>
                + Add Account
              </GhostButton>
            </div>
          </CollapsibleContent>

          <SettingRow
            icon={PenSquare}
            label="Signatories"
            description="Authorized signers"
            expanded={expanded.signatories}
            onClick={() => toggle('signatories')}
            accent={token.mint}
          />
          <CollapsibleContent open={!!expanded.signatories}>
            <div className="flex flex-col gap-2.5">
              <Field label="Signatory Name">
                <TextInput value={signatoryName} onChange={setSignatoryName} placeholder="Full name" />
              </Field>
              <Field label="Title">
                <TextInput value={signatoryTitle} onChange={setSignatoryTitle} placeholder="e.g. CEO" />
              </Field>
              <GhostButton small onClick={() => showToast('Signatory saved')}>
                <Check size={12} /> Save Signatory
              </GhostButton>
            </div>
          </CollapsibleContent>
        </Card>

        {/* ──── PREFERENCES ──── */}
        <Card>
          <GroupHeader icon={Sun} label="Preferences" accent={token.sky} />

          <div className="px-4 py-3.5" style={{ borderBottom: `1px solid ${token.bone}` }}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <div
                  className="text-[14px] font-medium"
                  style={{ fontFamily: fontBody, color: token.ink, letterSpacing: '-0.01em' }}
                >
                  Theme & Appearance
                </div>
                <div
                  className="text-[12px] mt-0.5"
                  style={{ fontFamily: fontBody, color: token.inkMuted, letterSpacing: '-0.01em' }}
                >
                  Light / Dark / System
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Sun size={14} style={{ color: themeMode === 'light' ? token.forest : token.inkMuted }} />
                <SegmentedControl
                  value={themeMode}
                  onChange={(v) => {
                    setThemeMode(v)
                    showToast(`Theme: ${v}`)
                  }}
                  options={[
                    { value: 'light', label: 'Light' },
                    { value: 'dark', label: 'Dark' },
                    { value: 'system', label: 'System' },
                  ]}
                />
                <Moon size={14} style={{ color: themeMode === 'dark' ? token.forest : token.inkMuted }} />
              </div>
            </div>
          </div>

          <SettingRow
            icon={Bell}
            label="Notifications"
            description="Email, push, SMS"
            expanded={expanded.notifications}
            onClick={() => toggle('notifications')}
            accent={token.sky}
          />
          <CollapsibleContent open={!!expanded.notifications}>
            <div className="flex flex-col gap-0.5">
              {[
                { key: 'email', icon: Mail, label: 'Email', desc: 'Invoice updates & reports', value: notifEmail, set: setNotifEmail },
                { key: 'push', icon: Smartphone, label: 'Push', desc: 'Mobile notifications', value: notifPush, set: setNotifPush },
                { key: 'sms', icon: MessageSquare, label: 'SMS', desc: 'Critical alerts only', value: notifSms, set: setNotifSms },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center gap-3 py-2.5"
                  style={{ borderBottom: `1px solid ${token.bone}` }}
                >
                  <div
                    className="w-8 h-8 rounded-[9px] flex items-center justify-center shrink-0"
                    style={{ background: token.white }}
                  >
                    <item.icon size={15} style={{ color: token.inkSoft }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-[13px] font-medium"
                      style={{ fontFamily: fontBody, color: token.ink, letterSpacing: '-0.01em' }}
                    >
                      {item.label}
                    </div>
                    <div
                      className="text-[11px]"
                      style={{ fontFamily: fontBody, color: token.inkMuted, letterSpacing: '-0.01em' }}
                    >
                      {item.desc}
                    </div>
                  </div>
                  <Switch
                    checked={item.value}
                    onChange={(v) => {
                      item.set(v)
                      showToast(`${item.label} ${v ? 'enabled' : 'disabled'}`)
                    }}
                  />
                </div>
              ))}
            </div>
          </CollapsibleContent>

          <div className="px-4 py-3.5" style={{ borderBottom: `1px solid ${token.bone}` }}>
            <div className="flex items-center justify-between">
              <div>
                <div
                  className="text-[14px] font-medium"
                  style={{ fontFamily: fontBody, color: token.ink, letterSpacing: '-0.01em' }}
                >
                  Document Controls
                </div>
                <div
                  className="text-[12px] mt-0.5"
                  style={{ fontFamily: fontBody, color: token.inkMuted, letterSpacing: '-0.01em' }}
                >
                  Default export format
                </div>
              </div>
              <SegmentedControl
                value={docFormat}
                onChange={(v) => {
                  setDocFormat(v)
                  showToast(`Format: ${v.toUpperCase()}`)
                }}
                options={[
                  { value: 'pdf', label: 'PDF' },
                  { value: 'html', label: 'HTML' },
                  { value: 'csv', label: 'CSV' },
                ]}
              />
            </div>
          </div>

          <SettingRow
            icon={Hash}
            label="Document Prefixes"
            description="Invoice, estimate numbering"
            expanded={expanded.prefixes}
            onClick={() => toggle('prefixes')}
            accent={token.sky}
          />
          <CollapsibleContent open={!!expanded.prefixes}>
            <div className="grid grid-cols-2 gap-2.5">
              <Field label="Invoice Prefix">
                <TextInput
                  value={invPrefix}
                  onChange={(v) => {
                    setInvPrefix(v.toUpperCase())
                  }}
                  placeholder="INV"
                />
              </Field>
              <Field label="Estimate Prefix">
                <TextInput
                  value={estPrefix}
                  onChange={(v) => {
                    setEstPrefix(v.toUpperCase())
                  }}
                  placeholder="EST"
                />
              </Field>
            </div>
            <div className="mt-2.5">
              <GhostButton small onClick={() => showToast('Prefixes saved')}>
                <Check size={12} /> Save Prefixes
              </GhostButton>
            </div>
          </CollapsibleContent>
        </Card>

        {/* ──── SYSTEM ──── */}
        <Card>
          <GroupHeader icon={Archive} label="System" accent={token.rose} />

          <SettingRow
            icon={Archive}
            label="Archives"
            description={`${archiveCount} archived records`}
            expanded={expanded.archives}
            onClick={() => toggle('archives')}
            accent={token.rose}
          />
          <CollapsibleContent open={!!expanded.archives}>
            <div
              className="rounded-[13px] px-4 py-3 flex items-center justify-between"
              style={{ border: `1.5px solid ${token.border}` }}
            >
              <div>
                <div
                  className="text-[13px] font-medium"
                  style={{ fontFamily: fontBody, color: token.ink, letterSpacing: '-0.01em' }}
                >
                  Storage Used
                </div>
                <div
                  className="text-[11px] mt-0.5"
                  style={{ fontFamily: fontMono, color: token.inkMuted }}
                >
                  2.4 GB of 10 GB
                </div>
              </div>
              <div
                className="h-2 w-24 rounded-full overflow-hidden"
                style={{ background: token.bone }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: '24%', background: token.forest }}
                />
              </div>
            </div>
            <GhostButton small onClick={() => showToast('Archive management')}>
              Manage Archives
            </GhostButton>
          </CollapsibleContent>

          <div className="relative">
            <SettingRow
              icon={Shield}
              label="Admin Panel"
              description="User management & permissions"
              accent={token.rose}
              control={
                <PillBadge label={isAdmin ? 'Active' : 'Restricted'} variant={isAdmin ? 'mint' : 'default'} />
              }
            />
            {!isAdmin && (
              <div
                className="absolute inset-0 rounded-b-[22px] cursor-pointer flex items-center justify-center"
                style={{
                  background: 'rgba(248, 249, 235, 0.7)',
                  backdropFilter: 'blur(2px)',
                }}
                onClick={() => showToast('Admin access required')}
              >
                <span
                  className="text-[11px] font-medium uppercase tracking-wider"
                  style={{ fontFamily: fontMono, color: token.inkSoft }}
                >
                  Contact admin for access
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col gap-2 pt-2 pb-4">
          <PrimaryButton full onClick={() => showToast('All settings saved')}>
            <Save size={15} /> Save All Settings
          </PrimaryButton>
        </div>
      </div>

      {/* FLOATING SAVE */}
      <button
        onClick={() => showToast('Settings saved')}
        aria-label="Save settings"
        className="fixed bottom-6 right-5 z-50 flex items-center justify-center rounded-full"
        style={{
          width: 54,
          height: 54,
          background: token.charcoal,
          color: token.white,
          border: `1.5px solid ${token.charcoal}`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        <Save size={20} />
      </button>

      {/* TOAST */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] pointer-events-none w-[calc(100%-32px)] max-w-sm">
        <div
          className="rounded-[13px] px-5 py-2.5 text-[12px] font-medium text-center transition-all duration-300"
          style={{
            fontFamily: fontBody,
            background: token.charcoal,
            color: token.white,
            border: `1.5px solid ${token.charcoal}`,
            opacity: toast ? 1 : 0,
            transform: toast ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.95)',
            letterSpacing: '-0.01em',
          }}
        >
          {toast}
        </div>
      </div>
    </div>
  )
}

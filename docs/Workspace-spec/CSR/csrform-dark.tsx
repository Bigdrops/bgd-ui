import { useState, useRef, useCallback } from "react";

/* ---------------------------------------------------------
   CSR Form — corrected row density.
   Rule: pack 2–3 short fields per row, even on mobile.
   Exception: Problem & Service section (long-form textareas)
   stays one field per row — everything else should not.
   Recipient signature is intentionally left minimal — it's a
   rare-case field, not something to over-engineer here.
--------------------------------------------------------- */

const c = {
  bg: "#000000",
  card: "#08090b",
  border: "#232323",
  fog: "#b3b3b5",
  chalk: "#e2e8f0",
  white: "#ffffff",
  amber: "#f5a623",
  red: "#ef4444",
};

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 min-w-0 w-full">
      <label className="text-[10px] font-medium uppercase tracking-wider" style={{ color: c.fog }}>
        {label}
      </label>
      {children}
      {hint && <span className="text-[10px]" style={{ color: "#6b7280" }}>{hint}</span>}
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2.5 rounded-[14px] text-[13px] outline-none bg-black border transition-colors";
const inputStyle = (focused: boolean) => ({
  borderColor: focused ? c.chalk : c.border,
  color: c.white,
});

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      {...props}
      onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
      onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
      className={inputCls}
      style={inputStyle(focused)}
    />
  );
}

function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      {...props}
      onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
      onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
      className={inputCls + " appearance-none pr-8 bg-no-repeat"}
      style={{
        ...inputStyle(focused),
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23b3b3b5' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")",
        backgroundPosition: "right 12px center",
      }}
    >
      {children}
    </select>
  );
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      {...props}
      onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
      onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
      className={inputCls + " resize-y"}
      style={{ ...inputStyle(focused), minHeight: props.style?.minHeight ?? 84 }}
    />
  );
}

function LockedField({ value, onClick }: { value: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-[14px] text-left text-[13px]"
      style={{ background: c.border, color: c.chalk }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </svg>
      {value}
    </button>
  );
}

function Card({ n, title, action, children }: { n: string; title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-[22px] p-4 mb-3" style={{ background: c.card, border: `1px solid ${c.border}` }}>
      <div className="flex items-center justify-between gap-2 pb-3 mb-3.5" style={{ borderBottom: `1px solid ${c.border}` }}>
        <div className="flex items-center gap-2">
          <div className="grid grid-cols-3 gap-[2px]">
            {[0, 1, 2].map((i) => <span key={i} className="w-[4px] h-[4px] bg-white rotate-45" />)}
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider">{n}. {title}</span>
        </div>
        {action}
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}

function ToggleLink({ shown, onClick }: { shown: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-[11px] underline" style={{ color: c.fog }}>
      {shown ? "Hide section" : "Show section"}
    </button>
  );
}

type MaterialRow = { item: string; quantity: string; unit: string };

export default function CsrFormScreen() {
  const [mode, setMode] = useState<"new" | "edit">("new");
  const [isOnline, setIsOnline] = useState(true);
  const [saving] = useState(false);
  const [csrNumberReady] = useState(true);

  const [csr, setCsr] = useState<Record<string, any>>({
    client_name: "Zenith Manufacturing Ltd (Ikeja)",
    csr_number: "CSR-2026-0041",
    date: "2026-07-28",
    po_number: "",
    customer_name: "Engr. Babatunde Fashola",
    call_type: "",
    service_basis: "",
    system_down: "",
    equipment_type: "Step-Up Power Transformer",
    equipment_location: "Substation Bay B-2",
    make: "Schneider Electric",
    capacity: "500 KVA",
    model: "TR-500-NX",
    serial_no: "SN-88492011",
    engine_no: "",
    problem_reported: "Substation feeder relay tripping intermittently under peak induction loads.",
    service_rendered: "Calibrated protection relays, checked primary bushing integrity, and executed load bank testing.",
    defects_found: "Minor thermal degradation on Phase A cable lug connection.",
    engineer_remarks: "Replaced terminal lug and tightened torque to specification. System fully stabilized.",
    start_date: "2026-07-28",
    start_time: "09:00",
    end_date: "2026-07-28",
    end_time: "14:30",
    status_after_service: "Complete",
    voltage: "415V",
    frequency: "50.1 Hz",
    battery: "27.4V",
    temperature: "48°C",
    pressure: "1.2 bar",
    hours: "4,120 hrs",
    technician_name: "Chinedu Okonkwo (Senior Lead)",
    acknowledgement_name: "Engr. Babatunde Fashola (Head of Plant)",
    customer_feedback: "Work completed professionally and on schedule. Feeder tests satisfactory.",
  });

  const [meta, setMeta] = useState({
    showOperationalReadings: true,
    showTechnicianSignLine: true,
    showAcknowledgement: true,
    technicianName: "Chinedu Okonkwo (Senior Lead)",
  });

  const [materialsRows, setMaterialsRows] = useState<MaterialRow[]>([
    { item: "Copper Terminal Lug (120mm)", quantity: "2", unit: "Pcs" },
  ]);
  const [materialsTitle, setMaterialsTitle] = useState("Materials Used");

  const [signatorySheetOpen, setSignatorySheetOpen] = useState(false);
  const [activeSignatory, setActiveSignatory] = useState("Chinedu Okonkwo — Senior Lead");
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lastGoodCsrNumber = useRef(csr.csr_number);

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2200);
  };

  const onUpdate = useCallback((field: string, value: any) => {
    setCsr((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "po_number" && value) next.show_po = true;
      return next;
    });
  }, []);

  const onUpdateMaterialRow = (i: number, field: keyof MaterialRow, value: string) => {
    setMaterialsRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)));
  };
  const addMaterialRow = () => setMaterialsRows((prev) => [...prev, { item: "", quantity: "1", unit: "Pcs" }]);
  const removeMaterialRow = (i: number) => {
    if (materialsRows.length <= 1) { showToast("At least one material row required"); return; }
    setMaterialsRows((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleCsrNumberBlur = () => {
    if (!csr.csr_number.trim()) {
      onUpdate("csr_number", lastGoodCsrNumber.current);
      showToast("Restored last valid CSR number");
    }
  };
  const handleCsrNumberChange = (v: string) => {
    onUpdate("csr_number", v);
    if (v.trim()) lastGoodCsrNumber.current = v;
  };

  const saveDisabled = saving || !isOnline || !csrNumberReady || !String(csr.csr_number || "").trim();

  const triggerSave = () => {
    if (saveDisabled) { showToast(!isOnline ? "Offline — save disabled" : "CSR number required"); return; }
    showToast("onSave() → sanitizeCsrInsertPayload() → upsert csrs (retry x3) → audit log");
  };

  return (
    <div className="min-h-screen pb-32" style={{ background: c.bg, color: c.white, fontFamily: "Inter, ui-sans-serif, system-ui" }}>
      <div className="max-w-2xl mx-auto px-3 sm:px-5 pt-4">

        {/* Top bar */}
        <div className="flex items-center justify-between gap-3 pb-3 mb-4" style={{ borderBottom: `1px solid ${c.border}` }}>
          <span className="text-[13px]" style={{ color: c.fog }}>BIGDROPS / CSR</span>
          <div className="flex items-center gap-2">
            {!isOnline && (
              <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full"
                style={{ background: "rgba(245,166,35,0.12)", border: `1px solid ${c.amber}`, color: c.amber }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.amber }} />
                Offline
              </span>
            )}
            <div className="inline-flex rounded-full p-0.5 gap-0.5" style={{ border: `1px solid ${c.border}` }}>
              {(["new", "edit"] as const).map((m) => (
                <button key={m} onClick={() => setMode(m)}
                  className="text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full"
                  style={{ background: mode === m ? c.white : "transparent", color: mode === m ? c.bg : c.fog }}>
                  {m}
                </button>
              ))}
            </div>
            {/* dev-only preview toggle */}
            <button onClick={() => setIsOnline((v) => !v)} className="text-[10px] underline" style={{ color: c.fog }}>
              toggle net
            </button>
          </div>
        </div>

        <div className="mb-4">
          <span className="text-[11px] uppercase tracking-wider block mb-1" style={{ color: c.fog }}>
            {mode === "edit" ? "Edit CSR" : "New CSR"}
          </span>
          <h1 className="text-[28px] font-light tracking-tight">{mode === "edit" ? "Update CSR" : "Create CSR"}</h1>
        </div>

        {/* SECTION 1 — Document Details */}
        <Card n="1" title="Document Details">
          <Field label="Client">
            {mode === "new" ? (
              <button onClick={() => showToast("ClientSelector opens")}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-[14px] text-[13px] font-medium"
                style={{ background: "#000", border: `1px solid ${c.border}`, color: c.white }}>
                {csr.client_name}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c.fog} strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
              </button>
            ) : (
              <LockedField value={csr.client_name} onClick={() => showToast("onLockedFieldClick('client')")} />
            )}
          </Field>

          {/* CSR Number + Date share a row; PO Number + Customer Name share a row */}
          <div className="grid grid-cols-2 gap-2.5">
            <Field label="CSR Number">
              {mode === "new" ? (
                <TextInput value={csr.csr_number} onChange={(e) => handleCsrNumberChange(e.target.value)} onBlur={handleCsrNumberBlur}
                  className={inputCls + " font-mono font-bold"} style={inputStyle(false)} />
              ) : (
                <LockedField value={csr.csr_number} onClick={() => showToast("onLockedFieldClick('csr_number')")} />
              )}
            </Field>
            <Field label="Date">
              <TextInput type="date" value={csr.date} onChange={(e) => onUpdate("date", e.target.value)} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <Field label="P.O. Number" hint="Optional">
              <TextInput placeholder="Optional" value={csr.po_number} onChange={(e) => onUpdate("po_number", e.target.value)} className={inputCls + " font-mono"} style={inputStyle(false)} />
            </Field>
            <Field label="Customer Contact">
              {mode === "new" ? (
                <TextInput value={csr.customer_name} onChange={(e) => onUpdate("customer_name", e.target.value)} />
              ) : (
                <LockedField value={csr.customer_name} onClick={() => showToast("onLockedFieldClick — same as client")} />
              )}
            </Field>
          </div>
        </Card>

        {/* SECTION 2 — Item Controls */}
        <Card n="2" title="Item Controls">
          <button onClick={() => showToast("CsrImportSheet opens")}
            className="w-full py-2.5 rounded-full text-[12px] font-medium" style={{ border: `1px solid ${c.border}` }}>
            Import
          </button>
        </Card>

        {/* SECTION 3 — Main Details: 3 fields, one row, always */}
        <Card n="3" title="Main Details">
          <div className="grid grid-cols-3 gap-2">
            <Field label="Call Type">
              <Select value={csr.call_type} onChange={(e) => onUpdate("call_type", e.target.value)}>
                <option value="">Select...</option>
                <option>Breakdown</option>
                <option>Preventive Maintenance</option>
                <option>Installation</option>
                <option>Commissioning</option>
                <option>Inspection</option>
                <option>Emergency Repair</option>
                <option>Other</option>
              </Select>
            </Field>
            <Field label="Service Basis">
              <Select value={csr.service_basis} onChange={(e) => onUpdate("service_basis", e.target.value)}>
                <option value="">Select...</option>
                <option>Paid Service</option>
                <option>AMC</option>
                <option>Warranty</option>
              </Select>
            </Field>
            <Field label="System Down">
              <Select value={csr.system_down} onChange={(e) => onUpdate("system_down", e.target.value ? e.target.value === "Yes" : null)}>
                <option value="">Select...</option>
                <option>Yes</option>
                <option>No</option>
              </Select>
            </Field>
          </div>
        </Card>

        {/* SECTION 4 — Equipment: 2 / 3 / 2 */}
        <Card n="4" title="Equipment">
          <div className="grid grid-cols-2 gap-2.5">
            <Field label="Equipment Type">
              <TextInput value={csr.equipment_type} onChange={(e) => onUpdate("equipment_type", e.target.value)} />
            </Field>
            <Field label="Equipment Location">
              <TextInput value={csr.equipment_location} onChange={(e) => onUpdate("equipment_location", e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Field label="Make">
              <TextInput value={csr.make} onChange={(e) => onUpdate("make", e.target.value)} />
            </Field>
            <Field label="Capacity">
              <TextInput value={csr.capacity} onChange={(e) => onUpdate("capacity", e.target.value)} />
            </Field>
            <Field label="Model">
              <TextInput value={csr.model} onChange={(e) => onUpdate("model", e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <Field label="Serial No.">
              <TextInput value={csr.serial_no} onChange={(e) => onUpdate("serial_no", e.target.value)} className={inputCls + " font-mono"} style={inputStyle(false)} />
            </Field>
            <Field label="Engine No." hint="Optional">
              <TextInput placeholder="N/A" value={csr.engine_no} onChange={(e) => onUpdate("engine_no", e.target.value)} />
            </Field>
          </div>
        </Card>

        {/* SECTION 5 — Problem & Service: the one section that stays one field per row */}
        <Card n="5" title="Problem & Service">
          <Field label="Problem Reported">
            <TextArea value={csr.problem_reported} onChange={(e) => onUpdate("problem_reported", e.target.value)} style={{ minHeight: 84 }} />
          </Field>
          <Field label="Service Rendered">
            <TextArea value={csr.service_rendered} onChange={(e) => onUpdate("service_rendered", e.target.value)} style={{ minHeight: 96 }} />
          </Field>
          <Field label="Defects Found">
            <TextArea value={csr.defects_found} onChange={(e) => onUpdate("defects_found", e.target.value)} />
          </Field>
          <Field label="Engineer Remarks">
            <TextArea value={csr.engineer_remarks} onChange={(e) => onUpdate("engineer_remarks", e.target.value)} />
          </Field>
        </Card>

        {/* SECTION 6 — Service Execution: 2 / 2 / status alone (nothing left to pair) */}
        <Card n="6" title="Service Execution">
          <div className="grid grid-cols-2 gap-2.5">
            <Field label="Start Date"><TextInput type="date" value={csr.start_date} onChange={(e) => onUpdate("start_date", e.target.value)} /></Field>
            <Field label="Start Time"><TextInput type="time" value={csr.start_time} onChange={(e) => onUpdate("start_time", e.target.value)} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <Field label="End Date"><TextInput type="date" value={csr.end_date} onChange={(e) => onUpdate("end_date", e.target.value)} /></Field>
            <Field label="End Time"><TextInput type="time" value={csr.end_time} onChange={(e) => onUpdate("end_time", e.target.value)} /></Field>
          </div>
          <Field label="Status After Service">
            <Select value={csr.status_after_service} onChange={(e) => onUpdate("status_after_service", e.target.value)}>
              <option>Complete</option>
              <option>Incomplete</option>
              <option>Pending for spares</option>
              <option>Under observation</option>
              <option>Working solution provided</option>
            </Select>
          </Field>
        </Card>

        {/* SECTION 7 — Operational Readings: 3 per row x2, toggleable */}
        <Card n="7" title="Operational Readings"
          action={<ToggleLink shown={meta.showOperationalReadings} onClick={() => setMeta((m) => ({ ...m, showOperationalReadings: !m.showOperationalReadings }))} />}>
          {meta.showOperationalReadings && (
            <>
              <div className="grid grid-cols-3 gap-2">
                <Field label="Voltage"><TextInput value={csr.voltage} onChange={(e) => onUpdate("voltage", e.target.value)} /></Field>
                <Field label="Frequency"><TextInput value={csr.frequency} onChange={(e) => onUpdate("frequency", e.target.value)} /></Field>
                <Field label="Battery"><TextInput value={csr.battery} onChange={(e) => onUpdate("battery", e.target.value)} /></Field>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Field label="Temperature"><TextInput value={csr.temperature} onChange={(e) => onUpdate("temperature", e.target.value)} /></Field>
                <Field label="Pressure"><TextInput value={csr.pressure} onChange={(e) => onUpdate("pressure", e.target.value)} /></Field>
                <Field label="Hours"><TextInput value={csr.hours} onChange={(e) => onUpdate("hours", e.target.value)} /></Field>
              </div>
            </>
          )}
        </Card>

        {/* SECTION 8 — Materials Used */}
        <Card n="8" title="" action={
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-[10px]" style={{ background: c.border, color: c.fog }}>
            {materialsRows.length} {materialsRows.length === 1 ? "item" : "items"}
          </span>
        }>
          <input value={materialsTitle} onChange={(e) => setMaterialsTitle(e.target.value)}
            className="bg-transparent outline-none text-[11px] font-bold uppercase tracking-wider -mt-6 mb-1 w-fit" />
          {materialsRows.map((row, i) => (
            <div key={i} className="grid gap-2 items-end p-2.5 rounded-[14px]" style={{ gridTemplateColumns: "1.4fr 70px 70px auto", border: `1px solid ${c.border}` }}>
              <Field label="Item"><TextInput value={row.item} onChange={(e) => onUpdateMaterialRow(i, "item", e.target.value)} /></Field>
              <Field label="Qty"><TextInput type="number" value={row.quantity} onChange={(e) => onUpdateMaterialRow(i, "quantity", e.target.value)} /></Field>
              <Field label="Unit"><TextInput value={row.unit} onChange={(e) => onUpdateMaterialRow(i, "unit", e.target.value)} /></Field>
              {materialsRows.length > 1 && (
                <button onClick={() => removeMaterialRow(i)} className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ border: `1px solid ${c.border}`, color: c.fog }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              )}
            </div>
          ))}
          <button onClick={addMaterialRow} className="w-full py-2.5 rounded-[14px] text-[12px]" style={{ border: `1px dashed ${c.border}`, color: c.fog }}>
            + Add material
          </button>
        </Card>

        {/* SECTION 9 — Technician */}
        <Card n="9" title="Technician"
          action={<ToggleLink shown={meta.showTechnicianSignLine} onClick={() => setMeta((m) => ({ ...m, showTechnicianSignLine: !m.showTechnicianSignLine }))} />}>
          {meta.showTechnicianSignLine && (
            <>
              <Field label="Technician Name">
                <TextInput value={meta.technicianName} onChange={(e) => setMeta((m) => ({ ...m, technicianName: e.target.value }))} />
              </Field>
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-[14px]" style={{ border: `1px solid ${c.border}` }}>
                <div>
                  <span className="text-[9px] uppercase tracking-wider block" style={{ color: "#6b7280" }}>Signature</span>
                  <span className="text-[12px] font-semibold">{activeSignatory}</span>
                </div>
                <button onClick={() => setSignatorySheetOpen(true)} className="text-[11px] underline font-semibold">Change</button>
              </div>
            </>
          )}
        </Card>

        {/* SECTION 10 — Acknowledgement (recipient signature kept minimal, rare-case field) */}
        <Card n="10" title="Acknowledgement"
          action={<ToggleLink shown={meta.showAcknowledgement} onClick={() => setMeta((m) => ({ ...m, showAcknowledgement: !m.showAcknowledgement }))} />}>
          {meta.showAcknowledgement && (
            <>
              <Field label="Recipient Name / Title">
                <TextInput value={csr.acknowledgement_name} onChange={(e) => onUpdate("acknowledgement_name", e.target.value)} />
              </Field>
              <Field label="Comment">
                <TextArea value={csr.customer_feedback} onChange={(e) => onUpdate("customer_feedback", e.target.value)} />
              </Field>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px]" style={{ color: "#6b7280" }}>Recipient signature (optional, rare-case)</span>
                <button onClick={() => showToast("File picker → recipient_signature_uri")} className="text-[11px] underline" style={{ color: c.fog }}>
                  Upload
                </button>
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Floating save bar */}
      <div className="hidden sm:flex fixed bottom-5 right-5 items-center gap-2 p-2 rounded-full z-40" style={{ background: c.card, border: `1px solid ${c.border}` }}>
        <button onClick={() => showToast("Download blank CSR template")} className="px-4 py-2 rounded-full text-[11px]" style={{ border: `1px solid ${c.border}`, color: c.fog }}>
          Download blank
        </button>
        <button onClick={triggerSave} disabled={saveDisabled} className="px-5 py-2 rounded-full text-[11px] font-semibold disabled:opacity-40"
          style={{ background: c.white, color: c.bg }}>
          Save
        </button>
      </div>
      <button onClick={triggerSave} disabled={saveDisabled}
        className="sm:hidden fixed bottom-5 right-5 w-14 h-14 rounded-full flex items-center justify-center z-40 disabled:opacity-40"
        style={{ background: c.white, color: c.bg }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
      </button>

      {/* Signatory sheet */}
      {signatorySheetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }} onClick={() => setSignatorySheetOpen(false)}>
          <div className="w-full max-w-sm rounded-[22px] p-5" style={{ background: c.card, border: `1px solid ${c.border}` }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 mb-3" style={{ borderBottom: `1px solid ${c.border}` }}>
              <h3 className="text-lg font-light">Choose signatory</h3>
              <button onClick={() => setSignatorySheetOpen(false)}>✕</button>
            </div>
            {["Chinedu Okonkwo — Senior Lead", "Afolabi Adebayo — Lead Automation Engineer", "Leave blank for offline sign."].map((name) => (
              <button key={name} onClick={() => { setActiveSignatory(name); setSignatorySheetOpen(false); showToast("Signatory: " + name); }}
                className="w-full text-left p-3 rounded-[12px] text-[13px] mb-2"
                style={{ border: `1px solid ${activeSignatory === name ? c.white : c.border}`, background: activeSignatory === name ? c.border : "transparent" }}>
                {name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 sm:bottom-6 left-4 z-50 px-4 py-2.5 rounded-[12px] text-[11px] font-mono"
          style={{ background: "#1a1214", border: `1px solid ${c.border}`, color: c.white, maxWidth: "88vw" }}>
          {toast}
        </div>
      )}
    </div>
  );
}

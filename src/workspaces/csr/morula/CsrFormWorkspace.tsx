import { useState, useRef, useEffect } from "react";
import "./index.css";

const CALL_TYPES = ["Breakdown", "Preventive Maintenance", "Installation", "Commissioning", "Inspection", "Emergency Repair", "Other"];
const SERVICE_BASIS = ["Paid Service", "AMC", "Warranty"];
const STATUS_OPTIONS = ["Complete", "Incomplete", "Pending for spares", "Under observation", "Working solution provided"];
const CLIENTS = ["Acme Corp", "Techserve India", "Green Energy Ltd", "MediQuip Solutions", "BuildRight Infrastructure", "AquaPure Systems", "TransLogic Logistics"];
const DEFAULT_MATERIAL_ROW = { item: "", quantity: "", unit: "" };

function Select({ label, value, onChange, options, required }: {
  label: string; value: string; onChange: (v: string) => void;
  options: string[]; required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <label style={{ display: "block", fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 500, color: "var(--color-stone)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 5 }}>
          {label}
          {required && <span style={{ color: "var(--color-rose)", marginLeft: 2 }}>*</span>}
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: "var(--radius-input)",
          border: "1px solid var(--color-mist)",
          background: "var(--color-cream)",
          fontFamily: "var(--font-body)",
          fontSize: 14,
          fontWeight: 400,
          color: !value ? "var(--color-clay)" : "var(--color-charcoal)",
          textAlign: "left",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          transition: "border-color 0.2s ease",
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {value || "Select..."}
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-stone)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, transition: "transform 0.2s ease", transform: open ? "rotate(180deg)" : "rotate(0)" }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          zIndex: 50,
          marginTop: 4,
          borderRadius: "var(--radius-input)",
          border: "1px solid var(--color-mist)",
          background: "var(--color-ivory)",
          boxShadow: "0 8px 24px rgba(42,40,37,0.1), 0 2px 6px rgba(42,40,37,0.06)",
          overflow: "hidden",
          maxHeight: 200,
          overflowY: "auto",
        }}>
          {options.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => { onChange(o); setOpen(false); }}
              style={{
                width: "100%",
                padding: "10px 12px",
                background: value === o ? "var(--color-amber-light)" : "transparent",
                border: "none",
                fontFamily: "var(--font-body)",
                fontSize: 14,
                color: "var(--color-charcoal)",
                textAlign: "left",
                cursor: "pointer",
                transition: "background 0.1s ease",
              }}
              onMouseEnter={(e) => { if (value !== o) e.currentTarget.style.background = "var(--color-mist)"; }}
              onMouseLeave={(e) => { if (value !== o) e.currentTarget.style.background = "transparent"; }}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Input({ label, value, onChange, placeholder, mono, required, children }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; mono?: boolean; required?: boolean; children?: React.ReactNode;
}) {
  return (
    <div>
      <label style={{ display: "block", fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 500, color: "var(--color-stone)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 5 }}>
        {label}
        {required && <span style={{ color: "var(--color-rose)", marginLeft: 2 }}>*</span>}
      </label>
      {children || (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: "var(--radius-input)",
            border: "1px solid var(--color-mist)",
            background: "var(--color-cream)",
            fontFamily: mono ? "ui-monospace, monospace" : "var(--font-body)",
            fontSize: 14,
            fontWeight: mono ? 500 : 400,
            color: "var(--color-charcoal)",
            lineHeight: 1.5,
            transition: "border-color 0.2s ease",
          }}
          onFocus={(e) => { e.target.style.borderColor = "var(--color-amber)"; e.target.style.background = "var(--color-ivory)"; }}
          onBlur={(e) => { e.target.style.borderColor = "var(--color-mist)"; e.target.style.background = "var(--color-cream)"; }}
        />
      )}
    </div>
  );
}

function DateInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label style={{ display: "block", fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 500, color: "var(--color-stone)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 5 }}>{label}</label>
      <input type="date" value={value} onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", padding: "10px 12px", borderRadius: "var(--radius-input)", border: "1px solid var(--color-mist)", background: "var(--color-cream)", fontFamily: "var(--font-body)", fontSize: 14, color: "var(--color-charcoal)", transition: "border-color 0.2s ease" }}
        onFocus={(e) => { e.target.style.borderColor = "var(--color-amber)"; e.target.style.background = "var(--color-ivory)"; }}
        onBlur={(e) => { e.target.style.borderColor = "var(--color-mist)"; e.target.style.background = "var(--color-cream)"; }} />
    </div>
  );
}

function TimeInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label style={{ display: "block", fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 500, color: "var(--color-stone)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 5 }}>{label}</label>
      <input type="time" value={value} onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", padding: "10px 12px", borderRadius: "var(--radius-input)", border: "1px solid var(--color-mist)", background: "var(--color-cream)", fontFamily: "var(--font-body)", fontSize: 14, color: "var(--color-charcoal)", transition: "border-color 0.2s ease" }}
        onFocus={(e) => { e.target.style.borderColor = "var(--color-amber)"; e.target.style.background = "var(--color-ivory)"; }}
        onBlur={(e) => { e.target.style.borderColor = "var(--color-mist)"; e.target.style.background = "var(--color-cream)"; }} />
    </div>
  );
}

function TextArea({ label, value, onChange, minHeight, required }: {
  label: string; value: string; onChange: (v: string) => void; minHeight?: number; required?: boolean;
}) {
  return (
    <div>
      <label style={{ display: "block", fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 500, color: "var(--color-stone)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 5 }}>
        {label}
        {required && <span style={{ color: "var(--color-rose)", marginLeft: 2 }}>*</span>}
      </label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", padding: "10px 12px", borderRadius: "var(--radius-input)", border: "1px solid var(--color-mist)", background: "var(--color-cream)", fontFamily: "var(--font-body)", fontSize: 14, color: "var(--color-charcoal)", lineHeight: 1.6, resize: "vertical", minHeight: minHeight ?? 80, transition: "border-color 0.2s ease" }}
        onFocus={(e) => { e.target.style.borderColor = "var(--color-amber)"; e.target.style.background = "var(--color-ivory)"; }}
        onBlur={(e) => { e.target.style.borderColor = "var(--color-mist)"; e.target.style.background = "var(--color-cream)"; }} />
    </div>
  );
}

function Dialog({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(42,40,37,0.4)" }} />
      <div style={{
        position: "relative",
        background: "var(--color-ivory)",
        borderRadius: "var(--radius-card)",
        width: "100%",
        maxWidth: 480,
        maxHeight: "80vh",
        overflow: "auto",
        boxShadow: "0 20px 60px rgba(42,40,37,0.15), 0 8px 20px rgba(42,40,37,0.08)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid var(--color-mist)" }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 20, fontStyle: "italic", color: "var(--color-deep-teal)" }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-stone)", padding: 4 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div style={{ padding: "20px 24px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function CsrFormWorkspace() {
  const [client, setClient] = useState("");
  const [csrNumber, setCsrNumber] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [poNumber, setPoNumber] = useState("");
  const [callType, setCallType] = useState("");
  const [serviceBasis, setServiceBasis] = useState("");
  const [systemDown, setSystemDown] = useState("");
  const [equipmentType, setEquipmentType] = useState("");
  const [equipmentLocation, setEquipmentLocation] = useState("");
  const [make, setMake] = useState("");
  const [capacity, setCapacity] = useState("");
  const [model, setModel] = useState("");
  const [serialNo, setSerialNo] = useState("");
  const [engineNo, setEngineNo] = useState("");
  const [problemReported, setProblemReported] = useState("");
  const [serviceRendered, setServiceRendered] = useState("");
  const [defectsFound, setDefectsFound] = useState("");
  const [engineerRemarks, setEngineerRemarks] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [statusAfter, setStatusAfter] = useState("Complete");
  const [voltage, setVoltage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [battery, setBattery] = useState("");
  const [temperature, setTemperature] = useState("");
  const [pressure, setPressure] = useState("");
  const [hours, setHours] = useState("");
  const [showReadings, setShowReadings] = useState(false);
  const [materials, setMaterials] = useState([{ ...DEFAULT_MATERIAL_ROW }]);
  const [technicianName, setTechnicianName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [importJson, setImportJson] = useState("");

  const itemCount = materials.filter((r) => r.item || r.quantity || r.unit).length;
  const hasCsrNumber = csrNumber.trim().length > 0;

  const handleAddMaterial = () => setMaterials([...materials, { ...DEFAULT_MATERIAL_ROW }]);
  const handleRemoveMaterial = (i: number) => {
    if (materials.length > 1) setMaterials(materials.filter((_, idx) => idx !== i));
  };
  const handleMaterialChange = (i: number, field: "item" | "quantity" | "unit", val: string) => {
    const next = [...materials];
    next[i] = { ...next[i], [field]: val };
    setMaterials(next);
  };
  const handleSave = () => { setSaving(true); setTimeout(() => setSaving(false), 1200); };
  const handleImport = () => { setImportOpen(false); setImportJson(""); };

  return (
    <div className="morula-csr">
      <div style={{
        maxWidth: 640,
        margin: "0 auto",
        padding: "32px 16px 100px",
      }}>
        <header style={{ marginBottom: 24, textAlign: "center" }}>
          <span style={{ display: "inline-block", fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-amber)", padding: "3px 12px", border: "1px solid var(--color-amber-light)", borderRadius: "var(--radius-pill)", marginBottom: 10 }}>Field Service Record</span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontStyle: "italic", color: "var(--color-deep-teal)", lineHeight: 1.15, letterSpacing: "-0.02em" }}>CSR Form</h1>
        </header>

        <div style={{ marginBottom: 20 }}>
          <button
            onClick={() => setImportOpen(true)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "10px",
              borderRadius: "var(--radius-input)",
              border: "1px dashed var(--color-amber-light)",
              background: "transparent",
              fontFamily: "var(--font-body)",
              fontSize: 13,
              fontWeight: 500,
              color: "var(--color-amber)",
              cursor: "pointer",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(212,147,75,0.06)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Import
          </button>
        </div>

        <Dialog open={importOpen} onClose={() => setImportOpen(false)} title="Import CSR">
          <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--color-stone)", marginBottom: 12, lineHeight: 1.5 }}>Paste a CSR JSON object below to populate this form.</p>
          <textarea value={importJson} onChange={(e) => setImportJson(e.target.value)} placeholder={`{\n  "client": "...",\n  "call_type": "...",\n  ...\n}`}
            style={{ width: "100%", minHeight: 160, padding: "10px 12px", borderRadius: "var(--radius-input)", border: "1px solid var(--color-mist)", background: "var(--color-cream)", fontFamily: "ui-monospace, monospace", fontSize: 12, color: "var(--color-charcoal)", lineHeight: 1.6, resize: "vertical" }} />
          <div style={{ display: "flex", gap: 10, marginTop: 16, justifyContent: "flex-end" }}>
            <button onClick={() => setImportOpen(false)} style={{ padding: "8px 18px", borderRadius: "var(--radius-input)", border: "1px solid var(--color-mist)", background: "transparent", fontFamily: "var(--font-body)", fontSize: 13, color: "var(--color-stone)", cursor: "pointer" }}>Cancel</button>
            <button onClick={handleImport} disabled={!importJson.trim()} style={{ padding: "8px 18px", borderRadius: "var(--radius-input)", border: "none", background: importJson.trim() ? "var(--color-amber)" : "var(--color-mist)", fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 500, color: importJson.trim() ? "var(--color-ivory)" : "var(--color-stone)", cursor: importJson.trim() ? "pointer" : "not-allowed" }}>Apply Import</button>
          </div>
        </Dialog>

        <div style={{ background: "var(--color-ivory)", borderRadius: "var(--radius-card)", padding: 20, boxShadow: "0 1px 3px rgba(42,40,37,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid var(--color-mist)" }}>
            <span style={{ width: 3, height: 20, borderRadius: 2, background: "var(--color-amber)", flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontStyle: "italic", color: "var(--color-deep-teal)" }}>Service Call</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Select label="Client" value={client} onChange={setClient} options={CLIENTS} required />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Input label="CSR Number" value={csrNumber} onChange={setCsrNumber} mono required />
              <DateInput label="Date" value={date} onChange={setDate} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Select label="Call Type" value={callType} onChange={setCallType} options={CALL_TYPES} />
              <Select label="Service Basis" value={serviceBasis} onChange={setServiceBasis} options={SERVICE_BASIS} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Select label="System Down" value={systemDown} onChange={setSystemDown} options={["Yes", "No"]} />
              <Input label="PO Number" value={poNumber} onChange={setPoNumber} placeholder="Optional" />
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16, background: "var(--color-ivory)", borderRadius: "var(--radius-card)", padding: 20, boxShadow: "0 1px 3px rgba(42,40,37,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid var(--color-mist)" }}>
            <span style={{ width: 3, height: 20, borderRadius: 2, background: "var(--color-rose)", flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontStyle: "italic", color: "var(--color-deep-teal)" }}>Equipment</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Input label="Type" value={equipmentType} onChange={setEquipmentType} />
              <Input label="Location" value={equipmentLocation} onChange={setEquipmentLocation} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Input label="Make" value={make} onChange={setMake} />
              <Input label="Capacity" value={capacity} onChange={setCapacity} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Input label="Model" value={model} onChange={setModel} />
              <Input label="Serial No." value={serialNo} onChange={setSerialNo} />
            </div>
            <Input label="Engine No." value={engineNo} onChange={setEngineNo} placeholder="Optional" />
          </div>
        </div>

        <div style={{ marginTop: 16, background: "var(--color-ivory)", borderRadius: "var(--radius-card)", padding: 20, boxShadow: "0 1px 3px rgba(42,40,37,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid var(--color-mist)" }}>
            <span style={{ width: 3, height: 20, borderRadius: 2, background: "var(--color-deep-teal)", flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontStyle: "italic", color: "var(--color-deep-teal)" }}>Service Notes</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <TextArea label="Problem Reported" value={problemReported} onChange={setProblemReported} minHeight={72} />
            <TextArea label="Service Rendered" value={serviceRendered} onChange={setServiceRendered} minHeight={80} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <TextArea label="Defects Found" value={defectsFound} onChange={setDefectsFound} minHeight={60} />
              <TextArea label="Engineer Remarks" value={engineerRemarks} onChange={setEngineerRemarks} minHeight={60} />
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16, background: "var(--color-ivory)", borderRadius: "var(--radius-card)", padding: 20, boxShadow: "0 1px 3px rgba(42,40,37,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid var(--color-mist)" }}>
            <span style={{ width: 3, height: 20, borderRadius: 2, background: "var(--color-amber)", flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontStyle: "italic", color: "var(--color-deep-teal)" }}>Execution</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <DateInput label="Start Date" value={startDate} onChange={setStartDate} />
              <TimeInput label="Start Time" value={startTime} onChange={setStartTime} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <DateInput label="End Date" value={endDate} onChange={setEndDate} />
              <TimeInput label="End Time" value={endTime} onChange={setEndTime} />
            </div>
            <Select label="Status After Service" value={statusAfter} onChange={setStatusAfter} options={STATUS_OPTIONS} />
          </div>
        </div>

        <div style={{ marginTop: 16, background: "var(--color-ivory)", borderRadius: "var(--radius-card)", padding: 20, boxShadow: "0 1px 3px rgba(42,40,37,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid var(--color-mist)" }}>
            <span style={{ width: 3, height: 20, borderRadius: 2, background: "var(--color-rose)", flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontStyle: "italic", color: "var(--color-deep-teal)" }}>Readings</span>
          </div>
          <button onClick={() => setShowReadings(!showReadings)}
            style={{ alignSelf: "flex-start", background: "none", border: "none", fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 500, color: "var(--color-amber)", letterSpacing: "0.04em", textTransform: "uppercase", cursor: "pointer", padding: "4px 0" }}>
            {showReadings ? "− Hide" : "+ Add"}
          </button>
          {showReadings && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
              <Input label="Voltage" value={voltage} onChange={setVoltage} />
              <Input label="Frequency" value={frequency} onChange={setFrequency} />
              <Input label="Battery" value={battery} onChange={setBattery} />
              <Input label="Temperature" value={temperature} onChange={setTemperature} />
              <Input label="Pressure" value={pressure} onChange={setPressure} />
              <Input label="Hours" value={hours} onChange={setHours} />
            </div>
          )}
        </div>

        <div style={{ marginTop: 16, background: "var(--color-ivory)", borderRadius: "var(--radius-card)", padding: 20, boxShadow: "0 1px 3px rgba(42,40,37,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid var(--color-mist)" }}>
            <span style={{ width: 3, height: 20, borderRadius: 2, background: "var(--color-deep-teal)", flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontStyle: "italic", color: "var(--color-deep-teal)" }}>Materials</span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--color-stone)", display: "block", marginBottom: 10 }}>{itemCount} {itemCount === 1 ? "item" : "items"}</span>
          {materials.map((row, i) => (
            <div key={i} style={{ borderRadius: "var(--radius-input)", border: "1px solid var(--color-mist)", padding: 12, background: "var(--color-cream)", marginBottom: 8, position: "relative" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px", gap: 8 }}>
                <div>
                  <span style={{ fontSize: 10, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--color-stone)", fontWeight: 500, marginBottom: 3, display: "block" }}>Item</span>
                  <input type="text" value={row.item} onChange={(e) => handleMaterialChange(i, "item", e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 4, border: "1px solid var(--color-mist)", background: "var(--color-ivory)", fontFamily: "var(--font-body)", fontSize: 13, color: "var(--color-charcoal)" }} />
                </div>
                <div>
                  <span style={{ fontSize: 10, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--color-stone)", fontWeight: 500, marginBottom: 3, display: "block" }}>Qty</span>
                  <input type="number" value={row.quantity} onChange={(e) => handleMaterialChange(i, "quantity", e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 4, border: "1px solid var(--color-mist)", background: "var(--color-ivory)", fontFamily: "var(--font-body)", fontSize: 13, color: "var(--color-charcoal)" }} />
                </div>
                <div>
                  <span style={{ fontSize: 10, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--color-stone)", fontWeight: 500, marginBottom: 3, display: "block" }}>Unit</span>
                  <input type="text" value={row.unit} onChange={(e) => handleMaterialChange(i, "unit", e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 4, border: "1px solid var(--color-mist)", background: "var(--color-ivory)", fontFamily: "var(--font-body)", fontSize: 13, color: "var(--color-charcoal)" }} />
                </div>
              </div>
              {materials.length > 1 && (
                <button onClick={() => handleRemoveMaterial(i)}
                  style={{ position: "absolute", top: 6, right: 6, background: "none", border: "none", fontSize: 10, color: "var(--color-rose)", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button onClick={handleAddMaterial}
            style={{ width: "100%", padding: 10, borderRadius: "var(--radius-input)", border: "1px dashed var(--color-clay)", background: "transparent", fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 500, color: "var(--color-stone)", cursor: "pointer" }}>
            + Add item
          </button>
        </div>

        <div style={{ marginTop: 16, background: "var(--color-ivory)", borderRadius: "var(--radius-card)", padding: 20, boxShadow: "0 1px 3px rgba(42,40,37,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid var(--color-mist)" }}>
            <span style={{ width: 3, height: 20, borderRadius: 2, background: "var(--color-rose)", flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontStyle: "italic", color: "var(--color-deep-teal)" }}>Sign-off</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Input label="Technician" value={technicianName} onChange={setTechnicianName} />
              <Input label="Recipient" value={recipientName} onChange={setRecipientName} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ padding: "10px 12px", borderRadius: "var(--radius-input)", border: "1px solid var(--color-mist)", background: "var(--color-cream)" }}>
                <span style={{ fontSize: 10, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--color-stone)", fontWeight: 500, display: "block", marginBottom: 3 }}>Tech Signature</span>
                <span style={{ fontSize: 13, color: "var(--color-clay)" }}>Leave blank for offline sign.</span>
              </div>
              <div style={{ padding: "10px 12px", borderRadius: "var(--radius-input)", border: "1px solid var(--color-mist)", background: "var(--color-cream)" }}>
                <span style={{ fontSize: 10, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--color-stone)", fontWeight: 500, display: "block", marginBottom: 3 }}>Recipient Signature</span>
                <span style={{ fontSize: 13, color: "var(--color-clay)" }}>Leave blank for offline sign.</span>
              </div>
            </div>
            <TextArea label="Feedback" value={feedback} onChange={setFeedback} minHeight={60} />
          </div>
        </div>
      </div>

      <button onClick={handleSave} disabled={!hasCsrNumber || saving}
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 50,
          width: 48, height: 48,
          borderRadius: "50%",
          border: "none",
          background: !hasCsrNumber || saving ? "var(--color-mist)" : "linear-gradient(135deg, var(--color-amber), #c97b4b)",
          color: !hasCsrNumber || saving ? "var(--color-stone)" : "var(--color-ivory)",
          cursor: !hasCsrNumber || saving ? "not-allowed" : "pointer",
          boxShadow: "0 3px 12px rgba(212,147,75,0.35)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.2s ease",
        }}>
        {saving ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
        )}
      </button>

      <style>{`
        .morula-csr { min-height: 100vh; background: var(--color-cream); font-family: var(--font-body); }
        @media (max-width: 420px) {
          .morula-csr div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

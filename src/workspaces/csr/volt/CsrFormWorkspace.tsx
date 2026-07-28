import { useState, useRef, useEffect } from "react";
import "./index.css";

const CALL_TYPES = ["Breakdown", "Preventive Maintenance", "Installation", "Commissioning", "Inspection", "Emergency Repair", "Other"];
const SERVICE_BASIS = ["Paid Service", "AMC", "Warranty"];
const STATUS_OPTIONS = ["Complete", "Incomplete", "Pending for spares", "Under observation", "Working solution provided"];
const CLIENTS = ["Acme Corp", "Techserve India", "Green Energy Ltd", "MediQuip Solutions", "BuildRight Infrastructure", "AquaPure Systems", "TransLogic Logistics"];
const DEFAULT_MATERIAL_ROW = { item: "", quantity: "", unit: "" };

function FieldTag({ required }: { required?: boolean }) {
  return null;
}

function Drop({ label, value, onChange, options, required }: {
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
      <label style={{ display: "block", fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 400, color: "var(--color-steel)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 5 }}>
        <span style={{ color: "var(--color-steel)" }}>{">"}</span> {label}
        {required && <span style={{ color: "var(--color-cyan)", marginLeft: 2 }}>*</span>}
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: "var(--radius-input)",
          border: "1px solid var(--color-border)",
          background: "var(--color-pitch)",
          fontFamily: "var(--font-body)",
          fontSize: 13,
          fontWeight: 300,
          color: !value ? "var(--color-steel)" : "var(--color-snow)",
          textAlign: "left",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          transition: "border-color 0.2s ease",
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-cyan)"; e.currentTarget.style.boxShadow = "0 0 8px var(--color-cyan-glow)"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.boxShadow = "none"; }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {value || "Select..."}
        </span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--color-steel)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, transition: "transform 0.2s ease", transform: open ? "rotate(180deg)" : "rotate(0)" }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50,
          marginTop: 4, borderRadius: "var(--radius-input)",
          border: "1px solid var(--color-cyan)", background: "var(--color-night)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4), 0 0 20px var(--color-cyan-dim)",
          overflow: "hidden", maxHeight: 200, overflowY: "auto",
        }}>
          {options.map((o) => (
            <button key={o} type="button" onClick={() => { onChange(o); setOpen(false); }}
              style={{ width: "100%", padding: "10px 12px", background: value === o ? "var(--color-cyan-dim)" : "transparent", border: "none", fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 300, color: value === o ? "var(--color-cyan)" : "var(--color-smoke)", textAlign: "left", cursor: "pointer", transition: "background 0.1s ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-void)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = value === o ? "var(--color-cyan-dim)" : "transparent"; }}>
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Val({ label, value, onChange, placeholder, mono, required, children }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; mono?: boolean; required?: boolean; children?: React.ReactNode;
}) {
  return (
    <div>
      <label style={{ display: "block", fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 400, color: "var(--color-steel)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 5 }}>
        <span style={{ color: "var(--color-steel)" }}>{">"}</span> {label}
        {required && <span style={{ color: "var(--color-cyan)", marginLeft: 2 }}>*</span>}
      </label>
      {children || (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          style={{ width: "100%", padding: "10px 12px", borderRadius: "var(--radius-input)", border: "1px solid var(--color-border)", background: "var(--color-pitch)", fontFamily: mono ? "ui-monospace, monospace" : "var(--font-body)", fontSize: 13, fontWeight: mono ? 500 : 300, color: "var(--color-snow)", lineHeight: 1.5, transition: "border-color 0.2s ease, box-shadow 0.2s ease" }}
          onFocus={(e) => { e.target.style.borderColor = "var(--color-cyan)"; e.target.style.boxShadow = "0 0 8px var(--color-cyan-glow)"; e.target.style.background = "var(--color-void)"; }}
          onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; e.target.style.boxShadow = "none"; e.target.style.background = "var(--color-pitch)"; }} />
      )}
    </div>
  );
}

function Dat({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label style={{ display: "block", fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 400, color: "var(--color-steel)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 5 }}>
        <span style={{ color: "var(--color-steel)" }}>{">"}</span> {label}
      </label>
      <input type="date" value={value} onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", padding: "10px 12px", borderRadius: "var(--radius-input)", border: "1px solid var(--color-border)", background: "var(--color-pitch)", fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 300, color: "var(--color-snow)", transition: "border-color 0.2s ease" }}
        onFocus={(e) => { e.target.style.borderColor = "var(--color-cyan)"; e.target.style.boxShadow = "0 0 8px var(--color-cyan-glow)"; e.target.style.background = "var(--color-void)"; }}
        onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; e.target.style.boxShadow = "none"; e.target.style.background = "var(--color-pitch)"; }} />
    </div>
  );
}

function Tim({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label style={{ display: "block", fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 400, color: "var(--color-steel)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 5 }}>
        <span style={{ color: "var(--color-steel)" }}>{">"}</span> {label}
      </label>
      <input type="time" value={value} onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", padding: "10px 12px", borderRadius: "var(--radius-input)", border: "1px solid var(--color-border)", background: "var(--color-pitch)", fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 300, color: "var(--color-snow)", transition: "border-color 0.2s ease" }}
        onFocus={(e) => { e.target.style.borderColor = "var(--color-cyan)"; e.target.style.boxShadow = "0 0 8px var(--color-cyan-glow)"; e.target.style.background = "var(--color-void)"; }}
        onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; e.target.style.boxShadow = "none"; e.target.style.background = "var(--color-pitch)"; }} />
    </div>
  );
}

function Blk({ label, value, onChange, minHeight, required }: {
  label: string; value: string; onChange: (v: string) => void; minHeight?: number; required?: boolean;
}) {
  return (
    <div>
      <label style={{ display: "block", fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 400, color: "var(--color-steel)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 5 }}>
        <span style={{ color: "var(--color-steel)" }}>{">"}</span> {label}
        {required && <span style={{ color: "var(--color-cyan)", marginLeft: 2 }}>*</span>}
      </label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", padding: "10px 12px", borderRadius: "var(--radius-input)", border: "1px solid var(--color-border)", background: "var(--color-pitch)", fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 300, color: "var(--color-snow)", lineHeight: 1.7, resize: "vertical", minHeight: minHeight ?? 72, transition: "border-color 0.2s ease, box-shadow 0.2s ease" }}
        onFocus={(e) => { e.target.style.borderColor = "var(--color-cyan)"; e.target.style.boxShadow = "0 0 8px var(--color-cyan-glow)"; e.target.style.background = "var(--color-void)"; }}
        onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; e.target.style.boxShadow = "none"; e.target.style.background = "var(--color-pitch)"; }} />
    </div>
  );
}

function Panel({ label, accent, children }: { label: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--color-night)", borderRadius: "var(--radius-card)", border: "1px solid var(--color-border)", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderBottom: "1px solid var(--color-border)", background: "var(--color-void)" }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: accent, boxShadow: `0 0 6px ${accent}`, flexShrink: 0 }} />
        <span style={{ fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 700, color: "var(--color-steel)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{label}</span>
      </div>
      <div style={{ padding: 18 }}>{children}</div>
    </div>
  );
}

function Dialog({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }} />
      <div style={{ position: "relative", background: "var(--color-night)", borderRadius: "var(--radius-card)", border: "1px solid var(--color-border)", width: "100%", maxWidth: 480, maxHeight: "80vh", overflow: "auto", boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 40px var(--color-cyan-dim)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid var(--color-border)", background: "var(--color-void)" }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 700, color: "var(--color-cyan)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-steel)", padding: 4 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div style={{ padding: "18px 22px" }}>{children}</div>
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
    <div className="volt-csr">
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "28px 16px 100px" }}>
        <header style={{ padding: "16px 0", borderBottom: "1px solid var(--color-border)", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-cyan)", boxShadow: "0 0 6px var(--color-cyan-glow)" }} />
              <span style={{ fontFamily: "var(--font-display)", fontSize: 10, fontWeight: 700, color: "var(--color-cyan)", letterSpacing: "0.15em", textTransform: "uppercase" }}>FIELD SERVICE REPORT</span>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "var(--color-snow)", lineHeight: 1.15, letterSpacing: "-0.01em" }}>CSR Record</h1>
          </div>
          <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 10, color: "var(--color-steel)", textAlign: "right", lineHeight: 1.7 }}>
            <div>CSR-{csrNumber || "____"}</div>
            <div>{date || "____-__-__"}</div>
          </div>
        </header>

        <button onClick={() => setImportOpen(true)}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px", borderRadius: "var(--radius-btn)", border: "1px dashed var(--color-border)", background: "transparent", fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 400, color: "var(--color-steel)", letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", marginBottom: 16, transition: "border-color 0.2s ease, color 0.2s ease" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          Import
        </button>

        <Dialog open={importOpen} onClose={() => setImportOpen(false)} title="IMPORT CSR">
          <p style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 300, color: "var(--color-smoke)", marginBottom: 12, lineHeight: 1.6 }}>Paste a CSR JSON object to populate this form.</p>
          <textarea value={importJson} onChange={(e) => setImportJson(e.target.value)} placeholder={`{\n  "client": "...",\n  ...\n}`}
            style={{ width: "100%", minHeight: 150, padding: "10px 12px", borderRadius: "var(--radius-input)", border: "1px solid var(--color-border)", background: "var(--color-pitch)", fontFamily: "ui-monospace, monospace", fontSize: 11, color: "var(--color-snow)", lineHeight: 1.6, resize: "vertical" }} />
          <div style={{ display: "flex", gap: 10, marginTop: 14, justifyContent: "flex-end" }}>
            <button onClick={() => setImportOpen(false)} style={{ padding: "8px 16px", borderRadius: "var(--radius-btn)", border: "1px solid var(--color-border)", background: "transparent", fontFamily: "var(--font-body)", fontSize: 11, color: "var(--color-steel)", cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase" }}>Cancel</button>
            <button onClick={handleImport} disabled={!importJson.trim()} style={{ padding: "8px 16px", borderRadius: "var(--radius-btn)", border: "none", background: importJson.trim() ? "var(--color-cyan)" : "var(--color-border)", fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 500, color: importJson.trim() ? "var(--color-pitch)" : "var(--color-steel)", cursor: importJson.trim() ? "pointer" : "not-allowed", letterSpacing: "0.08em", textTransform: "uppercase" }}>Apply</button>
          </div>
        </Dialog>

        <Panel label="Service Call" accent="#56f0d4">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Drop label="Client" value={client} onChange={setClient} options={CLIENTS} required />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Val label="CSR Number" value={csrNumber} onChange={setCsrNumber} mono required />
              <Dat label="Date" value={date} onChange={setDate} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Drop label="Call Type" value={callType} onChange={setCallType} options={CALL_TYPES} />
              <Drop label="Service Basis" value={serviceBasis} onChange={setServiceBasis} options={SERVICE_BASIS} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Drop label="System Down" value={systemDown} onChange={setSystemDown} options={["Yes", "No"]} />
              <Val label="PO Number" value={poNumber} onChange={setPoNumber} placeholder="Optional" />
            </div>
          </div>
        </Panel>

        <div style={{ marginTop: 12 }}>
          <Panel label="Equipment" accent="#34d399">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Val label="Type" value={equipmentType} onChange={setEquipmentType} />
                <Val label="Location" value={equipmentLocation} onChange={setEquipmentLocation} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Val label="Make" value={make} onChange={setMake} />
                <Val label="Capacity" value={capacity} onChange={setCapacity} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Val label="Model" value={model} onChange={setModel} />
                <Val label="Serial No." value={serialNo} onChange={setSerialNo} />
              </div>
              <Val label="Engine No." value={engineNo} onChange={setEngineNo} placeholder="Optional" />
            </div>
          </Panel>
        </div>

        <div style={{ marginTop: 12 }}>
          <Panel label="Service Log" accent="#f59e0b">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Blk label="Problem Reported" value={problemReported} onChange={setProblemReported} minHeight={72} />
              <Blk label="Service Rendered" value={serviceRendered} onChange={setServiceRendered} minHeight={80} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Blk label="Defects Found" value={defectsFound} onChange={setDefectsFound} minHeight={56} />
                <Blk label="Engineer Remarks" value={engineerRemarks} onChange={setEngineerRemarks} minHeight={56} />
              </div>
            </div>
          </Panel>
        </div>

        <div style={{ marginTop: 12 }}>
          <Panel label="Execution" accent="#56f0d4">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Dat label="Start Date" value={startDate} onChange={setStartDate} />
                <Tim label="Start Time" value={startTime} onChange={setStartTime} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Dat label="End Date" value={endDate} onChange={setEndDate} />
                <Tim label="End Time" value={endTime} onChange={setEndTime} />
              </div>
              <Drop label="Status After Service" value={statusAfter} onChange={setStatusAfter} options={STATUS_OPTIONS} />
            </div>
          </Panel>
        </div>

        <div style={{ marginTop: 12 }}>
          <Panel label="Readings" accent="#8b5cf6">
            <button onClick={() => setShowReadings(!showReadings)}
              style={{ display: "flex", alignItems: "center", gap: 6, background: showReadings ? "var(--color-cyan-dim)" : "transparent", border: "1px solid var(--color-border)", borderRadius: "var(--radius-btn)", padding: "5px 12px", fontFamily: "var(--font-body)", fontSize: 10, color: "var(--color-cyan)", cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase", transition: "all 0.2s ease" }}>
              <span style={{ fontSize: 12, lineHeight: 1 }}>{showReadings ? "−" : "+"}</span>
              {showReadings ? "Hide" : "Readings"}
            </button>
            {showReadings && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
                <Val label="Voltage" value={voltage} onChange={setVoltage} />
                <Val label="Frequency" value={frequency} onChange={setFrequency} />
                <Val label="Battery" value={battery} onChange={setBattery} />
                <Val label="Temperature" value={temperature} onChange={setTemperature} />
                <Val label="Pressure" value={pressure} onChange={setPressure} />
                <Val label="Hours" value={hours} onChange={setHours} />
              </div>
            )}
          </Panel>
        </div>

        <div style={{ marginTop: 12 }}>
          <Panel label="Materials" accent="#34d399">
            <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 10, color: "var(--color-steel)", display: "block", marginBottom: 8 }}>
              {">"} {itemCount} {itemCount === 1 ? "entry" : "entries"}
            </span>
            {materials.map((row, i) => (
              <div key={i} style={{ borderRadius: "var(--radius-card)", border: "1px solid var(--color-border)", padding: 12, background: "var(--color-pitch)", marginBottom: 8, position: "relative" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 72px 72px", gap: 8 }}>
                  <div>
                    <span style={{ fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-steel)", marginBottom: 3, display: "block", fontFamily: "var(--font-body)" }}>{">"} Item</span>
                    <input type="text" value={row.item} onChange={(e) => handleMaterialChange(i, "item", e.target.value)}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 2, border: "1px solid var(--color-border)", background: "var(--color-void)", fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 300, color: "var(--color-snow)" }} />
                  </div>
                  <div>
                    <span style={{ fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-steel)", marginBottom: 3, display: "block", fontFamily: "var(--font-body)" }}>{">"} Qty</span>
                    <input type="number" value={row.quantity} onChange={(e) => handleMaterialChange(i, "quantity", e.target.value)}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 2, border: "1px solid var(--color-border)", background: "var(--color-void)", fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 300, color: "var(--color-snow)" }} />
                  </div>
                  <div>
                    <span style={{ fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-steel)", marginBottom: 3, display: "block", fontFamily: "var(--font-body)" }}>{">"} Unit</span>
                    <input type="text" value={row.unit} onChange={(e) => handleMaterialChange(i, "unit", e.target.value)}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 2, border: "1px solid var(--color-border)", background: "var(--color-void)", fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 300, color: "var(--color-snow)" }} />
                  </div>
                </div>
                {materials.length > 1 && (
                  <button onClick={() => handleRemoveMaterial(i)}
                    style={{ position: "absolute", top: 4, right: 6, background: "none", border: "none", fontSize: 9, color: "var(--color-steel)", cursor: "pointer", fontFamily: "var(--font-body)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    [x]
                  </button>
                )}
              </div>
            ))}
            <button onClick={handleAddMaterial}
              style={{ width: "100%", padding: 10, borderRadius: "var(--radius-btn)", border: "1px dashed var(--color-border)", background: "transparent", fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 400, color: "var(--color-steel)", cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              [ + add entry ]
            </button>
          </Panel>
        </div>

        <div style={{ marginTop: 12 }}>
          <Panel label="Sign-off" accent="#f59e0b">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Val label="Technician" value={technicianName} onChange={setTechnicianName} />
                <Val label="Recipient" value={recipientName} onChange={setRecipientName} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ padding: "10px 12px", borderRadius: "var(--radius-input)", border: "1px solid var(--color-border)", background: "var(--color-pitch)" }}>
                  <span style={{ fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-steel)", fontWeight: 400, display: "block", marginBottom: 3, fontFamily: "var(--font-body)" }}>{">"} Tech Signature</span>
                  <span style={{ fontSize: 12, fontWeight: 300, color: "var(--color-steel)" }}>Leave blank for offline sign.</span>
                </div>
                <div style={{ padding: "10px 12px", borderRadius: "var(--radius-input)", border: "1px solid var(--color-border)", background: "var(--color-pitch)" }}>
                  <span style={{ fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-steel)", fontWeight: 400, display: "block", marginBottom: 3, fontFamily: "var(--font-body)" }}>{">"} Recipient Signature</span>
                  <span style={{ fontSize: 12, fontWeight: 300, color: "var(--color-steel)" }}>Leave blank for offline sign.</span>
                </div>
              </div>
              <Blk label="Feedback" value={feedback} onChange={setFeedback} minHeight={56} />
            </div>
          </Panel>
        </div>
      </div>

      <button onClick={handleSave} disabled={!hasCsrNumber || saving}
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 50,
          width: 44, height: 44,
          borderRadius: "var(--radius-btn)",
          border: "1px solid var(--color-cyan)",
          background: !hasCsrNumber || saving ? "transparent" : "var(--color-cyan-dim)",
          color: !hasCsrNumber || saving ? "var(--color-steel)" : "var(--color-cyan)",
          cursor: !hasCsrNumber || saving ? "not-allowed" : "pointer",
          animation: !hasCsrNumber || saving ? "none" : "pulse-glow 2.5s ease-in-out infinite",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.2s ease",
        }}>
        {saving ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
        )}
      </button>

      <style>{`
        .volt-csr { min-height: 100vh; background: var(--color-pitch); font-family: var(--font-body); }
        @media (max-width: 420px) {
          .volt-csr div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

import { useState, useMemo, useRef, useCallback, useEffect, memo } from "react";
import {
  Plus, Trash2, Copy, ChevronUp, ChevronDown,
  Upload, PenLine, FolderOpen, X, Save,
  FolderPlus, ListPlus, Check, Landmark, EllipsisVertical,
  FileText, SlidersHorizontal, Link2,
} from "lucide-react";
import { calcTotals, calcRowTotal, numberToWords, money } from "@/lib/calculations";
import "./index.css";

let uid = 100;
const nextId = () => `id${uid++}`;

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section className="dit-card">
      {title && <h2 className="dit-subheading">{title}</h2>}
      {children}
    </section>
  );
}

function Field({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 w-full min-w-0">
      {label && <label className="dit-label">{label}</label>}
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = "text", align, min, step }: {
  value: string | number; onChange: (v: string) => void; placeholder?: string; type?: string; align?: string; min?: number; step?: number;
}) {
  return (
    <input
      type={type} value={value} min={min} step={step}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="dit-input"
      style={{ textAlign: (align || "left") as React.CSSProperties['textAlign'] }}
    />
  );
}

function Select({ value, onChange, options, children }: {
  value: string; onChange: (v: string) => void; options?: { value: string; label: string }[]; children?: React.ReactNode;
}) {
  return (
    <select
      value={value} onChange={(e) => onChange(e.target.value)}
      className="dit-input dit-select"
    >
      {options ? options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>) : children}
    </select>
  );
}

function GhostButton({ children, onClick, danger }: {
  children: React.ReactNode; onClick?: () => void; danger?: boolean;
}) {
  return (
    <button onClick={onClick}
      className={`dit-btn-ghost ${danger ? "dit-btn-ghost-danger" : ""}`}>
      {children}
    </button>
  );
}

function PrimaryButton({ children, onClick, full }: {
  children: React.ReactNode; onClick?: () => void; full?: boolean;
}) {
  return (
    <button onClick={onClick} className={`dit-btn-primary ${full ? "w-full" : ""}`}>
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick }: {
  children: React.ReactNode; onClick?: () => void;
}) {
  return (
    <button onClick={onClick} className="dit-btn-secondary">
      {children}
    </button>
  );
}

function RowIcon({ label, onClick, danger, children }: {
  label?: string; onClick?: () => void; danger?: boolean; children: React.ReactNode;
}) {
  return (
    <button onClick={onClick} aria-label={label} title={label}
      className={`dit-row-icon ${danger ? "dit-row-icon-danger" : ""}`}>
      {children}
    </button>
  );
}

function ActionMenu({ items }: { items: ({ icon?: React.ReactNode; label: string; onClick: () => void; danger?: boolean } | { divider: true })[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} aria-label="More actions"
        className="dit-row-icon">
        <EllipsisVertical size={17} />
      </button>
      {open && (
        <div className="absolute right-0 top-11 rounded-xl overflow-hidden z-50"
          style={{ background: "white", border: "1px solid var(--color-deep-ink)", minWidth: 180 }}>
          {items.map((it: any, i: number) =>
            it.divider ? <hr key={i} style={{ border: "none", borderTop: "1px solid var(--color-deep-ink)", margin: "4px 8px" }} /> : (
              <button key={i} onClick={() => { setOpen(false); it.onClick(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left"
                style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 500, color: it.danger ? "#d1453b" : "var(--color-deep-ink)" }}>
                {it.icon} {it.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

function Collapsible({ label, defaultOpen = false, children }: {
  label: string; defaultOpen?: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = useState<boolean>(defaultOpen);
  return (
    <div>
      <button onClick={() => setOpen((o) => !o)} className="dit-collapsible-header">
        <span>{label}</span>
        <ChevronDown size={16} style={{ transition: "transform .2s ease", transform: open ? "rotate(180deg)" : "none" }} />
      </button>
      {open && <div className="dit-collapsible-body">{children}</div>}
    </div>
  );
}

function LabelValueRow({ label, value, onLabel, onValue, onRemove, labelPh = "Label", valuePh = "Value" }: {
  label: string; value: string; onLabel: (v: string) => void; onValue: (v: string) => void; onRemove: () => void; labelPh?: string; valuePh?: string;
}) {
  return (
    <div className="grid gap-2 items-end" style={{ gridTemplateColumns: "1fr 1fr auto" }}>
      <TextInput value={label} onChange={onLabel} placeholder={labelPh} />
      <TextInput value={value} onChange={onValue} placeholder={valuePh} />
      <RowIcon label="Remove" danger onClick={onRemove}><X size={14} /></RowIcon>
    </div>
  );
}

function ToggleButtonGroup({ value, onChange, options }: {
  value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
  return (
    <div className="dit-toggle-group">
      {options.map((opt: any) => (
        <button key={opt.value} onClick={() => onChange(opt.value)}
          className={`dit-toggle-btn ${value === opt.value ? "dit-toggle-btn-active" : ""}`}>
          {opt.label}
        </button>
      ))}
    </div>
  );
}

const ItemRow = memo(({ item, index, onChange, onInsertBelow, onMoveUp, onMoveDown, onDuplicate, onDelete }: {
  item: any; index: number; onChange: (item: any) => void; onInsertBelow: () => void; onMoveUp: () => void; onMoveDown: () => void; onDuplicate: () => void; onDelete: () => void;
}) => {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const [showSub, setShowSub] = useState(false);

  const autoGrow = useCallback((el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, []);

  const rowTotal = calcRowTotal(Number(item.qty) || 0, Number(item.price) || 0);

  return (
    <div className="dit-card-white" style={{ padding: 16, gap: 10 }}>
      <div className="flex items-start gap-2">
        <div className="flex flex-col items-center shrink-0 gap-1 pt-0.5">
          <span style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 500, color: "var(--color-slate)", lineHeight: 1 }}>{index}</span>
          <div className="flex flex-col items-center gap-0.5">
            <button onClick={onMoveUp} className="dit-row-icon" style={{ width: 24, height: 24 }}><ChevronUp size={12} /></button>
            <button onClick={onMoveDown} className="dit-row-icon" style={{ width: 24, height: 24 }}><ChevronDown size={12} /></button>
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <textarea
            ref={(el) => { taRef.current = el; autoGrow(el); }}
            rows={1} value={item.description}
            onChange={(e) => { onChange({ ...item, description: e.target.value }); autoGrow(e.target); }}
            placeholder="Description"
            className="w-full resize-none outline-none bg-transparent leading-snug"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--color-deep-ink)", minHeight: 22 }}
          />

          <div>
            <button onClick={() => setShowSub(!showSub)} className="dit-label" style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>
              <span>Sub description</span>
              <ChevronDown size={11} style={{ transition: "transform 0.2s", transform: showSub ? "rotate(180deg)" : "none" }} />
            </button>
            {showSub && (
              <textarea value={item.subDescription ?? ""} onChange={(e) => onChange({ ...item, subDescription: e.target.value })}
                placeholder="Additional details..." rows={2} className="dit-textarea mt-1" style={{ minHeight: 40, resize: "vertical" }} />
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1.5" style={{ borderTop: "1px solid var(--color-deep-ink)" }}>
            <Field label="Qty">
              <TextInput type="number" min={0} step={1} align="right" value={item.qty} onChange={(v) => onChange({ ...item, qty: v === '' ? 0 : Number(v) })} />
            </Field>
            <Field label="Price">
              <TextInput type="number" min={0} step={0.01} align="right" value={item.price} onChange={(v) => onChange({ ...item, price: v === '' ? 0 : Number(v) })} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Field label="Unit">
              <TextInput value={item.unit || ""} onChange={(v) => onChange({ ...item, unit: v })} placeholder="e.g. pcs, hrs" />
            </Field>
            <Field label="Make">
              <TextInput value={item.make || ""} onChange={(v) => onChange({ ...item, make: v })} placeholder="e.g. Brand" />
            </Field>
          </div>

          <div className="flex justify-between items-baseline pt-1.5" style={{ borderTop: "2px solid var(--color-deep-ink)" }}>
            <span className="dit-label">Total</span>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--color-deep-ink)" }}>${money(rowTotal)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1.5" style={{ borderTop: "1px solid var(--color-deep-ink)" }}>
        <button onClick={onInsertBelow} className="dit-label" style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>
          Insert below
        </button>
        <div className="flex items-center gap-1.5">
          <RowIcon label="Duplicate" onClick={onDuplicate}><Copy size={13} /></RowIcon>
          <RowIcon label="Delete" danger onClick={onDelete}><X size={13} /></RowIcon>
        </div>
      </div>
    </div>
  );
});

function TotalRow({ label, value }: { label: string, value: number }) {
  return (
    <div className="flex justify-between py-1.5" style={{ borderBottom: "1px solid var(--color-deep-ink)", color: "var(--color-slate)", fontSize: 14 }}>
      <span>{label}</span>
      <span style={{ fontWeight: 500, color: "var(--color-deep-ink)" }}>{value < 0 ? "-" : ""}${money(Math.abs(value))}</span>
    </div>
  );
}

export default function InvoiceWorkspace() {
  const [header, setHeader] = useState({ client: "Acme Corp", title: "Website Development — Q2 2026", number: "INV-2026-001", po: "", issueDate: "2026-07-22", dueDate: "2026-08-21" });
  const [clients, setClients] = useState(["Acme Corp", "Beta Inc.", "Gamma Studios", "Delta Labs"]);
  const [customHeaderFields, setCustomHeaderFields] = useState<any[]>([]);

  const [sections, setSections] = useState<any[]>([
    { type: "group", id: "g1", name: "Design Phase", items: [
        { id: nextId(), description: "Homepage Design", qty: 1, price: 1200, unit: "", make: "" },
        { id: nextId(), description: "Dashboard UI", qty: 2, price: 850, unit: "", make: "" },
    ]},
    { type: "item", id: nextId(), description: "React Frontend Build", qty: 1, price: 2500, unit: "", make: "" },
  ]);

  const [paymentTerms, setPaymentTerms] = useState("Net 30");
  const [customTerms, setCustomTerms] = useState("");
  const [discount, setDiscount] = useState({ value: 0, type: "percentage", timing: "beforeTax" });
  const [vatRate, setVatRate] = useState(20);
  const [wht, setWht] = useState({ rate: 0, unit: "percentage" });
  const [charges, setCharges] = useState([{ id: nextId(), label: "Shipping", value: 25, taxable: true }]);
  const [additionalFields, setAdditionalFields] = useState<any[]>([]);

  const [banks] = useState([{ id: "b1", name: "Chase", account: "•••• 4821" }, { id: "b2", name: "Bank of America", account: "•••• 7392" }]);
  const [selectedBank, setSelectedBank] = useState("b1");
  const [showPayment, setShowPayment] = useState(true);

  const [notes, setNotes] = useState("Thank you for your business.");
  const [terms, setTerms] = useState("Payment due within 30 days.");
  const [signatoryName, setSignatoryName] = useState("");
  const [signatoryTitle, setSignatoryTitle] = useState("");
  const [signature, setSignature] = useState<string | null>(null);
  const [refLinks, setRefLinks] = useState<any[]>([]);
  const additionalCardRef = useRef<HTMLDivElement>(null);

  const [toast, setToast] = useState("");
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const toastTimer = useRef<any>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2000);
  };

  const emptyItem = useCallback(() => ({ id: nextId(), description: "", qty: 1, price: 0, unit: "", make: "" }), []);

  const updateItemInSections = useCallback((itemId: string, updater: any) => {
    setSections((prev) => prev.map((s) => {
      if (s.type === "item" && s.id === itemId) return updater(s);
      if (s.type === "group") return { ...s, items: s.items.map((it: any) => (it.id === itemId ? updater(it) : it)) };
      return s;
    }));
  }, []);

  const insertBelowItem = useCallback((itemId: string) => {
    setSections((prev) => {
      const next = [];
      for (const s of prev) {
        if (s.type === "item") { next.push(s); if (s.id === itemId) next.push({ type: "item", ...emptyItem() }); }
        else { const items = []; for (const it of s.items) { items.push(it); if (it.id === itemId) items.push(emptyItem()); } next.push({ ...s, items }); }
      }
      return next;
    });
    showToast("Row inserted below");
  }, [emptyItem]);

  const duplicateItem = useCallback((itemId: string) => {
    setSections((prev) => {
      const next = [];
      for (const s of prev) {
        if (s.type === "item") { next.push(s); if (s.id === itemId) next.push({ type: "item", ...s, id: nextId() }); }
        else { const items = []; for (const it of s.items) { items.push(it); if (it.id === itemId) items.push({ ...it, id: nextId() }); } next.push({ ...s, items }); }
      }
      return next;
    });
    showToast("Row duplicated");
  }, []);

  const deleteItem = useCallback((itemId: string) => {
    setSections((prev) => prev.map((s) => (s.type === "group" ? { ...s, items: s.items.filter((it: any) => it.id !== itemId) } : s)).filter((s) => s.type === "group" || s.id !== itemId));
    showToast("Row deleted");
  }, []);

  const moveItem = useCallback((itemId: string, dir: string) => {
    setSections((prev) => {
      const next = prev.map((s) => (s.type === "group" ? { ...s, items: [...s.items] } : { ...s }));
      let arr: any[] | null = null, idx = -1;
      for (const s of next) { if (s.type === "group") { const i = s.items.findIndex((it: any) => it.id === itemId); if (i !== -1) { arr = s.items; idx = i; } } }
      if (arr) { const sw = dir === "up" ? idx - 1 : idx + 1; if (sw < 0 || sw >= arr.length) return prev; [arr[idx], arr[sw]] = [arr[sw], arr[idx]]; return next; }
      const ri = next.findIndex((s) => s.type === "item" && s.id === itemId);
      if (ri === -1) return prev;
      const sw = dir === "up" ? ri - 1 : ri + 1;
      if (sw < 0 || sw >= next.length) return prev;
      [next[ri], next[sw]] = [next[sw], next[ri]];
      return next;
    });
  }, []);

  const addStandaloneRow = useCallback(() => { setSections((prev) => [...prev, { type: "item", ...emptyItem() }]); showToast("Row added"); }, [emptyItem]);
  const addGroup = useCallback(() => { setSections((prev) => [...prev, { type: "group", id: nextId(), name: "New Group", items: [emptyItem()] }]); showToast("Group added"); }, [emptyItem]);
  const addItemToGroup = useCallback((groupId: string) => { setSections((prev) => prev.map((s) => (s.type === "group" && s.id === groupId ? { ...s, items: [...s.items, emptyItem()] } : s))); }, [emptyItem]);

  const deleteGroup = useCallback((groupId: string) => {
    if (!confirm("Delete this group? Items will be ungrouped.")) return;
    setSections((prev) => {
      const g = prev.find((s) => s.type === "group" && s.id === groupId);
      const others = prev.filter((s) => !(s.type === "group" && s.id === groupId));
      const releasedItems = (g?.items || []).map((it: any) => ({ type: "item", ...it }));
      return [...others, ...releasedItems];
    });
    showToast("Group deleted");
  }, []);

  const clearAll = useCallback(() => {
    setSections([]);
    setShowClearAllModal(false);
    showToast("All items cleared");
  }, []);

  const renameGroup = useCallback((groupId: string, name: string) => {
    setSections((prev) => prev.map((s) => (s.type === "group" && s.id === groupId ? { ...s, name } : s)));
  }, []);

  const itemCallbacksRef = useRef<any>({});
  const getItemCallbacks = useCallback((itemId: string) => {
    if (!itemCallbacksRef.current[itemId]) {
      itemCallbacksRef.current[itemId] = {
        onChange: (next: any) => updateItemInSections(itemId, () => next),
        onInsertBelow: () => insertBelowItem(itemId),
        onDuplicate: () => duplicateItem(itemId),
        onDelete: () => deleteItem(itemId),
        onMoveUp: () => moveItem(itemId, "up"),
        onMoveDown: () => moveItem(itemId, "down"),
      };
    }
    return itemCallbacksRef.current[itemId];
  }, [updateItemInSections, insertBelowItem, duplicateItem, deleteItem, moveItem]);

  const flatOrder = useMemo(() => {
    const order: string[] = [];
    sections.forEach((s: any) => { if (s.type === "item") order.push(s.id); else s.items.forEach((it: any) => order.push(it.id)); });
    return order;
  }, [sections]);
  const numberOf = (id: string) => flatOrder.indexOf(id) + 1;

  const totals = useMemo(() => calcTotals(sections, discount, charges, vatRate, wht), [sections, discount, charges, vatRate, wht]);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  return (
    <div className="dit-root" style={{ overflowX: "hidden" }}>
      <div className="dit-container" style={{ maxWidth: 720, margin: "0 auto", padding: "16px 12px 80px" }}>
        {/* HEADER */}
        <Card title="Invoice">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="dit-tag">Draft</span>
            <ActionMenu items={[
              { icon: <FileText size={15} />, label: "Scroll to notes", onClick: () => additionalCardRef.current?.scrollIntoView({ behavior: "smooth" }) },
              { icon: <Upload size={15} />, label: "Import", onClick: () => showToast("Import dialog") },
              { icon: <Save size={15} />, label: "Save", onClick: () => showToast("Invoice saved") },
              { icon: <SlidersHorizontal size={15} />, label: "Table settings", onClick: () => showToast("Table settings") },
              { divider: true },
              { icon: <Trash2 size={15} />, label: "Clear all", danger: true, onClick: () => setShowClearAllModal(true) },
            ]} />
          </div>

          <Field label="Client">
            <Select value={header.client} onChange={(v) => setHeader({ ...header, client: v })}>
              {clients.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </Field>
          <Field label="Title"><TextInput value={header.title} onChange={(v) => setHeader({ ...header, title: v })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Invoice #"><TextInput value={header.number} onChange={(v) => setHeader({ ...header, number: v })} /></Field>
            <Field label="PO #"><TextInput value={header.po} onChange={(v) => setHeader({ ...header, po: v })} placeholder="Optional" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Issue Date"><TextInput type="date" value={header.issueDate} onChange={(v) => setHeader({ ...header, issueDate: v })} /></Field>
            <Field label="Due Date"><TextInput type="date" value={header.dueDate} onChange={(v) => setHeader({ ...header, dueDate: v })} /></Field>
          </div>
          <div className="pt-2 flex flex-col gap-2" style={{ borderTop: "1px solid var(--color-deep-ink)" }}>
            <span className="dit-label">Custom fields</span>
            {customHeaderFields.map((f) => (
              <LabelValueRow key={f.id} label={f.label} value={f.value}
                onLabel={(v: string) => setCustomHeaderFields((fs) => fs.map((x) => (x.id === f.id ? { ...x, label: v } : x)))}
                onValue={(v: string) => setCustomHeaderFields((fs) => fs.map((x) => (x.id === f.id ? { ...x, value: v } : x)))}
                onRemove={() => setCustomHeaderFields((fs) => fs.filter((x) => x.id !== f.id))} />
            ))}
            <button onClick={() => setCustomHeaderFields((fs) => [...fs, { id: nextId(), label: "", value: "" }])} className="dit-label" style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}>+ Add field</button>
          </div>
        </Card>

        {/* LINE ITEMS */}
        <div style={{ marginTop: 16 }}>
          <Card title="Line Items">
            <div className="flex items-center gap-2 mb-3">
              <GhostButton onClick={() => showToast("Import dialog")}><Upload size={13} /> Import</GhostButton>
              <div className="flex-1" />
              <GhostButton onClick={() => setShowClearAllModal(true)} danger><Trash2 size={13} /> Clear all</GhostButton>
            </div>

            <div className="flex flex-col gap-2.5">
              {sections.map((s: any) =>
                s.type === "group" ? (
                  <div key={s.id} className="rounded-xl overflow-hidden" style={{ border: "2px solid var(--color-deep-ink)" }}>
                    <div className="flex items-center gap-2 px-3 py-2.5 flex-wrap" style={{ background: "var(--color-deep-ink)" }}>
                      <input value={s.name} onChange={(e) => renameGroup(s.id, e.target.value)}
                        className="flex-1 min-w-[100px] bg-transparent outline-none text-white placeholder-white/50"
                        style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16 }} />
                      <span className="dit-tag" style={{ background: "rgba(255,255,255,0.15)", color: "white", padding: "4px 10px", fontSize: 11 }}>
                        {s.items.length} items
                      </span>
                      <span style={{ fontFamily: "var(--font-body)", fontWeight: 500, color: "var(--color-hi-yellow)" }}>
                        ${money(s.items.reduce((a: number, it: any) => a + calcRowTotal(Number(it.qty) || 0, Number(it.price) || 0), 0))}
                      </span>
                      <button onClick={() => deleteGroup(s.id)} aria-label="Delete group" className="dit-row-icon" style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "white" }}><X size={13} /></button>
                    </div>
                    <div className="p-2.5 flex flex-col gap-2.5" style={{ background: "var(--color-canvas)" }}>
                      {s.items.map((it: any) => {
                        const cbs = getItemCallbacks(it.id);
                        return <ItemRow key={it.id} item={it} index={numberOf(it.id)} {...cbs} />;
                      })}
                    </div>
                    <div className="px-3 py-2 flex justify-center" style={{ background: "var(--color-deep-ink)" }}>
                      <button onClick={() => addItemToGroup(s.id)} className="dit-label" style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.85)", padding: 0 }}>
                        <Plus size={13} /> Add item to group
                      </button>
                    </div>
                  </div>
                ) : (
                  (() => {
                    const cbs = getItemCallbacks(s.id);
                    return <ItemRow key={s.id} item={s} index={numberOf(s.id)} {...cbs} />;
                  })()
                )
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              <GhostButton onClick={addStandaloneRow}><ListPlus size={14} /> Add row</GhostButton>
              <GhostButton onClick={addGroup}><FolderPlus size={14} /> Add group</GhostButton>
            </div>
          </Card>
        </div>

        {/* COMMERCIAL TERMS */}
        <div style={{ marginTop: 16 }}>
          <Card title="Commercial Terms">
            <div className="grid grid-cols-2 gap-3 mb-1.5">
              <Field label="Payment Terms">
                <Select value={paymentTerms} onChange={setPaymentTerms}
                  options={["Due on receipt", "Net 7", "Net 14", "Net 30", "Net 60", "Custom"].map((v) => ({ value: v, label: v }))} />
              </Field>
              <Field label="Custom Terms"><TextInput value={customTerms} onChange={setCustomTerms} placeholder="e.g. 2/10 Net 30" /></Field>
            </div>

            <Collapsible label="Discount">
              <div className="grid grid-cols-2 gap-2">
                <Field label="Value"><TextInput type="number" min={0} step={0.01} value={discount.value} onChange={(v) => setDiscount({ ...discount, value: v === '' ? 0 : Number(v) })} /></Field>
                <Field label="Type"><ToggleButtonGroup value={discount.type} onChange={(v) => setDiscount({ ...discount, type: v })} options={[{value: "percentage", label: "Percentage"}, {value: "flat", label: "Flat"}]} /></Field>
              </div>
              <div className="mt-2">
                <label className="dit-label mb-1 block">Timing</label>
                <ToggleButtonGroup value={discount.timing} onChange={(v) => setDiscount({ ...discount, timing: v })} options={[{value: "beforeTax", label: "Before Tax"}, {value: "afterTax", label: "After Tax"}]} />
              </div>
            </Collapsible>

            <Collapsible label="VAT" defaultOpen>
              <Field label="Rate (%)"><TextInput type="number" min={0} step={0.01} value={vatRate} onChange={(v) => setVatRate(v === '' ? 0 : Number(v))} /></Field>
            </Collapsible>

            <Collapsible label="WHT">
              <div className="grid grid-cols-2 gap-2">
                <Field label="Rate"><TextInput type="number" min={0} step={0.01} value={wht.rate} onChange={(v) => setWht({ ...wht, rate: v === '' ? 0 : Number(v) })} /></Field>
                <Field label="Unit"><ToggleButtonGroup value={wht.unit} onChange={(v) => setWht({ ...wht, unit: v })} options={[{value: "percentage", label: "Percentage"}, {value: "flat", label: "Flat"}]} /></Field>
              </div>
            </Collapsible>

            <Collapsible label="Additional Charges">
              <div className="flex flex-col gap-2.5">
                {charges.map((c) => (
                  <div key={c.id} className="flex flex-col gap-1.5">
                    <div className="grid gap-2 items-end" style={{ gridTemplateColumns: "1fr 1fr auto" }}>
                      <Field label="Label"><TextInput value={c.label} onChange={(v) => setCharges((cs) => cs.map((x) => (x.id === c.id ? { ...x, label: v } : x)))} /></Field>
                      <Field label="Value"><TextInput type="number" min={0} step={0.01} value={c.value} onChange={(v) => setCharges((cs) => cs.map((x) => (x.id === c.id ? { ...x, value: v === '' ? 0 : Number(v) } : x)))} /></Field>
                      <RowIcon label="Remove" danger onClick={() => setCharges((cs) => cs.filter((x) => x.id !== c.id))}><X size={14} /></RowIcon>
                    </div>
                    <label className="flex items-center gap-2" style={{ fontSize: 12, color: "var(--color-deep-ink)" }}>
                      <input type="checkbox" checked={c.taxable} onChange={(e) => setCharges((cs) => cs.map((x) => (x.id === c.id ? { ...x, taxable: e.target.checked } : x)))} style={{ accentColor: "var(--color-hi-yellow)" }} />
                      <span className="dit-tag" style={{ fontSize: 10, padding: "2px 8px" }}>{c.taxable ? "Taxable" : "Non-taxable"}</span>
                    </label>
                  </div>
                ))}
                <button onClick={() => setCharges((cs) => [...cs, { id: nextId(), label: "", value: 0, taxable: false }])} className="dit-label" style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}>+ Add charge</button>
              </div>
            </Collapsible>

            <Collapsible label="Additional Fields">
              <div className="flex flex-col gap-2">
                {additionalFields.map((f) => (
                  <LabelValueRow key={f.id} label={f.label} value={f.value}
                    onLabel={(v: string) => setAdditionalFields((fs) => fs.map((x) => (x.id === f.id ? { ...x, label: v } : x)))}
                    onValue={(v: string) => setAdditionalFields((fs) => fs.map((x) => (x.id === f.id ? { ...x, value: v } : x)))}
                    onRemove={() => setAdditionalFields((fs) => fs.filter((x) => x.id !== f.id))} />
                ))}
                <button onClick={() => setAdditionalFields((fs) => [...fs, { id: nextId(), label: "", value: "" }])} className="dit-label" style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}>+ Add field</button>
              </div>
            </Collapsible>
          </Card>
        </div>

        {/* PAYMENT DETAILS */}
        <div style={{ marginTop: 16 }}>
          <Card title="Payment Details">
            <label className="dit-label mb-1.5 block">Bank Account</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              {banks.map((b) => {
                const sel = selectedBank === b.id;
                return (
                  <button key={b.id} onClick={() => { setSelectedBank(b.id); showToast("Bank selected"); }}
                    className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-left transition-all"
                    style={{ border: `1px solid ${sel ? "var(--color-hi-yellow)" : "var(--color-deep-ink)"}`, background: sel ? "rgba(255,226,40,0.1)" : "white" }}>
                    <div className="dit-row-icon" style={{ width: 32, height: 32, background: "transparent" }}><Landmark size={16} /></div>
                    <div className="min-w-0"><div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-deep-ink)" }}>{b.name}</div><div style={{ fontSize: 12, color: "var(--color-slate)" }}>{b.account}</div></div>
                    {sel && <Check size={16} className="ml-auto shrink-0" style={{ color: "var(--color-hi-yellow)" }} />}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 flex-wrap" style={{ border: "1px solid var(--color-deep-ink)", background: "white" }}>
              <div>
                <div className="dit-label">Show payment details</div>
                <div style={{ fontSize: 12, color: "var(--color-slate)" }}>Display bank info on invoice</div>
              </div>
              <button onClick={() => { setShowPayment((s) => !s); showToast(!showPayment ? "Payment visible" : "Payment hidden"); }}
                className="relative shrink-0 rounded-full transition-colors" style={{ width: 42, height: 22, background: showPayment ? "var(--color-hi-yellow)" : "var(--color-slate)" }}>
                <span className="absolute rounded-full bg-white transition-transform" style={{ width: 16, height: 16, top: 3, left: 3, transform: showPayment ? "translateX(20px)" : "none" }} />
              </button>
            </div>
          </Card>
        </div>

        {/* SUMMARY */}
        <div style={{ marginTop: 16 }}>
          <Card title="Summary">
            <div className="flex flex-col">
              <TotalRow label="Subtotal" value={totals.subtotal} />
              {discount.value > 0 && discount.timing === "beforeTax" && <TotalRow label="Discount (before tax)" value={-totals.discountAmt} />}
              {charges.filter((c: any) => c.taxable && Number(c.value) !== 0).map((c: any) => <TotalRow key={c.id} label={c.label || "Charge"} value={Number(c.value)} />)}
              {Number(vatRate) > 0 && <TotalRow label={`VAT (${vatRate}%)`} value={totals.vat} />}
              {discount.value > 0 && discount.timing === "afterTax" && <TotalRow label="Discount (after tax)" value={-totals.discountAmt} />}
              {charges.filter((c: any) => !c.taxable && Number(c.value) !== 0).map((c: any) => <TotalRow key={c.id} label={c.label || "Charge"} value={Number(c.value)} />)}
              {wht.rate > 0 && <TotalRow label="WHT" value={-totals.whtAmt} />}
              <div className="flex justify-between items-baseline pt-3 mt-1" style={{ borderTop: "2px solid var(--color-deep-ink)" }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--color-deep-ink)" }}>Grand Total</span>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, color: "var(--color-deep-ink)" }}>${money(totals.grandTotal)}</span>
              </div>
              <div className="text-xs italic pt-2 mt-1" style={{ color: "var(--color-slate)", borderTop: "1px solid var(--color-deep-ink)" }}>{numberToWords(totals.grandTotal)} dollars</div>
            </div>
          </Card>
        </div>

        {/* ADDITIONAL INFORMATION */}
        <div ref={additionalCardRef} style={{ marginTop: 16 }}>
          <Card title="Additional Information">
            <Collapsible label="Notes" defaultOpen>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="dit-textarea" />
            </Collapsible>
            <Collapsible label="Terms & Conditions">
              <textarea value={terms} onChange={(e) => setTerms(e.target.value)} rows={3} className="dit-textarea" />
            </Collapsible>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <Field label="Signatory Name"><TextInput value={signatoryName} onChange={setSignatoryName} placeholder="Full name" /></Field>
              <Field label="Title"><TextInput value={signatoryTitle} onChange={setSignatoryTitle} placeholder="e.g. CEO" /></Field>
            </div>
            <div className="mt-3">
              <label className="dit-label mb-1.5 block">Signature</label>
              <div className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 flex-wrap" style={{ border: `1px dashed ${signature ? "var(--color-hi-yellow)" : "var(--color-deep-ink)"}`, background: signature ? "rgba(255,226,40,0.1)" : "white" }}>
                <div className="flex items-center gap-3 flex-1 min-w-[160px]">
                  <div className="dit-row-icon">{signature ? <Check size={17} style={{ color: "var(--color-hi-yellow)" }} /> : <PenLine size={17} />}</div>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{signature || "Tap to sign or upload"}</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <GhostButton onClick={() => { setSignature("Signature captured"); showToast("Signature signed"); }}>Sign now</GhostButton>
                  <GhostButton onClick={() => { setSignature("Uploaded signature"); showToast("Signature uploaded"); }}><Upload size={12} /> Upload</GhostButton>
                </div>
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-2">
              <label className="dit-label">Reference Links</label>
              {refLinks.map((l) => (
                <div key={l.id} className="grid gap-2 items-end" style={{ gridTemplateColumns: "1fr 1.4fr auto" }}>
                  <TextInput value={l.label} onChange={(v) => setRefLinks((ls) => ls.map((x) => (x.id === l.id ? { ...x, label: v } : x)))} placeholder="Label" />
                  <TextInput value={l.url} onChange={(v) => setRefLinks((ls) => ls.map((x) => (x.id === l.id ? { ...x, url: v } : x)))} placeholder="https://..." />
                  <RowIcon label="Remove" danger onClick={() => setRefLinks((ls) => ls.filter((x) => x.id !== l.id))}><X size={14} /></RowIcon>
                </div>
              ))}
              <button onClick={() => { setRefLinks((ls) => [...ls, { id: nextId(), label: "", url: "" }]); showToast("Link added"); }} className="dit-label" style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}><Link2 size={13} /> Add link</button>
            </div>
          </Card>
        </div>

        {/* BOTTOM ACTIONS */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-4 mt-4" style={{ borderTop: "1px solid var(--color-deep-ink)" }}>
          <GhostButton onClick={() => showToast("Changes discarded")}>Cancel</GhostButton>
          <SecondaryButton onClick={() => showToast("Invoice saved")}><Save size={16} /> Save Invoice</SecondaryButton>
        </div>
      </div>

      {/* CLEAR ALL MODAL */}
      {showClearAllModal && (
        <div className="dit-modal-overlay">
          <div className="dit-modal">
            <div className="flex items-center gap-3">
              <div className="dit-row-icon dit-row-icon-danger" style={{ width: 40, height: 40 }}><Trash2 size={20} /></div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--color-deep-ink)" }}>Clear all items?</h3>
            </div>
            <p style={{ fontSize: 14, color: "var(--color-slate)", lineHeight: 1.5 }}>This will permanently remove all line items and groups. Cannot be undone.</p>
            <div className="flex gap-3 mt-2">
              <button onClick={() => setShowClearAllModal(false)} className="dit-btn-ghost" style={{ flex: 1 }}>Cancel</button>
              <button onClick={clearAll} className="dit-btn-primary" style={{ flex: 1, justifyContent: "center", background: "#d1453b", color: "white" }}>Yes, clear all</button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING SAVE */}
      <button onClick={() => showToast("Invoice saved")} aria-label="Save invoice" className="dit-floating-save">
        <Save size={22} />
      </button>

      {/* TOAST */}
      <div className="dit-toast">
        <div className="dit-toast-inner" style={{ opacity: toast ? 1 : 0, transform: toast ? "translateY(0)" : "translateY(16px)" }}>{toast}</div>
      </div>
    </div>
  );
}

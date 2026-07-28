import { useState, useMemo, useRef, useCallback, useEffect, memo, type ChangeEvent } from "react";
import {
  Plus, Trash2, Copy, ChevronUp, ChevronDown,
  Upload, PenLine, FolderOpen, X, Save,
  FolderPlus, ListPlus, Check, Landmark, EllipsisVertical,
  FileText, SlidersHorizontal, Link2,
} from "lucide-react";

// ---------------------------------------------------------
// IMPORTS FROM YOUR DEDICATED CALCULATIONS FILE
// ---------------------------------------------------------
import {
  calcTotals,
  calcRowTotal,
  numberToWords,
  money
} from "@/lib/calculations";
import "./index.css";

interface Section { type: "group" | "item"; id: string; name?: string; description?: string; qty?: number; price?: number; subDescription?: string; unit?: string; make?: string; items?: Section[]; }
interface Item { id: string; description: string; qty: number; price: number; subDescription?: string; unit?: string; make?: string; }
interface HeaderField { id: string; label: string; value: string; }
interface Charge { id: string; label: string; value: number; taxable: boolean; }
interface Bank { id: string; name: string; account: string; }
interface RefLink { id: string; label: string; url: string; }

/* Typeform design — cream canvas, violet accents, editorial serif headings */
const token = {
  bg: "#faf9fb",
  card: "#ffffff",
  cardAlt: "#f5f3f6",
  border: "#e2dfe4",
  borderStrong: "#2a222b",
  ink: "#2a222b",
  inkSoft: "#655d67",
  inkFaint: "#8a8390",
  violet: "#9454ab",
  red: "#c4283c",
  black: "#2a222b",
};

const fontDisplay = "'Playfair Display', serif";
const fontBody = "'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

let uid = 100;
const nextId = () => `id${uid++}`;

/* ---------------------------------------------------------
   PRIMITIVES
--------------------------------------------------------- */
function Card({ title, badge, children, right }: { title?: string; badge?: string; children: React.ReactNode; right?: React.ReactNode; }) {
  return (
    <section
      className="rounded-[24px] p-3.5 sm:p-5 mb-2.5"
      style={{ background: token.card, border: `1px solid ${token.border}`, boxShadow: "none" }}
    >
      {(title || right) && (
        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
          <h2 style={{ fontFamily: fontDisplay, fontWeight: 400, color: token.ink, letterSpacing: "-0.5px" }} className="text-lg sm:text-xl">
            {title}
          </h2>
          {right}
          {badge && (
            <span
              className="text-[11px] font-medium uppercase tracking-wide px-3 py-1 rounded-full"
              style={{ color: token.ink, background: token.bg, border: `1px solid ${token.border}` }}
            >
              {badge}
            </span>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-[11px] font-medium uppercase tracking-wider"
      style={{ color: token.violet, fontFamily: fontBody, letterSpacing: "0.08em" }}
    >
      {children}
    </span>
  );
}

function Field({ label, children, className = "" }: { label?: string; children: React.ReactNode; className?: string; }) {
  return (
    <div className={`flex flex-col gap-1 w-full min-w-0 ${className}`}>
      {label && (
        <label className="text-[10.5px] font-medium uppercase tracking-wide" style={{ color: token.inkSoft, fontFamily: fontBody }}>
          {label}
        </label>
      )}
      {children}
    </div>
  );
}

const inputBase = "w-full px-3 py-2 rounded-[12px] text-[15px] outline-none transition-colors duration-150";
function inputStyle(focused: boolean) {
  return {
    border: `1px solid ${focused ? token.ink : token.border}`,
    color: token.ink,
    fontFamily: fontBody,
    background: token.bg,
    boxShadow: "none",
  };
}

function TextInput({ value, onChange, placeholder, type = "text", align, min, step }: { value: string | number; onChange: (v: string) => void; placeholder?: string; type?: string; align?: string; min?: number; step?: number; }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type} value={value} min={min} step={step}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      placeholder={placeholder} className={inputBase}
      style={{ ...inputStyle(focused), textAlign: (align || "left") as React.CSSProperties["textAlign"] }}
    />
  );
}

function Select({ value, onChange, options, children }: { value: string; onChange: (v: string) => void; options?: { value: string; label: string }[]; children?: React.ReactNode; }) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      value={value} onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      className={inputBase + " appearance-none pr-8 bg-no-repeat"}
      style={{
        ...inputStyle(focused),
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23655d67' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")",
        backgroundPosition: "right 12px center",
      }}
    >
      {options ? options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>) : children}
    </select>
  );
}

function GhostButton({ children, onClick, danger, small }: { children: React.ReactNode; onClick?: () => void; danger?: boolean; small?: boolean; }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      className={`inline-flex items-center gap-1.5 rounded-[12px] font-medium transition-colors ${small ? "text-[11px] px-3 py-1.5" : "text-[13px] px-[24px] py-[8px]"}`}
      style={{
        fontFamily: fontBody,
        border: hover ? `1px solid ${danger ? token.red : token.borderStrong}` : "1px solid transparent",
        color: hover ? (danger ? token.red : "#222222") : token.inkSoft,
        background: hover ? (danger ? "#fdecea" : token.cardAlt) : "transparent",
        minHeight: small ? 34 : 40,
      }}>
      {children}
    </button>
  );
}

function PrimaryButton({ children, onClick, full }: { children: React.ReactNode; onClick?: () => void; full?: boolean; }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      className={`inline-flex items-center justify-center gap-2 rounded-[12px] text-sm font-semibold tracking-wide transition-all ${full ? "w-full" : ""}`}
      style={{
        fontFamily: fontBody,
        background: hover ? "#3d2e40" : token.black,
        color: "#faf9fb",
        padding: "8px 24px",
        opacity: 1,
      }}>
      {children}
    </button>
  );
}

function RowIcon({ label, onClick, danger, children }: { label?: string; onClick?: () => void; danger?: boolean; children: React.ReactNode; }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      aria-label={label} title={label} className="inline-flex items-center justify-center rounded-[12px] shrink-0"
      style={{
        width: 32, height: 32,
        border: `1px solid ${danger && hover ? token.red : hover ? token.borderStrong : token.border}`,
        color: danger && hover ? token.red : hover ? token.ink : token.inkSoft,
        background: danger && hover ? "#fdecea" : "white", transition: "all .15s ease",
      }}>
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
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
        style={{ border: `1px solid ${token.border}`, color: token.inkSoft, background: "white" }}>
        <EllipsisVertical size={17} />
      </button>
      {open && (
        <div className="absolute right-0 top-11 rounded-2xl overflow-hidden z-50"
          style={{ background: "white", border: `1px solid ${token.border}`, boxShadow: "none", minWidth: 190 }}>
          {items.map((it, i) =>
            'divider' in it ? <hr key={i} style={{ border: "none", borderTop: `1px solid ${token.border}`, margin: "4px 8px" }} /> : (
              <button key={i} onClick={() => { setOpen(false); it.onClick(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-[13px] font-medium"
                style={{ color: it.danger ? token.red : token.ink }}>
                {it.icon} {it.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

function Collapsible({ label, defaultOpen = false, children }: { label: string; defaultOpen?: boolean; children: React.ReactNode; }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b last:border-b-0" style={{ borderColor: token.border }}>
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between py-2.5 text-left" style={{ minHeight: 40 }}>
        <span className="text-[13px] font-semibold uppercase tracking-wide" style={{ color: token.ink, fontFamily: fontBody }}>{label}</span>
        <ChevronDown size={16} style={{ color: token.inkSoft, transition: "transform .2s ease", transform: open ? "rotate(180deg)" : "none" }} />
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  );
}

function LabelValueRow({ label, value, onLabel, onValue, onRemove, labelPh = "Label", valuePh = "Value" }: { label: string; value: string; onLabel: (v: string) => void; onValue: (v: string) => void; onRemove: () => void; labelPh?: string; valuePh?: string; }) {
  return (
    <div className="grid gap-2 items-end" style={{ gridTemplateColumns: "1fr 1fr auto" }}>
      <TextInput value={label} onChange={onLabel} placeholder={labelPh} />
      <TextInput value={value} onChange={onValue} placeholder={valuePh} />
      <RowIcon label="Remove field" danger onClick={onRemove}><X size={14} /></RowIcon>
    </div>
  );
}

function ToggleButtonGroup({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; }) {
  return (
    <div className="flex gap-1">
      {options.map((opt) => (
        <button key={opt.value} onClick={() => onChange(opt.value)}
          style={{
            borderRadius: 9999, border: `1px solid ${value === opt.value ? token.ink : token.border}`,
            background: value === opt.value ? token.ink : "transparent",
            color: value === opt.value ? "white" : token.inkSoft,
            fontFamily: fontBody, fontSize: 12, fontWeight: 500,
          }}
          className="px-3 py-1 transition-colors">
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------
   LINE ITEM ROW
--------------------------------------------------------- */
const ItemRow = memo(({ item, index, onChange, onInsertBelow, onMoveUp, onMoveDown, onDuplicate, onDelete }: { item: Item; index: number; onChange: (item: Item) => void; onInsertBelow: () => void; onMoveUp: () => void; onMoveDown: () => void; onDuplicate: () => void; onDelete: () => void; }) => {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const [showSub, setShowSub] = useState(false);

  const autoGrow = useCallback((el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, []);

  const rowTotal = calcRowTotal(Number(item.qty) || 0, Number(item.price) || 0);

  return (
    <div className="rounded-[24px] p-2.5 sm:p-3 flex flex-col gap-2" style={{ border: `1px solid ${token.border}`, background: token.card }}>
      <div className="flex items-start gap-2">
        <div className="flex flex-col items-center shrink-0 gap-1 pt-0.5">
          <span className="text-base font-light" style={{ color: token.inkFaint, fontFamily: fontBody, lineHeight: 1 }}>{index}</span>
          <div className="flex flex-col items-center gap-0.5">
            <button onClick={onMoveUp} className="w-6 h-6 rounded-full flex items-center justify-center border transition-colors" style={{ borderColor: token.border, color: token.inkSoft, background: token.bg }}>
              <ChevronUp size={12} />
            </button>
            <button onClick={onMoveDown} className="w-6 h-6 rounded-full flex items-center justify-center border transition-colors" style={{ borderColor: token.border, color: token.inkSoft, background: token.bg }}>
              <ChevronDown size={12} />
            </button>
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <textarea
            ref={(el: HTMLTextAreaElement | null) => { if (el) { taRef.current = el; autoGrow(el); } }}
            rows={1} value={item.description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => { onChange({ ...item, description: e.target.value }); autoGrow(e.target); }}
            placeholder="Description"
            className="w-full resize-none outline-none bg-transparent leading-snug"
            style={{ fontFamily: fontBody, fontWeight: 500, fontSize: 16, color: token.ink, minHeight: 22 }}
          />

          <div>
            <button onClick={() => setShowSub(!showSub)} className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide bg-transparent border-none cursor-pointer p-0" style={{ color: token.inkSoft }}>
              <span>Sub description</span>
              <ChevronDown size={11} style={{ transition: "transform 0.2s", transform: showSub ? "rotate(180deg)" : "none", color: token.inkSoft }} />
            </button>
            {showSub && (
              <textarea value={item.subDescription ?? ""} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange({ ...item, subDescription: e.target.value })}
                placeholder="Additional details..." rows={2}
                className="w-full rounded-[12px] px-2 py-1 text-sm outline-none resize-y mt-1"
                style={{ border: `1px solid ${token.border}`, color: token.ink, background: token.bg }} />
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1.5" style={{ borderTop: `1px solid ${token.border}` }}>
            <Field label="Qty">
              <TextInput type="number" min={0} step={1} align="right" value={item.qty} onChange={(v: string) => onChange({ ...item, qty: v === '' ? 0 : Number(v) })} />
            </Field>
            <Field label="Price">
              <TextInput type="number" min={0} step={0.01} align="right" value={item.price} onChange={(v: string) => onChange({ ...item, price: v === '' ? 0 : Number(v) })} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Field label="Unit">
              <TextInput value={item.unit || ""} onChange={(v: string) => onChange({ ...item, unit: v })} placeholder="e.g. pcs, hrs" />
            </Field>
            <Field label="Make">
              <TextInput value={item.make || ""} onChange={(v: string) => onChange({ ...item, make: v })} placeholder="e.g. Brand" />
            </Field>
          </div>

          <div className="flex justify-between items-baseline pt-1.5" style={{ borderTop: `2px solid ${token.ink}` }}>
            <span className="text-[11px] font-medium uppercase tracking-wide" style={{ color: token.inkSoft }}>Total</span>
            <span className="text-lg font-semibold" style={{ fontFamily: fontDisplay, color: token.ink, letterSpacing: "-0.5px" }}>${money(rowTotal)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 mt-1">
        <div className="flex flex-col items-start gap-1">
          <button onClick={onInsertBelow} className="text-[11px] font-medium uppercase tracking-wide underline bg-transparent border-none cursor-pointer p-0" style={{ color: token.ink }}>
            Insert below
          </button>
        </div>
        <div className="flex items-center gap-1.5 pt-1.5" style={{ borderTop: `1px solid ${token.border}` }}>
          <RowIcon label="Duplicate" onClick={onDuplicate}><Copy size={13} /></RowIcon>
          <div className="flex-1" />
          <RowIcon label="Delete row" danger onClick={onDelete}><X size={13} color={token.red} /></RowIcon>
        </div>
      </div>
    </div>
  );
});

/* ---------------------------------------------------------
   MAIN COMPONENT
--------------------------------------------------------- */
export default function InvoiceWorkspace() {
  const [header, setHeader] = useState({ client: "Acme Corp", title: "Website Development — Q2 2026", number: "INV-2026-001", po: "", issueDate: "2026-07-22", dueDate: "2026-08-21" });
  const [clients, setClients] = useState(["Acme Corp", "Beta Inc.", "Gamma Studios", "Delta Labs"]);
  const [customHeaderFields, setCustomHeaderFields] = useState<HeaderField[]>([]);

  const [sections, setSections] = useState<Section[]>([
    { type: "group", id: "g1", name: "Design Phase", items: [
        { type: "item", id: nextId(), description: "Homepage Design", qty: 1, price: 1200, unit: "", make: "" },
        { type: "item", id: nextId(), description: "Dashboard UI", qty: 2, price: 850, unit: "", make: "" },
        { type: "item", id: nextId(), description: "Brand Identity & Logo", qty: 1, price: 600, unit: "", make: "" },
    ]},
    { type: "item", id: nextId(), description: "React Frontend Build", qty: 1, price: 2500, unit: "", make: "" },
    { type: "item", id: nextId(), description: "Server Setup & Deployment", qty: 1, price: 400, unit: "", make: "" },
  ]);

  const [paymentTerms, setPaymentTerms] = useState("Net 30");
  const [customTerms, setCustomTerms] = useState("");
  const [discount, setDiscount] = useState({ value: 0, type: "percentage", timing: "beforeTax" });
  const [vatRate, setVatRate] = useState(20);
  const [wht, setWht] = useState({ rate: 0, unit: "percentage" });
  const [charges, setCharges] = useState([{ id: nextId(), label: "Shipping", value: 25, taxable: true }]);
  const [additionalFields, setAdditionalFields] = useState<HeaderField[]>([]);

  const [banks] = useState([{ id: "b1", name: "Chase", account: "•••• 4821" }, { id: "b2", name: "Bank of America", account: "•••• 7392" }, { id: "b3", name: "Wells Fargo", account: "•••• 1546" }]);
  const [selectedBank, setSelectedBank] = useState("b1");
  const [showPayment, setShowPayment] = useState(true);

  const [notes, setNotes] = useState("Thank you for your business.");
  const [terms, setTerms] = useState("Payment due within 30 days.");
  const [signatoryName, setSignatoryName] = useState("");
  const [signatoryTitle, setSignatoryTitle] = useState("");
  const [signature, setSignature] = useState<string | null>(null);
  const [refLinks, setRefLinks] = useState<RefLink[]>([]);
  const additionalCardRef = useRef<HTMLDivElement>(null);

  const [toast, setToast] = useState("");
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const showToast = (msg: string) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2000);
  };

  const emptyItem = useCallback((): Section => ({ type: "item", id: nextId(), description: "", qty: 1, price: 0, unit: "", make: "" }), []);

  const updateItemInSections = useCallback((itemId: string, updater: (item: Section) => Section) => {
    setSections((prev) => prev.map((s) => {
      if (s.type === "item" && s.id === itemId) return updater(s);
      if (s.type === "group") return { ...s, items: s.items!.map((it: Section) => (it.id === itemId ? updater(it) : it)) };
      return s;
    }));
  }, []);

  const insertBelowItem = useCallback((itemId: string) => {
    setSections((prev) => {
      const next: Section[] = [];
      for (const s of prev) {
        if (s.type === "item") { next.push(s); if (s.id === itemId) next.push(emptyItem()); }
        else { const items: Section[] = []; for (const it of s.items!) { items.push(it); if (it.id === itemId) items.push(emptyItem()); } next.push({ ...s, items }); }
      }
      return next;
    });
    showToast("Row inserted below");
  }, [emptyItem]);

  const duplicateItem = useCallback((itemId: string) => {
    setSections((prev) => {
      const next: Section[] = [];
      for (const s of prev) {
        if (s.type === "item") { next.push(s); if (s.id === itemId) next.push({ ...s, id: nextId() }); }
        else { const items: Section[] = []; for (const it of s.items!) { items.push(it); if (it.id === itemId) items.push({ ...it, id: nextId() }); } next.push({ ...s, items }); }
      }
      return next;
    });
    showToast("Row duplicated");
  }, []);

  const deleteItem = useCallback((itemId: string) => {
    setSections((prev) => prev.map((s) => (s.type === "group" ? { ...s, items: s.items!.filter((it: Section) => it.id !== itemId) } : s)).filter((s) => s.type === "group" || s.id !== itemId));
    showToast("Row deleted");
  }, []);

  const moveItem = useCallback((itemId: string, dir: string) => {
    setSections((prev) => {
      const next = prev.map((s) => (s.type === "group" ? { ...s, items: [...s.items!] } : { ...s }));
      let arr: Section[] | null = null, idx = -1;
      for (const s of next) { if (s.type === "group") { const i = s.items!.findIndex((it: Section) => it.id === itemId); if (i !== -1) { arr = s.items as Section[]; idx = i; } } }
      if (arr) { const sw = dir === "up" ? idx - 1 : idx + 1; if (sw < 0 || sw >= arr.length) return prev; [arr[idx], arr[sw]] = [arr[sw], arr[idx]]; return next; }
      const ri = next.findIndex((s) => s.type === "item" && s.id === itemId);
      if (ri === -1) return prev;
      const sw = dir === "up" ? ri - 1 : ri + 1;
      if (sw < 0 || sw >= next.length) return prev;
      [next[ri], next[sw]] = [next[sw], next[ri]];
      return next;
    });
  }, []);

  const addStandaloneRow = useCallback(() => { setSections((prev) => [...prev, emptyItem()]); showToast("Row added"); }, [emptyItem]);
  const addGroup = useCallback(() => { setSections((prev) => [...prev, { type: "group", id: nextId(), name: "New Group", items: [emptyItem()] }]); showToast("Group added"); }, [emptyItem]);
  const addItemToGroup = useCallback((groupId: string) => { setSections((prev) => prev.map((s) => (s.type === "group" && s.id === groupId ? { ...s, items: [...s.items!, emptyItem()] } : s))); }, [emptyItem]);

  const deleteGroup = useCallback((groupId: string) => {
    if (!confirm("Delete this group? Items will be ungrouped.")) return;
    setSections((prev) => {
      const g = prev.find((s) => s.type === "group" && s.id === groupId);
      const others = prev.filter((s) => !(s.type === "group" && s.id === groupId));
      const releasedItems: Section[] = (g?.items || []).map((it: Section) => ({ ...it }));
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

  const itemCallbacksRef = useRef<Record<string, { onChange: (item: Item) => void; onInsertBelow: () => void; onDuplicate: () => void; onDelete: () => void; onMoveUp: () => void; onMoveDown: () => void }>>({});
  const getItemCallbacks = useCallback((itemId: string) => {
    if (!itemCallbacksRef.current[itemId]) {
      itemCallbacksRef.current[itemId] = {
        onChange: (next: Item) => updateItemInSections(itemId, () => next as Section),
        onInsertBelow: () => insertBelowItem(itemId),
        onDuplicate: () => duplicateItem(itemId),
        onDelete: () => deleteItem(itemId),
        onMoveUp: () => moveItem(itemId, "up"),
        onMoveDown: () => moveItem(itemId, "down"),
      };
    }
    return itemCallbacksRef.current[itemId]!;
  }, [updateItemInSections, insertBelowItem, duplicateItem, deleteItem, moveItem]);

  const flatOrder = useMemo(() => {
    const order: string[] = [];
    sections.forEach((s) => { if (s.type === "item") order.push(s.id); else s.items!.forEach((it: Section) => order.push(it.id)); });
    return order;
  }, [sections]);
  const numberOf = (id: string) => flatOrder.indexOf(id) + 1;

  const totals = useMemo(() => calcTotals(sections, discount, charges, vatRate, wht), [sections, discount, charges, vatRate, wht]);
  const rowCount = flatOrder.length;

  useEffect(() => {
    const link1 = document.createElement("link");
    link1.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap";
    link1.rel = "stylesheet";
    document.head.appendChild(link1);
    return () => { document.head.removeChild(link1); };
  }, []);

  return (
    <div style={{ background: token.bg, minHeight: "100vh", fontFamily: fontBody }} className="pb-24">
      <div className="max-w-3xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6">

        {/* CUSTOMER */}
        <Card>
          <div className="mb-4">
            <Eyebrow>CUSTOMER</Eyebrow>
          </div>
          <div className="flex flex-col gap-2.5">
            <Field label="Client">
              <Select value={header.client} onChange={(v: string) => {
                if (v === "__new__") {
                  const name = prompt("Enter client name:");
                  if (name && name.trim()) { setClients((prev) => [...prev, name.trim()]); setHeader({ ...header, client: name.trim() }); showToast("Client added"); }
                } else {
                  setHeader({ ...header, client: v });
                }
              }}>
                <option value="__new__">+ New client...</option>
                {clients.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </Field>
            <Field label="Company"><TextInput value={header.title} onChange={(v: string) => setHeader({ ...header, title: v })} /></Field>
          </div>
        </Card>

        {/* INVOICE INFORMATION */}
        <Card>
          <div className="mb-4">
            <Eyebrow>INVOICE INFORMATION</Eyebrow>
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="grid grid-cols-2 gap-2">
              <Field label="Invoice #"><TextInput value={header.number} onChange={(v: string) => setHeader({ ...header, number: v })} /></Field>
              <Field label="PO #"><TextInput value={header.po} onChange={(v: string) => setHeader({ ...header, po: v })} placeholder="Optional" /></Field>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Issue Date"><TextInput type="date" value={header.issueDate} onChange={(v: string) => setHeader({ ...header, issueDate: v })} /></Field>
              <Field label="Due Date"><TextInput type="date" value={header.dueDate} onChange={(v: string) => setHeader({ ...header, dueDate: v })} /></Field>
            </div>
            <div className="pt-2 flex flex-col gap-2" style={{ borderTop: `1px solid ${token.border}` }}>
              <span className="text-[10.5px] font-medium uppercase tracking-wide" style={{ color: token.inkSoft }}>Custom fields</span>
              {customHeaderFields.map((f) => (
                <LabelValueRow key={f.id} label={f.label} value={f.value} labelPh="e.g. Project ID" valuePh="e.g. PRJ-001"
                  onLabel={(v: string) => setCustomHeaderFields((fs) => fs.map((x) => (x.id === f.id ? { ...x, label: v } : x)))}
                  onValue={(v: string) => setCustomHeaderFields((fs) => fs.map((x) => (x.id === f.id ? { ...x, value: v } : x)))}
                  onRemove={() => setCustomHeaderFields((fs) => fs.filter((x) => x.id !== f.id))} />
              ))}
              <button onClick={() => setCustomHeaderFields((fs) => [...fs, { id: nextId(), label: "", value: "" }])} className="text-left text-[12px] font-medium uppercase tracking-wide pb-1 w-fit" style={{ color: token.inkSoft, borderBottom: `1px solid ${token.border}` }}>+ Add field</button>
            </div>
          </div>
        </Card>

        {/* LINE ITEMS */}
        <Card title="Line Items" right={
          <span className="text-[11px] font-medium uppercase tracking-wide px-3 py-1 rounded-full ml-auto" style={{ color: token.inkSoft, border: `1px solid ${token.border}`, background: "white" }}>{rowCount} rows</span>
        }>
          <div className="flex items-center gap-2 mb-3">
            <GhostButton onClick={() => showToast("Import dialog")} small><Upload size={13} /> Import</GhostButton>
            <GhostButton onClick={() => showToast("Table settings")} small><SlidersHorizontal size={13} /> Table settings</GhostButton>
            <div className="flex-1" />
            <GhostButton onClick={() => setShowClearAllModal(true)} danger small><Trash2 size={13} /> Clear all</GhostButton>
          </div>

          <div className="flex flex-col gap-2.5">
            {sections.map((s) =>
              s.type === "group" ? (
                <div key={s.id} className="rounded-[24px] overflow-hidden" style={{ border: `2.5px solid ${token.ink}` }}>
                  <div className="flex items-center gap-2 px-3 py-2.5 flex-wrap" style={{ background: token.ink }}>
                    <input value={s.name} onChange={(e: ChangeEvent<HTMLInputElement>) => renameGroup(s.id, e.target.value)} className="flex-1 min-w-[100px] bg-transparent outline-none text-white placeholder-white/50" style={{ fontFamily: fontBody, fontWeight: 500, fontSize: 16 }} />
                    <span className="text-[10.5px] font-medium uppercase px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.12)", color: "white" }}>{s.items!.length} items</span>
                    <span style={{ fontFamily: fontDisplay, fontWeight: 500, color: token.bg, letterSpacing: "-0.5px" }}>${money(s.items!.reduce((a: number, it: Section) => a + calcRowTotal(Number(it.qty) || 0, Number(it.price) || 0), 0))}</span>
                    <button onClick={() => deleteGroup(s.id)} aria-label="Delete group" className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.1)", color: "white" }}><X size={13} /></button>
                  </div>
                  <div className="p-2.5 flex flex-col gap-2.5" style={{ background: token.bg }}>
                    {s.items!.map((it: Section) => {
                      const cbs = getItemCallbacks(it.id);
                      return <ItemRow key={it.id} item={it as Item} index={numberOf(it.id)} {...cbs} />;
                    })}
                  </div>
                  <div className="px-3 py-2 flex justify-center" style={{ background: token.ink }}>
                    <button onClick={() => addItemToGroup(s.id)} className="inline-flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-wide text-white/85"><Plus size={13} /> Add item to group</button>
                  </div>
                </div>
              ) : (
                (() => {
                  const cbs = getItemCallbacks(s.id);
                  return <ItemRow key={s.id} item={s as Item} index={numberOf(s.id)} {...cbs} />;
                })()
              )
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            <GhostButton onClick={addStandaloneRow}><ListPlus size={14} /> Add row</GhostButton>
            <GhostButton onClick={addGroup}><FolderPlus size={14} /> Add group</GhostButton>
          </div>
        </Card>

        {/* COMMERCIAL TERMS */}
        <Card title="Commercial Terms">
          <div className="grid grid-cols-2 gap-2 mb-1.5">
            <Field label="Payment Terms">
              <Select value={paymentTerms} onChange={setPaymentTerms} options={["Due on receipt", "Net 7", "Net 14", "Net 30", "Net 60", "Custom"].map((v) => ({ value: v, label: v }))} />
            </Field>
            <Field label="Custom Terms"><TextInput value={customTerms} onChange={setCustomTerms} placeholder="e.g. 2/10 Net 30" /></Field>
          </div>

          <Collapsible label="Discount">
            <div className="grid grid-cols-2 gap-2">
              <Field label="Value"><TextInput type="number" min={0} step={0.01} value={discount.value} onChange={(v: string) => setDiscount({ ...discount, value: v === '' ? 0 : Number(v) })} /></Field>
              <Field label="Type"><ToggleButtonGroup value={discount.type} onChange={(v: string) => setDiscount({ ...discount, type: v })} options={[{value: "percentage", label: "Percentage"}, {value: "flat", label: "Flat"}]} /></Field>
            </div>
            <div className="mt-2">
              <label className="text-[10.5px] font-medium uppercase tracking-wide mb-1 block" style={{ color: token.inkSoft }}>Timing</label>
              <ToggleButtonGroup value={discount.timing} onChange={(v: string) => setDiscount({ ...discount, timing: v })} options={[{value: "beforeTax", label: "Before Tax"}, {value: "afterTax", label: "After Tax"}]} />
            </div>
          </Collapsible>

          <Collapsible label="VAT" defaultOpen>
            <Field label="Rate (%)"><TextInput type="number" min={0} step={0.01} value={vatRate} onChange={(v: string) => setVatRate(v === '' ? 0 : Number(v))} /></Field>
          </Collapsible>

          <Collapsible label="WHT">
            <div className="grid grid-cols-2 gap-2">
              <Field label="Rate"><TextInput type="number" min={0} step={0.01} value={wht.rate} onChange={(v: string) => setWht({ ...wht, rate: v === '' ? 0 : Number(v) })} /></Field>
              <Field label="Unit"><ToggleButtonGroup value={wht.unit} onChange={(v: string) => setWht({ ...wht, unit: v })} options={[{value: "percentage", label: "Percentage"}, {value: "flat", label: "Flat"}]} /></Field>
            </div>
          </Collapsible>

          <Collapsible label="Additional Charges">
            <div className="flex flex-col gap-2.5">
              {charges.map((c) => (
                <div key={c.id} className="flex flex-col gap-1.5">
                  <div className="grid gap-2 items-end" style={{ gridTemplateColumns: "1fr 1fr auto" }}>
                    <Field label="Label"><TextInput value={c.label} onChange={(v: string) => setCharges((cs) => cs.map((x) => (x.id === c.id ? { ...x, label: v } : x)))} /></Field>
                    <Field label="Value"><TextInput type="number" min={0} step={0.01} value={c.value} onChange={(v: string) => setCharges((cs) => cs.map((x) => (x.id === c.id ? { ...x, value: v === '' ? 0 : Number(v) } : x)))} /></Field>
                    <RowIcon label="Remove charge" danger onClick={() => setCharges((cs) => cs.filter((x) => x.id !== c.id))}><X size={14} /></RowIcon>
                  </div>
                  <label className="flex items-center gap-2 text-[12px] font-medium" style={{ color: token.ink }}>
                    <input type="checkbox" checked={c.taxable} onChange={(e: ChangeEvent<HTMLInputElement>) => setCharges((cs) => cs.map((x) => (x.id === c.id ? { ...x, taxable: e.target.checked } : x)))} className="w-[16px] h-[16px]" style={{ accentColor: token.ink }} />
                    <span className="text-[10.5px] uppercase font-medium px-2 py-0.5 rounded-full" style={c.taxable ? { color: token.ink, background: token.bg } : { color: token.inkFaint, background: token.bg }}>{c.taxable ? "Taxable" : "Non-taxable"}</span>
                  </label>
                </div>
              ))}
              <button onClick={() => setCharges((cs) => [...cs, { id: nextId(), label: "", value: 0, taxable: false }])} className="text-left text-[12px] font-medium uppercase tracking-wide pb-1 w-fit" style={{ color: token.inkSoft, borderBottom: `1px solid ${token.border}` }}>+ Add charge</button>
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
              <button onClick={() => setAdditionalFields((fs) => [...fs, { id: nextId(), label: "", value: "" }])} className="text-left text-[12px] font-medium uppercase tracking-wide pb-1 w-fit" style={{ color: token.inkSoft, borderBottom: `1px solid ${token.border}` }}>+ Add field</button>
            </div>
          </Collapsible>
        </Card>

        {/* PAYMENT DETAILS */}
        <Card title="Payment Details">
          <label className="text-[10.5px] font-medium uppercase tracking-wide mb-1.5 block" style={{ color: token.inkSoft }}>Bank Account</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            {banks.map((b) => {
              const selected = selectedBank === b.id;
              return (
                <button key={b.id} onClick={() => { setSelectedBank(b.id); showToast("Bank account selected"); }} className="flex items-center gap-3 rounded-[24px] px-3.5 py-2.5 text-left"
                  style={{ border: `1px solid ${selected ? token.ink : token.border}`, background: selected ? token.cardAlt : "white", boxShadow: "none" }}>
                  <div className="w-8 h-8 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: token.bg, color: token.inkSoft }}><Landmark size={16} /></div>
                  <div className="min-w-0"><div className="text-sm font-medium" style={{ color: token.ink }}>{b.name}</div><div className="text-xs" style={{ color: token.inkSoft }}>{b.account}</div></div>
                  {selected && <Check size={16} className="ml-auto shrink-0" style={{ color: token.ink }} />}
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between gap-3 rounded-[24px] px-3.5 py-2.5 flex-wrap" style={{ border: `1px solid ${token.border}`, background: token.cardAlt }}>
            <div><div className="text-[12px] font-medium uppercase tracking-wide" style={{ color: token.ink }}>Show payment details on invoice</div><div className="text-xs" style={{ color: token.inkSoft }}>Display bank account information to the client</div></div>
            <button onClick={() => { setShowPayment((s) => !s); showToast(!showPayment ? "Payment details visible" : "Payment details hidden"); }} aria-label={showPayment ? "Hide payment details" : "Show payment details"} className="relative shrink-0 rounded-full transition-colors" style={{ width: 42, height: 22, background: showPayment ? token.ink : token.border }}>
              <span className="absolute rounded-full bg-white transition-transform" style={{ width: 16, height: 16, top: 3, left: 3, transform: showPayment ? "translateX(20px)" : "none", boxShadow: "none" }} />
            </button>
          </div>
        </Card>

        {/* SUMMARY */}
        <Card title="Summary">
          <div className="flex flex-col">
            <TotalRow label="Subtotal" value={totals.subtotal} />
            {discount.value > 0 && discount.timing === "beforeTax" && <TotalRow label="Discount (before tax)" value={-totals.discountAmt} />}
            {charges.filter((c) => c.taxable && Number(c.value) !== 0).map((c) => <TotalRow key={c.id} label={c.label || "Charge"} value={Number(c.value)} />)}
            {Number(vatRate) > 0 && <TotalRow label={`VAT (${vatRate}%)`} value={totals.vat} />}
            {discount.value > 0 && discount.timing === "afterTax" && <TotalRow label="Discount (after tax)" value={-totals.discountAmt} />}
            {charges.filter((c) => !c.taxable && Number(c.value) !== 0).map((c) => <TotalRow key={c.id} label={c.label || "Charge"} value={Number(c.value)} />)}
            {wht.rate > 0 && <TotalRow label="WHT" value={-totals.whtAmt} />}
            <div className="flex justify-between items-baseline pt-3 mt-1" style={{ borderTop: `2px solid ${token.ink}` }}>
              <span style={{ fontFamily: fontDisplay, fontWeight: 400, fontSize: 20, color: token.ink, letterSpacing: "-0.5px" }}>Grand Total</span>
              <span style={{ fontFamily: fontDisplay, fontWeight: 500, fontSize: 24, color: token.ink, letterSpacing: "-0.5px" }}>${money(totals.grandTotal)}</span>
            </div>
            <div className="text-xs italic pt-2 mt-1" style={{ color: token.inkSoft, borderTop: `1px solid ${token.border}` }}>{numberToWords(totals.grandTotal)} dollars</div>
          </div>
        </Card>

        {/* ADDITIONAL INFORMATION */}
        <div ref={additionalCardRef}>
          <Card title="Additional Information">
            <Collapsible label="Notes" defaultOpen>
              <textarea value={notes} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)} rows={3} className="w-full rounded-[12px] px-3 py-2 text-sm outline-none resize-y" style={{ border: `1px solid ${token.border}`, color: token.ink, background: token.bg, minHeight: 56 }} />
            </Collapsible>
            <Collapsible label="Terms & Conditions">
              <textarea value={terms} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setTerms(e.target.value)} rows={3} className="w-full rounded-[12px] px-3 py-2 text-sm outline-none resize-y" style={{ border: `1px solid ${token.border}`, color: token.ink, background: token.bg, minHeight: 56 }} />
            </Collapsible>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <Field label="Signatory Name"><TextInput value={signatoryName} onChange={setSignatoryName} placeholder="Full name" /></Field>
              <Field label="Title"><TextInput value={signatoryTitle} onChange={setSignatoryTitle} placeholder="e.g. CEO" /></Field>
            </div>
            <div className="mt-3">
              <label className="text-[10.5px] font-medium uppercase tracking-wide mb-1.5 block" style={{ color: token.inkSoft }}>Signature</label>
              <div className="flex items-center gap-3 rounded-[24px] px-3.5 py-2.5 flex-wrap" style={{ border: `1px dashed ${signature ? token.ink : token.borderStrong}`, background: signature ? token.cardAlt : "white", boxShadow: "none" }}>
                <div className="flex items-center gap-3 flex-1 min-w-[160px]">
                  <div className="w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: "white", border: `1px solid ${token.border}` }}>
                    {signature ? <Check size={17} style={{ color: token.ink }} /> : <PenLine size={17} style={{ color: token.inkSoft }} />}
                  </div>
                  <span className="text-[13px] font-medium" style={{ color: signature ? token.ink : token.inkSoft }}>{signature || "Tap to sign or upload"}</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <GhostButton small onClick={() => { setSignature("Signature captured"); showToast("Signature signed"); }}>Sign now</GhostButton>
                  <GhostButton small onClick={() => { setSignature("Uploaded signature"); showToast("Signature uploaded"); }}><Upload size={12} /> Upload</GhostButton>
                  <GhostButton small onClick={() => { setSignature("Saved signature"); showToast("Saved signature selected"); }}><FolderOpen size={12} /> Saved</GhostButton>
                </div>
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-2">
              <label className="text-[10.5px] font-medium uppercase tracking-wide block" style={{ color: token.inkSoft }}>Reference Links</label>
              {refLinks.map((l) => (
                <div key={l.id} className="grid gap-2 items-end" style={{ gridTemplateColumns: "1fr 1.4fr auto" }}>
                  <TextInput value={l.label} onChange={(v: string) => setRefLinks((ls) => ls.map((x) => (x.id === l.id ? { ...x, label: v } : x)))} placeholder="Label (optional)" />
                  <TextInput value={l.url} onChange={(v: string) => setRefLinks((ls) => ls.map((x) => (x.id === l.id ? { ...x, url: v } : x)))} placeholder="https://..." />
                  <RowIcon label="Remove link" danger onClick={() => setRefLinks((ls) => ls.filter((x) => x.id !== l.id))}><X size={14} /></RowIcon>
                </div>
              ))}
              <button onClick={() => { setRefLinks((ls) => [...ls, { id: nextId(), label: "", url: "" }]); showToast("Reference link added"); }} className="inline-flex items-center gap-1.5 text-left text-[12px] font-medium uppercase tracking-wide pb-1 w-fit" style={{ color: token.inkSoft, borderBottom: `1px solid ${token.border}` }}><Link2 size={13} /> Add reference link</button>
            </div>
          </Card>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-4 mt-1" style={{ borderTop: `1px solid ${token.border}` }}>
          <GhostButton onClick={() => { if (confirm("Discard changes?")) showToast("Changes discarded"); }}>Cancel</GhostButton>
          <PrimaryButton onClick={() => showToast("Invoice saved successfully")}><Save size={16} /> Save Invoice</PrimaryButton>
        </div>
      </div>

      {/* CLEAR ALL CONFIRMATION MODAL */}
      {showClearAllModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: "rgba(42, 34, 43, 0.4)", backdropFilter: "blur(4px)" }}>
          <div className="w-full max-w-sm rounded-[24px] p-5 flex flex-col gap-4" style={{ background: "white", boxShadow: "none", border: `1px solid ${token.border}` }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: "#fdecea", color: token.red }}><Trash2 size={20} /></div>
              <h3 className="text-lg font-semibold" style={{ fontFamily: fontBody, color: token.ink }}>Clear all items?</h3>
            </div>
            <p className="text-sm" style={{ color: token.inkSoft, lineHeight: 1.5 }}>This action will permanently remove all line items and groups from this invoice. This cannot be undone.</p>
            <div className="flex gap-3 mt-2">
              <button onClick={() => setShowClearAllModal(false)} className="flex-1 py-2.5 rounded-[12px] text-sm font-semibold tracking-wide transition-colors" style={{ border: `1px solid ${token.border}`, color: token.ink, background: "white" }}>Cancel</button>
              <button onClick={clearAll} className="flex-1 py-2.5 rounded-[12px] text-sm font-semibold tracking-wide transition-colors text-[#faf9fb]" style={{ background: token.red, boxShadow: "none" }}>Yes, clear all</button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING SAVE BUTTON */}
      <button onClick={() => showToast("Invoice saved")} aria-label="Save invoice" className="fixed bottom-6 right-5 sm:bottom-8 sm:right-8 w-14 h-14 rounded-full flex items-center justify-center z-50" style={{ background: token.black, color: "#faf9fb", boxShadow: "none" }}><Save size={22} /></button>

      {/* TOAST */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] pointer-events-none w-[calc(100%-32px)] max-w-sm">
        <div className="rounded-full px-5 py-2.5 text-sm font-medium text-center transition-all duration-300" style={{ background: token.ink, color: "#faf9fb", opacity: toast ? 1 : 0, transform: toast ? "translateY(0) scale(1)" : "translateY(16px) scale(0.95)" }}>{toast}</div>
      </div>
    </div>
  );
}

function TotalRow({ label, value }: { label: string, value: number }) {
  return (
    <div className="flex justify-between py-1.5 text-[14px]" style={{ borderBottom: `1px solid ${token.border}`, color: token.inkSoft }}>
      <span>{label}</span>
      <span style={{ fontWeight: 500, color: token.ink }}>{value < 0 ? "-" : ""}${money(Math.abs(value))}</span>
    </div>
  );
}

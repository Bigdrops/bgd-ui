import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import {
  Plus, Trash2, Copy, ChevronUp, ChevronDown,
  Upload, PenLine, FolderOpen, X, Save,
  FolderPlus, ListPlus, Check, Landmark, EllipsisVertical,
  FileText, SlidersHorizontal, Link2,
} from "lucide-react";

/* ---------------------------------------------------------
   DESIGN TOKENS — "Ease Health" · botanical greenhouse on
   cream paper. Depth comes entirely from layered tinted
   panels (cream → keylime → mint → sage → slate), never from
   shadows or colored borders — this system forbids both.
   Forest Ink is the one saturated dark: it carries every
   heading, action, and link. Regular body copy stays Charcoal.
   Group "shells" are built as a heavier Sage panel holding
   lighter Cream item cards, rather than a dark bordered frame.
--------------------------------------------------------- */
const token = {
  bg: "#fffefc",           // Cream Paper — page background
  card: "#e1f4df",         // Keylime Wash — default card/section surface
  cardShadow: "none",      // shadows are forbidden system-wide
  surface: "#fffefc",      // Cream Paper — "inner" floating cards (item rows, tiles)
  surfaceShadow: "none",
  mint: "#cfe7d3",         // Mint Veil — mid-tone divider/hover surface
  sage: "#b1dbb8",         // Sage Mist — heavier tinted panel (group shell)
  slate: "#b6ced5",        // Slate Hush — cool counter-panel (unused here, reserved)
  hover: "#cfe7d3",
  border: "#efeeeb",       // Border Mist — the only hairline divider color
  borderStrong: "#efeeeb",
  ink: "#0f3e17",          // Forest Ink — every heading, action, link, icon stroke
  inkSoft: "#222222",      // Charcoal — regular body copy, secondary/nav text
  inkFaint: "rgba(34,34,34,0.45)",
  pureBlack: "#0f3e17",    // destructive actions still use Forest Ink (the one action color)
  darkGround: "#b1dbb8",   // Sage — used for shell panels instead of a dark band
  accent: "#0f3e17",       // same as ink — this system doesn't ration its color
  glow: "none",
  glowStrong: "none",
};

const fontBody = "'Suisse Intl', 'Inter', ui-sans-serif, system-ui, sans-serif";
const fontDisplay = "'Faire Octave', 'Cormorant Garamond', Georgia, serif"; // weight 300 only, ≥40px

const fontLinks = (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300&family=Inter:wght@300;400;600&display=swap');
  `}</style>
);

let uid = 100;
const nextId = () => `id${uid++}`;
const money = (n) =>
  (Number.isFinite(n) ? n : 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ---------------------------------------------------------
   PRIMITIVES
--------------------------------------------------------- */
function Card({ title, badge, children, right }) {
  return (
    <section
      className="p-2.5 sm:p-4 mb-2.5"
      style={{ background: token.card, borderRadius: 14, boxShadow: token.cardShadow }}
    >
      {(title || right) && (
        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
          <h2 style={{ fontFamily: fontBody, fontWeight: 400, color: token.ink, fontSize: 23 }}>
            {title}
          </h2>
          {right}
          {badge && (
            <span
              className="text-[11px] font-normal uppercase tracking-wide px-3 py-1 rounded-full"
              style={{ color: token.ink, background: token.bg }}
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

function Field({ label, children, className = "" }) {
  return (
    <div className={`flex flex-col gap-1 w-full min-w-0 ${className}`}>
      {label && (
        <label
          className="text-[10.5px] font-semibold uppercase"
          style={{ color: token.ink, fontFamily: fontBody, letterSpacing: "0.08em" }}
        >
          {label}
        </label>
      )}
      {children}
    </div>
  );
}

const inputBase =
  "w-full px-3.5 py-2 text-[15px] outline-none transition-colors duration-150 bg-white";
function inputStyle(focused) {
  return {
    border: `1px solid ${focused ? token.ink : token.border}`,
    color: token.ink,
    fontFamily: fontBody,
    borderRadius: 14,
    boxShadow: "none",
  };
}

function TextInput({ value, onChange, placeholder, type = "text", align, min, step }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value}
      min={min}
      step={step}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      placeholder={placeholder}
      className={inputBase}
      style={{ ...inputStyle(focused), textAlign: align || "left" }}
    />
  );
}

function Select({ value, onChange, options }) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={inputBase + " appearance-none pr-8 bg-no-repeat"}
      style={{
        ...inputStyle(focused),
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236f766c' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")",
        backgroundPosition: "right 12px center",
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function GhostButton({ children, onClick, danger, small }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`inline-flex items-center gap-1.5 font-normal transition-colors ${
        small ? "text-[11px] px-3 py-1.5" : "text-[13px] px-4 py-2"
      }`}
      style={{
        fontFamily: fontBody,
        borderRadius: 14,
        color: danger && hover ? token.pureBlack : token.ink,
        background: hover ? token.hover : token.bg,
        minHeight: small ? 34 : 40,
      }}
    >
      {children}
    </button>
  );
}

function PrimaryButton({ children, onClick, full }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`inline-flex items-center justify-center gap-2 text-sm font-normal px-6 py-3 transition-all ${
        full ? "w-full" : ""
      }`}
      style={{
        fontFamily: fontBody,
        borderRadius: 14,
        background: token.accent,
        color: "white",
        opacity: hover ? 0.88 : 1,
      }}
    >
      {children}
    </button>
  );
}

/* Compact icon-only action for row toolbars — every row action (including
   Insert below) uses this so nothing wraps or overflows on narrow phones. */
function RowIcon({ label, onClick, danger, tone, children }) {
  const [hover, setHover] = useState(false);
  const active = tone === "accent";
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={label}
      title={label}
      className="inline-flex items-center justify-center rounded-full shrink-0"
      style={{
        width: 32,
        height: 32,
        color: active ? "white" : token.ink,
        background: active ? token.ink : hover ? token.mint : token.card,
        transition: "all .15s ease",
      }}
    >
      {children}
    </button>
  );
}

/* Kebab action menu — mirrors spec §12.1 (Scroll to notes, Import,
   Save, Table settings, Clear all). Card-header-level, not per-row. */
function ActionMenu({ items }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="More actions"
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-1"
        style={{ color: token.ink, background: "transparent" }}
      >
        <EllipsisVertical size={19} />
      </button>
      {open && (
        <div
          className="absolute right-0 top-11 overflow-hidden z-50"
          style={{ background: "white", border: `1px solid ${token.border}`, boxShadow: token.surfaceShadow, minWidth: 190, borderRadius: 14 }}
        >
          {items.map((it, i) =>
            it.divider ? (
              <hr key={i} style={{ border: "none", borderTop: `1px solid ${token.border}`, margin: "4px 8px" }} />
            ) : (
              <button
                key={i}
                onClick={() => { setOpen(false); it.onClick(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-[13px] font-normal"
                style={{ color: it.danger ? token.pureBlack : token.ink }}
              >
                {it.icon}
                {it.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

function Collapsible({ label, hint, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b last:border-b-0" style={{ borderColor: token.border }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-2.5 text-left"
        style={{ minHeight: 40 }}
      >
        <span
          className="text-[13px] font-semibold uppercase tracking-wide"
          style={{ color: token.ink, fontFamily: fontBody }}
        >
          {label}{" "}
          {hint && (
            <span className="font-normal normal-case tracking-normal text-xs" style={{ color: token.inkFaint }}>
              — {hint}
            </span>
          )}
        </span>
        <ChevronDown
          size={16}
          style={{ color: token.inkSoft, transition: "transform .2s ease", transform: open ? "rotate(180deg)" : "none" }}
        />
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  );
}

/* Reusable "Label — Value" inline pair, always side by side, even on
   narrow phones (this is what custom header fields / additional fields use). */
function LabelValueRow({ label, value, onLabel, onValue, onRemove, labelPh = "Label", valuePh = "Value" }) {
  return (
    <div className="grid gap-2 items-end" style={{ gridTemplateColumns: "1fr 1fr auto" }}>
      <TextInput value={label} onChange={onLabel} placeholder={labelPh} />
      <TextInput value={value} onChange={onValue} placeholder={valuePh} />
      <RowIcon label="Remove field" danger onClick={onRemove}>
        <X size={14} />
      </RowIcon>
    </div>
  );
}

/* Two-option segmented control — used for Discount Type/Timing and WHT
   Unit. A binary pill toggle reads faster than a dropdown for 2 choices
   since both options are visible and one tap switches, no menu to open. */
function Segmented({ value, onChange, options }) {
  return (
    <div
      className="inline-flex rounded-full p-1 w-full"
      style={{ background: token.bg }}
    >
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className="flex-1 text-[12px] font-normal uppercase tracking-wide py-2 rounded-full transition-all"
            style={{
              background: active ? token.ink : "transparent",
              color: active ? "white" : token.inkSoft,
              boxShadow: active ? token.glow : "none",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------
   LINE ITEM ROW
--------------------------------------------------------- */
function ItemRow({ item, index, isFirst, onChange, onInsertAbove, onInsertBelow, onMoveUp, onMoveDown, onDuplicate, onDelete }) {
  const total = (Number(item.qty) || 0) * (Number(item.price) || 0);
  const taRef = useRef(null);
  const [showSub, setShowSub] = useState(!!item.subDescription);

  const autoGrow = useCallback((el) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, []);

  return (
    <div className="flex flex-col gap-1.5">
      {isFirst && (
        <button
          onClick={onInsertAbove}
          className="w-full text-center text-[13px] font-normal py-2"
          style={{ color: token.ink, background: token.mint, borderRadius: 14 }}
        >
          Insert above
        </button>
      )}

      <div
        className="relative px-1.5 py-2.5 sm:px-2 sm:py-3 flex flex-col gap-2"
        style={{ background: token.surface, borderRadius: 14, boxShadow: token.surfaceShadow }}
      >
        {/* Hanging delete — Forest Ink (this brand's single action color,
            used broadly rather than rationed) */}
        <button
          onClick={onDelete}
          aria-label="Delete row"
          className="absolute rounded-full flex items-center justify-center"
          style={{
            top: -10, right: -10, width: 26, height: 26,
            background: token.pureBlack, color: "white",
            boxShadow: "none",
          }}
        >
          <X size={14} />
        </button>

        <div className="flex items-start gap-2 pr-2">
          {/* Number with move up/down stacked directly beneath it */}
          <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5" style={{ minWidth: 26 }}>
            <span className="text-base font-light" style={{ color: token.inkFaint, fontFamily: fontBody }}>
              {index}
            </span>
            <button
              onClick={onMoveUp}
              aria-label="Move up"
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ color: token.ink, background: token.card }}
            >
              <ChevronUp size={13} />
            </button>
            <button
              onClick={onMoveDown}
              aria-label="Move down"
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ color: token.ink, background: token.card }}
            >
              <ChevronDown size={13} />
            </button>
          </div>

          <div className="flex-1 min-w-0 flex flex-col gap-1.5">
            <textarea
              ref={(el) => { taRef.current = el; autoGrow(el); }}
              rows={1}
              value={item.description}
              onChange={(e) => { onChange({ ...item, description: e.target.value }); autoGrow(e.target); }}
              placeholder="Description"
              className="w-full resize-none outline-none bg-transparent leading-snug"
              style={{ fontFamily: fontBody, fontWeight: 400, fontSize: 16, color: token.ink, minHeight: 22, letterSpacing: "-0.01em" }}
            />

            {/* Sub-description — collapsed by default, full-width when open */}
            <div>
              <button
                onClick={() => setShowSub((s) => !s)}
                className="inline-flex items-center gap-1 text-[11px] font-normal uppercase tracking-wide"
                style={{ color: token.inkSoft }}
              >
                <ChevronDown size={12} style={{ transition: "transform .2s ease", transform: showSub ? "rotate(180deg)" : "none" }} />
                Sub-description
              </button>
              {showSub && (
                <textarea
                  rows={2}
                  value={item.subDescription || ""}
                  onChange={(e) => onChange({ ...item, subDescription: e.target.value })}
                  placeholder="Add a sub-description"
                  className="w-full resize-y outline-none text-sm mt-1 px-2.5 py-1.5 rounded-lg"
                  style={{ border: `1px solid ${token.border}`, color: token.inkSoft, background: token.bg }}
                />
              )}
            </div>

            <div
              className="grid grid-cols-2 gap-2 pt-1.5"
              style={{ borderTop: `1px solid ${token.border}` }}
            >
              <Field label="Qty">
                <TextInput
                  type="number" min={0} step={1} align="right"
                  value={item.qty}
                  onChange={(v) => onChange({ ...item, qty: v })}
                />
              </Field>
              <Field label="Price">
                <TextInput
                  type="number" min={0} step={0.01} align="right"
                  value={item.price}
                  onChange={(v) => onChange({ ...item, price: v })}
                />
              </Field>
            </div>

            {/* Total — its own full-width, bold bar, unmistakably distinct
                from the Qty/Price inputs above it. */}
            <div
              className="flex items-center justify-between px-3 py-2 mt-0.5"
              style={{ background: token.mint, borderRadius: 14 }}
            >
              <span className="text-[10.5px] font-normal uppercase tracking-wide" style={{ color: token.inkSoft }}>
                Total
              </span>
              <span style={{ fontFamily: fontBody, fontWeight: 400, fontSize: 24, color: token.ink }}>
                ${money(total)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1.5" style={{ borderTop: `1px solid ${token.border}` }}>
          <button
            onClick={onInsertBelow}
            className="flex-1 text-center text-[13px] font-normal py-2"
            style={{ color: token.ink, background: token.mint, borderRadius: 14 }}
          >
            Insert below
          </button>
          <RowIcon label="Duplicate" onClick={onDuplicate}><Copy size={13} /></RowIcon>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   MAIN COMPONENT
--------------------------------------------------------- */
export default function InvoiceWorkspace() {
  const [header, setHeader] = useState({
    client: "Acme Corp",
    title: "Website Development — Q2 2026",
    number: "INV-2026-001",
    po: "",
    issueDate: "2026-07-22",
    dueDate: "2026-08-21",
  });
  const [clients, setClients] = useState(["Acme Corp", "Beta Inc.", "Gamma Studios", "Delta Labs"]);
  const [customHeaderFields, setCustomHeaderFields] = useState([]);

  const [sections, setSections] = useState([
    {
      type: "group",
      id: "g1",
      name: "Design Phase",
      items: [
        { id: nextId(), description: "Homepage Design", qty: 1, price: 1200 },
        { id: nextId(), description: "Dashboard UI", qty: 2, price: 850 },
        { id: nextId(), description: "Brand Identity & Logo", qty: 1, price: 600 },
      ],
    },
    { type: "item", id: nextId(), description: "React Frontend Build", qty: 1, price: 2500 },
    { type: "item", id: nextId(), description: "Server Setup & Deployment", qty: 1, price: 400 },
  ]);

  const [paymentTerms, setPaymentTerms] = useState("Net 30");
  const [customTerms, setCustomTerms] = useState("");
  const [discount, setDiscount] = useState({ value: 0, type: "percentage", timing: "beforeTax" });
  const [vatRate, setVatRate] = useState(20);
  const [wht, setWht] = useState({ rate: 0, unit: "percentage" });
  const [charges, setCharges] = useState([{ id: nextId(), label: "Shipping", value: 25, taxable: true }]);
  const [additionalFields, setAdditionalFields] = useState([]);

  const [banks] = useState([
    { id: "b1", name: "Chase", account: "•••• 4821" },
    { id: "b2", name: "Bank of America", account: "•••• 7392" },
    { id: "b3", name: "Wells Fargo", account: "•••• 1546" },
  ]);
  const [selectedBank, setSelectedBank] = useState("b1");
  const [showPayment, setShowPayment] = useState(true);

  const [notes, setNotes] = useState("Thank you for your business.");
  const [terms, setTerms] = useState("Payment due within 30 days.");
  const [signatoryName, setSignatoryName] = useState("");
  const [signatoryTitle, setSignatoryTitle] = useState("");
  const [signature, setSignature] = useState(null);
  const [refLinks, setRefLinks] = useState([]);
  const additionalCardRef = useRef(null);

  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);
  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2000);
  };

  /* ---- line item helpers ---- */
  const emptyItem = () => ({ id: nextId(), description: "", qty: 1, price: 0 });

  const updateItemInSections = (itemId, updater) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.type === "item" && s.id === itemId) return updater(s);
        if (s.type === "group") return { ...s, items: s.items.map((it) => (it.id === itemId ? updater(it) : it)) };
        return s;
      })
    );
  };

  const insertBelowItem = (itemId) => {
    setSections((prev) => {
      const next = [];
      for (const s of prev) {
        if (s.type === "item") {
          next.push(s);
          if (s.id === itemId) next.push({ type: "item", ...emptyItem() });
        } else {
          const items = [];
          for (const it of s.items) {
            items.push(it);
            if (it.id === itemId) items.push(emptyItem());
          }
          next.push({ ...s, items });
        }
      }
      return next;
    });
    showToast("Row inserted below");
  };

  const insertAboveItem = (itemId) => {
    setSections((prev) => {
      const next = [];
      for (const s of prev) {
        if (s.type === "item") {
          if (s.id === itemId) next.push({ type: "item", ...emptyItem() });
          next.push(s);
        } else {
          const items = [];
          for (const it of s.items) {
            if (it.id === itemId) items.push(emptyItem());
            items.push(it);
          }
          next.push({ ...s, items });
        }
      }
      return next;
    });
    showToast("Row inserted above");
  };

  const duplicateItem = (itemId) => {
    setSections((prev) => {
      const next = [];
      for (const s of prev) {
        if (s.type === "item") {
          next.push(s);
          if (s.id === itemId) next.push({ type: "item", ...s, id: nextId() });
        } else {
          const items = [];
          for (const it of s.items) {
            items.push(it);
            if (it.id === itemId) items.push({ ...it, id: nextId() });
          }
          next.push({ ...s, items });
        }
      }
      return next;
    });
    showToast("Row duplicated");
  };

  const deleteItem = (itemId) => {
    setSections((prev) =>
      prev
        .map((s) => (s.type === "group" ? { ...s, items: s.items.filter((it) => it.id !== itemId) } : s))
        .filter((s) => s.type === "group" || s.id !== itemId)
    );
    showToast("Row deleted");
  };

  const moveItem = (itemId, dir) => {
    setSections((prev) => {
      const next = prev.map((s) => (s.type === "group" ? { ...s, items: [...s.items] } : { ...s }));
      let arr = null, idx = -1;
      for (const s of next) {
        if (s.type === "group") {
          const i = s.items.findIndex((it) => it.id === itemId);
          if (i !== -1) { arr = s.items; idx = i; }
        }
      }
      if (arr) {
        const swapWith = dir === "up" ? idx - 1 : idx + 1;
        if (swapWith < 0 || swapWith >= arr.length) return prev;
        [arr[idx], arr[swapWith]] = [arr[swapWith], arr[idx]];
        return next;
      }
      const rootIdx = next.findIndex((s) => s.type === "item" && s.id === itemId);
      if (rootIdx === -1) return prev;
      const swapWith = dir === "up" ? rootIdx - 1 : rootIdx + 1;
      if (swapWith < 0 || swapWith >= next.length) return prev;
      [next[rootIdx], next[swapWith]] = [next[swapWith], next[rootIdx]];
      return next;
    });
  };

  const addStandaloneRow = () => {
    setSections((prev) => [...prev, { type: "item", ...emptyItem() }]);
    showToast("Row added");
  };

  const addGroup = () => {
    setSections((prev) => [...prev, { type: "group", id: nextId(), name: "New Group", items: [emptyItem()] }]);
    showToast("Group added");
  };

  const addItemToGroup = (groupId) => {
    setSections((prev) =>
      prev.map((s) => (s.type === "group" && s.id === groupId ? { ...s, items: [...s.items, emptyItem()] } : s))
    );
  };

  const deleteGroup = (groupId) => {
    if (!confirm("Delete this group? Items will be ungrouped.")) return;
    setSections((prev) => {
      const g = prev.find((s) => s.type === "group" && s.id === groupId);
      const others = prev.filter((s) => !(s.type === "group" && s.id === groupId));
      const releasedItems = (g?.items || []).map((it) => ({ type: "item", ...it }));
      return [...others, ...releasedItems];
    });
    showToast("Group deleted");
  };

  const clearAll = () => {
    if (!confirm("Clear all line items?")) return;
    setSections([]);
    showToast("All items cleared");
  };

  const renameGroup = (groupId, name) => {
    setSections((prev) => prev.map((s) => (s.type === "group" && s.id === groupId ? { ...s, name } : s)));
  };

  /* ---- flattened numbering ---- */
  const flatOrder = useMemo(() => {
    const order = [];
    sections.forEach((s) => {
      if (s.type === "item") order.push(s.id);
      else s.items.forEach((it) => order.push(it.id));
    });
    return order;
  }, [sections]);
  const numberOf = (id) => flatOrder.indexOf(id) + 1;

  /* ---- totals (spec §10.1) ---- */
  const totals = useMemo(() => {
    let subtotal = 0;
    sections.forEach((s) => {
      const items = s.type === "group" ? s.items : [s];
      items.forEach((it) => (subtotal += (Number(it.qty) || 0) * (Number(it.price) || 0)));
    });

    const discountAmt =
      discount.value > 0
        ? discount.type === "percentage"
          ? subtotal * (Number(discount.value) / 100)
          : Number(discount.value)
        : 0;

    const taxedCharges = charges.filter((c) => c.taxable).reduce((a, c) => a + (Number(c.value) || 0), 0);
    const nonTaxedCharges = charges.filter((c) => !c.taxable).reduce((a, c) => a + (Number(c.value) || 0), 0);

    const vatBase = discount.timing === "beforeTax" ? subtotal - discountAmt : subtotal;
    const vat = vatBase * (Number(vatRate) / 100 || 0);

    const whtBase = subtotal - discountAmt;
    const whtAmt = wht.rate > 0 ? (wht.unit === "percentage" ? whtBase * (Number(wht.rate) / 100) : Number(wht.rate)) : 0;

    const grandTotal = subtotal - discountAmt + vat + taxedCharges - whtAmt + nonTaxedCharges;

    return { subtotal, discountAmt, taxedCharges, nonTaxedCharges, vat, whtAmt, grandTotal };
  }, [sections, discount, vatRate, wht, charges]);

  const rowCount = flatOrder.length;

  return (
    <div style={{ background: token.bg, minHeight: "100vh", fontFamily: fontBody }} className="pb-24">
      {fontLinks}

      {/* HERO MASTHEAD — Faire Octave (weight 300 only, never below 40px)
          on a flat Keylime Wash panel. No gradients in this system; depth
          comes from tinted panel layering, not atmosphere. */}
      <div
        className="w-full flex items-start justify-between gap-4 px-4 sm:px-8 py-8 sm:py-10"
        style={{ background: token.card }}
      >
        <h1
          style={{
            fontFamily: fontDisplay,
            fontWeight: 300,
            color: token.ink,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
          }}
          className="text-5xl sm:text-6xl"
        >
          Invoice
        </h1>
        <ActionMenu
          items={[
            {
              icon: <FileText size={15} />, label: "Scroll to notes",
              onClick: () => additionalCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
            },
            { icon: <Upload size={15} />, label: "Import", onClick: () => showToast("Import dialog") },
            { icon: <Save size={15} />, label: "Save", onClick: () => showToast("Invoice saved") },
            { icon: <SlidersHorizontal size={15} />, label: "Table settings", onClick: () => showToast("Table settings") },
            { divider: true },
            { icon: <Trash2 size={15} />, label: "Clear all", danger: true, onClick: () => clearAll() },
          ]}
        />
      </div>

      <div className="max-w-4xl mx-auto px-1.5 sm:px-4 pt-4 sm:pt-6">

        {/* HEADER */}
        <Card>
          <div className="flex flex-col gap-2.5">
            <Field label="Client">
              <Select
                value={header.client}
                onChange={(v) => {
                  if (v === "__add_new__") {
                    const name = prompt("Enter client name:");
                    if (name && name.trim()) {
                      setClients((prev) => [...prev, name.trim()]);
                      setHeader({ ...header, client: name.trim() });
                      showToast("Client added");
                    }
                  } else {
                    setHeader({ ...header, client: v });
                  }
                }}
                options={[...clients.map((c) => ({ value: c, label: c })), { value: "__add_new__", label: "+ Add new client…" }]}
              />
            </Field>

            <Field label="Title">
              <TextInput value={header.title} onChange={(v) => setHeader({ ...header, title: v })} />
            </Field>

            {/* Bug fix: Invoice # and PO # share a row, even on narrow phones —
                both are short fields with no reason to stack. */}
            <div className="grid grid-cols-2 gap-2">
              <Field label="Invoice #">
                <TextInput value={header.number} onChange={(v) => setHeader({ ...header, number: v })} />
              </Field>
              <Field label="PO #">
                <TextInput value={header.po} onChange={(v) => setHeader({ ...header, po: v })} placeholder="Optional" />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Field label="Issue Date">
                <TextInput type="date" value={header.issueDate} onChange={(v) => setHeader({ ...header, issueDate: v })} />
              </Field>
              <Field label="Due Date">
                <TextInput type="date" value={header.dueDate} onChange={(v) => setHeader({ ...header, dueDate: v })} />
              </Field>
            </div>

            {/* Custom header fields: always visible, unlimited, label+value
                inline on the same row — not a hide/reveal toggle. */}
            <div className="pt-2 flex flex-col gap-2" style={{ borderTop: `1px solid ${token.border}` }}>
              <span className="text-[10.5px] font-semibold uppercase tracking-wide" style={{ color: token.inkSoft }}>
                Custom fields
              </span>
              {customHeaderFields.map((f) => (
                <LabelValueRow
                  key={f.id}
                  label={f.label}
                  value={f.value}
                  labelPh="e.g. Project ID"
                  valuePh="e.g. PRJ-001"
                  onLabel={(v) => setCustomHeaderFields((fs) => fs.map((x) => (x.id === f.id ? { ...x, label: v } : x)))}
                  onValue={(v) => setCustomHeaderFields((fs) => fs.map((x) => (x.id === f.id ? { ...x, value: v } : x)))}
                  onRemove={() => setCustomHeaderFields((fs) => fs.filter((x) => x.id !== f.id))}
                />
              ))}
              <button
                onClick={() => setCustomHeaderFields((fs) => [...fs, { id: nextId(), label: "", value: "" }])}
                className="text-left text-[12px] font-normal uppercase tracking-wide pb-1 w-fit"
                style={{ color: token.inkSoft, borderBottom: `1px solid ${token.border}` }}
              >
                + Add field
              </button>
            </div>
          </div>
        </Card>

        {/* LINE ITEMS */}
        <Card
          title="Line Items"
          right={
            <span
              className="text-[11px] font-normal uppercase tracking-wide px-3 py-1 rounded-full ml-auto"
              style={{ color: token.ink, background: token.bg }}
            >
              {rowCount} rows
            </span>
          }
        >
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <GhostButton onClick={() => showToast("Import dialog")} small>
              <Upload size={13} /> Import
            </GhostButton>
            <GhostButton onClick={() => showToast("Table settings")} small>
              <SlidersHorizontal size={13} /> Table settings
            </GhostButton>
            <div className="ml-auto">
              <GhostButton onClick={clearAll} danger small>
                <Trash2 size={13} /> Clear all
              </GhostButton>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {sections.map((s) =>
              s.type === "group" ? (
                /* Group shell — a heavier Sage Mist panel holding the lighter
                   Cream item cards inside it. This system builds depth from
                   layered tinted fills, not borders or dark bands. */
                <div
                  key={s.id}
                  style={{ background: token.sage, borderRadius: 14 }}
                >
                  <div className="flex items-center gap-2 px-3 py-2.5 flex-wrap">
                    <input
                      value={s.name}
                      onChange={(e) => renameGroup(s.id, e.target.value)}
                      className="flex-1 min-w-[100px] bg-transparent outline-none"
                      style={{ fontFamily: fontBody, fontWeight: 400, fontSize: 16, color: token.ink }}
                    />
                    <span
                      className="text-[10.5px] font-normal uppercase px-2 py-0.5 rounded-full"
                      style={{ background: token.bg, color: token.ink }}
                    >
                      {s.items.length} items
                    </span>
                    <span style={{ fontFamily: fontBody, fontWeight: 400, color: token.ink }}>
                      ${money(s.items.reduce((a, it) => a + (Number(it.qty) || 0) * (Number(it.price) || 0), 0))}
                    </span>
                    <button
                      onClick={() => deleteGroup(s.id)}
                      aria-label="Delete group"
                      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: token.bg, color: token.ink }}
                    >
                      <X size={13} />
                    </button>
                  </div>

                  <div className="px-2 pb-2.5 flex flex-col gap-3">
                    {s.items.map((it) => (
                      <ItemRow
                        key={it.id}
                        item={it}
                        index={numberOf(it.id)}
                        isFirst={numberOf(it.id) === 1}
                        onChange={(next) => updateItemInSections(it.id, () => next)}
                        onInsertAbove={() => insertAboveItem(it.id)}
                        onInsertBelow={() => insertBelowItem(it.id)}
                        onDuplicate={() => duplicateItem(it.id)}
                        onDelete={() => deleteItem(it.id)}
                        onMoveUp={() => moveItem(it.id, "up")}
                        onMoveDown={() => moveItem(it.id, "down")}
                      />
                    ))}
                  </div>

                  <div className="px-3 pb-3 flex justify-center">
                    <button
                      onClick={() => addItemToGroup(s.id)}
                      className="inline-flex items-center gap-1.5 text-[12px] font-normal"
                      style={{ color: token.ink }}
                    >
                      <Plus size={13} /> Add item to group
                    </button>
                  </div>
                </div>
              ) : (
                <ItemRow
                  key={s.id}
                  item={s}
                  index={numberOf(s.id)}
                  isFirst={numberOf(s.id) === 1}
                  onChange={(next) => updateItemInSections(s.id, () => next)}
                  onInsertAbove={() => insertAboveItem(s.id)}
                  onInsertBelow={() => insertBelowItem(s.id)}
                  onDuplicate={() => duplicateItem(s.id)}
                  onDelete={() => deleteItem(s.id)}
                  onMoveUp={() => moveItem(s.id, "up")}
                  onMoveDown={() => moveItem(s.id, "down")}
                />
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
              <Select
                value={paymentTerms}
                onChange={setPaymentTerms}
                options={["Due on receipt", "Net 7", "Net 14", "Net 30", "Net 60", "Custom"].map((v) => ({ value: v, label: v }))}
              />
            </Field>
            <Field label="Custom Terms">
              <TextInput value={customTerms} onChange={setCustomTerms} placeholder="e.g. 2/10 Net 30" />
            </Field>
          </div>

          <Collapsible label="Discount">
            <div className="grid grid-cols-2 gap-2">
              <Field label="Value">
                <TextInput type="number" min={0} step={0.01} value={discount.value} onChange={(v) => setDiscount({ ...discount, value: v })} />
              </Field>
              <Field label="Type">
                <Segmented value={discount.type} onChange={(v) => setDiscount({ ...discount, type: v })} options={[{ value: "percentage", label: "Percentage" }, { value: "flat", label: "Flat" }]} />
              </Field>
            </div>
            <div className="mt-2">
              <Field label="Timing">
                <Segmented value={discount.timing} onChange={(v) => setDiscount({ ...discount, timing: v })} options={[{ value: "beforeTax", label: "Before Tax" }, { value: "afterTax", label: "After Tax" }]} />
              </Field>
            </div>
          </Collapsible>

          <Collapsible label="VAT" defaultOpen>
            <Field label="Rate (%)">
              <TextInput type="number" min={0} step={0.01} value={vatRate} onChange={setVatRate} />
            </Field>
          </Collapsible>

          <Collapsible label="WHT">
            <div className="grid grid-cols-2 gap-2">
              <Field label="Rate">
                <TextInput type="number" min={0} step={0.01} value={wht.rate} onChange={(v) => setWht({ ...wht, rate: v })} />
              </Field>
              <Field label="Unit">
                <Segmented value={wht.unit} onChange={(v) => setWht({ ...wht, unit: v })} options={[{ value: "percentage", label: "Percentage" }, { value: "flat", label: "Flat" }]} />
              </Field>
            </div>
          </Collapsible>

          <Collapsible label="Additional Charges">
            <div className="flex flex-col gap-2.5">
              {charges.map((c) => (
                <div key={c.id} className="flex flex-col gap-1.5">
                  <div className="grid gap-2 items-end" style={{ gridTemplateColumns: "1fr 1fr auto" }}>
                    <Field label="Label">
                      <TextInput value={c.label} onChange={(v) => setCharges((cs) => cs.map((x) => (x.id === c.id ? { ...x, label: v } : x)))} />
                    </Field>
                    <Field label="Value">
                      <TextInput type="number" min={0} step={0.01} value={c.value} onChange={(v) => setCharges((cs) => cs.map((x) => (x.id === c.id ? { ...x, value: v } : x)))} />
                    </Field>
                    <RowIcon label="Remove charge" danger onClick={() => setCharges((cs) => cs.filter((x) => x.id !== c.id))}>
                      <X size={14} />
                    </RowIcon>
                  </div>
                  <label className="flex items-center gap-2 text-[12px] font-normal" style={{ color: token.ink }}>
                    <input
                      type="checkbox"
                      checked={c.taxable}
                      onChange={(e) => setCharges((cs) => cs.map((x) => (x.id === c.id ? { ...x, taxable: e.target.checked } : x)))}
                      className="w-[16px] h-[16px]"
                      style={{ accentColor: token.ink }}
                    />
                    <span
                      className="text-[10.5px] uppercase font-normal px-2 py-0.5 rounded-full"
                      style={c.taxable ? { color: "white", background: token.ink } : { color: token.inkFaint, background: token.card }}
                    >
                      {c.taxable ? "Taxable" : "Non-taxable"}
                    </span>
                  </label>
                </div>
              ))}
              <button
                onClick={() => setCharges((cs) => [...cs, { id: nextId(), label: "", value: 0, taxable: false }])}
                className="text-left text-[12px] font-normal uppercase tracking-wide pb-1 w-fit"
                style={{ color: token.inkSoft, borderBottom: `1px solid ${token.border}` }}
              >
                + Add charge
              </button>
            </div>
          </Collapsible>

          <Collapsible label="Additional Fields">
            <div className="flex flex-col gap-2">
              {additionalFields.map((f) => (
                <LabelValueRow
                  key={f.id}
                  label={f.label}
                  value={f.value}
                  onLabel={(v) => setAdditionalFields((fs) => fs.map((x) => (x.id === f.id ? { ...x, label: v } : x)))}
                  onValue={(v) => setAdditionalFields((fs) => fs.map((x) => (x.id === f.id ? { ...x, value: v } : x)))}
                  onRemove={() => setAdditionalFields((fs) => fs.filter((x) => x.id !== f.id))}
                />
              ))}
              <button
                onClick={() => setAdditionalFields((fs) => [...fs, { id: nextId(), label: "", value: "" }])}
                className="text-left text-[12px] font-normal uppercase tracking-wide pb-1 w-fit"
                style={{ color: token.inkSoft, borderBottom: `1px solid ${token.border}` }}
              >
                + Add field
              </button>
            </div>
          </Collapsible>
        </Card>

        {/* PAYMENT DETAILS */}
        <Card title="Payment Details">
          <label className="text-[10.5px] font-semibold uppercase tracking-wide mb-1.5 block" style={{ color: token.inkSoft }}>
            Bank Account
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            {banks.map((b) => {
              const selected = selectedBank === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => { setSelectedBank(b.id); showToast("Bank account selected"); }}
                  className="flex items-center gap-3 px-3.5 py-2.5 text-left"
                  style={{
                    borderRadius: 14,
                    background: selected ? token.mint : token.surface,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: token.bg, color: token.inkSoft }}
                  >
                    <Landmark size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-normal" style={{ color: token.ink }}>{b.name}</div>
                    <div className="text-xs" style={{ color: token.inkSoft }}>{b.account}</div>
                  </div>
                  {selected && <Check size={16} className="ml-auto shrink-0" style={{ color: token.ink }} />}
                </button>
              );
            })}
          </div>

          <div
            className="flex items-center justify-between gap-3 px-3.5 py-2.5 flex-wrap"
            style={{ background: token.mint, borderRadius: 14 }}
          >
            <div>
              <div className="text-[12px] font-normal uppercase tracking-wide" style={{ color: token.ink }}>
                Show payment details on invoice
              </div>
              <div className="text-xs" style={{ color: token.inkSoft }}>Display bank account information to the client</div>
            </div>
            <button
              onClick={() => { setShowPayment((s) => !s); showToast(!showPayment ? "Payment details visible" : "Payment details hidden"); }}
              className="relative shrink-0 rounded-full transition-colors"
              style={{ width: 42, height: 22, background: showPayment ? token.ink : token.border }}
            >
              <span
                className="absolute rounded-full bg-white transition-transform"
                style={{ width: 16, height: 16, top: 3, left: 3, transform: showPayment ? "translateX(20px)" : "none", boxShadow: showPayment ? token.glow : "none" }}
              />
            </button>
          </div>
        </Card>

        {/* SUMMARY */}
        <Card title="Summary">
          <div className="flex flex-col">
            <TotalRow label="Subtotal" value={totals.subtotal} />
            {discount.value > 0 && discount.timing === "beforeTax" && (
              <TotalRow label="Discount (before tax)" value={-totals.discountAmt} />
            )}
            {charges.filter((c) => c.taxable && Number(c.value) !== 0).map((c) => (
              <TotalRow key={c.id} label={c.label || "Charge"} value={Number(c.value) || 0} />
            ))}
            {Number(vatRate) > 0 && <TotalRow label={`VAT (${vatRate}%)`} value={totals.vat} />}
            {discount.value > 0 && discount.timing === "afterTax" && (
              <TotalRow label="Discount (after tax)" value={-totals.discountAmt} />
            )}
            {charges.filter((c) => !c.taxable && Number(c.value) !== 0).map((c) => (
              <TotalRow key={c.id} label={c.label || "Charge"} value={Number(c.value) || 0} />
            ))}
            {wht.rate > 0 && <TotalRow label="WHT" value={-totals.whtAmt} />}
            <div className="flex justify-between items-baseline pt-3 mt-1" style={{ borderTop: `2px solid ${token.ink}` }}>
              <span style={{ fontFamily: fontBody, fontWeight: 400, fontSize: 20, color: token.ink, letterSpacing: "-0.03em" }}>Grand Total</span>
              <span style={{ fontFamily: fontBody, fontWeight: 400, fontSize: 32, color: token.ink, letterSpacing: "-0.03em" }}>
                ${money(totals.grandTotal)}
              </span>
            </div>
            <div className="text-xs italic pt-2 mt-1" style={{ color: token.inkSoft, borderTop: `1px solid ${token.border}` }}>
              {Math.round(totals.grandTotal).toLocaleString()} dollars
            </div>
          </div>
        </Card>

        {/* ADDITIONAL INFORMATION */}
        <div ref={additionalCardRef}>
        <Card title="Additional Information">
          <Collapsible label="Notes" defaultOpen>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm outline-none resize-y bg-white"
              style={{ border: `1px solid ${token.border}`, color: token.ink, minHeight: 56, borderRadius: 14 }}
            />
          </Collapsible>
          <Collapsible label="Terms & Conditions">
            <textarea
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm outline-none resize-y bg-white"
              style={{ border: `1px solid ${token.border}`, color: token.ink, minHeight: 56, borderRadius: 14 }}
            />
          </Collapsible>

          <div className="grid grid-cols-2 gap-2 mt-3">
            <Field label="Signatory Name">
              <TextInput value={signatoryName} onChange={setSignatoryName} placeholder="Full name" />
            </Field>
            <Field label="Title">
              <TextInput value={signatoryTitle} onChange={setSignatoryTitle} placeholder="e.g. CEO" />
            </Field>
          </div>

          <div className="mt-3">
            <label className="text-[10.5px] font-semibold uppercase tracking-wide mb-1.5 block" style={{ color: token.inkSoft }}>
              Signature
            </label>
            <div
              className="flex items-center gap-3 px-3.5 py-2.5 flex-wrap"
              style={{
                borderRadius: 14,
                background: signature ? token.mint : token.surface,
              }}
            >
              <div className="flex items-center gap-3 flex-1 min-w-[160px]">
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: token.card }}>
                  {signature ? <Check size={17} style={{ color: token.ink }} /> : <PenLine size={17} style={{ color: token.inkSoft }} />}
                </div>
                <span className="text-[13px] font-normal" style={{ color: signature ? token.ink : token.inkSoft }}>
                  {signature || "Tap to sign or upload"}
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <GhostButton small onClick={() => { setSignature("Signature captured"); showToast("Signature signed"); }}>Sign now</GhostButton>
                <GhostButton small onClick={() => { setSignature("Uploaded signature"); showToast("Signature uploaded"); }}><Upload size={12} /> Upload</GhostButton>
                <GhostButton small onClick={() => { setSignature("Saved signature"); showToast("Saved signature selected"); }}><FolderOpen size={12} /> Saved</GhostButton>
              </div>
            </div>
          </div>

          {/* Reference Links — unlimited, each with an optional label + URL,
              and its own remove button (spec §9.5). */}
          <div className="mt-3 flex flex-col gap-2">
            <label className="text-[10.5px] font-semibold uppercase tracking-wide block" style={{ color: token.inkSoft }}>
              Reference Links
            </label>
            {refLinks.map((l) => (
              <div key={l.id} className="grid gap-2 items-end" style={{ gridTemplateColumns: "1fr 1.4fr auto" }}>
                <TextInput value={l.label} onChange={(v) => setRefLinks((ls) => ls.map((x) => (x.id === l.id ? { ...x, label: v } : x)))} placeholder="Label (optional)" />
                <TextInput value={l.url} onChange={(v) => setRefLinks((ls) => ls.map((x) => (x.id === l.id ? { ...x, url: v } : x)))} placeholder="https://..." />
                <RowIcon label="Remove link" danger onClick={() => setRefLinks((ls) => ls.filter((x) => x.id !== l.id))}>
                  <X size={14} />
                </RowIcon>
              </div>
            ))}
            <button
              onClick={() => { setRefLinks((ls) => [...ls, { id: nextId(), label: "", url: "" }]); showToast("Reference link added"); }}
              className="inline-flex items-center gap-1.5 text-left text-[12px] font-normal uppercase tracking-wide pb-1 w-fit"
              style={{ color: token.inkSoft, borderBottom: `1px solid ${token.border}` }}
            >
              <Link2 size={13} /> Add reference link
            </button>
          </div>
        </Card>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-4 mt-1" style={{ borderTop: `1px solid ${token.border}` }}>
          <GhostButton onClick={() => { if (confirm("Discard changes?")) showToast("Changes discarded"); }}>Cancel</GhostButton>
          <PrimaryButton onClick={() => showToast("Invoice saved successfully")}>
            <Save size={16} /> Save Invoice
          </PrimaryButton>
        </div>
      </div>

      {/* FLOATING SAVE */}
      <button
        onClick={() => showToast("Invoice saved")}
        aria-label="Save invoice"
        className="fixed bottom-6 right-5 sm:bottom-8 sm:right-8 w-14 h-14 rounded-full flex items-center justify-center z-50"
        style={{ background: token.accent, color: "white" }}
      >
        <Save size={22} />
      </button>

      {/* TOAST */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] pointer-events-none w-[calc(100%-32px)] max-w-sm">
        <div
          className="rounded-full px-5 py-2.5 text-sm font-normal text-center transition-all duration-300"
          style={{
            background: token.ink,
            color: "white",
            opacity: toast ? 1 : 0,
            transform: toast ? "translateY(0) scale(1)" : "translateY(16px) scale(0.95)",
          }}
        >
          {toast}
        </div>
      </div>
    </div>
  );
}

function TotalRow({ label, value }) {
  return (
    <div className="flex justify-between py-1.5 text-[14px]" style={{ borderBottom: `1px solid ${token.border}`, color: token.inkSoft }}>
      <span>{label}</span>
      <span style={{ fontWeight: 400, color: token.ink }}>
        {value < 0 ? "-" : ""}${money(Math.abs(value))}
      </span>
    </div>
  );
}

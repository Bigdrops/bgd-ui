Document Workspace — Behavioral Specification (Static Form)

Version: 7.0 | Date: 2026-07-22 | Status: Final

Applies to: Invoice, Quotation, Purchase Order, and similar business documents.

This is a STATIC form specification. It describes the behavior of the form itself — user interactions, data entry, calculations, and validations — with no persistence logic, no backend integration, and no live app concerns.

---

1. Purpose

This document defines the complete behavioral specification for a static document form — a single‑page UI that allows users to create, edit, and preview business documents (invoices, quotations, purchase orders, etc.). It describes every user interaction, data field, calculation, and validation rule without prescribing visual design, layout, or styling.

The form is static — it only manages state in memory. All data is lost on page reload. This is purely a client‑side form UI.

---

2. Core Data Model

```typescript
interface Document {
  type: 'invoice' | 'quotation' | 'purchaseOrder';
  header: DocumentHeader;
  groups: LineGroup[];
  standaloneItems: LineItem[];
  commercial: CommercialSettings;
  payment: PaymentDetails;
  additional: AdditionalInfo;
  totals: DocumentTotals;
}

interface DocumentHeader {
  title?: string;
  clientId: string;
  clientName: string;
  documentNumber: string;
  referenceNumber: string;
  issueDate: string;
  dueDate: string;
  customFields: CustomField[];
}

interface CustomField {
  id: string;
  label: string;
  value: string;
}

interface LineGroup {
  id: string;
  name: string;
  order: number;
  items: LineItem[];
  subtotal: number;  // Derived: sum of item totals in the group
}

interface LineItem {
  id: string;
  number: number;
  description: string;
  subDescription: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
  make?: string;
  partNumber?: string;
  condition?: string;
  installRate?: number;
  vatRate?: number;
  discountRate?: number;
  hasPhoto: boolean;
  photoData?: string;
  customColumns: CustomColumnValue[];
}

interface CustomColumnValue {
  columnId: string;
  value: any;
}

interface CommercialSettings {
  paymentTerms: string;
  customPaymentTerms: string;
  discount: Discount;
  vat: Vat;
  wht: Wht;
  additionalCharges: AdditionalCharge[];
  additionalFields: AdditionalField[];
}

interface Discount {
  enabled: boolean;
  value: number;
  type: 'percentage' | 'flat';
  timing: 'beforeTax' | 'afterTax';
}

interface Vat {
  enabled: boolean;
  rate: number;
}

interface Wht {
  enabled: boolean;
  rate: number;
  unit: 'percentage' | 'flat';
}

interface AdditionalCharge {
  id: string;
  label: string;
  value: number;
  taxable: boolean;
}

interface AdditionalField {
  id: string;
  label: string;
  value: string;
}

interface PaymentDetails {
  bankAccount: BankAccount;
  showOnDocument: boolean;
}

interface BankAccount {
  id: string;
  name: string;
  accountNumber: string;
  bankName: string;
}

interface AdditionalInfo {
  notes: string;
  terms: string;
  signatoryName: string;
  signatoryTitle: string;
  signature: Signature;
  referenceLinks: ReferenceLink[];
}

interface Signature {
  type: 'signed' | 'uploaded' | 'saved' | 'none';
  data?: string;
  name?: string;
}

interface ReferenceLink {
  id: string;
  label: string;
  url: string;
}

interface DocumentTotals {
  subtotal: number;
  discount: number;
  vat: number;
  wht: number;
  taxedCharges: number;
  nonTaxedCharges: number;
  installRateTotal: number;
  grandTotal: number;
  amountInWords: string;
}
```

---

3. Document Type Identity

· The document type (Invoice, Quotation, Purchase Order) is fixed for the form instance.
· A badge or label displays the type in the header.
· The type is non‑editable.

---

4. Groups vs. Standalone Items — Visual Distinction

4.1 Core Concept

Type Description Visual Treatment
Grouped Items Items organized into named groups Groups must have a visual container with a header (name + subtotal) and footer ("Add item" button)
Standalone Items Independent items not assigned to any group Items are presented individually with a section label (e.g., "Individual items")

4.2 Group Rules

· Groups never collapse — they are always fully visible.
· Groups never reorder automatically — they follow creation order.
· Each group header displays the group name and group subtotal (sum of all item totals).
· Each group footer contains an "Add item" button that appends a new empty item to the group.
· Deleting a group moves all its items to the standalone list.

4.3 Standalone Rules

· Standalone items appear after all groups (or before, depending on design — consistent placement).
· Standalone items are preceded by a section label (e.g., "Individual items").

4.4 Moving Items Between Groups / To Standalone

· Items can be moved from one group to another.
· Items can be moved from a group to the standalone list.
· Items can be moved from the standalone list to an existing group.
· This can be achieved via:
  · A context menu ("Move to group", "Ungroup", "Move to standalone").
  · Drag‑and‑drop between groups and standalone sections.

---

5. Header Section

5.1 Fields

Field Type Behavior
Document Type Badge Shows type (Invoice, Quotation, etc.) — non‑editable
Title Text input Optional
Client Picker/Select Required; opens a client selector sheet/dropdown
Document Number Text input Auto‑generated (default), editable
Reference Number Text input Optional
Issue Date Date input Defaults to today
Due Date Date input Defaults to 30 days after issue date
Custom Header Fields Dynamic list Label + Value pairs; add/remove unlimited

---

6. Line Items Section

6.1 Item Fields

Field Type Behavior
Number Auto‑generated Sequential, non‑editable
Description Textarea Multi‑line, auto‑height, required for save
Sub‑description Textarea Optional; can be expanded/collapsed
Quantity Number input Min 0; step 1
Unit Text input Optional, with suggestions
Unit Price Number input Min 0; step 0.01
Total Derived quantity × unitPrice
Make Text input Optional (if column visible)
Part Number Text input Optional (if column visible)
Condition Text input Optional (if column visible)
Install Rate Number input Optional (if column visible)
VAT Rate Number input Optional; overrides global VAT
Discount Rate Number input Optional; overrides global discount
Photo Toggle Opens image picker; shows thumbnail
Custom Columns Dynamic User‑defined columns

Column flexibility:

· Minimum: Description, Quantity, Unit Price.
· Additional columns may be added via Column Manager.
· On mobile, all columns stack vertically — no horizontal scrolling.

6.2 Item Actions (Per Row)

Action Behavior
Insert below Creates new empty item immediately after this row
Move up Swaps with previous item in same container
Move down Swaps with next item in same container
Duplicate Copies item and inserts copy after it
Delete (×) Removes item; requires confirmation

Drag‑and‑drop may be used as an alternative for reordering.

6.3 Group Actions

Action Location Behavior
Add item Group footer Appends new empty item to group
Rename Group header Inline text editing
Delete Group header Removes group; moves items to standalone

6.4 Subtotals — Prominence

· Individual item total (quantity × unitPrice) must be visually prominent.
· Group subtotal (sum of all item totals in the group) must be visually prominent.

6.5 No Collapsing — Strict Rule

· Line items are never collapsible — they are always visible.
· Groups are never collapsible — they are always visible.
· Sub‑description (optional field) may be expanded/collapsed, but the item itself remains visible.
· This rule does NOT apply to Commercial Settings (Section 7) or Additional Information (Section 9).

---

7. Commercial Settings

Collapsible: Yes, all sections in Commercial Settings may be collapsible.

7.1 Payment Terms

· Dropdown: Due on receipt, Net 7, Net 14, Net 30, Net 60, Custom.
· When Custom is selected, a text input appears.

7.2 Discount

· Fields:
  · Value (number input)
  · Type: Percentage / Flat (segmented)
  · Timing: Before Tax / After Tax (segmented)

7.3 VAT

· Rate (%) (number input).

7.4 WHT

· Rate (number input)
· Unit: Percentage / Flat (segmented)

7.5 Additional Charges

· Add charge (+) button creates a new charge entry:
  · Label (text input)
  · Value (number input)
  · Taxable (toggle/checkbox — default: OFF)
· Each charge shows a status footer (Taxable or Non‑taxable).
· Each charge has a remove (×) button.
· Unlimited charges.

7.6 Additional Fields

· Label + Value pairs; add/remove unlimited.

---

8. Payment Details

8.1 Bank Account Selection

· List of predefined bank accounts (name + masked account number).
· Click to select; selected account is highlighted.
· Option to "Add new" (opens a simple form).

8.2 Payment Visibility Toggle

· Switch labeled "Show payment details on document".
· Default: ON.

---

9. Additional Information

Collapsible: Yes, Notes and Terms sections may be collapsible.

9.1 Notes

· Rich text editor (HTML support) or plain textarea.
· Auto‑height.

9.2 Terms & Conditions

· Same as Notes: rich text or plain text.

9.3 Signatory

· Signatory picker (from saved list) — optional.
· Fallback: text inputs for Name and Title.

9.4 Signature

· Clicking the signature area opens a picker with:
  · Sign now – drawing canvas.
  · Upload – file picker.
  · Saved – pre‑saved signature.
· Shows thumbnail once set.

9.5 Reference Links

· Add reference link button creates a new link row with Label (optional) and URL inputs.
· Unlimited links; each has a remove button.

---

10. Totals

10.1 Calculation Order

1. Subtotal = sum of all item totals.
2. Discount Amount — based on type and value.
3. Taxable Charges = sum of charges with taxable = true.
4. Non‑taxable Charges = sum of charges with taxable = false.
5. VAT — applied based on discount timing:
   · Before Tax: (subtotal - discount) * vatRate
   · After Tax: subtotal * vatRate
6. WHT — applied after VAT:
   · Percentage: (subtotal - discount) * whtRate
   · Flat: whtRate
7. Install Rate Total = sum of installRate across all items (if visible).
8. Grand Total = (subtotal - discount + VAT + taxableCharges) - WHT + nonTaxedCharges.
9. Amount in Words — text representation of grand total.

10.2 Display Order

Order Row Visible When
1 Subtotal Always
2 Discount (before tax) Discount value > 0 AND timing = "beforeTax"
3 Charges (taxed) Any charge where taxable = true
4 VAT VAT rate > 0
5 Discount (after tax) Discount value > 0 AND timing = "afterTax"
6 Charges (non‑taxed) Any charge where taxable = false
7 WHT WHT rate > 0
8 Install Rate Total Any item with installRate > 0
9 Grand Total Always
10 Amount in Words Always (displayed near Grand Total)

---

11. Column Manager

11.1 Purpose

· Allows users to show/hide built‑in columns and add/remove custom columns.
· Accessible via toolbar or actions menu.

11.2 Built‑in Columns

Column Toggleable Default
Number No Visible
Description No Visible
Sub‑description Yes Hidden
Quantity No Visible
Unit Yes Hidden
Unit Price No Visible
Total No Visible
Make Yes Hidden
Part Number Yes Hidden
Condition Yes Hidden
Install Rate Yes Hidden
VAT Rate Yes Hidden
Discount Rate Yes Hidden
Photo Yes Hidden

11.3 Custom Columns

· User can add a custom column with:
  · Label (text)
  · Value type (text, number, dropdown)
  · Default value (optional)
· Custom columns appear as additional fields in each item row.
· Custom columns can be removed.

---

12. Actions & Controls

12.1 Action Menu (Kebab — ⋯)

Item Behavior
Scroll to notes Smooth scroll to Additional Info section
Import Opens import dialog/sheet (supports JSON)
Table settings Opens Column Manager
Clear all Clears all line items; requires confirmation
Add group Creates a new group at the end of groups list

12.2 Toolbar (above line items)

Button Behavior
Import Same as menu item
Table settings Same as menu item
Clear all Same as menu item

12.3 Add Controls (below line items)

Button Behavior
Add row Creates new standalone item at end of standalone list
Add group Creates new empty group at end of groups list

---

13. Validation (Client‑Side)

13.1 Required Fields

Field Validation
Client Must be selected
At least one item At least one item with non‑empty description
Item description Non‑empty for each item

13.2 Validation Feedback

· Inline: Highlight invalid fields (red border, warning icon).
· On save attempt: Toast or alert with error summary; scroll to first invalid field.

---

14. Import (JSON)

· Opens a sheet/dialog with a text area for pasting JSON.
· Validates and imports items, groups, and header fields.
· Replaces current line items on successful import.

---

15. Responsive Behavior

· Mobile‑first – single column, full‑width fields.
· Tablet/Desktop – multi‑column layout where appropriate.
· No horizontal scrolling – all content fits within viewport.
· On mobile, item fields stack vertically.
· Touch targets: minimum 44×44px.

---

16. Implementation Notes

· This is a static form — no persistence, no backend.
· All calculations and validations are client‑side.
· The specification is design‑agnostic — any visual style can be applied.
· The form is document‑type agnostic — works for invoices, quotations, purchase orders, etc.

---


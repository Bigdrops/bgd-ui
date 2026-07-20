# Invoice Workspace — Financial Calculations

**Version:** 1.0
**Date:** 2026-07-20
**Status:** Draft

---

## 1. Purpose

This document defines all financial rules for the Invoice Workspace. It specifies calculation formulas, rounding rules, currency formatting, and edge cases.

---

## 2. Currency

| Property | Value |
|----------|-------|
| Primary currency | Nigerian Naira (NGN) |
| Currency symbol | ₦ |
| Minor unit | Kobo (1/100 of Naira) |
| Display format | ₦1,234,567.89 |

---

## 3. Line Item Calculations

### 3.1 Line Item Subtotal

```
lineItemSubtotal = quantity × unitPrice
```

| Field | Type | Default | Constraint |
|-------|------|---------|------------|
| quantity | Number | 1 | ≥ 0 |
| unitPrice | Number | 0 | ≥ 0 |

### 3.2 Line Item Discount Override

If a line item has a discount override:

```
lineItemSubtotal = quantity × unitPrice × (1 - discountOverride / 100)
```

| Field | Type | Default | Constraint |
|-------|------|---------|------------|
| discountOverride | Number | 0 | 0 to 100 |

### 3.3 Install Rate Calculation

```
installAmount = installRate × quantity
```

| Field | Type | Default | Constraint |
|-------|------|---------|------------|
| installRate | Number | 0 | ≥ 0 |

---

## 4. Group Calculations

### 4.1 Group Subtotal

```
groupSubtotal = Σ lineItemSubtotal (for each item in group)
```

### 4.2 Install Total

```
installTotal = Σ installAmount (for all items)
```

---

## 5. Invoice Subtotal

```
invoiceSubtotal = Σ groupSubtotal (for all groups) + Σ lineItemSubtotal (for standalone items)
```

---

## 6. Discount Calculations

### 6.1 Discount Type

| Type | Formula |
|------|---------|
| Percentage | discountAmount = invoiceSubtotal × (discountValue / 100) |
| Flat | discountAmount = discountValue |
| None | discountAmount = 0 |

### 6.2 Discount Timing

| Timing | Effect |
|--------|--------|
| Before VAT | Discount reduces the taxable base |
| After VAT | Discount applies after VAT calculation |

### 6.3 After Discount

```
afterDiscount = invoiceSubtotal - discountAmount
```

---

## 7. VAT Calculation

### 7.1 VAT Base

| Discount Timing | VAT Base |
|-----------------|----------|
| Before VAT | afterDiscount |
| After VAT | invoiceSubtotal |

### 7.2 VAT Amount

```
vatAmount = vatBase × (vatRate / 100)
```

| Field | Type | Default | Constraint |
|-------|------|---------|------------|
| vatRate | Number | 0 | 0 to 100 |

---

## 8. WHT Calculation

### 8.1 WHT Base

```
whtBase = afterDiscount
```

### 8.2 WHT Amount

| WHT Type | Formula |
|----------|---------|
| Percentage | whtAmount = whtBase × (whtValue / 100) |
| Flat | whtAmount = whtValue |
| None | whtAmount = 0 |

---

## 9. Additional Charges

### 9.1 Charge Types

| Tax Flag | Effect |
|----------|--------|
| true | Charge included in taxable total |
| false | Charge added after tax calculations |

### 9.2 Charge Totals

```
taxableCharges = Σ chargeValue (where taxFlag = true)
nonTaxableCharges = Σ chargeValue (where taxFlag = false)
totalCharges = taxableCharges + nonTaxableCharges
```

---

## 10. Grand Total

```
grandTotal = afterDiscount + vatAmount - whtAmount + totalCharges + installTotal
```

### 10.1 Negative Total Prevention

```
grandTotal = max(0, grandTotal)
```

The grand total must never be negative.

---

## 11. Amount in Words

| Property | Rule |
|----------|------|
| Currency | Naira |
| Minor unit | Kobo |
| Format | "{Amount} Naira and {Kobo} Kobo Only" |
| Zero | "Zero Naira Only" |
| Rounding | Round to nearest Kobo |

### 11.1 Word Conversion Rules

| Range | Format |
|-------|--------|
| 0-19 | Direct word |
| 20-99 | Tens + ones |
| 100-999 | Hundreds + remainder |
| 1,000-999,999 | Thousands + remainder |
| 1,000,000+ | Millions + remainder |

---

## 12. Calculation Order

| Step | Calculation | Formula |
|------|-------------|---------|
| 1 | Line item subtotals | quantity × unitPrice |
| 2 | Group subtotals | Σ line item subtotals |
| 3 | Invoice subtotal | Σ group subtotals |
| 4 | Discount | Based on type and timing |
| 5 | After discount | subtotal - discount |
| 6 | VAT | Based on timing |
| 7 | WHT | Based on type |
| 8 | Additional charges | Sum all charges |
| 9 | Install total | Σ install amounts |
| 10 | Grand total | afterDiscount + VAT - WHT + charges + install |

---

## 13. Edge Cases

| Case | Rule |
|------|------|
| Zero quantity | Line item subtotal = 0 |
| Zero unit price | Line item subtotal = 0 |
| 100% discount | afterDiscount = 0 |
| Zero VAT rate | VAT = 0 |
| Zero WHT rate | WHT = 0 |
| Empty charges list | Total charges = 0 |
| Negative result | Grand total clamps to 0 |
| Decimal precision | Round to 2 decimal places |

---

## 14. Validation Rules

| Field | Rule | Message |
|-------|------|---------|
| Quantity | ≥ 0 | "Quantity must be positive" |
| Unit price | ≥ 0 | "Price must be positive" |
| Discount value | ≥ 0 | "Discount must be positive" |
| VAT rate | 0 to 100 | "VAT rate must be between 0 and 100" |
| WHT value | ≥ 0 | "WHT must be positive" |
| Charge value | ≥ 0 | "Charge must be positive" |

---

## 15. Document Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-20 | MiMoCode | Initial creation |

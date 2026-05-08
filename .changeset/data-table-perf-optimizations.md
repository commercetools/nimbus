---
"@commercetools/nimbus": patch
---

Improve DataTable render performance for large datasets (~170+ rows). Sort,
expand, and pin interactions now only re-render affected rows instead of all
rows. Sort uses `Intl.Collator` for faster natural ordering ("Product 1, 2, 10"
instead of "1, 10, 100") and pre-computes accessor values. Callbacks stabilized
with refs to prevent context churn. Pin button tooltips now use native `title`
attributes instead of portal-based tooltip components.

---
"@commercetools/nimbus-mcp": minor
---

`search_docs`: finds content anywhere in a page, returns snippets worth
reading, and sends fewer bytes to the model.

- Every view of every documentation page (overview, implementation,
  guidelines, accessibility) is now searched in full. A prop or pattern that is
  mentioned once, deep in an implementation page, is found — previously only the
  first ~2 KB of a limited set of candidate pages was searched, so terms like
  `allowFocusWhenDisabled` or `activeFillStyle` returned unrelated pages.
- Snippets are ~600 characters, start and end on whole lines, and are anchored
  where the query terms occur together, so a multi-word query lands on the
  passage that answers it instead of the first occurrence of its most common
  word.
- A snippet is only returned when the page content actually matched. Pages that
  matched on title, description or tags alone come back without one.
- Results default to 5; pass `limit` (1–10) for more. Each response is capped
  at 4 KB — lower-ranked snippets are shortened or dropped first, the top result
  is never cut.
- The `category` field is gone; it duplicated what `path` already says.
- Fuzzy matching no longer treats one- and two-letter words as a match for a
  long query term, which was padding results with unrelated pages.

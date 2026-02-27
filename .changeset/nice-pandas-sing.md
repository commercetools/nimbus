---
"@commercetools/nimbus": minor
---

Add automatic Inter font loading to NimbusProvider via new `loadFonts` prop
(default: true). Fonts load from Google Fonts CSS API v2 with preconnect
optimization for performance. Set `loadFonts={false}` in contexts where fonts
are already loaded (e.g., Merchant Center).

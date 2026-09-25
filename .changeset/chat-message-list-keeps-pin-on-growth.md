---
"@commercetools/nimbus": patch
---

`ChatMessageList`: the transcript no longer stops following the newest message
when the last item grows (for example, an image finishes loading) right after
new content arrives. Auto-scroll now pauses only when the user scrolls up.

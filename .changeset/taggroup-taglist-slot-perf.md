---
"@commercetools/nimbus": patch
---

`TagGroup`: fix a render-time bug where `TagGroupTagListSlot` instantiated its
styled component inside the component function, producing a new component
identity on every render. This caused React to unmount and remount the entire
tag list (and React Aria to rebuild its collection from scratch) on every parent
render — severely impacting performance when many tags were rendered (e.g. in a
multi-select ComboBox).

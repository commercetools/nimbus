---
"@commercetools/nimbus": patch
---

ComboBox.Option textValue: derive textValue from string children automatically
so consumers don't need to pass it explicitly. Build errors fixed: circular
chunk dependency (data-table → icon-toggle-button), TS2742 inferred types
(toast.toasters), TS2307 self-referencing import (combobox test-utils), TS2580
missing process type (icon-button)

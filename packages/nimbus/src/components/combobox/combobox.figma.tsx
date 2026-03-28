import figma from "@figma/code-connect/react";
import { ComboBox } from "./combobox";

// --- Combobox Menu → ComboBox.ListBox ---
// NOTE: Skipped VARIANT "is multi-select" (boolean-like) → no matching code prop "isMultiSelect"
figma.connect(
  ComboBox.ListBox,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=6358-56723",
  {
    props: {
      children: figma.children("*"),
    },
    example: (props) => <ComboBox.ListBox>{props.children}</ComboBox.ListBox>,
  }
);

// --- Combobox Input → ComboBox.Trigger ---
// NOTE: Skipped BOOLEAN "Clear button" → no matching code prop found
// NOTE: Skipped VARIANT "Multi select" (boolean-like) → no matching code prop "multiSelect"
figma.connect(
  ComboBox.Trigger,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=6358-57260",
  {
    props: {
      isInvalid: figma.enum("State", { Invalid: true }),
      isDisabled: figma.enum("State", { Disabled: true }),
    },
    example: () => <ComboBox.Trigger />,
  }
);

// --- Combobox with menu open → ComboBox.Root ---
// NOTE: Skipped VARIANT "Multi-select" (boolean-like) → no matching code prop "multiSelect"
figma.connect(
  ComboBox.Root,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=6358-58494",
  {
    props: {
      children: figma.children("*"),
    },
    example: (props) => <ComboBox.Root>{props.children}</ComboBox.Root>,
  }
);

// --- Variant-specific: Single-select combobox ---
figma.connect(
  ComboBox.Root,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=6358-58494",
  {
    variant: { "Multi-select": "NO" },
    example: () => (
      <ComboBox.Root selectionMode="single">
        <ComboBox.Trigger />
        <ComboBox.ListBox />
      </ComboBox.Root>
    ),
  }
);

// --- Variant-specific: Multi-select combobox ---
figma.connect(
  ComboBox.Root,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=6358-58494",
  {
    variant: { "Multi-select": "YES" },
    example: () => (
      <ComboBox.Root selectionMode="multiple">
        <ComboBox.Trigger />
        <ComboBox.ListBox />
      </ComboBox.Root>
    ),
  }
);

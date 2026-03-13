import figma from "@figma/code-connect/react";
import { ComboBox } from "./combobox";

// --- Combobox Menu → ComboBox.ListBox ---
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
figma.connect(
  ComboBox.Trigger,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=6358-57260",
  {
    props: {
      isInvalid: figma.enum("State", { Invalid: true }),
      isDisabled: figma.enum("State", { Disabled: true }),
      variant: figma.enum("Appearance", {
        Solid: "solid",
        Ghost: "ghost",
      }),
      size: figma.enum("Size", {
        md: "md",
        sm: "sm",
      }),
      selectionMode: figma.enum("Multi select", {
        YES: "multiple",
        NO: "single",
      }),
    },
    example: (props) => (
      <ComboBox.Trigger
        isInvalid={props.isInvalid}
        isDisabled={props.isDisabled}
        variant={props.variant}
        size={props.size}
      />
    ),
  }
);

// --- Combobox with menu open → ComboBox.Root ---
figma.connect(
  ComboBox.Root,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=6358-58494",
  {
    props: {
      selectionMode: figma.enum("Multi-select", {
        YES: "multiple",
        NO: "single",
      }),
      children: figma.children("*"),
    },
    example: (props) => (
      <ComboBox.Root selectionMode={props.selectionMode}>
        {props.children}
      </ComboBox.Root>
    ),
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

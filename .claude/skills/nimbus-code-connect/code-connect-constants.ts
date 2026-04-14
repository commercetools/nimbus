/**
 * Constants and component overrides for Figma Code Connect generation.
 *
 * Edit this file to:
 * - Add/update Figma prop name → code prop name aliases
 * - Add/update state decomposition mappings
 * - Add components to the self-closing or container sets
 * - Add/update per-component overrides for complex mappings
 */

import type { CodeConnectEntry } from "./generate-code-connect";

// ---------------------------------------------------------------------------
// Types for overrides
// ---------------------------------------------------------------------------

export type PropPosition =
  | "attribute"
  | "leading"
  | "trailing"
  | "child"
  | "children";

export interface EntryOverride {
  /** Raw prop code lines to add/replace (codePropName → figma.xxx() code) */
  rawProps?: Record<string, { code: string; position: PropPosition }>;
  /** Figma prop names (cleaned) to skip in auto-classification */
  skipFigmaProps?: string[];
  /** Override the example JSX body */
  exampleJsx?: string;
  /** Skip this entry entirely (use manual connects instead) */
  skip?: boolean;
}

export interface ComponentOverride {
  /** Per-entry overrides keyed by subComponent ("" for non-compound) */
  entries?: Record<string, EntryOverride>;
  /** Extra raw connect code blocks to append */
  extraConnects?: (entries: CodeConnectEntry[]) => string;
  /** Additional import lines */
  extraImports?: string[];
}

// ---------------------------------------------------------------------------
// Classification Constants
// ---------------------------------------------------------------------------

/**
 * Figma prop name (lowercase) → code prop name.
 * Trusted aliases: props resolved here bypass typesProps/recipeVariants validation
 * because they represent known cross-component mappings (e.g. inherited React Aria props).
 */
export const ALIAS_MAP: Record<string, string> = {
  disabled: "isDisabled",
  "is disabled": "isDisabled",
  invalid: "isInvalid",
  "is invalid": "isInvalid",
  selected: "isSelected",
  "is selected": "isSelected",
  toggled: "isSelected",
  loading: "isLoading",
  "is loading": "isLoading",
  "read only": "isReadOnly",
  "is read only": "isReadOnly",
  required: "isRequired",
  "is required": "isRequired",
  appearance: "variant",
  tone: "colorPalette",
  color: "colorPalette",
  colorpalette: "colorPalette",
  "font size": "fontSize",
  fontsize: "fontSize",
  label: "children",
  "label text": "children",
  text: "children",
  "left icon": "iconLeft",
  "leading element": "leadingElement",
  "right icon": "iconRight",
  "trailing element": "trailingElement",
  placeholder: "placeholder",
  "placeholder text": "placeholder",
  description: "description",
  "helper text": "description",
  "error message": "errorMessage",
};

/**
 * Soft aliases: name translation only, still validated against typesProps/recipeVariants.
 * Use for Figma names where camelCase conversion wouldn't produce the right code prop name
 * but the prop isn't universally available.
 */
export const SOFT_ALIAS_MAP: Record<string, string> = {
  "clear button": "isClearable",
};

/** State variant values that are visual-only (skip) */
export const VISUAL_STATE_VALUES = new Set([
  "default",
  "hover",
  "focus",
  "focused",
  "pressed",
  "active",
  "hovered",
  "rest",
]);

/** State variant values → boolean code prop */
export const STATE_BOOLEAN_MAP: Record<string, string> = {
  disabled: "isDisabled",
  invalid: "isInvalid",
  loading: "isLoading",
  selected: "isSelected",
  "read only": "isReadOnly",
  readonly: "isReadOnly",
  required: "isRequired",
  indeterminate: "isIndeterminate",
  error: "isInvalid",
};

/** Values indicating boolean-true in a VARIANT */
export const BOOLEAN_TRUE_VALUES = new Set(["yes", "on", "true"]);
export const BOOLEAN_FALSE_VALUES = new Set(["no", "off", "false"]);

/**
 * Figma BOOLEAN prop names (lowercase, cleaned) that are visual-only
 * and should be globally skipped without generating NOTE comments.
 * These represent Figma design states that have no code equivalent.
 */
export const VISUAL_BOOLEAN_PROPS = new Set([
  "is focused",
  "focused",
  "show resize icon",
  "show card content",
  "show selected indicator",
  "calendar button",
  "high precision indicator",
  "hint text",
  "help text",
]);

/**
 * Common Figma variant value normalizations applied when no recipe
 * variant values are available for exact matching.
 * Maps lowercased Figma value → normalized code value.
 */
export const VALUE_NORMALIZATIONS: Record<string, string> = {
  outlined: "outline",
  "vertical left": "vertical",
  "vertical right": "vertical",
};

/** Components excluded from Code Connect generation (e.g. imperative APIs) */
export const EXCLUDED_COMPONENTS = new Set(["toast"]);

/** Components that should be self-closing (no text children) */
export const SELF_CLOSING_COMPONENTS = new Set([
  "progress-bar",
  "separator",
  "calendar",
  "loading-spinner",
  "avatar",
  "switch",
]);

/** Sub-components that act as containers for nested instances */
export const CONTAINER_SUB_COMPONENTS = new Set([
  "Root",
  "ListBox",
  "Options",
  "Content",
  "TagList",
  "List",
  "Panels",
  "Body",
]);

/**
 * Props that are widely available across components via inheritance (React Aria,
 * Chakra recipe system) and can bypass typesProps/recipeVariants validation.
 * Only include props that are valid on the vast majority of interactive components.
 * Component-specific props (isClearable, leadingElement, etc.) should NOT be here —
 * they must be validated against typesProps/recipeVariants.
 */
export const KNOWN_VALID_PROPS = new Set([
  "isDisabled",
  "isInvalid",
  "isSelected",
  "isLoading",
  "isReadOnly",
  "isRequired",
  "isIndeterminate",
  "colorPalette",
  "variant",
  "size",
  "children",
]);

// ---------------------------------------------------------------------------
// Component Overrides
// ---------------------------------------------------------------------------

export const OVERRIDES: Record<string, ComponentOverride> = {
  avatar: {
    entries: {
      "": {
        skipFigmaProps: ["State", "Color"],
        exampleJsx: `<Avatar firstName="" lastName="" size={props.size} />`,
      },
    },
  },

  link: {
    entries: {
      "": {
        skipFigmaProps: ["State"],
      },
    },
  },

  alert: {
    entries: {
      Root: {
        rawProps: {
          variant: {
            code: `figma.enum("Variant", { Outlined: "outlined", Ghost: "flat" })`,
            position: "attribute",
          },
        },
        skipFigmaProps: ["Variant"],
      },
    },
  },

  "toggle-button-group": {
    entries: {
      Root: {
        rawProps: {
          size: {
            code: `figma.enum("Size", { md: "md" })`,
            position: "attribute",
          },
        },
        skipFigmaProps: ["Size", "Variant"],
      },
    },
  },

  "radio-input": {
    entries: {
      Option: {
        exampleJsx: `<RadioInput.Option value="">{/* label */}</RadioInput.Option>`,
      },
    },
  },

  "progress-bar": {
    entries: {
      "": {
        rawProps: {
          isIndeterminate: {
            code: `figma.enum("Completeness", { Indeterminate: true })`,
            position: "attribute",
          },
          value: {
            code: `figma.enum("Completeness", { "0%": 0, "50%": 50, "100%": 100 })`,
            position: "attribute",
          },
          variant: {
            code: `figma.enum("Inverted", { NO: "solid", YES: "contrast" })`,
            position: "attribute",
          },
        },
        skipFigmaProps: ["Completeness", "Inverted"],
      },
    },
  },

  select: {
    entries: {
      Options: {
        skipFigmaProps: ["Variant"],
        exampleJsx: `<Select.Options>{props.children}</Select.Options>`,
      },
      Root: {
        rawProps: {
          variant: {
            code: `figma.enum("Appearance", { Solid: "outline", Ghost: "ghost" })`,
            position: "attribute",
          },
        },
        skipFigmaProps: ["Appearance", "Clear button", "State"],
        exampleJsx: `<Select.Root
      variant={props.variant}
      size={props.size}
    >
      <Select.Options>{/* Option items */}</Select.Options>
    </Select.Root>`,
      },
    },
  },

  dialog: {
    entries: {
      Root: {
        rawProps: {
          width: {
            code: `figma.enum("Size", { sm: "sm", md: "md", lg: "lg" })`,
            position: "attribute",
          },
        },
        skipFigmaProps: [
          "Show image",
          "→ image",
          "→ Custom content",
          "Size",
          "Variant",
        ],
        exampleJsx: `<Dialog.Root>
      <Dialog.Content width={props.width}>
        <Dialog.Header>
          Dialog Title
          <Dialog.CloseTrigger />
        </Dialog.Header>
        <Dialog.Body>{props.children}</Dialog.Body>
        <Dialog.Footer>Footer actions</Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>`,
      },
    },
  },

  drawer: {
    entries: {
      Root: {
        rawProps: {
          width: {
            code: `figma.enum("Size", { xs: "xs", sm: "sm", md: "md", lg: "lg", xl: "xl" })`,
            position: "attribute",
          },
          footer: {
            code: `figma.boolean("Footer", { true: <Drawer.Footer>Footer content</Drawer.Footer>, false: undefined })`,
            position: "child",
          },
        },
        skipFigmaProps: ["Footer", "Size", "Variant"],
        exampleJsx: `<Drawer.Root>
      <Drawer.Trigger>Open Drawer</Drawer.Trigger>
      <Drawer.Content width={props.width}>
        <Drawer.Header>
          <Drawer.Title>Drawer Title</Drawer.Title>
          <Drawer.CloseTrigger />
        </Drawer.Header>
        <Drawer.Body>{props.children}</Drawer.Body>
        {props.footer}
      </Drawer.Content>
    </Drawer.Root>`,
      },
    },
  },

  "form-field": {
    entries: {
      Root: {
        rawProps: {
          size: {
            code: `figma.enum("Size", { xs: "sm", md: "md" })`,
            position: "attribute",
          },
          direction: {
            code: `figma.enum("Label placement", { Top: "column", Left: "row" })`,
            position: "attribute",
          },
          infoBox: {
            code: `figma.boolean("Info", { true: <FormField.InfoBox>Additional info</FormField.InfoBox>, false: undefined })`,
            position: "child",
          },
        },
        skipFigmaProps: ["Label placement", "Info", "Size"],
        exampleJsx: `<FormField.Root
      isRequired={props.isRequired}
      direction={props.direction}
      size={props.size}
    >
      <FormField.Label>Label</FormField.Label>
      {props.infoBox}
      {props.children}
    </FormField.Root>`,
      },
      Error: { skip: true },
    },
    extraConnects: (entries) => {
      const errorEntry = entries.find((e) => e.subComponent === "Error");
      if (!errorEntry) return "";
      const url = errorEntry.figmaUrl;
      return `
// --- Field message (Error) → FormField.Error ---
figma.connect(
  FormField.Error,
  "${url}",
  {
    variant: { "Message style": "Error" },
    example: () => <FormField.Error>Error message</FormField.Error>,
  }
);

// --- Field message (Help text) → FormField.Description ---
figma.connect(
  FormField.Description,
  "${url}",
  {
    variant: { "Message style": "Help text" },
    example: () => <FormField.Description>Help text</FormField.Description>,
  }
);`;
    },
  },

  card: {
    entries: {
      Content: {
        rawProps: {
          header: {
            code: `figma.enum("Content type", { "Title + text": <Card.Header>Card Title</Card.Header>, "Leading element + text": <Card.Header>Card Title</Card.Header> })`,
            position: "child",
          },
          leadingElement: {
            code: `figma.instance("Leading element")`,
            position: "leading",
          },
          instance: {
            code: `figma.instance("→ Instance")`,
            position: "child",
          },
        },
        skipFigmaProps: ["Content type", "→ Instance", "Leading element"],
        exampleJsx: `<>
      {props.leadingElement}
      {props.header}
      <Card.Content>
        {props.instance}
        {props.children}
      </Card.Content>
    </>`,
      },
      Root: {
        rawProps: {
          borderStyle: {
            code: `figma.enum("Outlined", { Yes: "outlined", No: "none" })`,
            position: "attribute",
          },
          elevation: {
            code: `figma.enum("Elevated", { Yes: "elevated", No: "none" })`,
            position: "attribute",
          },
        },
        skipFigmaProps: ["Outlined", "Elevated"],
      },
    },
  },

  combobox: {
    entries: {
      Trigger: {
        skipFigmaProps: ["Appearance", "Size"],
        exampleJsx: `<ComboBox.Trigger />`,
      },
    },
    extraConnects: (entries) => {
      const rootEntry = entries.find((e) => e.subComponent === "Root");
      if (!rootEntry) return "";
      const url = rootEntry.figmaUrl;
      return `
// --- Variant-specific: Single-select combobox ---
figma.connect(
  ComboBox.Root,
  "${url}",
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
  "${url}",
  {
    variant: { "Multi-select": "YES" },
    example: () => (
      <ComboBox.Root selectionMode="multiple">
        <ComboBox.Trigger />
        <ComboBox.ListBox />
      </ComboBox.Root>
    ),
  }
);`;
    },
  },

  "data-table": {
    entries: {
      "": {
        exampleJsx: `<DataTable
      columns={[]}
      rows={[]}
    />`,
      },
    },
  },

  pagination: {
    entries: {
      "": {
        skipFigmaProps: ["Variant"],
        exampleJsx: `<Pagination totalItems={0} />`,
      },
    },
  },

  "scoped-search-input": {
    entries: {
      "": {
        exampleJsx: `<ScopedSearchInput
      value={{ option: "", text: "" }}
      onSubmit={() => {}}
      options={[]}
      isDisabled={props.isDisabled}
      size={props.size}
    />`,
      },
    },
  },

  "split-button": {
    entries: {
      "": {
        exampleJsx: `<SplitButton
      aria-label="Action"
      variant={props.variant}
      size={props.size}
      isDisabled={props.isDisabled}
      onAction={() => {}}
    >
      Item Placeholder
    </SplitButton>`,
      },
    },
  },

  steps: {
    entries: {
      Root: {
        exampleJsx: `<Steps.Root count={0} size={props.size}>
        {props.children}
      </Steps.Root>`,
      },
    },
  },

  "money-input": {
    entries: {
      "": {
        exampleJsx: `<MoneyInput
      value={{ amount: "", currencyCode: "" }}
      isInvalid={props.isInvalid}
      isDisabled={props.isDisabled}
      size={props.size}
    />`,
      },
    },
  },

  "localized-field": {
    entries: {
      "": {
        exampleJsx: `<LocalizedField
      defaultLocaleOrCurrency=""
      valuesByLocaleOrCurrency={{}}
      onChange={() => {}}
      size={props.size}
    />`,
      },
    },
  },

  "tag-group": {
    entries: {
      Root: {
        skipFigmaProps: ["Variant"],
      },
      Tag: {
        skipFigmaProps: ["Clear button", "Selected", "State", "Size"],
      },
    },
  },

  calendar: {
    entries: {
      "": {
        skipFigmaProps: ["Variant"],
      },
    },
    extraImports: [
      `import { DatePicker } from "../date-picker/date-picker";`,
      `import { DateRangePicker } from "../date-range-picker/date-range-picker";`,
      `import { RangeCalendar } from "../range-calendar/range-calendar";`,
    ],
    extraConnects: (entries) => {
      const url = entries[0].figmaUrl;
      return `
// --- Variant-specific: Date-time → DatePicker ---
figma.connect(
  DatePicker,
  "${url}",
  {
    variant: { Variant: "Date-time" },
    example: () => <DatePicker granularity="minute" />,
  }
);

// --- Variant-specific: Date range → RangeCalendar ---
figma.connect(
  RangeCalendar,
  "${url}",
  {
    variant: { Variant: "Date range" },
    example: () => <RangeCalendar />,
  }
);

// --- Variant-specific: Date-time range → DateRangePicker ---
figma.connect(
  DateRangePicker,
  "${url}",
  {
    variant: { Variant: "Date-time range" },
    example: () => <DateRangePicker granularity="minute" />,
  }
);`;
    },
  },
};

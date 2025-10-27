import type { PropCategory, PropGroupConfig, PropMatcher } from "../types";

/**
 * Prop group configurations based on React Aria's grouping system
 * Each group defines matchers (strings or RegExp) to categorize props
 */
export const PROP_GROUPS: PropGroupConfig[] = [
  {
    category: "content",
    displayName: "Content",
    order: 1,
    matchers: [
      "children",
      "items",
      "defaultItems",
      "columns",
      "loadingState",
      "onLoadMore",
      "renderEmptyState",
      "dependencies",
    ],
  },
  {
    category: "selection",
    displayName: "Selection",
    order: 2,
    matchers: [
      "selectionMode",
      "selectionBehavior",
      "selectedKeys",
      "defaultSelectedKeys",
      "selectedKey",
      "defaultSelectedKey",
      "onSelectionChange",
      "disabledKeys",
      "disabledBehavior",
      "disallowEmptySelection",
      "shouldSelectOnPressUp",
      "shouldFocusWrap",
      "shouldFocusOnHover",
      "escapeKeyBehavior",
    ],
  },
  {
    category: "value",
    displayName: "Value",
    order: 3,
    matchers: [
      "value",
      "defaultValue",
      "onChange",
      "onChangeEnd",
      "inputValue",
      "defaultInputValue",
      "onInputChange",
      "formatOptions",
      "focusedValue",
      "defaultFocusedValue",
    ],
  },
  {
    category: "labeling",
    displayName: "Labeling",
    order: 4,
    matchers: ["label", "labelPosition", "labelAlign", "contextualHelp"],
  },
  {
    category: "validation",
    displayName: "Validation",
    order: 5,
    matchers: [
      "minValue",
      "maxValue",
      "step",
      "minLength",
      "maxLength",
      "pattern",
      "isRequired",
      "isInvalid",
      "validate",
      "validationBehavior",
      "validationErrors",
      "necessityIndicator",
      "description",
      "errorMessage",
    ],
  },
  {
    category: "overlay",
    displayName: "Overlay",
    order: 6,
    matchers: [
      "isOpen",
      "defaultOpen",
      "onOpenChange",
      "shouldCloseOnSelect",
      "placement",
      "direction",
      "align",
      "shouldFlip",
      "offset",
      "crossOffset",
      "containerPadding",
      "menuWidth",
    ],
  },
  {
    category: "events",
    displayName: "Events",
    order: 7,
    matchers: [
      /^on[A-Z]/, // All props starting with "on" followed by uppercase letter
    ],
  },
  {
    category: "links",
    displayName: "Links",
    order: 8,
    matchers: [
      "href",
      "hrefLang",
      "target",
      "rel",
      "download",
      "ping",
      "referrerPolicy",
      "routerOptions",
    ],
  },
  {
    category: "styling",
    displayName: "Styling",
    order: 9,
    matchers: [
      "style",
      "className",
      // TODO: almost all recipes have this props in common and they affect
      // the look, so I am putting them here for now
      "size",
      "variant",
      "unstyled",
    ],
  },
  {
    category: "forms",
    displayName: "Forms",
    order: 10,
    matchers: [
      "name",
      "startName",
      "endName",
      "value",
      "formValue",
      "type",
      "autoComplete",
      "form",
      "formTarget",
      "formNoValidate",
      "formMethod",
      "formEncType",
      "formAction",
    ],
  },
  {
    category: "accessibility",
    displayName: "Accessibility",
    order: 11,
    matchers: [
      "autoFocus",
      "role",
      "id",
      "tabIndex",
      "excludeFromTabOrder",
      "preventFocusOnPress",
      /^aria-/, // All props starting with "aria-"
    ],
  },
  {
    category: "advanced",
    displayName: "Advanced",
    order: 12,
    matchers: ["UNSAFE_className", "UNSAFE_style", "slot"],
  },
];

/**
 * Categories that should be expanded by default
 */
export const DEFAULT_EXPANDED = new Set<PropCategory>([
  "content",
  "selection",
  "value",
]);

/**
 * Helper function to get display name for a category
 */
export const getCategoryDisplayName = (category: PropCategory): string => {
  const config = PROP_GROUPS.find((g) => g.category === category);
  return config?.displayName || category;
};

/**
 * Helper function to check if a prop matches any matcher in an array
 */
export const matchesProp = (
  propName: string,
  matchers: PropMatcher[]
): boolean => {
  return matchers.some((matcher) => {
    if (typeof matcher === "string") {
      return propName === matcher;
    } else {
      // RegExp
      return matcher.test(propName);
    }
  });
};

// Extract different types of exports by name conventions
export const categorizeExports = (exports: Record<string, unknown>) => {
  const categories = {
    components: [] as string[],
    hooks: [] as string[],
    theme: [] as string[],
    other: [] as string[],
  };

  Object.keys(exports).forEach((key) => {
    if (key.startsWith("use")) {
      categories.hooks.push(key);
    } else if (
      key === "system" ||
      key.includes("theme") ||
      key.includes("style") ||
      key.includes("token")
    ) {
      categories.theme.push(key);
    } else if (key[0] === key[0].toUpperCase()) {
      // Most components follow PascalCase
      categories.components.push(key);
    } else {
      categories.other.push(key);
    }
  });

  // Sort the exports within each category alphabetically
  Object.keys(categories).forEach((category) => {
    categories[category as keyof typeof categories].sort();
  });

  return categories;
};

// Function to determine the type of export
export const getExportType = (
  exportItem: unknown,
  exportName?: string
): string => {
  if (typeof exportItem === "function") {
    // Check if it's a React hook (functions that start with "use")
    if (exportName && exportName.startsWith("use")) {
      return "Hook";
    }
    // Otherwise, it's likely a Component or utility function
    return "Component/Function";
  } else if (typeof exportItem === "object" && exportItem !== null) {
    // Check if it's a React component that's exported as an object
    // React components created with forwardRef or with attached properties often have
    // a $$typeof property or a render method
    const obj = exportItem as Record<string, unknown>;

    if (
      obj.$$typeof === Symbol.for("react.forward_ref") ||
      obj.$$typeof === Symbol.for("react.memo") ||
      typeof obj.render === "function"
    ) {
      return "Component/Function";
    }

    // Check if it's a compound component (object with React components as values)
    if (Object.keys(obj).length > 0) {
      // First, check if at least one key is capitalized (common for compound components like Table.Row)
      const hasCapitalizedKeys = Object.keys(obj).some(
        (key) => key[0] === key[0].toUpperCase()
      );

      // Check if most values are functions or objects (React components can be either)
      const reactComponentValues = Object.values(obj).filter(
        (value) =>
          typeof value === "function" ||
          (typeof value === "object" &&
            value !== null &&
            // Many React components have a $$typeof property
            typeof (value as Record<string, unknown>).$$typeof !== "undefined")
      );

      // If at least 75% of values appear to be React components and it has capitalized keys
      if (
        reactComponentValues.length >= Object.keys(obj).length * 0.75 &&
        hasCapitalizedKeys
      ) {
        return "Compound Component";
      }
    }
    return "Object";
  } else if (typeof exportItem === "string") {
    return "String";
  } else if (typeof exportItem === "number") {
    return "Number";
  } else {
    return typeof exportItem;
  }
};

// Utility function to get color for different types
export const getColorForType = (type: string) => {
  switch (type) {
    case "Component/Function":
      return "blue";
    case "Compound Component":
      return "purple";
    case "Object":
      return "amber";
    case "String":
      return "green";
    case "Number":
      return "teal";
    case "Hook":
      return "orange";
    default:
      return "neutral";
  }
};

// Utility function to get description for exports
export const getExportDescription = (
  exportName: string,
  categorized: {
    components: string[];
    hooks: string[];
    theme: string[];
    other: string[];
  }
) => {
  // This could be improved to pull actual documentation from the source files
  if (categorized.components.includes(exportName)) {
    return `A component for building user interfaces.`;
  } else if (categorized.hooks.includes(exportName)) {
    return `A React hook for managing state or behavior.`;
  } else if (categorized.theme.includes(exportName)) {
    return `A theme-related utility or token.`;
  }
  return "Utility or helper";
};

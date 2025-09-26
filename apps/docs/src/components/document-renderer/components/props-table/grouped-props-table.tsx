import {
  Box,
  Text,
  Stack,
  Button,
  Icon,
  ToggleButtonGroup,
} from "@commercetools/nimbus";
import {
  KeyboardArrowRight,
  KeyboardArrowDown,
} from "@commercetools/nimbus-icons";
import { useEffect, useState, useMemo } from "react";
import { ComponentPropsTable } from "./components/component-props-table.tsx";
import typesData from "../../../../data/types.json";
import * as nimbus from "@commercetools/nimbus";

// Define prop groups similar to React Aria
const PROP_GROUPS = {
  Content: [
    "children",
    "items",
    "defaultItems",
    "columns",
    "loadingState",
    "onLoadMore",
    "renderEmptyState",
    "dependencies",
  ],
  Selection: [
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
  Value: [
    "value",
    "defaultValue",
    "onChange",
    "onChangeEnd",
    "inputValue",
    "defaultInputValue",
    "onInputChange",
    "formatOptions",
  ],
  Labeling: ["label", "labelPosition", "labelAlign", "contextualHelp"],
  Validation: [
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
  Overlay: [
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
  Events: [/^on[A-Z]/],
  Links: [
    "href",
    "hrefLang",
    "target",
    "rel",
    "download",
    "ping",
    "referrerPolicy",
    "routerOptions",
  ],
  Styling: ["style", "className"],
  Forms: [
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
    "formMethod",
    "formEncType",
    "formAction",
  ],
  Accessibility: [
    "autoFocus",
    "role",
    "id",
    "tabIndex",
    "excludeFromTabOrder",
    "preventFocusOnPress",
    /^aria-/,
  ],
  Advanced: ["UNSAFE_className", "UNSAFE_style", "slot"],
} as const;

const DEFAULT_EXPANDED = new Set(["Content", "Selection", "Value"]);

interface GroupedPropTableProps {
  componentName: string;
  showDescription?: boolean;
}

interface PropData {
  name: string;
  type: { name: string };
  defaultValue?: { value: string };
  required: boolean;
  description?: string;
}

interface ComponentData {
  displayName: string;
  description?: string;
  props?: Record<string, PropData>;
}

interface ExportInfo {
  exists: boolean;
  isComponent: boolean;
  isCompoundComponent: boolean;
  componentTypes?: string[];
}

export const GroupedPropsTable: React.FC<GroupedPropTableProps> = ({
  componentName,
  showDescription = true,
}) => {
  const [expandedGroups, setExpandedGroups] =
    useState<Set<string>>(DEFAULT_EXPANDED);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );

  // First check if this is a compound component
  const exportInfo = useMemo<ExportInfo>(() => {
    const exportItem = nimbus[componentName as keyof typeof nimbus] as unknown;

    if (exportItem === undefined) {
      return {
        exists: false,
        isComponent: false,
        isCompoundComponent: false,
      };
    }

    const basicType = typeof exportItem;
    const isArray = Array.isArray(exportItem);
    const isFunctionComponent = basicType === "function";

    const isObjectComponent =
      basicType === "object" &&
      exportItem !== null &&
      !isArray &&
      ("$$typeof" in (exportItem as any) || "render" in (exportItem as any));

    const isCompoundComponent =
      basicType === "object" &&
      exportItem !== null &&
      !isArray &&
      !isObjectComponent &&
      !isFunctionComponent;

    const isComponent = isFunctionComponent || isObjectComponent;

    const subKeys =
      basicType === "object" && exportItem !== null
        ? Object.keys(exportItem)
        : [];

    const subComponents = isCompoundComponent ? subKeys : [];
    const componentTypes = subComponents.map((key) => `${componentName}${key}`);

    return {
      exists: true,
      isComponent,
      isCompoundComponent,
      componentTypes,
    };
  }, [componentName]);

  // Set default selection
  useEffect(() => {
    if (exportInfo.exists) {
      if (exportInfo.isCompoundComponent && exportInfo.componentTypes?.length) {
        const rootComponentType = `${componentName}Root`;
        if (exportInfo.componentTypes.includes(rootComponentType)) {
          setSelectedComponent(rootComponentType);
        } else {
          setSelectedComponent(exportInfo.componentTypes[0]);
        }
      } else if (exportInfo.isComponent) {
        setSelectedComponent(componentName);
      }
    }
  }, [componentName, exportInfo]);

  // Fetch prop data for the selected component
  const componentData = useMemo(() => {
    if (!selectedComponent) return null;
    return (typesData as ComponentData[]).find(
      (c) => c.displayName === selectedComponent
    );
  }, [selectedComponent]);
  // Group props according to PROP_GROUPS
  const groupedProps = useMemo(() => {
    if (!componentData?.props) {
      return { ungrouped: {}, groups: {} };
    }

    // Clone props to avoid mutation
    let remainingProps = { ...componentData.props };
    const groups: Record<string, Record<string, PropData>> = {};

    // Initialize groups
    Object.keys(PROP_GROUPS).forEach((groupName) => {
      groups[groupName] = {};
    });

    // Process each group
    for (const [groupName, patterns] of Object.entries(PROP_GROUPS)) {
      for (const pattern of patterns) {
        if (typeof pattern === "string") {
          // Handle string prop names
          if (remainingProps[pattern]) {
            const prop = remainingProps[pattern];
            let shouldInclude = true;

            // Apply React Aria's filtering rules
            // Skip id if it's not a string type
            if (pattern === "id" && prop.type.name !== "string") {
              shouldInclude = false;
            }

            // Skip value based on group and conditions
            if (pattern === "value") {
              if (groupName === "Value" && !remainingProps.defaultValue) {
                shouldInclude = false;
              } else if (groupName === "Forms" && prop.type.name !== "string") {
                shouldInclude = false;
              }
            }

            // Skip type in Forms group if description doesn't include 'form'
            if (
              pattern === "type" &&
              groupName === "Forms" &&
              !prop.description?.includes("form")
            ) {
              shouldInclude = false;
            }

            // Skip children in Content group if no items/columns
            if (
              pattern === "children" &&
              groupName === "Content" &&
              !remainingProps.items &&
              !remainingProps.columns
            ) {
              shouldInclude = false;
            }

            // Skip className if it's not a string type in Styling group
            if (
              pattern === "className" &&
              groupName === "Styling" &&
              prop.type.name !== "string"
            ) {
              shouldInclude = false;
            }

            // Skip style if it doesn't include CSSProperties
            if (
              pattern === "style" &&
              groupName === "Styling" &&
              !prop.type.name.includes("CSSProperties")
            ) {
              shouldInclude = false;
            }

            if (shouldInclude) {
              groups[groupName][pattern] = prop;
              delete remainingProps[pattern];
            }
          }
        } else if (pattern instanceof RegExp) {
          // Handle RegExp patterns
          for (const propName of Object.keys(remainingProps)) {
            if (pattern.test(propName)) {
              groups[groupName][propName] = remainingProps[propName];
              delete remainingProps[propName];
            }
          }
        }
      }
    }

    // Remove empty groups
    const filteredGroups = Object.entries(groups).reduce(
      (acc, [groupName, props]) => {
        if (Object.keys(props).length > 0) {
          acc[groupName] = props;
        }
        return acc;
      },
      {} as Record<string, Record<string, PropData>>
    );

    return { ungrouped: remainingProps, groups: filteredGroups };
  }, [componentData]);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupName)) {
        next.delete(groupName);
      } else {
        next.add(groupName);
      }
      return next;
    });
  };

  if (!exportInfo.exists) {
    return (
      <Box>
        <Text color="danger">Component '{componentName}' not found.</Text>
      </Box>
    );
  }

  if (!selectedComponent || !componentData) {
    return null;
  }

  const renderUngroupedProps = () => {
    const ungroupedProps = Object.values(groupedProps.ungrouped);
    if (ungroupedProps.length === 0) return null;

    return (
      <ComponentPropsTable
        componentName={selectedComponent!}
        props={ungroupedProps}
      />
    );
  };

  // Render helper for grouped props
  const renderGroupedProps = () => {
    return Object.entries(groupedProps.groups).map(([groupName, props]) => {
      const filteredProps = Object.values(props);
      const isExpanded = expandedGroups.has(groupName);

      return (
        <Box key={groupName} mt="400">
          <Button
            variant="ghost"
            onPress={() => toggleGroup(groupName)}
            justifyContent="flex-start"
            aria-expanded={isExpanded}
          >
            {isExpanded ? (
              <Icon>
                <KeyboardArrowDown />
              </Icon>
            ) : (
              <Icon>
                <KeyboardArrowRight />
              </Icon>
            )}
            <Text fontWeight="semibold">{groupName}</Text>
          </Button>

          {isExpanded && (
            <Box mt="200">
              <ComponentPropsTable
                componentName={selectedComponent}
                props={filteredProps}
              />
            </Box>
          )}
        </Box>
      );
    });
  };

  if (!exportInfo.exists || !selectedComponent || !componentData) {
    return (
      <Text color="danger">
        Component '{componentName}' not found or has no props.
      </Text>
    );
  }

  return (
    <Box>
      {/* Component selection for compound components */}
      {exportInfo.isCompoundComponent &&
        exportInfo.componentTypes &&
        exportInfo.componentTypes.length > 0 && (
          <ToggleButtonGroup.Root tone="primary" variant="ghost" my="400">
            {exportInfo.componentTypes.map((cid) => (
              <ToggleButtonGroup.Button
                key={cid}
                id={cid}
                size="xs"
                onPress={() => setSelectedComponent(cid)}
              >
                {cid.split(componentName).join(componentName + ".")}
              </ToggleButtonGroup.Button>
            ))}
          </ToggleButtonGroup.Root>
        )}

      {showDescription && componentData.description && (
        <Text mb="400">{componentData.description}</Text>
      )}

      {/* Ungrouped props in a regular table */}
      {renderUngroupedProps()}

      {/* Grouped props in collapsible sections */}
      {renderGroupedProps()}
    </Box>
  );
};

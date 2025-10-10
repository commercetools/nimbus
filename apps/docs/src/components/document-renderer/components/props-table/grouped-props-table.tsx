import {
  Box,
  Text,
  Button,
  Icon,
  ToggleButtonGroup,
} from "@commercetools/nimbus";
import {
  KeyboardArrowRight,
  KeyboardArrowDown,
} from "@commercetools/nimbus-icons";
import * as nimbus from "@commercetools/nimbus";
import { useEffect, useState, useMemo } from "react";
import { ComponentPropsTable } from "./components/component-props-table.tsx";
import type {
  ComponentData,
  ExportInfo,
  PropData,
} from "./props-table.types.ts";
import typesData from "../../../../data/types.json";

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
      ("$$typeof" in (exportItem as Record<string, unknown>) ||
        "render" in (exportItem as Record<string, unknown>));

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

  const shouldIncludeProp = (
    propName: string,
    prop: PropData,
    groupName: string,
    allProps: Record<string, PropData>
  ): boolean => {
    if (propName === "id" && prop.type.name !== "string") return false;

    if (propName === "value") {
      if (groupName === "Value" && !allProps.defaultValue) return false;
      if (groupName === "Forms" && prop.type.name !== "string") return false;
    }

    if (
      propName === "type" &&
      groupName === "Forms" &&
      !prop.description?.includes("form")
    ) {
      return false;
    }

    if (
      propName === "children" &&
      groupName === "Content" &&
      !allProps.items &&
      !allProps.columns
    ) {
      return false;
    }

    if (
      propName === "className" &&
      groupName === "Styling" &&
      prop.type.name !== "string"
    ) {
      return false;
    }

    if (
      propName === "style" &&
      groupName === "Styling" &&
      !prop.type.name.includes("CSSProperties")
    ) {
      return false;
    }

    return true;
  };

  // Fetch prop data for the selected component
  const componentData = useMemo(() => {
    if (!selectedComponent) return null;
    return (typesData as unknown as ComponentData[]).find(
      (c) => c.displayName === selectedComponent
    );
  }, [selectedComponent]);

  // Group props according to PROP_GROUPS
  const groupedProps = useMemo(() => {
    if (!componentData?.props) {
      return { ungrouped: {}, groups: {} };
    }

    // Filter undefined values once at the start
    const validProps = Object.entries(componentData.props).reduce(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, PropData>
    );

    const remainingProps = { ...validProps };
    const groups: Record<string, Record<string, PropData>> = {};

    // Initialize groups
    Object.keys(PROP_GROUPS).forEach((groupName) => {
      groups[groupName] = {};
    });

    // Process each group
    for (const [groupName, patterns] of Object.entries(PROP_GROUPS)) {
      for (const pattern of patterns) {
        if (typeof pattern === "string") {
          const prop = remainingProps[pattern];
          if (!prop) continue;

          const shouldInclude = shouldIncludeProp(
            pattern,
            prop,
            groupName,
            remainingProps
          );

          if (shouldInclude) {
            groups[groupName][pattern] = prop;
            delete remainingProps[pattern];
          }
        } else if (pattern instanceof RegExp) {
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

  return (
    <Box>
      {/* Component selection for compound components */}
      {exportInfo.isCompoundComponent &&
        exportInfo.componentTypes &&
        exportInfo.componentTypes.length > 0 && (
          <ToggleButtonGroup.Root
            tone="primary"
            variant="ghost"
            my="400"
            defaultSelectedKeys={[exportInfo.componentTypes[0]]}
          >
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
      <ComponentPropsTable props={Object.values(groupedProps.ungrouped)} />

      {/* Grouped props in collapsible sections */}
      {Object.entries(groupedProps.groups).map(([groupName, props]) => {
        const filteredProps = Object.values(props);
        const isExpanded = expandedGroups.has(groupName);

        return (
          <Box key={groupName} mt="400">
            <Button
              variant="ghost"
              size="xs"
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
                <ComponentPropsTable props={filteredProps} />
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

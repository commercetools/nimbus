import { Box, Text, Tabs } from "@commercetools/nimbus";
import { useMemo, useState, useEffect } from "react";
import * as nimbus from "@commercetools/nimbus";
// Keep the import even though it's commented out in the render for now

import { ComponentPropsTable } from "./components/component-props-table.tsx";
import { ReactNode } from "react";

interface ReactComponentLike {
  $$typeof?: symbol;
  render?: (props?: unknown) => ReactNode;
}

interface ExportInfo {
  exists: boolean;
  type: string;
  isComponent: boolean; // Function or Object with $$typeof/render
  isCompoundComponent: boolean; // Object without $$typeof/render
  subKeys?: string[];
  subComponents?: string[];
  componentTypes?: string[];
}

export const PropsTable = ({ id }: { id: string }) => {
  const [selectedComponent, setSelectedComponent] = useState<
    string | undefined
  >(undefined);

  // Get basic type information about the export
  const exportInfo = useMemo<ExportInfo>(() => {
    // Access nimbus exports by string key
    const exportItem = nimbus[id as keyof typeof nimbus] as unknown;

    if (exportItem === undefined) {
      return {
        exists: false,
        type: "undefined",
        isComponent: false,
        isCompoundComponent: false,
      };
    }

    const basicType = typeof exportItem;
    const isArray = Array.isArray(exportItem);

    // Function-based check: if it's a function, it's a component
    const isFunctionComponent = basicType === "function";

    // Object-based component check: if it has $$typeof or render, it's a component
    const isObjectComponent =
      basicType === "object" &&
      exportItem !== null &&
      !isArray &&
      ("$$typeof" in (exportItem as ReactComponentLike) ||
        "render" in (exportItem as ReactComponentLike));

    // Gather all keys for objects OR functions (functions can have properties via Object.assign)
    const subKeys =
      (basicType === "object" || basicType === "function") &&
      exportItem !== null
        ? Object.keys(exportItem)
        : [];

    // Filter out non-component exports (hooks, contexts, utilities)
    const isComponentKey = (key: string): boolean => {
      // Exclude hooks (start with "use")
      if (key.startsWith("use")) return false;

      // Exclude context objects (end with "Context" but not component wrappers)
      if (key.endsWith("Context")) {
        const value = (exportItem as Record<string, unknown>)[key];
        // React contexts have a specific shape with Provider/Consumer
        if (value && typeof value === "object" && "Provider" in value) {
          return false;
        }
      }

      // Include if it's a function (component) or object with $$typeof/render
      const value = (exportItem as Record<string, unknown>)[key];
      return (
        typeof value === "function" ||
        (typeof value === "object" &&
          value !== null &&
          ("$$typeof" in (value as ReactComponentLike) ||
            "render" in (value as ReactComponentLike)))
      );
    };

    // Filter subKeys to only include actual components
    const componentKeys = subKeys.filter(isComponentKey);

    // Compound component check:
    // - Pure object without $$typeof or render (e.g., Alert)
    // - OR function with sub-component keys (e.g., DataTable via Object.assign)
    const hasSubComponents = componentKeys.length > 0;

    const isCompoundComponent =
      exportItem !== null &&
      !isArray &&
      !isObjectComponent &&
      hasSubComponents &&
      (basicType === "object" ||
        (basicType === "function" && componentKeys.length > 0));

    // Whether it's a component (either function or object with $$typeof/render)
    // BUT NOT a compound component
    const isComponent =
      (isFunctionComponent || isObjectComponent) && !isCompoundComponent;

    // If it's a compound component, use filtered component keys
    const subComponents = isCompoundComponent ? componentKeys : [];

    // Create componentTypes by prepending parent export name to each subComponent
    const componentTypes = subComponents.map((key) => `${id}${key}`);

    return {
      exists: true,
      type: isArray ? "array" : basicType,
      isComponent,
      isCompoundComponent,
      subKeys,
      subComponents,
      componentTypes,
    };
  }, [id]);

  // Set default selection when component first loads or changes
  useEffect(() => {
    if (exportInfo.exists) {
      if (exportInfo.isCompoundComponent && exportInfo.componentTypes?.length) {
        // For compound components, select the Root component by default
        const rootComponentType = `${id}Root`;
        const hasRootComponent =
          exportInfo.componentTypes.includes(rootComponentType);

        if (hasRootComponent) {
          setSelectedComponent(rootComponentType);
        } else {
          // If no Root component exists, select the first component
          setSelectedComponent(exportInfo.componentTypes[0]);
        }
      } else if (exportInfo.isComponent) {
        // For single components, select the component itself
        setSelectedComponent(id);
      }
    }
  }, [id, exportInfo]);

  return (
    <Box>
      {!exportInfo.exists && (
        <Text color="danger">Export '{id}' not found in nimbus exports.</Text>
      )}

      {exportInfo.exists && (
        <Box>
          {/* Compound components: show tabs for each sub-component */}
          {exportInfo.isCompoundComponent &&
            exportInfo.componentTypes &&
            exportInfo.componentTypes.length > 0 && (
              <Box my="400">
                <Tabs.Root
                  selectedKey={selectedComponent}
                  onSelectionChange={(key: string | number) =>
                    setSelectedComponent(key as string)
                  }
                >
                  <Tabs.List flexWrap="wrap">
                    {exportInfo.componentTypes.map((cid) => (
                      <Tabs.Tab key={cid} id={cid}>
                        {cid.split(id).join(id + ".")}
                      </Tabs.Tab>
                    ))}
                  </Tabs.List>
                  <Tabs.Panels pt="400">
                    {exportInfo.componentTypes.map((cid) => (
                      <Tabs.Panel key={cid} id={cid}>
                        <ComponentPropsTable id={cid} />
                      </Tabs.Panel>
                    ))}
                  </Tabs.Panels>
                </Tabs.Root>
              </Box>
            )}

          {/* Single components: show props table directly */}
          {!exportInfo.isCompoundComponent &&
            exportInfo.isComponent &&
            selectedComponent && <ComponentPropsTable id={selectedComponent} />}
          {/* <pre>{JSON.stringify(exportInfo, null, 2)}</pre> */}
        </Box>
      )}
    </Box>
  );
};

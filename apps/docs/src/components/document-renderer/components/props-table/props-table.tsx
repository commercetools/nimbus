import { Box, Text, Stack, Button } from "@commercetools/nimbus";
import { useMemo, useState, useEffect } from "react";
import * as nimbus from "@commercetools/nimbus";
// Keep the import even though it's commented out in the render for now
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );

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

    // Compound component check: if it's an object without $$typeof or render, it's a compound component
    const isCompoundComponent =
      basicType === "object" &&
      exportItem !== null &&
      !isArray &&
      !isObjectComponent &&
      !isFunctionComponent;

    // Whether it's a component (either function or object with $$typeof/render)
    const isComponent = isFunctionComponent || isObjectComponent;

    // For objects, gather all keys
    const subKeys =
      basicType === "object" && exportItem !== null
        ? Object.keys(exportItem)
        : [];

    // If it's a compound component, all keys are considered sub-components
    const subComponents = isCompoundComponent ? subKeys : [];

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
          {/* Only show component selection for compound components */}
          {exportInfo.isCompoundComponent &&
            exportInfo.componentTypes &&
            exportInfo.componentTypes.length > 0 && (
              <Box my="400">
                <Stack direction="row" wrap="wrap">
                  {exportInfo.componentTypes.map((cid) => (
                    <Button
                      key={cid}
                      size="xs"
                      tone={selectedComponent === cid ? "primary" : "neutral"}
                      variant={selectedComponent === cid ? "solid" : "ghost"}
                      onPress={() => setSelectedComponent(cid)}
                    >
                      {cid.split(id).join(id + ".")}
                    </Button>
                  ))}
                </Stack>
              </Box>
            )}

          {selectedComponent && <ComponentPropsTable id={selectedComponent} />}
          {/* <pre>{JSON.stringify(exportInfo, null, 2)}</pre> */}
        </Box>
      )}
    </Box>
  );
};

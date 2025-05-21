import { Box, Code, Text, Stack, Button } from "@commercetools/nimbus";
import { useMemo, useState } from "react";
import * as nimbus from "@commercetools/nimbus";
// Keep the import even though it's commented out in the render for now
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ComponentPropsTable } from "./component-props-table.tsx";
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
  // Keep this state even though it's commented out in the render for now
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const getComponentType = () => {
    if (!exportInfo.exists) return null;

    // For compound components
    if (exportInfo.isCompoundComponent) return "compound component";
    // For regular components
    if (exportInfo.isComponent) return "component";
    return null;
  };

  const componentType = getComponentType();

  return (
    <Box>
      {!exportInfo.exists && (
        <Text color="danger">Export '{id}' not found in nimbus exports.</Text>
      )}

      {exportInfo.exists && (
        <Box>
          {componentType && (
            <Text fontWeight="bold" mb="s">
              {id} is a {componentType}
            </Text>
          )}

          <Text>
            Type: <Code>{exportInfo.type}</Code>
            {exportInfo.isComponent && " (React Component)"}
          </Text>

          {exportInfo.subComponents && exportInfo.subComponents.length > 0 && (
            <Box mt="s">
              <Text>Contains these React components:</Text>
              <Box as="ul" ml="m">
                {exportInfo.subComponents.map((key) => (
                  <Box as="li" key={key}>
                    <Code>{key}</Code>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {exportInfo.componentTypes &&
            exportInfo.componentTypes.length > 0 && (
              <Box mt="s">
                <Text>Component types:</Text>
                <Box as="ul" ml="m">
                  {exportInfo.componentTypes.map((type) => (
                    <Box as="li" key={type}>
                      <Code>{type}</Code>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

          {exportInfo.componentTypes && (
            <Box my="400">
              <Stack direction="row" wrap="wrap">
                {exportInfo.componentTypes.map((cid) => (
                  <Button size="xs" onPress={() => setSelectedComponent(cid)}>
                    {cid.split(id).join(id + ".")}
                  </Button>
                ))}
              </Stack>
            </Box>
          )}
          {selectedComponent && <ComponentPropsTable id={selectedComponent} />}
          {exportInfo.componentTypes?.length === 0 && (
            <ComponentPropsTable id={id} />
          )}
          {/* <pre>{JSON.stringify(exportInfo, null, 2)}</pre> */}
        </Box>
      )}
    </Box>
  );
};

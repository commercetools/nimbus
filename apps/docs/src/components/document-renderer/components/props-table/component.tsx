import { Box, Code, Text, Stack, Button } from "@commercetools/nimbus";
import { useMemo, useState } from "react";
import * as nimbus from "@commercetools/nimbus";
import { ComponentPropsTable } from "./component-props-table.tsx";

// Interface for React components with $$typeof
interface ReactComponentLike {
  $$typeof?: symbol;
}

interface ExportInfo {
  exists: boolean;
  type: string;
  isReactComponent?: boolean;
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
    // Type assertion to access nimbus exports by string key
    const exportItem = nimbus[id as keyof typeof nimbus] as unknown;

    if (exportItem === undefined) {
      return { exists: false, type: "undefined" };
    }

    const basicType = typeof exportItem;
    const isArray = Array.isArray(exportItem);

    // Check if it's a React component (has $$typeof symbol)
    const maybeComponent = exportItem as ReactComponentLike;
    const isReactComponent =
      exportItem !== null &&
      typeof exportItem === "object" &&
      "$$typeof" in maybeComponent &&
      typeof maybeComponent.$$typeof === "symbol";

    // For objects, check if any keys might be React components
    const subKeys =
      basicType === "object" && exportItem !== null
        ? Object.keys(exportItem)
        : [];

    // Find sub-components (keys that have $$typeof)
    const subComponents =
      basicType === "object" && exportItem !== null
        ? Object.keys(exportItem).filter((key) => {
            // For compound components, include all keys
            if (
              basicType === "object" &&
              exportItem !== null &&
              Object.keys(exportItem).some((subKey) => {
                const subItem = (exportItem as Record<string, unknown>)[subKey];
                const maybeSubComponent = subItem as ReactComponentLike;
                return (
                  subItem !== null &&
                  typeof subItem === "object" &&
                  "$$typeof" in maybeSubComponent &&
                  typeof maybeSubComponent.$$typeof === "symbol"
                );
              })
            ) {
              return true; // Include all keys for compound components
            }

            // Otherwise, only include keys that are React components
            const subItem = (exportItem as Record<string, unknown>)[key];
            const maybeSubComponent = subItem as ReactComponentLike;
            return (
              subItem !== null &&
              typeof subItem === "object" &&
              "$$typeof" in maybeSubComponent &&
              typeof maybeSubComponent.$$typeof === "symbol"
            );
          })
        : [];

    // Create componentTypes by prepending parent export name to each subComponent
    const componentTypes = subComponents.map((key) => `${id}${key}`);

    return {
      exists: true,
      type: isArray ? "array" : basicType,
      isReactComponent,
      subKeys,
      subComponents,
      componentTypes,
    };
  }, [id]);

  const getComponentType = () => {
    if (!exportInfo.exists) return null;

    if (exportInfo.isReactComponent) return "component";
    if (exportInfo.subComponents && exportInfo.subComponents.length > 0)
      return "compound component";
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
            {exportInfo.isReactComponent && " (React Component)"}
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
        </Box>
      )}
    </Box>
  );
};

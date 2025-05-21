import { Box, Code, Text } from "@commercetools/nimbus";
import { useMemo } from "react";
import * as nimbus from "@commercetools/nimbus";

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
}

export const PropsTable = ({ id }: { id: string }) => {
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

    return {
      exists: true,
      type: isArray ? "array" : basicType,
      isReactComponent,
      subKeys,
      subComponents,
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

          {exportInfo.type === "object" &&
            exportInfo.subKeys &&
            exportInfo.subKeys.length > 0 &&
            (!exportInfo.isReactComponent ||
              exportInfo.subComponents?.length === 0) && (
              <Box mt="s">
                <Text>Contains these keys:</Text>
                <Box as="ul" ml="m">
                  {exportInfo.subKeys.map((key) => (
                    <Box as="li" key={key}>
                      <Code>{key}</Code>:{" "}
                      <Code>
                        {
                          typeof (
                            nimbus[id as keyof typeof nimbus] as Record<
                              string,
                              unknown
                            >
                          )[key]
                        }
                      </Code>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
        </Box>
      )}
    </Box>
  );
};

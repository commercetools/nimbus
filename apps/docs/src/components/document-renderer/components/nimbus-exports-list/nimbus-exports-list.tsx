import {
  Box,
  Table,
  Button,
  Icon,
  Badge,
  Text,
  Link,
  Tabs,
  ToggleButtonGroup,
  Stack,
} from "@commercetools/nimbus";
import { useAtomValue } from "jotai";
import { useMemo, useState } from "react";
import React from "react";
import { nimbusExportsAtom, NimbusExportItem } from "./atom";
import { PropsTable } from "@/components/document-renderer/components/props-table";
import { useManifest } from "@/contexts/manifest-context";
import { CheckCircle, HighlightOff } from "@commercetools/nimbus-icons";
import {
  lifecycleStateDescriptions,
  lifecycleStates,
} from "@/schemas/lifecycle-states";

/** Doc pages every component should have (tab keys of its route) */
const DOC_PAGES = ["overview", "guidelines", "dev", "a11y"];

/** Source files every component must have, in column order */
const REQUIRED_FILES = ["stories", "illustration", "types"];

/** Filter key for exports without a lifecycle state */
const NO_STATE = "None";

/** Check mark for present, cross for missing */
const Status = ({ ok }: { ok: boolean }) => (
  <Icon size="2xs" color={ok ? "positive.9" : "critical.9"}>
    {ok ? <CheckCircle /> : <HighlightOff />}
  </Icon>
);

interface NimbusExportsListProps {
  filter?: (item: NimbusExportItem) => boolean;
  title?: string;
}

/**
 * Component that displays a list of exports from the @commercetools/nimbus package
 * Can be used in MDX files to show available components, hooks, etc.
 */
export const NimbusExportsList: React.FC<NimbusExportsListProps> = ({
  filter,
}) => {
  const allExports = useAtomValue(nimbusExportsAtom);
  const { routeManifest, typesManifest } = useManifest();
  const classifiedExports = useMemo(() => {
    const documented = new Set(Object.keys(typesManifest ?? {}));
    const documentedNames = [...documented];
    const routeTitles = new Set(routeManifest?.routes.map((r) => r.title));
    // A compound component (e.g. `Dialog`) is documented through its parts
    // (`DialogRoot`, `DialogBody`), so a name with a documented part is a component
    const hasDocumentedPart = (name: string) =>
      documentedNames.some(
        (doc) => doc.startsWith(name) && /^[A-Z]/.test(doc.slice(name.length))
      );
    const classified = allExports.map<NimbusExportItem>((rawItem) => {
      const { name } = rawItem;
      const hasTypes =
        documented.has(name) ||
        (rawItem.type === "component" && hasDocumentedPart(name));
      const item = { ...rawItem, hasTypes };
      if (item.type !== "component" || !typesManifest) return item;
      if (hasTypes || routeTitles.has(name)) return item;
      // ALL_CAPS names are constants
      if (/^[A-Z][A-Z0-9_]*$/.test(name)) return { ...item, type: "util" };
      return { ...item, type: "unknown" };
    });
    const order = ["component", "hook", "util", "unknown"];
    return classified.sort((a, b) => {
      const diff = order.indexOf(a.type) - order.indexOf(b.type);
      return diff !== 0 ? diff : a.name.localeCompare(b.name);
    });
  }, [allExports, typesManifest, routeManifest]);
  // No selected state means no filtering
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const stateOf = (name: string) =>
    routeManifest?.routes.find((route) => route.title === name)
      ?.lifecycleState ?? NO_STATE;
  const filteredExports = (
    filter ? classifiedExports.filter(filter) : classifiedExports
  ).filter(
    (item) =>
      selectedStates.length === 0 || selectedStates.includes(stateOf(item.name))
  );
  const [expandedComponents, setExpandedComponents] = useState<string[]>([]);

  // Toggle expanded state for a component
  const toggleExpanded = (componentName: string) => {
    setExpandedComponents((prev) =>
      prev.includes(componentName)
        ? prev.filter((name) => name !== componentName)
        : [...prev, componentName]
    );
  };

  // Find documentation for an export item using the route manifest
  const findDocForExport = (exportName: string) => {
    if (!routeManifest) return undefined;

    return routeManifest.routes.find((route) => route.title === exportName);
  };

  // Group exports by type
  const groupedExports = filteredExports.reduce<
    Record<string, NimbusExportItem[]>
  >((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {});

  const renderTable = (type: string, items: NimbusExportItem[]) => {
    const isComponent = type === "component";
    const columns = isComponent ? 10 : 4;

    return (
      <Table.Root variant="outline">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Lifecycle</Table.ColumnHeader>
            {isComponent ? (
              <>
                <Table.ColumnHeader>Overview</Table.ColumnHeader>
                <Table.ColumnHeader>Guidelines</Table.ColumnHeader>
                <Table.ColumnHeader>Implementation</Table.ColumnHeader>
                <Table.ColumnHeader>Accessibility</Table.ColumnHeader>
              </>
            ) : (
              <Table.ColumnHeader>Docs</Table.ColumnHeader>
            )}
            {!isComponent && <Table.ColumnHeader>Type docs</Table.ColumnHeader>}
            {isComponent && (
              <>
                <Table.ColumnHeader>Stories</Table.ColumnHeader>
                <Table.ColumnHeader>Illustration</Table.ColumnHeader>
                <Table.ColumnHeader>Types file</Table.ColumnHeader>
                <Table.ColumnHeader>Actions</Table.ColumnHeader>
              </>
            )}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items.map((item) => {
            const doc = findDocForExport(item.name);
            const docTabs = new Set(doc?.tabs?.map((tab) => tab.key));
            const files = new Set(doc?.files);
            const lifecycleState = doc?.lifecycleState;
            const lifecycleInfo = lifecycleState
              ? lifecycleStateDescriptions[lifecycleState]
              : null;

            return (
              <React.Fragment key={item.name}>
                <Table.Row>
                  <Table.Cell>
                    {doc ? (
                      <Link href={doc.path}>
                        <code>{item.name}</code>
                      </Link>
                    ) : (
                      <code>{item.name}</code>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {lifecycleInfo ? (
                      <Badge
                        size="xs"
                        colorPalette={lifecycleInfo.colorPalette}
                      >
                        {lifecycleInfo.label}
                      </Badge>
                    ) : (
                      <Text fontSize="xs" color="neutral.10">
                        -
                      </Text>
                    )}
                  </Table.Cell>
                  {isComponent ? (
                    <>
                      {DOC_PAGES.map((page) => (
                        <Table.Cell key={page}>
                          <Status ok={docTabs.has(page)} />
                        </Table.Cell>
                      ))}
                    </>
                  ) : (
                    <Table.Cell>
                      <Status ok={!!doc} />
                    </Table.Cell>
                  )}
                  {!isComponent && (
                    <Table.Cell>
                      <Status ok={!!item.hasTypes} />
                    </Table.Cell>
                  )}
                  {isComponent && (
                    <>
                      {REQUIRED_FILES.map((kind) => (
                        <Table.Cell key={kind}>
                          <Status ok={files.has(kind)} />
                        </Table.Cell>
                      ))}
                      <Table.Cell>
                        <Button
                          size="xs"
                          variant="ghost"
                          onPress={() => toggleExpanded(item.name)}
                        >
                          {expandedComponents.includes(item.name)
                            ? "Hide props"
                            : "Show props"}
                        </Button>
                      </Table.Cell>
                    </>
                  )}
                </Table.Row>
                {isComponent && expandedComponents.includes(item.name) && (
                  <Table.Row>
                    <Table.Cell colSpan={columns}>
                      <Box py="m" px="s">
                        <PropsTable id={item.name} />
                      </Box>
                    </Table.Cell>
                  </Table.Row>
                )}
              </React.Fragment>
            );
          })}
        </Table.Body>
      </Table.Root>
    );
  };

  const types = Object.keys(groupedExports);

  return (
    <Stack gap="400">
      <ToggleButtonGroup.Root
        aria-label="Filter by lifecycle state"
        selectionMode="multiple"
        size="xs"
        selectedKeys={selectedStates}
        onSelectionChange={(keys) => setSelectedStates([...keys].map(String))}
      >
        {[...lifecycleStates, NO_STATE].map((state) => (
          <ToggleButtonGroup.Button key={state} id={state}>
            {state}
          </ToggleButtonGroup.Button>
        ))}
      </ToggleButtonGroup.Root>
      {types.length === 0 ? (
        <Text color="neutral.11">No exports match the selected states.</Text>
      ) : (
        <Tabs.Root defaultSelectedKey={types[0]}>
          <Tabs.List>
            {types.map((type) => (
              <Tabs.Tab
                key={type}
                id={type}
                style={{ textTransform: "capitalize" }}
              >
                {type}s ({groupedExports[type].length})
              </Tabs.Tab>
            ))}
          </Tabs.List>
          <Tabs.Panels pt="400">
            {types.map((type) => (
              <Tabs.Panel key={type} id={type}>
                {renderTable(type, groupedExports[type])}
              </Tabs.Panel>
            ))}
          </Tabs.Panels>
        </Tabs.Root>
      )}
    </Stack>
  );
};

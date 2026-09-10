import { useState, useMemo, useCallback } from "react";
import {
  Badge,
  Box,
  Code,
  ComboBox,
  FormField,
  IconButton,
  Flex,
  Heading,
  MakeElementFocusable,
  SearchInput,
  Text,
  TextInput,
  Tooltip,
  Tree,
} from "@commercetools/nimbus";
import { Add, Close, Delete, Info } from "@commercetools/nimbus-icons";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type RenderTargetType = "panel" | "inline" | "action";

export interface LocatorEntry {
  id: string;
  locator: string;
  renderTarget: RenderTargetType;
  slot?: string;
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

export const mockLocatorEntries: LocatorEntry[] = [
  { id: "1", locator: "products.product_list", renderTarget: "panel" },
  { id: "2", locator: "products.product_details.general", renderTarget: "panel" },
  { id: "3", locator: "products.product_details.general", renderTarget: "inline", slot: "enrichment-section" },
  { id: "4", locator: "products.product_details.general", renderTarget: "inline", slot: "information-section" },
  { id: "5", locator: "orders.order_details", renderTarget: "panel" },
];

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const segmentLabels: Record<string, string> = {
  products: "Products",
  product_list: "Product list",
  product_details: "Product details",
  general: "General",
  variants: "Variants",
  images: "Images",
  prices: "Prices",
  orders: "Orders",
  order_list: "Order list",
  order_details: "Order details",
  customers: "Customers",
  customer_list: "Customer list",
  customer_details: "Customer details",
  categories: "Categories",
};

const targetColor: Record<RenderTargetType, string> = {
  panel: "primary",
  inline: "info",
  action: "warning",
};

const availableSlots: Record<string, Array<{ id: string; name: string; description: string }>> = {
  "products.product_details.general": [
    { id: "enrichment-section", name: "enrichment-section", description: "Product data enrichment area below attributes" },
    { id: "information-section", name: "information-section", description: "Supplementary information panel" },
    { id: "ai-suggestions", name: "ai-suggestions", description: "AI-powered suggestion cards above the fold" },
  ],
  "products.product_details.variants": [
    { id: "variant-recommendations", name: "variant-recommendations", description: "Suggested variant configurations" },
  ],
  "products.product_details.images": [
    { id: "image-analysis", name: "image-analysis", description: "AI image quality and tagging analysis" },
  ],
  "products.product_list": [
    { id: "catalog-insights", name: "catalog-insights", description: "Catalog health and completeness metrics" },
  ],
  "orders.order_details": [
    { id: "order-risk-assessment", name: "order-risk-assessment", description: "Fraud and risk scoring panel" },
    { id: "fulfillment-suggestions", name: "fulfillment-suggestions", description: "Shipping and routing recommendations" },
  ],
  "customers.customer_details": [
    { id: "customer-insights", name: "customer-insights", description: "Customer behavior and segment analysis" },
  ],
};

const availablePages = [
  { id: "products.product_list", name: "Products: Product list" },
  { id: "products.product_details.general", name: "Products: Details, General" },
  { id: "products.product_details.variants", name: "Products: Details, Variants" },
  { id: "products.product_details.images", name: "Products: Details, Images" },
  { id: "products.product_details.prices", name: "Products: Details, Prices" },
  { id: "orders.order_list", name: "Orders: Order list" },
  { id: "orders.order_details", name: "Orders: Order details" },
  { id: "customers.customer_list", name: "Customers: Customer list" },
  { id: "customers.customer_details", name: "Customers: Customer details" },
  { id: "categories.category_list", name: "Categories: Category list" },
  { id: "categories.category_details", name: "Categories: Category details" },
  { id: "discounts.product_discounts", name: "Discounts: Product discounts" },
  { id: "discounts.cart_discounts", name: "Discounts: Cart discounts" },
];

type AddChoice = RenderTargetType | "page";

const addChoices = [
  { id: "panel" as const, name: "panel", description: "Side panel on this page" },
  { id: "inline" as const, name: "inline", description: "Embedded slot in the page content" },
  { id: "action" as const, name: "action", description: "Contextual actions (toolbar, menu)" },
  { id: "page" as const, name: "page", description: "Add a new MC page to the tree" },
];

const addChoiceColor: Record<AddChoice, string> = {
  ...targetColor,
  page: "neutral",
};

/* ------------------------------------------------------------------ */
/*  Tree helpers                                                       */
/* ------------------------------------------------------------------ */

interface TreeNode {
  segment: string;
  label: string;
  fullPath: string;
  entries: LocatorEntry[];
  children: TreeNode[];
}

function buildTree(entries: LocatorEntry[]): TreeNode[] {
  const root: TreeNode[] = [];

  for (const entry of entries) {
    const segments = entry.locator.split(".");
    let current = root;

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const fullPath = segments.slice(0, i + 1).join(".");
      let node = current.find((n) => n.fullPath === fullPath);

      if (!node) {
        node = {
          segment,
          label: segmentLabels[segment] ?? segment,
          fullPath,
          entries: [],
          children: [],
        };
        current.push(node);
      }

      if (i === segments.length - 1) {
        node.entries.push(entry);
      }

      current = node.children;
    }
  }

  return root;
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */


const InlineAddForm = ({
  locator,
  onAdd,
  onCancel,
}: {
  locator: string;
  onAdd: (entry: Omit<LocatorEntry, "id">) => void;
  onCancel: () => void;
}) => {
  const [choice, setChoice] = useState<AddChoice | null>(null);
  const [slotName, setSlotName] = useState("");
  const [newPage, setNewPage] = useState<string[]>([]);

  const pageSlots = availableSlots[locator] ?? [];

  const multiFilter = useCallback(
    ComboBox.filters.createMultiPropertyFilter(["id", "name"]),
    []
  );

  const handleConfirm = () => {
    if (choice === "page") {
      if (!newPage[0]) return;
      onAdd({ locator: newPage[0], renderTarget: "panel" });
    } else if (choice) {
      onAdd({
        locator,
        renderTarget: choice,
        slot: choice !== "panel" && slotName.trim() ? slotName.trim() : undefined,
      });
    }
  };

  const canSubmit =
    choice === "panel" ||
    (choice === "page" && newPage.length > 0) ||
    (choice === "inline" && slotName.trim()) ||
    (choice === "action" && slotName.trim());

  return (
    <Flex
      as="form"
      align="flex-end"
      gap="200"
      py="200"
      wrap="wrap"
      maxWidth="400px"
      onSubmit={(e: React.FormEvent) => {
        e.preventDefault();
        if (canSubmit) handleConfirm();
      }}
      onKeyDown={(e: React.KeyboardEvent) => e.stopPropagation()}
      onKeyUp={(e: React.KeyboardEvent) => e.stopPropagation()}
    >
      <FormField.Root size="sm" flex="1" minWidth="150px">
        <FormField.Label>Type</FormField.Label>
        <FormField.Input>
          <ComboBox.Root
            aria-label="Type"
            placeholder="Select..."
            size="sm"
            menuTrigger="focus"
            items={addChoices}
            selectionMode="single"
            selectedKeys={choice ? [choice] : []}
            onSelectionChange={(keys) => {
              const val = Array.isArray(keys) ? keys[0] : keys;
              setChoice(val as AddChoice | null);
              setSlotName("");
              setNewPage([]);
            }}
          >
            <ComboBox.Trigger />
            <ComboBox.Popover>
              <ComboBox.ListBox>
                {(item: (typeof addChoices)[number]) => (
                  <ComboBox.Option id={item.id} textValue={item.name}>
                    <Flex align="center" gap="100">
                      <Badge size="2xs" colorPalette={addChoiceColor[item.id]}>
                        {item.name}
                      </Badge>
                      <Box textStyle="xs" color="neutral.11">
                        {item.description}
                      </Box>
                    </Flex>
                  </ComboBox.Option>
                )}
              </ComboBox.ListBox>
            </ComboBox.Popover>
          </ComboBox.Root>
        </FormField.Input>
      </FormField.Root>

      {choice && choice !== "panel" && choice !== "page" && (
        <FormField.Root size="sm" flex="1" minWidth="150px">
          <FormField.Label>Slot</FormField.Label>
          <FormField.Input>
            {pageSlots.length > 0 ? (
              <ComboBox.Root
                aria-label="Slot"
                placeholder="Select..."
                size="sm"
                menuTrigger="focus"
                items={pageSlots}
                selectionMode="single"
                selectedKeys={slotName ? [slotName] : []}
                onSelectionChange={(keys) => {
                  const val = Array.isArray(keys) ? keys[0] : keys;
                  setSlotName(val ? String(val) : "");
                }}
                allowsCustomOptions
                getNewOptionData={(input: string) => ({
                  id: input,
                  name: input,
                  description: "Custom slot",
                })}
              >
                <ComboBox.Trigger />
                <ComboBox.Popover>
                  <ComboBox.ListBox>
                    {(item: { id: string; name: string; description: string }) => (
                      <ComboBox.Option id={item.id} textValue={item.name}>
                        <Box>
                          <Code size="xs">{item.name}</Code>
                          <Box textStyle="xs" color="neutral.11">{item.description}</Box>
                        </Box>
                      </ComboBox.Option>
                    )}
                  </ComboBox.ListBox>
                </ComboBox.Popover>
              </ComboBox.Root>
            ) : (
              <TextInput
                aria-label="Slot name"
                placeholder="slot name..."
                size="sm"
                value={slotName}
                onChange={setSlotName}
              />
            )}
          </FormField.Input>
        </FormField.Root>
      )}

      {choice === "page" && (
        <FormField.Root size="sm" flex="1" minWidth="150px">
          <FormField.Label>Page</FormField.Label>
          <FormField.Input>
            <ComboBox.Root
              aria-label="Page"
              placeholder="Select..."
              size="sm"
              menuTrigger="focus"
              items={availablePages}
              selectionMode="single"
              selectedKeys={newPage}
              onSelectionChange={(keys) =>
                setNewPage(Array.isArray(keys) ? keys.map(String) : [String(keys)])
              }
              filter={multiFilter}
              allowsCustomOptions
              getNewOptionData={(input: string) => ({
                id: input,
                name: input,
              })}
            >
              <ComboBox.Trigger />
              <ComboBox.Popover>
                <ComboBox.ListBox>
                  {(item: { id: string; name: string }) => (
                    <ComboBox.Option id={item.id} textValue={item.name}>
                      <Box>
                        <Box textStyle="sm">{item.name}</Box>
                        <Code size="xs" variant="subtle">{item.id}</Code>
                      </Box>
                    </ComboBox.Option>
                  )}
                </ComboBox.ListBox>
              </ComboBox.Popover>
            </ComboBox.Root>
          </FormField.Input>
        </FormField.Root>
      )}

      <Flex align="center" gap="50" alignSelf="flex-end" flexShrink={0}>
        <IconButton size="2xs" variant="ghost" colorPalette="positive" type="submit" isDisabled={!canSubmit} aria-label="Confirm">
          <Add />
        </IconButton>
        <IconButton size="2xs" variant="ghost" colorPalette="critical" onPress={onCancel} aria-label="Cancel">
          <Close />
        </IconButton>
      </Flex>
    </Flex>
  );
};

const LocatorTreeNode = ({
  node,
  onRemove,
  onAdd,
  addingTo,
  onStartAdd,
  onCancelAdd,
}: {
  node: TreeNode;
  onRemove: (id: string) => void;
  onAdd: (entry: Omit<LocatorEntry, "id">) => void;
  addingTo: string | null;
  onStartAdd: (locator: string) => void;
  onCancelAdd: () => void;
}) => {
  const hasChildren = node.children.length > 0;
  const pageEntries = node.entries.filter((e) => !e.slot);
  const slotEntries = node.entries.filter((e) => e.slot);
  const isAdding = addingTo === node.fullPath;
  const hasSubItems = hasChildren || slotEntries.length > 0 || isAdding;

  return (
    <Tree.Item id={node.fullPath} textValue={node.label}>
      <Tree.ItemContent>
        <Flex
          align="center"
          gap="150"
          minWidth="0"
          width="100%"
          css={{ "& .row-actions": { opacity: 0 }, "&:hover .row-actions": { opacity: 1 } }}
        >
          {hasSubItems && <Tree.Indicator />}
          <Flex direction="column" minWidth="0" flex="1" gap="50">
            <Flex align="center" gap="100">
              <Text slot={null} textStyle="sm" fontWeight={node.entries.length > 0 ? "medium" : "normal"} whiteSpace="nowrap">
                {node.label}
              </Text>
              {pageEntries.map((entry) => (
                <Text slot={null} key={entry.id} textStyle="xs" color={`${targetColor[entry.renderTarget]}.11`}>
                  {entry.renderTarget}
                </Text>
              ))}
            </Flex>
            <Code size="xs" variant="subtle" wordBreak="break-all" width="fit-content">{node.fullPath}</Code>
          </Flex>
          <Flex className="row-actions" align="center" gap="0" flexShrink={0}>
            {!isAdding && (
              <IconButton
                variant="ghost"
                colorPalette="positive"
                size="2xs"
                aria-label={`Add render target to ${node.label}`}
                onPress={() => onStartAdd(node.fullPath)}
              >
                <Add />
              </IconButton>
            )}
            {pageEntries.map((entry) => (
              <IconButton
                key={entry.id}
                variant="ghost"
                colorPalette="critical"
                size="2xs"
                aria-label={`Remove ${entry.renderTarget} from ${node.label}`}
                onPress={() => onRemove(entry.id)}
              >
                <Delete />
              </IconButton>
            ))}
          </Flex>
        </Flex>
      </Tree.ItemContent>
      {hasSubItems && (
        <Tree.SubTree>
          {slotEntries.map((entry) => (
            <Tree.Item key={entry.id} id={`slot:${entry.id}`} textValue={entry.slot!}>
              <Tree.ItemContent>
                <Flex
                  align="center"
                  gap="150"
                  minWidth="0"
                  width="100%"
                  css={{ "& .row-actions": { opacity: 0 }, "&:hover .row-actions": { opacity: 1 } }}
                >
                  <Flex direction="column" minWidth="0" flex="1" gap="50">
                    <Flex align="center" gap="100">
                      <Text slot={null} textStyle="sm" fontWeight="medium" whiteSpace="nowrap">
                        {entry.slot}
                      </Text>
                      <Text slot={null} textStyle="xs" color={`${targetColor[entry.renderTarget]}.11`}>
                        {entry.renderTarget}
                      </Text>
                    </Flex>
                    <Code size="xs" variant="subtle" wordBreak="break-all" width="fit-content">{entry.locator}#{entry.slot}</Code>
                  </Flex>
                  <Box className="row-actions" flexShrink={0}>
                    <IconButton
                      variant="ghost"
                      colorPalette="critical"
                      size="2xs"
                      aria-label={`Remove ${entry.slot}`}
                      onPress={() => onRemove(entry.id)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Flex>
              </Tree.ItemContent>
            </Tree.Item>
          ))}
          {isAdding && (
            <Tree.Item id={`${node.fullPath}:add-form`} textValue="Add locator form">
              <Tree.ItemContent>
                <InlineAddForm locator={node.fullPath} onAdd={onAdd} onCancel={onCancelAdd} />
              </Tree.ItemContent>
            </Tree.Item>
          )}
          {node.children.map((child) => (
            <LocatorTreeNode
              key={child.fullPath}
              node={child}
              onRemove={onRemove}
              onAdd={onAdd}
              addingTo={addingTo}
              onStartAdd={onStartAdd}
              onCancelAdd={onCancelAdd}
            />
          ))}
        </Tree.SubTree>
      )}
    </Tree.Item>
  );
};

/* ------------------------------------------------------------------ */
/*  LocatorTreePanel: the main exported component                      */
/* ------------------------------------------------------------------ */

export interface LocatorTreePanelProps {
  entries: LocatorEntry[];
  onEntriesChange: (entries: LocatorEntry[]) => void;
}

export const LocatorTreePanel = ({ entries, onEntriesChange }: LocatorTreePanelProps) => {
  const [treeFilter, setTreeFilter] = useState("");
  const [addingTo, setAddingTo] = useState<string | null>(null);
  let nextId = entries.length + 1;

  const filteredEntries = useMemo(() => {
    if (!treeFilter.trim()) return entries;
    const q = treeFilter.trim().toLowerCase();
    return entries.filter(
      (e) =>
        e.locator.toLowerCase().includes(q) ||
        e.renderTarget.toLowerCase().includes(q) ||
        (e.slot && e.slot.toLowerCase().includes(q)) ||
        (segmentLabels[e.locator.split(".").pop() ?? ""] ?? "")
          .toLowerCase()
          .includes(q)
    );
  }, [entries, treeFilter]);

  const tree = useMemo(() => buildTree(filteredEntries), [filteredEntries]);

  const counts = useMemo(() => {
    const c: Record<RenderTargetType, number> = { panel: 0, inline: 0, action: 0 };
    for (const e of entries) c[e.renderTarget]++;
    return c;
  }, [entries]);

  const uniquePages = useMemo(
    () => new Set(entries.map((e) => e.locator)).size,
    [entries]
  );

  const handleRemove = (id: string) => {
    onEntriesChange(entries.filter((e) => e.id !== id));
  };

  const handleInlineAdd = (entry: Omit<LocatorEntry, "id">) => {
    onEntriesChange([...entries, { ...entry, id: String(nextId++) }]);
    setAddingTo(null);
  };

  const summaryText = `Active on ${uniquePages} page${uniquePages !== 1 ? "s" : ""} across ${
    [
      counts.panel > 0 ? `${counts.panel} panel` : "",
      counts.inline > 0 ? `${counts.inline} inline` : "",
      counts.action > 0 ? `${counts.action} action` : "",
    ].filter(Boolean).join(", ")
  } locator${entries.length !== 1 ? "s" : ""}.`;

  return (
    <Box
      border="solid-25"
      borderColor="neutral.6"
      borderRadius="200"
      p="300"
      overflow="hidden"
    >
      <Flex align="center" gap="100" mb="100">
        <Heading size="xs">Configured locators</Heading>
        <Tooltip.Root>
          <MakeElementFocusable>
            <Box color="neutral.11" cursor="help">
              <Info />
            </Box>
          </MakeElementFocusable>
          <Tooltip.Content placement="top">
            Each locator specifies an MC page and render target type (panel,
            inline, or action). Overrides can only narrow declared capabilities.
          </Tooltip.Content>
        </Tooltip.Root>
      </Flex>
      <Text slot={null} textStyle="xs" color="neutral.11" mb="200">
        {summaryText}
      </Text>
          <SearchInput
            aria-label="Filter locators"
            placeholder="Filter by page, type, or slot..."
            size="sm"
            value={treeFilter}
            onChange={setTreeFilter}
            width="100%"
            mb="200"
          />
          {entries.length === 0 ? (
            <Box py="400" textAlign="center">
              <Text slot={null} textStyle="sm" color="neutral.11">
                No locators configured. This agent will not appear on any page.
              </Text>
            </Box>
          ) : (
            <Tree.Root
              aria-label="Configured locators"
              size="sm"
              defaultExpandedKeys={[
                ...new Set(
                  entries.flatMap((e) => {
                    const parts = e.locator.split(".");
                    return parts.map((_, i) => parts.slice(0, i + 1).join("."));
                  })
                ),
              ]}
            >
              {tree.map((node) => (
                <LocatorTreeNode
                  key={node.fullPath}
                  node={node}
                  onRemove={handleRemove}
                  onAdd={handleInlineAdd}
                  addingTo={addingTo}
                  onStartAdd={setAddingTo}
                  onCancelAdd={() => setAddingTo(null)}
                />
              ))}
            </Tree.Root>
          )}
    </Box>
  );
};

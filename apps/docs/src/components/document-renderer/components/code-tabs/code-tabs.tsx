import { Children, isValidElement, useMemo } from "react";
import type { ReactNode } from "react";
import { useAtom } from "jotai";
import { Tabs } from "@commercetools/nimbus";
import { codeTabsLabelAtom } from "@/atoms/code-tabs";

export type CodeTabsProps = {
  /**
   * The tab labels as a JSON array of strings, in the same order as the
   * children. The `remarkCodeTabs` plugin sets this.
   */
  tabs?: string;
  /** The code blocks, one for each label. */
  children?: ReactNode;
};

/** Reads the JSON list of labels. Returns an empty list for invalid input. */
const parseLabels = (tabs?: string): string[] => {
  try {
    const parsed: unknown = JSON.parse(tabs ?? "[]");
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
};

/**
 * Shows a group of code blocks as tabs, one block at a time.
 *
 * The component does not know what the labels mean. It shows the block of
 * the label that the user chose last, in any group, and the first block when
 * the group has no such label.
 */
export const CodeTabs = ({ tabs, children }: CodeTabsProps) => {
  const [chosenLabel, setChosenLabel] = useAtom(codeTabsLabelAtom);

  const labels = useMemo(() => parseLabels(tabs), [tabs]);
  // MDX puts line breaks between the blocks; only the elements are blocks.
  const blocks = Children.toArray(children).filter(isValidElement);

  // Two blocks with the same label would share one tab id. The index keeps
  // every id unique, and the label is used to match the chosen tab.
  const items = blocks.map((block, index) => ({
    id: `${index}`,
    label: labels[index] ?? `${index + 1}`,
    block,
  }));

  const selected = items.find((item) => item.label === chosenLabel) ?? items[0];

  if (!selected) return null;

  return (
    <Tabs.Root
      selectedKey={selected.id}
      onSelectionChange={(key) => {
        const next = items.find((item) => item.id === key);
        if (next) setChosenLabel(next.label);
      }}
      mb="400"
    >
      <Tabs.List>
        {items.map((item) => (
          <Tabs.Tab key={item.id} id={item.id}>
            {item.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      <Tabs.Panels>
        {items.map((item) => (
          <Tabs.Panel key={item.id} id={item.id}>
            {item.block}
          </Tabs.Panel>
        ))}
      </Tabs.Panels>
    </Tabs.Root>
  );
};

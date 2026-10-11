import { useControlledState } from "react-stately/useControlledState";
import { CodeBlock } from "@/components/code-block/code-block";
import { Tabs } from "@/components/tabs/tabs";
import { Select } from "@/components/select/select";
import { useLocalizedStringFormatter } from "@/hooks";
import { codeSnippetGroupMessagesStrings } from "./code-snippet-group.messages";
import type { CodeSnippetGroupProps } from "./code-snippet-group.types";

/**
 * # CodeSnippetGroup
 *
 * Several code examples of the same thing (for example one request in cURL,
 * JavaScript and Java), one shown at a time. The user switches with tabs or a
 * select. Copy, download and the language label follow the shown example.
 *
 * For layouts this pattern does not cover, compose `CodeBlock` parts
 * directly.
 *
 * @example
 * ```tsx
 * <CodeSnippetGroup
 *   items={[
 *     { key: "curl", label: "cURL", code: curlCode, language: "bash" },
 *     { key: "js", label: "JavaScript", code: jsCode, language: "js" },
 *   ]}
 * />
 * ```
 * @supportsStyleProps
 */
export const CodeSnippetGroup = ({
  items,
  switcher = "tabs",
  selectedKey: selectedKeyProp,
  defaultSelectedKey,
  onSelectionChange,
  title,
  switcherLabel,
  showCopyButton = true,
  onCopy,
  showLineNumbers,
  wrapLongLines,
  size,
  ...rootProps
}: CodeSnippetGroupProps) => {
  const msg = useLocalizedStringFormatter(codeSnippetGroupMessagesStrings);
  const [selectedKey, setSelectedKey] = useControlledState<string>(
    selectedKeyProp,
    defaultSelectedKey ?? items[0]?.key ?? "",
    onSelectionChange
  );
  const selected = items.find((item) => item.key === selectedKey) ?? items[0];

  if (selected === undefined) return null;

  const hasSwitcher = items.length > 1;
  const resolvedSwitcherLabel = switcherLabel ?? msg.format("switcherLabel");
  const content = (
    <CodeBlock.Content
      showLineNumbers={showLineNumbers}
      wrapLongLines={wrapLongLines}
    />
  );
  const header = (switcherElement: React.ReactNode) => (
    <CodeBlock.Header>
      {title !== undefined && <CodeBlock.Title>{title}</CodeBlock.Title>}
      {switcherElement}
      {selected.language !== undefined && <CodeBlock.LanguageLabel />}
      {(showCopyButton || selected.fileName !== undefined) && (
        <CodeBlock.Actions>
          {selected.fileName !== undefined && (
            <CodeBlock.DownloadTrigger fileName={selected.fileName} />
          )}
          {showCopyButton && (
            <CodeBlock.CopyTrigger onCopy={() => onCopy?.(selected.key)} />
          )}
        </CodeBlock.Actions>
      )}
    </CodeBlock.Header>
  );

  return (
    <CodeBlock.Root
      code={selected.code}
      language={selected.language}
      size={size}
      {...rootProps}
    >
      {!hasSwitcher && (
        <>
          {header(null)}
          {content}
        </>
      )}
      {hasSwitcher && switcher === "tabs" && (
        // Each tab controls a real tab panel; React Aria renders only the
        // selected panel, which shows the selected example.
        <Tabs.Root
          variant="pill"
          size="sm"
          orientation="horizontal"
          selectedKey={selected.key}
          onSelectionChange={(key) => setSelectedKey(String(key))}
        >
          {header(
            <Tabs.List aria-label={resolvedSwitcherLabel}>
              {items.map((item) => (
                <Tabs.Tab key={item.key} id={item.key}>
                  {item.label}
                </Tabs.Tab>
              ))}
            </Tabs.List>
          )}
          <Tabs.Panels>
            {items.map((item) => (
              <Tabs.Panel key={item.key} id={item.key} padding="0">
                {content}
              </Tabs.Panel>
            ))}
          </Tabs.Panels>
        </Tabs.Root>
      )}
      {hasSwitcher && switcher === "select" && (
        <>
          {header(
            <Select.Root
              aria-label={resolvedSwitcherLabel}
              size="sm"
              isClearable={false}
              selectedKey={selected.key}
              onSelectionChange={(key) => {
                if (key !== null) setSelectedKey(String(key));
              }}
            >
              <Select.Options>
                {items.map((item) => (
                  <Select.Option key={item.key} id={item.key}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select.Options>
            </Select.Root>
          )}
          {content}
        </>
      )}
      <CodeBlock.ExpandTrigger />
    </CodeBlock.Root>
  );
};

CodeSnippetGroup.displayName = "CodeSnippetGroup";

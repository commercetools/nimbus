import { useMemo, type ReactNode } from "react";
import {
  Provider,
  InputContext,
  ButtonContext,
  PopoverContext,
  ListBoxContext,
  TagGroupContext,
} from "react-aria-components";
import { useIntl } from "react-intl";
import { ComboBoxRootContext } from "./combobox.root-context";
import type { ComboBoxRootContextValue } from "../combobox.types";
import { messages } from "../combobox.i18n";

export type ComboBoxCustomContextProviderProps<T extends object> = {
  value: ComboBoxRootContextValue<T>;
  children: ReactNode;
};

/**
 * Custom context provider that wraps React Aria contexts and Nimbus context.
 * Uses React Aria's Provider component to pass multiple context values at once.
 *
 * This provider ensures that:
 * - ComboBox.Input reads from InputContext
 * - ComboBox.TagGroup reads from TagGroupContext
 * - IconButton[slot="toggle"] reads from ButtonContext with slot="toggle"
 * - IconButton[slot="clear"] reads from ButtonContext with slot="clear"
 * - ComboBox.Popover reads from PopoverContext
 * - ComboBox.ListBox reads from ListBoxContext
 *
 * @see https://react-spectrum.adobe.com/react-aria/advanced.html#provider
 * @see https://react-spectrum.adobe.com/react-aria/advanced.html#slots
 */
export const ComboBoxCustomContextProvider = <T extends object>({
  value,
  children,
}: ComboBoxCustomContextProviderProps<T>) => {
  const intl = useIntl();

  // Build all React Aria context values as [Context, value] tuples
  const contextValues = useMemo(
    () => [
      // ComboBoxContext - overall context for component
      [ComboBoxRootContext, { ...value }],

      // InputContext - for ComboBox.Input
      [
        InputContext,
        {
          role: "combobox" as const,
          "aria-autocomplete": "list" as const,
          "aria-controls":
            value.selectionMode === "multiple"
              ? `${value.tagGroupId} ${value.listboxId}`
              : value.listboxId,
          "aria-expanded": value.isOpen,
          "aria-describedby":
            value.selectionMode === "multiple" ? value.tagGroupId : undefined,
          "aria-label": value["aria-label"],
          "aria-labelledby": value["aria-labelledby"],
          value: value.inputValue,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            value.setInputValue(e.target.value),
          onFocus: value.handleFocus,
          onBlur: value.handleBlur,
          disabled: value.isDisabled,
          readOnly: value.isReadOnly,
          required: value.isRequired,
          "aria-invalid": value.isInvalid,
        },
      ],

      // TagGroupContext - for ComboBox.TagGroup (multi-select)
      [
        TagGroupContext,
        {
          id: value.tagGroupId,
          items:
            value.selectionMode === "multiple"
              ? Array.from(value.state.selectionManager.selectedKeys).map(
                  (key) => value.state.collection.getItem(key)
                )
              : [],
          onRemove: value.removeKey,
        },
      ],

      // ButtonContext with slots - for toggle and clear buttons
      [
        ButtonContext,
        {
          slots: {
            toggle: {
              onPress: () => value.setIsOpen(!value.isOpen),
              "aria-label": intl.formatMessage(messages.toggleOptions),
              isDisabled: value.isDisabled,
            },
            clear: {
              onPress: value.clearSelection,
              "aria-label": intl.formatMessage(messages.clearSelection),
              isDisabled:
                value.isDisabled ||
                value.state.selectionManager.selectedKeys.size === 0,
            },
          },
        },
      ],

      // PopoverContext - for ComboBox.Popover
      [
        PopoverContext,
        {
          open: value.isOpen,
          onOpenChange: value.setIsOpen,
          positioning: {
            strategy: "fixed" as const,
            placement: "bottom-start" as const,
            gutter: 4,
          },
          positionReference: value.triggerRef,
        },
      ],

      // ListBoxContext - for ComboBox.ListBox
      [
        ListBoxContext,
        {
          id: value.listboxId,
          "aria-labelledby": value["aria-labelledby"],
          items: value.state.collection,
          selectionMode: value.selectionMode,
          selectedKeys: value.state.selectionManager.selectedKeys,
          onSelectionChange: value.state.selectionManager.setSelectedKeys,
          renderEmptyState: value.renderEmptyState,
        },
      ],
    ],
    [value, intl]
  );

  // TypeScript cannot properly infer the complex heterogeneous tuple type required by Provider.
  // The runtime behavior is correct - each context receives its properly typed value.
  // TODO:  If TypeScript or React Aria improves their types, we can remove this
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <Provider values={contextValues as any}>{children}</Provider>;
};

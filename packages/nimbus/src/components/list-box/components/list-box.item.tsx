import { ListBoxItem as RaListBoxItem } from "react-aria-components";
import { Check } from "@commercetools/nimbus-icons";
import { extractStyleProps } from "@/utils";
import {
  ListBoxItemSlot,
  ListBoxItemIndicatorSlot,
  ListBoxItemLeadingSlot,
  ListBoxItemContentSlot,
  ListBoxItemTrailingSlot,
} from "../list-box.slots";
import type { ListBoxItemProps } from "../list-box.types";

/**
 * ListBox.Item - An individual selectable option.
 *
 * Wraps React Aria's `ListBoxItem`. In multiple-selection mode it renders a
 * leading checkbox indicator (reusing the Checkbox recipe); in single-selection
 * mode selection is shown as a full-row highlight. Supports optional `leading`
 * media and `trailing` content, plus React Aria's `Text` label/description
 * slots for a two-line option.
 *
 * @example
 * ```tsx
 * <ListBox.Item id="1">Option 1</ListBox.Item>
 *
 * <ListBox.Item id="2" textValue="Jane Doe" leading={<Avatar />}>
 *   <Text slot="label">Jane Doe</Text>
 *   <Text slot="description">jane@example.com</Text>
 * </ListBox.Item>
 * ```
 *
 * @supportsStyleProps
 */
export function ListBoxItem<T extends object>({
  children,
  ref,
  leading,
  trailing,
  ...props
}: ListBoxItemProps<T>) {
  const { textValue: textValueProp, ...remainingProps } = props;
  const [styleProps, restProps] = extractStyleProps(remainingProps);
  const textValue =
    textValueProp ?? (typeof children === "string" ? children : undefined);

  return (
    <ListBoxItemSlot {...styleProps} asChild>
      <RaListBoxItem ref={ref} {...restProps} textValue={textValue}>
        {(renderProps) => {
          const content =
            typeof children === "function" ? children(renderProps) : children;
          return (
            <>
              {renderProps.selectionMode === "multiple" && (
                <ListBoxItemIndicatorSlot>
                  <span data-selected={renderProps.isSelected}>
                    {renderProps.isSelected && <Check />}
                  </span>
                </ListBoxItemIndicatorSlot>
              )}
              {leading && (
                <ListBoxItemLeadingSlot>{leading}</ListBoxItemLeadingSlot>
              )}
              <ListBoxItemContentSlot>{content}</ListBoxItemContentSlot>
              {trailing && (
                <ListBoxItemTrailingSlot>{trailing}</ListBoxItemTrailingSlot>
              )}
            </>
          );
        }}
      </RaListBoxItem>
    </ListBoxItemSlot>
  );
}

ListBoxItem.displayName = "ListBox.Item";

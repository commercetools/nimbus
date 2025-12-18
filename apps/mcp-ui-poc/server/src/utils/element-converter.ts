import type { ChildElement } from "../types/index.js";
import type { ElementDefinition } from "../types/remote-dom.js";
import {
  buildButtonElement,
  buildTextElement,
  buildHeadingElement,
  buildBadgeElement,
  buildStackElement,
  buildFlexElement,
  buildCardElement,
  buildCardContentElement,
  buildTextInputElement,
  buildMoneyInputElement,
  buildFormFieldElement,
} from "../elements/index.js";

/**
 * Convert ChildElement types to structured ElementDefinition
 * Uses shared element builders for consistency with tool functions
 */
export function convertChildrenToElements(
  children: ChildElement[]
): ElementDefinition[] {
  return children.map((child) => convertChildToElement(child));
}

function convertChildToElement(child: ChildElement): ElementDefinition {
  switch (child.type) {
    case "heading":
      return buildHeadingElement(child);

    case "text":
      return buildTextElement(child);

    case "button":
      return buildButtonElement({
        label: child.label,
        variant: child.variant,
        colorPalette: child.colorPalette,
        width: child.width,
        isDisabled: child.isDisabled,
        type: child.type,
        ariaLabel: child.ariaLabel,
        intent: child.intent,
      });

    case "badge":
      return buildBadgeElement(child);

    case "stack":
      return buildStackElement({
        direction: child.direction,
        gap: child.gap,
        width: child.width,
        marginBottom: child.marginBottom,
        as: child.as,
        action: child.action,
        method: child.method as "get" | "post" | undefined,
        enctype: child.enctype as
          | "application/x-www-form-urlencoded"
          | "multipart/form-data"
          | "text/plain"
          | undefined,
        children: child.children
          ? convertChildrenToElements(child.children)
          : undefined,
      });

    case "flex":
      return buildFlexElement({
        direction: child.direction,
        gap: child.gap,
        padding: child.padding,
        backgroundColor: child.backgroundColor,
        as: child.as,
        action: child.action,
        method: child.method as "get" | "post" | undefined,
        enctype: child.enctype as
          | "application/x-www-form-urlencoded"
          | "multipart/form-data"
          | "text/plain"
          | undefined,
        children: child.children
          ? convertChildrenToElements(child.children)
          : undefined,
      });

    case "card":
      return buildCardElement({
        elevation: child.elevation,
        borderStyle: child.borderStyle,
        cardPadding: child.cardPadding,
        maxWidth: child.maxWidth,
        width: child.width,
        children: [
          buildCardContentElement({
            children: child.children
              ? convertChildrenToElements(child.children)
              : undefined,
          }),
        ],
      });

    case "formField":
      return buildFormFieldElement({
        labelChildren: convertChildrenToElements(child.labelChildren),
        inputChildren: convertChildrenToElements(child.inputChildren),
        description: child.description,
        errorMessage: child.errorMessage,
        isRequired: child.isRequired,
        isInvalid: child.isInvalid,
        isDisabled: child.isDisabled,
        isReadOnly: child.isReadOnly,
        size: child.size as "sm" | "md" | undefined,
        direction: child.direction as "row" | "column" | undefined,
      });

    case "textInput":
      return buildTextInputElement({
        name: child.name,
        placeholder: child.placeholder,
        defaultValue: child.defaultValue,
        isRequired: child.isRequired,
        isDisabled: child.isDisabled,
        isReadOnly: child.isReadOnly,
        type: child.inputType as
          | "text"
          | "email"
          | "url"
          | "tel"
          | "password"
          | "search"
          | "number"
          | "date"
          | "time"
          | "datetime-local"
          | "month"
          | "week"
          | "file"
          | undefined,
        pattern: child.pattern,
        accept: child.accept,
        autoComplete: child.autoComplete,
        ariaLabel: child.ariaLabel,
      });

    case "moneyInput":
      return buildMoneyInputElement({
        name: child.name,
        currencyCode: child.currencyCode,
        amount: child.amount,
        currencies: child.currencies,
        placeholder: child.placeholder,
        isRequired: child.isRequired,
        isDisabled: child.isDisabled,
        isReadOnly: child.isReadOnly,
        isInvalid: child.isInvalid,
        size: child.size,
        hasHighPrecisionBadge: child.hasHighPrecisionBadge,
        isCurrencyInputDisabled: child.isCurrencyInputDisabled,
        ariaLabel: child.ariaLabel,
      });
  }
}

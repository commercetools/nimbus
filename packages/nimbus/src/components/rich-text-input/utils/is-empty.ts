import { Text, Element as SlateElement, type Descendant } from "slate";
import { fromHTML } from "./html-serialization";
import type { CustomElement, CustomText } from "./types";

const isTextNodeNonEmpty = (node: Descendant): boolean =>
  Text.isText(node) && (node as CustomText).text.trim() !== "";

const isElementNodeNonEmpty = (node: CustomElement): boolean =>
  node.children.some(
    (child) =>
      isTextNodeNonEmpty(child) ||
      (SlateElement.isElement(child) &&
        isElementNodeNonEmpty(child as CustomElement))
  );

/**
 * Checks if a rich text HTML value is empty or contains no meaningful content
 */
export const isEmpty = (value: string): boolean => {
  if (!value || value.trim() === "") {
    return true;
  }

  try {
    const slateValue = fromHTML(value);

    // Check if any nodes have meaningful content
    return !slateValue.some((node) => {
      if (SlateElement.isElement(node)) {
        return isElementNodeNonEmpty(node as CustomElement);
      }
      if (Text.isText(node)) {
        return isTextNodeNonEmpty(node as CustomText);
      }
      return false;
    });
  } catch (error) {
    console.warn("Failed to check if rich text is empty:", error);
    return true;
  }
};

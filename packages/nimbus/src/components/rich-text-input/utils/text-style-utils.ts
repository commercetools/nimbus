import {
  textStyles,
  type BlockType,
  type TextStyleDefinition,
} from "../constants";

/**
 * Gets a text style definition by its ID
 */
export function getTextStyleById(
  styleId: string
): TextStyleDefinition | undefined {
  return textStyles.find((style) => style.id === styleId);
}

/**
 * Gets the display label for a text style ID
 */
export function getTextStyleLabel(styleId: string): string {
  const style = getTextStyleById(styleId);
  return style?.label || styleId;
}

/**
 * Gets all available text style IDs
 */
export function getTextStyleIds(): string[] {
  return textStyles.map((style) => style.id);
}

/**
 * Checks if a style ID is a valid text style
 */
export function isValidTextStyle(styleId: string): boolean {
  return textStyles.some((style) => style.id === styleId);
}

/**
 * Gets the text style properties for rendering
 */
export function getTextStyleProps(
  styleId: string
): TextStyleDefinition["props"] | null {
  const style = getTextStyleById(styleId);
  return style?.props || null;
}

/**
 * Determines if a block type is a heading
 */
export function isHeadingType(blockType: string): boolean {
  return blockType.startsWith("heading-");
}

/**
 * Gets the heading level from a heading block type (1-6)
 */
export function getHeadingLevel(blockType: string): number | null {
  if (!isHeadingType(blockType)) return null;

  const levelMap: Record<string, number> = {
    "heading-one": 1,
    "heading-two": 2,
    "heading-three": 3,
    "heading-four": 4,
    "heading-five": 5,
  };

  return levelMap[blockType] || null;
}

/**
 * Creates a block type from heading level
 */
export function createHeadingBlockType(level: number): BlockType | null {
  const levelMap: Record<number, BlockType> = {
    1: "heading-one",
    2: "heading-two",
    3: "heading-three",
    4: "heading-four",
    5: "heading-five",
  };

  return levelMap[level] || null;
}

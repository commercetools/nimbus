/**
 * Child element schema for recursive composition
 * Used by tools that accept children (Stack, Flex, Card, FormField, etc.)
 */

import { z } from "zod";
import * as elements from "../elements/index.js";

/**
 * Recursive child element schema using lazy evaluation for circular references
 */
export const childElementSchema: z.ZodTypeAny = z.lazy(() =>
  z.discriminatedUnion("type", [
    // All elements now use colocated schemas
    elements.headingElementSchema,
    elements.textElementSchema,
    elements.buttonElementSchema,
    elements.badgeElementSchema,
    elements.textInputElementSchema,
    elements.stackElementSchema,
    elements.flexElementSchema,
    elements.cardElementSchema,
    elements.formFieldElementSchema,
    elements.moneyInputElementSchema,
  ])
);

import { defineTokens } from "@chakra-ui/react/styled-system";
import { themeTokens } from "@commercetools/nimbus-tokens";

// convert token percentage values (needed by figma) to em values (needded by code)
// todo: fix this in the token build process
const convertPercentToEm = (
  obj: Record<string, { value: string }>
): Record<string, { value: string }> => {
  return Object.keys(obj).reduce(
    (acc, key) => {
      // Remove '%' and divide by 100 to convert to em
      const percentage = parseFloat(obj[key].value);
      const emValue = percentage / 100; // 1% = 0.01em, 100% = 1em
      // Update the object with the new em value
      acc[key] = { value: `${emValue}em` };
      return acc;
    },
    {} as Record<string, { value: string }>
  );
};

export const letterSpacings = defineTokens.letterSpacings(
  convertPercentToEm(themeTokens.letterSpacing)
);

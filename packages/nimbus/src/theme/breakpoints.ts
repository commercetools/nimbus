import { themeTokens } from "@nimbus/tokens";

interface BreakpointValue {
  value?: string;
  [key: string]: any;
}

interface BreakpointsTokenObject {
  [key: string]: string | BreakpointValue;
}

interface TransformedBreakpoints {
  [key: string]: string;
}

function transformBreakpoints(
  input: BreakpointsTokenObject
): TransformedBreakpoints {
  const transformed: TransformedBreakpoints = {};

  for (const key in input) {
    if ((input[key] as BreakpointValue)?.value) {
      transformed[key] = (input[key] as BreakpointValue).value!;
    } else {
      transformed[key] = input[key] as string;
    }
  }

  return transformed;
}

export const breakpoints = transformBreakpoints(themeTokens.breakpoints);

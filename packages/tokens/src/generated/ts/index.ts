import designTokens from "./design-tokens";

/**declare tokens as a const so that they are inferred as a literal type
 * allowing each token value to be displayed directly in intellisense completion
 * https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-inference*/
//@ts-ignore
const readOnlyTokens = designTokens as const;
export default readOnlyTokens;

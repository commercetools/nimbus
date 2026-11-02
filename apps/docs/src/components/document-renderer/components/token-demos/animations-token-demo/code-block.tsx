import { Box, IconButton } from "@commercetools/nimbus";
import { Check, ContentCopy } from "@commercetools/nimbus-icons";
// The same highlighter and theme as the code blocks of the MDX pages
// (base-tags/code.tsx), so that this block looks like the others on the page.
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useCopy } from "../use-copy";

/**
 * A code block with a copy button in its top right corner. The block is dark
 * in both color modes, so the button uses the colors of the dark mode. The
 * color palette is set again inside `dark`, so that its colors are the dark
 * ones: the palette of the page resolves them with the colors of the page.
 */
export const CodeBlock = ({ code }: { code: string }) => {
  const { copied, copy } = useCopy();
  return (
    <Box position="relative" fontSize="350">
      <SyntaxHighlighter
        language="tsx"
        // @ts-expect-error - the `style` property of SyntaxHighlighter specified a wrong type
        style={oneDark}
        customStyle={{ margin: 0, paddingRight: "3rem" }}
      >
        {code}
      </SyntaxHighlighter>
      <Box
        className="dark"
        colorPalette="neutral"
        position="absolute"
        top="200"
        right="200"
      >
        <IconButton
          size="xs"
          variant="ghost"
          aria-label="Copy code"
          onClick={() => copy(code)}
        >
          {copied === code ? <Check /> : <ContentCopy />}
        </IconButton>
      </Box>
    </Box>
  );
};

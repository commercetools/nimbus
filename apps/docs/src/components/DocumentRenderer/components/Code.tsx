import { Box, Code } from "@bleh-ui/react";
import { LiveCodeEditor } from "../../LiveCodeEditor/LiveCodeEditor";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

export const CodeRenderer = (props) => {
  if (props.className) {
    if (props.className.includes("-live")) {
      return <LiveCodeEditor {...props} />;
    }

    return (
      <Box display="block" p="2">
        <SyntaxHighlighter language="typescript" {...props} />
      </Box>
    );
  } else {
    return (
      <Code asChild>
        <code {...props} />
      </Code>
    );
  }
};

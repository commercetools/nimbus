import * as BlehUi from "@bleh-ui/react";
import { Flex, Box } from "@bleh-ui/react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import { themes } from "prism-react-renderer";

const baseHooks = {
  useState,
  useEffect,
  useCallback,
  useMemo,
};

// funcitons & components available to the live code editor
const scope = { ...BlehUi, ...baseHooks };

const removeImportStatements = (code) => {
  // Regular expression to match import statements
  const importRegex = /^\s*import\s.+?;?\s*$/gm;
  // Replace matched import statements with an empty string
  return code.replace(importRegex, "") + "\n" + "render(<App />);";
};

export const LiveCodeEditor = (props) => {
  const [code, setCode] = useState(props.children);
  const [activeTab, setActiveTab] = useState<"preview" | "editor">("preview");

  useEffect(() => {
    setCode(props.children);
  }, [props.children]);

  return (
    <Box fontFamily="body" mb="16">
      <Flex>
        <Box
          borderBottom="2px solid"
          borderColor={activeTab === "preview" ? "primary.9" : "transparent"}
          p="2"
        >
          <button onClick={() => setActiveTab("preview")}>Preview</button>
        </Box>
        <Box
          borderBottom="2px solid"
          borderColor={activeTab === "editor" ? "primary.9" : "transparent"}
          p="2"
        >
          <button onClick={() => setActiveTab("editor")}>Code</button>
        </Box>
      </Flex>
      <Box border="1px solid" borderColor="neutral.3">
        <LiveProvider
          transformCode={removeImportStatements}
          code={code}
          scope={scope}
          noInline
        >
          <Box
            display={activeTab === "editor" ? "block" : "none"}
            fontSize="sm"
          >
            <LiveEditor
              theme={themes.oneDark}
              onChange={(value) => setCode(value)}
            />
          </Box>

          <Box display={activeTab === "preview" ? "block" : "none"}>
            <Box p="4">
              <LivePreview />
            </Box>
          </Box>

          <LiveError />
        </LiveProvider>
      </Box>
    </Box>
  );
};

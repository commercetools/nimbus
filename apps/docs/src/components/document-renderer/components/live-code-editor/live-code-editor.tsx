import * as BlehUi from "@nimbus/react";
import * as icons from "@nimbus/icons";
import { Flex, Box } from "@nimbus/react";
import { useState, useEffect, useCallback, useMemo, ReactNode } from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import { themes } from "prism-react-renderer";

const baseHooks = {
  useState,
  useEffect,
  useCallback,
  useMemo,
};

// funcitons & components available to the live code editor
const scope = { ...BlehUi, ...baseHooks, Icons: { ...icons } };

const removeImportStatements = (code: string) => {
  // Regular expression to match import statements
  const importRegex = /^\s*import\s.+?;?\s*$/gm;
  // Replace matched import statements with an empty string
  return code.replace(importRegex, "") + "\n" + "render(<App />);";
};

type LiveCodeEditorProps = {
  children?: ReactNode;
  className?: string;
};

export const LiveCodeEditor = (props: LiveCodeEditorProps) => {
  const [code, setCode] = useState(props.children);
  const [activeTab, setActiveTab] = useState<"preview" | "editor">("preview");

  useEffect(() => {
    setCode(props.children);
  }, [props.children]);

  return (
    <Box fontFamily="body" mb="1600">
      <Flex>
        <Box
          borderBottom="solid-25"
          borderColor={activeTab === "preview" ? "primary.9" : "transparent"}
          p="200"
        >
          <button onClick={() => setActiveTab("preview")}>Preview</button>
        </Box>
        <Box
          borderBottom="solid-25"
          borderColor={activeTab === "editor" ? "primary.9" : "transparent"}
          p="200"
        >
          <button onClick={() => setActiveTab("editor")}>Code</button>
        </Box>
      </Flex>
      <Box border="solid-25" borderColor="neutral.3">
        <LiveProvider
          transformCode={removeImportStatements}
          code={typeof code === "string" ? code : ""}
          scope={scope}
          noInline
        >
          <Box
            display={activeTab === "editor" ? "block" : "none"}
            fontSize="350"
          >
            <LiveEditor
              theme={themes.oneDark}
              onChange={(value) => setCode(value)}
            />
          </Box>

          <Box display={activeTab === "preview" ? "block" : "none"}>
            <Box p="400">
              <LivePreview />
            </Box>
          </Box>

          <LiveError />
        </LiveProvider>
      </Box>
    </Box>
  );
};

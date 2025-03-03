import * as BlehUi from "@bleh-ui/react";
import * as IconLib from "@bleh-ui/icons";
import { Flex, Box, Button } from "@bleh-ui/react";
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
const scope = { ...BlehUi, ...baseHooks, Icons: { ...IconLib.icons } };
const removeImportStatements = (code: string) => {
  // Regular expression to match import statements
  const importRegex = /^\s*import\s.+?;?\s*$/gm;
  // Replace matched import statements with an empty string
  return code.replace(importRegex, "") + "\n" + "render(<App />);";
};

type LiveCodeEditorProps = {
  children?: ReactNode;
  className?: string;
  variant?: "inline";
};

export const LiveCodeEditor = (props: LiveCodeEditorProps) => {
  const [code, setCode] = useState(props.children);
  const [activeTab, setActiveTab] = useState<"preview" | "editor">("preview");

  useEffect(() => {
    setCode(props.children);
  }, [props.children]);

  return (
    <Box fontFamily="body" mb={props.variant !== "inline" && "1600"}>
      <Box border="solid-25" borderColor="neutral.3" borderRadius="100">
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
        <Box
          display="flex"
          justifyContent="flex-end"
          bg="neutral.3"
          px="400"
          py="100"
        >
          <Button
            variant="link"
            tone="primary"
            size="2xs"
            onPress={() =>
              setActiveTab(activeTab === "preview" ? "editor" : "preview")
            }
          >
            {activeTab === "preview" ? "Show code" : "Show preview"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

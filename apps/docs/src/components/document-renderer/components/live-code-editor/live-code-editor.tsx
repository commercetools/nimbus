import * as NimbusUi from "@commercetools/nimbus";
import * as icons from "@commercetools/nimbus-icons";
import {
  Box,
  Menu,
  IconButton,
  Icon,
  Tooltip,
  Tabs,
} from "@commercetools/nimbus";
import { Settings, Check } from "@commercetools/nimbus-icons";
import { useState, useEffect, useCallback, useMemo, ReactNode } from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import { themes } from "prism-react-renderer";
import {
  Time,
  CalendarDate,
  CalendarDateTime,
  ZonedDateTime,
  parseZonedDateTime,
  getLocalTimeZone,
  today,
} from "@internationalized/date";
import { useAsyncList } from "react-stately";
import { useDebouncedCallback } from "use-debounce";
import { useAtom } from "jotai";
import { defaultLiveViewAtom } from "@/atoms/default-live-view-atom";
import { defaultLiveDevViewAtom } from "@/atoms/default-live-dev-view-atom";

const baseHooks = {
  useState,
  useEffect,
  useCallback,
  useMemo,
};

// functions & components available to the live code editor
const scope = {
  ...NimbusUi,
  ...baseHooks,
  Icons: { ...icons },
  Time,
  CalendarDate,
  CalendarDateTime,
  ZonedDateTime,
  parseZonedDateTime,
  getLocalTimeZone,
  today,
  useAsyncList,
  useDebouncedCallback,
};

const removeImportStatements = (code: string) => {
  // Regular expression to match import statements
  const importRegex = /^\s*import\s.+?;?\s*$/gm;
  // Replace matched import statements with an empty string
  return code.replace(importRegex, "") + "\n" + "render(<App />);";
};

type LiveCodeEditorProps = {
  children?: ReactNode;
  className?: string;
  defaultActiveTab?: "preview" | "editor";
};

function DefaultViewMenu({
  defaultView,
  setDefaultView,
  onOpenChange,
}: {
  defaultView: "preview" | "editor";
  setDefaultView: (value: "preview" | "editor") => void;
  onOpenChange?: (isOpen: boolean) => void;
}) {
  return (
    <Menu.Root onOpenChange={onOpenChange}>
      <Tooltip.Root>
        <Menu.Trigger asChild>
          <IconButton aria-label="Editor settings" size="xs" variant="ghost">
            <Icon as={Settings} slot="icon" />
          </IconButton>
        </Menu.Trigger>
        <Tooltip.Content placement="bottom">Editor settings</Tooltip.Content>
      </Tooltip.Root>
      <Menu.Content>
        <Menu.Section label="Default View">
          <Menu.Item id="preview" onAction={() => setDefaultView("preview")}>
            <Icon
              as={Check}
              slot="icon"
              visibility={defaultView === "preview" ? "visible" : "hidden"}
            />
            Preview
          </Menu.Item>
          <Menu.Item id="editor" onAction={() => setDefaultView("editor")}>
            <Icon
              as={Check}
              slot="icon"
              visibility={defaultView === "editor" ? "visible" : "hidden"}
            />
            Code
          </Menu.Item>
        </Menu.Section>
      </Menu.Content>
    </Menu.Root>
  );
}

export const LiveCodeEditor = (props: LiveCodeEditorProps) => {
  const isDevVariant = props.className?.includes("-live-dev");
  const atom = isDevVariant ? defaultLiveDevViewAtom : defaultLiveViewAtom;
  const [defaultView, setDefaultView] = useAtom(atom);

  const [menuOpen, setMenuOpen] = useState(false);
  const [code, setCode] = useState(props.children);
  const [activeTab, setActiveTab] = useState<"preview" | "editor">(defaultView);

  useEffect(() => {
    setCode(props.children);
  }, [props.children]);

  useEffect(() => {
    setActiveTab(defaultView);
  }, [defaultView]);

  return (
    <Box mb="400" fontFamily="body" className="group" position="relative">
      <Tabs.Root
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as "preview" | "editor")}
      >
        <Tabs.List>
          <Tabs.Tab id="preview">Preview</Tabs.Tab>
          <Tabs.Tab id="editor">Code</Tabs.Tab>
        </Tabs.List>
      </Tabs.Root>
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
            fontFamily="mono"
          >
            <LiveEditor
              theme={themes.oneDark}
              onChange={(value) => setCode(value)}
            />
          </Box>
          <Box
            display={activeTab === "preview" ? "block" : "none"}
            whiteSpace="pre-wrap"
            p="400"
          >
            <LivePreview />
          </Box>
          <LiveError />
        </LiveProvider>
      </Box>
      <Box
        position="absolute"
        top="0"
        right="0"
        display="flex"
        alignItems="center"
        opacity={menuOpen ? "1" : "0"}
        transition="opacity 0.15s"
        _groupHover={{ opacity: "1" }}
      >
        <DefaultViewMenu
          defaultView={defaultView}
          setDefaultView={setDefaultView}
          onOpenChange={setMenuOpen}
        />
      </Box>
    </Box>
  );
};

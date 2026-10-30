import * as NimbusUi from "@commercetools/nimbus";
import * as icons from "@commercetools/nimbus-icons";
import { Box, Menu, IconButton, Icon, Tooltip } from "@commercetools/nimbus";
import { Settings, Check, Code as CodeIcon } from "@commercetools/nimbus-icons";
import {
  useState,
  useEffect,
  useCallback,
  useId,
  useMemo,
  ReactNode,
} from "react";
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

  const editorId = useId();
  const [menuOpen, setMenuOpen] = useState(false);
  const [code, setCode] = useState(props.children);
  // The "Default view" setting decides if the code is open when the page loads.
  const [isCodeOpen, setIsCodeOpen] = useState(defaultView === "editor");

  useEffect(() => {
    setCode(props.children);
  }, [props.children]);

  useEffect(() => {
    setIsCodeOpen(defaultView === "editor");
  }, [defaultView]);

  const toggleLabel = isCodeOpen ? "Hide code" : "Show code";

  return (
    <Box mb="400" fontFamily="body" className="group" position="relative">
      <Box
        border="solid-25"
        borderColor="neutral.6"
        borderRadius="300"
        overflow="hidden"
      >
        <LiveProvider
          transformCode={removeImportStatements}
          code={typeof code === "string" ? code : ""}
          scope={scope}
          noInline
        >
          <Box
            whiteSpace="pre-wrap"
            bg="neutral.2"
            // Keeps the preview clear of the buttons in the corner
            pl="400"
            pr="1600"
            py="400"
          >
            <LivePreview />
          </Box>
          <Box
            id={editorId}
            display="grid"
            gridTemplateRows={isCodeOpen ? "1fr" : "0fr"}
            visibility={isCodeOpen ? "visible" : "hidden"}
            transition="grid-template-rows 0.2s ease, visibility 0.2s"
            css={{
              "@media (prefers-reduced-motion: reduce)": { transition: "none" },
            }}
          >
            <Box
              minHeight="0"
              overflow="hidden"
              fontSize="350"
              fontFamily="mono"
            >
              <LiveEditor
                theme={themes.oneDark}
                onChange={(value) => setCode(value)}
              />
            </Box>
          </Box>
          <LiveError />
        </LiveProvider>
      </Box>
      <Box
        position="absolute"
        top="200"
        right="200"
        display="flex"
        alignItems="center"
        gap="100"
      >
        <Box
          opacity={menuOpen ? "1" : "0"}
          transition="opacity 0.15s"
          _groupHover={{ opacity: "1" }}
          _focusWithin={{ opacity: "1" }}
        >
          <DefaultViewMenu
            defaultView={defaultView}
            setDefaultView={setDefaultView}
            onOpenChange={setMenuOpen}
          />
        </Box>
        <Tooltip.Root>
          <IconButton
            aria-label={toggleLabel}
            aria-expanded={isCodeOpen}
            aria-controls={editorId}
            size="xs"
            variant="ghost"
            onPress={() => setIsCodeOpen((open) => !open)}
          >
            <Icon as={CodeIcon} slot="icon" />
          </IconButton>
          <Tooltip.Content placement="bottom">{toggleLabel}</Tooltip.Content>
        </Tooltip.Root>
      </Box>
    </Box>
  );
};

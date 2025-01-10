import { Box, Button, Flex, Text, useColorModeValue } from "@bleh-ui/react";
import {
  ChangeCodeMirrorLanguage,
  codeBlockPlugin,
  codeMirrorPlugin,
  ConditionalContents,
  InsertCodeBlock,
  InsertImage,
  JsxComponentDescriptor,
  linkDialogPlugin,
  ListsToggle,
  Separator,
  MDXEditor,
  MDXEditorMethods,
  type MDXEditorProps,
  tablePlugin,
  InsertTable,
  CodeToggle,
  CreateLink,
  diffSourcePlugin,
} from "@mdxeditor/editor";
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  jsxPlugin,
  linkPlugin,
  imagePlugin,
} from "@mdxeditor/editor";

import { oneDarkTheme } from "@codemirror/theme-one-dark";

import "@mdxeditor/editor/style.css";
import { useEffect, useRef, useState } from "react";
import { MdxFileFrontmatter } from "../../../types";
import { CustomEditorStyles } from "./configs/html-styles.tsx";
import { uploadImage } from "@/utils/file-upload.ts";
import { useUpdateDocument } from "@/hooks/useUpdateDocument.ts";

type MdxEditorProps = MDXEditorProps & {
  meta: MdxFileFrontmatter["meta"];
  onCloseRequest: () => void;
};

// Components that are not renderable in the editor
const unrenderables = [
  "GenericTokenTableDemo",
  "SpacingTokenDemo",
  "ColorScales",
  "SizesTokenDemo",
  "SpacingTokenDemo",
  "PropTable",
  "PropTables",
  "IconSearch",
];

const getCustomComponentPlaceholders: () => JsxComponentDescriptor[] = () =>
  unrenderables.map((ComponentName) => {
    return {
      name: ComponentName,
      kind: "flow",
      props: [],

      hasChildren: true,
      Editor: () => {
        return (
          <Box bg="neutral.3" p="400" my="400">
            <Text fontWeight="600">{`<${ComponentName}/>`}</Text>
            <Text>This block can only be edited in source code</Text>
          </Box>
        );
      },
    };
  });

export const MdxEditor = ({
  markdown,
  onCloseRequest,
  ...props
}: MdxEditorProps) => {
  const { updateMdx, isLoading } = useUpdateDocument();
  const [markdownStr, setMarkdownStr] = useState(markdown);
  const codeBlockTheme = useColorModeValue([], [oneDarkTheme]);

  const ref = useRef<MDXEditorMethods>(null);

  useEffect(() => {
    ref.current?.setMarkdown(markdown);
    setMarkdownStr(markdown);
  }, [markdown]);

  const plugins = [
    listsPlugin(),
    jsxPlugin({ jsxComponentDescriptors: getCustomComponentPlaceholders() }),
    headingsPlugin(),
    quotePlugin(),
    tablePlugin(),
    linkPlugin(),
    listsPlugin(),
    diffSourcePlugin(),
    linkDialogPlugin(),
    imagePlugin({
      imageUploadHandler: async (file) => {
        const { url } = await uploadImage(file);
        return url;
      },
    }),
    thematicBreakPlugin(),
    markdownShortcutPlugin(),
    codeBlockPlugin({ defaultCodeBlockLanguage: "jsx" }),
    codeMirrorPlugin({
      codeBlockLanguages: {
        bash: "Bash",
        css: "CSS",
        js: "JavaScript",
        jsx: "Jsx",
        "jsx-live": "Jsx (Live)",
        markdown: "Markdown",
      },
      codeMirrorExtensions: [...codeBlockTheme],
    }),
    toolbarPlugin({
      toolbarClassName: "toolbar",
      toolbarContents: () => (
        <Flex>
          <UndoRedo />
          <Separator />
          <BlockTypeSelect />
          <Separator />
          <BoldItalicUnderlineToggles />
          <Separator />
          <ListsToggle />
          <Separator />
          <CreateLink />
          <CodeToggle />
          <Separator />
          <ConditionalContents
            options={[
              {
                when: (editor) => editor?.editorType === "codeblock",
                contents: () => <ChangeCodeMirrorLanguage />,
              },
              {
                fallback: () => (
                  <>
                    <InsertCodeBlock />
                  </>
                ),
              },
            ]}
          />
          <InsertImage />
          <InsertTable />
        </Flex>
      ),
    }),
  ];

  const onMarkdownChange = (str: string) => {
    setMarkdownStr(str);
  };

  const onSaveRequest = async () => {
    await updateMdx(markdownStr);
    alert("Document saved.");
  };

  return (
    <Box position="relative" marginLeft="-12px" marginRight="-3.5">
      <Box mb="4">
        <CustomEditorStyles>
          <MDXEditor
            ref={ref}
            markdown={markdown}
            plugins={plugins}
            onChange={onMarkdownChange}
            {...props}
          />
        </CustomEditorStyles>
      </Box>
      <Flex gap="4" borderTop="1px solid" borderTopColor="neutral.6" py="4">
        <Button
          colorPalette="primary"
          minWidth="3200"
          variant="solid"
          onClick={() => onSaveRequest()}
        >
          Save
        </Button>
        <Button
          colorPalette="neutral"
          variant="subtle"
          minWidth="3200"
          onClick={() => onCloseRequest()}
        >
          Cancel
        </Button>
      </Flex>
      {isLoading && (
        <Box
          position="absolute"
          bg="bg/90"
          inset="0"
          p="8"
          zIndex="2"
          fontWeight="semibold"
        >
          Saving...
        </Box>
      )}
    </Box>
  );
};

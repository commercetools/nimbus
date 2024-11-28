import { Box, Button, Flex, Text, toaster } from "@bleh-ui/react";
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

import "@mdxeditor/editor/style.css";
import { useEffect, useRef, useState } from "react";
import { MdxFileFrontmatter } from "../../types";
import axios from "axios";
import { CustomEditorStyles } from "./configs/html-styles";

type MdxEditorProps = MDXEditorProps & {
  meta: MdxFileFrontmatter["meta"];
  onCloseRequest: () => void;
};

function getFrontmatter(fileContent: string) {
  const frontmatterMatch = fileContent.match(/^---\n([\s\S]*?)\n---/);
  return frontmatterMatch ? frontmatterMatch[0] : null;
}

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
          <Box bg="neutral.3" p="4" my="4">
            <Text fontWeight="semibold">{`<${ComponentName}/>`}</Text>
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
  const [markdownStr, setMarkdownStr] = useState(markdown);
  const [isSaving, setIsSaving] = useState(false);
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
    imagePlugin(),
    thematicBreakPlugin(),
    markdownShortcutPlugin(),
    codeBlockPlugin({ defaultCodeBlockLanguage: "jsx" }),
    codeMirrorPlugin({
      codeBlockLanguages: {
        js: "JavaScript",
        jsx: "Jsx",
        "jsx-live": "Jsx (Live)",
        markdown: "Markdown",
      },
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
    const { filePath } = props.meta;

    setIsSaving(true);

    const { data } = await axios({
      method: "GET",
      url: "/api/fs",
      params: { filePath },
    });

    const frontMatterString = getFrontmatter(data.content);
    const updatedContent = `${frontMatterString}\n${markdownStr}`;

    await axios({
      method: "PUT",
      url: "/api/fs",
      data: {
        filePath,
        content: updatedContent,
      },
    });

    toaster.create({
      title: "Document saved",
      type: "success",
      duration: 3000,
    });
    setTimeout(() => {
      setIsSaving(false);
      onCloseRequest();
    }, 1000);
  };

  return (
    <Box position="relative" marginLeft="-4" marginRight="-4">
      <Box mb="4" borderRadius="sm">
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
          minWidth="32"
          variant="solid"
          onClick={() => onSaveRequest()}
        >
          Save
        </Button>
        <Button
          colorPalette="neutral"
          variant="subtle"
          minWidth="32"
          onClick={() => onCloseRequest()}
        >
          Cancel
        </Button>
      </Flex>
      {isSaving && (
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

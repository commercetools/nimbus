import { type ReactElement } from "react";
import {
  Editor,
  Transforms,
  Element as SlateElement,
  Text as SlateText,
  Range,
  type Location,
  type Editor as SlateEditor,
} from "slate";
import {
  ReactEditor,
  type RenderElementProps,
  type RenderLeafProps,
} from "slate-react";
// @ts-ignore - is-url package doesn't have proper types
import isUrl from "is-url";
import { BLOCK_TAGS } from "./constants";
import type { CustomElement, CustomText, ElementFormat } from "./types";

const LIST_TYPES = ["bulleted-list", "numbered-list"];

// Check if a mark is currently active
export const isMarkActive = (editor: SlateEditor, format: string): boolean => {
  const marks = Editor.marks(editor);
  return marks ? marks[format as keyof CustomText] === true : false;
};

// Check if a block type is currently active
export const isBlockActive = (
  editor: SlateEditor,
  format: ElementFormat
): boolean => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    })
  );

  return !!match;
};

// Toggle a text mark (bold, italic, etc.)
export const toggleMark = (editor: SlateEditor, format: string): void => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

// Toggle a block type (heading, list, etc.)
export const toggleBlock = (
  editor: SlateEditor,
  format: ElementFormat
): void => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type),
    split: true,
  });

  let newProperties: Partial<CustomElement>;
  if (isActive) {
    newProperties = { type: "paragraph" };
  } else if (isList) {
    newProperties = { type: "list-item" };
  } else {
    newProperties = { type: format };
  }

  Transforms.setNodes<CustomElement>(editor, newProperties);

  if (!isActive && isList) {
    const block: CustomElement = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

// Focus the editor
export const focusEditor = (editor: SlateEditor): void => {
  ReactEditor.focus(editor);
};

// Reset the editor to a specific value
export const resetEditor = (editor: SlateEditor, value: string): void => {
  const { fromHTML } = require("./html-serialization");
  const newValue = fromHTML(value);

  // Clear current content
  Transforms.delete(editor, {
    at: {
      anchor: Editor.start(editor, []),
      focus: Editor.end(editor, []),
    },
  });

  // Insert new content
  Transforms.insertNodes(editor, newValue);

  // Focus at the start
  Transforms.select(editor, Editor.start(editor, []));
};

// Validate and normalize Slate state
export const validSlateStateAdapter = (value: any): CustomElement[] => {
  if (!Array.isArray(value)) {
    return [{ type: "paragraph", children: [{ text: "" }] }] as CustomElement[];
  }

  if (value.length === 0) {
    return [{ type: "paragraph", children: [{ text: "" }] }] as CustomElement[];
  }

  return value.map((node) => {
    if (!SlateElement.isElement(node)) {
      return {
        type: "paragraph",
        children: [{ text: String(node) }],
      } as CustomElement;
    }

    if (!node.children || node.children.length === 0) {
      return { ...node, children: [{ text: "" }] } as CustomElement;
    }

    return node as CustomElement;
  });
};

// Link plugin
export const withLinks = (editor: SlateEditor): SlateEditor => {
  const { insertData, insertText, isInline } = editor;

  editor.isInline = (element) => {
    return element.type === "link" ? true : isInline(element);
  };

  editor.insertText = (text) => {
    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertText(text);
    }
  };

  editor.insertData = (data) => {
    const text = data.getData("text/plain");

    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

const unwrapLink = (editor: SlateEditor): void => {
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
  });
};

const wrapLink = (editor: SlateEditor, url: string): void => {
  if (isBlockActive(editor, "link")) {
    unwrapLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const link: CustomElement = {
    type: "link",
    url,
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: "end" });
  }
};

// Render element component
export const Element = ({
  attributes,
  children,
  element,
}: RenderElementProps): ReactElement => {
  const style = { textAlign: element.align } as React.CSSProperties;

  switch (element.type) {
    case "block-quote":
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      );
    case "bulleted-list":
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      );
    case "heading-one":
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      );
    case "heading-three":
      return (
        <h3 style={style} {...attributes}>
          {children}
        </h3>
      );
    case "heading-four":
      return (
        <h4 style={style} {...attributes}>
          {children}
        </h4>
      );
    case "heading-five":
      return (
        <h5 style={style} {...attributes}>
          {children}
        </h5>
      );
    case "list-item":
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case "numbered-list":
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      );
    case "link":
      return (
        <a
          {...attributes}
          href={element.url}
          rel="noopener noreferrer"
          style={style}
        >
          {children}
        </a>
      );
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

// Render leaf component
export const Leaf = ({
  attributes,
  children,
  leaf,
}: RenderLeafProps): ReactElement => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  if (leaf.strikethrough) {
    children = <del>{children}</del>;
  }

  if (leaf.superscript) {
    children = <sup>{children}</sup>;
  }

  if (leaf.subscript) {
    children = <sub>{children}</sub>;
  }

  return <span {...attributes}>{children}</span>;
};

// Soft line break handling
export const Softbreaker = {
  placeholderCharacter: "\u200B\n",
  serialize: (string: string): string =>
    string.replace(new RegExp(Softbreaker.placeholderCharacter, "g"), "<br>"),
  deserialize: (string: string): string =>
    string.replace(/<br\s*\/?>/gi, Softbreaker.placeholderCharacter),
};

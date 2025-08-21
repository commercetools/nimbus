import escapeHtml from "escape-html";
import {
  Text,
  Element as SlateElement,
  type Descendant,
  type Node as SlateNode,
} from "slate";
import { BLOCK_TAGS, MARK_TAGS } from "./constants";
import type { CustomElement, CustomText } from "./types";
import { validSlateStateAdapter } from "./slate-helpers";

// Soft line break placeholder character
const SOFT_BREAK_PLACEHOLDER = "\u200B\n";

// Default empty state for the editor
export const createEmptyValue = (): Descendant[] => [
  {
    type: "paragraph",
    children: [{ text: "" }],
  } as CustomElement,
];

// Serialize Slate value to HTML
export const toHTML = (value: Descendant[]): string => {
  return value.map(serializeNode).join("");
};

const serializeNode = (node: SlateNode): string => {
  if (Text.isText(node)) {
    const textNode = node as CustomText;
    let string = escapeHtml(textNode.text);

    // Apply text formatting
    if (textNode.bold) {
      string = `<strong>${string}</strong>`;
    }
    if (textNode.code) {
      string = `<code>${string}</code>`;
    }
    if (textNode.italic) {
      string = `<em>${string}</em>`;
    }
    if (textNode.underline) {
      string = `<u>${string}</u>`;
    }
    if (textNode.superscript) {
      string = `<sup>${string}</sup>`;
    }
    if (textNode.subscript) {
      string = `<sub>${string}</sub>`;
    }
    if (textNode.strikethrough) {
      string = `<del>${string}</del>`;
    }

    // Replace soft line breaks with <br> tags
    string = string.replace(new RegExp(SOFT_BREAK_PLACEHOLDER, "g"), "<br>");

    return string;
  }

  const children = node.children.map(serializeNode).join("");
  const element = node as CustomElement;

  switch (element.type) {
    case "block-quote":
      return `<blockquote>${children}</blockquote>`;
    case "paragraph":
      return `<p>${children}</p>`;
    case "code":
      return `<pre><code>${children}</code></pre>`;
    case "bulleted-list":
      return `<ul>${children}</ul>`;
    case "numbered-list":
      return `<ol>${children}</ol>`;
    case "list-item":
      return `<li>${children}</li>`;
    case "heading-one":
      return `<h1>${children}</h1>`;
    case "heading-two":
      return `<h2>${children}</h2>`;
    case "heading-three":
      return `<h3>${children}</h3>`;
    case "heading-four":
      return `<h4>${children}</h4>`;
    case "heading-five":
      return `<h5>${children}</h5>`;
    case "link": {
      let hrefAttr = "";
      if (element.url) {
        // Sanitize href to prevent XSS
        const sanitizedUrl = sanitizeUrl(element.url);
        hrefAttr = ` href="${escapeHtml(sanitizedUrl)}"`;
      }

      let otherAttrsString = "";
      if (
        element.htmlAttributes &&
        typeof element.htmlAttributes === "object"
      ) {
        for (const [key, value] of Object.entries(element.htmlAttributes)) {
          // Filter out event handlers to prevent XSS
          if (!key.toLowerCase().startsWith("on")) {
            otherAttrsString += ` ${escapeHtml(key)}="${escapeHtml(String(value))}"`;
          }
        }
      }

      return `<a${hrefAttr}${otherAttrsString}>${children}</a>`;
    }
    default:
      return children;
  }
};

// Parse HTML string to Slate value
export const fromHTML = (html: string): Descendant[] => {
  if (!html || html.trim() === "") {
    return createEmptyValue();
  }

  try {
    // Simple HTML parsing - for now just handle basic cases
    if (
      html.includes("<p>") ||
      html.includes("<h") ||
      html.includes("<div>") ||
      html.includes("<blockquote>") ||
      html.includes("<ul>") ||
      html.includes("<ol>")
    ) {
      const document = new DOMParser().parseFromString(html, "text/html");
      const body = document.body;

      const nodes = Array.from(body.childNodes)
        .map(deserializeNode)
        .filter(Boolean) as Descendant[];

      // Use validSlateStateAdapter to ensure all nodes are valid Slate elements
      return validSlateStateAdapter(nodes);
    } else {
      // Simple text content
      return [
        {
          type: "paragraph",
          children: [{ text: html }],
        } as CustomElement,
      ];
    }
  } catch (error) {
    console.warn("Failed to parse HTML:", error);
    return createEmptyValue();
  }
};

const deserializeNode = (node: Node): Descendant | string | null => {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent || "";
    // Replace <br> tags with soft line breaks
    return text.replace(/<br\s*\/?>/gi, SOFT_BREAK_PLACEHOLDER);
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const element = node as Element;
  const tagName = element.tagName.toLowerCase();
  const children = Array.from(element.childNodes)
    .map(deserializeNode)
    .filter(Boolean);

  // Handle block elements
  if (tagName in BLOCK_TAGS) {
    const type = BLOCK_TAGS[tagName as keyof typeof BLOCK_TAGS];
    const slateElement: CustomElement = { type, children: [] };

    // Special handling for links
    if (type === "link") {
      const href = element.getAttribute("href");
      if (href) {
        slateElement.url = href;
      }

      // Store other attributes
      const attrs: Record<string, string> = {};
      Array.from(element.attributes).forEach((attr) => {
        if (attr.name !== "href" && !attr.name.toLowerCase().startsWith("on")) {
          attrs[attr.name] = attr.value;
        }
      });
      if (Object.keys(attrs).length > 0) {
        slateElement.htmlAttributes = attrs;
      }
    }

    // Process children
    slateElement.children = processChildren(children);
    return slateElement;
  }

  // Handle inline/mark elements - simplified without jsx
  if (tagName in MARK_TAGS) {
    const markType = MARK_TAGS[tagName as keyof typeof MARK_TAGS];
    const textContent = extractTextFromChildren(children);
    return { text: textContent, [markType]: true } as CustomText;
  }

  // Handle spans and other inline elements
  if (tagName === "span") {
    const textContent = extractTextFromChildren(children);
    return { text: textContent } as CustomText;
  }

  // For unknown elements, just return their text content
  const textContent = extractTextFromChildren(children);
  return { text: textContent } as CustomText;
};

const processChildren = (
  children: (Descendant | string | null)[]
): (CustomText | CustomElement)[] => {
  const processed: (CustomText | CustomElement)[] = [];

  for (const child of children) {
    if (typeof child === "string") {
      if (child.trim()) {
        processed.push({ text: child });
      }
    } else if (child && Text.isText(child)) {
      processed.push(child as CustomText);
    } else if (child && SlateElement.isElement(child)) {
      // Keep block elements (like li) as elements
      processed.push(child as CustomElement);
    }
  }

  // For list containers, ensure we have valid children
  // For other containers, ensure we always have at least one text node
  if (processed.length === 0) {
    processed.push({ text: "" });
  }

  return processed;
};

const extractTextContent = (element: SlateElement): string => {
  return element.children
    .map((child) => {
      if (Text.isText(child)) {
        return child.text;
      } else if (SlateElement.isElement(child)) {
        return extractTextContent(child);
      }
      return "";
    })
    .join("");
};

const extractTextFromChildren = (
  children: (Descendant | string | null)[]
): string => {
  return children
    .filter(Boolean)
    .map((child) => {
      if (typeof child === "string") {
        return child;
      } else if (child && typeof child === "object" && "text" in child) {
        return child.text;
      } else if (child && typeof child === "object" && "children" in child) {
        return extractTextContent(child as SlateElement);
      }
      return String(child || "");
    })
    .join("");
};

const sanitizeUrl = (url: string): string => {
  const trimmed = String(url).trim().toLowerCase();
  if (
    trimmed.startsWith("javascript:") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("vbscript:")
  ) {
    return "#";
  }
  return String(url);
};

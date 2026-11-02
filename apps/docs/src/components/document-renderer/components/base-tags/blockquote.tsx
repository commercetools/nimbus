import {
  BlockquoteHTMLAttributes,
  Children,
  DetailedHTMLProps,
  ElementType,
  ReactElement,
  ReactNode,
  cloneElement,
  isValidElement,
} from "react";
import { Alert } from "@commercetools/nimbus";
import {
  Campaign,
  CheckCircleOutline,
  ErrorOutline,
  Info,
  WarningAmber,
} from "@commercetools/nimbus-icons";
import { ListItem, UlList } from "./index";
import { Paragraph } from "./index";

/** Maps a GitHub-flavored quote marker to the Alert color palette. */
const flavorPalette = {
  "[!NOTE]": "info",
  "[!TIP]": "positive",
  "[!IMPORTANT]": "primary",
  "[!WARNING]": "warning",
  "[!CAUTION]": "critical",
} as const;

type QuoteMarker = keyof typeof flavorPalette;

/** Default title shown for each GitHub-flavored quote. */
const flavorTitle: Record<QuoteMarker, string> = {
  "[!NOTE]": "Note",
  "[!TIP]": "Tip",
  "[!IMPORTANT]": "Important",
  "[!WARNING]": "Warning",
  "[!CAUTION]": "Caution",
};

/** Same icons as the Alert uses for each palette by default. */
const flavorIcon: Record<QuoteMarker, ReactNode> = {
  "[!NOTE]": <Info />,
  "[!TIP]": <CheckCircleOutline />,
  "[!IMPORTANT]": <Campaign />,
  "[!WARNING]": <WarningAmber />,
  "[!CAUTION]": <ErrorOutline />,
};

const isQuoteMarker = (value: string): value is QuoteMarker =>
  value in flavorPalette;

const findLastIndex = (children: ReactNode, component: ElementType) => {
  const childrenArray = Children.toArray(children);

  for (let i = childrenArray.length - 1; i >= 0; i--) {
    const child = childrenArray[i];
    if (isValidElement(child) && child.type === component) {
      return i;
    }
  }

  return -1;
};

const countChildrenByDisplayName = (
  children: ReactNode,
  component: ElementType
) =>
  Children.toArray(children).filter(
    (child) => isValidElement(child) && child.type === component
  ).length;

/** Returns the quote marker at the start of a paragraph, if there is one. */
const getMarker = (child: ReactNode): QuoteMarker | undefined => {
  if (!isValidElement(child) || child.type !== Paragraph) return undefined;

  const firstChild = (child as ReactElement<{ children?: ReactNode[] }>).props
    .children?.[0];
  if (typeof firstChild !== "string") return undefined;

  const marker = firstChild.trim();
  return isQuoteMarker(marker) ? marker : undefined;
};

type BlockquoteProps = DetailedHTMLProps<
  BlockquoteHTMLAttributes<HTMLQuoteElement>,
  HTMLQuoteElement
>;

export const Blockquote = (props: BlockquoteProps) => {
  const { children } = props;

  const lastListElementIndex = findLastIndex(children, UlList);

  const marker = Children.toArray(children)
    .map(getMarker)
    .find((value) => value !== undefined);

  return (
    <Alert.Root
      variant="accent-start"
      colorPalette={marker ? flavorPalette[marker] : "neutral"}
      hideIcon={!marker}
      mb="400"
    >
      {marker && (
        // Same icons as the Alert default, a bit larger (default is 1.25em).
        <Alert.Icon css={{ "& svg": { width: "1.5em", height: "1.5em" } }}>
          {flavorIcon[marker]}
        </Alert.Icon>
      )}
      {marker && <Alert.Title>{flavorTitle[marker]}</Alert.Title>}
      <Alert.Description
        as="div"
        css={{
          // Paragraph sets its own font size and line height. Inherit the
          // Alert's, so the text lines up with the icon and the title.
          "& > p": { fontSize: "inherit", lineHeight: "inherit", mb: "200" },
          "& > :last-child": { mb: "0" },
        }}
      >
        {Children.map(children, (child, idx) => {
          if (getMarker(child)) {
            // Remove the marker and the line break that follows it.
            const paragraph = child as ReactElement<{
              children: ReactNode[];
            }>;
            return cloneElement(paragraph, {
              children: Children.toArray(paragraph.props.children.slice(2)),
            });
          }

          // Drop a trailing list that has no list items.
          if (
            isValidElement(child) &&
            child.type === UlList &&
            lastListElementIndex === idx &&
            countChildrenByDisplayName(
              (child as ReactElement<{ children: ReactNode }>).props.children,
              ListItem
            ) < 1
          ) {
            return null;
          }

          return child;
        })}
      </Alert.Description>
    </Alert.Root>
  );
};

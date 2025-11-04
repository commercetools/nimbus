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
import { Box } from "@commercetools/nimbus";
import {
  Description,
  Lightbulb,
  Star,
  Warning,
  Error,
} from "@commercetools/nimbus-icons";
import { ListItem, UlList } from "./index";
import { Paragraph } from "./index";

const findLastIndex = (children: ReactNode, component: ElementType) => {
  // Convert React children to an array
  const childrenArray = Children.toArray(children);

  // Iterate from the last child to the first
  for (let i = childrenArray.length - 1; i >= 0; i--) {
    const child = childrenArray[i];

    // Check if the child is a React element and has the displayName "UlList"
    if (isValidElement(child) && child.type === component) {
      return i;
    }
  }

  // Return -1 if no matching element is found
  return -1;
};

const iconMapping = {
  NOTE: Description,
  TIP: Lightbulb,
  IMPORTANT: Star,
  WARNING: Warning,
  CAUTION: Error,
};
function cleanQuoteFlavor(input: string) {
  // Remove the brackets and exclamation mark
  const cleanKey = input.replace(/[[\]!]/g, "") as keyof typeof iconMapping;
  const Component = iconMapping[cleanKey];
  return <Component size="1em" />;
}

const countChildrenByDisplayName = (
  children: ReactNode,
  component: ElementType
) => {
  // Convert React children to an array
  const childrenArray = Children.toArray(children);

  // Filter the array to count only elements with the given displayName
  return childrenArray.filter(
    (child) => isValidElement(child) && child.type === component
  ).length;
};

type BlockquoteProps = DetailedHTMLProps<
  BlockquoteHTMLAttributes<HTMLQuoteElement>,
  HTMLQuoteElement
>;

export const Blockquote = (props: BlockquoteProps) => {
  const { children } = props;

  const lastListElementIndex = findLastIndex(children, UlList);

  const quoteFlavorProps = (() => {
    let flavorProps = {};

    Children.map(children, (child) => {
      const isParagraph = isValidElement(child) && child.type === Paragraph;
      if (!isParagraph) return;

      const firstChild = child.props.children[0];

      switch (true) {
        case firstChild.trim() === "[!NOTE]":
          flavorProps = {
            colorPalette: "info",
          };
          break;
        case firstChild.trim() === "[!TIP]":
          flavorProps = {
            colorPalette: "positive",
          };
          break;
        case firstChild.trim() === "[!IMPORTANT]":
          flavorProps = {
            colorPalette: "primary",
          };
          break;
        case firstChild.trim() === "[!WARNING]":
          flavorProps = {
            colorPalette: "warning",
          };
          break;
        case firstChild.trim() === "[!CAUTION]":
          flavorProps = {
            colorPalette: "critical",
          };
          break;
        default:
          return null;
      }
    });

    return flavorProps;
  })();

  return (
    <Box
      as="blockquote"
      borderLeft="solid-75"
      py="50"
      px="400"
      mb="400"
      borderColor="colorPalette.9"
      bg="colorPalette.2"
      color="colorPalette.11"
      css={{
        "& > p": {
          mt: "400",
        },
      }}
      {...quoteFlavorProps}
    >
      {Children.map(children, (child, idx) => {
        const isLastList = lastListElementIndex === idx;
        const isParagraph = isValidElement(child) && child.type === Paragraph;

        if (isParagraph) {
          const firstChild = child.props.children[0];

          if (
            [
              "[!NOTE]",
              "[!IMPORTANT]",
              "[!WARNING]",
              "[!CAUTION]",
              "[!TIP]",
            ].includes(firstChild.trim())
          ) {
            // Get rid of first child

            return cloneElement(child as ReactElement, {
              children: [
                <Box
                  key="blockquote-flavor-icon"
                  position="relative"
                  top="-50"
                  mr="100"
                  verticalAlign="middle"
                  display="inline-block"
                  fontSize="500"
                  asChild
                >
                  {cleanQuoteFlavor(firstChild.trim())}
                </Box>,
                ...Children.toArray(child.props.children.slice(2)),
              ],
              mt: "400",
              //mb: "200",
            });
          }

          return child;
        }

        // Check if the child is a React element and if its type is 'kbd'
        if (isValidElement(child) && child.type === UlList && isLastList) {
          const listItemCount = countChildrenByDisplayName(
            child.props.children,
            ListItem
          );

          if (listItemCount >= 1) {
            return child;
          }

          return null;
        }

        // Otherwise, return the child unchanged
        return child;
      })}
    </Box>
  );
};

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
import { Blockquote as StyledBlockquote, Box } from "@bleh-ui/react";
import {
  FileText,
  Lightbulb,
  Star,
  AlertOctagon,
  ShieldAlert,
} from "@bleh-ui/icons";
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
  NOTE: FileText,
  TIP: Lightbulb,
  IMPORTANT: Star,
  WARNING: AlertOctagon,
  CAUTION: ShieldAlert,
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

const findCiteInBlockquote = (
  children: ReactNode,
  lastListElementIndex: number
) => {
  // Iterate over the children using React.Children.map
  return Children.map(children, (child, idx) => {
    const isLastList = lastListElementIndex === idx;

    // Check if the child is a valid React element and has the displayName 'UlList'
    if (isValidElement(child) && child.type === UlList && isLastList) {
      const listItemCount = countChildrenByDisplayName(
        child.props.children,
        ListItem
      );

      // Return the child if it has more than one 'ListItem' child
      if (listItemCount === 1) {
        const listItemChild = Children.map(
          child.props.children,
          (child) => child
        ).find((c: ReactElement) => c.type === ListItem);

        return listItemChild.props.children;
      } else {
        return null;
      }
    }

    // Return null in all other cases
    return null;
  });
};

type BlockquoteProps = DetailedHTMLProps<
  BlockquoteHTMLAttributes<HTMLQuoteElement>,
  HTMLQuoteElement
>;

export const Blockquote = (props: BlockquoteProps) => {
  const { children } = props;

  const lastListElementIndex = findLastIndex(children, UlList);
  const cite = findCiteInBlockquote(children, lastListElementIndex);

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
            colorPalette: "success",
          };
          break;
        case firstChild.trim() === "[!IMPORTANT]":
          flavorProps = {
            colorPalette: "primary",
          };
          break;
        case firstChild.trim() === "[!WARNING]":
          flavorProps = {
            colorPalette: "danger",
          };
          break;
        case firstChild.trim() === "[!CAUTION]":
          flavorProps = {
            colorPalette: "error",
          };
          break;
        default:
          return null;
      }
    });

    return flavorProps;
  })();

  return (
    <StyledBlockquote
      showDash={!!(cite && cite?.length > 0)}
      cite={cite}
      my="3"
      borderColor="colorPalette.9"
      bg="colorPalette.2"
      color="colorPalette.11"
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
                  position="relative"
                  top="-0.5"
                  mr="1"
                  display="inline-block"
                  fontSize="xl"
                  asChild
                >
                  {cleanQuoteFlavor(firstChild.trim())}
                </Box>,
                ...child.props.children.slice(2),
              ],
              mt: "4",
              mb: "2",
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

          if (listItemCount > 1) {
            return child;
          }

          return null;
        }

        // Otherwise, return the child unchanged
        return child;
      })}
    </StyledBlockquote>
  );
};

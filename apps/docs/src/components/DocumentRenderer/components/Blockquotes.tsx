import { Children, ReactElement, cloneElement, isValidElement } from "react";
import { Text, Blockquote } from "@bleh-ui/react";

const findLastIndex = (children: ReactElement[], displayName: string) => {
  // Convert React children to an array
  const childrenArray = Children.toArray(children);

  // Iterate from the last child to the first
  for (let i = childrenArray.length - 1; i >= 0; i--) {
    const child = childrenArray[i];

    // Check if the child is a React element and has the displayName "UlList"
    if (isValidElement(child) && child.type?.displayName === displayName) {
      return i;
    }
  }

  // Return -1 if no matching element is found
  return -1;
};

function cleanQuoteFlavor(input: string) {
  // Remove the brackets and exclamation mark
  return input.replace(/[!\[\]]/g, "");
}

const countChildrenByDisplayName = (children, displayName) => {
  // Convert React children to an array
  const childrenArray = Children.toArray(children);

  // Filter the array to count only elements with the given displayName
  return childrenArray.filter(
    (child) => isValidElement(child) && child.type?.displayName === displayName
  ).length;
};

const findCiteInBlockquote = (children, lastListElementIndex) => {
  // Iterate over the children using React.Children.map
  return Children.map(children, (child, idx) => {
    const isLastList = lastListElementIndex === idx;

    // Check if the child is a valid React element and has the displayName 'UlList'
    if (
      isValidElement(child) &&
      child.type?.displayName === "UlList" &&
      isLastList
    ) {
      const listItemCount = countChildrenByDisplayName(
        child.props.children,
        "ListItem"
      );

      // Return the child if it has more than one 'ListItem' child
      if (listItemCount === 1) {
        const listItemChild = Children.map(
          child.props.children,
          (child) => child
        ).find((c) => c.type?.displayName === "ListItem");

        return listItemChild.props.children;
      } else {
        return null;
      }
    }

    // Return null in all other cases
    return null;
  });
};

export const BlockquoteRenderer = (props) => {
  const { children, ...rest } = props;

  const lastListElementIndex = findLastIndex(children, "UlList");
  const cite = findCiteInBlockquote(children, lastListElementIndex);

  const quoteFlavorProps = (() => {
    let flavorProps = {};

    Children.map(children, (child) => {
      const isParagraph = child.type?.displayName === "Paragraph";
      if (!isParagraph) return;

      const firstChild = child.props.children[0];

      switch (true) {
        case firstChild.trim() === "[!NOTE]":
          flavorProps = {
            borderColor: "info.9",
            bg: "info.2",
            color: "info.12",
          };
          break;
        case firstChild.trim() === "[!TIP]":
          flavorProps = {
            borderColor: "success.9",
            bg: "success.2",
            color: "success.12",
          };
          break;
        case firstChild.trim() === "[!IMPORTANT]":
          flavorProps = {
            borderColor: "primary.9",
            bg: "primary.2",
            color: "primary.12",
          };
          break;
        case firstChild.trim() === "[!WARNING]":
          flavorProps = {
            borderColor: "danger.9",
            bg: "danger.2",
            color: "danger.12",
          };
          break;
        case firstChild.trim() === "[!CAUTION]":
          flavorProps = {
            borderColor: "error.9",
            bg: "error.2",
            color: "error.12",
          };
          break;
        default:
          return null;
      }
    });

    return flavorProps;
  })();

  return (
    <Blockquote
      showDash={cite?.length > 0}
      cite={cite}
      maxWidth="prose"
      my="3"
      {...quoteFlavorProps}
      {...rest}
    >
      {Children.map(children, (child, idx) => {
        const isLastList = lastListElementIndex === idx;
        const isParagraph = child.type?.displayName === "Paragraph";

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

            return cloneElement(child, {
              children: [
                <Text display="block" asChild fontWeight="bold">
                  <span>{cleanQuoteFlavor(firstChild.trim())}</span>
                </Text>,
                ...child.props.children.slice(2),
              ],
              mt: "4",
              mb: "2",
            });
          }

          return child;
        }

        // Check if the child is a React element and if its type is 'kbd'
        if (
          isValidElement(child) &&
          child.type?.displayName === "UlList" &&
          isLastList
        ) {
          const listItemCount = countChildrenByDisplayName(
            child.props.children,
            "ListItem"
          );

          if (listItemCount > 1) {
            return child;
          }

          return null;
        }

        // Otherwise, return the child unchanged
        return child;
      })}
    </Blockquote>
  );
};

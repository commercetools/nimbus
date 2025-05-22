import { Box as ChakraBox, type HTMLChakraProps } from "@chakra-ui/react";

export interface BoxProps extends HTMLChakraProps<"div"> {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}

export const Box = (props: BoxProps) => {
  const { ref, ...restProps } = props;
  return <ChakraBox ref={ref} {...restProps} />;
};

Box.displayName = "Box";

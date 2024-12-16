import { Text } from "@bleh-ui/react";
import { DetailedHTMLProps, HTMLAttributes } from "react";

type StrongProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;

export const Strong = (props: StrongProps) => (
  <Text fontWeight="bold" asChild>
    <strong {...props} />
  </Text>
);

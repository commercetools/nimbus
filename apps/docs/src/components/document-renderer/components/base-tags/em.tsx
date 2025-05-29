import { Text, type TextProps } from "@commercetools/nimbus";

export const Em = (props: TextProps) => (
  <Text fontStyle="italic" as="em" {...props} />
);

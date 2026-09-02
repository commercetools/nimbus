import { Text } from "@commercetools/nimbus";

interface AiDotProps {
  /** Font size token or CSS value. Default "8px". */
  size?: string;
}

/** Tiny ✦ star used as an inline AI provenance marker. */
export const AiDot = ({ size = "12px" }: AiDotProps) => (
  <Text
    as="span"
    fontSize={size}
    lineHeight="1"
    color="indigo.9"
    flexShrink={0}
    aria-hidden="true"
  >
    ✦
  </Text>
);

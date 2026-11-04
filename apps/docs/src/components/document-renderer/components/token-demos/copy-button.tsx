import { IconButton } from "@commercetools/nimbus";
import { Check, ContentCopy } from "@commercetools/nimbus-icons";

type CopyButtonProps = {
  /** The token name to copy. */
  token: string;
  /** The last copied text, from `useCopy`. */
  copied: string | null;
  onCopy: (token: string) => void;
};

/** A button that copies a token name and shows a check mark for a moment. */
export const CopyButton = ({ token, copied, onCopy }: CopyButtonProps) => (
  <IconButton
    size="2xs"
    variant="ghost"
    aria-label={`Copy token ${token}`}
    onClick={() => onCopy(token)}
  >
    {copied === token ? <Check /> : <ContentCopy />}
  </IconButton>
);

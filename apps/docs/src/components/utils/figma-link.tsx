import { Figma } from "@commercetools/nimbus-icons";
import { IconButton } from "@commercetools/nimbus";
import { activeDocAtom } from "@/atoms/active-doc.ts";
import { useAtomValue } from "jotai";

export const FigmaLink = () => {
  const activeDoc = useAtomValue(activeDocAtom);
  const meta = activeDoc?.meta;

  if (!meta?.figmaLink) return null;

  return (
    <IconButton
      asChild
      size="xs"
      variant="ghost"
      aria-label="Open Figma Design"
    >
      <a href={meta.figmaLink} target="_blank" rel="noopener noreferrer">
        <Figma />
      </a>
    </IconButton>
  );
};

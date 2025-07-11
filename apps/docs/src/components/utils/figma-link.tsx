import { Figma } from "@commercetools/nimbus-icons";
import { IconButton } from "@commercetools/nimbus";
import { useUpdateDocument } from "@/hooks/useUpdateDocument";

export const FigmaLink = () => {
  const { meta } = useUpdateDocument();

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

import { Figma } from "@bleh-ui/icons";
import { Button } from "@bleh-ui/react";
import { useUpdateDocument } from "@/hooks/useUpdateDocument";

export const FigmaLink = () => {
  const { meta } = useUpdateDocument();

  if (!meta?.figmaLink) return null;

  return (
    <Button size="xs" variant="ghost" asChild>
      <a href={meta.figmaLink} target="_blank">
        <Figma size="1em" />
      </a>
    </Button>
  );
};

import { Figma } from "@commercetools/nimbus-icons";
import { Button } from "@commercetools/nimbus";
import { useUpdateDocument } from "@/hooks/useUpdateDocument";

export const FigmaLink = () => {
  const { meta } = useUpdateDocument();

  if (!meta?.figmaLink) return null;

  return (
    <Button size="xs" variant="ghost" asChild>
      <a href={meta.figmaLink} target="_blank">
        <Figma />
      </a>
    </Button>
  );
};

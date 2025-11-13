import { Badge, Heading, Stack, Text } from "@commercetools/nimbus";
import { lifecycleStateDescriptions } from "@/schemas/lifecycle-states";
import type { DocMetadataProps } from "./doc-metadata.types";

/**
 * DocMetadata Component
 *
 * Displays frontmatter metadata above view tabs as an introduction to the page.
 * Shows title, description, tags, lifecycle state, and design resource links
 * with subtle, inline styling.
 */
export const DocMetadata = ({
  title,
  description,
  tags,
  lifecycleState,
  figmaLink,
}: DocMetadataProps) => {
  // Get lifecycle info from the schema
  const lifecycleInfo = lifecycleState
    ? lifecycleStateDescriptions[lifecycleState]
    : null;

  // Don't render if there's no content to display
  const hasContent =
    title || description || tags?.length || lifecycleState || figmaLink;

  if (!hasContent) {
    return null;
  }

  return (
    <Stack direction="column" gap="400" mb="400">
      {title && (
        <Heading textStyle="3xl">
          {title}{" "}
          {lifecycleInfo && (
            <Badge size="2xs" colorPalette={lifecycleInfo.colorPalette}>
              {lifecycleInfo.label}
            </Badge>
          )}
        </Heading>
      )}
      {/* Description */}
      {description && <Text>{description}</Text>}

      {/* Tags and Lifecycle State Row */}
      {(tags?.length || lifecycleState) && (
        <Stack direction="row" gap="200" alignItems="center" flexWrap="wrap">
          {/* Tags */}
          {tags?.map((tag) => (
            <Badge key={tag} size="2xs" colorPalette="neutral">
              {tag}
            </Badge>
          ))}
        </Stack>
      )}

      {/* // TODO Flesh out resource links below, figma, github etc. */}
      {/* figmaLink && (
        <Stack direction="row" gap="400" alignItems="center">
          <Link
            href={figmaLink}
            target="_blank"
            rel="noopener noreferrer"
            fontSize="350"
            color="fg.muted"
          >
            View in Figma ↗
          </Link>
        </Stack>
      ) */}
    </Stack>
  );
};

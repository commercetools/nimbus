import { FC } from "react";
import {
  Box,
  Card,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@commercetools/nimbus";
import * as Icons from "@commercetools/nimbus-icons";
import {
  IllustrationCollage,
  hasIllustration,
} from "@/components/component-illustration";
import type { RouteManifest } from "@/contexts/manifest-context";

type DocumentCardProps = {
  /** the manifest entry of the document the card links to */
  doc: RouteManifest["routes"][number];
  /**
   * How many illustrations the card shows. The first one is visible; the rest
   * appear when the card is hovered or focused.
   */
  illustrationCount?: number;
  /** number of pages below the document; the footer is hidden for 0 */
  pageCount?: number;
};

const CardIcon: FC<{ id?: string; fallback: string }> = ({ id, fallback }) => {
  const Icon =
    Icons[(id || fallback) as keyof typeof Icons] ??
    Icons[fallback as keyof typeof Icons];
  return Icon ? <Icon /> : null;
};

/**
 * Card that links to a document: illustration (or icon), title and
 * description. Used by the category overview and the related documents.
 */
export const DocumentCard: FC<DocumentCardProps> = ({
  doc,
  illustrationCount = 2,
  pageCount = 0,
}) => {
  const illustrations = (doc.illustrations ?? [])
    .filter(hasIllustration)
    .slice(0, illustrationCount);

  return (
    <Link textDecoration="none" href={doc.path} display="block" height="full">
      <Card.Root
        variant="outlined"
        width="full"
        height="full"
        _hover={{ borderColor: "primary.7" }}
      >
        <Card.Body>
          <Stack gap="400">
            {illustrations.length > 0 && (
              <Flex
                colorPalette="primary"
                width="full"
                aspectRatio="16 / 10"
                justify="center"
                overflow="hidden"
                borderRadius="200"
                bg="colorPalette.2"
                // illustrations inside size themselves from the band
                // height and draw no background of their own
                css={{
                  containerType: "size",
                  "--illustration-gradient-start": "transparent",
                }}
              >
                <IllustrationCollage names={illustrations} />
              </Flex>
            )}
            <Stack gap="100">
              {illustrations.length === 0 && (
                <Box color="primary.11" textStyle="5xl" mb="200">
                  <CardIcon id={doc.icon} fallback="Layers" />
                </Box>
              )}
              <Heading
                color="neutral.12"
                textDecoration="none"
                size="lg"
                truncate
              >
                {doc.title}
              </Heading>
              <Text color="neutral.11" lineClamp={3}>
                {doc.description}
              </Text>
            </Stack>
          </Stack>
        </Card.Body>
        {pageCount > 0 && (
          <Card.Footer>
            <Text color="neutral.11" textStyle="sm">
              {pageCount} {pageCount === 1 ? "page" : "pages"}
            </Text>
          </Card.Footer>
        )}
      </Card.Root>
    </Link>
  );
};

import {
  Badge,
  Box,
  Flex,
  Grid,
  Heading,
  Link,
  Text,
  VisuallyHidden,
} from "@commercetools/nimbus";
import { OpenInNew } from "@commercetools/nimbus-icons";
import { Illustration, hasIllustration } from "@/components/illustration";
import { lifecycleStateDescriptions } from "@/schemas/lifecycle-states";
import { getResourceLinks } from "./get-resource-links";
import type { DocMetadataProps } from "./doc-metadata.types";

/**
 * DocMetadata Component
 *
 * The header of a documentation page: title with lifecycle badge, description,
 * resource link buttons (Figma, Storybook, GitHub) and, from the `md`
 * breakpoint up, the illustration of the component on the right.
 */
export const DocMetadata = ({
  title,
  description,
  lifecycleState,
  figmaLink,
  storybookLink,
  githubLink,
  illustration,
}: DocMetadataProps) => {
  const lifecycleInfo = lifecycleState
    ? lifecycleStateDescriptions[lifecycleState]
    : null;
  const links = getResourceLinks({ figmaLink, storybookLink, githubLink });
  const showIllustration = hasIllustration(illustration);

  if (!title && !description && links.length === 0) {
    return null;
  }

  return (
    <Grid
      mb="400"
      columnGap="800"
      rowGap="400"
      alignItems="center"
      gridTemplateColumns={{
        base: "minmax(0, 1fr)",
        md: showIllustration ? "minmax(0, 1fr) 200px" : "minmax(0, 1fr)",
      }}
    >
      <Flex direction="column" gap="400" alignItems="flex-start">
        {title && (
          <Flex alignItems="center" gap="300" flexWrap="wrap">
            <Heading as="h1" size="4xl" letterSpacing="-0.02em">
              {title}
            </Heading>
            {lifecycleInfo && (
              <Badge size="xs" colorPalette={lifecycleInfo.colorPalette}>
                {lifecycleInfo.label}
              </Badge>
            )}
          </Flex>
        )}

        {description && (
          <Text textStyle="lg" color="neutral.11" maxWidth="60ch">
            {description}
          </Text>
        )}

        {links.length > 0 && (
          <Flex
            as="ul"
            gap="200"
            flexWrap="wrap"
            listStyle="none"
            m="0"
            p="0"
            aria-label="Resources"
          >
            {links.map((link) => (
              <li key={link.key}>
                <Link
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  display="inline-flex"
                  alignItems="center"
                  gap="100"
                  textStyle="sm"
                  textDecoration="none"
                  px="300"
                  py="100"
                  border="1px solid"
                  borderColor="neutral.7"
                  borderRadius="full"
                >
                  {link.label}
                  <Box as="span" display="inline-flex" aria-hidden="true">
                    <OpenInNew />
                  </Box>
                  <VisuallyHidden>(opens in a new tab)</VisuallyHidden>
                </Link>
              </li>
            ))}
          </Flex>
        )}
      </Flex>

      {showIllustration && (
        <Illustration
          name={illustration}
          display={{ base: "none", md: "block" }}
          width="200px"
          height="150px"
        />
      )}
    </Grid>
  );
};

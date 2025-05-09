import { DocLink } from "@/components/navigation/doc-link";
import {
  Box,
  Card,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from "@commercetools/nimbus";

const links = [
  {
    title: "Design Tokens",
    icon: "🎨",
    description: "Go to the design tokens documentation.",
    href: "/design-tokens",
  },
  {
    title: "Components",
    icon: "🧱",
    description: "React components for building user interfaces.",
    href: "/components",
  },
  {
    title: "Icons",
    icon: "🗂️",
    description: "Search for icons in the Nimbus Icons library.",
    href: "/components/media/icons",
  },
  {
    title: "Hooks",
    icon: "🎣",
    description: "React hooks provided by Nimbus.",
    href: "/hooks",
  },
];

export const Frontpage = () => {
  return (
    <Stack gap="400">
      <Card.Root borderStyle="outlined" cardPadding="md" elevation="elevated">
        <Flex direction="column" width="100%" align="center" py="800">
          <Heading size="7xl" m="auto" letterSpacing={"-.025em"}>
            Nimbus
          </Heading>
          <Text
            color="neutral.11"
            fontWeight="600"
            textTransform="uppercase"
            letterSpacing={".1em"}
          >
            Design System
          </Text>
        </Flex>
      </Card.Root>

      <SimpleGrid columns={2} gap="400">
        {links.map((link) => (
          <DocLink docRoute={link.href} unstyled>
            <Card.Root borderStyle="outlined" cardPadding="lg">
              <Card.Content>
                <Flex gap="600" direction="row" height="80px">
                  <Box>
                    <Text textStyle="6xl">{link.icon}</Text>
                  </Box>
                  <Box gap="200">
                    <Heading truncate>{link.title}</Heading>
                    <Text lineClamp={2} color="neutral.11">
                      {link.description}
                    </Text>
                  </Box>
                </Flex>
              </Card.Content>
            </Card.Root>
          </DocLink>
        ))}
      </SimpleGrid>
    </Stack>
  );
};

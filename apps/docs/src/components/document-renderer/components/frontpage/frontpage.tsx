import {
  Box,
  Card,
  Flex,
  Heading,
  Link,
  SimpleGrid,
  Stack,
  Text,
} from "@commercetools/nimbus";

const links = [
  {
    title: "Design Tokens",
    icon: "🎨",
    description: "Go to the design tokens documentation.",
    href: "/home/design-tokens",
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
    href: "/icons",
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

      <SimpleGrid columns={1} gap="400">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href?.substring(1)}
            textDecoration="none"
          >
            <Card.Root borderStyle="outlined" cardPadding="lg" width="full">
              <Card.Content>
                <Stack direction="row" gap="400" alignItems="center">
                  <Box>
                    <Text textStyle="6xl">{link.icon}</Text>
                  </Box>
                  <Box gap="200">
                    <Heading color="neutral.12" truncate>
                      {link.title}
                    </Heading>
                    <Text lineClamp={2} color="neutral.11">
                      {link.description}
                    </Text>
                  </Box>
                </Stack>
              </Card.Content>
            </Card.Root>
          </Link>
        ))}
      </SimpleGrid>
    </Stack>
  );
};

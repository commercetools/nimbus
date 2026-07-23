import {
  Box,
  Card,
  Heading,
  Link,
  SimpleGrid,
  Stack,
  Text,
} from "@commercetools/nimbus";

type Destination = {
  title: string;
  icon: string;
  description: string;
  /** Absolute route path (leading slash) — matches how the top nav links. */
  href: string;
};

const destinations: Destination[] = [
  {
    title: "Design Tokens",
    icon: "🎨",
    description: "Colors, spacing, typography and the rest of the token system.",
    href: "/home/design-tokens",
  },
  {
    title: "Components",
    icon: "🧱",
    description: "Accessible React components for building user interfaces.",
    href: "/components",
  },
  {
    title: "Patterns",
    icon: "🧩",
    description: "Composable solutions to recurring UX problems.",
    href: "/patterns",
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

/**
 * The primary "where do I go" cards. Each is a full-height outlined card wrapped
 * in a Nimbus `Link` (client-routed via the app's RouterProvider). The grid
 * reflows 1 → 2 → 3 columns so the row fills the widened home content area.
 */
export const DestinationCards = () => {
  return (
    <SimpleGrid as="section" columns={{ base: 1, md: 2, lg: 3 }} gap="400">
      {destinations.map((destination) => (
        <Link key={destination.href} href={destination.href} textDecoration="none">
          <Card.Root variant="outlined" size="lg" width="full" height="full">
            <Card.Body>
              <Stack direction="row" gap="400" alignItems="center">
                <Box>
                  <Text textStyle="6xl">{destination.icon}</Text>
                </Box>
                <Box>
                  <Heading color="neutral.12" truncate>
                    {destination.title}
                  </Heading>
                  <Text lineClamp={2} color="neutral.11">
                    {destination.description}
                  </Text>
                </Box>
              </Stack>
            </Card.Body>
          </Card.Root>
        </Link>
      ))}
    </SimpleGrid>
  );
};

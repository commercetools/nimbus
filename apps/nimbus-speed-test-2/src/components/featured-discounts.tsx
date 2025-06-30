import {
  Badge,
  Heading,
  Icon,
  Stack,
  Text,
  Card,
  SimpleGrid,
} from "@commercetools/nimbus";
import {
  FavoriteBorder as FavoriteBorderIcon,
  AddLocation as AddLocationIcon,
  CallSplit as CallSplitIcon,
  AcUnit as AcUnitIcon,
  Celebration as CelebrationIcon,
} from "@commercetools/nimbus-icons";

export const FeaturedDiscounts = () => {
  const discountTemplates = [
    {
      heading: "Behavior-triggered discounts",
      description:
        "Automatically trigger discounts based on specific customer actions, such as abandoning a cart.",
      icon: FavoriteBorderIcon,
      bgColor: "amber.3",
      color: "amber.8",
      size: "md",
    },
    {
      heading: "Location-based offer",
      description:
        "Geographically targeted discounts to attract local customers or respond to regional market conditions",
      icon: AddLocationIcon,
      bgColor: "primary.3",
      color: "primary.11",
      size: "md",
    },
    {
      heading: "A/B discount strategies",
      description:
        "Generate offer variations, and automatically analyze performance to identify the most effective conversion.",
      icon: CallSplitIcon,
      bgColor: "tomato.3",
      color: "tomato.11",
      size: "md",
    },
    {
      heading: "Seasonal promotions",
      description:
        "Generate relevant discounts for holidays, special events, or specific times of the year.",
      icon: AcUnitIcon,
      bgColor: "teal.3",
      color: "teal.11",
      size: "md",
    },
  ];

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        gap="400"
        mb="100"
        // height="5vh"
      >
        <Badge colorPalette="primary">
          <CelebrationIcon />
          New
        </Badge>
        <Heading fontWeight="500">Featured discounts</Heading>
      </Stack>
      <Text color="neutral.11" mb="400">
        Take advantage of these are popular new discounts creation tools.
      </Text>
      <SimpleGrid templateColumns="repeat(4, 1fr)" gap="200" mb="800">
        {discountTemplates.map((template) => (
          <SimpleGrid.Item key={template.heading}>
            <Card.Root
              cardPadding="md"
              elevation="elevated"
              height="100%"
              onClick={() =>
                window.open("https://www.spacejam.com/1996/", "_blank")
              }
            >
              <Card.Content>
                <SimpleGrid
                  templateColumns="auto 1fr"
                  alignItems="start"
                  gap="200"
                >
                  <Icon
                    as={template.icon}
                    borderRadius="100"
                    bgColor={template.bgColor}
                    color={template.color}
                    size={template.size}
                    p="200"
                  />
                  <Stack gap="25">
                    <Heading fontWeight="500">{template.heading}</Heading>
                    <Text color="slate.11">{template.description}</Text>
                  </Stack>
                </SimpleGrid>
              </Card.Content>
            </Card.Root>
          </SimpleGrid.Item>
        ))}
      </SimpleGrid>
    </>
  );
};

FeaturedDiscounts.displayName = "FeaturedDiscounts";

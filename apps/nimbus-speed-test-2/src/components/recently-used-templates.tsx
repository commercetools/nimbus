import {
  Card,
  Grid,
  Stack,
  Heading,
  Icon,
  Text,
  IconButton,
} from "@commercetools/nimbus";
import {
  LocalOffer as LocalOfferIcon,
  Close as CloseIcon,
} from "@commercetools/nimbus-icons";
import { useState } from "react";

const recentlyUsedTemplates = [
  {
    id: "percentage-discounts",
    title: "Percentage Discounts",
    description: "A certain percentage off the original price",
  },
  {
    id: "bogo",
    title: "Buy One, Get One (BOGO)",
    description: "A free or discounted item when another is purchased",
  },
  {
    id: "fixed-amount",
    title: "Fixed amount discounts",
    description: "A specific dollar amount off the original price",
  },
  {
    id: "clearance",
    title: "Clearance Discounts",
    description:
      "Offering significant price reductions on items to clear them out.",
  },
  {
    id: "loyalty",
    title: "Loyalty Program Discounts",
    description:
      "Rewarding repeat customers with exclusive discounts or points that can be redeemed for savings",
  },
  {
    id: "free-shipping",
    title: "Free Shipping",
    description:
      "Waiving shipping costs, often when a customer meets a certain spending threshold.",
  },
];

export const RecentlyUsedTemplates = () => {
  const [templates, setTemplates] = useState(recentlyUsedTemplates);

  const handleRemoveTemplate = (templateId: string) => {
    setTemplates((prevTemplates) =>
      prevTemplates.filter((template) => template.id !== templateId)
    );
  };

  return (
    <>
      <Grid
        templateColumns="repeat(5, 1fr)"
        templateRows="repeat(2, 1fr)"
        gap="200"
        mb="800"
        // h="30vh"
      >
        <Grid.Item rowSpan={2}>
          <Card.Root
            cardPadding="md"
            elevation="elevated"
            height="100%"
            bgColor="purple.3"
          >
            <Stack direction="column" justifyContent="center" height="100%">
              <Icon
                as={LocalOfferIcon}
                borderRadius="100"
                bgColor="purple.3"
                color="purple.11"
                size="md"
                p="200"
              />
              <Heading fontWeight="500">Recently used templates</Heading>

              <Text color="neutral.11">
                Pin your favorite used templates to speed up your workflow.
              </Text>
            </Stack>
          </Card.Root>
        </Grid.Item>

        {templates.map((template) => (
          <Grid.Item key={template.id}>
            <Card.Root cardPadding="md" elevation="elevated">
              <Stack direction="column" gap="200">
                <Stack direction="row" justifyContent="flex-end">
                  <IconButton
                    aria-label="delete-template"
                    variant="plain"
                    onPress={() => handleRemoveTemplate(template.id)}
                  >
                    <CloseIcon />
                  </IconButton>
                </Stack>
                <Heading fontWeight="500">{template.title}</Heading>
                <Text color="neutral.11">{template.description}</Text>
              </Stack>
            </Card.Root>
          </Grid.Item>
        ))}
      </Grid>
    </>
  );
};

RecentlyUsedTemplates.displayName = "RecentlyUsedTemplates";

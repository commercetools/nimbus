import {
  Stack,
  Heading,
  Badge,
  Text,
  CardRoot,
  Grid,
  IconButton,
} from "@commercetools/nimbus";
import * as Icons from "@commercetools/nimbus-icons";
import { useState } from "react";

type TDiscount = {
  title: string;
  description: string;
};

const initialDiscountTypes: TDiscount[] = [
  {
    title: "Percentage Discounts",
    description: "A certain percentage off the original price",
  },
  {
    title: "Buy One, Get One (BOGO)",
    description: "A free or discounted item when another is purchased",
  },
  {
    title: "Fixed amount discounts",
    description: "A specific dollar amount off the original price",
  },
  {
    title: "Clearance Discounts",
    description:
      "Offering significant price reductions on items to clear them out.",
  },
  {
    title: "Loyalty Program Discounts",
    description:
      "Rewarding repeat customers with exclusive discounts or points that can be redeemed for savings",
  },
  {
    title: "Free Shipping",
    description:
      "Waiving shipping costs, often when a customer meets a certain spending threshold.",
  },
];

type TDiscountCardProps = {
  title: string;
  description: string;
  onDelete?: () => void;
};

const DiscountCard = (props: TDiscountCardProps) => {
  return (
    <CardRoot
      backgroundStyle="muted"
      borderStyle="none"
      cardPadding="md"
      elevation="elevated"
    >
      <Stack>
        <IconButton
          aria-label="Delete discount"
          variant="ghost"
          justifyContent={"center"}
          width="fit-content"
          alignSelf="flex-end"
          onClick={props.onDelete}
        >
          <Icons.Close />
        </IconButton>
        <Heading fontWeight="700" fontSize="500">
          {props.title}
        </Heading>
        <Text lineHeight="600" fontSize="350">
          {props.description}
        </Text>
      </Stack>
    </CardRoot>
  );
};

const TemplateCard = () => {
  return (
    <CardRoot
      backgroundStyle="muted"
      cardPadding="md"
      elevation="elevated"
      height="100%"
      alignItems="center"
      bgColor="primary.2"
    >
      <Stack gap="600">
        <Badge colorPalette="primary" alignSelf="flex-start">
          <Icons.LocalOffer />
        </Badge>
        <Heading fontWeight="500" fontSize="500" lineHeight="600">
          Recently used templates
        </Heading>
        <Text>Pin your favorite used templates to speed up your workflow.</Text>
      </Stack>
    </CardRoot>
  );
};

const DeletableCards = () => {
  const [discounts, setDiscounts] = useState(initialDiscountTypes);

  const handleDelete = (index: number) => {
    setDiscounts(discounts.filter((_, i) => i !== index));
  };

  return (
    <Grid templateColumns="repeat(4, 1fr)" gridGap="600">
      <Grid.Item colSpan={1} rowSpan={2}>
        <TemplateCard />
      </Grid.Item>
      <Grid.Item colSpan={3}>
        <Grid templateColumns="repeat(4, 1fr)" gridGap="500">
          {discounts.map((discount, index) => (
            <Grid.Item key={index} colSpan={1}>
              <DiscountCard
                title={discount.title}
                description={discount.description}
                onDelete={() => handleDelete(index)}
              />
            </Grid.Item>
          ))}
        </Grid>
      </Grid.Item>
    </Grid>
  );
};
export default DeletableCards;

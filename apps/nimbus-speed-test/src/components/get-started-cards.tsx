import {
  CardRoot,
  Grid,
  Heading,
  Stack,
  Text,
  Select,
  IconButton,
} from "@commercetools/nimbus";
import AllDiscount from "../../public/all-discount.svg";
import CartDiscount from "../../public/cart-discount.svg";
import ProductDiscount from "../../public/product-discount.svg";
import DiscountCode from "../../public/discount-code.svg";
import * as Icons from "@commercetools/nimbus-icons";

const discountTemplates = [
  {
    title: "All discount templates",
    description:
      "Templates simplify discount creation by showing only essential fields.",
    backgroundImage: AllDiscount,
    hasInput: true,
  },
  {
    title: "Product discounts",
    description:
      "Product discounts show a percentage or fixed amount off the price of specific items before they're added to the cart, ideal for highlighting sale prices on product pages.",
    backgroundImage: ProductDiscount,
  },
  {
    title: "Cart discounts",
    description:
      "Cart discounts automatically reduce the price in the shopping cart by a percentage, a fixed amount, or set a new fixed price. Apply discounts to items, shipping, or more.",
    backgroundImage: CartDiscount,
  },
  {
    title: "Discount codes",
    description:
      "Discount codes are unique keys you share with customers to unlock specific cart discounts.",
    backgroundImage: DiscountCode,
  },
];

const GetStartedCards = () => {
  return (
    <Grid templateColumns="repeat(4, 1fr)" gap="600">
      {discountTemplates.map((template, index) => (
        <Grid.Item key={index} colSpan={1}>
          <CardRoot
            backgroundStyle="muted"
            cardPadding="md"
            elevation="elevated"
            bgColor="white"
            height="100%"
          >
            <Stack gap="400" alignItems="flex-start">
              <img
                alt={template.title}
                src={template.backgroundImage}
                width="100%"
                height="100%"
              />
              <Heading fontWeight="500" fontSize="500" lineHeight="700">
                {template.title}
              </Heading>
              <Text fontWeight="400" fontSize="400" lineHeight="700">
                {template.description}
              </Text>
              {template.hasInput && (
                <Stack
                  direction="row"
                  gap="200"
                  alignItems="center"
                  width="100%"
                >
                  <Select.Root
                    aria-label="Select some fruit(s)"
                    data-testid="select"
                    width="inherit"
                  >
                    <Select.Options>
                      <Select.OptionGroup label="Product Discounts">
                        <Select.Option>Percent off product </Select.Option>
                        <Select.Option>Amount off product</Select.Option>
                      </Select.OptionGroup>
                      <Select.OptionGroup label="Cart Discounts with line items">
                        <Select.Option>
                          Percent off item(s) in cart{" "}
                        </Select.Option>
                        <Select.Option>Fixed-price in cart</Select.Option>
                      </Select.OptionGroup>
                    </Select.Options>
                  </Select.Root>
                  <IconButton
                    aria-label="Attach"
                    variant="solid"
                    tone="primary"
                  >
                    <Icons.ArrowForward />
                  </IconButton>
                </Stack>
              )}
            </Stack>
          </CardRoot>
        </Grid.Item>
      ))}
    </Grid>
  );
};

const GetStartedCard = () => {
  return (
    <Stack>
      <Stack direction="row" gap="400" alignItems="center">
        <Heading fontWeight="500" fontSize="500" lineHeight="700">
          Or get started with templates
        </Heading>
      </Stack>
      <Text lineHeight="600">
        Browse all of the discounts creation tools, and access your custom
        discount templates.{" "}
      </Text>
      <GetStartedCards />
    </Stack>
  );
};
export default GetStartedCard;

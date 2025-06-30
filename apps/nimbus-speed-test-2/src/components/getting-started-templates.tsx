import {
  Card,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  Select,
  IconButton,
} from "@commercetools/nimbus";
import ProductDiscounts from "../../public/product-discounts.svg";
import CartDiscounts from "../../public/cart-discounts.svg";
import DiscountCodes from "../../public/discount-codes.svg";
import AllDiscountTemplates from "../../public/all-discount-templates.svg";
import { ArrowForward as ArrowForwardIcon } from "@commercetools/nimbus-icons";

export const GettingStartedTemplates = () => {
  const gettingStartedCards = [
    {
      heading: "All discount templates",
      description:
        "Templates simplify discount creation by showing only essential fields.",
      svg: AllDiscountTemplates,
    },
    {
      heading: "Product discounts",
      description:
        "Product discounts show a percentage or fixed amount off the price of specific items before they're added to the cart, ideal for highlighting sale prices on product pages.",
      svg: ProductDiscounts,
    },
    {
      heading: "Cart discounts",
      description:
        "Cart discounts automatically reduce the price in the shopping cart by a percentage, a fixed amount, or set a new fixed price. Apply discounts to items, shipping, or more.",
      svg: CartDiscounts,
    },
    {
      heading: "Discount codes",
      description:
        "Discount codes are unique keys you share with customers to unlock specific cart discounts. ",
      svg: DiscountCodes,
    },
  ];

  return (
    <>
      <Stack direction="row" alignItems="center" my="100">
        <Heading fontWeight="500">Or get started with templates</Heading>
      </Stack>
      <Text color="neutral.11" mb="400">
        Browse all of the discounts creation tools, and access your custom
        discount templates.
      </Text>
      <SimpleGrid templateColumns="repeat(4, 1fr)" gap="200" mb="800">
        {gettingStartedCards.map((card, index) => (
          <SimpleGrid.Item key={card.heading}>
            <Card.Root
              cardPadding="md"
              elevation="elevated"
              height="100%"
              {...(index > 0 && {
                onPress: () =>
                  window.open(
                    "https://www.youtube.com/watch?v=xvFZjo5PgG0",
                    "_blank"
                  ),
              })}
            >
              <Card.Content m="200">
                {/* 1st card contains selection dropdown */}
                {index === 0 ? (
                  <SimpleGrid
                    templateRows="auto 1fr"
                    alignItems="start"
                    gap="200"
                  >
                    <Stack>
                      <img src={card.svg} alt={card.heading} />
                    </Stack>
                    <Stack>
                      <Heading fontWeight="500">{card.heading}</Heading>
                      <Text color="slate.11">{card.description}</Text>
                      <Stack direction="row" alignItems="center" gap="200">
                        <Select.Root
                          aria-label="Select discount template"
                          placeholder="Search and select..."
                        >
                          <Select.Options>
                            <Select.OptionGroup label="PRODUCT DISCOUNTS">
                              <Select.Option>Percent off product</Select.Option>
                              <Select.Option>Amount off product</Select.Option>
                            </Select.OptionGroup>
                            <Select.OptionGroup label="CART DISCOUNTS WITH LINE VALUES">
                              <Select.Option>
                                Percent off item(s) in cart
                              </Select.Option>
                              <Select.Option>Fixed-price in cart</Select.Option>
                            </Select.OptionGroup>
                          </Select.Options>
                        </Select.Root>
                        <IconButton
                          aria-label="move-forward"
                          variant="solid"
                          tone="primary"
                        >
                          <ArrowForwardIcon />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </SimpleGrid>
                ) : (
                  // Remaining clickable cards
                  <SimpleGrid
                    templateRows="auto 1fr"
                    alignItems="start"
                    gap="200"
                  >
                    <Stack>
                      <img src={card.svg} alt={card.heading} />
                      <Heading fontWeight="500">{card.heading}</Heading>
                      <Text color="slate.11">{card.description}</Text>
                    </Stack>
                  </SimpleGrid>
                )}
              </Card.Content>
            </Card.Root>
          </SimpleGrid.Item>
        ))}
      </SimpleGrid>
    </>
  );
};

GettingStartedTemplates.displayName = "GettingStartedTemplates";

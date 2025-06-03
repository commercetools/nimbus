import {
  Stack,
  Heading,
  Badge,
  Text,
  type BadgeProps,
  CardRoot,
  Grid,
  Box,
} from "@commercetools/nimbus";
import * as Icons from "@commercetools/nimbus-icons";
import { FavoriteIcon } from "../favorite_border";
import { PinDropIcon } from "../pin_drop";
import { CallSplitIcon } from "../call_split";
import { AcUnitIcon } from "../ac_unit";

type TFeaturedCardProps = {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  bgColor?: BadgeProps["bg"];
  onClick?: () => void;
  isDisabled?: boolean;
  isSelected?: boolean;
};

const discountFeatures = [
  {
    title: "Behavior-triggered discounts",
    description:
      "Automatically trigger discounts based on specific customer actions, such as abandoning a cart.",
    icon: <FavoriteIcon />,
    bgColor: "amber.3",
  },
  {
    title: "Location-based offer",
    description:
      "Geographically targeted discounts to attract local customers or respond to regional market conditions",
    icon: <PinDropIcon />,
    bgColor: "primary.3",
  },
  {
    title: "A/B discount strategies",
    description:
      "Generate offer variations, and automatically analyze performance to identify the most effective conversion.",
    icon: <CallSplitIcon />,
    bgColor: "tomato.3",
  },
  {
    title: "Seasonal promotions",
    description:
      "Generate relevant discounts for holidays, special events, or specific times of the year.",
    icon: <AcUnitIcon />,
    bgColor: "teal.3",
  },
];

const FeaturedCard = (props: TFeaturedCardProps) => {
  return (
    <CardRoot
      backgroundStyle="muted"
      borderStyle="none"
      cardPadding="md"
      elevation="elevated"
    >
      <Grid templateColumns="repeat(8, 1fr)" gridGap="400">
        <Grid.Item colSpan={1} rowSpan={1}>
          <Badge aria-label={props.title as string} bg={props.bgColor}>
            {props.icon}
          </Badge>
        </Grid.Item>
        <Grid.Item colSpan={7} rowSpan={1}>
          <Stack gap="200" width="100%">
            <Heading fontWeight="700" fontSize="500">
              {props.title}
            </Heading>
            <Box
              display="-webkit-box"
              // This is needed for the text truncation to work
              style={{
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
              }}
              overflow="hidden"
              textOverflow="ellipsis"
              maxHeight="4.8rem"
            >
              <Text lineHeight="600" fontSize="350">
                {props.description}
              </Text>
            </Box>
          </Stack>
        </Grid.Item>
      </Grid>
    </CardRoot>
  );
};

const FeaturedDiscounts = () => {
  return (
    <>
      <Stack>
        <Stack direction="row" gap="400" alignItems="center">
          <Badge colorPalette="primary">
            <Icons.Celebration /> New
          </Badge>
          <Heading fontWeight="500" fontSize="500">
            Featured discounts
          </Heading>
        </Stack>
        <Text lineHeight="600">
          Take advantage of these are popular new discounts creation tools.{" "}
        </Text>
      </Stack>
      <Grid templateColumns="repeat(4, 1fr)" gridGap="400">
        {discountFeatures.map((feature, index) => (
          <Grid.Item colSpan={1} rowSpan={1}>
            <FeaturedCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              bgColor={feature.bgColor}
            />
          </Grid.Item>
        ))}
      </Grid>
    </>
  );
};
export default FeaturedDiscounts;

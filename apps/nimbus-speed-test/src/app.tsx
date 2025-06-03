import { Box, Flex, Stack, Grid } from "@commercetools/nimbus";
import Jumbotron from "./components/jumbotron";
import FeaturedDiscounts from "./components/featured-discounts";
import DeletableCards from "./components/deletable-cards";
import GetStartedCard from "./components/get-started-cards";

export const App = () => {
  return (
    <Grid templateColumns="repeat(20, 1fr)">
      <Grid.Item colSpan={1}>
        <Box height="100vh" bg="primary.12" overflowY="auto" />
      </Grid.Item>
      <Grid.Item colSpan={19}>
        <Flex width="100%" height="100vh" overflowY="auto">
          <Stack m="auto" width="100%" height="100%">
            <Jumbotron />
            <Box px="2000" py="500" width="100%">
              <Stack m="auto" width="100%" height="100%" gap="600">
                <FeaturedDiscounts />
                <DeletableCards />
                <GetStartedCard />
              </Stack>
            </Box>
          </Stack>
        </Flex>
      </Grid.Item>
    </Grid>
  );
};

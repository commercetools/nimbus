import { Box, Flex, Stack, Grid } from "@commercetools/nimbus";
import Jumbotron from "./components/jumbotron";
import FeaturedDiscounts from "./components/featured-discounts";

export const App = () => {
  return (
    <Grid templateColumns="repeat(20, 1fr)">
      <Grid.Item colSpan={1}>
        <Box height="100vh" bg="primary.12" />
      </Grid.Item>
      <Grid.Item colSpan={19}>
        <Flex width="100%" height="100vh">
          <Stack m="auto" width="100%" height="100%">
            {/* Section 1 - Jumbotron */}
            <Jumbotron />
            <Box px="2000" py="500" width="100%">
              {/* Section 2 - Featured discounts */}
              <FeaturedDiscounts />
              {/* Section 3 - Deletable Cards*/}
              <Box>Section 3 - Deletable Cards</Box>
              {/* Section 4 - Or get started with templates*/}
              <Box>Section 4 - Or get started with templates</Box>
            </Box>
          </Stack>
        </Flex>
      </Grid.Item>
    </Grid>
  );
};

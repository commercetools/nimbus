import {
  Box,
  Button,
  Card,
  Heading,
  IconButton,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@commercetools/nimbus";
import * as Icons from "@commercetools/nimbus-icons";
import { useState } from "react";

export const Hero = () => {
  const [isPopover, setIsPopover] = useState(false);
  return (
    <>
      <Box
        bgImage="url('/public/hero.svg')"
        alignItems="center"
        justifyContent="center"
        mx="auto"
        h="300px"
        // height="35vh"
        bgSize="cover"
        display="flex"
        mb="800"
      >
        <Stack textAlign="center" maxWidth="2xl" gap="400">
          <Heading color="colorPalette.1" fontSize="600">
            Use commercetools AI to quickly create all your discounts
          </Heading>
          <Text color="colorPalette.1">
            Effortlessly create compelling discounts in minutes with the power
            of AI! Unlock exciting new ways to boost sales and delight your
            customers with smart, automatically generated offers.
          </Text>
          <Stack direction="row" mb="400">
            <TextInput
              flex="1"
              placeholder="Enter a prompt to generate discount"
            />
            <Tooltip.Root>
              <Box position="relative">
                <IconButton
                  aria-label="Attach"
                  onPress={() => setIsPopover(!isPopover)}
                >
                  <Icons.Add />
                </IconButton>
                {isPopover && (
                  <Box
                    position="absolute"
                    top="100%"
                    background="colorPalette.1"
                    borderRadius="200"
                    mt="200"
                  >
                    <Card.Root
                      cardPadding="sm"
                      elevation="elevated"
                      borderRadius="200"
                      w="4000"
                    >
                      <Card.Content>
                        <Box display="flex" flexDirection="column" gap="300">
                          <Box display="flex" alignItems="center" gap="300">
                            <IconButton aria-label="CSV" size="sm">
                              <Icons.AttachFile />
                            </IconButton>
                            <Text>CSV</Text>
                          </Box>

                          <Box display="flex" alignItems="center" gap="300">
                            <IconButton aria-label="Browse for file" size="sm">
                              <Icons.FileUpload />
                            </IconButton>
                            <Text>Browse for file</Text>
                          </Box>
                        </Box>
                      </Card.Content>
                    </Card.Root>
                  </Box>
                )}
              </Box>
              <Tooltip.Content placement="right" borderRadius="200">
                Attach
              </Tooltip.Content>
            </Tooltip.Root>
          </Stack>
          <Button colorPalette="primary" variant="solid" alignSelf="center">
            Generate Discount
            <Icons.ArrowForward />
          </Button>
        </Stack>
      </Box>
    </>
  );
};

Hero.displayName = "Hero";

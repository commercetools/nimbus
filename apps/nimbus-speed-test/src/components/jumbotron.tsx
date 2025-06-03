import {
  Box,
  Heading,
  Text,
  Button,
  Stack,
  TextInput,
  IconButton,
  Card,
  Tooltip,
  TooltipTrigger,
} from "@commercetools/nimbus";
import * as Icons from "@commercetools/nimbus-icons";
import JumbotronSvg from "../../public/jumbotron-image.svg";
import { useState, useRef } from "react";

const Jumbotron = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const attachButtonRef = useRef<HTMLButtonElement>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <Box
      mx="auto"
      mb="400"
      width="100%"
      height="388px"
      p="200"
      backgroundImage={`url(${JumbotronSvg})`}
      backgroundSize="cover"
    >
      <Stack
        align="center"
        justify="center"
        maxWidth="3xl"
        mx="auto"
        my="2000"
        textAlign="center"
      >
        <Heading
          color="colorPalette.1"
          fontWeight="600"
          fontSize="600"
          lineHeight="800"
          fontStyle="normal"
        >
          Use commercetools AI to quickly create all your discounts
        </Heading>
        <Text
          color="colorPalette.1"
          mb="200"
          fontSize="400"
          fontWeight="400"
          lineHeight="800"
          fontStyle="normal"
          fontFamily="body"
        >
          Effortlessly create compelling discounts in minutes with the power of
          AI! Unlock exciting new ways to boost sales and delight your customers
          with smart, automatically generated offers.
        </Text>
        <Stack direction="row" width="100%" position="relative">
          <TextInput
            placeholder="Enter a prompt to generate discount"
            width="100%"
            size="md"
            mb="400"
          />
          <Box position="relative">
            <TooltipTrigger closeDelay={0} delay={0}>
              <IconButton
                aria-label="Attach"
                tone="primary"
                onClick={toggleDropdown}
                ref={attachButtonRef}
              >
                <Icons.Add />
              </IconButton>
              <Tooltip placement="right">Attach</Tooltip>
            </TooltipTrigger>
            {/* For lack of the dropdown component at the moment for now, this had to be implemented manually.  */}
            {isDropdownOpen && (
              <Box
                position="absolute"
                top="100%"
                background="colorPalette.1"
                borderRadius="200"
              >
                <Card.Root
                  cardPadding="sm"
                  elevation="elevated"
                  borderRadius="200"
                  width="180px"
                  alignItems="center"
                >
                  <Card.Content>
                    <Stack gap="200">
                      <Box
                        as="button"
                        p="200"
                        borderRadius="200"
                        width="100%"
                        textAlign="center"
                        _hover={{ bg: "primary.4" }}
                      >
                        <Stack direction="row" gap="200" alignItems="center">
                          <Icons.FilePresent />
                          <Text>CSV</Text>
                        </Stack>
                      </Box>
                      <Box
                        as="button"
                        p="200"
                        borderRadius="200"
                        width="100%"
                        textAlign="center"
                        _hover={{ bg: "primary.4" }}
                      >
                        <Stack direction="row" gap="200" alignItems="center">
                          <Icons.FileUpload />
                          <Text>Browse for file</Text>
                        </Stack>
                      </Box>
                    </Stack>
                  </Card.Content>
                </Card.Root>
              </Box>
            )}
          </Box>
        </Stack>
        <Button aria-label="Generate discount" variant="solid" tone="primary">
          Generate discount
          <Icons.ArrowForward />
        </Button>
      </Stack>
    </Box>
  );
};

export default Jumbotron;

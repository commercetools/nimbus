import { Flex, Text, Icon } from "@commercetools/nimbus";
import { AutoAwesome } from "@commercetools/nimbus-icons";

interface ActivationButtonProps {
  label: string;
  onClick?: () => void;
}

/**
 * A small AI-action button that appears inline in form fields.
 * Represents the "activation" augmentation data shape.
 */
export const ActivationButton = ({ label, onClick }: ActivationButtonProps) => {
  return (
    <Flex
      as="button"
      alignItems="center"
      gap="100"
      px="200"
      py="50"
      borderRadius="100"
      bg="indigo.3"
      cursor="pointer"
      flexShrink={0}
      transition="background 150ms"
      _hover={{ bg: "indigo.4" }}
      onClick={onClick}
      border="none"
    >
      <Icon as={AutoAwesome} size="2xs" color="indigo.9" />
      <Text textStyle="xs" fontWeight="medium" color="indigo.11">
        {label}
      </Text>
    </Flex>
  );
};

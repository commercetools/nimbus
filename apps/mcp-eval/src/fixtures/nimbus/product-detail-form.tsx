/**
 * Realistic Merchant Center "Product Detail / Edit" form built with Nimbus.
 *
 * This is the Nimbus equivalent of the UI Kit fixture at
 * `../uikit/product-detail-form.tsx`. It exercises the same migration
 * patterns using their Nimbus counterparts:
 *
 * - LocalizedField (type="text" / type="multiLine") for localized inputs
 * - MoneyInput with onValueChange (MoneyInputValue)
 * - NumberInput with a plain number onChange
 * - TextInputField (Field-level pattern component)
 * - Heading / Text (typography variants)
 * - Card (style-props-enabled compound component)
 * - ProgressBar
 * - Stack collapsing nested Spacings.Inline / Spacings.Stack layouts
 * - Alert (mapped from ContentNotification)
 * - Link
 */

import { useCallback, useState } from "react";
import {
  Stack,
  Heading,
  Text,
  Button,
  Icon,
  TextInputField,
  LocalizedField,
  MoneyInput,
  NumberInput,
  Select,
  Alert,
  Card,
  Link,
  ProgressBar,
  Badge,
  TagGroup,
  type LocalizedString,
  type LocalizedFieldChangeEvent,
  type MoneyInputValue,
} from "@commercetools/nimbus";
import { ArrowBack, Check, Close, Warning } from "@commercetools/nimbus-icons";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ProductFormValues {
  name: LocalizedString;
  description: LocalizedString;
  slug: string;
  sku: string;
  price: MoneyInputValue;
  quantity: number;
  weight: number;
  category: string;
  status: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const LANGUAGES = ["en", "de", "fr"];

const CATEGORY_OPTIONS = [
  { value: "apparel", label: "Apparel" },
  { value: "footwear", label: "Footwear" },
  { value: "accessories", label: "Accessories" },
  { value: "electronics", label: "Electronics" },
];

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProductDetailForm() {
  const [values, setValues] = useState<ProductFormValues>({
    name: { en: "Premium T-Shirt", de: "Premium T-Shirt", fr: "" },
    description: {
      en: "A comfortable cotton t-shirt",
      de: "Ein bequemes Baumwoll-T-Shirt",
      fr: "",
    },
    slug: "premium-t-shirt",
    sku: "TSH-001",
    price: { amount: "29.99", currencyCode: "EUR" },
    quantity: 150,
    weight: 0.2,
    category: "apparel",
    status: "published",
  });

  const [errors, setErrors] = useState<Record<string, Record<string, string>>>(
    {}
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // LocalizedField uses a standardized change event for all locale inputs
  const handleLocalizedNameChange = useCallback(
    (event: LocalizedFieldChangeEvent) => {
      const locale = event.target.locale;
      if (!locale) return;
      setValues((prev) => ({
        ...prev,
        name: { ...prev.name, [locale]: event.target.value as string },
      }));
    },
    []
  );

  const handleLocalizedDescriptionChange = useCallback(
    (event: LocalizedFieldChangeEvent) => {
      const locale = event.target.locale;
      if (!locale) return;
      setValues((prev) => ({
        ...prev,
        description: {
          ...prev.description,
          [locale]: event.target.value as string,
        },
      }));
    },
    []
  );

  // MoneyInput's recommended onValueChange receives MoneyInputValue directly
  const handlePriceChange = useCallback((value: MoneyInputValue) => {
    setValues((prev) => ({
      ...prev,
      price: value,
    }));
  }, []);

  // NumberInput's onChange receives a plain number
  const handleQuantityChange = useCallback((value: number) => {
    setValues((prev) => ({
      ...prev,
      quantity: value,
    }));
  }, []);

  const handleWeightChange = useCallback((value: number) => {
    setValues((prev) => ({
      ...prev,
      weight: value,
    }));
  }, []);

  const handleCategoryChange = useCallback((key: unknown) => {
    setValues((prev) => ({ ...prev, category: key as string }));
  }, []);

  const handleStatusChange = useCallback((key: unknown) => {
    setValues((prev) => ({ ...prev, status: key as string }));
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setSaveProgress(0);
    // Simulate save
    for (let i = 0; i <= 100; i += 20) {
      await new Promise((r) => setTimeout(r, 200));
      setSaveProgress(i);
    }
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  }, []);

  // Compute completion for the localized fields
  const nameCompletion =
    LANGUAGES.filter((l) => values.name[l]).length / LANGUAGES.length;

  return (
    <Stack direction="column" gap="600" maxW="2xl">
      {/* Back navigation */}
      <Button variant="ghost" colorPalette="primary" onPress={() => {}}>
        <Icon as={ArrowBack} />
        Back to Products
      </Button>

      {/* Page header */}
      <Stack direction="row" justify="space-between" align="center" gap="400">
        <Stack direction="row" align="center" gap="200">
          <Heading as="h1" size="lg">
            {values.name.en || "New Product"}
          </Heading>
          <Badge
            size="sm"
            colorPalette={
              values.status === "published" ? "positive" : "warning"
            }
          >
            {values.status}
          </Badge>
        </Stack>
        <Stack direction="row" gap="200">
          <Button variant="outline" colorPalette="primary" onPress={() => {}}>
            <Icon as={Close} />
            Discard
          </Button>
          <Button
            variant="solid"
            colorPalette="primary"
            onPress={handleSave}
            isDisabled={isSaving}
          >
            <Icon as={Check} />
            Save
          </Button>
        </Stack>
      </Stack>

      {/* Success notification */}
      {showSuccess && (
        <Alert.Root colorPalette="positive">
          <Alert.Description>
            Product saved successfully.{" "}
            <Link href="/products">Return to list</Link>
          </Alert.Description>
        </Alert.Root>
      )}

      {/* Save progress */}
      {isSaving && (
        <ProgressBar
          value={saveProgress}
          label={`Saving... ${saveProgress}%`}
        />
      )}

      {/* General information card */}
      <Card.Root>
        <Card.Body>
          <Stack direction="column" gap="400">
            <Heading as="h4" size="xs" fontWeight="medium">
              General Information
            </Heading>

            {/* Localized name — exercises LocalizedField (type="text") */}
            <Stack direction="column" gap="200">
              <Stack direction="row" gap="200" align="center">
                <Text fontSize="sm">
                  {`${Math.round(nameCompletion * 100)}% translated`}
                </Text>
                <ProgressBar
                  value={nameCompletion * 100}
                  layout="minimal"
                  aria-label="Translation completion"
                />
              </Stack>
              <LocalizedField
                type="text"
                label="Product Name"
                isRequired
                defaultLocaleOrCurrency="en"
                valuesByLocaleOrCurrency={values.name}
                errorsByLocaleOrCurrency={errors.name}
                onChange={handleLocalizedNameChange}
              />
            </Stack>

            {/* Localized description — exercises LocalizedField (type="multiLine") */}
            <LocalizedField
              type="multiLine"
              label="Description"
              defaultLocaleOrCurrency="en"
              valuesByLocaleOrCurrency={values.description}
              onChange={handleLocalizedDescriptionChange}
            />

            {/* Slug and SKU — narrow fields, matching original Constraints.Horizontal */}
            <Stack direction="row" gap="400">
              <TextInputField
                label="Slug"
                value={values.slug}
                onChange={(value) =>
                  setValues((prev) => ({ ...prev, slug: value }))
                }
                maxW="sm"
              />
              <TextInputField
                label="SKU"
                value={values.sku}
                onChange={(value) =>
                  setValues((prev) => ({ ...prev, sku: value }))
                }
                maxW="xs"
              />
            </Stack>
          </Stack>
        </Card.Body>
      </Card.Root>

      {/* Pricing and inventory card */}
      <Card.Root>
        <Card.Body>
          <Stack direction="column" gap="400">
            <Heading as="h4" size="xs" fontWeight="medium">
              Pricing &amp; Inventory
            </Heading>

            <Stack direction="row" gap="400" align="flex-end">
              {/* MoneyInput — exercises onValueChange(MoneyInputValue) */}
              <Stack direction="column" gap="100" maxW="xs">
                <Text as="label" fontSize="sm" fontWeight="medium">
                  Price
                </Text>
                <MoneyInput
                  value={values.price}
                  onValueChange={handlePriceChange}
                  currencies={["EUR", "USD", "GBP"]}
                  aria-label="Price"
                />
              </Stack>

              {/* NumberInput — exercises number-only onChange */}
              <Stack direction="column" gap="100" maxW="2xs">
                <Text as="label" fontSize="sm" fontWeight="medium">
                  Quantity
                </Text>
                <NumberInput
                  value={values.quantity}
                  onChange={handleQuantityChange}
                  minValue={0}
                  aria-label="Quantity"
                />
              </Stack>

              <Stack direction="column" gap="100" maxW="2xs">
                <Text as="label" fontSize="sm" fontWeight="medium">
                  Weight (kg)
                </Text>
                <NumberInput
                  value={values.weight}
                  onChange={handleWeightChange}
                  minValue={0}
                  step={0.1}
                  aria-label="Weight (kg)"
                />
              </Stack>
            </Stack>
          </Stack>
        </Card.Body>
      </Card.Root>

      {/* Classification card */}
      <Card.Root>
        <Card.Body>
          <Stack direction="column" gap="400">
            <Heading as="h4" size="xs" fontWeight="medium">
              Classification
            </Heading>

            <Stack direction="row" gap="400">
              <Stack direction="column" gap="100" maxW="xs">
                <Text as="label" fontSize="sm" fontWeight="medium">
                  Category
                </Text>
                <Select.Root
                  selectedKey={values.category}
                  onSelectionChange={handleCategoryChange}
                  aria-label="Category"
                >
                  <Select.Options>
                    {CATEGORY_OPTIONS.map((option) => (
                      <Select.Option key={option.value} id={option.value}>
                        {option.label}
                      </Select.Option>
                    ))}
                  </Select.Options>
                </Select.Root>
              </Stack>

              <Stack direction="column" gap="100" maxW="xs">
                <Text as="label" fontSize="sm" fontWeight="medium">
                  Status
                </Text>
                <Select.Root
                  selectedKey={values.status}
                  onSelectionChange={handleStatusChange}
                  aria-label="Status"
                >
                  <Select.Options>
                    {STATUS_OPTIONS.map((option) => (
                      <Select.Option key={option.value} id={option.value}>
                        {option.label}
                      </Select.Option>
                    ))}
                  </Select.Options>
                </Select.Root>
              </Stack>
            </Stack>

            <Stack direction="column" gap="100">
              <Text as="label" fontSize="sm" fontWeight="medium">
                Tags
              </Text>
              <TagGroup.Root aria-label="Tags" onRemove={() => {}}>
                <TagGroup.TagList>
                  <TagGroup.Tag id="cotton">Cotton</TagGroup.Tag>
                  <TagGroup.Tag id="premium">Premium</TagGroup.Tag>
                  <TagGroup.Tag id="summer">Summer</TagGroup.Tag>
                </TagGroup.TagList>
              </TagGroup.Root>
            </Stack>
          </Stack>
        </Card.Body>
      </Card.Root>

      {/* Warning notification */}
      <Alert.Root colorPalette="warning">
        <Alert.Description>
          <Stack direction="row" gap="200" align="center">
            <Icon as={Warning} aria-hidden="true" />
            <Text>
              This product has {LANGUAGES.filter((l) => !values.name[l]).length}{" "}
              missing translations.{" "}
              <Link
                href="https://docs.example.com/i18n"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more about translations
              </Link>
            </Text>
          </Stack>
        </Alert.Description>
      </Alert.Root>
    </Stack>
  );
}

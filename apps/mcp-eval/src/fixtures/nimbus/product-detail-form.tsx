/**
 * Realistic Merchant Center "Product Detail / Edit" form migrated to Nimbus.
 *
 * This fixture is the Nimbus counterpart of
 * `fixtures/uikit/product-detail-form.tsx` and covers migration patterns the
 * product-list-view fixture doesn't:
 *
 * - LocalizedField (type="text" / type="multiLine") replacing
 *   LocalizedTextInput / LocalizedMultilineTextInput
 * - MoneyInput's onValueChange adapter (value shape unchanged)
 * - NumberInput's numeric value/onChange (react-aria AriaNumberFieldProps)
 * - TextInputField (Field-level wrapper with built-in label/description/errors)
 * - Text / Heading size variants replacing Text.Body / Text.Headline /
 *   Text.Subheadline / Text.Detail
 * - Card compound slots (Card.Root / Card.Header / Card.Body)
 * - ProgressBar
 * - Collapsed Constraints.Horizontal + Spacings nesting into Stack/Box style
 *   props (maxW on the row, flex ratios on the children)
 * - Alert replacing ContentNotification (icon is automatic — no manual icon)
 * - Link with fontColor="primary" to preserve the legacy blue styling
 */

import { useCallback, useState } from "react";
import {
  Box,
  Stack,
  Text,
  Heading,
  Button,
  Icon,
  Card,
  Link,
  ProgressBar,
  Badge,
  TagGroup,
  Alert,
  Select,
  TextInputField,
  LocalizedField,
  MoneyInput,
  NumberInput,
  FieldErrors,
  type MoneyInputValue,
  type LocalizedString,
  type LocalizedFieldChangeEvent,
} from "@commercetools/nimbus";
import { ArrowBack, Check, Close } from "@commercetools/nimbus-icons";

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

interface TagItem {
  id: string;
  name: string;
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
    price: { amount: "2999", currencyCode: "EUR" },
    quantity: 150,
    weight: 0.2,
    category: "apparel",
    status: "published",
  });

  const [tags, setTags] = useState<TagItem[]>([
    { id: "cotton", name: "Cotton" },
    { id: "premium", name: "Premium" },
    { id: "summer", name: "Summer" },
  ]);

  // Kept for parity with the UIKit fixture's FieldErrors demonstration; never
  // populated here, so the error message never renders.
  const [errors] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // LocalizedField uses a LocalizedFieldChangeEvent with target.locale
  const handleLocalizedNameChange = useCallback(
    (event: LocalizedFieldChangeEvent) => {
      const locale = event.target.locale;
      if (!locale) return;
      setValues((prev) => ({
        ...prev,
        name: { ...prev.name, [locale]: (event.target.value as string) ?? "" },
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
          [locale]: (event.target.value as string) ?? "",
        },
      }));
    },
    []
  );

  // MoneyInput — prefer onValueChange over the deprecated onChange
  const handlePriceChange = useCallback((value: MoneyInputValue) => {
    setValues((prev) => ({ ...prev, price: value }));
  }, []);

  // NumberInput onChange receives a number value directly
  const handleQuantityChange = useCallback((value: number) => {
    setValues((prev) => ({ ...prev, quantity: value }));
  }, []);

  const handleWeightChange = useCallback((value: number) => {
    setValues((prev) => ({ ...prev, weight: value }));
  }, []);

  // Select onSelectionChange receives the selected key directly
  const handleCategoryChange = useCallback((key: string | number | null) => {
    if (key !== null) {
      setValues((prev) => ({ ...prev, category: String(key) }));
    }
  }, []);

  const handleStatusChange = useCallback((key: string | number | null) => {
    if (key !== null) {
      setValues((prev) => ({ ...prev, status: String(key) }));
    }
  }, []);

  const handleRemoveTags = useCallback((keys: Set<string | number>) => {
    setTags((prev) => prev.filter((tag) => !keys.has(tag.id)));
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
  const missingTranslationCount = LANGUAGES.filter(
    (l) => !values.name[l]
  ).length;

  return (
    <Stack direction="column" gap="600" maxW="2xl">
      {/* Back navigation */}
      <Button
        variant="ghost"
        colorPalette="primary"
        size="sm"
        onPress={() => {}}
        alignSelf="flex-start"
      >
        <Icon as={ArrowBack} size="2xs" />
        Back to Products
      </Button>

      {/* Page header */}
      <Stack direction="row" gap="400" align="center" justify="space-between">
        <Stack direction="row" gap="200" align="center">
          <Heading as="h1" size="lg">
            {values.name.en || "New Product"}
          </Heading>
          <Badge
            colorPalette={
              values.status === "published" ? "positive" : "warning"
            }
            size="sm"
          >
            {values.status}
          </Badge>
        </Stack>
        <Stack direction="row" gap="200">
          <Button variant="outline" colorPalette="primary" onPress={() => {}}>
            <Icon as={Close} size="2xs" />
            Discard
          </Button>
          <Button
            variant="solid"
            colorPalette="primary"
            onPress={handleSave}
            isDisabled={isSaving}
          >
            <Icon as={Check} size="2xs" />
            Save
          </Button>
        </Stack>
      </Stack>

      {/* Success notification — Alert selects its own icon from colorPalette */}
      {showSuccess && (
        <Alert.Root colorPalette="positive">
          <Alert.Description>
            Product saved successfully.{" "}
            <Link href="/products" fontColor="primary">
              Return to list
            </Link>
          </Alert.Description>
        </Alert.Root>
      )}

      {/* Save progress */}
      {isSaving && (
        <ProgressBar
          value={saveProgress}
          label="Saving…"
          valueLabel={`${saveProgress}%`}
        />
      )}

      {/* General information card */}
      <Card.Root>
        <Card.Header>
          <Heading as="h4" size="xs" fontWeight="medium">
            General Information
          </Heading>
        </Card.Header>
        <Card.Body>
          <Stack direction="column" gap="400" width="100%">
            {/* Localized name — exercises LocalizedField (type="text") */}
            <Stack direction="column" gap="100">
              <Stack direction="row" gap="200" align="center">
                <Text fontSize="sm">
                  {`${Math.round(nameCompletion * 100)}% translated`}
                </Text>
                <ProgressBar
                  size="2xs"
                  layout="minimal"
                  value={Math.round(nameCompletion * 100)}
                  valueLabel={`${Math.round(nameCompletion * 100)}%`}
                />
              </Stack>
              <LocalizedField
                type="text"
                label="Product Name"
                isRequired
                defaultLocaleOrCurrency="en"
                valuesByLocaleOrCurrency={values.name}
                onChange={handleLocalizedNameChange}
              />
              <FieldErrors errors={errors} />
            </Stack>

            {/* Localized description — exercises LocalizedField (type="multiLine") */}
            <LocalizedField
              type="multiLine"
              label="Description"
              defaultLocaleOrCurrency="en"
              valuesByLocaleOrCurrency={values.description}
              onChange={handleLocalizedDescriptionChange}
            />

            {/* Slug and SKU — constrained siblings share space via flex on a
                maxW row (collapses the old Constraints.Horizontal nesting) */}
            <Stack direction="row" gap="400" maxW="2xl" flexWrap="wrap">
              <Box flex="7">
                <TextInputField
                  label="Slug"
                  value={values.slug}
                  onChange={(value) =>
                    setValues((prev) => ({ ...prev, slug: value }))
                  }
                />
              </Box>
              <Box flex="5">
                <TextInputField
                  label="SKU"
                  value={values.sku}
                  onChange={(value) =>
                    setValues((prev) => ({ ...prev, sku: value }))
                  }
                />
              </Box>
            </Stack>
          </Stack>
        </Card.Body>
      </Card.Root>

      {/* Pricing and inventory card */}
      <Card.Root>
        <Card.Header>
          <Heading as="h4" size="xs" fontWeight="medium">
            Pricing &amp; Inventory
          </Heading>
        </Card.Header>
        <Card.Body>
          {/* MoneyInput and NumberInput — constrained siblings share space via
              per-input maxW constraints matching UIKit's width tokens */}
          <Stack
            direction="row"
            gap="400"
            alignItems="flex-end"
            flexWrap="wrap"
          >
            <Box maxW="xs">
              <Text as="label" fontSize="sm" fontWeight="medium">
                Price
              </Text>
              <MoneyInput
                value={values.price}
                onValueChange={handlePriceChange}
                currencies={["EUR", "USD", "GBP"]}
                isRequired
              />
            </Box>

            <Box maxW="2xs">
              <NumberInput
                label="Quantity"
                value={values.quantity}
                onChange={handleQuantityChange}
                minValue={0}
              />
            </Box>

            <Box maxW="2xs">
              <NumberInput
                label="Weight (kg)"
                value={values.weight}
                onChange={handleWeightChange}
                minValue={0}
                step={0.1}
              />
            </Box>
          </Stack>
        </Card.Body>
      </Card.Root>

      {/* Classification card */}
      <Card.Root>
        <Card.Header>
          <Heading as="h4" size="xs" fontWeight="medium">
            Classification
          </Heading>
        </Card.Header>
        <Card.Body>
          <Stack direction="column" gap="400" width="100%">
            <Stack direction="row" gap="400" maxW="2xl" flexWrap="wrap">
              <Box flex="1">
                <Stack direction="column" gap="100">
                  <Text
                    id="category-label"
                    as="label"
                    fontSize="sm"
                    fontWeight="medium"
                  >
                    Category
                  </Text>
                  <Select.Root
                    aria-labelledby="category-label"
                    selectedKey={values.category}
                    onSelectionChange={handleCategoryChange}
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
              </Box>

              <Box flex="1">
                <Stack direction="column" gap="100">
                  <Text
                    id="status-label"
                    as="label"
                    fontSize="sm"
                    fontWeight="medium"
                  >
                    Status
                  </Text>
                  <Select.Root
                    aria-labelledby="status-label"
                    selectedKey={values.status}
                    onSelectionChange={handleStatusChange}
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
              </Box>
            </Stack>

            <Stack direction="column" gap="100">
              <Text
                id="tags-label"
                as="label"
                fontSize="sm"
                fontWeight="medium"
              >
                Tags
              </Text>
              <TagGroup.Root
                aria-labelledby="tags-label"
                onRemove={handleRemoveTags}
              >
                <TagGroup.TagList items={tags}>
                  {(item) => <TagGroup.Tag>{item.name}</TagGroup.Tag>}
                </TagGroup.TagList>
              </TagGroup.Root>
            </Stack>
          </Stack>
        </Card.Body>
      </Card.Root>

      {/* Warning notification — Alert selects its own icon from colorPalette */}
      <Alert.Root colorPalette="warning">
        <Alert.Description>
          This product has {missingTranslationCount} missing translations.{" "}
          <Link
            href="https://docs.example.com/i18n"
            target="_blank"
            rel="noopener"
            fontColor="primary"
          >
            Learn more about translations
          </Link>
        </Alert.Description>
      </Alert.Root>
    </Stack>
  );
}

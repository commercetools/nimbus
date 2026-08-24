/**
 * Realistic Merchant Center "Product Detail / Edit" form built with Nimbus.
 *
 * Nimbus equivalent of `fixtures/uikit/product-detail-form.tsx`. Exercises the
 * migration patterns that fixture was designed to cover:
 *
 * - TextInputField (Field-level wrapper, `label` instead of `title`, string
 *   `onChange`)
 * - LocalizedField `type="text"` / `type="multiLine"` replacing
 *   LocalizedTextInput / LocalizedMultilineTextInput (single component,
 *   `valuesByLocaleOrCurrency` + `LocalizedFieldChangeEvent`)
 * - MoneyInput (`onValueChange` returns `{ amount, currencyCode }` directly)
 * - NumberInput (`onChange` returns a number directly)
 * - Select (`Select.Root` / `Select.Options` / `Select.Option`, selection by key)
 * - Button variants (`solid` + `colorPalette="primary"` for the primary action,
 *   `outline` for secondary, `ghost` for flat/back navigation)
 * - Card.Root / Card.Body (style-props-enabled target)
 * - ProgressBar, Badge, TagGroup, Link, Alert (renamed from ContentNotification)
 * - Nested Spacings.Inline/Stack + Constraints.Horizontal collapsed into
 *   Stack/Box with design-token gap and maxWidth values
 */

import { useCallback, useState } from "react";
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  FieldErrors,
  Heading,
  Icon,
  Link,
  LocalizedField,
  MoneyInput,
  NumberInput,
  ProgressBar,
  Select,
  Stack,
  TagGroup,
  Text,
  TextInputField,
  type LocalizedFieldChangeEvent,
  type LocalizedString,
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
  { id: "apparel", label: "Apparel" },
  { id: "footwear", label: "Footwear" },
  { id: "accessories", label: "Accessories" },
  { id: "electronics", label: "Electronics" },
];

const STATUS_OPTIONS = [
  { id: "draft", label: "Draft" },
  { id: "published", label: "Published" },
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

  const [errors] = useState<Record<string, Record<string, boolean>>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // LocalizedField reports the changed locale via event.target.locale
  const handleLocalizedNameChange = useCallback(
    (event: LocalizedFieldChangeEvent) => {
      const locale = String(event.target.locale);
      setValues((prev) => ({
        ...prev,
        name: { ...prev.name, [locale]: String(event.target.value ?? "") },
      }));
    },
    []
  );

  const handleLocalizedDescriptionChange = useCallback(
    (event: LocalizedFieldChangeEvent) => {
      const locale = String(event.target.locale);
      setValues((prev) => ({
        ...prev,
        description: {
          ...prev.description,
          [locale]: String(event.target.value ?? ""),
        },
      }));
    },
    []
  );

  // MoneyInput's modern API hands back the full { amount, currencyCode } value
  const handlePriceChange = useCallback((value: MoneyInputValue) => {
    setValues((prev) => ({ ...prev, price: value }));
  }, []);

  // NumberInput's onChange receives the numeric value directly
  const handleQuantityChange = useCallback((value: number) => {
    setValues((prev) => ({ ...prev, quantity: value }));
  }, []);

  const handleWeightChange = useCallback((value: number) => {
    setValues((prev) => ({ ...prev, weight: value }));
  }, []);

  // Select reports the selected key directly
  const handleCategoryChange = useCallback((key: React.Key | null) => {
    if (key != null) {
      setValues((prev) => ({ ...prev, category: String(key) }));
    }
  }, []);

  const handleStatusChange = useCallback((key: React.Key | null) => {
    if (key != null) {
      setValues((prev) => ({ ...prev, status: String(key) }));
    }
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
    <Box maxWidth="642px">
      <Stack direction="column" gap="600">
        {/* Back navigation */}
        <Button variant="ghost" onPress={() => {}} alignSelf="flex-start">
          <Icon as={ArrowBack} size="xs" />
          Back to Products
        </Button>

        {/* Page header */}
        <Stack direction="row" align="center" justify="space-between" gap="400">
          <Stack direction="row" align="center" gap="200">
            <Heading as="h1" size="lg">
              {values.name.en || "New Product"}
            </Heading>
            <Badge
              colorPalette={
                values.status === "published" ? "positive" : "warning"
              }
            >
              {values.status}
            </Badge>
          </Stack>
          <Stack direction="row" gap="200">
            <Button variant="outline" colorPalette="primary" onPress={() => {}}>
              <Icon as={Close} size="xs" />
              Discard
            </Button>
            <Button
              variant="solid"
              colorPalette="primary"
              onPress={handleSave}
              isDisabled={isSaving}
            >
              <Icon as={Check} size="xs" />
              Save
            </Button>
          </Stack>
        </Stack>

        {/* Success notification */}
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
            label={`Saving... ${saveProgress}%`}
          />
        )}

        {/* General information card */}
        <Card.Root>
          <Card.Body>
            <Stack direction="column" gap="400">
              <Heading as="h4" size="sm">
                General Information
              </Heading>

              {/* Localized name — exercises LocalizedField migration */}
              <Stack direction="column" gap="100">
                <Stack direction="row" align="center" gap="200">
                  <Text fontSize="sm">
                    {`${Math.round(nameCompletion * 100)}% translated`}
                  </Text>
                  <ProgressBar value={nameCompletion * 100} />
                </Stack>
                <LocalizedField
                  type="text"
                  label="Product Name"
                  isRequired
                  defaultLocaleOrCurrency="en"
                  valuesByLocaleOrCurrency={values.name}
                  onChange={handleLocalizedNameChange}
                />
                {errors.name && <FieldErrors errors={errors.name} />}
              </Stack>

              {/* Localized description */}
              <LocalizedField
                type="multiLine"
                label="Description"
                defaultLocaleOrCurrency="en"
                valuesByLocaleOrCurrency={values.description}
                onChange={handleLocalizedDescriptionChange}
              />

              {/* Slug and SKU — collapsed Constraints.Horizontal widths */}
              <Stack direction="row" gap="400">
                <Box maxWidth="460px" flex="1">
                  <TextInputField
                    label="Slug"
                    value={values.slug}
                    onChange={(value) =>
                      setValues((prev) => ({ ...prev, slug: value }))
                    }
                  />
                </Box>
                <Box maxWidth="320px" flex="1">
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
          <Card.Body>
            <Stack direction="column" gap="400">
              <Heading as="h4" size="sm">
                Pricing &amp; Inventory
              </Heading>

              <Stack direction="row" gap="400" align="flex-end">
                {/* MoneyInput — exercises the onValueChange adapter */}
                <Box flex="1" maxWidth="460px">
                  <Stack direction="column" gap="100">
                    <Text fontSize="sm" fontWeight="medium">
                      Price *
                    </Text>
                    <MoneyInput
                      value={values.price}
                      onValueChange={handlePriceChange}
                      currencies={["EUR", "USD", "GBP"]}
                      isRequired
                    />
                  </Stack>
                </Box>

                {/* NumberInput — exercises the numeric onChange adapter */}
                <Box flex="1" maxWidth="320px">
                  <NumberInput
                    label="Quantity"
                    value={values.quantity}
                    onChange={handleQuantityChange}
                    minValue={0}
                  />
                </Box>

                <Box flex="1" maxWidth="320px">
                  <NumberInput
                    label="Weight (kg)"
                    value={values.weight}
                    onChange={handleWeightChange}
                    minValue={0}
                    step={0.1}
                  />
                </Box>
              </Stack>
            </Stack>
          </Card.Body>
        </Card.Root>

        {/* Classification card */}
        <Card.Root>
          <Card.Body>
            <Stack direction="column" gap="400">
              <Heading as="h4" size="sm">
                Classification
              </Heading>

              <Stack direction="row" gap="400">
                <Box maxWidth="284px" flex="1">
                  <Stack direction="column" gap="100">
                    <Text fontSize="sm" fontWeight="medium">
                      Category
                    </Text>
                    <Select.Root
                      selectedKey={values.category}
                      onSelectionChange={handleCategoryChange}
                      aria-label="Category"
                    >
                      <Select.Options>
                        {CATEGORY_OPTIONS.map((option) => (
                          <Select.Option key={option.id} id={option.id}>
                            {option.label}
                          </Select.Option>
                        ))}
                      </Select.Options>
                    </Select.Root>
                  </Stack>
                </Box>

                <Box maxWidth="284px" flex="1">
                  <Stack direction="column" gap="100">
                    <Text fontSize="sm" fontWeight="medium">
                      Status
                    </Text>
                    <Select.Root
                      selectedKey={values.status}
                      onSelectionChange={handleStatusChange}
                      aria-label="Status"
                    >
                      <Select.Options>
                        {STATUS_OPTIONS.map((option) => (
                          <Select.Option key={option.id} id={option.id}>
                            {option.label}
                          </Select.Option>
                        ))}
                      </Select.Options>
                    </Select.Root>
                  </Stack>
                </Box>
              </Stack>

              <Stack direction="column" gap="100">
                <Text fontSize="sm" fontWeight="medium">
                  Tags
                </Text>
                <TagGroup.Root aria-label="Tags" onRemove={() => {}}>
                  <TagGroup.TagList>
                    <TagGroup.Tag>Cotton</TagGroup.Tag>
                    <TagGroup.Tag>Premium</TagGroup.Tag>
                    <TagGroup.Tag>Summer</TagGroup.Tag>
                  </TagGroup.TagList>
                </TagGroup.Root>
              </Stack>
            </Stack>
          </Card.Body>
        </Card.Root>

        {/* Warning notification */}
        <Alert.Root colorPalette="warning">
          <Alert.Description>
            <Stack direction="row" align="center" gap="200">
              <Icon as={Warning} size="xs" />
              <Text>
                This product has{" "}
                {LANGUAGES.filter((l) => !values.name[l]).length} missing
                translations.{" "}
                <Link
                  href="https://docs.example.com/i18n"
                  target="_blank"
                  rel="noopener"
                  fontColor="primary"
                >
                  Learn more about translations
                </Link>
              </Text>
            </Stack>
          </Alert.Description>
        </Alert.Root>
      </Stack>
    </Box>
  );
}

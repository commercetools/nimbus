/**
 * Realistic Merchant Center "Product Detail / Edit" form built with Nimbus.
 *
 * This is the Nimbus equivalent of ../uikit/product-detail-form.tsx and
 * exercises the same migration surface:
 *
 * - LocalizedField (type="text" / type="multiLine") replacing
 *   LocalizedTextInput / LocalizedMultilineTextInput
 * - MoneyInput's onValueChange callback (value: MoneyInputValue)
 * - NumberInput's onChange callback (value: number, not ChangeEvent)
 * - TextInputField (pre-composed label + input + error field wrapper)
 * - Text textStyle variants replacing Text.Body / Text.Headline / Text.Subheadline / Text.Detail
 * - Card.Root / Card.Body (style-props-enabled target)
 * - ProgressBar
 * - Stack / Box replacing nested Spacings.Inset / Spacings.InsetSquish (layout collapse)
 * - Alert replacing ContentNotification (auto-renders its own icon per colorPalette)
 * - Link
 */

import { useCallback, useState } from "react";
import type { Key } from "react-aria-components";
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Icon,
  Link,
  LocalizedField,
  type LocalizedFieldChangeEvent,
  MoneyInput,
  type MoneyInputValue,
  NumberInput,
  ProgressBar,
  Select,
  Stack,
  TagGroup,
  Text,
  TextInputField,
} from "@commercetools/nimbus";
import { ArrowBack, Check, Close } from "@commercetools/nimbus-icons";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LocalizedString {
  en: string;
  de: string;
  fr: string;
  [locale: string]: string | undefined;
}

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
  { id: "apparel", name: "Apparel" },
  { id: "footwear", name: "Footwear" },
  { id: "accessories", name: "Accessories" },
  { id: "electronics", name: "Electronics" },
];

const STATUS_OPTIONS = [
  { id: "draft", name: "Draft" },
  { id: "published", name: "Published" },
];

const INITIAL_TAGS = [
  { id: "cotton", name: "Cotton" },
  { id: "premium", name: "Premium" },
  { id: "summer", name: "Summer" },
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

  const [tags, setTags] = useState(INITIAL_TAGS);
  const [errors] = useState<Record<string, Record<string, boolean>>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // LocalizedField uses a standardized change event shape with target.locale
  const handleLocalizedNameChange = useCallback(
    (event: LocalizedFieldChangeEvent) => {
      const locale = event.target.locale as keyof LocalizedString;
      setValues((prev) => ({
        ...prev,
        name: { ...prev.name, [locale]: event.target.value as string },
      }));
    },
    []
  );

  const handleLocalizedDescriptionChange = useCallback(
    (event: LocalizedFieldChangeEvent) => {
      const locale = event.target.locale as keyof LocalizedString;
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

  // MoneyInput's modern API calls back with the full value directly
  const handlePriceChange = useCallback((value: MoneyInputValue) => {
    setValues((prev) => ({ ...prev, price: value }));
  }, []);

  // NumberInput's onChange receives a number directly, no event to unwrap
  const handleQuantityChange = useCallback((value: number) => {
    setValues((prev) => ({ ...prev, quantity: value }));
  }, []);

  const handleWeightChange = useCallback((value: number) => {
    setValues((prev) => ({ ...prev, weight: value }));
  }, []);

  // Select's onSelectionChange receives the selected key directly
  const handleCategoryChange = useCallback((key: Key) => {
    setValues((prev) => ({ ...prev, category: String(key) }));
  }, []);

  const handleStatusChange = useCallback((key: Key) => {
    setValues((prev) => ({ ...prev, status: String(key) }));
  }, []);

  const handleRemoveTag = useCallback((keys: Set<Key>) => {
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
    LANGUAGES.filter((l) => values.name[l as keyof LocalizedString]).length /
    LANGUAGES.length;

  return (
    <Box maxW="1200px">
      <Stack gap="600">
        {/* Back navigation */}
        <Stack direction="row" gap="200" align="center">
          <Button variant="ghost" onPress={() => {}}>
            <Icon as={ArrowBack} />
            Back to Products
          </Button>
        </Stack>

        {/* Page header */}
        <Stack direction="row" gap="400" align="center" justify="space-between">
          <Stack direction="row" gap="200" align="center">
            <Text as="h1" textStyle="2xl" fontWeight="bold">
              {values.name.en || "New Product"}
            </Text>
            <Badge
              colorPalette={
                values.status === "published" ? "positive" : "warning"
              }
            >
              {values.status}
            </Badge>
          </Stack>
          <Stack direction="row" gap="200">
            <Button variant="outline" onPress={() => {}}>
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
          <Alert.Root colorPalette="positive" variant="outlined">
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
            <Stack gap="400">
              <Text as="h4" textStyle="xl">
                General Information
              </Text>

              {/* Localized name — exercises LocalizedTextInput migration */}
              <Stack gap="100">
                <Stack direction="row" gap="200" align="center">
                  <Text textStyle="sm">
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
                  errorsByLocaleOrCurrency={errors.name}
                />
              </Stack>

              {/* Localized description */}
              <LocalizedField
                type="multiLine"
                label="Description"
                defaultLocaleOrCurrency="en"
                valuesByLocaleOrCurrency={values.description}
                onChange={handleLocalizedDescriptionChange}
              />

              {/* Slug and SKU — inline, width-constrained via Box maxW */}
              <Stack direction="row" gap="400">
                <Box maxW="360px">
                  <TextInputField
                    label="Slug"
                    value={values.slug}
                    onChange={(value) =>
                      setValues((prev) => ({ ...prev, slug: value }))
                    }
                  />
                </Box>
                <Box maxW="280px">
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
            <Stack gap="400">
              <Text as="h4" textStyle="xl">
                Pricing &amp; Inventory
              </Text>

              <Stack direction="row" gap="400" align="flex-end">
                {/* MoneyInput — exercises onValueChange adapter */}
                <Box maxW="320px">
                  <Stack gap="100">
                    <Text as="label" textStyle="sm" fontWeight="medium">
                      Price
                    </Text>
                    <MoneyInput
                      value={values.price}
                      onValueChange={handlePriceChange}
                      currencies={["EUR", "USD", "GBP"]}
                      isRequired
                    />
                  </Stack>
                </Box>

                {/* NumberInput — exercises onChange adapter */}
                <Box maxW="200px">
                  <Stack gap="100">
                    <Text as="label" textStyle="sm" fontWeight="medium">
                      Quantity
                    </Text>
                    <NumberInput
                      value={values.quantity}
                      onChange={handleQuantityChange}
                      minValue={0}
                    />
                  </Stack>
                </Box>

                <Box maxW="200px">
                  <Stack gap="100">
                    <Text as="label" textStyle="sm" fontWeight="medium">
                      Weight (kg)
                    </Text>
                    <NumberInput
                      value={values.weight}
                      onChange={handleWeightChange}
                      minValue={0}
                      step={0.1}
                    />
                  </Stack>
                </Box>
              </Stack>
            </Stack>
          </Card.Body>
        </Card.Root>

        {/* Classification card */}
        <Card.Root>
          <Card.Body>
            <Stack gap="400">
              <Text as="h4" textStyle="xl">
                Classification
              </Text>

              <Stack direction="row" gap="400">
                <Box maxW="320px">
                  <Stack gap="100">
                    <Text as="label" textStyle="sm" fontWeight="medium">
                      Category
                    </Text>
                    <Select.Root
                      aria-label="Category"
                      selectedKey={values.category}
                      onSelectionChange={handleCategoryChange}
                    >
                      <Select.Options items={CATEGORY_OPTIONS}>
                        {(item) => (
                          <Select.Option id={item.id}>
                            {item.name}
                          </Select.Option>
                        )}
                      </Select.Options>
                    </Select.Root>
                  </Stack>
                </Box>

                <Box maxW="320px">
                  <Stack gap="100">
                    <Text as="label" textStyle="sm" fontWeight="medium">
                      Status
                    </Text>
                    <Select.Root
                      aria-label="Status"
                      selectedKey={values.status}
                      onSelectionChange={handleStatusChange}
                    >
                      <Select.Options items={STATUS_OPTIONS}>
                        {(item) => (
                          <Select.Option id={item.id}>
                            {item.name}
                          </Select.Option>
                        )}
                      </Select.Options>
                    </Select.Root>
                  </Stack>
                </Box>
              </Stack>

              <Stack gap="100">
                <Text as="label" textStyle="sm" fontWeight="medium">
                  Tags
                </Text>
                <TagGroup.Root
                  aria-label="Product tags"
                  selectionMode="none"
                  onRemove={handleRemoveTag}
                >
                  <TagGroup.TagList items={tags}>
                    {(tag) => <TagGroup.Tag>{tag.name}</TagGroup.Tag>}
                  </TagGroup.TagList>
                </TagGroup.Root>
              </Stack>
            </Stack>
          </Card.Body>
        </Card.Root>

        {/* Warning notification — Alert renders its own icon based on colorPalette */}
        <Alert.Root colorPalette="warning" variant="outlined">
          <Alert.Description>
            This product has{" "}
            {
              LANGUAGES.filter((l) => !values.name[l as keyof LocalizedString])
                .length
            }{" "}
            missing translations.{" "}
            <Link
              href="https://docs.example.com/i18n"
              target="_blank"
              rel="noopener"
            >
              Learn more about translations
            </Link>
          </Alert.Description>
        </Alert.Root>
      </Stack>
    </Box>
  );
}

/**
 * Realistic Merchant Center "Product Detail / Edit" form built entirely with
 * Nimbus.
 *
 * This is the migrated counterpart of `fixtures/uikit/product-detail-form.tsx`,
 * exercising the same set of tricky migration patterns:
 *
 * - LocalizedField (type="text" / type="multiLine") replacing
 *   LocalizedTextInput / LocalizedMultilineTextInput — width="100%" so the
 *   field fills its card, collapse behavior stays built-in (no
 *   displayAllLocalesOrCurrencies)
 * - MoneyInput (onValueChange adapter replacing the UI Kit TCustomEvent shape)
 * - NumberInputField (pre-composed field, number-typed value/onChange
 *   replacing the UI Kit ChangeEvent<HTMLInputElement> adapter)
 * - TextInputField (label/description/errors slots replacing title/hint/errors)
 * - Heading / Text (replacing Text.Headline / Text.Subheadline / Text.Detail /
 *   Text.Body / Label)
 * - Card (compound Card.Root/Card.Body slots)
 * - ProgressBar
 * - Stack/Box (replacing nested Spacings.Inline / Spacings.Stack /
 *   Constraints.Horizontal — collapsed per the migration's layout guidance,
 *   using flex on row children instead of re-wrapping each child)
 * - Alert (replacing ContentNotification, with built-in icon selection)
 * - Link
 * - Badge / TagGroup (style-props-enabled Nimbus targets)
 */

import { useCallback, useState } from "react";
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Heading,
  Icon,
  Link,
  LocalizedField,
  MoneyInput,
  NumberInputField,
  ProgressBar,
  Select,
  Stack,
  TagGroup,
  Text,
  TextInputField,
  type CurrencyCode,
  type LocalizedFieldChangeEvent,
} from "@commercetools/nimbus";
import { ArrowBack, Check, Close } from "@commercetools/nimbus-icons";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LocalizedString {
  [locale: string]: string;
  en: string;
  de: string;
  fr: string;
}

interface MoneyValue {
  amount: string;
  currencyCode: CurrencyCode | "";
}

interface ProductFormValues {
  name: LocalizedString;
  description: LocalizedString;
  slug: string;
  sku: string;
  price: MoneyValue;
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

const INITIAL_TAGS: TagItem[] = [
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

  const [errors] = useState<Record<string, Record<string, boolean>>>({});
  const [tags, setTags] = useState<TagItem[]>(INITIAL_TAGS);
  const [isSaving, setIsSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // LocalizedField has a unique change event shape — target.locale identifies
  // which locale changed instead of the UI Kit target.name.split(".")[1].
  const handleLocalizedNameChange = useCallback(
    (event: LocalizedFieldChangeEvent) => {
      const locale = event.target.locale;
      if (!locale) return;
      setValues((prev) => ({
        ...prev,
        name: { ...prev.name, [locale]: String(event.target.value ?? "") },
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
          [locale]: String(event.target.value ?? ""),
        },
      }));
    },
    []
  );

  // MoneyInput's modern onValueChange receives the value directly.
  const handlePriceChange = useCallback((value: MoneyValue) => {
    setValues((prev) => ({ ...prev, price: value }));
  }, []);

  // NumberInputField onChange receives a number directly.
  const handleQuantityChange = useCallback((value: number) => {
    setValues((prev) => ({ ...prev, quantity: value }));
  }, []);

  const handleWeightChange = useCallback((value: number) => {
    setValues((prev) => ({ ...prev, weight: value }));
  }, []);

  const handleCategoryChange = useCallback((key: string | null) => {
    setValues((prev) => ({ ...prev, category: key ?? prev.category }));
  }, []);

  const handleStatusChange = useCallback((key: string | null) => {
    setValues((prev) => ({ ...prev, status: key ?? prev.status }));
  }, []);

  const handleRemoveTag = useCallback((keys: Set<string | number>) => {
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
  const missingTranslations = LANGUAGES.filter(
    (l) => !values.name[l as keyof LocalizedString]
  ).length;
  const nameCompletion =
    (LANGUAGES.length - missingTranslations) / LANGUAGES.length;

  return (
    <Box maxW="2xl">
      <Stack direction="column" gap="600">
        {/* Back navigation */}
        <Box>
          <Button variant="ghost" size="sm" colorPalette="primary">
            <Icon as={ArrowBack} size="2xs" color="neutral.11" />
            Back to Products
          </Button>
        </Box>

        {/* Page header */}
        <Stack
          direction="row"
          gap="400"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
        >
          <Stack direction="row" gap="200" alignItems="center">
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
          <Stack direction="row" gap="200" flexWrap="wrap">
            <Button variant="outline" colorPalette="primary">
              <Icon as={Close} size="2xs" color="neutral.11" />
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
              <Heading as="h4" size="xs" fontWeight="medium">
                General Information
              </Heading>

              {/* Localized name — exercises LocalizedField (type="text") migration */}
              <Stack direction="column" gap="100">
                <Stack direction="row" gap="200" alignItems="center">
                  <Text fontSize="sm">
                    {`${Math.round(nameCompletion * 100)}% translated`}
                  </Text>
                  <ProgressBar value={nameCompletion * 100} size="2xs" />
                </Stack>
                <LocalizedField
                  type="text"
                  label="Product Name"
                  isRequired
                  width="100%"
                  defaultLocaleOrCurrency="en"
                  valuesByLocaleOrCurrency={values.name}
                  onChange={handleLocalizedNameChange}
                  errors={errors.name}
                />
              </Stack>

              {/* Localized description — exercises LocalizedField (type="multiLine") */}
              <LocalizedField
                type="multiLine"
                label="Description"
                width="100%"
                defaultLocaleOrCurrency="en"
                valuesByLocaleOrCurrency={values.description}
                onChange={handleLocalizedDescriptionChange}
              />

              {/* Slug and SKU — a row of constrained siblings uses flex on the
                  children instead of re-wrapping each one individually */}
              <Stack direction="row" gap="400" flexWrap="wrap">
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
          <Card.Body>
            <Stack direction="column" gap="400">
              <Heading as="h4" size="xs" fontWeight="medium">
                Pricing & Inventory
              </Heading>

              <Stack
                direction="row"
                gap="400"
                alignItems="flex-end"
                flexWrap="wrap"
              >
                {/* MoneyInput — exercises the onValueChange adapter */}
                <Box flex="6">
                  <Stack direction="column" gap="100">
                    <Text
                      id="product-price-label"
                      as="label"
                      fontSize="sm"
                      fontWeight="medium"
                    >
                      Price
                    </Text>
                    <MoneyInput
                      aria-labelledby="product-price-label"
                      value={values.price}
                      onValueChange={handlePriceChange}
                      currencies={["EUR", "USD", "GBP"]}
                      isRequired
                    />
                  </Stack>
                </Box>

                {/* NumberInputField — exercises the numeric value/onChange adapter */}
                <Box flex="4">
                  <NumberInputField
                    label="Quantity"
                    value={values.quantity}
                    onChange={handleQuantityChange}
                    minValue={0}
                  />
                </Box>

                <Box flex="4">
                  <NumberInputField
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
              <Heading as="h4" size="xs" fontWeight="medium">
                Classification
              </Heading>

              <Stack direction="row" gap="400" flexWrap="wrap">
                <Box flex="6">
                  <Stack direction="column" gap="100">
                    <Text
                      id="product-category-label"
                      as="label"
                      fontSize="sm"
                      fontWeight="medium"
                    >
                      Category
                    </Text>
                    <Select.Root
                      aria-labelledby="product-category-label"
                      selectedKey={values.category}
                      onSelectionChange={(key) =>
                        handleCategoryChange(key ? String(key) : null)
                      }
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

                <Box flex="6">
                  <Stack direction="column" gap="100">
                    <Text
                      id="product-status-label"
                      as="label"
                      fontSize="sm"
                      fontWeight="medium"
                    >
                      Status
                    </Text>
                    <Select.Root
                      aria-labelledby="product-status-label"
                      selectedKey={values.status}
                      onSelectionChange={(key) =>
                        handleStatusChange(key ? String(key) : null)
                      }
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
                  id="product-tags-label"
                  as="label"
                  fontSize="sm"
                  fontWeight="medium"
                >
                  Tags
                </Text>
                <TagGroup.Root
                  aria-labelledby="product-tags-label"
                  onRemove={handleRemoveTag}
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
            This product has {missingTranslations} missing translations.{" "}
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
    </Box>
  );
}

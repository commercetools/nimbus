/**
 * Realistic Merchant Center "Product Detail / Edit" form built entirely with
 * Nimbus.
 *
 * This is the migrated counterpart of `fixtures/uikit/product-detail-form.tsx`.
 * It exercises the trickiest migration patterns from that fixture:
 *
 * - TextInputField / MultilineTextInputField in spirit (here: TextInputField
 *   for Slug/SKU) — label/description/errors replace title/hint/errors
 * - LocalizedField (type="text" | "multiLine") replacing
 *   LocalizedTextInput/LocalizedMultilineTextInput — collapse-by-default,
 *   LocalizedFieldChangeEvent with target.locale
 * - MoneyInput with onValueChange (MoneyInputValue) replacing the old
 *   TCustomEvent-based onChange
 * - NumberInput with a numeric value/onChange replacing the
 *   ChangeEvent<HTMLInputElement> adapter, plus its own built-in label
 * - Select.Root / Select.Options / Select.Option replacing SelectInput's
 *   options array + TCustomEvent onChange
 * - Card.Root / Card.Body replacing the single-slot Card
 * - Alert.Root/.Description replacing ContentNotification (built-in status
 *   icon — no manual WarningIcon/InformationIcon needed)
 * - TagGroup.Root/.TagList/.Tag replacing a standalone Tag, with
 *   onRemove receiving a Set<Key>
 * - Stack (direction="row"|"column") replacing Spacings.Inline/Stack, with
 *   flexWrap="wrap" on rows holding multiple inputs
 * - maxW style props applied directly on inputs, replacing
 *   Constraints.Horizontal wrappers
 * - FieldErrors for standalone error display; Badge for the status stamp
 * - Button (variant + colorPalette="primary", icon as children) replacing
 *   PrimaryButton/SecondaryButton/FlatButton
 * - Link with fontColor="primary" replacing the default-blue UI Kit Link
 */

import { useCallback, useState } from "react";
import {
  Button,
  TextInputField,
  LocalizedField,
  type LocalizedFieldChangeEvent,
  MoneyInput,
  type MoneyInputValue,
  NumberInput,
  Select,
  Alert,
  FieldErrors,
  Text,
  Heading,
  Card,
  Link,
  ProgressBar,
  Badge,
  TagGroup,
  Stack,
} from "@commercetools/nimbus";
import { ArrowBack, Check, Close } from "@commercetools/nimbus-icons";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LocalizedString {
  en: string;
  de: string;
  fr: string;
  [locale: string]: string;
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

  const [tags, setTags] = useState<string[]>(["Cotton", "Premium", "Summer"]);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // LocalizedField reports which locale changed via event.target.locale
  const handleLocalizedNameChange = useCallback(
    (event: LocalizedFieldChangeEvent) => {
      const locale = event.target.locale as keyof LocalizedString;
      setValues((prev) => ({
        ...prev,
        name: { ...prev.name, [locale]: (event.target.value as string) ?? "" },
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
          [locale]: (event.target.value as string) ?? "",
        },
      }));
    },
    []
  );

  // MoneyInput's modern onValueChange receives the full value directly
  const handlePriceChange = useCallback((value: MoneyInputValue) => {
    setValues((prev) => ({ ...prev, price: value }));
  }, []);

  // NumberInput's onChange receives a number directly
  const handleQuantityChange = useCallback((value: number) => {
    setValues((prev) => ({ ...prev, quantity: value }));
  }, []);

  const handleWeightChange = useCallback((value: number) => {
    setValues((prev) => ({ ...prev, weight: value }));
  }, []);

  // Select's onSelectionChange receives the selected key directly
  const handleCategoryChange = useCallback((key: string | number | null) => {
    setValues((prev) => ({ ...prev, category: (key as string) ?? "apparel" }));
  }, []);

  const handleStatusChange = useCallback((key: string | number | null) => {
    setValues((prev) => ({ ...prev, status: (key as string) ?? "draft" }));
  }, []);

  // TagGroup's onRemove receives a Set of removed tag keys
  const handleRemoveTag = useCallback((keys: Set<string | number>) => {
    setTags((prev) => prev.filter((tag) => !keys.has(tag)));
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

  // Compute completion for the localized name field
  const nameCompletion =
    LANGUAGES.filter((l) => values.name[l as keyof LocalizedString]).length /
    LANGUAGES.length;

  const missingTranslationCount = LANGUAGES.filter(
    (l) => !values.name[l as keyof LocalizedString]
  ).length;

  return (
    <Stack direction="column" gap="600" maxW="2xl">
      {/* Back navigation */}
      <Button variant="ghost" colorPalette="primary" onPress={() => {}}>
        <ArrowBack />
        Back to Products
      </Button>

      {/* Page header */}
      <Stack
        direction="row"
        gap="400"
        alignItems="center"
        justify="space-between"
        flexWrap="wrap"
      >
        <Stack direction="row" gap="200" alignItems="center">
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
            <Close />
            Discard
          </Button>
          <Button
            variant="solid"
            colorPalette="primary"
            onPress={handleSave}
            isDisabled={isSaving}
          >
            <Check />
            Save
          </Button>
        </Stack>
      </Stack>

      {/* Success notification */}
      {showSuccess && (
        <Alert.Root colorPalette="positive" variant="outlined">
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

            {/* Localized name — exercises the LocalizedField migration */}
            <Stack direction="column" gap="100">
              <Text as="label" textStyle="sm" fontWeight="medium">
                Product Name
              </Text>
              <Stack direction="row" gap="200" alignItems="center">
                <Text textStyle="sm">
                  {`${Math.round(nameCompletion * 100)}% translated`}
                </Text>
                <ProgressBar value={nameCompletion * 100} size="2xs" />
              </Stack>
              <LocalizedField
                type="text"
                isRequired
                aria-label="Product Name"
                defaultLocaleOrCurrency="en"
                valuesByLocaleOrCurrency={values.name}
                onChange={handleLocalizedNameChange}
              />
              {errors.name && <FieldErrors errors={errors} />}
            </Stack>

            {/* Localized description */}
            <LocalizedField
              type="multiLine"
              label="Description"
              defaultLocaleOrCurrency="en"
              valuesByLocaleOrCurrency={values.description}
              onChange={handleLocalizedDescriptionChange}
            />

            {/* Slug and SKU — maxW replaces Constraints.Horizontal */}
            <Stack direction="row" gap="400" flexWrap="wrap">
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
              Pricing & Inventory
            </Heading>

            <Stack
              direction="row"
              gap="400"
              alignItems="flex-end"
              flexWrap="wrap"
            >
              {/* MoneyInput — exercises the onValueChange adapter */}
              <Stack direction="column" gap="100">
                <Text as="label" textStyle="sm" fontWeight="medium">
                  Price
                </Text>
                <MoneyInput
                  value={values.price}
                  onValueChange={handlePriceChange}
                  currencies={["EUR", "USD", "GBP"]}
                  isRequired
                  maxW="xs"
                />
              </Stack>

              {/* NumberInput — exercises the numeric value/onChange adapter */}
              <NumberInput
                label="Quantity"
                value={values.quantity}
                onChange={handleQuantityChange}
                minValue={0}
                maxW="2xs"
              />

              <NumberInput
                label="Weight (kg)"
                value={values.weight}
                onChange={handleWeightChange}
                minValue={0}
                step={0.1}
                maxW="2xs"
              />
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
              <Stack direction="column" gap="100">
                <Text as="label" textStyle="sm" fontWeight="medium">
                  Category
                </Text>
                <Select.Root
                  selectedKey={values.category}
                  onSelectionChange={handleCategoryChange}
                  aria-label="Category"
                  maxW="xs"
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

              <Stack direction="column" gap="100">
                <Text as="label" textStyle="sm" fontWeight="medium">
                  Status
                </Text>
                <Select.Root
                  selectedKey={values.status}
                  onSelectionChange={handleStatusChange}
                  aria-label="Status"
                  maxW="xs"
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
              <Text as="label" textStyle="sm" fontWeight="medium">
                Tags
              </Text>
              <TagGroup.Root
                aria-label="Product tags"
                onRemove={handleRemoveTag}
              >
                <TagGroup.TagList>
                  {tags.map((tag) => (
                    <TagGroup.Tag key={tag}>{tag}</TagGroup.Tag>
                  ))}
                </TagGroup.TagList>
              </TagGroup.Root>
            </Stack>
          </Stack>
        </Card.Body>
      </Card.Root>

      {/* Warning notification — Alert renders its own status icon */}
      <Alert.Root colorPalette="warning" variant="outlined">
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

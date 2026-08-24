/**
 * Realistic Merchant Center "Product Detail / Edit" form built with UI Kit.
 *
 * This fixture covers migration patterns the product-list-view doesn't:
 *
 * - LocalizedTextInput / LocalizedMultilineTextInput (localized field handling)
 * - MoneyInput (MoneyInputValue callback adapter)
 * - NumberInput (event→value callback adapter)
 * - TextField / MultilineTextField (Field-level wrappers)
 * - Text.Body / Text.Headline / Text.Subheadline / Text.Detail (text variants)
 * - Card (style-props-enabled target)
 * - ProgressBar
 * - Nested Spacings.Inset / Spacings.InsetSquish (layout collapse)
 * - ContentNotification (mapped to Alert)
 * - Link
 */

import React, { useState, useCallback } from "react";
import TextField from "@commercetools-uikit/text-field";
import MultilineTextField from "@commercetools-uikit/multiline-text-field";
import LocalizedTextInput from "@commercetools-uikit/localized-text-input";
import LocalizedMultilineTextInput from "@commercetools-uikit/localized-multiline-text-input";
import MoneyInput from "@commercetools-uikit/money-input";
import NumberInput from "@commercetools-uikit/number-input";
import SelectInput from "@commercetools-uikit/select-input";
import PrimaryButton from "@commercetools-uikit/primary-button";
import SecondaryButton from "@commercetools-uikit/secondary-button";
import FlatButton from "@commercetools-uikit/flat-button";
import ContentNotification from "@commercetools-uikit/content-notification";
import FieldErrors from "@commercetools-uikit/field-errors";
import Text from "@commercetools-uikit/text";
import Label from "@commercetools-uikit/label";
import Card from "@commercetools-uikit/card";
import Link from "@commercetools-uikit/link";
import ProgressBar from "@commercetools-uikit/progress-bar";
import Stamp from "@commercetools-uikit/stamp";
import Tag from "@commercetools-uikit/tag";
import Spacings from "@commercetools-uikit/spacings";
import Constraints from "@commercetools-uikit/constraints";
import {
  BackIcon,
  CheckBoldIcon,
  CloseBoldIcon,
  InformationIcon,
  WarningIcon,
} from "@commercetools-uikit/icons";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LocalizedString {
  en: string;
  de: string;
  fr: string;
}

interface MoneyValue {
  amount: string;
  currencyCode: string;
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

  const [errors, setErrors] = useState<Record<string, Record<string, string>>>(
    {}
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // LocalizedTextInput has a unique onChange shape
  const handleLocalizedNameChange = useCallback(
    (event: { target: { name: string; value: string } }) => {
      const language = event.target.name.split(".")[1];
      setValues((prev) => ({
        ...prev,
        name: { ...prev.name, [language]: event.target.value },
      }));
    },
    []
  );

  const handleLocalizedDescriptionChange = useCallback(
    (event: { target: { name: string; value: string } }) => {
      const language = event.target.name.split(".")[1];
      setValues((prev) => ({
        ...prev,
        description: {
          ...prev.description,
          [language]: event.target.value,
        },
      }));
    },
    []
  );

  // MoneyInput has its own custom event shape
  const handlePriceChange = useCallback(
    (event: { target: { value: MoneyValue } }) => {
      setValues((prev) => ({
        ...prev,
        price: event.target.value,
      }));
    },
    []
  );

  // NumberInput onChange returns a standard event
  const handleQuantityChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({
        ...prev,
        quantity: Number(event.target.value),
      }));
    },
    []
  );

  const handleWeightChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({
        ...prev,
        weight: Number(event.target.value),
      }));
    },
    []
  );

  // SelectInput custom event shape
  const handleCategoryChange = useCallback(
    (event: { target: { value: string } }) => {
      setValues((prev) => ({ ...prev, category: event.target.value }));
    },
    []
  );

  const handleStatusChange = useCallback(
    (event: { target: { value: string } }) => {
      setValues((prev) => ({ ...prev, status: event.target.value }));
    },
    []
  );

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
    <Constraints.Horizontal max={13}>
      <Spacings.Stack scale="l">
        {/* Back navigation */}
        <Spacings.Inline scale="s" alignItems="center">
          <FlatButton
            icon={<BackIcon />}
            label="Back to Products"
            onClick={() => {}}
          />
        </Spacings.Inline>

        {/* Page header */}
        <Spacings.Inline
          scale="m"
          alignItems="center"
          justifyContent="space-between"
        >
          <Spacings.Inline scale="s" alignItems="center">
            <Text.Headline as="h1">
              {values.name.en || "New Product"}
            </Text.Headline>
            <Stamp
              tone={values.status === "published" ? "positive" : "warning"}
              label={values.status}
            />
          </Spacings.Inline>
          <Spacings.Inline scale="s">
            <SecondaryButton
              iconLeft={<CloseBoldIcon />}
              label="Discard"
              onClick={() => {}}
            />
            <PrimaryButton
              iconLeft={<CheckBoldIcon />}
              label="Save"
              onClick={handleSave}
              isDisabled={isSaving}
            />
          </Spacings.Inline>
        </Spacings.Inline>

        {/* Success notification */}
        {showSuccess && (
          <ContentNotification type="success">
            Product saved successfully.{" "}
            <Link to="/products">Return to list</Link>
          </ContentNotification>
        )}

        {/* Save progress */}
        {isSaving && (
          <ProgressBar
            percentage={saveProgress}
            label={`Saving... ${saveProgress}%`}
          />
        )}

        {/* General information card */}
        <Card>
          <Spacings.Stack scale="m">
            <Text.Subheadline as="h4">General Information</Text.Subheadline>

            {/* Localized name — exercises LocalizedTextInput migration */}
            <Spacings.Stack scale="xs">
              <Label isRequiredIndicatorVisible>Product Name</Label>
              <Spacings.Inline scale="s" alignItems="center">
                <Text.Detail>
                  {`${Math.round(nameCompletion * 100)}% translated`}
                </Text.Detail>
                <ProgressBar percentage={nameCompletion * 100} />
              </Spacings.Inline>
              <LocalizedTextInput
                value={values.name}
                onChange={handleLocalizedNameChange}
                selectedLanguage="en"
              />
              {errors.name && <FieldErrors errors={errors.name} />}
            </Spacings.Stack>

            {/* Localized description */}
            <Spacings.Stack scale="xs">
              <Label>Description</Label>
              <LocalizedMultilineTextInput
                value={values.description}
                onChange={handleLocalizedDescriptionChange}
                selectedLanguage="en"
              />
            </Spacings.Stack>

            {/* Slug and SKU — inline with constraints */}
            <Spacings.Inline scale="m">
              <Constraints.Horizontal max={7}>
                <TextField
                  title="Slug"
                  value={values.slug}
                  onChange={(event) =>
                    setValues((prev) => ({
                      ...prev,
                      slug: event.target.value,
                    }))
                  }
                />
              </Constraints.Horizontal>
              <Constraints.Horizontal max={5}>
                <TextField
                  title="SKU"
                  value={values.sku}
                  onChange={(event) =>
                    setValues((prev) => ({
                      ...prev,
                      sku: event.target.value,
                    }))
                  }
                />
              </Constraints.Horizontal>
            </Spacings.Inline>
          </Spacings.Stack>
        </Card>

        {/* Pricing and inventory card */}
        <Card>
          <Spacings.Stack scale="m">
            <Text.Subheadline as="h4">Pricing & Inventory</Text.Subheadline>

            <Spacings.Inline scale="m" alignItems="flex-end">
              {/* MoneyInput — exercises custom event shape */}
              <Constraints.Horizontal max={6}>
                <Spacings.Stack scale="xs">
                  <Label isRequiredIndicatorVisible>Price</Label>
                  <MoneyInput
                    value={values.price}
                    onChange={handlePriceChange}
                    currencies={["EUR", "USD", "GBP"]}
                  />
                </Spacings.Stack>
              </Constraints.Horizontal>

              {/* NumberInput — exercises event→value adapter */}
              <Constraints.Horizontal max={4}>
                <Spacings.Stack scale="xs">
                  <Label>Quantity</Label>
                  <NumberInput
                    value={values.quantity}
                    onChange={handleQuantityChange}
                    min={0}
                  />
                </Spacings.Stack>
              </Constraints.Horizontal>

              <Constraints.Horizontal max={4}>
                <Spacings.Stack scale="xs">
                  <Label>Weight (kg)</Label>
                  <NumberInput
                    value={values.weight}
                    onChange={handleWeightChange}
                    min={0}
                    step={0.1}
                  />
                </Spacings.Stack>
              </Constraints.Horizontal>
            </Spacings.Inline>
          </Spacings.Stack>
        </Card>

        {/* Classification card */}
        <Card>
          <Spacings.Stack scale="m">
            <Text.Subheadline as="h4">Classification</Text.Subheadline>

            <Spacings.Inline scale="m">
              <Constraints.Horizontal max={6}>
                <Spacings.Stack scale="xs">
                  <Label>Category</Label>
                  <SelectInput
                    value={values.category}
                    onChange={handleCategoryChange}
                    options={CATEGORY_OPTIONS}
                  />
                </Spacings.Stack>
              </Constraints.Horizontal>

              <Constraints.Horizontal max={6}>
                <Spacings.Stack scale="xs">
                  <Label>Status</Label>
                  <SelectInput
                    value={values.status}
                    onChange={handleStatusChange}
                    options={STATUS_OPTIONS}
                  />
                </Spacings.Stack>
              </Constraints.Horizontal>
            </Spacings.Inline>

            <Spacings.Stack scale="xs">
              <Label>Tags</Label>
              <Spacings.Inline scale="xs">
                <Tag onRemove={() => {}}>Cotton</Tag>
                <Tag onRemove={() => {}}>Premium</Tag>
                <Tag onRemove={() => {}}>Summer</Tag>
              </Spacings.Inline>
            </Spacings.Stack>
          </Spacings.Stack>
        </Card>

        {/* Warning notification */}
        <ContentNotification type="warning">
          <Spacings.Inline scale="s" alignItems="center">
            <WarningIcon />
            <Text.Body>
              This product has{" "}
              {
                LANGUAGES.filter(
                  (l) => !values.name[l as keyof LocalizedString]
                ).length
              }{" "}
              missing translations.{" "}
              <Link isExternal to="https://docs.example.com/i18n">
                Learn more about translations
              </Link>
            </Text.Body>
          </Spacings.Inline>
        </ContentNotification>
      </Spacings.Stack>
    </Constraints.Horizontal>
  );
}

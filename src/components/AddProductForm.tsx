"use client";

import { FormEvent, useEffect, useState } from "react";
import type { Product } from "@/types/product";
import "./addProductForm.css";

type FormValues = {
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
  inStock: boolean;
};

const initialValues: FormValues = {
  name: "",
  description: "",
  price: "",
  category: "",
  imageUrl: "",
  inStock: true,
};

type AddProductFormProps = {
  onProductCreated: (product: Product) => void;
};

export default function AddProductForm({ onProductCreated }: AddProductFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) setIsOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isSubmitting]);

  const updateField = <K extends keyof FormValues>(field: K, value: FormValues[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setFeedback(null);
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof FormValues, string>> = {};
    const price = Number(values.price);

    if (!values.name.trim()) nextErrors.name = "Enter a product name.";
    else if (values.name.trim().length > 100) nextErrors.name = "Name must be 100 characters or fewer.";
    if (!values.description.trim()) nextErrors.description = "Enter a description.";
    else if (values.description.trim().length > 500)
      nextErrors.description = "Description must be 500 characters or fewer.";
    if (!values.price.trim()) nextErrors.price = "Enter a price.";
    else if (!Number.isFinite(price) || price < 0) nextErrors.price = "Price must be a number of at least 0.";
    if (!values.category.trim()) nextErrors.category = "Enter a category.";
    if (!values.imageUrl.trim()) nextErrors.imageUrl = "Enter an image URL.";
    else if (!isHttpUrl(values.imageUrl)) nextErrors.imageUrl = "Enter a valid http or https URL.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          name: values.name.trim(),
          description: values.description.trim(),
          price: Number(values.price),
          category: values.category.trim(),
          imageUrl: values.imageUrl.trim(),
        }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "We could not add that product. Please try again.");
      }

      onProductCreated(data as Product);
      setValues(initialValues);
      setFeedback({ type: "success", message: "Product created successfully." });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "We could not add that product. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openForm = () => {
    setFeedback(null);
    setIsOpen(true);
  };

  return (
    <>
      <button className="add-product-trigger" type="button" onClick={openForm}>
        Add product
      </button>

      {isOpen && (
        <div
          className="add-product-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isSubmitting) setIsOpen(false);
          }}
        >
          <section className="add-product" role="dialog" aria-modal="true" aria-labelledby="add-product-title">
            <header className="add-product-header">
              <h2 id="add-product-title">Add a product</h2>
              <button
                className="add-product-close"
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
                aria-label="Close add product form"
              >
                ×
              </button>
            </header>
            <form noValidate onSubmit={handleSubmit}>
              <FormField label="Name" error={errors.name}>
                <input
                  id="product-name"
                  autoFocus
                  value={values.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "product-name-error" : undefined}
                />
              </FormField>
              <FormField label="Description" error={errors.description}>
                <textarea
                  id="product-description"
                  value={values.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  aria-invalid={Boolean(errors.description)}
                  aria-describedby={errors.description ? "product-description-error" : undefined}
                />
              </FormField>
              <FormField label="Price" error={errors.price}>
                <input
                  id="product-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={values.price}
                  onChange={(event) => updateField("price", event.target.value)}
                  aria-invalid={Boolean(errors.price)}
                  aria-describedby={errors.price ? "product-price-error" : undefined}
                />
              </FormField>
              <FormField label="Category" error={errors.category}>
                <input
                  id="product-category"
                  value={values.category}
                  onChange={(event) => updateField("category", event.target.value)}
                  aria-invalid={Boolean(errors.category)}
                  aria-describedby={errors.category ? "product-category-error" : undefined}
                />
              </FormField>
              <FormField label="Image URL" error={errors.imageUrl}>
                <input
                  id="product-image-url"
                  type="url"
                  value={values.imageUrl}
                  onChange={(event) => updateField("imageUrl", event.target.value)}
                  aria-invalid={Boolean(errors.imageUrl)}
                  aria-describedby={errors.imageUrl ? "product-image-url-error" : undefined}
                />
              </FormField>
              <label className="add-product-checkbox">
                <input
                  type="checkbox"
                  checked={values.inStock}
                  onChange={(event) => updateField("inStock", event.target.checked)}
                />{" "}
                In stock
              </label>
              {feedback && (
                <p className={`add-product-feedback ${feedback.type}`} role="status">
                  {feedback.message}
                </p>
              )}
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding product…" : "Add product"}
              </button>
            </form>
          </section>
        </div>
      )}
    </>
  );
}

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  const id = `product-${label.toLowerCase().replaceAll(" ", "-")}-error`;
  return (
    <label className="add-product-field">
      {label}
      {children}
      {error && (
        <span id={id} className="add-product-error">
          {error}
        </span>
      )}
    </label>
  );
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

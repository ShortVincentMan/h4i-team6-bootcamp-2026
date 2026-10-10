"use client";

import CategoryCard from "@/components/CategoryCard";
import "@/components/categoryCard.css";
import { mockProducts } from "@/data/products";
import { mergeProducts } from "@/lib/products";
import type { Product } from "@/types/product";
import { useCallback, useEffect, useMemo, useState } from "react";
import "./categoriesPage.css";

export default function CategoriesPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [loadStatus, setLoadStatus] = useState<"loading" | "ready" | "error">("loading");
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoadStatus("loading");
    setLoadError(null);

    try {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Unable to load categories");
      const apiProducts = (await response.json()) as Product[];
      setProducts((currentProducts) => mergeProducts(currentProducts, apiProducts));
      setLoadStatus("ready");
    } catch {
      setLoadError("Categories could not be loaded. Please try again.");
      setLoadStatus("error");
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const categories = useMemo(
    () =>
      Array.from(
        products
          .reduce((categoryMap, product) => {
            const normalizedName = product.category.trim().toLocaleLowerCase();
            const category = categoryMap.get(normalizedName);

            if (category) {
              category.productCount += 1;
            } else {
              categoryMap.set(normalizedName, {
                name: product.category.trim(),
                imageUrl: product.imageUrl,
                productCount: 1,
              });
            }

            return categoryMap;
          }, new Map<string, { name: string; imageUrl: string; productCount: number }>())
          .values(),
      ),
    [products],
  );

  return (
    <main className="categories-page">
      <div className="categories-page-inner">
        <header className="categories-page-header">
          <p className="categories-page-eyebrow">find your next favorite</p>
          <h1 className="categories-page-title">Categories</h1>
          <p className="categories-page-subtitle">
            Browse our beachside finds by category and discover something new to love.
          </p>
        </header>

        {loadStatus === "loading" ? (
          <section className="categories-page-empty" aria-live="polite">
            <h2>Loading categories</h2>
            <p>Finding the latest beachside goods.</p>
          </section>
        ) : loadStatus === "error" ? (
          <section className="categories-page-empty" role="alert">
            <h2>Could not load categories</h2>
            <p>{loadError}</p>
            <button className="categories-page-retry" type="button" onClick={loadProducts}>
              Try again
            </button>
          </section>
        ) : categories.length === 0 ? (
          <section className="categories-page-empty" aria-live="polite">
            <h2>No categories yet</h2>
            <p>Check back soon for fresh beachside finds.</p>
          </section>
        ) : (
          <section className="categories-page-grid" aria-label="Product categories">
            {categories.map((category) => (
              <CategoryCard key={category.name} {...category} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

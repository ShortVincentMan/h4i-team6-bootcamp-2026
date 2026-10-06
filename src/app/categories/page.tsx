"use client";

import CategoryCard from "@/components/CategoryCard";
import "@/components/categoryCard.css";
import type { Product } from "@/types/product";
import { useEffect, useMemo, useState } from "react";
import "./categoriesPage.css";

export default function CategoriesPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    const loadProducts = async () => {
      try {
        const response = await fetch("/api/products", { signal: controller.signal });
        if (!response.ok) return;
        const apiProducts = (await response.json()) as Product[];
        setProducts(apiProducts);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Unable to load products for categories", error);
        }
      }
    };

    loadProducts();
    return () => controller.abort();
  }, []);

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

        {categories.length === 0 ? (
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

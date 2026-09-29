"use client";

import CategoryList from "@/components/CategoryList";
import useProducts from "@/hooks/useProducts";
import "./categoriesPage.css";

export default function CategoriesPage() {
  const { products, isLoading, error } = useProducts();
  const categoryCounts = products.reduce((counts, product) => {
    counts.set(product.category, (counts.get(product.category) ?? 0) + 1);
    return counts;
  }, new Map<string, number>());
  const categories = Array.from(categoryCounts, ([name, productCount]) => ({ name, productCount }));

  return (
    <main className="categories-page">
      <div className="categories-page__inner">
        <header className="categories-hero">
          <div className="categories-hero__copy">
            <p className="categories-hero__eyebrow">Shop by collection</p>
            <h1>Find your next favorite thing.</h1>
            <p className="categories-hero__subtitle">
              From salty surf finds to well-loved wardrobe staples, explore every corner of Beachside Thrift.
            </p>
          </div>

          <div className="categories-hero__sun" aria-hidden="true" />
          <div className="categories-hero__wave categories-hero__wave--one" aria-hidden="true" />
          <div className="categories-hero__wave categories-hero__wave--two" aria-hidden="true" />
        </header>

        <section className="categories-collection" aria-labelledby="category-list-title">
          <div className="categories-collection__heading">
            <div>
              <p>Browse the shop</p>
              <h2 id="category-list-title">All categories</h2>
            </div>
            {!isLoading && !error && (
              <span className="categories-collection__count">
                {categories.length} {categories.length === 1 ? "collection" : "collections"}
              </span>
            )}
          </div>

          {isLoading && (
            <div className="category-status" role="status">
              <span className="category-status__spinner" aria-hidden="true" />
              <h3>Gathering the good stuff...</h3>
              <p>Loading categories from the shop.</p>
            </div>
          )}

          {error && (
            <div className="category-status category-status--error" role="alert">
              <span className="category-status__icon" aria-hidden="true">
                !
              </span>
              <h3>We hit a snag.</h3>
              <p>{error}</p>
            </div>
          )}

          {!isLoading && !error && categories.length === 0 && (
            <div className="category-status">
              <span className="category-status__icon" aria-hidden="true">
                ~
              </span>
              <h3>No categories yet.</h3>
              <p>Add a product and its collection will appear here.</p>
            </div>
          )}

          {!isLoading && !error && categories.length > 0 && <CategoryList categories={categories} />}
        </section>
      </div>
    </main>
  );
}

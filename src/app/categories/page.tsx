import CategoryCard from "@/components/CategoryCard";
import "@/components/categoryCard.css";
import { mockProducts } from "@/data/products";
import "./categoriesPage.css";

export default function CategoriesPage() {
  const categories = Array.from(
    mockProducts
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

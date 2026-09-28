import { mockProducts } from "@/data/products";

export default function CategoriesPage() {
  const categories = Array.from(new Set(mockProducts.map((product) => product.category)));

  if (categories.length === 0) {
    return (
      <main>
        <h1>Categories</h1>
        <p>No categories available.</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Categories</h1>

      <ul>
        {categories.map((category) => (
          <li key={category}>{category}</li>
        ))}
      </ul>
    </main>
  );
}

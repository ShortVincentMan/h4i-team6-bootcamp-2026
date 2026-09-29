type CategoryListProps = {
  categories: Array<{
    name: string;
    productCount: number;
  }>;
};

export default function CategoryList({ categories }: CategoryListProps) {
  return (
    <ul className="category-grid">
      {categories.map((category, index) => (
        <li className={`category-card category-card--${(index % 4) + 1}`} key={category.name}>
          <div className="category-card__art" aria-hidden="true">
            <span>{category.name.slice(0, 2).toUpperCase()}</span>
          </div>

          <div className="category-card__content">
            <p className="category-card__label">Collection</p>
            <h3>{category.name}</h3>
            <p>
              {category.productCount} {category.productCount === 1 ? "item" : "items"}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

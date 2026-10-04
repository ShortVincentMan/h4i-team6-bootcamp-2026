import Link from "next/link";

type CategoryCardProps = {
  name: string;
  imageUrl: string;
  productCount: number;
};

export default function CategoryCard({ name, imageUrl, productCount }: CategoryCardProps) {
  const productLabel = productCount === 1 ? "product" : "products";

  return (
    <Link
      className="category-card"
      href={`/products?category=${encodeURIComponent(name)}`}
      aria-label={`View ${productCount} ${productLabel} in ${name}`}
    >
      <img className="category-card-image" src={imageUrl} alt="" />
      <span className="category-card-scrim" aria-hidden="true" />
      <span className="category-card-content">
        <span className="category-card-count">
          {productCount} {productLabel}
        </span>
        <span className="category-card-name">{name}</span>
        <span className="category-card-action">
          Shop category <span aria-hidden="true">→</span>
        </span>
      </span>
    </Link>
  );
}

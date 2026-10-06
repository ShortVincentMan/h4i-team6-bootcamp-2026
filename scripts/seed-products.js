const products = [
  {
    name: "Vintage Surfboard",
    description: "Used 7'6\" surfboard with minor dings.",
    price: 285,
    category: "Surf",
    imageUrl: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=900&q=80",
    inStock: true,
  },
  {
    name: "Tee Shirt",
    description: "Soft, well-worn cotton tee.",
    price: 24,
    category: "Clothing",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    inStock: true,
  },
  {
    name: "Canvas Tote",
    description: "Roomy used tote for beach days.",
    price: 18,
    category: "Accessories",
    imageUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80",
    inStock: true,
  },
  {
    name: "Red Shoes",
    description: "Used red shoes in good condition.",
    price: 28,
    category: "Footwear",
    imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80",
    inStock: true,
  },
  {
    name: "Tortoiseshell Sunglasses",
    description: "Vintage frames with dark lenses.",
    price: 22,
    category: "Accessories",
    imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80",
    inStock: true,
  },
  {
    name: "Vintage Windbreaker",
    description: "Light jacket for breezy beach mornings.",
    price: 42,
    category: "Clothing",
    imageUrl: "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=900&q=80",
    inStock: false,
  },
  {
    name: "Fancy Bracelet",
    description: "Handmade bracelet with a lot of shiny bits and pieces.",
    price: 16,
    category: "Accessories",
    imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=80",
    inStock: false,
  },
  {
    name: "Beach Towel",
    description: "Soft, lightweight cotton towel. The dog is not included.",
    price: 20,
    category: "Beach Gear",
    imageUrl: "https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?auto=format&fit=crop&w=900&q=80",
    inStock: false,
  },
  {
    name: "Leather Sandals",
    description: "Used leather slides with adjustable straps.",
    price: 34,
    category: "Footwear",
    imageUrl: "https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=900&q=80",
    inStock: false,
  },
];

const apiUrl = process.env.PRODUCTS_API_URL ?? "http://localhost:3000/api/products";

const response = await fetch(apiUrl);
if (!response.ok) {
  throw new Error(`Could not read existing products (${response.status})`);
}

const existingProducts = await response.json();
const existingKeys = new Set(
  existingProducts.map((product) => `${product.name}|${product.category}|${product.imageUrl}`),
);
const productsToCreate = products.filter(
  (product) => !existingKeys.has(`${product.name}|${product.category}|${product.imageUrl}`),
);

for (const product of productsToCreate) {
  const createResponse = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });

  if (!createResponse.ok) {
    throw new Error(`Could not create "${product.name}" (${createResponse.status}): ${await createResponse.text()}`);
  }
}

console.log(
  `Seed complete: ${productsToCreate.length} product(s) added, ${products.length - productsToCreate.length} already existed.`,
);

"use client";

import ProductCard from "@/components/ProductCard";
import AddProductForm from "@/components/AddProductForm";
import { mockProducts } from "@/data/products";
import type { Product as ProductType } from "@/types/product";
import { useEffect, useMemo, useRef, useState } from "react";
require("./productPage.css");

type ShapeSpec = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  delay: number;
  imageUrl: string;
  clipPath: string;
};

function getShapeCount(width: number) {
  if (width >= 1440) return 11;
  if (width >= 1100) return 9;
  if (width >= 760) return 7;
  return 5;
}

function getStableWidthBucket(width: number) {
  if (width >= 1440) return 1440;
  if (width >= 1100) return 1100;
  if (width >= 760) return 760;
  if (width >= 560) return 560;
  return 420;
}

function createClipPath(seed: number) {
  const points = Array.from({ length: 6 }, (_, index) => {
    const angle = (Math.PI * 2 * index) / 6 + seed * 0.3;
    const radius = 35 + ((seed + index * 17) % 30);
    const x = 50 + Math.cos(angle) * radius;
    const y = 50 + Math.sin(angle) * radius;
    return `${x}% ${y}%`;
  });

  return `polygon(${points.join(", ")})`;
}

function createShapeSet(width: number, products: ProductType[]) {
  const count = getShapeCount(width);
  const sourceProducts = products.length > 0 ? [...products] : [];

  if (sourceProducts.length === 0) {
    return [];
  }

  const shuffledProducts = [...sourceProducts].sort(() => Math.random() - 0.5);
  const uniqueImages = shuffledProducts.slice(0, Math.min(count, sourceProducts.length));
  const imagePool = [...uniqueImages];

  while (imagePool.length < count) {
    imagePool.push(...shuffledProducts);
  }

  return Array.from({ length: count }, (_, index) => {
    const image = imagePool[index % imagePool.length];
    const baseWidth = width < 640 ? 110 : width < 980 ? 150 : 200;
    const widthRange = width < 640 ? 32 : width < 980 ? 60 : 80;
    const shapeWidth = baseWidth + Math.random() * widthRange;
    const constantAspectRatio = 0.82;
    const shapeHeight = shapeWidth * constantAspectRatio;
    const spread = width < 980 ? 0.82 : 1;
    const xBase = (8 + (index % 5) * 14 + Math.random() * 12) * spread + 20;
    const yBase = 2 + (index % 3) * 7 + (Math.random() * 2 - 1) * 20;

    return {
      id: index + 1,
      x: xBase,
      y: yBase,
      width: shapeWidth,
      height: shapeHeight,
      delay: 0,
      imageUrl: image.imageUrl,
      clipPath: createClipPath(index + Math.round(Math.random() * 100)),
    } satisfies ShapeSpec;
  });
}

function mergeProducts(existingProducts: ProductType[], incomingProducts: ProductType[]) {
  const existingProductKeys = new Set(existingProducts.map(productKey));

  return [...existingProducts, ...incomingProducts.filter((product) => !existingProductKeys.has(productKey(product)))];
}

function productKey(product: ProductType) {
  return product._id ?? product.id ?? `${product.name}-${product.category}-${product.imageUrl}`;
}

export default function ProductPage() {
  const [products, setProducts] = useState<ProductType[]>(mockProducts);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [viewportWidth, setViewportWidth] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [shapes, setShapes] = useState<ShapeSpec[]>([]);
  const [leavingShapes, setLeavingShapes] = useState<ShapeSpec[]>([]);
  const [incomingShapes, setIncomingShapes] = useState<ShapeSpec[]>([]);
  const [waveId, setWaveId] = useState<number>(0);
  const [shapesUnlocked, setShapesUnlocked] = useState(false);
  const leaveTimeoutRef = useRef<number | null>(null);
  const currentShapesRef = useRef<ShapeSpec[]>(shapes);

  useEffect(() => {
    const controller = new AbortController();

    const loadProducts = async () => {
      try {
        const response = await fetch("/api/products", { signal: controller.signal });
        if (!response.ok) throw new Error("Unable to load products");
        const data = await response.json();
        setProducts((currentProducts) => mergeProducts(currentProducts, data as ProductType[]));
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setProductsError("Products could not be loaded. Please refresh and try again.");
        }
      }
    };

    loadProducts();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const updateWidth = () => setViewportWidth(window.innerWidth);
    updateWidth();

    let frame = 0;
    const handleResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const category = new URLSearchParams(window.location.search).get("category")?.trim();
    setSelectedCategory(category || null);
  }, []);

  useEffect(() => {
    const unlockTimer = window.setTimeout(() => {
      setShapesUnlocked(true);
    }, 500);

    return () => window.clearTimeout(unlockTimer);
  }, []);

  useEffect(() => {
    currentShapesRef.current = shapes;
  }, [shapes]);

  const stableWidth = useMemo(() => {
    if (!viewportWidth) {
      return 1100;
    }
    return getStableWidthBucket(viewportWidth);
  }, [viewportWidth]);

  useEffect(() => {
    if (!shapesUnlocked) {
      return;
    }

    const initialWave = createShapeSet(stableWidth, products);
    setShapes(initialWave);
  }, [products, shapesUnlocked, stableWidth]);

  useEffect(() => {
    if (!shapesUnlocked) {
      return;
    }

    const CYCLE_MS = 2500;
    const OUT_DURATION_MS = 2200;

    const intervalId = window.setInterval(() => {
      const currentWave = currentShapesRef.current;
      const nextShapes = createShapeSet(stableWidth, products);

      setLeavingShapes(currentWave);
      setIncomingShapes(nextShapes);
      setWaveId((id) => id + 1);

      if (leaveTimeoutRef.current) {
        window.clearTimeout(leaveTimeoutRef.current);
      }

      leaveTimeoutRef.current = window.setTimeout(() => {
        setLeavingShapes([]);
        setShapes(nextShapes);
        setIncomingShapes([]);
      }, OUT_DURATION_MS);
    }, CYCLE_MS);

    return () => {
      window.clearInterval(intervalId);
      if (leaveTimeoutRef.current) {
        window.clearTimeout(leaveTimeoutRef.current);
      }
    };
  }, [products, shapesUnlocked, stableWidth]);

  const visibleShapes = shapesUnlocked ? (incomingShapes.length > 0 ? incomingShapes : shapes) : [];
  const displayedProducts = selectedCategory
    ? products.filter((product) => product.category.toLocaleLowerCase() === selectedCategory.toLocaleLowerCase())
    : products;

  return (
    <main className="products-page">
      <div className="products-page-inner">
        <header className="products-page-header">
          <div className="products-page-visuals" aria-hidden="true">
            {shapesUnlocked &&
              leavingShapes.map((shape, index) => (
                <div
                  key={`out-${waveId}-${shape.id}-${index}`}
                  className="products-page-image-shape products-page-image-shape--out"
                  style={{
                    left: `${shape.x}%`,
                    top: `${shape.y}%`,
                    width: `${shape.width}px`,
                    height: `${shape.height}px`,
                    backgroundImage: `url(${shape.imageUrl})`,
                    clipPath: shape.clipPath,
                    animationDelay: `${index * 0.06}s`,
                  }}
                />
              ))}

            {visibleShapes.map((shape, index) => (
              <div
                key={`in-${waveId}-${shape.id}-${index}`}
                className="products-page-image-shape products-page-image-shape--in"
                style={{
                  left: `${shape.x}%`,
                  top: `${shape.y}%`,
                  width: `${shape.width}px`,
                  height: `${shape.height}px`,
                  backgroundImage: `url(${shape.imageUrl})`,
                  clipPath: shape.clipPath,
                  animationDelay: `${index * 0.06}s`,
                }}
              />
            ))}
          </div>

          <div className="products-page-eyebrow">consume consume consume</div>

          <div className="products-page-title-row">
            <div>
              <h1 className="products-page-title">{selectedCategory ? `${selectedCategory} finds` : "Products"}</h1>
              <p className="products-page-subtitle">
                {selectedCategory
                  ? `A selection of ${selectedCategory.toLocaleLowerCase()} from our beachside shelves.`
                  : "please buy our stuff"}
              </p>
              {selectedCategory && (
                <a className="products-page-clear-filter" href="/products">
                  View all products
                </a>
              )}
            </div>
          </div>
        </header>

        <AddProductForm
          onProductCreated={(product) => setProducts((currentProducts) => mergeProducts(currentProducts, [product]))}
        />

        <section className="products-page-grid">
          {productsError ? (
            <p className="products-page-empty">{productsError}</p>
          ) : displayedProducts.length > 0 ? (
            displayedProducts.map((product) => (
              <ProductCard key={product._id ?? product.id ?? product.name} {...product} />
            ))
          ) : (
            <p className="products-page-empty">
              {selectedCategory
                ? "No products found in this category. Try browsing all products instead."
                : "No products have been added yet."}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

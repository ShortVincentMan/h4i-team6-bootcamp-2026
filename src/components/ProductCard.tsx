"use client";

import { useEffect, useRef, useState } from "react";
import type { Product } from "../types/product";
import "./productCard.css";

export default function ProductCard(product: Product) {
  const stockStatus = product.inStock ? "In Stock" : "Out of Stock";
  const [targetOrigin, setTargetOrigin] = useState({ x: 50, y: 50 });
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [isPressed, setIsPressed] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const tick = () => {
      setZoomOrigin((current) => {
        const nextX = current.x + (targetOrigin.x - current.x) * 0.12;
        const nextY = current.y + (targetOrigin.y - current.y) * 0.12;

        if (Math.abs(nextX - targetOrigin.x) < 0.1 && Math.abs(nextY - targetOrigin.y) < 0.1) {
          return targetOrigin;
        }

        return { x: nextX, y: nextY };
      });

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [targetOrigin]);

  const handleImageMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isPressed) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    setTargetOrigin({ x, y });
  };

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => {
    setIsPressed(false);
    setTargetOrigin({ x: 50, y: 50 });
  };

  return (
    <article className="product-card" aria-label={`Product card for ${product.name}`}>
      <div
        className={`product-card-image-wrap ${isPressed ? "is-pressed" : ""}`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          setIsPressed(false);
          setTargetOrigin({ x: 50, y: 50 });
        }}
        onMouseMove={handleImageMove}
        onDragStart={(event) => event.preventDefault()}
        style={{
          ["--zoom-x" as string]: `${zoomOrigin.x}%`,
          ["--zoom-y" as string]: `${zoomOrigin.y}%`,
        }}
      >
        <img src={product.imageUrl} alt={product.name} className="product-card-image" />
      </div>
      <div className="product-card-content">
        <p className="product-card-category">{product.category}</p>
        <h2 className="product-card-name">{product.name}</h2>
        <p className="product-card-description">{product.description}</p>

        <div className="product-card-meta">
          <span className="product-card-price">${product.price.toFixed(2)}</span>
          <span className={`product-card-stock ${product.inStock ? "in-stock" : "out-of-stock"}`}>{stockStatus}</span>
        </div>

        <button type="button" className="product-card-button" aria-label={`Purchase ${product.name}`}>
          Purchase
        </button>
      </div>
    </article>
  );
}

"use client";

import type { Product } from "@/types/product";
import { useEffect, useState } from "react";

export default function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        const response = await fetch("/api/products", { signal: controller.signal });

        if (!response.ok) {
          throw new Error("The products request failed.");
        }

        const data: unknown = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("The products API returned an unexpected response.");
        }

        setProducts(data as Product[]);
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        setError(requestError instanceof Error ? requestError.message : "Unable to load products.");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    void loadProducts();
    return () => controller.abort();
  }, []);

  return { products, isLoading, error };
}

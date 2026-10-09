import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Navbar from "@/components/Navbar";

// Mock usePathname from next/navigation for the Navbar component
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("Navbar Link Tests", () => {
  // Test 1: Home & Products links
  it("Navbar links point to Home and Products", () => {
    const { getByRole } = render(<Navbar />);

    expect(getByRole("link", { name: /home/i }).getAttribute("href")).toBe("/");
    expect(getByRole("link", { name: /products/i }).getAttribute("href")).toBe("/products");
  });

  // Test 2: Categories link
  it("Navbar link points to Categories", () => {
    const { getByRole } = render(<Navbar />);

    expect(getByRole("link", { name: /categories/i }).getAttribute("href")).toBe("/categories");
  });

  // Test 3: About & Contact links
  it("Navbar links point to About and Contact", () => {
    const { getByRole } = render(<Navbar />);

    expect(getByRole("link", { name: /about/i }).getAttribute("href")).toBe("/about");
    expect(getByRole("link", { name: /contact/i }).getAttribute("href")).toBe("/contact");
  });
});

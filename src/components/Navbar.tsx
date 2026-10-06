"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="navbar">
      <div>Beachside Thrift - Team 6</div>
      <ul className="nav-links">
        <li>
          <Link href="/">Home</Link>
          <Link
            href="/products"
            onClick={(event) => {
              if (pathname === "/products") {
                event.preventDefault();
                window.location.assign("/products");
              }
            }}
          >
            Products
          </Link>
          <Link href="/categories">Categories</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </li>
      </ul>
    </nav>
  );
}

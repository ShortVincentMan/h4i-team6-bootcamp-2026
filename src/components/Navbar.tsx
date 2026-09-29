import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div>Team 6</div>
      <ul className="nav-links">
        <li>
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </li>
      </ul>
    </nav>
  );
}

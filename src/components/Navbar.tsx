import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div>Team 6</div>
      <ul className="nav-links">
        <li>
          <Link href="/">Home</Link>
        </li>
      </ul>
    </nav>
  );
}

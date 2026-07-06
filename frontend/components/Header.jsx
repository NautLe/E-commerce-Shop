import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function SearchIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M4 21C4 17.2 7.3 14 12 14C16.7 14 20 17.2 20 21"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 8H18L19 21H5L6 8Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M9 8C9 5.8 10.3 4 12 4C13.7 4 15 5.8 15 8"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

export default function Header() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Listen for custom events or updates (or simple interval/state sync if needed,
    // but a standard useEffect read on mount is what was here originally)
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
  }, []);

  return (
    <header className="siteHeader">
      <Link href="/" className="brandLogo" to="/">
        MOCHA
      </Link>

      <nav className="mainNav">
        <Link to="/women">Women</Link>
        <Link to="/men">Men</Link>
        <Link to="/unisex">Unisex</Link>
       </nav>

      <div className="headerActions">
        <button aria-label="Search">
          <SearchIcon />
        </button>

        <Link to="/orders" aria-label="Account">
          <UserIcon />
        </Link>

        <Link to="/cart" aria-label="Cart" className="cartLink">
          <BagIcon />
          <span>({cartCount})</span>
        </Link>
      </div>
    </header>
  );
}

import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { getCart } from "@/lib/storage";

function SearchIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10.8 18.2C14.886 18.2 18.2 14.886 18.2 10.8C18.2 6.714 14.886 3.4 10.8 3.4C6.714 3.4 3.4 6.714 3.4 10.8C3.4 14.886 6.714 18.2 10.8 18.2Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M16.2 16.2L21 21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 12.2C14.43 12.2 16.4 10.23 16.4 7.8C16.4 5.37 14.43 3.4 12 3.4C9.57 3.4 7.6 5.37 7.6 7.8C7.6 10.23 9.57 12.2 12 12.2Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M4.5 20.5C5.3 16.9 8.2 14.8 12 14.8C15.8 14.8 18.7 16.9 19.5 20.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6.5 8.5H17.5L18.4 21H5.6L6.5 8.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9 8.5V6.5C9 4.8 10.3 3.5 12 3.5C13.7 3.5 15 4.8 15 6.5V8.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Header() {
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const cart = getCart();

    const count = cart.reduce((total, item) => {
      return total + Number(item.quantity || 1);
    }, 0);

    setCartCount(count);
  }, [location.pathname]);

  return (
    <header className="mochaHeader">
      <Link to="/" className="mochaLogo">
        MOCHA
      </Link>

      <nav className="mochaNav">
        <NavLink to="/women">Women</NavLink>
        <NavLink to="/men">Men</NavLink>
        <NavLink to="/unisex">Unisex</NavLink>
        <NavLink to="/essentials">Essentials</NavLink>
      </nav>

      <div className="mochaHeaderActions">
        <button type="button" aria-label="Search">
          <SearchIcon />
        </button>

        <Link to="/orders" aria-label="Account">
          <UserIcon />
        </Link>

        <Link to="/cart" className="mochaCartLink" aria-label="Cart">
          <BagIcon />

          {cartCount > 0 && <span className="mochaCartBadge">{cartCount}</span>}
        </Link>
      </div>
    </header>
  );
}
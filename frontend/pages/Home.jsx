import { Link } from "react-router-dom";
import Header from "@/components/Header";
import HeroWidget from "@/components/HeroWidget";
import { products } from "@/lib/products";
import { formatPrice } from "@/lib/storage";

import womenImg from "@/assets/images/women.jpg";
import menImg from "@/assets/images/men.jpg";
import unisexImg from "@/assets/images/unisex.jpg";
import essentialsImg from "@/assets/images/essentials.jpg";

function TruckIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <path d="M3 7H15V17H3V7Z" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M15 10H19L21 13V17H15V10Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="7" cy="18" r="1.7" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="18" cy="18" r="1.7" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3L21 8L12 13L3 8L12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M3 8V16L12 21V13" stroke="currentColor" strokeWidth="1.8" />
      <path d="M21 8V16L12 21" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <rect
        x="4"
        y="5"
        width="16"
        height="15"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M8 3V7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 3V7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 10H20" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

const categories = [
  {
    title: "Women",
    image: womenImg,
    href: "/women",
  },
  {
    title: "Men",
    image: menImg,
    href: "/men",
  },
  {
    title: "Unisex",
    image: unisexImg,
    href: "/unisex",
  },
  {
    title: "Essentials",
    image: essentialsImg,
    href: "/essentials",
  },
];

export default function Home() {
  return (
    <main>
      <Header />

      <HeroWidget />

      <section className="benefitsBar">
        <div className="benefitsBarItem">
          <TruckIcon />

          <div>
            <strong>Free Shipping</strong>
            <p>On orders over $60</p>
          </div>
        </div>

        <div className="benefitsBarItem">
          <BoxIcon />

          <div>
            <strong>Easy Returns</strong>
            <p>Within 30 days</p>
          </div>
        </div>

        <div className="benefitsBarItem">
          <CalendarIcon />

          <div>
            <strong>New Drops</strong>
            <p>Every week</p>
          </div>
        </div>
      </section>

      <section className="section">
        <p className="label">Shop by Category</p>
        <h2>Everyday essentials, made to move with you.</h2>

        <div className="categoryGrid">
          {categories.map((category) => (
            <Link
              to={category.href}
              className="categoryCard"
              key={category.title}
            >
              <div className="categoryImage">
                <img src={category.image} alt={category.title} />

                <div className="categoryLabel">
                  <h3>{category.title}</h3>
                  <span>Shop now →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <p className="label">Recommended</p>
        <h2>Fresh Picks This Week</h2>

        <div className="productGrid">
          {products.map((product) => (
            <Link
              to={`/item/${product.id}`}
              className="productCard"
              key={product.id}
            >
              <div className="productVisual hasImage">
                <span>{product.tag}</span>

                <img
                  src={product.image}
                  alt={product.name}
                  className="productImage"
                />
              </div>

              <h3>{product.name}</h3>
              <p>{formatPrice(product.price)}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import HeroWidget from "@/components/HeroWidget";
import { products } from "@/lib/products";
import { formatPrice } from "@/lib/storage";

import womenImg from "@/assets/images/women.jpg";
import menImg from "@/assets/images/men.jpg";
import unisexImg from "@/assets/images/unisex.jpg";
import essentialsImg from "@/assets/images/essentials.jpg";

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

      <section className="benefits">
        <div>
          <strong>Free Shipping</strong>
          <p>On orders over $60</p>
        </div>

        <div>
          <strong>Easy Returns</strong>
          <p>Within 30 days</p>
        </div>

        <div>
          <strong>New Drops</strong>
          <p>Every week</p>
        </div>
      </section>

      <section className="section">
        <p className="label">Shop by Category</p>
        <h2>Explore essentials made for every move.</h2>

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
        <h2>This week’s picks</h2>

        <div className="productGrid">
          {products.map((product) => (
            <Link
              to={`/item/${product.id}`}
              className="productCard"
              key={product.id}
            >
              <div className={`productVisual ${product.tone}`}>
                <span>{product.tag}</span>
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

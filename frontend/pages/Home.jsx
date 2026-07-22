import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import HeroWidget from "@/components/HeroWidget";
import ServiceStrip from "@/components/ServiceStrip";
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

const recommendedItemIds = [
  "oversized-cotton-tshirt",
  "relaxed-fit-shirt",
  "wide-leg-trousers",
  "minimal-utility-jacket",
  "sport-zip-hoodie",
  "minimal-baseball-cap",
  "lightweight-track-pants",
  "cropped-zip-hoodie",
  "half-zip-sweatshirt",
  "tailored-bermuda-shorts",
];

export default function Home() {
  const [selectedColors, setSelectedColors] = useState({});
  const [likedItems, setLikedItems] = useState({});

  const recommendedProducts = recommendedItemIds
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean);

  function handleColorChange(event, productId, color) {
    event.preventDefault();
    event.stopPropagation();

    setSelectedColors((prev) => ({
      ...prev,
      [productId]: color,
    }));
  }

  function handleLike(event, productId) {
    event.preventDefault();
    event.stopPropagation();

    setLikedItems((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  }

  function getSelectedColor(product) {
    return selectedColors[product.id] || product.color?.[0] || "White";
  }

  function getCurrentImage(product) {
    const selectedColor = getSelectedColor(product);
    return product.images?.[selectedColor] || product.image;
  }

  return (
    <main>
      <Header />

      <HeroWidget />

      <section className="benefits">
        <div className="benefitItem">
          <strong>Free Shipping</strong>
          <p>On orders over $60</p>
        </div>

        <div className="benefitItem">
          <strong>Easy Returns</strong>
          <p>Within 30 days</p>
        </div>

        <div className="benefitItem">
          <strong>New Drops</strong>
          <p>Every week</p>
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

      <section className="homeRecommended">
        <div className="homeProductShell">
          <div className="homeSectionHead">
            <div>
              <p className="label">Recommended</p>
              <h2>Fresh Picks This Week</h2>
            </div>
          </div>

          <div className="homeProductGrid">
            {recommendedProducts.map((product) => {
              const selectedColor = getSelectedColor(product);
              const currentImage = getCurrentImage(product);

              return (
                <Link
                  to={`/item/${product.id}`}
                  state={{ selectedColor }}
                  className="homeProductCard"
                  key={product.id}
                >
                  <div className="homeProductImage">
                    <span>{product.tag}</span>

                    <img
                      src={currentImage}
                      alt={`${product.name} ${selectedColor}`}
                    />
                  </div>

                  <div className="homeProductFooter">
                    <div>
                      <div className="homeColors">
                        {product.color?.map((color) => (
                          <button
                            key={color}
                            type="button"
                            className={`colorDot ${color.toLowerCase()} ${
                              selectedColor === color ? "active" : ""
                            }`}
                            title={color}
                            aria-label={`Choose ${color}`}
                            onClick={(event) =>
                              handleColorChange(event, product.id, color)
                            }
                          />
                        ))}
                      </div>

                      <h3>{product.name}</h3>
                      <p>{formatPrice(product.price)}</p>
                    </div>

                    <button
                      type="button"
                      className={
                        likedItems[product.id]
                          ? "homeHeart active"
                          : "homeHeart"
                      }
                      onClick={(event) => handleLike(event, product.id)}
                      aria-label="Add to wishlist"
                    >
                      ♥
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <ServiceStrip />
    </main>
  );
}
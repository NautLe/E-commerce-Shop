import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../pageStyles/Home.css";
import PageTitle from "../components/PageTitle";
import PromoModal from "../components/PromoModal";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { getProduct, removeErrors } from "../features/products/productSlice";
import { showToast } from "../utils/showToast";
import Rating from "../components/Rating";

const referenceAssets = "/images";
const categoryCards = [
  ["Women", "women.jpg"],
  ["Men", "men.jpg"],
  ["Unisex", "unisex.jpg"],
  ["Essentials", "essentials.jpg"],
];

const Home = () => {
  const {
    loading,
    error,
    products = [],
  } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const [showPromo, setShowPromo] = useState(true);
  const [activeHero, setActiveHero] = useState(0);
  const heroImages = [
    "hero-bg.jpg",
    "hero-bg-1.jpg",
    "hero-bg-2.jpg",
    "hero-bg-3.jpg",
  ];

  useEffect(() => {
    dispatch(getProduct({ limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      showToast.error(typeof error === 'string' ? error : error.response?.data?.message || error.message);
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    const interval = setInterval(
      () => setActiveHero((current) => (current + 1) % heroImages.length),
      5000
    );
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const getCategoryList = (catName) => {
  return (products || [])
    .filter((p) => p.category?.toLowerCase() === catName.toLowerCase())
    .slice(0, 5);
};
  const menList = getCategoryList("men");
  const womenList = getCategoryList("women");

  return (
    <main className="mocha-home">
      <PageTitle title="MOCHA Store" />
      <Navbar />

      <section className="mocha-hero">
        {heroImages.map((image, index) => (
          <div
            key={image}
            className={`mocha-hero-image mocha-hero-image-${index} ${index === activeHero ? "active" : ""}`}
          />
        ))}
        <div className="mocha-hero-copy">
          <p>SPRING / SUMMER COLLECTION</p>
          <h1>Simple clothes for everyday living.</h1>
          <span>
            Timeless essentials, thoughtful design and comfort in every detail.
          </span>
          <div>
            <Link to="/products" className="mocha-button dark">
              New Arrivals
            </Link>
            <Link to="/products?category=essentials" className="mocha-button">
              Explore Essentials
            </Link>
          </div>
          <section className="mocha-dots">
            {heroImages.map((image, index) => (
              <button
                key={image}
                className={index === activeHero ? "active" : ""}
                onClick={() => setActiveHero(index)}
                aria-label={`Show hero image ${index + 1}`}
              />
            ))}
          </section>
        </div>
      </section>

      <section className="mocha-benefits">
        <div>
          <strong>Free Shipping</strong>
          <span>On orders over $60</span>
        </div>
        <div>
          <strong>Easy Returns</strong>
          <span>Within 30 days</span>
        </div>
        <div>
          <strong>New Drops</strong>
          <span>Every week</span>
        </div>
      </section>

      <section className="mocha-section">
        <p>SHOP BY CATEGORY</p>
        <h2>Everyday essentials, made to move with you.</h2>
        <div className="mocha-categories">
          {categoryCards.map(([label, image]) => (
            <Link to={`/products?category=${label.toLowerCase()}`} key={label}>
              <img src={`${referenceAssets}/${image}`} alt={label} />
              <div>
                <h3>{label}</h3>
                <span>Shop now →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* MEN SECTION */}
      <section className="mocha-products">
        <p>FOR MEN</p>
        <h2>MEN COLLECTION</h2>
        {loading ? (
          <div className="mocha-loading">Loading products…</div>
        ) : (
          <div className="mocha-product-grid">
            {menList.map((product) => {
              const name = product.name;
              const price = Number(product.price).toFixed(2);
              const imageSrc = product.image?.[0]?.url || `${referenceAssets}/tshirt-white.jpg`;
              const targetId = `/product/${product._id}`;
              const ratingVal = product.ratings || 0;
              const numReviews = product.numReviews || product.numOfReviews || 0;

              return (
                <Link
                  key={product._id}
                  to={targetId}
                  className="mocha-product-card"
                >
                  <div className="mocha-product-image">
                    <img src={imageSrc} alt={name} />
                  </div>
                  <div className="mocha-product-info">
                    <h3>{name}</h3>
                    <div className="mocha-product-price-row">
                      <p>${price}</p>
                    </div>
                    <div className="mocha-home-rating-container">
                      <Rating value={ratingVal} disabled={true} />
                      <span className="mocha-home-review-count">
                        ({numReviews} {numReviews === 1 ? "Review" : "Reviews"})
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* WOMEN SECTION */}
      <section className="mocha-products no-top-padding">
        <p>FOR WOMEN</p>
        <h2>WOMEN COLLECTION</h2>
        {loading ? (
          <div className="mocha-loading">Loading products…</div>
        ) : (
          <div className="mocha-product-grid">
            {womenList.map((product) => {
              const name = product.name;
              const price = Number(product.price).toFixed(2);
              const imageSrc = product.image?.[0]?.url || `${referenceAssets}/tshirt-white.jpg`;
              const targetId = `/product/${product._id}`;
              const ratingVal = product.ratings || 0;
              const numReviews = product.numReviews || product.numOfReviews || 0;

              return (
                <Link
                  key={product._id}
                  to={targetId}
                  className="mocha-product-card"
                >
                  <div className="mocha-product-image">
                    <img src={imageSrc} alt={name} />
                  </div>
                  <div className="mocha-product-info">
                    <h3>{name}</h3>
                    <div className="mocha-product-price-row">
                      <p>${price}</p>
                    </div>
                    <div className="mocha-home-rating-container">
                      <Rating value={ratingVal} disabled={true} />
                      <span className="mocha-home-review-count">
                        ({numReviews} {numReviews === 1 ? "Review" : "Reviews"})
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
      <Footer />
      {showPromo && <PromoModal onClose={() => setShowPromo(false)} />}
    </main>
  );
};

export default Home;

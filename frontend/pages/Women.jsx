import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import ServiceStrip from "@/components/ServiceStrip";
import { products } from "@/lib/products";
import { formatPrice } from "@/lib/storage";
import noteBg from "@/assets/images/essentials.jpg";

const womenItemIds = [
  "wide-leg-trousers",
  "cropped-zip-hoodie",
  "minimal-long-skirt",
  "straight-leg-pants",
  "running-shorts",
  "high-waist-leggings",
  "lightweight-windbreaker",
  "active-tennis-dress",
];

const pageSize = 4;

const productTypes = {
  "wide-leg-trousers": "Bottoms",
  "cropped-zip-hoodie": "Tops",
  "minimal-long-skirt": "Bottoms",
  "straight-leg-pants": "Bottoms",
  "running-shorts": "Bottoms",
  "high-waist-leggings": "Bottoms",
  "lightweight-windbreaker": "Outerwear",
  "active-tennis-dress": "Dresses",
};

const chips = ["All", "Tops", "Bottoms", "Dresses", "Outerwear"];

function HangerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M12 7.5C12 5.8 13.2 5 14.3 5C15.7 5 16.7 6 16.7 7.3C16.7 8.5 16 9.2 14.8 9.8L12 11.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M4 20L12 12L20 20H4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3L14.2 8.8L20 11L14.2 13.2L12 19L9.8 13.2L4 11L9.8 8.8L12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Women() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Featured");
  const [featured, setFeatured] = useState("All");
  const [selectedColors, setSelectedColors] = useState({});
  const [likedItems, setLikedItems] = useState({});

  const baseWomenProducts = useMemo(() => {
    let list = womenItemIds
      .map((id) => products.find((product) => product.id === id))
      .filter(Boolean);

    if (filter !== "All") {
      list = list.filter((product) => productTypes[product.id] === filter);
    }

    return list;
  }, [filter]);

  const availableTags = useMemo(() => {
    const tags = baseWomenProducts
      .map((product) => product.tag)
      .filter(Boolean);

    return ["All", ...new Set(tags)];
  }, [baseWomenProducts]);

  const womenProducts = useMemo(() => {
    let list = [...baseWomenProducts];

    if (featured !== "All") {
      list = list.filter(
        (product) => product.tag?.toLowerCase() === featured.toLowerCase()
      );
    }

    if (sort === "Price Low") {
      list = [...list].sort((a, b) => a.price - b.price);
    }

    if (sort === "Price High") {
      list = [...list].sort((a, b) => b.price - a.price);
    }

    if (sort === "Name A-Z") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [baseWomenProducts, sort, featured]);

  const totalPages = Math.ceil(womenProducts.length / pageSize);

  const currentProducts = womenProducts.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  function handleFilterChange(value) {
    setFilter(value);
    setFeatured("All");
    setPage(1);
  }

  function handleSortChange(event) {
    setSort(event.target.value);
    setPage(1);
  }

  function handleFeaturedChange(event) {
    setFeatured(event.target.value);
    setPage(1);
  }

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

      <section className="womenV2Page">
        <div className="womenV2Shell">
          <div className="womenV2Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Women</span>
          </div>

          <div className="womenV2Top">
            <div>
              <h1>Women&apos;s Collection</h1>
              <p>Sporty casual staples. Modern silhouettes.</p>
            </div>

            <div className="womenV2Controls">
              <label>
                <span>Filter</span>
                <select
                  value={filter}
                  onChange={(event) => handleFilterChange(event.target.value)}
                >
                  {chips.map((chip) => (
                    <option key={chip}>{chip}</option>
                  ))}
                </select>
              </label>

              <label>
                <span>Sort by</span>
                <select value={sort} onChange={handleSortChange}>
                  <option>Featured</option>
                  <option>Price Low</option>
                  <option>Price High</option>
                  <option>Name A-Z</option>
                </select>
              </label>

              <label>
                <span>Featured</span>
                <select value={featured} onChange={handleFeaturedChange}>
                  {availableTags.map((tag) => (
                    <option key={tag}>{tag}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div
            className="womenV2Note"
            style={{ "--women-note-bg": `url(${noteBg})` }}
          >
            <div className="womenV2NoteMain">
              <div className="womenV2NoteIcon">
                <HangerIcon />
              </div>

              <div>
                <strong>Women Edit</strong>
                <p>
                  Versatile pieces in soft tones. Designed for comfort, made to
                  move with you.
                </p>
              </div>
            </div>

            <div className="womenV2NoteDetails">
              <div>
                <i />
                <strong>{womenItemIds.length} styles</strong>
              </div>

              <div>
                <div className="womenV2NoteDots">
                  <i />
                  <i />
                  <i />
                </div>

                <strong>White / Black / Beige</strong>
              </div>

              <div>
                <div className="womenV2NoteIcon small">
                  <SparkIcon />
                </div>

                <strong>New season</strong>
              </div>
            </div>
          </div>

          <div className="womenV2Chips">
            {chips.map((chip) => (
              <button
                key={chip}
                type="button"
                className={filter === chip ? "active" : ""}
                onClick={() => handleFilterChange(chip)}
              >
                {chip}
              </button>
            ))}
          </div>

          {womenProducts.length > 0 ? (
            <>
              <div className="womenV2Count">
                <strong>{womenProducts.length} items</strong>
                <span>Tap a color dot to preview each tone.</span>
              </div>

              <div className="womenV2Grid">
                {currentProducts.map((product) => {
                  const selectedColor = getSelectedColor(product);
                  const currentImage = getCurrentImage(product);

                  return (
                    <Link
                      to={`/item/${product.id}`}
                      state={{ selectedColor }}
                      className="womenV2Card"
                      key={product.id}
                    >
                      <div className="womenV2Image">
                        <span>{product.tag}</span>

                        <img
                          src={currentImage}
                          alt={`${product.name} ${selectedColor}`}
                        />
                      </div>

                      <div className="womenV2Footer">
                        <div>
                          <div className="womenV2Colors">
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
                              ? "womenV2Heart active"
                              : "womenV2Heart"
                          }
                          onClick={(event) => handleLike(event, product.id)}
                          aria-label="Add to wishlist"
                        >
                          {likedItems[product.id] ? "♥" : "♡"}
                        </button>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="womenV2Pagination">
                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  >
                    ‹
                  </button>

                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      className={page === index + 1 ? "active" : ""}
                      onClick={() => setPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={page === totalPages}
                    onClick={() =>
                      setPage((prev) => Math.min(totalPages, prev + 1))
                    }
                  >
                    ›
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="womenV2Empty">
              <h2>No products found</h2>
              <p>Try another filter or featured tag.</p>

              <button type="button" onClick={() => handleFilterChange("All")}>
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      <ServiceStrip />
    </main>
  );
}
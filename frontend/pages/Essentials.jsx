import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import ServiceStrip from "@/components/ServiceStrip";
import { products } from "@/lib/products";
import { formatPrice } from "@/lib/storage";

const essentialsItemIds = [
  "minimal-baseball-cap",
  "minimal-5-panel-cap",
  "minimal-sunglasses",
  "minimal-card-holder",
  "minimal-everyday-tote",
  "structured-canvas-tote",
  "classic-webbing-belt",
  "performance-sport-bottle",
];

const productTypes = {
  "minimal-baseball-cap": "Headwear",
  "minimal-5-panel-cap": "Headwear",
  "minimal-sunglasses": "Eyewear",
  "minimal-card-holder": "Accessories",
  "minimal-everyday-tote": "Bags",
  "structured-canvas-tote": "Bags",
  "classic-webbing-belt": "Accessories",
  "performance-sport-bottle": "Sport",
};

const chips = [
  "All",
  "Headwear",
  "Eyewear",
  "Bags",
  "Accessories",
  "Sport",
];

const pageSize = 4;

function BottleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 3H15V6L17 8V20C17 20.55 16.55 21 16 21H8C7.45 21 7 20.55 7 20V8L9 6V3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M9 6H15"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M7 11H17"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3L14.2 8.8L20 11L14.2 13.2L12 19L9.8 13.2L4 11L9.8 8.8L12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Essentials() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Featured");
  const [featured, setFeatured] = useState("All");
  const [selectedColors, setSelectedColors] = useState({});
  const [likedItems, setLikedItems] = useState({});

  const allEssentialsProducts = useMemo(() => {
    return essentialsItemIds
      .map((id) =>
        products.find((product) => product.id === id)
      )
      .filter(Boolean);
  }, []);

  const filteredProducts = useMemo(() => {
    if (filter === "All") {
      return allEssentialsProducts;
    }

    return allEssentialsProducts.filter(
      (product) => productTypes[product.id] === filter
    );
  }, [allEssentialsProducts, filter]);

  const availableTags = useMemo(() => {
    const tags = filteredProducts
      .map((product) => product.tag)
      .filter(Boolean);

    return ["All", ...new Set(tags)];
  }, [filteredProducts]);

  const essentialsProducts = useMemo(() => {
    let list = [...filteredProducts];

    if (featured !== "All") {
      list = list.filter(
        (product) =>
          product.tag?.toLowerCase() === featured.toLowerCase()
      );
    }

    if (sort === "Price Low") {
      list.sort((a, b) => a.price - b.price);
    }

    if (sort === "Price High") {
      list.sort((a, b) => b.price - a.price);
    }

    if (sort === "Name A-Z") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [filteredProducts, featured, sort]);

  const totalPages = Math.ceil(
    essentialsProducts.length / pageSize
  );

  const currentProducts = essentialsProducts.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const bannerImage =
    allEssentialsProducts.find(
      (product) =>
        product.id === "performance-sport-bottle"
    )?.images?.Beige ||
    allEssentialsProducts[0]?.image ||
    "";

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

    setSelectedColors((previousColors) => ({
      ...previousColors,
      [productId]: color,
    }));
  }

  function handleLike(event, productId) {
    event.preventDefault();
    event.stopPropagation();

    setLikedItems((previousItems) => ({
      ...previousItems,
      [productId]: !previousItems[productId],
    }));
  }

  function getSelectedColor(product) {
    return (
      selectedColors[product.id] ||
      product.color?.[0] ||
      "White"
    );
  }

  function getCurrentImage(product) {
    const selectedColor = getSelectedColor(product);

    return product.images?.[selectedColor] || product.image;
  }

  return (
    <main>
      <Header />

      <section className="essentialsV2Page">
        <div className="essentialsV2Shell">
          <div className="essentialsV2Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Essentials</span>
          </div>

          <div className="essentialsV2Top">
            <div>
              <span className="essentialsV2Eyebrow">
                Essentials
              </span>

              <h1>Everyday Essentials</h1>

              <p>
                Minimal accessories, practical carry pieces, and
                sporty essentials designed for everyday routines.
              </p>
            </div>

            <div className="essentialsV2Controls">
              <label>
                <span>Filter</span>

                <select
                  value={filter}
                  onChange={(event) =>
                    handleFilterChange(event.target.value)
                  }
                >
                  {chips.map((chip) => (
                    <option key={chip} value={chip}>
                      {chip}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Sort by</span>

                <select
                  value={sort}
                  onChange={handleSortChange}
                >
                  <option value="Featured">Featured</option>
                  <option value="Price Low">
                    Price Low
                  </option>
                  <option value="Price High">
                    Price High
                  </option>
                  <option value="Name A-Z">
                    Name A-Z
                  </option>
                </select>
              </label>

              <label>
                <span>Featured</span>

                <select
                  value={featured}
                  onChange={handleFeaturedChange}
                >
                  {availableTags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div
            className="essentialsV2Note"
            style={{
              "--essentials-note-bg": bannerImage
                ? `url(${bannerImage})`
                : "none",
            }}
          >
            <div className="essentialsV2NoteMain">
              <div className="essentialsV2NoteIcon">
                <BottleIcon />
              </div>

              <div>
                <strong>Everyday Edit</strong>

                <p>
                  Practical accessories and clean finishing pieces
                  designed to support every part of your day.
                </p>
              </div>
            </div>

            <div className="essentialsV2NoteDetails">
              <div>
                <i />

                <strong>
                  {essentialsItemIds.length} essentials
                </strong>
              </div>

              <div>
                <div className="essentialsV2NoteDots">
                  <i />
                  <i />
                  <i />
                </div>

                <strong>
                  White / Black / Beige
                </strong>
              </div>

              <div>
                <div className="essentialsV2NoteIcon small">
                  <SparkIcon />
                </div>

                <strong>Made for every day</strong>
              </div>
            </div>
          </div>

          <div className="essentialsV2Chips">
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

          {essentialsProducts.length > 0 ? (
            <>
              <div className="essentialsV2Count">
                <strong>
                  {essentialsProducts.length} items
                </strong>

                <span>
                  Tap a color dot to preview each tone.
                </span>
              </div>

              <div className="essentialsV2Grid">
                {currentProducts.map((product) => {
                  const selectedColor =
                    getSelectedColor(product);

                  const currentImage =
                    getCurrentImage(product);

                  return (
                    <Link
                      key={product.id}
                      to={`/item/${product.id}`}
                      state={{ selectedColor }}
                      className="essentialsV2Card"
                    >
                      <div className="essentialsV2Image">
                        {product.tag && (
                          <span>{product.tag}</span>
                        )}

                        <img
                          src={currentImage}
                          alt={`${product.name} ${selectedColor}`}
                          loading="lazy"
                        />
                      </div>

                      <div className="essentialsV2Footer">
                        <div>
                          <div className="essentialsV2Colors">
                            {product.color?.map((color) => (
                              <button
                                key={color}
                                type="button"
                                className={`colorDot ${color.toLowerCase()} ${
                                  selectedColor === color
                                    ? "active"
                                    : ""
                                }`}
                                title={color}
                                aria-label={`Choose ${color}`}
                                onClick={(event) =>
                                  handleColorChange(
                                    event,
                                    product.id,
                                    color
                                  )
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
                              ? "essentialsV2Heart active"
                              : "essentialsV2Heart"
                          }
                          aria-label={
                            likedItems[product.id]
                              ? "Remove from wishlist"
                              : "Add to wishlist"
                          }
                          onClick={(event) =>
                            handleLike(event, product.id)
                          }
                        >
                          {likedItems[product.id] ? "♥" : "♡"}
                        </button>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="essentialsV2Pagination">
                  <button
                    type="button"
                    disabled={page === 1}
                    aria-label="Previous page"
                    onClick={() =>
                      setPage((previousPage) =>
                        Math.max(1, previousPage - 1)
                      )
                    }
                  >
                    ‹
                  </button>

                  {Array.from({
                    length: totalPages,
                  }).map((_, index) => {
                    const pageNumber = index + 1;

                    return (
                      <button
                        key={pageNumber}
                        type="button"
                        className={
                          page === pageNumber ? "active" : ""
                        }
                        onClick={() => setPage(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    disabled={page === totalPages}
                    aria-label="Next page"
                    onClick={() =>
                      setPage((previousPage) =>
                        Math.min(
                          totalPages,
                          previousPage + 1
                        )
                      )
                    }
                  >
                    ›
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="essentialsV2Empty">
              <h2>No products found</h2>

              <p>
                Try another filter or featured tag.
              </p>

              <button
                type="button"
                onClick={() => handleFilterChange("All")}
              >
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
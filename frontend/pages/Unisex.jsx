import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import ServiceStrip from "@/components/ServiceStrip";
import { products } from "@/lib/products";
import { formatPrice } from "@/lib/storage";
import noteBg from "@/assets/images/unisex.jpg";

const unisexItemIds = [
  "oversized-cotton-tshirt",
  "relaxed-fit-shirt",
  "sport-zip-hoodie",
  "half-zip-sweatshirt",
  "essential-crewneck-sweatshirt",
  "relaxed-straight-leg-sweatpants",
  "ribbed-tank-top",
  "lightweight-coach-jacket",
];

const pageSize = 4;

const productTypes = {
  "oversized-cotton-tshirt": "Tops",
  "relaxed-fit-shirt": "Tops",
  "sport-zip-hoodie": "Outerwear",
  "half-zip-sweatshirt": "Tops",
  "essential-crewneck-sweatshirt": "Tops",
  "relaxed-straight-leg-sweatpants": "Bottoms",
  "ribbed-tank-top": "Tops",
  "lightweight-coach-jacket": "Outerwear",
};

const chips = ["All", "Tops", "Bottoms", "Outerwear"];

function HangerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

export default function Unisex() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Featured");
  const [featured, setFeatured] = useState("All");
  const [selectedColors, setSelectedColors] = useState({});
  const [likedItems, setLikedItems] = useState({});

  const baseUnisexProducts = useMemo(() => {
    let list = unisexItemIds
      .map((id) => products.find((product) => product.id === id))
      .filter(Boolean);

    if (filter !== "All") {
      list = list.filter(
        (product) => productTypes[product.id] === filter
      );
    }

    return list;
  }, [filter]);

  const availableTags = useMemo(() => {
    const tags = baseUnisexProducts
      .map((product) => product.tag)
      .filter(Boolean);

    return ["All", ...new Set(tags)];
  }, [baseUnisexProducts]);

  const unisexProducts = useMemo(() => {
    let list = [...baseUnisexProducts];

    if (featured !== "All") {
      list = list.filter(
        (product) =>
          product.tag?.toLowerCase() === featured.toLowerCase()
      );
    }

    if (sort === "Price Low") {
      list = [...list].sort((a, b) => a.price - b.price);
    }

    if (sort === "Price High") {
      list = [...list].sort((a, b) => b.price - a.price);
    }

    if (sort === "Name A-Z") {
      list = [...list].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    return list;
  }, [baseUnisexProducts, featured, sort]);

  const totalPages = Math.ceil(
    unisexProducts.length / pageSize
  );

  const currentProducts = unisexProducts.slice(
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

      <section className="unisexV2Page">
        <div className="unisexV2Shell">
          <div className="unisexV2Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Unisex</span>
          </div>

          <div className="unisexV2Top">
            <div>
              <h1>The Unisex Edit</h1>

              <p>
                Relaxed silhouettes. Neutral tones. Made for every
                wardrobe.
              </p>
            </div>

            <div className="unisexV2Controls">
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
                  <option value="Price Low">Price Low</option>
                  <option value="Price High">Price High</option>
                  <option value="Name A-Z">Name A-Z</option>
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
            className="unisexV2Note"
            style={{
              "--unisex-note-bg": `url(${noteBg})`,
            }}
          >
            <div className="unisexV2NoteMain">
              <div className="unisexV2NoteIcon">
                <HangerIcon />
              </div>

              <div>
                <strong>Unisex Edit</strong>

                <p>
                  Versatile layers, easy silhouettes, and neutral
                  staples designed for comfort and everyday styling.
                </p>
              </div>
            </div>

            <div className="unisexV2NoteDetails">
              <div>
                <i />

                <strong>
                  {unisexItemIds.length} styles
                </strong>
              </div>

              <div>
                <div className="unisexV2NoteDots">
                  <i />
                  <i />
                  <i />
                </div>

                <strong>
                  White / Black / Beige
                </strong>
              </div>

              <div>
                <div className="unisexV2NoteIcon small">
                  <SparkIcon />
                </div>

                <strong>Everyday essentials</strong>
              </div>
            </div>
          </div>

          <div className="unisexV2Chips">
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

          {unisexProducts.length > 0 ? (
            <>
              <div className="unisexV2Count">
                <strong>
                  {unisexProducts.length} items
                </strong>

                <span>
                  Tap a color dot to preview each tone.
                </span>
              </div>

              <div className="unisexV2Grid">
                {currentProducts.map((product) => {
                  const selectedColor =
                    getSelectedColor(product);

                  const currentImage =
                    getCurrentImage(product);

                  return (
                    <Link
                      to={`/item/${product.id}`}
                      state={{ selectedColor }}
                      className="unisexV2Card"
                      key={product.id}
                    >
                      <div className="unisexV2Image">
                        {product.tag && (
                          <span>{product.tag}</span>
                        )}

                        <img
                          src={currentImage}
                          alt={`${product.name} ${selectedColor}`}
                        />
                      </div>

                      <div className="unisexV2Footer">
                        <div>
                          <div className="unisexV2Colors">
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

                          <p>
                            {formatPrice(product.price)}
                          </p>
                        </div>

                        <button
                          type="button"
                          className={
                            likedItems[product.id]
                              ? "unisexV2Heart active"
                              : "unisexV2Heart"
                          }
                          onClick={(event) =>
                            handleLike(event, product.id)
                          }
                          aria-label={
                            likedItems[product.id]
                              ? "Remove from wishlist"
                              : "Add to wishlist"
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
                <div className="unisexV2Pagination">
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
                          page === pageNumber
                            ? "active"
                            : ""
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
            <div className="unisexV2Empty">
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
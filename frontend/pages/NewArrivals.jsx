import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Header from "@/components/Header";
import ServiceStrip from "@/components/ServiceStrip";

import { products } from "@/lib/products";
import { formatPrice } from "@/lib/storage";

const pageSize = 4;

const newArrivalIds = [
  "oversized-cotton-tshirt",
  "wide-leg-trousers",
  "sport-zip-hoodie",
  "cropped-zip-hoodie",
  "minimal-long-skirt",
  "half-zip-sweatshirt",
  "bomber-jacket",
  "ribbed-tank-top",
];

const categoryFilters = [
  "All",
  "Women",
  "Men",
  "Unisex",
];

function SparkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 3L14.3 8.7L20 11L14.3 13.3L12 19L9.7 13.3L4 11L9.7 8.7L12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12H19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M14 7L19 12L14 17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function NewArrivals() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Featured");
  const [selectedColors, setSelectedColors] =
    useState({});
  const [likedItems, setLikedItems] = useState({});

  const allNewArrivals = useMemo(() => {
    return newArrivalIds
      .map((id) =>
        products.find((product) => product.id === id)
      )
      .filter(Boolean);
  }, []);

  const filteredProducts = useMemo(() => {
    if (filter === "All") {
      return allNewArrivals;
    }

    return allNewArrivals.filter(
      (product) => product.category === filter
    );
  }, [allNewArrivals, filter]);

  const displayedProducts = useMemo(() => {
    const list = [...filteredProducts];

    switch (sort) {
      case "Price Low":
        list.sort((a, b) => a.price - b.price);
        break;

      case "Price High":
        list.sort((a, b) => b.price - a.price);
        break;

      case "Name A-Z":
        list.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;

      default:
        break;
    }

    return list;
  }, [filteredProducts, sort]);

  const totalPages = Math.max(
    1,
    Math.ceil(displayedProducts.length / pageSize)
  );

  const currentProducts = displayedProducts.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const bannerImage = useMemo(() => {
    const product = allNewArrivals.find(
      (item) => item.id === "bomber-jacket"
    );

    return (
      product?.images?.Beige ||
      product?.image ||
      allNewArrivals[0]?.image ||
      ""
    );
  }, [allNewArrivals]);

  function handleFilterChange(value) {
    setFilter(value);
    setPage(1);
  }

  function handleSortChange(event) {
    setSort(event.target.value);
    setPage(1);
  }

  function handleColorChange(
    event,
    productId,
    color
  ) {
    event.preventDefault();
    event.stopPropagation();

    setSelectedColors((current) => ({
      ...current,
      [productId]: color,
    }));
  }

  function handleLike(event, productId) {
    event.preventDefault();
    event.stopPropagation();

    setLikedItems((current) => ({
      ...current,
      [productId]: !current[productId],
    }));
  }

  function getSelectedColor(product) {
    return (
      selectedColors[product.id] ||
      product.color?.[0] ||
      "White"
    );
  }

  function getProductImage(product) {
    const selectedColor = getSelectedColor(product);

    return (
      product.images?.[selectedColor] ||
      product.image ||
      ""
    );
  }

  return (
    <main>
      <Header />

      <section className="newArrivalsV2Page">
        <div className="newArrivalsV2Shell">
          <div className="newArrivalsV2Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>New Arrivals</span>
          </div>

          <div className="newArrivalsV2Top">
            <div>
              <span className="newArrivalsV2Eyebrow">
                New Arrivals
              </span>

              <h1>Fresh Styles Just Landed</h1>

              <p>
                Discover the newest silhouettes, updated
                essentials, and fresh everyday pieces
                added to the MOCHA collection.
              </p>
            </div>

            <div className="newArrivalsV2Controls">
              <label>
                <span>Filter</span>

                <select
                  value={filter}
                  onChange={(event) =>
                    handleFilterChange(
                      event.target.value
                    )
                  }
                >
                  {categoryFilters.map((item) => (
                    <option key={item} value={item}>
                      {item}
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
                  <option value="Featured">
                    Featured
                  </option>

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
            </div>
          </div>

          <div
            className="newArrivalsV2Note"
            style={{
              "--new-arrivals-note-bg": bannerImage
                ? `url(${bannerImage})`
                : "none",
            }}
          >
            <div className="newArrivalsV2NoteMain">
              <div className="newArrivalsV2NoteIcon">
                <SparkIcon />
              </div>

              <div>
                <strong>Just Landed</strong>

                <p>
                  New pieces designed for easy layering,
                  everyday movement, and clean modern
                  styling.
                </p>
              </div>
            </div>

            <div className="newArrivalsV2NoteDetails">
              <div>
                <i />

                <strong>
                  {allNewArrivals.length} new styles
                </strong>
              </div>

              <div>
                <div className="newArrivalsV2NoteDots">
                  <i />
                  <i />
                  <i />
                </div>

                <strong>
                  White / Black / Beige
                </strong>
              </div>

              <div>
                <div className="newArrivalsV2NoteIcon small">
                  <ArrowIcon />
                </div>

                <strong>Explore the edit</strong>
              </div>
            </div>
          </div>

          <div className="newArrivalsV2Chips">
            {categoryFilters.map((item) => (
              <button
                key={item}
                type="button"
                className={
                  filter === item ? "active" : ""
                }
                onClick={() =>
                  handleFilterChange(item)
                }
              >
                {item}
              </button>
            ))}
          </div>

          {displayedProducts.length > 0 ? (
            <>
              <div className="newArrivalsV2Count">
                <strong>
                  {displayedProducts.length} items
                </strong>

                <span>
                  Tap a color dot to preview each tone.
                </span>
              </div>

              <div className="newArrivalsV2Grid">
                {currentProducts.map((product) => {
                  const selectedColor =
                    getSelectedColor(product);

                  const productImage =
                    getProductImage(product);

                  return (
                    <Link
                      key={product.id}
                      to={`/item/${product.id}`}
                      state={{ selectedColor }}
                      className="newArrivalsV2Card"
                    >
                      <div className="newArrivalsV2Image">
                        {product.tag && (
                          <span>{product.tag}</span>
                        )}

                        <img
                          src={productImage}
                          alt={`${product.name} ${selectedColor}`}
                          loading="lazy"
                        />
                      </div>

                      <div className="newArrivalsV2Footer">
                        <div>
                          <div className="newArrivalsV2Colors">
                            {product.color?.map(
                              (color) => (
                                <button
                                  key={color}
                                  type="button"
                                  title={color}
                                  aria-label={`Choose ${color}`}
                                  className={`colorDot ${color.toLowerCase()} ${
                                    selectedColor === color
                                      ? "active"
                                      : ""
                                  }`}
                                  onClick={(event) =>
                                    handleColorChange(
                                      event,
                                      product.id,
                                      color
                                    )
                                  }
                                />
                              )
                            )}
                          </div>

                          <h3>{product.name}</h3>

                          <p>
                            {formatPrice(product.price)}
                          </p>
                        </div>

                        <button
                          type="button"
                          aria-label={
                            likedItems[product.id]
                              ? "Remove from wishlist"
                              : "Add to wishlist"
                          }
                          className={
                            likedItems[product.id]
                              ? "newArrivalsV2Heart active"
                              : "newArrivalsV2Heart"
                          }
                          onClick={(event) =>
                            handleLike(
                              event,
                              product.id
                            )
                          }
                        >
                          {likedItems[product.id]
                            ? "♥"
                            : "♡"}
                        </button>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="newArrivalsV2Pagination">
                  <button
                    type="button"
                    disabled={page === 1}
                    aria-label="Previous page"
                    onClick={() =>
                      setPage((currentPage) =>
                        Math.max(
                          1,
                          currentPage - 1
                        )
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
                        onClick={() =>
                          setPage(pageNumber)
                        }
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
                      setPage((currentPage) =>
                        Math.min(
                          totalPages,
                          currentPage + 1
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
            <div className="newArrivalsV2Empty">
              <h2>No products found</h2>

              <p>
                Try selecting another category.
              </p>

              <button
                type="button"
                onClick={() =>
                  handleFilterChange("All")
                }
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </section>

      <ServiceStrip />
    </main>
  );
}
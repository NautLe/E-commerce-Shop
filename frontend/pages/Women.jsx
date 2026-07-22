import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import ServiceStrip from "@/components/ServiceStrip";
import { products } from "@/lib/products";
import { formatPrice } from "@/lib/storage";

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

    if (filter === "Active") {
      list = list.filter((product) => product.tag === "Active");
    } else if (filter !== "All") {
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

      <section className="womenPage">
        <div className="womenShell">
          <div className="womenBreadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Women</span>
          </div>

          <div className="womenTop">
            <div>
              <p className="womenEyebrow">Women</p>
              <h1>Women&apos;s Collection</h1>
              <p>Sporty casual staples. Modern silhouettes.</p>
            </div>

            <div className="womenControls">
              <label>
                Filter
                <select
                  value={filter}
                  onChange={(event) => handleFilterChange(event.target.value)}
                >
                  {chips.map((chip) => (
                    <option key={chip} value={chip}>
                      {chip}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Sort by
                <select value={sort} onChange={handleSortChange}>
                  <option>Featured</option>
                  <option>Price Low</option>
                  <option>Price High</option>
                  <option>Name A-Z</option>
                </select>
              </label>

              <label>
                Featured
                <select value={featured} onChange={handleFeaturedChange}>
                  {availableTags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="womenChipRow">
            {chips.map((chip) => (
              <button
                key={chip}
                type="button"
                className={filter === chip ? "womenChip active" : "womenChip"}
                onClick={() => handleFilterChange(chip)}
              >
                {chip}
              </button>
            ))}
          </div>

          {womenProducts.length > 0 ? (
            <>
              <div className="womenGrid">
                {currentProducts.map((product) => {
                  const selectedColor = getSelectedColor(product);
                  const currentImage = getCurrentImage(product);

                  return (
                    <Link
                      to={`/item/${product.id}`}
                      state={{ selectedColor }}
                      className="womenProductCard"
                      key={product.id}
                    >
                      <div className="womenProductImage">
                        <span>{product.tag}</span>

                        <img
                          src={currentImage}
                          alt={`${product.name} ${selectedColor}`}
                        />
                      </div>

                      <div className="womenProductFooter">
                        <div>
                          <div className="womenColors">
                            {product.color.map((color) => (
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
                              ? "womenHeart active"
                              : "womenHeart"
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

              {totalPages > 1 && (
                <div className="womenPagination">
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
                </div>
              )}
            </>
          ) : (
            <div className="womenEmpty">
              <h2>No products found</h2>
              <p>Try another filter or featured tag.</p>

              <button
                type="button"
                className="btn black"
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
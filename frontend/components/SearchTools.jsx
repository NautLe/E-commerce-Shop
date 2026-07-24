import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Link,
  useLocation,
} from "react-router-dom";

import { products } from "@/lib/products";
import { formatPrice } from "@/lib/storage";

const RECENT_SEARCH_KEY = "mocha_recent_searches";

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="6.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M16 16L21 21"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 6L18 18"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
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
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M14 7L19 12L14 17"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const categoryOptions = [
  "All",
  ...new Set(
    products
      .map((product) => product.category)
      .filter(Boolean)
  ),
];

export default function SearchTools() {
  const location = useLocation();
  const searchRootRef = useRef(null);
  const inputRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Featured");
  const [recentSearches, setRecentSearches] =
    useState([]);

  useEffect(() => {
    try {
      const savedSearches = JSON.parse(
        localStorage.getItem(RECENT_SEARCH_KEY) ||
          "[]"
      );

      if (Array.isArray(savedSearches)) {
        setRecentSearches(savedSearches);
      }
    } catch {
      setRecentSearches([]);
    }
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleKeyboard(event) {
      const isSearchShortcut =
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k";

      if (isSearchShortcut) {
        event.preventDefault();
        setOpen(true);
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyboard
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboard
      );
    };
  }, []);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 60);

    return () => {
      window.clearTimeout(timer);
    };
  }, [open]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query
      .trim()
      .toLowerCase();

    const list = products.filter((product) => {
      const matchesCategory =
        category === "All" ||
        product.category === category;

      const searchableContent = [
        product.id,
        product.name,
        product.tag,
        product.category,
        product.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedQuery ||
        searchableContent.includes(
          normalizedQuery
        );

      return matchesCategory && matchesSearch;
    });

    switch (sort) {
      case "Price Low":
        return [...list].sort(
          (a, b) => a.price - b.price
        );

      case "Price High":
        return [...list].sort(
          (a, b) => b.price - a.price
        );

      case "Name A-Z":
        return [...list].sort((a, b) =>
          a.name.localeCompare(b.name)
        );

      default:
        return list;
    }
  }, [query, category, sort]);

  const visibleProducts =
    filteredProducts.slice(0, 8);

  function saveRecentSearch(value) {
    const normalizedValue = value.trim();

    if (!normalizedValue) {
      return;
    }

    const updatedSearches = [
      normalizedValue,
      ...recentSearches.filter(
        (item) =>
          item.toLowerCase() !==
          normalizedValue.toLowerCase()
      ),
    ].slice(0, 5);

    setRecentSearches(updatedSearches);

    localStorage.setItem(
      RECENT_SEARCH_KEY,
      JSON.stringify(updatedSearches)
    );
  }

  function handleSubmit(event) {
    event.preventDefault();
    saveRecentSearch(query);
  }

  function handleResultClick(product) {
    saveRecentSearch(query || product.name);
    setOpen(false);
  }

  function clearRecentSearches() {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCH_KEY);
  }

  function resetSearch() {
    setQuery("");
    setCategory("All");
    setSort("Featured");
    inputRef.current?.focus();
  }

  return (
    <div
      className="mochaSearchTools"
      ref={searchRootRef}
    >
      <button
        type="button"
        className="mochaSearchTrigger"
        aria-label="Open product search"
        aria-expanded={open}
        onClick={() =>
          setOpen((current) => !current)
        }
      >
        <SearchIcon />
      </button>

      {open && (
        <>
          <div
            className="mochaSearchBackdrop"
            aria-hidden="true"
            onMouseDown={() => setOpen(false)}
          />

          <section
            className="mochaSearchPanel"
            role="dialog"
            aria-modal="true"
            aria-label="Search MOCHA products"
          >
            <div className="mochaSearchPanelHead">
              <div>
                <span>MOCHA SEARCH</span>
                <h2>Find your next essential</h2>
              </div>

              <div className="mochaSearchHeadActions">
                <kbd>Ctrl K</kbd>

                <button
                  type="button"
                  className="mochaSearchClose"
                  aria-label="Close search"
                  onClick={() => setOpen(false)}
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            <form
              className="mochaSearchForm"
              onSubmit={handleSubmit}
            >
              <div className="mochaSearchInputBox">
                <SearchIcon />

                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  placeholder="Search products, categories or styles..."
                  aria-label="Search products"
                  onChange={(event) =>
                    setQuery(event.target.value)
                  }
                />

                {query && (
                  <button
                    type="button"
                    className="mochaSearchClearInput"
                    aria-label="Clear search input"
                    onClick={() => setQuery("")}
                  >
                    <CloseIcon />
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="mochaSearchSubmit"
              >
                Search
              </button>
            </form>

            <div className="mochaSearchToolbar">
              <label>
                <span>Category</span>

                <select
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                >
                  {categoryOptions.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Sort by</span>

                <select
                  value={sort}
                  onChange={(event) =>
                    setSort(event.target.value)
                  }
                >
                  <option value="Featured">
                    Featured
                  </option>

                  <option value="Price Low">
                    Price: Low to High
                  </option>

                  <option value="Price High">
                    Price: High to Low
                  </option>

                  <option value="Name A-Z">
                    Name: A–Z
                  </option>
                </select>
              </label>

              <button
                type="button"
                className="mochaSearchReset"
                onClick={resetSearch}
              >
                Reset tools
              </button>
            </div>

            {recentSearches.length > 0 && (
              <div className="mochaRecentSearches">
                <div className="mochaRecentSearchHead">
                  <strong>Recent searches</strong>

                  <button
                    type="button"
                    onClick={clearRecentSearches}
                  >
                    Clear
                  </button>
                </div>

                <div className="mochaRecentSearchList">
                  {recentSearches.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setQuery(item);
                        inputRef.current?.focus();
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mochaSearchResultHead">
              <div>
                <strong>
                  {filteredProducts.length} results
                </strong>

                <span>
                  {query
                    ? ` for “${query}”`
                    : " from the MOCHA collection"}
                </span>
              </div>

              {filteredProducts.length > 8 && (
                <span>
                  Showing first 8 products
                </span>
              )}
            </div>

            {visibleProducts.length > 0 ? (
              <div className="mochaSearchResultGrid">
                {visibleProducts.map((product) => {
                  const productImage =
                    product.images?.White ||
                    product.image;

                  return (
                    <Link
                      key={product.id}
                      to={`/item/${product.id}`}
                      className="mochaSearchResultCard"
                      onClick={() =>
                        handleResultClick(product)
                      }
                    >
                      <div className="mochaSearchResultImage">
                        {product.tag && (
                          <span>{product.tag}</span>
                        )}

                        <img
                          src={productImage}
                          alt={product.name}
                        />
                      </div>

                      <div className="mochaSearchResultInfo">
                        <div>
                          <small>
                            {product.category}
                          </small>

                          <h3>{product.name}</h3>

                          <p>
                            {formatPrice(
                              product.price
                            )}
                          </p>
                        </div>

                        <div className="mochaSearchResultArrow">
                          <ArrowIcon />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="mochaSearchEmpty">
                <SearchIcon />

                <h3>No products found</h3>

                <p>
                  Try another keyword or reset the
                  search tools.
                </p>

                <button
                  type="button"
                  onClick={resetSearch}
                >
                  Reset Search
                </button>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
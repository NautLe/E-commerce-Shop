import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import Header from "@/components/Header";

import { products } from "@/lib/products";
import {
  addToCart,
  formatPrice,
} from "@/lib/storage";

const clothingSizes = [
  "S",
  "M",
  "L",
  "XL",
];

export default function ItemDetail() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  /*
   * Hỗ trợ cả hai kiểu route:
   * /item/:id
   * /item/:productId
   */
  const productId =
    params.id || params.productId;

  const product = useMemo(() => {
    return (
      products.find(
        (item) => item.id === productId
      ) || null
    );
  }, [productId]);

  const colors = useMemo(() => {
    if (!product) {
      return ["White"];
    }

    if (Array.isArray(product.color)) {
      return product.color.filter(Boolean);
    }

    return product.color
      ? [product.color]
      : ["White"];
  }, [product]);

  const isEssential =
    product?.category === "Essentials";

  const [selectedSize, setSelectedSize] =
    useState("M");

  const [
    selectedColor,
    setSelectedColor,
  ] = useState("White");

  const [quantity, setQuantity] =
    useState(1);

  const [added, setAdded] =
    useState(false);

  /*
   * Đồng bộ lại biến thể mỗi khi chuyển
   * sang một sản phẩm khác.
   */
  useEffect(() => {
    if (!product) {
      return;
    }

    const requestedColor =
      location.state?.selectedColor;

    const nextColor =
      requestedColor &&
      colors.includes(requestedColor)
        ? requestedColor
        : colors[0] || "White";

    setSelectedColor(nextColor);
    setSelectedSize(
      isEssential ? "OS" : "M"
    );
    setQuantity(1);
    setAdded(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [
    product,
    colors,
    isEssential,
    location.state?.selectedColor,
  ]);

  const currentImage = useMemo(() => {
    if (!product) {
      return "";
    }

    return (
      product.images?.[selectedColor] ||
      product.image ||
      ""
    );
  }, [product, selectedColor]);

  const categoryPath = useMemo(() => {
    switch (product?.category) {
      case "Women":
        return "/women";

      case "Men":
        return "/men";

      case "Unisex":
        return "/unisex";

      case "Essentials":
        return "/essentials";

      default:
        return "/";
    }
  }, [product]);

  function handleDecreaseQuantity() {
    setQuantity((previousQuantity) =>
      Math.max(
        1,
        previousQuantity - 1
      )
    );
  }

  function handleIncreaseQuantity() {
    setQuantity(
      (previousQuantity) =>
        previousQuantity + 1
    );
  }

  function handleAddToCart() {
    if (!product) {
      return;
    }

    const finalSize = isEssential
      ? "OS"
      : selectedSize;

    addToCart({
      /*
       * Giữ id để tương thích storage cũ,
       * đồng thời thêm productId để Orders
       * và OrderDetail tìm lại sản phẩm.
       */
      id: product.id,
      productId: product.id,

      name: product.name,
      price: product.price,
      tag: product.tag,
      category: product.category,
      tone: product.tone,

      size: finalSize,
      selectedSize: finalSize,

      color: selectedColor,
      selectedColor,

      image: currentImage,
      quantity,
    });

    setAdded(true);

    window.setTimeout(() => {
      navigate("/cart");
    }, 350);
  }

  if (!product) {
    return (
      <main>
        <Header />

        <section className="page center">
          <h1>Product not found</h1>

          <p>
            The requested product is no
            longer available.
          </p>

          <Link
            to="/"
            className="btn black"
          >
            Back to Home
          </Link>
        </section>

      </main>
    );
  }

  return (
    <main>
      <Header />

      <section className="itemPage">
        {/* Product visual */}

        <div className="itemVisual imageFrame">
          {currentImage ? (
            <img
              src={currentImage}
              alt={`${product.name} in ${selectedColor}`}
              className="itemImage"
            />
          ) : (
            <div className="itemImageFallback">
              Image unavailable
            </div>
          )}
        </div>

        {/* Product information */}

        <div className="itemInfo">
          <nav
            className="womenV2Breadcrumb"
            aria-label="Breadcrumb"
          >
            <Link to="/">Home</Link>

            <span>/</span>

            <Link to={categoryPath}>
              {product.category}
            </Link>

            <span>/</span>

            <span>{product.name}</span>
          </nav>

          {product.tag && (
            <p className="label">
              {product.tag}
            </p>
          )}

          <h1>{product.name}</h1>

          <h2>
            {formatPrice(product.price)}
          </h2>

          <p>
            {product.description ||
              "A clean MOCHA essential designed for everyday wear."}
          </p>

          {/* Color */}

          <div className="option">
            <strong>
              Color: {selectedColor}
            </strong>

            <div className="colorList">
              {colors.map((itemColor) => (
                <button
                  key={itemColor}
                  type="button"
                  className={
                    selectedColor ===
                    itemColor
                      ? "active"
                      : ""
                  }
                  aria-label={`Choose ${itemColor}`}
                  aria-pressed={
                    selectedColor ===
                    itemColor
                  }
                  onClick={() =>
                    setSelectedColor(
                      itemColor
                    )
                  }
                >
                  {itemColor}
                </button>
              ))}
            </div>
          </div>

          {/* Size — Essentials dùng OS */}

          {!isEssential && (
            <div className="option">
              <strong>
                Size: {selectedSize}
              </strong>

              <div className="sizeList">
                {clothingSizes.map(
                  (size) => (
                    <button
                      key={size}
                      type="button"
                      className={
                        selectedSize ===
                        size
                          ? "active"
                          : ""
                      }
                      aria-label={`Choose size ${size}`}
                      aria-pressed={
                        selectedSize ===
                        size
                      }
                      onClick={() =>
                        setSelectedSize(
                          size
                        )
                      }
                    >
                      {size}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {isEssential && (
            <div className="option">
              <strong>Size</strong>

              <div className="sizeList">
                <button
                  type="button"
                  className="active"
                  aria-pressed="true"
                >
                  OS
                </button>
              </div>
            </div>
          )}

          {/* Quantity */}

          <div className="option">
            <strong>Quantity</strong>

            <div className="qty">
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={quantity === 1}
                onClick={
                  handleDecreaseQuantity
                }
              >
                −
              </button>

              <span aria-live="polite">
                {quantity}
              </span>

              <button
                type="button"
                aria-label="Increase quantity"
                onClick={
                  handleIncreaseQuantity
                }
              >
                +
              </button>
            </div>
          </div>

          {/* Add to cart */}

          <button
            className="wideBtn"
            type="button"
            disabled={!currentImage}
            onClick={handleAddToCart}
          >
            {added
              ? "Added to Cart"
              : "Add to Cart"}
          </button>
        </div>
      </section>

    </main>
  );
}
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import { products } from "@/lib/products";
import { addToCart, formatPrice } from "@/lib/storage";

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = useMemo(
    () => products.find((item) => item.id === id),
    [id]
  );

  const sizes = ["S", "M", "L", "XL"];

  const colors = product
    ? Array.isArray(product.color)
      ? product.color
      : [product.color]
    : ["White"];

  const defaultColor = colors[0] || "White";

  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState(defaultColor);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedColor(defaultColor);
      setSelectedSize("M");
      setQuantity(1);
    }
  }, [product, defaultColor]);

  if (!product) {
    return (
      <main>
        <Header />

        <section className="page">
          <h1>Product not found</h1>
        </section>
      </main>
    );
  }

  const currentImage = product.images?.[selectedColor] || product.image;

  function handleAddToCart() {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      tag: product.tag,
      category: product.category,
      tone: product.tone,
      size: selectedSize,
      color: selectedColor,
      image: currentImage,
      quantity,
    });

    navigate("/cart");
  }

  return (
    <main>
      <Header />

      <section className="itemPage">
        <div className="itemVisual imageFrame">
          <img
            src={currentImage}
            alt={`${product.name} ${selectedColor}`}
            className="itemImage"
          />
        </div>

        <div className="itemInfo">
          <p className="label">{product.category}</p>

          <h1>{product.name}</h1>

          <h2>{formatPrice(product.price)}</h2>

          <p>{product.description}</p>

          <div className="option">
            <strong>Color</strong>

            <div className="colorList">
              {colors.map((itemColor) => (
                <button
                  key={itemColor}
                  type="button"
                  className={selectedColor === itemColor ? "active" : ""}
                  onClick={() => setSelectedColor(itemColor)}
                >
                  {itemColor}
                </button>
              ))}
            </div>
          </div>

          <div className="option">
            <strong>Size</strong>

            <div className="sizeList">
              {sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={selectedSize === size ? "active" : ""}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="option">
            <strong>Quantity</strong>

            <div className="qty">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              >
                -
              </button>

              <span>{quantity}</span>

              <button
                type="button"
                onClick={() => setQuantity((prev) => prev + 1)}
              >
                +
              </button>
            </div>
          </div>

          <button className="wideBtn" type="button" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </section>
    </main>
  );
}
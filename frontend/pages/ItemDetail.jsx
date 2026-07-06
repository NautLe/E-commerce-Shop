import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { products } from "@/lib/products";
import { addToCart, formatPrice } from "@/lib/storage";

import shirtWhite from "@/assets/images/shirt-white.jpg";
import shirtBlack from "@/assets/images/shirt-black.jpg";
import shirtBeige from "@/assets/images/shirt-beige.jpg";

const shirtImages = {
  White: shirtWhite,
  Black: shirtBlack,
  Beige: shirtBeige,
};

export default function ItemDetail() {
  const params = useParams();
  const navigate = useNavigate();

  const product = products.find((item) => item.id === params.id);

  const sizes = ["S", "M", "L", "XL"];
  const colors = ["White", "Black", "Beige"];

  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("White");
  const [quantity, setQuantity] = useState(1);

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

  function handleAddToCart() {
    addToCart({
      ...product,
      size: selectedSize,
      color: selectedColor,
      image: shirtImages[selectedColor],
      quantity,
    });

    navigate("/cart");
  }

  return (
    <main>
      <Header />

      <section className="itemPage">
        <div className="itemVisual imageFrame">
          <span>{product.tag}</span>

          <img
            src={shirtImages[selectedColor]}
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
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={selectedColor === color ? "active" : ""}
                >
                  {color}
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
                  onClick={() => setSelectedSize(size)}
                  className={selectedSize === size ? "active" : ""}
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
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>

              <span>{quantity}</span>

              <button type="button" onClick={() => setQuantity(quantity + 1)}>
                +
              </button>
            </div>
          </div>

          <button className="wideBtn" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </section>
    </main>
  );
}

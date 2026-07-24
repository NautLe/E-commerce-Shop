import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { products } from "@/lib/products";
import { formatPrice } from "@/lib/storage";

const categoryTitles = {
  Women: "The Women’s Edit",
  Men: "Men’s Essentials",
  Unisex: "Unisex Favorites",
  Essentials: "Everyday Essentials",
};

export default function CategoryPage({ category }) {
  const filteredProducts = products.filter(
    (product) => product.category === category
  );

  return (
    <main>
      <Header />

      <section className="page">
        <p className="label">{category}</p>

        <h1>
      {category === "Women"
      ? "The Women’s Collection"
      : category === "Men"
      ? "Men’s Essentials"
      : category === "Unisex"
      ? "Unisex Favorites"
      : category === "Essentials"
      ? "Everyday Essentials"
      : `Shop ${category}`}
        </h1>

        <div className="productGrid">
          {filteredProducts.map((product) => (
            <Link
              to={`/item/${product.id}`}
              className="productCard"
              key={product.id}
            >
              <div className="productVisual hasImage">
                <span>{product.tag}</span>

                <img
                  src={product.image}
                  alt={product.name}
                  className="productImage"
                />
              </div>

              <h3>{product.name}</h3>
              <p>{formatPrice(product.price)}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
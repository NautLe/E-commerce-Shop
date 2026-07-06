import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { products } from "@/lib/products";
import { formatPrice } from "@/lib/storage";

export default function CategoryPage({ category }) {
  const categoryProducts = products.filter(
    (product) => product.category === category
  );

  return (
    <main>
      <Header />

      <section className="page">
        <p className="label">{category}</p>
        <h1>Shop {category}</h1>

        {categoryProducts.length === 0 ? (
          <div className="emptyBox">
            <p>No products found in this category.</p>
            <Link to="/" className="btn black">
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="productGrid">
            {categoryProducts.map((product) => (
              <Link
                to={`/item/${product.id}`}
                className="productCard"
                key={product.id}
              >
                <div className={`productVisual ${product.tone}`}>
                  <span>{product.tag}</span>
                </div>

                <h3>{product.name}</h3>
                <p>{formatPrice(product.price)}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

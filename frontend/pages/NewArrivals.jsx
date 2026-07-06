import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { products } from "@/lib/products";
import { formatPrice } from "@/lib/storage";

export default function NewArrivals() {
  const newArrivals = products.filter(
    (product) => product.tag === "New" || product.tag === "Popular"
  );

  return (
    <main>
      <Header />

      <section className="page">
        <p className="label">New Arrivals</p>
        <h1>Fresh styles just landed</h1>

        <div className="productGrid">
          {newArrivals.map((product) => (
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
      </section>
    </main>
  );
}

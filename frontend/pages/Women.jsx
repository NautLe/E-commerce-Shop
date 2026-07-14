import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { products } from "@/lib/products";
import { formatPrice } from "@/lib/storage";

export default function Women() {
  const womenItemIds = [
    "soft-rib-tank-top",
    "wide-leg-trousers",
    "cropped-zip-hoodie",
    "minimal-long-skirt",
    "straight-leg-pants",
    "soft-knit-cardigan",
  ];

  const womenProducts = products.filter((product) =>
    womenItemIds.includes(product.id)
  );

  return (
    <main>
      <Header />

      <section className="page">
        <div className="simplePageHead">
          <div>
            <p className="label">Women</p>
            <h1>All Women</h1>
            <p>Elevated staples. Modern silhouettes.</p>
          </div>
        </div>

        <div className="productGrid">
          {womenProducts.map((product) => (
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
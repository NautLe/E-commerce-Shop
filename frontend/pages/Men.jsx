    import { useMemo, useState } from "react";
    import { Link } from "react-router-dom";
    import Header from "@/components/Header";
    import { products } from "@/lib/products";
    import { formatPrice } from "@/lib/storage";

    const menItemIds = [
    "minimal-utility-jacket",
    "lightweight-track-pants",
    "bomber-jacket",
    "lightweight-sweat-shorts-with-pockets",
    "3-stripes-track-pants",
    "west-mesh-shorts",
                   
    ];

    const pageSize = 4;

    export default function Men() {
    const [filter, setFilter] = useState("All");
    const [sort, setSort] = useState("Featured");
    const [featured, setFeatured] = useState("All");

    const menProducts = useMemo(() => {
        let list = menItemIds
        .map((id) => products.find((product) => product.id === id))
        .filter(Boolean);

        if (filter === "Tops") {
        list = list.filter((product) =>
            ["relaxed-fit-shirt", "sport-zip-hoodie"].includes(product.id)
        );
        }

        if (filter === "Bottoms") {
        list = list.filter((product) =>
            ["lightweight-track-pants"].includes(product.id)
        );
        }

        if (filter === "Outerwear") {
        list = list.filter((product) =>
            ["minimal-utility-jacket"].includes(product.id)
        );
        }

        if (featured !== "All") {
        list = list.filter(
            (product) => product.tag.toLowerCase() === featured.toLowerCase()
        );
        }

        if (sort === "Price Low") {
        list = [...list].sort((a, b) => a.price - b.price);
        }

        if (sort === "Price High") {
        list = [...list].sort((a, b) => b.price - a.price);
        }

        return list;
    }, [filter, sort, featured]);

    const currentProducts = menProducts.slice(0, pageSize);

    function handleFilterChange(event) {
        setFilter(event.target.value);
    }

    function handleSortChange(event) {
        setSort(event.target.value);
    }

    function handleFeaturedChange(event) {
        setFeatured(event.target.value);
    }

    return (
        <main>
        <Header />

        <section className="womenPage">
            <div className="womenTop">
            <div>
                <h1>Men's Essentials</h1>
                <p>Clean layers, sporty basics, and everyday essentials.</p>
            </div>

            <div className="womenControls">
                <label>
                Filter
                <select value={filter} onChange={handleFilterChange}>
                    <option>All</option>
                    <option>Tops</option>
                    <option>Bottoms</option>
                    <option>Outerwear</option>
                </select>
                </label>

                <label>
                Sort by
                <select value={sort} onChange={handleSortChange}>
                    <option>Featured</option>
                    <option>Price Low</option>
                    <option>Price High</option>
                </select>
                </label>

                <label>
                Featured
                <select value={featured} onChange={handleFeaturedChange}>
                    <option>All</option>
                    <option>New</option>
                    <option>Essential</option>
                    <option>Limited</option>
                    <option>Comfort Pick</option>
                </select>
                </label>
            </div>
            </div>

            <div className="womenGrid">
            {currentProducts.map((product) => (
                <Link
                to={`/item/${product.id}`}
                className="womenProductCard"
                key={product.id}
                >
                <div className="womenProductImage">
                    <span>{product.tag}</span>

                    <img src={product.image} alt={product.name} />
                </div>

                <div className="womenColors">
                    {product.color.map((color) => (
                    <span
                        key={color}
                        className={`colorDot ${color.toLowerCase()}`}
                    />
                    ))}
                </div>

                <h3>{product.name}</h3>
                <p>{formatPrice(product.price)}</p>
                </Link>
            ))}
            </div>

            {menProducts.length === 0 && (
            <div className="womenEmpty">
                <h2>No products found</h2>
                <p>Try another filter.</p>
            </div>
            )}
        </section>

        <BottomLabelBar />
        </main>
    );
    }
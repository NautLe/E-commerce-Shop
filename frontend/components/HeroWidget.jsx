import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import heroBg from "@/assets/images/hero-bg.jpg";
import heroBg1 from "@/assets/images/hero-bg-1.jpg";
import heroBg2 from "@/assets/images/hero-bg-2.jpg";
import heroBg3 from "@/assets/images/hero-bg-3.jpg";

const heroImages = [heroBg, heroBg1, heroBg2, heroBg3];

export default function HeroWidget() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((current) => (current + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero">
      {heroImages.map((image, index) => (
        <div
          key={image}
          className={index === active ? "heroBg active" : "heroBg"}
          style={{ backgroundImage: `url(${image})` }}
        />
      ))}

      <div className="heroText">
        <p className="label">Spring / Summer Collection</p>

        <h1>Simple clothes for everyday living.</h1>

        <p>
          Timeless essentials, thoughtful design and comfort in every detail.
        </p>

        <div className="actions">
          <Link to="/new-arrivals" className="btn black">
            New Arrivals
          </Link>

          <Link to="/essentials" className="btn white">
            Explore Essentials
          </Link>
        </div>

        <div className="heroDots">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setActive(index)}
              className={index === active ? "dot active" : "dot"}
              aria-label={`Show hero image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";

export default function Ship() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    ward: "",
  });

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    localStorage.setItem("shipping", JSON.stringify(form));
    navigate("/checkout");
  }

  return (
    <main>
      <Header />

      <section className="page">
        <h1>Shipping Address</h1>

        <form className="form" onSubmit={handleSubmit}>
          <input
            name="fullName"
            placeholder="Full name"
            value={form.fullName}
            onChange={handleChange}
            required
          />

          <input
            name="phone"
            placeholder="Phone number"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            required
          />

          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            required
          />

          <input
            name="district"
            placeholder="District"
            value={form.district}
            onChange={handleChange}
            required
          />

          <input
            name="ward"
            placeholder="Ward"
            value={form.ward}
            onChange={handleChange}
            required
          />

          <button className="wideBtn">Continue to Payment</button>
        </form>
      </section>
    </main>
  );
}

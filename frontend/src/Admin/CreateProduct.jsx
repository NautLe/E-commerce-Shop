import React, { useEffect, useState } from "react";
import "../AdminStyles/CreateProduct.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import {
  createAdminProducts,
  removeErrors,
  removeSuccess,
} from "../features/admin/adminSlice";
import { showToast } from "../utils/showToast";
const CreateProduct = () => {
  const { success, loading, error } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [image, setImage] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  const categories = ["men", "women", "unisex", "essentials"];
  const subcategoriesMap = {
    men: ["Tops", "Bottoms", "Dresses", "Outerwear"],
    women: ["Tops", "Bottoms", "Dresses", "Outerwear"],
    unisex: ["Tops", "Bottoms", "Dresses", "Outerwear"],
    essentials: ["Headwear", "Eyewear", "Bags", "Accessories", "Sport"],
  };

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setCategory(val);
    setSubcategory("");
  };

  const createProductSubmit = (e) => {
    e.preventDefault();

    if (Number(price) && stock <= 0) {
      showToast.error("Value must be greater than 0.");
      return;
    }

    if (image.length === 0) {
      showToast.error("Please select at least one product image.");
      return;
    }
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("price", Number(price).toFixed(2));
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("subcategory", subcategory);
    myForm.set("stock", stock);

    const sizesToSend =
      category?.toLowerCase() === "essentials" ? ["OS"] : ["S", "M", "L", "XL"];
    sizesToSend.forEach((sz) => {
      myForm.append("sizes", sz);
    });

    image.forEach((img) => {
      myForm.append("image", img);
    });
    dispatch(createAdminProducts(myForm));
  };

  const createProductImagePreview = (e) => {
    const files = Array.from(e.target.files);
    setImage([]);
    setImagePreview([]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagePreview((old) => [...old, reader.result]);
          setImage((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    if (error) {
      showToast.error(error);
      dispatch(removeErrors());
    }
    if (success) {
      showToast.success("Product has been created Successfully.");
      dispatch(removeSuccess());
      setName("");
      setPrice("");
      setDescription("");
      setCategory("");
      setSubcategory("");
      setStock("");
      setImage([]);
      setImagePreview([]);
    }
  }, [dispatch, error, success]);

  return (
    <>
      <Navbar />
      <PageTitle title="Create New Product" />
      <div className="create-product-container">
        <h1 className="form-title">Create Product</h1>
        <form
          className="product-form"
          encType="multipart/form-data"
          onSubmit={createProductSubmit}
        >
          <input
            type="text"
            className="form-input"
            placeholder="Enter Product Name"
            required
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            className="form-input"
            placeholder="Enter Product Price"
            required
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Enter Product Description"
            required
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <select
            className="form-select"
            required
            name="category"
            value={category}
            onChange={handleCategoryChange}
          >
            <option value="">Choose a Category</option>
            {categories.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            className="form-select"
            name="subcategory"
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
          >
            <option value="">Choose Subcategory </option>
            {category &&
              subcategoriesMap[category.toLowerCase()]?.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
          </select>

          <input
            type="number"
            className="form-input"
            placeholder="Enter Product Stock"
            required
            name="stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
          <div className="file-input-container">
            <input
              type="file"
              accept="image/*"
              className="form-input-file"
              multiple
              name="image"
              onChange={createProductImagePreview}
            />
          </div>
          <div className="image-preview-container">
            {imagePreview.map((img, index) => (
              <img
                src={img}
                alt="Product Preview"
                className="image-preview"
                key={index}
              />
            ))}
          </div>
          <button className="submit-btn">
            {loading ? "Creating Product..." : "Create"}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default CreateProduct;

import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import "./ProductAdd.css";

function ProductAdd() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [productList, setProductList] = useState([]);
  const [editId, setEditId] = useState(null);

  // 14 Categories
  const categories = [
    "mobiles", 
    "vehicles",
    "property",
    "rent",
    "electronics",
    "bikes",
    "business",
    "services",
    "jobs",
    "animals",
    "furniture",
    "fashion",
    "books",
    "kids"
  ];

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProductList(res.data);
    } catch (err) {
      console.error("Error fetching user's products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFileChange = (e) => setImages([...e.target.files]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const normalizedCategory = category.toLowerCase().trim();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("category", normalizedCategory);
    images.forEach((img) => formData.append("images", img));

    try {
      if (editId) {
        await api.put(`/products/update/${editId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } else {
        await api.post("/products/add", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }

      setTitle("");
      setPrice("");
      setDescription("");
      setCategory("");
      setImages([]);
      setEditId(null);
      fetchProducts();

      alert(" Product added successfully!");
      navigate(`/productlisting/${normalizedCategory}`);
    } catch (err) {
      console.error(err);
      alert("❌ Operation failed");
    }
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setTitle(product.title);
    setPrice(product.price);
    setDescription(product.description);
    setCategory(product.category || "");
    setImages([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/delete/${id}`);
      fetchProducts();
      alert("🗑️ Product deleted");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete");
    }
  };

  return (
    <div className="product-page">
      <div className="form-section">
        <h2>{editId ? "Update Product" : "Post Your Ad"}</h2>
        <form onSubmit={handleSubmit} className="product-form">
          <input
            type="text"
            placeholder="Product Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Price (PKR)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          {/*  Dropdown with 14 categories */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
          <button type="submit">
            {editId ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>

      <div className="product-list-section">
        <h3>My Products</h3>
        <div className="product-scroll">
          {productList.length === 0 ? (
            <p>No products yet.</p>
          ) : (
            productList.map((product) => (
              <div className="product-card" key={product._id}>
                <img
                  src={`http://localhost:5000/${product.images[0]}`}
                  alt={product.title}
                />
                <h4>{product.title}</h4>
                <p className="home-description">{product.description}</p>
                <p>{product.category}</p>
                <p className="price">PKR {product.price}</p>
                <p>Posted {timeAgo(product.createdAt)}</p>
                <div className="card-actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductAdd;

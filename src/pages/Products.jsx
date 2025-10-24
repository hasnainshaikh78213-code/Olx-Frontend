import React, { useEffect, useState } from "react";
import "./Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/products/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch products");
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
        else setProducts([]);
      })
      .catch((err) => {
        console.error("Fetch error:", err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="admin-products-container">
      <h2 className="admin-products-title">All Products</h2>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="admin-products-wrapper">
          {products.map((p) => (
            <div className="admin-product-card" key={p._id}>
              <img
                src={`http://localhost:5000/${p.images?.[0] || ""}`}
                alt={p.title}
                className="admin-product-image"
              />
              <h3 className="admin-product-name">{p.title}</h3>
              <p className="admin-product-description">{p.description}</p>
              <p className="admin-product-price">Rs {p.price}</p>
              <p className="admin-product-category">Category: {p.category}</p>
              <p className="admin-product-user">
                Added by: {p.userId?.name || "Unknown"} ({p.userId?.email || "N/A"})
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;

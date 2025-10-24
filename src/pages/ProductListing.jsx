import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import "./ProductListing.css";

function ProductListing() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategoryProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");

      const filtered = res.data.filter((p) => {
        if (!p.category) return false;
        return (
          p.category.trim().toLowerCase() ===
          (category?.trim().toLowerCase() || "")
        );
      });

      setProducts(filtered);
    } catch (err) {
      console.error("Error loading category products:", err);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchCategoryProducts();
  }, [fetchCategoryProducts]);

  if (loading) return <p className="loading">Loading products...</p>;

  return (
    <div className="listing-container">
      <h2 className="listing-title">Showing Products for: {category}</h2>

      {products.length > 0 ? (
        <div className="listing-cards-wrapper">
          {products.map((item) => (
            <Link
              key={item._id}
              to={`/product2/${item._id}`} 
              className="listing-card"
            >
              <img
                src={
                  item.images && item.images.length > 0
                    ? `http://localhost:5000/${item.images[0].replace(/\\/g, "/")}`
                    : "/no-image.png"
                }
                alt={item.title}
                className="listing-card-image"
              />
              <div className="listing-card-info">
                <h3 className="listing-card-price">PKR {item.price}</h3>
                <p className="listing-card-title">{item.title}</p>
                <p className="listing-card-time">
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString()
                    : ""}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="no-products-text">No products found in this category.</p>
      )}
    </div>
  );
}

export default ProductListing;

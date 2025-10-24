import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import api from "../api";
import "./Home.css";

function Home() {
  const [products, setProducts] = useState([]);

  const handleAddToCart = async (product) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      await api.post(
        "/cart/add",
        { productId: product._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Product added to your cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product");
    }
  };

  const categories = [
    { name: "mobiles", img: "https://www.olx.com.pk/assets/mobiles.73f961c6ad58605c032eb7c2cf12aeaa.png" },
    { name: "vehicles", img: "https://www.olx.com.pk/assets/vehicles.354a5ebfb7f21e87991a277dd4b40f4b.png" },
    { name: "property", img: "https://www.olx.com.pk/assets/property-for-sale.69b01e8dafc182fa3bd469d0ed4fc801.png" },
    { name: "rent", img: "https://www.olx.com.pk/assets/property-for-rent.49f99cc528b9b88da4f33fbe1f0b3346.png" },
    { name: "electronics", img: "https://www.olx.com.pk/assets/electronics-home-appliances.0a30101e6fd7d9ccc8cd6b85b9b44cee.png" },
    { name: "bikes", img: "https://www.olx.com.pk/assets/bikes.0a5064ae987f3bd72801b7bc2c3b6e02.png" },
    { name: "business", img: "https://www.olx.com.pk/assets/business-industrial-agriculture.2ec28979a1bde0183c777a0ce51b37c6.png" },
    { name: "services", img: "https://www.olx.com.pk/assets/services.23d8eb1535f319324813848887961a59.png" },
    { name: "jobs", img: "https://www.olx.com.pk/assets/jobs.dc882b8ff65e94850cc12f5abd605420.png" },
    { name: "animals", img: "https://www.olx.com.pk/assets/animals.476fa9caaf88a12dfbcd6db4c8c6f17a.png" },
    { name: "furniture", img: "https://www.olx.com.pk/assets/furniture-home-decor.47a1998de5f4a8a9e84702dcb40bb313.png" },
    { name: "fashion", img: "https://www.olx.com.pk/assets/fashion-beauty.6ef7c1f060c92b55a6b28bfcfb16a1d2.png" },
    { name: "books", img: "https://www.olx.com.pk/assets/books-sports-hobbies.9406daf905b451fa283048652f414054.png" },
    { name: "kids", img: "https://www.olx.com.pk/assets/kids.5de42a58bc91f81fa22ccc401d7ac285.png" },
  ];

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} days ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products/all");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="home">
      <div className="home-banner">
        <img
          src="https://images.olx.com.pk/thumbnails/563565690-800x600.webp"
          alt="Banner"
        />
      </div>

      <div className="home-categories">
        <h2>All Categories</h2>
        <div className="home-categories-grid">
          {categories.map((cat, index) => (
            <div key={index} className="home-category-wrapper">
              <Link to={`/ProductListing/${cat.name}`}>
                <div className="home-category-card">
                  <div className="home-image-container">
                    <img src={cat.img} alt={cat.name} />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="home-product-section">
        <div className="home-section-header">
          <h2>Latest Products</h2>
          <a href="#">View More</a>
        </div>

        <div className="home-product-grid">
          {products.length === 0 ? (
            <p>No products found</p>
          ) : (
            products.map((item) => (
              <Link to={`/product2/${item._id}`} key={item._id} className="home-link-card">
                <div className="home-product-card">
                  <img
                    src={`http://localhost:5000/${item.images[0]}`}
                    alt={item.title}
                  />
                  <div className="home-product-info">
                    <p className="home-title">{item.title}</p>
                    <p className="home-description">{item.description}</p>
                    <p className="home-category">{item.category}</p>
                    <p className="home-time">Posted {timeAgo(item.createdAt)}</p>
                    <h3 className="home-price">Rs {item.price}</h3>
                    <button
                      className="home-add-to-cart-btn"
                      onClick={(e) => {
                        e.preventDefault(); // prevent redirect on button click
                        handleAddToCart(item);
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;

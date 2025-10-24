import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./HomeProductDetail.css";

function HomeProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error("Failed to fetch product:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChat = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login to chat");

    try {
      const res = await fetch("http://localhost:5000/api/chats/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sellerId: product.userId }),
      });

      const data = await res.json();
      if (res.ok) {
        navigate(`/chat/${data._id}`);
      } else {
        alert(data.message || "Failed to start chat");
      }
    } catch (err) {
      console.error("Chat start error:", err);
    }
  };

  if (loading) return <p>Loading product...</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="home-detail-container">
      <div className="home-detail-card">
        <div className="home-detail-image">
          <img
            src={`http://localhost:5000/${product.images?.[0] || ""}`}
            alt={product.title}
          />
        </div>

        <div className="home-detail-info">
          <h2>{product.title}</h2>
          <p className="home-detail-price">Rs {product.price}</p>
          <p className="home-detail-category">Category: {product.category}</p>
          <p className="home-detail-description">{product.description}</p>

          <p className="home-detail-seller">
            Seller: {product.userId?.name || "Unknown"}
          </p>

          <button className="home-detail-chat-btn" onClick={handleChat}>
            Chat with Seller
          </button>

          
        </div>
      </div>
    </div>
  );
}

export default HomeProductDetail;

import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import "./AddToCart.css";

function AddToCart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data && res.data.products) {
        const cartProducts = res.data.products.map((p) => p.productId);
        setCart(cartProducts.filter(Boolean));
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await api.post(
        "/cart/remove",
        { productId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data && res.data.products) {
        const updatedCart = res.data.products.map((p) => p.productId);
        setCart(updatedCart.filter(Boolean));
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await api.post(
        "/cart/checkout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/checkout");

    } catch (error) {
      console.error("Checkout error:", error);
      alert("Checkout failed");
    }
  };

  if (loading) return <p>Loading your cart...</p>;

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>

      {cart.length === 0 ? (
        <p className="empty-cart">Your cart is empty 🛒</p>
      ) : (
        <>
          <div className="cart-grid">
            {cart.map((item) => (
              <div className="cart-card" key={item._id}>
                <img
                  src={
                    item?.images?.length
                      ? `http://localhost:5000/${item.images[0]}`
                      : "https://via.placeholder.com/150"
                  }
                  alt={item?.title || "No title"}
                />
                <div className="cart-info">
                  <h3>{item.title}</h3>
                  <p className="home-description">{item.description}</p>
                  <p className="home-category">{item.category}</p>
                  <p className="price">Rs {item.price}</p>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemove(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="checkout-section">
            <p className="total-price">
              Total: Rs{" "}
              {cart.reduce((sum, item) => sum + Number(item.price || 0), 0)}
            </p>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default AddToCart;

import React, { useState, useEffect } from "react";
import "./Checkout.css";

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.address || !form.city || !form.cardNumber || !form.expiry || !form.cvv) {
      alert("Please fill all the fields");
      return;
    }

    alert(" Order placed successfully!");
    localStorage.removeItem("cart");
    setCartItems([]);
    setForm({
      name: "",
      email: "",
      address: "",
      city: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
    });
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>

      <div className="checkout-container">
        {/* Left Section - Form */}
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h3>Billing Details</h3>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Shipping Address"
            value={form.address}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            required
          />

          <h3>Payment Information</h3>
          <input
            type="text"
            name="cardNumber"
            placeholder="Card Number"
            maxLength="16"
            value={form.cardNumber}
            onChange={handleChange}
            required
          />
          <div className="card-details">
            <input
              type="text"
              name="expiry"
              placeholder="MM/YY"
              maxLength="5"
              value={form.expiry}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="cvv"
              placeholder="CVV"
              maxLength="3"
              value={form.cvv}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="place-order-btn">
            Place Order
          </button>
        </form>

        {/* Right Section - Summary */}
        <div className="checkout-summary">
          <h3>Order Summary</h3>
          {cartItems.length === 0 ? (
            <p>No items in cart.</p>
          ) : (
            <>
              <ul>
                {cartItems.map((item, index) => (
                  <li key={index}>
                    <span>{item.title}</span>
                    <span>PKR {item.price}</span>
                  </li>
                ))}
              </ul>
              <h4>Total: PKR {totalPrice}</h4>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Checkout;

import { FaUserCircle } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; 
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import Login from "./Login";
import Signup from "./Signup";
import api from "../api";
import "./Navbar.css";

function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSeller, setIsSeller] = useState(false); 
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsLoggedIn(true);
        setIsAdmin(decoded.email === "developers@gmail.com");

        if (decoded.role === "seller" || decoded.isSeller) {
          setIsSeller(true);
        } else {
          setIsSeller(false);
        }
      } catch (err) {
        console.error("Invalid token:", err);
      }
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
      setIsSeller(false);
    }

    fetchCartCount();
    window.addEventListener("cartUpdated", fetchCartCount);
    return () => window.removeEventListener("cartUpdated", fetchCartCount);
  }, [location]);

  const fetchCartCount = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCartCount(0);
      return;
    }

    try {
      const res = await api.get("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data && res.data.products) {
        setCartCount(res.data.products.length);
      } else {
        setCartCount(0);
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
      setCartCount(0);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsAdmin(false);
    setIsSeller(false);
    setCartCount(0);
    navigate("/");
  };

  const handleSellClick = () => {
    if (!isLoggedIn) {
      setShowLogin(true);
    } else {
      navigate("/add-product");
    }
  };

  return (
    <div className="navbar">
      {/* Top Navbar */}
      <div className="navbar-top">
        <Link to="/" className="logo">
          OLX
        </Link>

        <div className="categories-nav-a">
          <img
            src="https://www.olx.com.pk/assets/iconMotors.6bf280165e43e55b173d0a53551e2bfb.png"
            alt="motors"
          />
          <a href="#">Motors</a>
          <img
            src="https://www.olx.com.pk/assets/iconProperty.d09c6d2e3621f900c17c9e8330a1a37b.png"
            alt="property"
          />
          <a href="#">Property</a>
        </div>

        <div className="actions">
  {!isLoggedIn ? (
    <button className="login" onClick={() => setShowLogin(true)}>
      Login
    </button>
  ) : (
    <>
      {/* Admin check: agar admin ho to Sell/Cart/Profile hide */}
      {!isAdmin && (
        <>
          {/* Profile Button */}
          <button
            className="profile-btn"
            onClick={() => navigate("/profile")}
          >
            <FaUserCircle size={35} color="#333" />
          </button>

          {/* Sell Button */}
          <button className="sell-btn" onClick={handleSellClick}>
            + Sell
          </button>

          {/* Seller Chat Button */}
          {isSeller && (
            <button
              className="seller-chat-btn"
              onClick={() => navigate("/seller/chats")}
            >
              My Chats
            </button>
          )}

          {/* Cart Button */}
          <Link to="/cart" className="cart-link">
            <ShoppingCart size={20} />
            <span className="cart-text">Cart</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </>
      )}

      {/* Admin Panel */}
      {isAdmin && (
        <button
          className="dashboard-btn"
          onClick={() => navigate("/admin")}
        >
          Admin Panel
        </button>
      )}

      {/* Logout always dikhe */}
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </>
  )}
</div>

      </div>

      {/* Bottom Navbar */}
      <div className="navbar-bottom">
        <select className="location">
          <option>Pakistan</option>
          <option>Karachi</option>
          <option>Lahore</option>
          <option>Islamabad</option>
        </select>
        <input
          type="text"
          className="search-input"
          placeholder="Find Cars, Mobile Phones and more..."
        />
        <button className="search-btn">🔍 Search</button>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onSwitch={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
        />
      )}

      {/* Signup Modal */}
      {showSignup && (
        <Signup
          onClose={() => setShowSignup(false)}
          onSwitch={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
        />
      )}
    </div>
  );
}

export default Navbar;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import Users from "../pages/Users"; 
import Products from "../pages/Products";
import Orders from "../pages/Orders";
import Settings from "../pages/Settings";
import "./AdminPanel.css";

function AdminPanel({ defaultPage = "users" }) {
  const [activePage, setActivePage] = useState(defaultPage);
  const navigate = useNavigate(); 

  const renderPage = () => {
    switch (activePage) {
      case "users":
        return <Users />;
      case "products":
        return <Products />;
      case "orders":
        return <Orders />;
      case "settings":
        return <Settings />;
      default:
        return <h3>Select a page</h3>;
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-sidebar">
        <span className="close-btn" onClick={() => navigate("/")}>
          &times;
        </span>
        <h2>Admin Dashboard</h2>
        <ul>
          <li onClick={() => setActivePage("users")}>Users</li>
          <li onClick={() => setActivePage("products")}>Products</li>
          <li onClick={() => setActivePage("orders")}>Chats</li>
          {/* <li onClick={() => setActivePage("settings")}>Settings</li> */}
        </ul>
      </div>
      <div className="admin-content">{renderPage()}</div>
    </div>
  );
}

export default AdminPanel;

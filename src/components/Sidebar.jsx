import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="logo">Admin</h2>
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/users">Users</Link></li>
        <li><Link to="/products">Products</Link></li>
        <li><Link to="/settings">Settings</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;

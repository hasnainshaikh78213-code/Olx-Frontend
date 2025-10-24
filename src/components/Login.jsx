import React, { useState } from "react";
import axios from "axios";
import "./LoginSignup.css";

function Login({ onSwitch }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/users/login", form);

      // ✅ Check if backend actually returned a token
      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        setMessage("Login successful!");
        window.location.href = "/"; // redirect to home
      } else {
        setMessage("Login failed: Invalid credentials or missing token");
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage(err.response?.data?.msg || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && <p className="msg">{message}</p>}

        <p className="switch-text">
          Don’t have an account? <span onClick={onSwitch}>Sign Up</span>
        </p>
      </div>
    </div>
  );
}

export default Login;

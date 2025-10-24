import React, { useState } from "react";
import axios from "axios";
import "./LoginSignup.css";

function Signup({ onSwitch }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/users/signup", form);

      console.log("Signup Response:", res.data);

      // ✅ Check if backend sent token
      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        setMessage("Signup successful!");
        window.location.href = "/"; // redirect to home
      } else {
        setMessage(res.data?.msg || "Signup failed: No token received");
      }

      // Reset form
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      console.error("Signup error:", err);
      setMessage(err.response?.data?.msg || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
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
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        {message && <p className="msg">{message}</p>}

        <p className="switch-text">
          Already have an account? <span onClick={onSwitch}>Login</span>
        </p>
      </div>
    </div>
  );
}

export default Signup;

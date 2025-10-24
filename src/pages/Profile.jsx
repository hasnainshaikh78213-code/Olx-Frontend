import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", username: "" });

  useEffect(() => {
    fetchProfile();
    fetchUserProducts();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
      setForm({
        name: res.data.name || "",
        email: res.data.email || "",
        username: res.data.username || "",
      });
    } catch (err) {
      console.error("Error loading profile:", err);
    }
  };

  const fetchUserProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);

    if (selected) {
      const previewURL = URL.createObjectURL(selected);
      setPreview(previewURL);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("username", form.username);
      if (file) formData.append("avatar", file);

      const res = await axios.put("http://localhost:5000/api/users/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      //  Backend se full URL mil raha hai, directly use karo
      setUser(res.data);
      setPreview(null);
      setFile(null);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Error updating profile!");
    }
  };

  if (!user) return <h2 className="loading">Loading profile...</h2>;

  //  Backend ab full image URL bhej raha hai, prefix lagane ki zarurat nahi
  const profileImage = preview
    ? preview
    : user.avatar
    ? user.avatar
    : "/default-avatar.png";

  return (
    <div className="profile-container">
      <h2>My Profile</h2>

      <div className="profile-avatar">
        <img src={profileImage} alt="Profile" />
        <div>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        <div>
          <label>Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} />
        </div>

        <div>
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} />
        </div>

        <div>
          <label>Username</label>
          <input type="text" name="username" value={form.username} onChange={handleChange} />
        </div>

        <button type="submit" className="update-btn">
          Update Profile
        </button>
      </form>

      <div className="products-section">
        <h3>My Products</h3>
        {products.length === 0 ? (
          <p>No products added yet.</p>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                <img
                  src={
                    product.images && product.images.length > 0
                      ? `http://localhost:5000/${product.images[0].replace(/\\/g, "/")}`
                      : "/no-image.png"
                  }
                  alt={product.title}
                />
                <div className="product-info">
                  <h4>{product.title}</h4>
                  <p>Rs {product.price}</p>
                  <p>{product.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

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

  // ==================== Update Profile ====================
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.username = req.body.username || user.username;

    // ✅ If new image uploaded, replace old one in Cloudinary
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const uploadResponse = await cloudinary.uploader.upload(dataURI, {
        folder: "olx_avatars",
      });

      user.avatar = uploadResponse.secure_url; // ✅ Save only Cloudinary URL
    }

    const updatedUser = await user.save();

    // ✅ Send clean, full data (Cloudinary already gives https)
    const userWithFullAvatar = {
      ...updatedUser._doc,
      avatar: updatedUser.avatar || null,
    };

    res.json(userWithFullAvatar);
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


  const fetchUserProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://olx-backend-blue.vercel.app/api/products", {
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
    console.log("token:", localStorage.getItem("token"));

    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("username", form.username);
      if (file) formData.append("avatar", file);

      const res = await axios.put("https://olx-backend-blue.vercel.app/api/users/profile", formData, {
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
  src={product.images?.[0] || "/no-image.png"}
  alt={product.title}
  onError={(e) => (e.target.src = "/no-image.png")}
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

import React, { useState, useEffect } from "react";

function Settings() {
  const [form, setForm] = useState({
    username: "Admin",
    email: "admin@example.com",
    password: "",
    theme: "light",
  });

  const [saved, setSaved] = useState(false);

  //  body scroll disable
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // save settings
  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="settings-section">
      <h2>Admin Settings</h2>

      <form onSubmit={handleSave} className="settings-form">
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </label>

        <label>
          New Password:
          <input
            type="password"
            name="password"
            placeholder="Enter new password"
            value={form.password}
            onChange={handleChange}
          />
        </label>

        <label>
          Theme:
          <select name="theme" value={form.theme} onChange={handleChange}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>

        <button type="submit">Save Settings</button>
      </form>

      {saved && <p className="success-msg"> Settings Saved!</p>}

      {/* Preview */}
      <div className="settings-preview">
        <h3>Profile Preview</h3>
        <p><strong>Username:</strong> {form.username}</p>
        <p><strong>Email:</strong> {form.email}</p>
        <p><strong>Theme:</strong> {form.theme}</p>
      </div>
    </div>
  );
}

export default Settings;

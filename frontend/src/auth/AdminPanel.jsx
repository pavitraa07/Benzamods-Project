import { useState } from "react";
import { useNavigate } from "react-router-dom";

//  get API_BASE from .env
const API_BASE = process.env.REACT_APP_API_BASE;

function AdminPanel() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  //API FUNCTION 
  const loginAdmin = async (credentials) => {
    const res = await fetch(`${API_BASE}/admins/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await loginAdmin(form); 
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div style={pageStyle}>
      <div style={formCardStyle}>
        <h2 style={{ marginBottom: "15px", color: "#fff" }}>Admin Login</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            style={inputStyle}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={inputStyle}
            required
          />
          {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
          <button type="submit" style={buttonStyle}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

const pageStyle = {
  background: "#000",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const formCardStyle = {
  background: "#1c1c1c",
  padding: "30px",
  borderRadius: "12px",
  maxWidth: "400px",
  width: "100%",
  textAlign: "center",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const inputStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #444",
  background: "#2c2c2c",
  color: "#fff",
};

const buttonStyle = {
  padding: "10px 15px",
  border: "none",
  borderRadius: "6px",
  background: "#fff",
  color: "#000",
  cursor: "pointer",
  fontWeight: "bold",
};

export default AdminPanel;

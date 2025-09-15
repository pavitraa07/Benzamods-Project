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
    <div style={pageStyle} className="page">
      <div style={formCardStyle} className="form-card">
        <h2 style={{ marginBottom: "15px", color: "#fff" }}>Admin Login</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            style={inputStyle}
            required
            className="input-animated"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={inputStyle}
            required
            className="input-animated"
          />
          {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
          <button type="submit" style={buttonStyle} className="btn-animated">
            Login
          </button>
        </form>
      </div>

      <style>
        {`
          /* Page fade-in */
          .page {
            animation: fadeIn 0.6s ease-in forwards;
            opacity: 0;
            background: #000;   
            min-height: 100vh; 
          }
          @keyframes fadeIn {
            to {
              opacity: 1;
            }
          }

          /* Card scale + fade-in */
          .form-card {
            animation: popIn 0.6s ease-out forwards;
            transform: scale(0.8);
            opacity: 0;
          }
          @keyframes popIn {
            to {
              transform: scale(1);
              opacity: 1;
            }
          }

          /* Input focus glow */
          .input-animated:focus {
            outline: none;
            border-color: #888;
            box-shadow: 0 0 8px #888;
            transition: all 0.3s ease;
          }

          /* Button hover scale + smooth transition */
          .btn-animated {
            transition: transform 0.2s ease, background 0.3s ease;
          }
          .btn-animated:hover {
            transform: scale(1.05);
            background: #ddd;
          }
        `}
      </style>
    </div>
  );
}

const pageStyle = {
  background: "linear-gradient(135deg, #0d0d0d, #1a1a1a, #000)", 
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const formCardStyle = {
  background: "#151313ff",
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

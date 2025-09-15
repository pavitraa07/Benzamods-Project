import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const API_BASE = process.env.REACT_APP_API_BASE;

const loginApi = (email, password) =>
  axios.post(`${API_BASE}/auth/login`, { email, password });

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath =
    localStorage.getItem("redirectAfterLogin") || location.state?.from || "/";

  const [form, setForm] = useState({ email: "", password: "", role: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.role) {
      setMessage("Please select a role");
      return;
    }

    setLoading(true);
    try {
      const res = await loginApi(form.email, form.password);
      setMessage(res.data.message);

      if (res.data.token) {
        // store token as before
        localStorage.setItem("token", res.data.token);

        // backend might return role either as res.data.role or res.data.user.role
        const backendRole = res.data.role || res.data.user?.role;

        if (form.role === "admin") {
          // allow admin if backend role is "admin" or "both"
          if (backendRole === "admin" || backendRole === "both") {
            navigate("/admin", { replace: true });
          } else {
            setMessage("User not registered as admin");
          }
        } else if (form.role === "user") {
          // for user selection, go to homepage
          navigate("/homepage", { replace: true });
        }

        localStorage.removeItem("redirectAfterLogin");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={cardStyle}
      >
        <h2 style={titleStyle}>Login</h2>

        <form onSubmit={handleLogin} style={formStyle}>
          <motion.input
            whileFocus={{ scale: 1.03, boxShadow: "0 0 10px #38bdf8" }}
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <motion.input
            whileFocus={{ scale: 1.03, boxShadow: "0 0 10px #38bdf8" }}
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          {/* Select Role (User / Admin) */}
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="">Select role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#38bdf8", color: "#000" }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            style={buttonStyle}
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        {message && <p style={errorStyle}>{message}</p>}

        <p style={footerStyle}>
          Don’t have an account?{" "}
          <span onClick={() => navigate("/register")} style={linkStyle}>
            Register here
          </span>
        </p>
      </motion.div>
    </div>
  );
}

const pageStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  background: "linear-gradient(135deg, #000, #111, #000)",
};

const cardStyle = {
  width: "100%",
  maxWidth: "400px",
  background: "#1c1c1c",
  padding: "30px",
  borderRadius: "12px",
  boxShadow: "0 0 25px rgba(0,0,0,0.8)",
  border: "1px solid #333",
  color: "#fff",
  textAlign: "center",
};

const titleStyle = {
  fontSize: "28px",
  fontWeight: "bold",
  marginBottom: "20px",
  color: "#fff",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const inputStyle = {
  padding: "12px",
  borderRadius: "6px",
  border: "1px solid #444",
  background: "#2c2c2c",
  color: "#fff",
  fontSize: "15px",
  outline: "none",
};

const buttonStyle = {
  padding: "12px",
  borderRadius: "6px",
  border: "none",
  background: "#fff",
  color: "#000",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

const errorStyle = {
  marginTop: "12px",
  color: "#ff6b6b",
  fontSize: "14px",
};

const footerStyle = {
  marginTop: "18px",
  fontSize: "14px",
  color: "#aaa",
};

const linkStyle = {
  color: "#38bdf8",
  fontWeight: "bold",
  cursor: "pointer",
};

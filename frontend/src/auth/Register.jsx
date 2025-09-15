import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = process.env.REACT_APP_API_BASE;
const registerUserApi = (data) => axios.post(`${API_BASE}/auth/register`, data);

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  background: "linear-gradient(135deg, #0f0f0f, #1e1e1e)",
  color: "#fff",
};

const cardStyle = {
  background: "#1c1c1c",
  padding: "30px",
  borderRadius: "16px",
  width: "100%",
  maxWidth: "450px",
  boxShadow: "0 0 20px rgba(0,0,0,0.6)",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "8px",
  border: "1px solid #333",
  background: "#2a2a2a",
  color: "#fff",
  fontSize: "14px",
  outline: "none",
};

const selectStyle = {
  ...inputStyle,
  appearance: "none",
  cursor: "pointer",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: "600",
  marginTop: "8px",
};

const messageStyle = {
  textAlign: "center",
  marginTop: "15px",
  fontSize: "14px",
};

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    contact: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNextStep = () => {
    setStep(2); // move directly to password step
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match");
      setMessageType("error");
      return;
    }
    setLoading(true);
    try {
      const res = await registerUserApi({
        name: form.name,
        contact: form.contact,
        address: form.address,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      setMessage(res.data.message);
      setMessageType("success");
      navigate("/login");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error registering user");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  const getMessageColor = () => {
    if (messageType === "success") return "#4ade80"; 
    if (messageType === "error") return "#f87171";
    return "#facc15"; 
  };

  return (
    <div style={containerStyle}>
      <motion.div
        style={cardStyle}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2
          style={{ textAlign: "center", marginBottom: "20px", fontSize: "24px" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Register
        </motion.h2>

        <form onSubmit={handleRegister}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <input
                  style={inputStyle}
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                <input
                  style={inputStyle}
                  type="text"
                  name="contact"
                  placeholder="Contact Number"
                  value={form.contact}
                  onChange={handleChange}
                  required
                />
                <input
                  style={inputStyle}
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={form.address}
                  onChange={handleChange}
                  required
                />
                <input
                  style={inputStyle}
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <select
                  style={selectStyle}
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="both">Both</option>
                </select>

                <motion.button
                  type="button"
                  onClick={handleNextStep}
                  disabled={loading}
                  style={{
                    ...buttonStyle,
                    background: "#2563eb",
                    color: "#fff",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Next
                </motion.button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <input
                  style={inputStyle}
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <input
                  style={inputStyle}
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <motion.button
                  type="submit"
                  disabled={loading}
                  style={{
                    ...buttonStyle,
                    background: "#9333ea",
                    color: "#fff",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {loading ? "Registering..." : "Register"}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <AnimatePresence>
          {message && (
            <motion.p
              key="message"
              style={{ ...messageStyle, color: getMessageColor() }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {message}
            </motion.p>
          )}
        </AnimatePresence>

        <p style={{ textAlign: "center", marginTop: "15px", fontSize: "14px" }}>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{ color: "#3b82f6", cursor: "pointer" }}
          >
            Login
          </span>
        </p>
      </motion.div>
    </div>
  );
}

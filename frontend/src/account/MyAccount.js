import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

function MyAccount() {
  const navigate = useNavigate();

  return (
    <div style={{ background: "#0d0d0d", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <main style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "30px", textAlign: "center" }}>
          <h1 style={{ color: "#fff", fontSize: "42px", marginBottom: "30px" }}>⚡ My Account</h1>

          {/* Manage Orders Button */}
          <motion.button
            whileHover={{ scale: 1.08, boxShadow: "0px 0px 20px #00bfff" }}
            whileTap={{ scale: 0.95 }}
            style={bigButtonStyle}
            onClick={() => navigate("/manageorders")}
          >
            📦 Manage Orders
          </motion.button>

          {/* Manage Profile Button */}
          <motion.button
            whileHover={{ scale: 1.08, boxShadow: "0px 0px 20px #28a745" }}
            whileTap={{ scale: 0.95 }}
            style={{ ...bigButtonStyle, background: "linear-gradient(135deg, #28a745, #1c7c31)" }}
            onClick={() => navigate("/manageprofile")}
          >
            👤 Manage Profile
          </motion.button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

const bigButtonStyle = {
  padding: "20px 40px",
  fontSize: "22px",
  fontWeight: "700",
  borderRadius: "15px",
  border: "none",
  cursor: "pointer",
  color: "#fff",
  background: "linear-gradient(135deg, #007bff, #0056b3)",
  transition: "all 0.3s ease",
  minWidth: "280px",
};

export default MyAccount;

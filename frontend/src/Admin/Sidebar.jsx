import { useState } from "react";
import { motion } from "framer-motion";

function Sidebar({ onSelect }) {
  const [active, setActive] = useState(null);

  const menuItems = [
    { key: "dashboard", label: "Dashboard" },
    { key: "products", label: "Products" },
    { key: "services", label: "Services" },
    { key: "priorityservices", label: "Priority Services" },
    { key: "contact", label: "Contact Messages" },
    { key: "portfolio", label: "Portfolio" },
    { key: "orders", label: "Orders" },
    { key: "manageadmins", label: "Admins" },
    { key: "adminusers", label: "Users" },
    { key: "admininquiries", label: "Inquiries" },
  ];

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 80 }}
      style={{
        width: "220px",
        background: "#111",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        borderRight: "1px solid #333",
        minHeight: "100vh",
      }}
    >
      <h2 style={{ color: "#fff", marginBottom: "20px" }}>Admin Panel</h2>

      {menuItems.map((item) => (
        <button
          key={item.key}
          onClick={() => {
            setActive(item.key);
            onSelect(item.key);
          }}
          style={{
            ...sidebarBtn,
            background: active === item.key ? "#333" : "transparent",
            fontWeight: active === item.key ? "bold" : "normal",
            borderRadius: "8px",
            padding: "8px 12px",
            transition: "all 0.3s ease",
          }}
        >
          {item.label}
        </button>
      ))}
    </motion.div>
  );
}

const sidebarBtn = {
  border: "none",
  color: "#fff",
  textAlign: "left",
  fontSize: "16px",
  cursor: "pointer",
};

export default Sidebar;

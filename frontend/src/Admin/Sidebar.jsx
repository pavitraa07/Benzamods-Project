function Sidebar({ onSelect }) {
  return (
    <div
      style={{
        width: "220px",
        background: "#111",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        borderRight: "1px solid #333",
      }}
    >
      <h2 style={{ color: "#fff", marginBottom: "20px" }}>Admin Panel</h2>

      <button
        onClick={() => onSelect("dashboard")}
        style={sidebarBtn}
      >
        Dashboard
      </button>

      <button
        onClick={() => onSelect("products")}
        style={sidebarBtn}
      >
        Products
      </button>

      <button
        onClick={() => onSelect("services")}
        style={sidebarBtn}
      >
        Services
      </button>

      <button
        onClick={() => onSelect("priorityservices")}
        style={sidebarBtn}
      >
        Priority Services
      </button>

      <button
        onClick={() => onSelect("contact")}
        style={sidebarBtn}
      >
        Contact Messages
      </button>
      
      <button
        onClick={() => onSelect("portfolio")}
        style={sidebarBtn}
      >
        Portfolio
      </button>
      <button
        onClick={() => onSelect("orders")}
        style={sidebarBtn}
      >
        Manage Orders
      </button>
      <button
        onClick={() => onSelect("manageadmins")}
        style={sidebarBtn}
      >
        Manage Admins
      </button>
      <button
        onClick={() => onSelect("adminusers")}
        style={sidebarBtn}
      >
        Manage Users
      </button>
      <button
        onClick={() => onSelect("admininquiries")}
        style={sidebarBtn}
      >
        Manage Inquiries
      </button>
    </div>
  );
}

const sidebarBtn = {
  background: "transparent",
  border: "none",
  color: "#fff",
  textAlign: "left",
  fontSize: "16px",
  cursor: "pointer",
};

export default Sidebar;

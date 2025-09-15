import { useState, useEffect } from "react";

const API_BASE = process.env.REACT_APP_API_BASE;

async function getAdmins() {
  const res = await fetch(`${API_BASE}/admins`);
  return res.json();
}

async function addAdmin(admin) {
  await fetch(`${API_BASE}/admins`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(admin),
  });
}

async function deleteAdmin(id) {
  await fetch(`${API_BASE}/admins/${id}`, { method: "DELETE" });
}

function ManageAdmins() {
  const [admins, setAdmins] = useState([]);
  const [adminForm, setAdminForm] = useState({ username: "", password: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    const data = await getAdmins();
    setAdmins(data);
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    await addAdmin(adminForm);
    fetchAdmins();
    setAdminForm({ username: "", password: "" });
  };

  const handleDeleteClick = (admin) => {
    setAdminToDelete(admin);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!adminToDelete) return;
    await deleteAdmin(adminToDelete._id);
    setAdmins(admins.filter((a) => a._id !== adminToDelete._id));
    setAdminToDelete(null);
    setShowConfirm(false);
  };

  const handleCancelDelete = () => {
    setAdminToDelete(null);
    setShowConfirm(false);
  };

  const filteredAdmins = admins.filter((a) =>
    a.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: "40px", minHeight: "100vh", background: "#0d0d0d", color: "#fff" }}>
      {/* Heading */}
      <h2 style={{ color: "#fff", fontSize: "32px", textAlign: "center", marginBottom: "25px" }}>
        👑 Manage Admins
      </h2>

      {/* Add Admin Form */}
      <div style={formCardStyle}>
        <form onSubmit={handleAdminSubmit} style={formStyle}>
          <input
            type="text"
            placeholder="Username"
            value={adminForm.username}
            onChange={(e) => setAdminForm({ ...adminForm, username: e.target.value })}
            style={inputStyle}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={adminForm.password}
            onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
            style={inputStyle}
            required
          />
          <button type="submit" style={buttonStyle}>
            ➕ Add Admin
          </button>
        </form>
      </div>

      {/* Search Bar */}
      <div style={{ marginTop: "25px", textAlign: "center" }}>
        <input
          type="text"
          placeholder="Search by username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #444",
            background: "#2c2c2c",
            color: "#fff",
            fontSize: "16px",
            width: "100%",
            maxWidth: "600px",
          }}
        />
      </div>

      {/* Admins Table */}
      <div style={{ marginTop: "40px", overflowX: "auto" }}>
        {filteredAdmins.length === 0 ? (
          <p style={{ textAlign: "center", color: "#aaa" }}>No admins found.</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Username</th>
                <th style={thStyle}>Password</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((a, index) => (
                <tr
                  key={a._id}
                  style={{
                    animation: `fadeInUp 0.5s ease forwards`,
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <td style={tdStyle}>{a.username}</td>
                  <td style={{ ...tdStyle, color: "#aaa", fontSize: "14px" }}>{a.password}</td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => handleDeleteClick(a)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: "none",
                        background: "#fff",
                        color: "#000",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "transform 0.3s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation */}
      {showConfirm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              color: "#000",
              padding: "30px",
              borderRadius: "12px",
              minWidth: "320px",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "18px", marginBottom: "20px" }}>
              Are you sure you want to delete <strong>{adminToDelete?.username}</strong>?
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
              <button
                onClick={handleConfirmDelete}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#dc3545",
                  color: "#fff",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Yes, Delete
              </button>
              <button
                onClick={handleCancelDelete}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#6c757d",
                  color: "#fff",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

const formCardStyle = {
  background: "#1c1c1c",
  padding: "20px",
  borderRadius: "12px",
  maxWidth: "600px",
  margin: "0 auto",
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
const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#1a1a1a",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 6px 16px rgba(0,0,0,0.5)",
};
const thStyle = {
  padding: "14px",
  background: "#222",
  color: "#fff",
  textAlign: "left",
  fontSize: "16px",
};
const tdStyle = {
  padding: "12px 14px",
  borderBottom: "1px solid #333",
  fontSize: "15px",
};

export default ManageAdmins;

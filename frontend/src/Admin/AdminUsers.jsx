import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE;

async function getUsers() {
  const res = await axios.get(`${API_BASE}/auth/users`);
  return res.data.users || [];
}

async function deleteUser(id) {
  await axios.delete(`${API_BASE}/auth/users/${id}`);
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete._id);
      setUsers(users.filter((u) => u._id !== userToDelete._id));
    } catch (err) {
      console.error("Error deleting user:", err);
    } finally {
      setUserToDelete(null);
      setShowConfirm(false);
    }
  };

  const handleCancelDelete = () => {
    setUserToDelete(null);
    setShowConfirm(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: "40px", minHeight: "100vh", background: "#0d0d0d", color: "#fff" }}>
      <h1 style={{ textAlign: "center", fontSize: "36px", marginBottom: "20px" }}>👥 Manage Users</h1>

      <input
        type="text"
        placeholder="Search by name..."
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
          display: "block",
          margin: "0 auto 30px",
        }}
      />

      {loading ? (
        <p style={{ textAlign: "center", color: "#aaa" }}>Loading users...</p>
      ) : filteredUsers.length === 0 ? (
        <p style={{ textAlign: "center", color: "#aaa" }}>No users found.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "25px",
          }}
        >
          {filteredUsers.map((user, index) => (
            <div
              key={user._id}
              style={{
                background: "linear-gradient(145deg, #1c1c1c, #292929)",
                borderRadius: "16px",
                padding: "20px",
                color: "#fff",
                boxShadow: "0 8px 20px rgba(0,0,0,0.6)",
                animation: `fadeInUp 0.6s ease forwards`,
                animationDelay: `${index * 0.1}s`,
                position: "relative",
              }}
            >
              <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>{user.name}</h2>
              <p style={{ fontSize: "14px", color: "#ccc", marginBottom: "5px" }}>📧 {user.email}</p>
              <p style={{ fontSize: "14px", color: "#ccc", marginBottom: "10px" }}>📞 {user.contact}</p>
              <p style={{ fontSize: "15px", color: "#eee", lineHeight: 1.5 }}>{user.address}</p>

              <button
                onClick={() => handleDeleteClick(user)}
                style={{
                  position: "absolute",
                  top: "15px",
                  right: "15px",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: "none",
                  background: "linear-gradient(135deg, #f9f7f7ff, #ffffffff)",
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
            </div>
          ))}
        </div>
      )}

      {showConfirm && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#fff",
            color: "#000",
            padding: "30px",
            borderRadius: "12px",
            minWidth: "320px",
            textAlign: "center"
          }}>
            <p style={{ fontSize: "18px", marginBottom: "20px" }}>
              Are you sure you want to delete <strong>{userToDelete?.name}</strong>?
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
              <button
                onClick={handleConfirmDelete}
                style={{ padding: "10px 20px", borderRadius: "8px", border: "none", background: "#dc3545", color: "#fff", fontWeight: "600", cursor: "pointer" }}
              >
                Yes, Delete
              </button>
              <button
                onClick={handleCancelDelete}
                style={{ padding: "10px 20px", borderRadius: "8px", border: "none", background: "#6c757d", color: "#fff", fontWeight: "600", cursor: "pointer" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(40px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

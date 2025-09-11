import { useState, useEffect } from "react";

const API_BASE =  process.env.REACT_APP_API_BASE;

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
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <h2 style={{ color: "#fff" }}>Add Admin</h2>
        <input
          type="text"
          placeholder="Search by username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #444",
            background: "#2c2c2c",
            color: "#fff",
            fontSize: "14px",
            maxWidth: "250px",
          }}
        />
      </div>

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
            Add Admin
          </button>
        </form>
      </div>

      <div
        style={{
          marginTop: "30px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {filteredAdmins.map((a) => (
          <div
            key={a._id}
            style={{
              background: "#222",
              borderRadius: "10px",
              padding: "15px",
              textAlign: "center",
            }}
          >
            <h3>{a.username}</h3>
            <p style={{ fontSize: "12px", color: "#aaa", wordBreak: "break-all" }}>
              {a.password}
            </p>
            <button
              onClick={() => handleDeleteClick(a)}
              style={{ ...buttonStyle, background: "#fff", color: "#000", marginTop: "10px" }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

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
    </>
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

export default ManageAdmins;

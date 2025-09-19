import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_BASE = process.env.REACT_APP_API_BASE;

const getAllUsers = () => axios.get(`${API_BASE}/auth/users`);
const updateUser = (id, data) => axios.put(`${API_BASE}/auth/users/${id}`, data);

function ManageProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggedOut, setLoggedOut] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", contact: "", address: "" });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      setLoggedOut(true);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const email = decoded?.email;
      if (!email) {
        setLoading(false);
        setLoggedOut(true);
        return;
      }

      getAllUsers()
        .then(({ data }) => {
          const matchedUser = data.users.find((u) => u.email === email);
          setUser(matchedUser || null);
          if (matchedUser) {
            setEditForm({
              name: matchedUser.name,
              email: matchedUser.email,
              contact: matchedUser.contact,
              address: matchedUser.address,
            });
          }
          setLoading(false);
          if (!matchedUser) setLoggedOut(true);
        })
        .catch((err) => {
          console.error("API error:", err);
          setLoading(false);
          setLoggedOut(true);
        });
    } catch (err) {
      console.error("JWT decode error:", err);
      setLoading(false);
      setLoggedOut(true);
    }
  }, []);

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(user._id, editForm);
      setUser({ ...user, ...editForm });
      setShowEditModal(false);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      await updateUser(user._id, { password: passwordForm.newPassword });
      setShowPasswordModal(false);
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error("Password update error:", err);
    }
  };

  return (
    <div style={{ background: "#0d0d0d", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <main style={{ flex: 1, padding: "40px", color: "#fff" }}>
        {loading ? (
          <p style={{ textAlign: "center" }}>Loading profile...</p>
        ) : loggedOut ? (
          <div style={{ textAlign: "center", marginTop: "100px" }}>
            <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>
              ❌ Oops! Please login to view your profile.
            </h2>
            <button
              onClick={handleLoginRedirect}
              style={buttonStyle}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Login Now
            </button>
          </div>
        ) : (
          <div>
            <h1 style={{ textAlign: "center", fontSize: "36px", marginBottom: "30px" }}>👤 My Profile</h1>
            <div style={cardStyle}>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Contact:</strong> {user.contact}</p>
              <p><strong>Address:</strong> {user.address}</p>
              <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</p>

              <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginTop: "20px" }}>
                <button style={buttonStyle} onClick={() => setShowEditModal(true)}>
                  ✏️ Edit Profile
                </button>
                <button style={buttonStyle} onClick={() => setShowPasswordModal(true)}>
                  🔑 Change Password
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3 style={{ marginBottom: "20px" }}>✏️ Edit Profile</h3>
            <form onSubmit={handleEditSubmit} style={formStyle}>
              <input
                type="text"
                placeholder="Name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                style={inputStyle}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                style={inputStyle}
                required
              />
              <input
                type="text"
                placeholder="Contact"
                value={editForm.contact}
                onChange={(e) => setEditForm({ ...editForm, contact: e.target.value })}
                style={inputStyle}
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                style={inputStyle}
                required
              />
              <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                <button type="submit" style={{ ...buttonStyle, background: "#28a745", color: "#fff" }}>
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  style={{ ...buttonStyle, background: "#6c757d", color: "#fff" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3 style={{ marginBottom: "20px" }}>🔑 Change Password</h3>
            <form onSubmit={handlePasswordSubmit} style={formStyle}>
              <input
                type="password"
                placeholder="Old Password"
                value={passwordForm.oldPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                style={inputStyle}
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                style={inputStyle}
                required
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                style={inputStyle}
                required
              />
              <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                <button type="submit" style={{ ...buttonStyle, background: "#28a745", color: "#fff" }}>
                  Save Password
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  style={{ ...buttonStyle, background: "#6c757d", color: "#fff" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const cardStyle = {
  background: "linear-gradient(145deg, #1c1c1c, #292929)",
  padding: "25px",
  borderRadius: "15px",
  maxWidth: "600px",
  margin: "0 auto",
  boxShadow: "0 8px 25px rgba(0,0,0,0.5)",
};
const buttonStyle = {
  padding: "12px 20px",
  fontSize: "16px",
  fontWeight: "600",
  borderRadius: "50px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#fff",
  color: "#000",
  transition: "transform 0.3s ease",
};
const modalOverlay = {
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
};
const modalContent = {
  background: "#1c1c1c",
  color: "#fff",
  padding: "30px",
  borderRadius: "12px",
  minWidth: "350px",
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
  fontSize: "16px",
};

export default ManageProfile;

import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; 
import axios from "axios";
import Header from "../components/Header";   
import Footer from "../components/Footer";   

// API_BASE from frontend .env
const API_BASE = process.env.REACT_APP_API_BASE;

// API function
const getAllUsers = () => axios.get(`${API_BASE}/auth/users`);

function ManageProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const email = decoded?.email;
      if (!email) {
        setLoading(false);
        return;
      }

      getAllUsers()
        .then(({ data }) => {
          const matchedUser = data.users.find((u) => u.email === email);
          setUser(matchedUser || null);
          setLoading(false);
        })
        .catch((err) => {
          console.error("API error:", err);
          setLoading(false);
        });
    } catch (err) {
      console.error("JWT decode error:", err);
      setLoading(false);
    }
  }, []);

  if (loading) return <p style={{ color: "#fff" }}>Loading profile...</p>;
  if (!user) return <p style={{ color: "#fff" }}>❌ No profile found.</p>;

  return (
    <div style={{ background: "#0d0d0d", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <main style={{ flex: 1, padding: "40px", color: "#fff" }}>
        <h1 style={{ textAlign: "center", fontSize: "36px", marginBottom: "30px" }}>👤 My Profile</h1>
        <div
          style={{
            background: "linear-gradient(145deg, #1c1c1c, #292929)",
            padding: "25px",
            borderRadius: "15px",
            maxWidth: "600px",
            margin: "0 auto",
            boxShadow: "0 8px 25px rgba(0,0,0,0.5)",
          }}
        >
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Contact:</strong> {user.contact}</p>
          <p><strong>Address:</strong> {user.address}</p>
          <p><strong>Verified:</strong> {user.isVerified ? "✅ Yes" : "❌ No"}</p>
          <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</p>
          <p><strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()}</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ManageProfile;

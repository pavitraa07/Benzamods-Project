import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";   
import Footer from "../components/Footer";   

// API_BASE from frontend .env
const API_BASE = process.env.REACT_APP_API_BASE;

// API function
const getAllUsers = () => axios.get(`${API_BASE}/auth/users`);

function ManageProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggedOut, setLoggedOut] = useState(false);
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

  return (
    <div style={{ background: "#0d0d0d", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <main style={{ flex: 1, padding: "40px", color: "#fff" }}>
        {loading ? (
          <p style={{ textAlign: "center" }}>Loading profile...</p>
        ) : loggedOut ? (
          <div
            style={{
              textAlign: "center",
              marginTop: "100px",
            }}
          >
            <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>❌ Oops! Please login to view your profile.</h2>
            <button
              onClick={handleLoginRedirect}
              style={{
                padding: "12px 30px",
                fontSize: "16px",
                fontWeight: "600",
                borderRadius: "50px",
                border: "none",
                cursor: "pointer",
                backgroundColor: "#fff",
                color: "#000",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Login Now
            </button>
          </div>
        ) : (
          <div>
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
              <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default ManageProfile;

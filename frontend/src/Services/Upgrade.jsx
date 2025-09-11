import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_BASE = process.env.REACT_APP_API_BASE;

async function submitInquiry(formData, token) {
  const res = await fetch(`${API_BASE}/inquiries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || errorData.message || "Failed to submit inquiry");
  }

  return await res.json();
}

function Upgrade() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    address: "",
    vehicleName: "",
    vehicleModel: "",
    contact: "",
    details: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

  const features = [
    { title: "Suspension Upgrade", description: "Enhance ride quality and handling with premium suspension kits.", image: "https://i.pinimg.com/736x/10/f3/c8/10f3c86eed978a375ce2ead683887c9d.jpg" },
    { title: "Exhaust System", description: "Boost performance and get a sportier sound with a new exhaust.", image: "https://i.pinimg.com/736x/44/60/de/4460dea1426d90fa451a2a2b67529e36.jpg" },
    { title: "Turbocharger Kit", description: "Increase horsepower with a powerful and efficient turbo system.", image: "https://i.pinimg.com/736x/7f/f3/82/7ff3820900e9ef7bb5b07bcd6eac33b5.jpg" },
    { title: "Brake Upgrade", description: "Improve safety and performance with high-performance brakes.", image: "https://i.pinimg.com/1200x/b4/49/11/b44911f1f950750d5974162eb52e44bd.jpg" },
    { title: "High-Performance Tires", description: "Get better grip and control with racing-grade tires.", image: "https://i.pinimg.com/736x/b5/45/1d/b5451d10517e8c40c06739dfdf6c9a71.jpg" },
    { title: "Infotainment System", description: "Upgrade your dashboard with the latest tech and connectivity.", image: "https://i.pinimg.com/1200x/56/7a/0d/567a0d53fdea3fa3ad8ab826b833633b.jpg" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      localStorage.setItem("redirectAfterLogin", "/upgrade");
      setShowLoginModal(true);
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
    await submitInquiry({
      ...form,
      service: "68b1802bab6122093072c7c5", // Upgrade service ID
      serviceTitle: "Premium Vehicle Upgrades",
      category: "Bike",
    }, token);

    setMessage("✅ Inquiry submitted successfully!");
    setForm({
      name: "",
      address: "",
      vehicleName: "",
      vehicleModel: "",
      contact: "",
      details: "",
    });
  } catch (err) {
    setMessage(`❌ ${err.message}`);
  } finally {
    setSubmitting(false);
  }
};

  return (
    <>
      <Header/>
      <div style={{ padding: "60px 20px", background: "#0d0d0d", color: "#fff", minHeight: "100vh" }}>
        <Helmet>
          <title>Premium Vehicle Upgrades | Benzamods</title>
        </Helmet>

        <h1 style={{ marginBottom: "30px", fontSize: "2.5rem", textAlign: "center" }}>Premium Vehicle Upgrades</h1>

        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "40px" }}>
          {/* Features Section */}
          <div style={{ background: "#1a1a1a", padding: "30px", borderRadius: "10px" }}>
            <h2 style={{ marginBottom: "20px", fontSize: "1.8rem", borderBottom: "1px solid #444", paddingBottom: "10px" }}>Available Upgrades</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              {features.map((feature, i) => (
                <div key={i} style={{ background: "#262626", padding: "20px", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                  <h3 style={{ marginBottom: "10px", color: "#40c0f0" }}>{feature.title}</h3>
                  <p style={{ fontSize: "0.95rem", lineHeight: "1.4", textAlign: "center" }}>{feature.description}</p>
                  <img src={feature.image} alt={feature.title} style={{ width: "100%", borderRadius: "6px", objectFit: "cover" }} loading="lazy" />
                </div>
              ))}
            </div>
          </div>

          {/* Inquiry Form */}
          <div style={{ background: "#1a1a1a", padding: "30px", borderRadius: "10px" }}>
            <h2 style={{ marginBottom: "20px", fontSize: "1.8rem", borderBottom: "1px solid #444", paddingBottom: "10px" }}>Upgrade Inquiry</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", maxWidth: "600px" }}>
              <input type="text" placeholder="Your Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
              <input type="text" placeholder="Address" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} style={inputStyle} />
              <input type="text" placeholder="Vehicle Name" required value={form.vehicleName} onChange={(e) => setForm({ ...form, vehicleName: e.target.value })} style={inputStyle} />
              <input type="text" placeholder="Vehicle Model" required value={form.vehicleModel} onChange={(e) => setForm({ ...form, vehicleModel: e.target.value })} style={inputStyle} />
              <input type="tel" placeholder="Contact Number" required value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} style={inputStyle} />
              <textarea placeholder="Upgrade Details" required rows="4" value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} style={{ ...inputStyle, minHeight: "100px" }} />
              <button type="submit" disabled={submitting} style={buttonStyle}>{submitting ? "Submitting..." : "Submit Inquiry"}</button>
              {message && <div style={{ color: "#fff" }}>{message}</div>}
            </form>
          </div>
        </div>

        {/* Login Modal */}
        {showLoginModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
            <div style={{ background: "#fff", padding: "30px", borderRadius: "10px", textAlign: "center" }}>
              <h3>Please Login to Continue</h3>
              <button onClick={() => navigate("/login")} style={{ ...buttonStyle, marginTop: "15px", background: "#40c0f0", color: "#000" }}>Go to Login</button>
              <button onClick={() => setShowLoginModal(false)} style={{ ...buttonStyle, marginTop: "10px" }}>Cancel</button>
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </>
  );
}

const inputStyle = { padding: "12px", borderRadius: "6px", border: "1px solid #444", background: "#333", color: "#fff", fontSize: "1rem" };
const buttonStyle = { padding: "12px", borderRadius: "6px", border: "none", background: "#40c0f0", color: "#000", fontWeight: "bold", cursor: "pointer" };

export default Upgrade;

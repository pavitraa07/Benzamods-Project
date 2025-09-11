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

function Tuning() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    address: "",       // previously email
    vehicleName: "",   // previously carModel
    vehicleModel: "",  // previously tuningType
    contact: "",       // previously phone
    details: "",       // previously message
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

  const features = [
    { title: "Engine Remapping", description: "Optimize engine performance and fuel efficiency with remapping.", image: "https://i.pinimg.com/736x/70/38/cb/7038cbb79d45a505a674586c1f6b8195.jpg" },
    { title: "ECU Flashing", description: "Reprogram your car’s ECU to unlock hidden power and response.", image: "https://i.pinimg.com/736x/8e/51/52/8e515291237d6dc9dff2dd098069cdce.jpg" },
    { title: "Fuel System Optimization", description: "Balance fuel delivery for smoother acceleration and power.", image: "https://i.pinimg.com/736x/bb/31/31/bb3131c618fff3ed2a387f2330cb1057.jpg" },
    { title: "Exhaust Tuning", description: "Enhance exhaust flow for more power and aggressive sound.", image: "https://i.pinimg.com/736x/66/4d/ec/664deccd84ae81a9713792b7d73d590f.jpg" },
    { title: "Dyno Testing", description: "Get accurate performance metrics with precision dyno tuning.", image: "https://i.pinimg.com/1200x/db/65/32/db65329a9c752a0babff6d10154e1cfc.jpg" },
    { title: "Air Intake System", description: "Boost airflow and horsepower with a tuned intake system.", image: "https://i.pinimg.com/1200x/57/d2/29/57d229704e99bc0a00d439bbaa127d5c.jpg" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      localStorage.setItem("redirectAfterLogin", "/tuning");
      setShowLoginModal(true);
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
  await submitInquiry({
    ...form,
    service: "68b17f1aab6122093072c7c0", // Tuning ID
    serviceTitle: "Precision Performance Tuning",
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
}
 finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header/>
      <div style={{ padding: "60px 20px", background: "#0d0d0d", color: "#fff", minHeight: "100vh" }}>
        <Helmet>
          <title>Precision Performance Tuning | Benzamods</title>
        </Helmet>

        <h1 style={{ marginBottom: "30px", fontSize: "2.5rem", textAlign: "center" }}>Precision Performance Tuning</h1>

        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "40px" }}>
          <div style={{ background: "#1a1a1a", padding: "30px", borderRadius: "10px" }}>
            <h2 style={{ marginBottom: "20px", fontSize: "1.8rem", borderBottom: "1px solid #444", paddingBottom: "10px" }}>Available Services</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              {features.map((feature, i) => (
                <div key={i} style={{ background: "#262626", padding: "20px", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                  <h3 style={{ marginBottom: "10px", color: "#f0c040" }}>{feature.title}</h3>
                  <p style={{ fontSize: "0.95rem", lineHeight: "1.4", textAlign: "center" }}>{feature.description}</p>
                  <img src={feature.image} alt={feature.title} style={{ width: "100%", borderRadius: "6px", objectFit: "cover" }} loading="lazy" />
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "#1a1a1a", padding: "30px", borderRadius: "10px" }}>
            <h2 style={{ marginBottom: "20px", fontSize: "1.8rem", borderBottom: "1px solid #444", paddingBottom: "10px" }}>Tuning Inquiry</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", maxWidth: "600px" }}>
              <input type="text" placeholder="Your Name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
              <input type="text" placeholder="Address" required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} style={inputStyle} />
              <input type="text" placeholder="Vehicle Name" required value={form.vehicleName} onChange={e => setForm({ ...form, vehicleName: e.target.value })} style={inputStyle} />
              <input type="text" placeholder="Vehicle Model" required value={form.vehicleModel} onChange={e => setForm({ ...form, vehicleModel: e.target.value })} style={inputStyle} />
              <input type="tel" placeholder="Contact Number" required value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} style={inputStyle} />
              <textarea placeholder="Service Details" required rows="4" value={form.details} onChange={e => setForm({ ...form, details: e.target.value })} style={{ ...inputStyle, minHeight: "100px" }} />
              <button type="submit" disabled={submitting} style={buttonStyle}>{submitting ? "Submitting..." : "Submit Inquiry"}</button>
              {message && <div style={{ color: "#fff" }}>{message}</div>}
            </form>
          </div>
        </div>

        {showLoginModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
            <div style={{ background: "#fff", padding: "30px", borderRadius: "10px", textAlign: "center" }}>
              <h3>Please Login to Continue</h3>
              <button onClick={() => navigate("/login")} style={{ ...buttonStyle, marginTop: "15px", background: "#f0c040", color: "#000" }}>Go to Login</button>
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
const buttonStyle = { padding: "12px", borderRadius: "6px", border: "none", background: "#f0c040", color: "#000", fontWeight: "bold", cursor: "pointer" };

export default Tuning;

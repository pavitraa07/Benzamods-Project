import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "../components/Header";
import Footer from "../components/Footer"

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


function Customization() {
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
    { title: "Window Tinting", description: "Enhance privacy and reduce heat with professional-grade tinting.", image: "https://i.pinimg.com/1200x/13/34/24/133424cec03695a1a94767001263aeec.jpg" },
    { title: "Custom Paint Job", description: "Give your car a fresh look with a personalized paint finish.", image: "https://i.pinimg.com/1200x/7a/eb/31/7aeb31fc65cf9d379ac7836c23021c3a.jpg" },
    { title: "Seat Covers", description: "Upgrade your interior with stylish and comfortable seat covers.", image: "https://i.pinimg.com/736x/9a/e9/9e/9ae99efd7d6ab822ac2b619ae601ec9e.jpg" },
    { title: "Alloy Wheels", description: "Improve aesthetics and performance with modern alloy wheels.", image: "https://i.pinimg.com/736x/fd/a9/5e/fda95eae5775e5d60816267d3d797f11.jpg" },
    { title: "LED Headlights", description: "Upgrade to energy-efficient, brighter headlights.", image: "https://i.pinimg.com/1200x/38/39/58/3839587e57a64d0053a631b83f2ecf74.jpg" },
    { title: "Interior Detailing", description: "Keep your car's interior spotless with professional detailing.", image: "https://i.pinimg.com/1200x/1a/7e/dd/1a7edd93d8ee948e32432865f83ee224.jpg" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      localStorage.setItem("redirectAfterLogin", "/customization");
      setShowLoginModal(true);
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
  await submitInquiry({
    ...form,
    service: "68b17c4dab6122093072c7a5",
    serviceTitle: "Premium Car Customization",
    category: "Car",
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
    <div style={{ padding: "60px 20px", background: "#0d0d0d", color: "#fff", minHeight: "100vh", animation: "fadeIn 1s ease forwards" }}>
      <Helmet>
        <title>Premium Car Customization | Benzamods</title>
        <meta name="description" content="Explore premium car customization services at Benzamods. Submit inquiries and upgrade your car with top-notch features." />
        <meta name="keywords" content="Benzamods, Car Customization, Vehicle Upgrades, Window Tinting, LED Headlights, Custom Paint, Seat Covers" />
        <meta name="author" content="Benzamods" />
      </Helmet>

      <h1 style={{ marginBottom: "30px", fontSize: "2.5rem", textAlign: "center" }}>Premium Car Customization</h1>

      <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "40px" }}>
        {/* Features Section */}
        <div style={{ background: "#1a1a1a", padding: "30px", borderRadius: "10px" }}>
          <h2 style={{ marginBottom: "20px", fontSize: "1.8rem", borderBottom: "1px solid #444", paddingBottom: "10px" }}>Available Features</h2>
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

        {/* Inquiry Form */}
        <div style={{ background: "#1a1a1a", padding: "30px", borderRadius: "10px" }}>
          <h2 style={{ marginBottom: "20px", fontSize: "1.8rem", borderBottom: "1px solid #444", paddingBottom: "10px" }}>Customization Inquiry</h2>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", maxWidth: "600px" }}>
            <input type="text" placeholder="Your Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
            <input type="text" placeholder="Address" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} style={inputStyle} />
            <input type="text" placeholder="Vehicle Name" required value={form.vehicleName} onChange={(e) => setForm({ ...form, vehicleName: e.target.value })} style={inputStyle} />
            <input type="text" placeholder="Vehicle Model" required value={form.vehicleModel} onChange={(e) => setForm({ ...form, vehicleModel: e.target.value })} style={inputStyle} />
            <input type="tel" placeholder="Contact Number" required value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} style={inputStyle} />
            <textarea placeholder="Service Details" required rows="4" value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} style={{ ...inputStyle, minHeight: "100px" }} />

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
            <button onClick={() => navigate("/login")} style={{ ...buttonStyle, marginTop: "15px", background: "#f0c040", color: "#000" }}>Go to Login</button>
            <button onClick={() => setShowLoginModal(false)} style={{ ...buttonStyle, marginTop: "10px" }}>Cancel</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
    <Footer/>
    </>
  );
}

const inputStyle = { padding: "12px", borderRadius: "6px", border: "1px solid #444", background: "#333", color: "#fff", fontSize: "1rem" };
const buttonStyle = { padding: "12px", borderRadius: "6px", border: "none", background: "#f0c040", color: "#000", fontWeight: "bold", cursor: "pointer" };

export default Customization;

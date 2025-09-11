import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "../components/Header";  
import Footer from "../components/Footer";

const API_BASE = process.env.REACT_APP_API_BASE;

// API function to submit contact form 
async function submitContactForm(formData, token) {
  const res = await fetch(`${API_BASE}/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    throw new Error("Failed to submit form");
  }

  return res.json();
}

export default function Contact() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginPrompt(true);
      return;
    }

    setSubmitting(true);
    setResponseMessage("");

    try {
      await submitContactForm(form, token); 
      setResponseMessage("✅ Message sent successfully!");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setResponseMessage(" Failed to send message. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: "#0d0d0d", minHeight: "100vh", fontFamily: "'Poppins', sans-serif", color: "#fff" }}>
      <Helmet>
        <title>Contact Us | Benzamods</title>
        <meta
          name="description"
          content="Contact Benzamods for car customizations, tuning, upgrades, and expert automotive services in Bangalore."
        />
        <meta
          name="keywords"
          content="Benzamods, Car Customization, Tuning, Upgrade, Automotive Services, Bangalore"
        />
        <meta name="author" content="Benzamods" />
        <meta property="og:title" content="Contact Benzamods" />
        <meta
          property="og:description"
          content="Reach out to Benzamods for expert automotive services and custom car modifications."
        />
      </Helmet>

      <Header />

      <h1
        style={{
          textAlign: "center",
          fontSize: "42px",
          margin: "50px 0 30px",
          fontWeight: "bold",
          letterSpacing: "1px",
          color: "#ff6600",
          animation: "fadeInScale 1s ease forwards",
        }}
      >
        📩 Contact Us
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "70px",
          flexWrap: "wrap",
          paddingBottom: "50px",
        }}
      >
        <div
          style={{
            flex: "1",
            minWidth: "350px",
            maxWidth: "550px",
            background: "linear-gradient(145deg, #1c1c1c, #292929)",
            padding: "40px",
            borderRadius: "25px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.7)",
            animation: "fadeInUp 0.8s ease forwards",
            transition: "all 0.3s ease",
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <input
              type="text"
              placeholder="Your Name"
              required
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              required
              className="input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="tel"
              placeholder="Phone"
              required
              className="input"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <textarea
              placeholder="Your Message"
              required
              className="input"
              rows="6"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />

            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: "15px",
                borderRadius: "15px",
                border: "none",
                background: submitting ? "#999" : "#ff6600",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "18px",
                cursor: submitting ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {submitting ? "Submitting..." : "Send Message"}
            </button>

            {responseMessage && (
              <div style={{ marginTop: "10px", color: "#fff", fontWeight: "600", textAlign: "center" }}>
                {responseMessage}
              </div>
            )}
          </form>
        </div>

        <div
          style={{
            flex: "1",
            minWidth: "300px",
            maxWidth: "450px",
            background: "linear-gradient(145deg, #1c1c1c, #292929)",
            padding: "40px",
            borderRadius: "25px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.7)",
            animation: "fadeInUp 0.9s ease forwards",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            justifyContent: "center",
          }}
        >
          <h2 style={{ fontSize: "26px", fontWeight: "bold", color: "#ff6600", textAlign: "center" }}>📍 Our Location</h2>
          <p style={{ textAlign: "center", color: "#ccc", fontSize: "18px", lineHeight: 1.3 }}>Jaynagar 4th Block, Bangalore</p>
          <button
            onClick={() => navigate("/map")}
            style={{
              padding: "12px 25px",
              borderRadius: "15px",
              border: "none",
              background: "#ff6600",
              color: "#fff",
              fontWeight: "600",
              fontSize: "16px",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            🗺️ Map
          </button>
          <h2 style={{ fontSize: "26px", fontWeight: "bold", color: "#ff6600", textAlign: "center" }}>⏰ Shop Timings</h2>
          <p style={{ textAlign: "center", color: "#ccc", fontSize: "18px", lineHeight: 1.6 }}>10:00 AM to 9:00 PM</p>
          <button
            onClick={() => window.open("https://wa.me/919876543210?text=Hello%20Benzamods!", "_blank")}
            style={{
              padding: "12px 25px",
              borderRadius: "15px",
              border: "none",
              background: "#25D366",
              color: "#fff",
              fontWeight: "600",
              fontSize: "16px",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            💬 Chat on WhatsApp
          </button>
        </div>
      </div>

      {showLoginPrompt && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10000,
          }}
        >
          <div
            style={{
              background: "#1c1c1c",
              padding: "30px",
              borderRadius: "16px",
              textAlign: "center",
              maxWidth: "400px",
              width: "100%",
              boxShadow: "0 0 20px rgba(0,0,0,0.6)",
            }}
          >
            <h3 style={{ color: "#fff", marginBottom: "15px" }}>Please login to send a message</h3>
            <p style={{ color: "#aaa", marginBottom: "20px" }}>You need to be logged in to send a message.</p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                onClick={() => {
                  localStorage.setItem("redirectAfterLogin", "/contact");
                  navigate("/login", { state: { from: "/contact" } });
                }}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#ff6600",
                  color: "#fff",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Login Now
              </button>
              <button
                onClick={() => setShowLoginPrompt(false)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "1px solid #444",
                  background: "transparent",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .input {
          padding: 15px;
          border-radius: 15px;
          border: none;
          outline: none;
          background: #1f1f1f;
          color: #fff;
          font-size: 16px;
          transition: all 0.3s ease;
        }
        .input:focus {
          background: #2a2a2a;
          box-shadow: 0 0 0 2px #ff6600;
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(40px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeInScale {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <Footer />
    </div>
  );
}

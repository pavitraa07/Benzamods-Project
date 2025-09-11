import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_BASE = process.env.REACT_APP_API_BASE;

async function fetchServicesAPI() {
  const res = await fetch(`${API_BASE}/services`);
  if (!res.ok) throw new Error("Failed to fetch services");
  return await res.json();
}

async function submitInquiryAPI(formData, token) {
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

function ExploreServices() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
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
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
  const loadServices = async () => {
    try {
      const data = await fetchServicesAPI();
      setServices(data);
      setFilteredServices(data);
    } catch (err) {
      console.error("Error fetching services:", err);
    }
  };
  loadServices();
}, []);

  useEffect(() => {
  if (!searchTerm) {
    setFilteredServices(services);
  } else {
    const filtered = services.filter((s) =>
      s.name.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
    setFilteredServices(filtered);
  }
}, [searchTerm, services]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedService?._id) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginPrompt(true);
      return;
    }

   try {
    setSubmitting(true);
    setMessage("");

    await submitInquiryAPI(
      {
        ...form,
        service: selectedService._id,
        serviceTitle: selectedService.name,
        category: selectedService.category,
      },
      token
    );

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
    console.error("Inquiry error:", err);
  } finally {
    setSubmitting(false);
  }
};

  const containerStyle = {
    backgroundColor: "#000",
    color: "#fff",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "'Rajdhani', sans-serif",
    textAlign: "center",
    animation: "fadeIn 1s ease forwards",
  };

  const headingStyle = {
    fontSize: "48px",
    fontWeight: "700",
    marginBottom: "20px",
    letterSpacing: "4px",
    textTransform: "uppercase",
    animation: "fadeInDown 1.5s ease",
    display: "inline-block",
  };
const searchStyle = {
  marginLeft: "20px",
  padding: "12px 18px",
  fontSize: "16px",
  borderRadius: "12px",
  border: "1px solid #ff6600",
  background: "#1f1f1f",
  color: "#fff",
  outline: "none",
  width: "260px",
  transition: "all 0.3s ease",
};

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
    maxWidth: "1200px",
    margin: "40px auto 0",
  };

  const cardStyle = {
    backgroundColor: "#111",
    border: "2px solid #fff",
    borderRadius: "15px",
    padding: "20px",
    textAlign: "left",
    transition: "all 0.4s ease",
    overflow: "hidden",
    cursor: "pointer",
  };

  const imageStyle = {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "15px",
  };

  return (
    <>
      <Header /> {/* ✅ Header at top */}
      <div style={containerStyle}>
        <Helmet>
          <title>Explore All Services | Benzamods</title>
          <meta
            name="description"
            content="Explore all premium car services offered by Benzamods, including customizations, tuning, upgrades, and more. Submit inquiries directly from our platform."
          />
          <meta
            name="keywords"
            content="Benzamods, Car Services, Vehicle Customization, Performance Tuning, Upgrades, Car Care"
          />
          <meta name="author" content="Benzamods" />
        </Helmet>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <h2 style={headingStyle}>Explore All Services</h2>
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchStyle}
            onFocus={(e) => e.currentTarget.style.boxShadow = "0 0 8px #ff6600"}
            onBlur={(e) => e.currentTarget.style.boxShadow = "none"}
          />

        </div>

        <div style={gridStyle}>
          {filteredServices.map((service) => (
            <div
              key={service._id}
              style={cardStyle}
              onClick={() => setSelectedService(service)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#fff";
                e.currentTarget.style.color = "#000";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#111";
                e.currentTarget.style.color = "#fff";
              }}
            >
              {service.image && (
                <img
                  src={service.image}
                  alt={service.name}
                  style={imageStyle}
                  loading="lazy"
                />
              )}
              <h3 style={{ fontSize: "26px", fontWeight: "700" }}>{service.name}</h3>
              <p style={{ fontSize: "16px", color: "#bbb" }}>{service.description}</p>
              <p style={{ fontSize: "20px", fontWeight: "700" }}>₹{service.price}</p>
            </div>
          ))}
        </div>

        {/* Service Modal */}
        {selectedService && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.9)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
              padding: "20px",
              animation: "fadeIn 0.7s ease forwards",
            }}
          >
            <div
              style={{
                background: "#1c1c1c",
                borderRadius: "20px",
                display: "flex",
                flexDirection: "row",
                maxWidth: "1100px",
                width: "95%",
                overflow: "hidden",
                animation: "slideDown 0.7s ease forwards",
              }}
            >
              {/* Left: Image + details */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <img
                  src={selectedService.image}
                  alt={selectedService.name}
                  style={{
                    width: "100%",
                    height: "300px",
                    objectFit: "cover",
                    borderBottom: "2px solid #333",
                  }}
                  loading="lazy"
                />
                <div style={{ padding: "20px" }}>
                  <h2 style={{ fontSize: "26px", marginBottom: "10px", color: "#fff" }}>
                    {selectedService.name}
                  </h2>
                  <p style={{ color: "#ccc", marginBottom: "15px", lineHeight: 1.5 }}>
                    {selectedService.description}
                  </p>
                  <p style={{ fontSize: "20px", fontWeight: "bold", color: "#ff6600" }}>
                    ₹{selectedService.price}
                  </p>
                </div>
              </div>

              {/* Right: Form */}
              <div
                className="form-section"
                style={{
                  flex: 1,
                  padding: "30px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <h2 style={{ fontSize: "24px", marginBottom: "15px", color: "#fff" }}>
                  Inquiry Form
                </h2>

                <form
                  onSubmit={handleSubmit}
                  style={{ display: "flex", flexDirection: "column", gap: "12px" }}
                >
                  <input
                    type="text"
                    placeholder="Your Name"
                    required
                    className="input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    required
                    className="input"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Vehicle Name"
                    required
                    className="input"
                    value={form.vehicleName}
                    onChange={(e) => setForm({ ...form, vehicleName: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Vehicle Model"
                    required
                    className="input"
                    value={form.vehicleModel}
                    onChange={(e) => setForm({ ...form, vehicleModel: e.target.value })}
                  />
                  <input
                    type="tel"
                    placeholder="Contact Number"
                    required
                    className="input"
                    value={form.contact}
                    onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  />
                  <textarea
                    placeholder="Service Details"
                    required
                    className="input"
                    rows="4"
                    value={form.details}
                    onChange={(e) => setForm({ ...form, details: e.target.value })}
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      padding: "12px",
                      borderRadius: "12px",
                      border: "none",
                      background: submitting ? "#999" : "#ff6600",
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: "16px",
                      cursor: submitting ? "not-allowed" : "pointer",
                    }}
                  >
                    {submitting ? "Submitting..." : "Submit Inquiry"}
                  </button>
                  {message && <div style={{ color: "#fff" }}>{message}</div>}
                </form>

                <button
                  onClick={() => setSelectedService(null)}
                  style={{
                    marginTop: "20px",
                    padding: "8px 16px",
                    background: "#333",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Login Prompt Modal */}
        {showLoginPrompt && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.8)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1100,
              animation: "fadeIn 0.5s ease forwards",
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
              }}
            >
              <h3 style={{ color: "#fff", marginBottom: "15px" }}>
                Please login to continue
              </h3>
              <p style={{ color: "#aaa", marginBottom: "20px" }}>
                You need to be logged in to submit this inquiry.
              </p>
              <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                <button
                  onClick={() => {
                    const redirectPath = "/explore-services";
                    localStorage.setItem("redirectAfterLogin", redirectPath);
                    navigate("/login", { state: { from: redirectPath } });
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

        {/* Animations */}
        <style>{`
          @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-40px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-50px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .input {
            padding: 12px;
            border-radius: 12px;
            border: none;
            outline: none;
            background: #1f1f1f;
            color: #fff;
            font-size: 15px;
          }
          .input:focus {
            background: #2a2a2a;
            box-shadow: 0 0 0 2px #ff6600;
          }
          .form-section {
            animation: slideDown 0.7s ease forwards;
          }
        `}</style>
      </div>
      <Footer /> {/* ✅ Footer at bottom */}
    </>
  );
}

export default ExploreServices;

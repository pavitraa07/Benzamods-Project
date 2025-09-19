import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const API_BASE = process.env.REACT_APP_API_BASE;

const fetchServiceById = async (serviceId) => {
  try {
    const res = await fetch(`${API_BASE}/priority-services/${serviceId}`);
    if (!res.ok) throw new Error("Failed to fetch service");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching service:", err);
    return null;
  }
};

const submitInquiry = async (formData, token) => {
  try {
    const res = await fetch(`${API_BASE}/inquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });
    if (!res.ok) throw new Error("Failed to submit inquiry");
    return await res.json();
  } catch (err) {
    console.error("Error submitting inquiry:", err);
    throw err;
  }
};

function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
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

  useEffect(() => {
    const getService = async () => {
      const data = await fetchServiceById(id);
      if (data) setService(data);
    };
    getService();
  }, [id]);

  useEffect(() => {
    if (!service?.gallery?.length) return;
    let loadedCount = 0;
    const totalImages = service.gallery.length;
    service.gallery.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount += 1;
        if (loadedCount === totalImages) setImagesLoaded(true);
      };
      img.onerror = () => {
        loadedCount += 1;
        if (loadedCount === totalImages) setImagesLoaded(true);
      };
    });
  }, [service]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!service?._id) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginPrompt(true);
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");

      await submitInquiry(
        {
          ...form,
          service: service._id,
          serviceTitle: service.serviceTitle,
          category: service.category,
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
      setMessage("❌ Failed to submit. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!service || !imagesLoaded) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#0d0d0d",
        }}
      >
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "20px",
        flexWrap: "wrap",
        background: "#0d0d0d",
        color: "#fff",
        padding: "40px",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* Gallery */}
      <div
        style={{
          flex: "1 1 400px",
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gridTemplateRows: "repeat(3, 220px)",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        {service.gallery?.slice(0, 6).map((img, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            style={{
              overflow: "hidden",
              borderRadius: "16px",
              gridColumn: idx === 0 ? "span 2" : "span 1",
              gridRow: idx === 0 ? "span 2" : "span 1",
            }}
          >
            <img
              src={img}
              alt={`Gallery ${idx}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.4s ease",
              }}
              loading="lazy"
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.08)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            />
          </motion.div>
        ))}
      </div>

      {/* Description + Form */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{
          flex: "1 1 300px",
          background: "linear-gradient(145deg, #1c1c1c, #292929)",
          borderRadius: "20px",
          padding: "30px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          boxShadow: "0 8px 25px rgba(0,0,0,0.6)",
          minHeight: "660px",
        }}
      >
        <h2
          style={{
            fontSize: "28px",
            marginBottom: "15px",
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          Inquiry for {service.serviceTitle}
        </h2>

        {service.description && (
          <p style={{ color: "#ccc", marginBottom: "20px", lineHeight: 1.6 }}>
            {service.description}
          </p>
        )}

        <form
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          onSubmit={handleSubmit}
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
            onChange={(e) =>
              setForm({ ...form, vehicleModel: e.target.value })
            }
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
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) =>
              !submitting && (e.currentTarget.style.background = "#ff8533")
            }
            onMouseLeave={(e) =>
              !submitting && (e.currentTarget.style.background = "#ff6600")
            }
          >
            {submitting ? "Submitting..." : "Submit Inquiry"}
          </button>

          {message && (
            <div style={{ color: "#fff", opacity: 0.85 }}>{message}</div>
          )}
        </form>
      </motion.div>

      {/* Login Prompt */}
      {showLoginPrompt && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
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
            <h3 style={{ color: "#fff", marginBottom: "15px" }}>
              Please login to continue
            </h3>
            <p style={{ color: "#aaa", marginBottom: "20px" }}>
              You need to be logged in to submit this inquiry.
            </p>
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <button
                onClick={() => {
                  const redirectPath = `/priority-services/${id}`;
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

      <style>
        {`
          .input {
            padding: 12px;
            border-radius: 12px;
            border: none;
            outline: none;
            background: #1f1f1f;
            color: #fff;
            font-size: 15px;
            transition: all 0.3s ease;
          }
          .input:focus {
            background: #2a2a2a;
            box-shadow: 0 0 0 2px #ff6600;
          }
        `}
      </style>
    </div>
  );
}

export default ServiceDetails;

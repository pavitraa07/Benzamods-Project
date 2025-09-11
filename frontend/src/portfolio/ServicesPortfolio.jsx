import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const API_BASE = process.env.REACT_APP_API_BASE; 

const getServices = async () => {
  try {
    const res = await fetch(`${API_BASE}/portfolio/services`);
    if (!res.ok) throw new Error("Failed to fetch services");
    return await res.json();
  } catch (err) {
    console.error("Error fetching services:", err);
    return [];
  }
};

const ServicesPortfolio = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchServicesData = async () => {
    const data = await getServices();
    setServices(data);
  };
  fetchServicesData();
}, []);

  return (
    <section
      style={{
        backgroundColor: "#000",
        color: "#fff",
        padding: "40px 20px",
        fontFamily: "'Rajdhani', sans-serif",
      }}
    >
      <h2
        style={{
          fontSize: "42px",
          fontWeight: "800",
          textAlign: "center",
          marginBottom: "30px",
          letterSpacing: "1.5px",
        }}
      >
        Offered Services
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "25px",
        }}
      >
        {services.map((service, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            style={{
              background: "#111",
              border: "2px solid #fff",
              borderRadius: "15px",
              overflow: "hidden",
              cursor: "pointer",
            }}
            onClick={() => navigate(`/servicesportfoliodetails/${service._id}`)}

          >
            {service.image && (
              <img
                src={service.image}
                alt={service.name}
                style={{
                  width: "100%",
                  height: "220px",
                  objectFit: "cover",
                  borderBottom: "2px solid #fff",
                }}
              />
            )}
            <div style={{ padding: "15px" }}>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  marginBottom: "8px",
                }}
              >
                {service.name}
              </h3>
              <p style={{ fontSize: "16px", color: "#ccc" }}>
                {service.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ServicesPortfolio;

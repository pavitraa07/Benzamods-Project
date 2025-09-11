import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const API_BASE = process.env.REACT_APP_API_BASE;

function CarServices() {
  const [carServices, setCarServices] = useState([]);
  const navigate = useNavigate();

const fetchAllServices = useCallback(async () => {
  try {
    const res = await fetch(`${API_BASE}/priority-services`);
    if (!res.ok) throw new Error("Failed to fetch services");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching services:", err);
    return [];
  }
}, []);

const fetchCarServices = useCallback(async () => {
  const allServices = await fetchAllServices();
  const cars = allServices.filter((s) => s.category?.toLowerCase() === "car");
  setCarServices(cars);
}, [fetchAllServices]);


  useEffect(() => {
    fetchCarServices();
  }, [fetchCarServices]);

  const handleCardClick = (id) => {
    navigate(`/priority-services/${id}`);
  };

  return (
    <>
    <Header/>
    <div style={{ background: "#0d0d0d", minHeight: "100vh", padding: "40px" }}>
      <Helmet>
        <title>Premium Car Services | Expert Auto Care & Upgrades</title>
        <meta
          name="description"
          content="Discover premium car services including repairs, maintenance, detailing, and performance upgrades. Expert auto care and priority services for your vehicle."
        />
        <meta
          name="keywords"
          content="car services, auto repair, car upgrades, car maintenance, premium car services, auto detailing, performance tuning, luxury car care, vehicle servicing"
        />
        <meta name="author" content="Your Company Name" />
        <meta property="og:title" content="Premium Car Services" />
        <meta
          property="og:description"
          content="Expert car services including repairs, maintenance, detailing, and performance upgrades for all types of vehicles."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animated-card {
            animation: fadeInUp 0.6s ease forwards;
            opacity: 0;
          }
        `}
      </style>

      <h1
        style={{
          fontSize: "36px",
          textAlign: "center",
          marginBottom: "40px",
          color: "#fff",
          fontWeight: "bold",
          letterSpacing: "1px",
        }}
      >
        🚗 Premium Car Services
      </h1>

      {carServices.length === 0 ? (
        <p
          style={{
            color: "#aaa",
            textAlign: "center",
            fontSize: "18px",
            marginTop: "50px",
          }}
        >
          No car priority services available at the moment.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
            gap: "30px",
            justifyContent: "center",
          }}
        >
          {carServices.map((service, index) => (
            <div
              key={service._id}
              className="animated-card"
              style={{
                background: "linear-gradient(145deg, #1c1c1c, #292929)",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 8px 25px rgba(0,0,0,0.6)",
                transition: "all 0.3s ease",
                cursor: "pointer",
                animationDelay: `${index * 100}ms`,
              }}
              onClick={() => handleCardClick(service._id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-10px)";
                e.currentTarget.style.boxShadow =
                  "0 15px 35px rgba(0,0,0,0.8)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 8px 25px rgba(0,0,0,0.6)";
              }}
            >
              {service.image && (
                <img
                  src={service.image}
                  alt={service.serviceTitle}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "220px",
                    objectFit: "cover",
                  }}
                />
              )}

              <div style={{ padding: "20px", color: "#fff" }}>
                <h2
                  style={{
                    fontSize: "22px",
                    marginBottom: "12px",
                    fontWeight: "600",
                  }}
                >
                  {service.serviceTitle}
                </h2>
                <p
                  style={{
                    fontSize: "15px",
                    color: "#ccc",
                    lineHeight: "1.6",
                    marginBottom: "15px",
                  }}
                >
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    <Footer />
  </>
  );
}

export default CarServices;

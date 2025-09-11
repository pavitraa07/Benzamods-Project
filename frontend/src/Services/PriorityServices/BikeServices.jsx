import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import ClipLoader from "react-spinners/ClipLoader"; // ✅ Spinner
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const API_BASE = process.env.REACT_APP_API_BASE;

function BikeServices() {
  const [bikeServices, setBikeServices] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Loading state
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

const fetchBikeServices = useCallback(async () => {
  setLoading(true);
  const allServices = await fetchAllServices();
  const bikes = allServices.filter(
    (s) => s.category?.toLowerCase() === "bike"
  );
  setBikeServices(bikes);
  setLoading(false);
}, [fetchAllServices]);

useEffect(() => {
  fetchBikeServices();
}, [fetchBikeServices]);

  const handleCardClick = (id) => {
    navigate(`/priority-services/${id}`);
  };

  return (
    <>
    <Header/>
    <div
      style={{
        background: "#0d0d0d",
        minHeight: "100vh",
        padding: "40px",
      }}
    >
      <Helmet>
        <title>Premium Bike Services | Expert Motorcycle Care & Upgrades</title>
        <meta
          name="description"
          content="Discover premium bike services including repairs, maintenance, and upgrades. Get expert motorcycle care, performance tuning, and priority services for your ride."
        />
        <meta
          name="keywords"
          content="bike services, motorcycle repair, motorcycle upgrades, bike maintenance, premium bike services, motorcycle tuning, two-wheeler service, superbike care, bike performance upgrades"
        />
        <meta name="author" content="Your Company Name" />
        <meta property="og:title" content="Premium Bike Services" />
        <meta
          property="og:description"
          content="Expert motorcycle services, repairs, maintenance, and performance upgrades for all types of bikes."
        />
        <meta property="og:type" content="website" />
      </Helmet>

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
        🏍️ Premium Bike Services
      </h1>

      {/* ✅ Loading Spinner */}
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <ClipLoader color="#facc15" size={80} speedMultiplier={1.3} />
        </div>
      ) : bikeServices.length === 0 ? (
        <p
          style={{
            color: "#aaa",
            textAlign: "center",
            fontSize: "18px",
            marginTop: "50px",
          }}
        >
          No bike priority services available at the moment.
        </p>
      ) : (
        <div className="bike-services-grid">
          {bikeServices.map((service, index) => (
            <div
              key={service._id}
              className="bike-service-card"
              style={{
                background: "linear-gradient(145deg, #1c1c1c, #292929)",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 8px 25px rgba(0,0,0,0.6)",
                cursor: "pointer",
                animationDelay: `${index * 0.1}s`,
              }}
              onClick={() => handleCardClick(service._id)}
            >
              {service.image && (
                <img
                  src={service.image}
                  alt={service.serviceTitle}
                  loading="lazy" // ✅ Lazy loading
                  style={{ width: "100%", height: "220px", objectFit: "cover" }}
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

      <style>
        {`
          .bike-services-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 30px;
          }
          @media (max-width: 1024px) {
            .bike-services-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          @media (max-width: 768px) {
            .bike-services-grid {
              grid-template-columns: 1fr;
            }
          }
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(40px) scale(0.95); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          .bike-service-card {
            animation: fadeInUp 0.7s ease forwards;
          }
          .bike-service-card:hover {
            transform: translateY(-12px) scale(1.02);
            box-shadow: 0 18px 40px rgba(0, 0, 0, 0.85);
            transition: all 0.3s ease;
          }
          .bike-service-card img {
            transition: transform 0.5s ease;
          }
          .bike-service-card:hover img {
            transform: scale(1.05);
          }
        `}
      </style>
    </div>
    <Footer/>
    </>
  );
}

export default BikeServices;

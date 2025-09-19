import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import fs1 from "../assets/fs1.jpg";
import fs2 from "../assets/fs2.jpg";
import fs3 from "../assets/fs3.jpg";

function FeaturedServices() {
  const navigate = useNavigate();

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const containerStyle = {
    backgroundColor: "#000",
    color: "#fff",
    padding: "100px 20px",
    textAlign: "center",
    fontFamily: "'Rajdhani', sans-serif",
  };

  const headingStyle = {
    fontSize: "48px",
    fontWeight: "700",
    marginBottom: "70px",
    letterSpacing: "5px",
    textTransform: "uppercase",
    animation: "fadeInDown 1.5s ease",
  };

  const servicesWrapper = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "40px",
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const cardStyle = {
    backgroundColor: "#111",
    border: "2px solid #fff",
    borderRadius: "20px",
    padding: "20px",
    transition: "all 0.4s ease",
    cursor: "pointer",
    color: "#fff",
    textAlign: "center",
  };

  const cardHoverStyle = {
    backgroundColor: "#fff",
    color: "#000",
    transform: "scale(1.08)",
  };

  const cardImage = {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "15px",
    marginBottom: "20px",
  };

  const cardTitle = {
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "15px",
    letterSpacing: "2px",
  };

  const cardDesc = {
    fontSize: "16px",
    lineHeight: "1.5",
  };

  const buttonStyle = {
    marginTop: "60px",
    padding: "15px 40px",
    fontSize: "20px",
    fontWeight: "700",
    border: "2px solid #fff",
    borderRadius: "10px",
    backgroundColor: "transparent",
    color: "#fff",
    cursor: "pointer",
    letterSpacing: "2px",
    transition: "all 0.3s ease",
  };

  const buttonHoverStyle = {
    backgroundColor: "#fff",
    color: "#000",
    transform: "scale(1.05)",
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Additional Services</h2>
      <div style={servicesWrapper}>
        <div
          style={cardStyle}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHoverStyle)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle)}
          onClick={() => navigate("/customization")}
        >
          <img src={fs1} alt="Car Customization" style={cardImage} />
          <h3 style={cardTitle}>Car Customization</h3>
          <p style={cardDesc}>
            Premium body kits, wraps, and lighting solutions to give your car a
            bold and unique look.
          </p>
        </div>
        <div
          style={cardStyle}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHoverStyle)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle)}
          onClick={() => navigate("/upgrade")}
        >
          <img src={fs2} alt="Bike Upgrades" style={cardImage} />
          <h3 style={cardTitle}>Bike Upgrades</h3>
          <p style={cardDesc}>
            From exhaust systems to alloy wheels — upgrade your bike with style
            and performance.
          </p>
        </div>
        <div
          style={cardStyle}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHoverStyle)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle)}
          onClick={() => navigate("/tuning")}
        >
          <img src={fs3} alt="Performance Tuning" style={cardImage} />
          <h3 style={cardTitle}>Performance Tuning</h3>
          <p style={cardDesc}>
            ECU remapping and engine tuning services for maximum power and
            efficiency.
          </p>
        </div>
      </div>

      <button
        style={buttonStyle}
        onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
        onMouseLeave={(e) => Object.assign(e.currentTarget.style, buttonStyle)}
        onClick={() => navigate("/explore-services")}
      >
        Explore More Services
      </button>

      <style>
        {`
          @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-40px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}

export default FeaturedServices;

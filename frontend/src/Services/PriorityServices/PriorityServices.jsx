import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

function PriorityServices() {
  const navigate = useNavigate();

  const containerStyle = {
    backgroundColor: "#000",
    color: "#fff",
    minHeight: "100vh",
    padding: "80px 20px",
    fontFamily: "'Rajdhani', sans-serif",
    textAlign: "center",
    overflow: "hidden",
  };

  const headingStyle = {
    fontSize: "48px",
    fontWeight: "700",
    marginBottom: "60px",
    letterSpacing: "4px",
    textTransform: "uppercase",
    animation: "fadeInDown 1.5s ease",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "40px",
    maxWidth: "1000px",
    margin: "0 auto",
  };

  const cardStyle = {
    position: "relative",
    borderRadius: "20px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "transform 0.5s ease, box-shadow 0.5s ease",
    opacity: 0,
    animation: "fadeInUp 1s ease forwards",
  };

  const imageStyle = {
    width: "100%",
    height: "400px",
    objectFit: "cover",
    transition: "transform 0.6s ease",
  };

  const titleOverlay = {
    position: "absolute",
    bottom: "0",
    width: "100%",
    background: "rgba(0, 0, 0, 0.6)",
    color: "#fff",
    padding: "20px",
    fontSize: "26px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "3px",
    backdropFilter: "blur(5px)",
  };

  return (
    <>
      <Header /> {/* ✅ Always stays at the very top */}

      <div style={containerStyle}>
        <Helmet>
          <title>Priority Services | Car & Bike Premium Care</title>
          <meta
            name="description"
            content="Explore premium priority services for cars and bikes. Professional maintenance, upgrades, detailing, and performance care for your vehicles."
          />
          <meta
            name="keywords"
            content="priority services, car services, bike services, vehicle upgrades, car maintenance, bike maintenance, performance care, auto detailing"
          />
          <meta name="author" content="Your Company Name" />
          <meta property="og:title" content="Priority Services" />
          <meta
            property="og:description"
            content="High-quality priority services for cars and bikes, including expert upgrades and maintenance."
          />
          <meta property="og:type" content="website" />
        </Helmet>

        <h2 style={headingStyle}>Priority Services</h2>

        <div style={gridStyle}>
          {/* Car Services Card */}
          <div
            style={{ ...cardStyle, animationDelay: "0.2s" }}
            onClick={() => navigate("/services/priority-services/car")}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.08)";
              e.currentTarget.style.boxShadow =
                "0 20px 50px rgba(255, 255, 255, 0.2)";
              e.currentTarget.querySelector("img").style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.6)";
              e.currentTarget.querySelector("img").style.transform = "scale(1)";
            }}
          >
            <img
              src="https://i.pinimg.com/1200x/7e/b7/5a/7eb75a99cead76ef9f2c3587305def71.jpg"
              alt="Car Services"
              style={imageStyle}
            />
            <div style={titleOverlay}>Car Services</div>
          </div>

          {/* Bike Services Card */}
          <div
            style={{ ...cardStyle, animationDelay: "0.4s" }}
            onClick={() => navigate("/services/priority-services/bike")}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.08)";
              e.currentTarget.style.boxShadow =
                "0 20px 50px rgba(255, 255, 255, 0.2)";
              e.currentTarget.querySelector("img").style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.6)";
              e.currentTarget.querySelector("img").style.transform = "scale(1)";
            }}
          >
            <img
              src="https://i.pinimg.com/1200x/1c/29/6a/1c296aa6b695bf34df2123adf4ecf46b.jpg"
              alt="Bike Services"
              style={imageStyle}
            />
            <div style={titleOverlay}>Bike Services</div>
          </div>
        </div>
      </div>

      <Footer /> {/* ✅ Always stays at the very bottom */}

      <style>
        {`
          @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-40px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </>
  );
}

export default PriorityServices;

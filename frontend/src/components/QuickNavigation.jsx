import { useEffect } from "react";
import { Link } from "react-router-dom";

function QuickNavigation() {
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
    animation: "fadeIn 2s ease",
  };

  const headingStyle = {
    fontSize: "42px",
    fontWeight: "700",
    marginBottom: "50px",
    letterSpacing: "4px",
    textTransform: "uppercase",
    animation: "slideDown 1.5s ease",
  };

  const buttonWrapper = {
    display: "flex",
    justifyContent: "center",
    gap: "50px",
    flexWrap: "wrap",
  };

  const cardStyle = {
    width: "300px",
    height: "200px",
    borderRadius: "20px",
    overflow: "hidden",
    position: "relative",
    textDecoration: "none",
    color: "#fff",
    boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
    transition: "transform 0.4s ease, box-shadow 0.4s ease",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const overlayStyle = {
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    background: "rgba(0,0,0,0.5)",
    transition: "background 0.4s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const textStyle = {
    fontSize: "26px",
    fontWeight: "700",
    letterSpacing: "2px",
    textTransform: "uppercase",
    zIndex: 2,
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Browse Products</h2>
      <div style={buttonWrapper}>
        {/* Shop by Car */}
        <Link
          to="/shopbycar"
          style={{
            ...cardStyle,
            backgroundImage:
              "url('https://i.pinimg.com/736x/68/23/a8/6823a85460551a26773e5e51a20fd10e.jpg')",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.08)";
            e.currentTarget.style.boxShadow = "0 12px 30px rgba(255,255,255,0.6)";
            e.currentTarget.querySelector(".overlay").style.background =
              "rgba(0,0,0,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.5)";
            e.currentTarget.querySelector(".overlay").style.background =
              "rgba(0,0,0,0.5)";
          }}
        >
          <div className="overlay" style={overlayStyle}>
            <span style={textStyle}>Car Products</span>
          </div>
        </Link>

        {/* Shop by Bike */}
        <Link
          to="/shopbybike"
          style={{
            ...cardStyle,
            backgroundImage:
              "url('https://i.pinimg.com/1200x/4f/80/81/4f8081fb3501cf40add77099bab555b8.jpg')", 
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.08)";
            e.currentTarget.style.boxShadow = "0 12px 30px rgba(255,255,255,0.6)";
            e.currentTarget.querySelector(".overlay").style.background =
              "rgba(0,0,0,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.5)";
            e.currentTarget.querySelector(".overlay").style.background =
              "rgba(0,0,0,0.5)";
          }}
        >
          <div className="overlay" style={overlayStyle}>
            <span style={textStyle}>Bike Products</span>
          </div>
        </Link>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-30px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}

export default QuickNavigation;

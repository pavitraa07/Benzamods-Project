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
    backgroundColor: "#282626ff",
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

  const buttonStyle = {
    padding: "25px 80px",
    fontSize: "22px",
    fontWeight: "600",
    color: "#fff",
    backgroundColor: "#111",
    border: "3px solid #fff",
    borderRadius: "60px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    letterSpacing: "3px",
    textTransform: "uppercase",
    textDecoration: "none", 
    display: "inline-block",
  };

  const hoverStyle = {
    backgroundColor: "#fff",
    color: "#000",
    transform: "scale(1.05)",
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Quick Navigation</h2>
      <div style={buttonWrapper}>
        <Link
          to="/shopbycar"
          style={buttonStyle}
          onMouseEnter={(e) => Object.assign(e.target.style, hoverStyle)}
          onMouseLeave={(e) => Object.assign(e.target.style, buttonStyle)}
        >
          Shop by Car
        </Link>
        <Link
          to="/shopbybike"
          style={buttonStyle}
          onMouseEnter={(e) => Object.assign(e.target.style, hoverStyle)}
          onMouseLeave={(e) => Object.assign(e.target.style, buttonStyle)}
        >
          Shop by Bike
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

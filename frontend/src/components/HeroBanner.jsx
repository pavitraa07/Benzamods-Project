import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import { FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { jwtDecode } from "jwt-decode";

import bm8 from "../assets/bm8.jpg";
import bm10 from "../assets/bm10.jpg";
import bm11 from "../assets/bm11.jpg";
import bm12 from "../assets/bm12.jpg";
import bmlogo from "../assets/bmlogo1.jpg";

function HeroBanner() {
  const images = [bm8, bm11, bm10, bm12];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [userName, setUserName] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [prevSidebarOpen, setPrevSidebarOpen] = useState(false);

  useEffect(() => {
    setIsFirstRender(false);
  }, []);

  // Auto slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Cart updates
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(storedCart.length);

    const onCartUpdated = (e) => {
      if (e && e.detail && typeof e.detail.count === "number") {
        setCartCount(e.detail.count);
      } else {
        const c = JSON.parse(localStorage.getItem("cart")) || [];
        setCartCount(c.length);
      }
    };

    const onStorage = (ev) => {
      if (ev.key === "cart") {
        const c = JSON.parse(localStorage.getItem("cart")) || [];
        setCartCount(c.length);
      }
    };

    window.addEventListener("cartUpdated", onCartUpdated);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("cartUpdated", onCartUpdated);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // Fonts + login
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      try {
        const decoded = jwtDecode(token);
        if (decoded?.name) {
          setUserName(decoded.name);
        } else if (decoded?.username) {
          setUserName(decoded.username);
        } else if (decoded?.email) {
          setUserName(decoded.email.split("@")[0]);
        }
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }

    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y =
        element.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setShowLogoutConfirm(false);
    setUserName("");
    navigate("/");
  };

  const toggleSidebar = () => {
    setPrevSidebarOpen(sidebarOpen);
    setSidebarOpen(!sidebarOpen);
  };

  // Sidebar
  const sidebarStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "250px",
    height: "100%",
    backgroundColor: "#111",
    color: "#fff",
    padding: "20px",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
    transition: "transform 0.5s cubic-bezier(0.77, 0, 0.175, 1)",
    animation: isFirstRender
      ? "none"
      : sidebarOpen
      ? "slideInLeft 0.5s forwards"
      : prevSidebarOpen
      ? "slideOutRight 0.8s forwards"
      : "none",
  };

  const sidebarBtnStyle = {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #000",
    cursor: "pointer",
    background: "#fff",
    color: "#000",
    fontWeight: "700",
    textAlign: "center",
    fontFamily: "'Orbitron', sans-serif",
    letterSpacing: "2px",
    textTransform: "uppercase",
  };

  // Banner
  const bannerStyle = {
    height: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#000",
    color: "#fff",
    overflow: "hidden",
    position: "relative",
    fontFamily: "'Orbitron', sans-serif",
  };

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 20px",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 3,
    animation: "fadeInDown 1s ease",
    flexWrap: "wrap",
  };

  const logoStyle = { height: "50px", marginRight: "15px" };

  const titleStyle = {
    fontSize: "clamp(18px, 2vw, 28px)",
    fontWeight: "700",
    letterSpacing: "3px",
    color: "#fff",
    textShadow: "0 0 15px rgba(255,255,255,0.7)",
  };

  const userNameStyle = {
    fontSize: "14px",
    fontWeight: "500",
    color: "#fff",
    textShadow: "0 0 8px rgba(255,255,255,0.7)",
    letterSpacing: "1px",
  };

  const navContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    justifyContent: "center",
    marginTop: "10px",
  };

  const navButtonStyle = {
    background: "transparent",
    color: "#fff",
    border: "none",
    fontSize: "14px",
    cursor: "pointer",
    letterSpacing: "1px",
    transition: "all 0.3s ease",
    fontFamily: "'Orbitron', sans-serif",
    textTransform: "uppercase",
    position: "relative",
  };

  const sliderWrapper = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    transition: "transform 1s ease-in-out",
    transform: `translateX(-${currentIndex * 100}%)`,
    zIndex: 0,
  };

  const slideStyle = {
    minWidth: "100%",
    height: "100%",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1,
  };

  const textContainer = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    zIndex: 2,
    padding: "0 15px",
    width: "100%",
  };

  const headingStyle = {
    fontSize: "clamp(24px, 6vw, 56px)",
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: "2px",
    textShadow: "0 0 25px rgba(255,255,255,0.9)",
    marginBottom: "10px",
  };

  const subHeadingStyle = {
    fontSize: "clamp(14px, 3vw, 24px)",
    fontWeight: "500",
    color: "#ffffff",
    letterSpacing: "1px",
    textShadow: "0 0 10px rgba(255,255,255,0.8)",
    marginBottom: "20px",
  };

  const buttonStyle = {
    padding: "10px 20px",
    fontSize: "clamp(12px, 2vw, 18px)",
    fontWeight: "700",
    letterSpacing: "2px",
    backgroundColor: "#fcfcfcff",
    color: "#0c0202ff",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    textDecoration: "none",
    boxShadow: "0 0 20px rgba(8, 8, 8, 0.6)",
    transition: "all 0.3s ease",
  };

  const buttonHover = {
    backgroundColor: "#000000ff",
    color: "#fffefeff",
    boxShadow: "0 0 25px rgba(255,255,255,0.9)",
  };

  return (
    <div style={bannerStyle}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <button
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            background: "#000",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: "35px",
            height: "35px",
            fontSize: "20px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={toggleSidebar}
        >
          <FiX />
        </button>
        <div style={{ marginTop: "70px", display: "flex", flexDirection: "column", gap: "15px" }}>
          {/* Sidebar buttons (shortened for clarity) */}
          <button style={sidebarBtnStyle} onClick={() => handleScroll("shop")}>
            Shop
          </button>
          <button style={sidebarBtnStyle} onClick={() => handleScroll("services")}>
            Additional Services
          </button>
        </div>
      </div>

      {/* Header */}
      <div style={headerStyle}>
        <button
          onClick={toggleSidebar}
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            fontSize: "30px",
            cursor: "pointer",
          }}
        >
          <FiMenu />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src={bmlogo} alt="Benzamods Logo" style={logoStyle} />
          <h1 style={titleStyle}>Benzamods</h1>
          {isLoggedIn && userName && <p style={userNameStyle}>Hey! {userName}</p>}
        </div>
        {!isMobile && <div style={navContainerStyle}>
          <button style={navButtonStyle} onClick={() => handleScroll("shop")}>Shop</button>
          <button style={navButtonStyle} onClick={() => handleScroll("services")}>Services</button>
          <button style={navButtonStyle} onClick={() => handleScroll("reviews")}>Reviews</button>
        </div>}
      </div>

      {/* Slider */}
      <div style={sliderWrapper}>
        {images.map((img, index) => (
          <div key={index} style={{ ...slideStyle, backgroundImage: `url(${img})` }} />
        ))}
      </div>
      <div style={overlayStyle}></div>

      {/* Text */}
      <div style={textContainer}>
        <h2 style={headingStyle}>WELCOME TO BENZAMODS!</h2>
        <p style={subHeadingStyle}>Premium modifications for Cars and Bikes</p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "15px" }}>
          <Link
            to="services/priority-services"
            style={buttonStyle}
            onMouseEnter={(e) => Object.assign(e.target.style, buttonHover)}
            onMouseLeave={(e) => Object.assign(e.target.style, buttonStyle)}
          >
            Services
          </Link>
          <Link
            to="/portfolio"
            style={buttonStyle}
            onMouseEnter={(e) => Object.assign(e.target.style, buttonHover)}
            onMouseLeave={(e) => Object.assign(e.target.style, buttonStyle)}
          >
            Benzamods Portfolio
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}

export default HeroBanner;

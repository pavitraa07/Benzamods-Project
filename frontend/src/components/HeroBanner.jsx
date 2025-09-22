import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import { FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { jwtDecode } from "jwt-decode";

import bm1 from "../assets/bm1.jpg";
import bm2 from "../assets/bm2.jpg";
import bm3 from "../assets/bm3.jpg";
import bmlogo from "../assets/bmlogo1.jpg";

function HeroBanner() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [username, setUsername] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navigate = useNavigate();
  const images = [bm1, bm2, bm3];

  // check screen size
  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth <= 1024);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // image slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  // username
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username || "");
      } catch {
        setUsername("");
      }
    }
  }, []);

  // cart count sync
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cart.length);
    };
    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUsername("");
    setShowLogoutConfirm(false);
    navigate("/login");
  };

  const navLinks = (
    <>
      <Link to="/shop" style={linkStyle}>Shop</Link>
      <Link to="/services" style={linkStyle}>Services</Link>
      <Link to="/reviews" style={linkStyle}>Reviews</Link>
      <Link to="/portfolio" style={linkStyle}>Portfolio</Link>
      <Link to="/contact" style={linkStyle}>Contact</Link>
      <Link to="/about" style={linkStyle}>About</Link>
    </>
  );

  return (
    <div style={bannerContainer}>
      {/* Overlay */}
      <div style={overlay}></div>

      {/* Background Slider */}
      <div style={sliderWrapper}>
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Slide ${index}`}
            style={{
              ...sliderImage,
              opacity: currentImage === index ? 1 : 0,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header style={headerStyle}>
        {/* Left: Logo + Text */}
        <div style={logoSection}>
          <img src={bmlogo} alt="Logo" style={logoStyle} />
          <h1 style={brandText}>Benzamods</h1>
        </div>

        {/* Right: Desktop Links */}
        {!isMobile && (
          <nav style={navStyle}>
            {navLinks}
            <Link to="/cart" style={cartStyle}>
              <FiShoppingCart size={24} />
              {cartCount > 0 && <span style={cartBadge}>{cartCount}</span>}
            </Link>
            {username ? (
              <div style={{ position: "relative" }}>
                <span
                  style={usernameStyle}
                  onClick={() => setShowLogoutConfirm(true)}
                >
                  {username}
                </span>
              </div>
            ) : (
              <Link to="/login" style={loginStyle}>Login</Link>
            )}
          </nav>
        )}

        {/* Mobile: Hamburger */}
        {isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <Link to="/cart" style={cartStyle}>
              <FiShoppingCart size={24} />
              {cartCount > 0 && <span style={cartBadge}>{cartCount}</span>}
            </Link>
            <button onClick={() => setIsSidebarOpen(true)} style={menuButton}>
              <FiMenu size={30} />
            </button>
          </div>
        )}
      </header>

      {/* Sidebar for Mobile */}
      {isSidebarOpen && (
        <div style={sidebarOverlay} onClick={() => setIsSidebarOpen(false)}>
          <div
            style={sidebar}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setIsSidebarOpen(false)} style={closeButton}>
              <FiX size={28} />
            </button>
            <div style={sidebarLinks}>
              {navLinks}
              {username ? (
                <span
                  style={{ ...linkStyle, cursor: "pointer" }}
                  onClick={() => setShowLogoutConfirm(true)}
                >
                  Logout
                </span>
              ) : (
                <Link to="/login" style={linkStyle}>Login</Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Center Content */}
      <div style={contentStyle}>
        <h2 style={headingStyle}>Welcome to BenzaMods</h2>
        <div style={buttonWrapper}>
          <Link to="/services" style={buttonStyle}>Our Services</Link>
          <Link to="/portfolio" style={buttonStyle}>Portfolio</Link>
        </div>
      </div>

      {/* Logout Confirm */}
      {showLogoutConfirm && (
        <div style={logoutOverlay}>
          <div style={logoutBox}>
            <p style={{ fontSize: "18px", marginBottom: "20px" }}>
              Are you sure you want to logout?
            </p>
            <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
              <button onClick={handleLogout} style={confirmBtn}>Yes</button>
              <button onClick={() => setShowLogoutConfirm(false)} style={cancelBtn}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- STYLES ---------- */

const bannerContainer = {
  position: "relative",
  height: "100vh",
  overflow: "hidden",
  color: "#fff",
};

const overlay = {
  position: "absolute",
  top: 0, left: 0,
  width: "100%", height: "100%",
  backgroundColor: "rgba(0,0,0,0.6)",
  zIndex: 1,
};

const sliderWrapper = {
  position: "absolute",
  top: 0, left: 0,
  width: "100%", height: "100%",
  zIndex: 0,
};

const sliderImage = {
  position: "absolute",
  top: 0, left: 0,
  width: "100%", height: "100%",
  objectFit: "cover",
  transition: "opacity 1.5s ease",
};

const headerStyle = {
  position: "absolute",
  top: 0, left: 0,
  width: "100%",
  padding: "20px 50px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  zIndex: 2,
};

const logoSection = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
};

const logoStyle = {
  height: "50px",
  width: "50px",
  borderRadius: "50%",
  objectFit: "cover",
};

const brandText = {
  fontSize: "26px",
  fontWeight: "700",
  letterSpacing: "2px",
};

const navStyle = {
  display: "flex",
  alignItems: "center",
  gap: "25px",
};

const linkStyle = {
  color: "#fff",
  textDecoration: "none",
  fontSize: "18px",
  fontWeight: "500",
  transition: "color 0.3s ease",
};

const cartStyle = {
  position: "relative",
  color: "#fff",
  textDecoration: "none",
};

const cartBadge = {
  position: "absolute",
  top: "-8px", right: "-10px",
  background: "red",
  borderRadius: "50%",
  padding: "2px 6px",
  fontSize: "12px",
};

const usernameStyle = {
  color: "#fff",
  fontSize: "18px",
  fontWeight: "600",
  cursor: "pointer",
};

const loginStyle = {
  color: "#fff",
  fontSize: "18px",
  fontWeight: "500",
  textDecoration: "none",
};

const menuButton = {
  background: "none",
  border: "none",
  color: "#fff",
  cursor: "pointer",
};

const sidebarOverlay = {
  position: "fixed",
  top: 0, left: 0,
  width: "100%", height: "100%",
  backgroundColor: "rgba(0,0,0,0.7)",
  zIndex: 1000,
};

const sidebar = {
  background: "#111",
  width: "260px",
  height: "100%",
  padding: "20px",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const closeButton = {
  background: "none",
  border: "none",
  color: "#fff",
  alignSelf: "flex-end",
  cursor: "pointer",
};

const sidebarLinks = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const contentStyle = {
  position: "relative",
  zIndex: 2,
  textAlign: "center",
  top: "50%",
  transform: "translateY(-50%)",
};

const headingStyle = {
  fontSize: "50px",
  fontWeight: "700",
  marginBottom: "30px",
};

const buttonWrapper = {
  display: "flex",
  justifyContent: "center",
  gap: "30px",
};

const buttonStyle = {
  padding: "12px 25px",
  fontSize: "18px",
  fontWeight: "600",
  background: "transparent",
  border: "2px solid #fff",
  color: "#fff",
  borderRadius: "30px",
  cursor: "pointer",
  textDecoration: "none",
  transition: "all 0.3s ease",
};

const logoutOverlay = {
  position: "fixed",
  top: 0, left: 0,
  width: "100%", height: "100%",
  backgroundColor: "rgba(0,0,0,0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1100,
};

const logoutBox = {
  background: "#222",
  padding: "30px",
  borderRadius: "10px",
  textAlign: "center",
  width: "320px",
};

const confirmBtn = {
  padding: "8px 18px",
  background: "red",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const cancelBtn = {
  padding: "8px 18px",
  background: "#555",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default HeroBanner;

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import { FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import jwtDecode from "jwt-decode";

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

  // Initial render flag
  useEffect(() => setIsFirstRender(false), []);

  // Image slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Cart count
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(storedCart.length);

    const onCartUpdated = (e) => {
      if (e?.detail?.count >= 0) setCartCount(e.detail.count);
      else setCartCount(JSON.parse(localStorage.getItem("cart"))?.length || 0);
    };
    const onStorage = (ev) => {
      if (ev.key === "cart") setCartCount(JSON.parse(localStorage.getItem("cart"))?.length || 0);
    };

    window.addEventListener("cartUpdated", onCartUpdated);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("cartUpdated", onCartUpdated);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // Auth & responsiveness
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded?.name || decoded?.username || decoded?.email?.split("@")[0] || "");
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
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
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

  // Styles
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
    justifyContent: "flex-start",
    gap: "50px",
    padding: "20px 60px", // moved a bit right
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 3,
    animation: "fadeInDown 1s ease",
  };

  const logoContainer = { display: "flex", flexDirection: "column", alignItems: "flex-start" };
  const logoStyle = { height: "50px" };
  const titleStyle = {
    fontSize: "28px",
    fontWeight: "700",
    letterSpacing: "3px",
    color: "#fff",
    textShadow: "0 0 15px rgba(255,255,255,0.7)",
    marginTop: "5px",
  };

  const userNameStyle = {
    fontSize: "22px", // bigger
    fontWeight: "600",
    color: "#fff",
    textShadow: "0 0 10px rgba(255,255,255,0.8)",
    marginTop: "5px",
  };

  const navContainerStyle = {
    display: "flex",
    gap: "20px",
    marginLeft: "auto", // pushed right
    animation: "fadeInRight 1s ease",
  };

  const navButtonStyle = {
    background: "transparent",
    color: "#fff",
    border: "none",
    fontSize: "16px",
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

  const slideStyle = { minWidth: "100%", height: "100%", backgroundSize: "cover", backgroundPosition: "center" };
  const overlayStyle = { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1 };

  const textContainer = { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", zIndex: 2, animation: "fadeInUp 2s ease" };
  const headingStyle = { fontSize: "56px", fontWeight: "700", color: "#ffffff", letterSpacing: "4px", textShadow: "0 0 25px rgba(255,255,255,0.9)", marginBottom: "10px" };
  const subHeadingStyle = { fontSize: "24px", fontWeight: "500", color: "#ffffff", letterSpacing: "2px", textShadow: "0 0 10px rgba(255,255,255,0.8)", marginBottom: "30px" };
  const buttonStyle = { padding: "12px 30px", fontSize: "18px", fontWeight: "700", letterSpacing: "2px", backgroundColor: "#fcfcfcff", color: "#0c0202ff", border: "none", borderRadius: "25px", cursor: "pointer", textDecoration: "none", boxShadow: "0 0 20px rgba(8, 8, 8, 0.6)", transition: "all 0.3s ease" };
  const buttonHover = { backgroundColor: "#000000ff", color: "#fffefeff", boxShadow: "0 0 25px rgba(255,255,255,0.9)" };

  // Navbar Buttons
  const navButtons = (
    <>
      <button style={navButtonStyle} onClick={() => handleScroll("shop")}>Shop</button>
      <button style={navButtonStyle} onClick={() => handleScroll("services")}>Additional Services</button>
      <button style={navButtonStyle} onClick={() => handleScroll("reviews")}>Reviews</button>
      {isLoggedIn ? <button style={navButtonStyle} onClick={() => setShowLogoutConfirm(true)}>Logout</button> : <button style={navButtonStyle} onClick={() => navigate("/login")}>Login</button>}
      <button style={navButtonStyle} onClick={() => navigate("/contact")}><FaEnvelope /> Contact</button>
      <button style={navButtonStyle} onClick={() => navigate("/cart")}>
        <FiShoppingCart /> Cart
        {cartCount > 0 && <span style={{position: "absolute", top: "-8px", right: "-12px", background: "red", color: "white", borderRadius: "50%", padding: "2px 6px", fontSize: "12px", fontWeight: "700"}}>{cartCount}</span>}
      </button>
    </>
  );

  // Sidebar buttons same as before (omitted here for brevity, keep your previous sidebarButtons logic)

  return (
    <div style={bannerStyle}>
      {/* Sidebar */}
      {/* ... keep previous sidebar code ... */}

      {/* Header */}
      <div style={headerStyle}>
        <button onClick={toggleSidebar} style={{ background: "none", border: "none", color: "#fff", fontSize: "30px", cursor: "pointer" }}><FiMenu /></button>
        <div style={logoContainer}>
          <img src={bmlogo} alt="Benzamods Logo" style={logoStyle} />
          <h1 style={titleStyle}>Benzamods</h1>
          {isLoggedIn && userName && <p style={userNameStyle}>Hey! {userName}</p>}
        </div>
        {!isMobile && <div style={navContainerStyle}>{navButtons}</div>}
      </div>

      {/* Slider */}
      <div style={sliderWrapper}>{images.map((img, i) => <div key={i} style={{ ...slideStyle, backgroundImage: `url(${img})` }} />)}</div>
      <div style={overlayStyle}></div>

      {/* Welcome text */}
      <div style={textContainer}>
        <h2 style={headingStyle}>WELCOME TO BENZAMODS!</h2>
        <p style={subHeadingStyle}>Premium modifications for Cars and Bikes</p>
        <div style={{ marginLeft: "120px", display: "flex", gap: "20px", alignItems: "center" }}>
          <Link to="services/priority-services" style={buttonStyle} onMouseEnter={e => Object.assign(e.target.style, buttonHover)} onMouseLeave={e => Object.assign(e.target.style, buttonStyle)}>Services</Link>
          <Link to="/portfolio" style={buttonStyle} onMouseEnter={e => Object.assign(e.target.style, buttonHover)} onMouseLeave={e => Object.assign(e.target.style, buttonStyle)}>Benzamods Portfolio</Link>
        </div>
      </div>

      {/* Logout confirm */}
      {showLogoutConfirm && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}>
          <div style={{ background: "#1c1c1c", padding: "25px", borderRadius: "10px", textAlign: "center", width: "300px", color: "#fff", animation: "scaleIn 0.3s ease" }}>
            <h3>Are you sure you want to logout?</h3>
            <div>
              <button style={{ padding: "10px 20px", margin: "10px", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", background: "#dc2626", color: "#fff" }} onClick={handleLogout}>Yes</button>
              <button style={{ padding: "10px 20px", margin: "10px", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", background: "#374151", color: "#fff" }} onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translate(-50%, -40%); } to { opacity: 1; transform: translate(-50%, -50%); } }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        @keyframes slideOutRight { from { transform: translateX(0); } to { transform: translateX(-100%); } }
        @keyframes scaleIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}

export default HeroBanner;

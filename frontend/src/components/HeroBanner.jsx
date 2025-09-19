import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import { FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { jwtDecode } from "jwt-decode";

import bm1 from "../assets/bm1.jpg";
import bm2 from "../assets/bm2.jpg";
import bm3 from "../assets/bm3.jpg";
import bm7 from "../assets/bm7.jpg";
import bmlogo from "../assets/bmlogo1.jpg";

function HeroBanner({ shopRef, servicesRef, reviewsRef }) {
  const images = [bm1, bm2, bm3, bm7];
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

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

    // Load cart count
    const loadCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartCount(cart.length);
      } catch {
        setCartCount(0);
      }
    };

    loadCartCount();
    window.addEventListener("storage", loadCartCount);

    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("storage", loadCartCount);
    };
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
    opacity: 0,
    animation: sidebarOpen
      ? "fadeInRight 0.6s forwards"
      : "fadeInRight 0.6s forwards",
    animationDelay: "0.2s",
  };

  const confirmOverlay = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
  };

  const confirmBox = {
    background: "#1c1c1c",
    padding: "25px",
    borderRadius: "10px",
    textAlign: "center",
    width: "300px",
    color: "#fff",
    animation: "scaleIn 0.3s ease",
  };

  const confirmBtn = {
    padding: "10px 20px",
    margin: "10px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
  };

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
    padding: "20px 40px",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 3,
    animation: "fadeInDown 1s ease",
  };

  const logoContainer = {
    position: "relative",
    display: "flex",
    alignItems: "center",
  };

  const logoStyle = { height: "50px", marginRight: "15px" };

  const titleStyle = {
    fontSize: "28px",
    fontWeight: "700",
    letterSpacing: "3px",
    color: "#fff",
    textShadow: "0 0 15px rgba(255,255,255,0.7)",
    animation: "fadeInDown 1.5s ease",
  };

  const userNameStyle = {
    position: "absolute",
    top: "55px",
    left: "65px",
    fontSize: "18px",
    fontWeight: "500",
    color: "#fff",
    textShadow: "0 0 8px rgba(255,255,255,0.7)",
    letterSpacing: "2px",
  };

  const navContainerStyle = {
    display: "flex",
    gap: "12px",
    marginLeft: "auto",  
    flexWrap: "wrap",   
    maxWidth: "100%",        
    overflow: "hidden",  
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
    animation: "fadeInUp 2s ease",
  };

  const headingStyle = {
    fontSize: "56px",
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: "4px",
    textShadow: "0 0 25px rgba(255,255,255,0.9)",
    marginBottom: "10px",
  };

  const subHeadingStyle = {
    fontSize: "24px",
    fontWeight: "500",
    color: "#ffffff",
    letterSpacing: "2px",
    textShadow: "0 0 10px rgba(255,255,255,0.8)",
    marginBottom: "30px",
  };

  const buttonStyle = {
    padding: "12px 30px",
    fontSize: "18px",
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

  // --- Navigation buttons (header) ---
  const navButtons = (
    <>
      <button style={navButtonStyle} onClick={() => handleScroll("shop")}>
        Shop
      </button>
      <button style={navButtonStyle} onClick={() => handleScroll("services")}>
        Additional Services
      </button>
      <button style={navButtonStyle} onClick={() => handleScroll("reviews")}>
        Reviews
      </button>
      <button style={navButtonStyle} onClick={() => navigate("/adminpanel")}>
        Admin Panel
      </button>
      {isLoggedIn ? (
        <button
          style={navButtonStyle}
          onClick={() => setShowLogoutConfirm(true)}
        >
          Logout
        </button>
      ) : (
        <button style={navButtonStyle} onClick={() => navigate("/login")}>
          Login
        </button>
      )}
      <button style={navButtonStyle} onClick={() => navigate("/contact")}>
        <FaEnvelope /> Contact
      </button>
      <button style={navButtonStyle} onClick={() => navigate("/cart")}>
        <FiShoppingCart /> Cart
        {cartCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-8px",
              right: "-12px",
              background: "red",
              color: "white",
              borderRadius: "50%",
              padding: "2px 6px",
              fontSize: "12px",
              fontWeight: "700",
            }}
          >
            {cartCount}
          </span>
        )}
      </button>
    </>
  );

  const sidebarButtons = isMobile ? (
    <>
      <button style={sidebarBtnStyle} onClick={() => handleScroll("shop")}>
        Shop
      </button>
      <button style={sidebarBtnStyle} onClick={() => handleScroll("services")}>
        Additional Services
      </button>
      <button style={sidebarBtnStyle} onClick={() => handleScroll("reviews")}>
        Reviews
      </button>
      <button style={sidebarBtnStyle} onClick={() => navigate("/adminpanel")}>
        Admin Panel
      </button>
      {isLoggedIn ? (
        <button
          style={sidebarBtnStyle}
          onClick={() => setShowLogoutConfirm(true)}
        >
          Logout
        </button>
      ) : (
        <button style={sidebarBtnStyle} onClick={() => navigate("/login")}>
          Login
        </button>
      )}
      <button style={sidebarBtnStyle} onClick={() => navigate("/contact")}>
        <FaEnvelope /> Contact
      </button>
      <button style={sidebarBtnStyle} onClick={() => navigate("/cart")}>
        <FiShoppingCart /> Cart{" "}
        {cartCount > 0 && <span>({cartCount})</span>}
      </button>
      <button style={sidebarBtnStyle} onClick={() => navigate("/myaccount")}>
        My Account
      </button>
    </>
  ) : (
    <>
      <button style={sidebarBtnStyle} onClick={() => navigate("/adminpanel")}>
        Admin Panel
      </button>
      <button style={sidebarBtnStyle} onClick={() => navigate("/myaccount")}>
        My Account
      </button>
    </>
  );

  return (
    <div style={bannerStyle}>
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
            transition: "all 0.3s ease",
          }}
          onClick={toggleSidebar}
        >
          <FiX />
        </button>
        <div
          style={{
            marginTop: "70px",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          {sidebarButtons}
        </div>
      </div>

      <div style={headerStyle}>
        <button
          onClick={toggleSidebar}
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            fontSize: "30px",
            cursor: "pointer",
            transition: "transform 0.3s ease",
          }}
        >
          <FiMenu />
        </button>
        <div style={logoContainer}>
          <img src={bmlogo} alt="Benzamods Logo" style={logoStyle} />
          <h1 style={titleStyle}>Benzamods</h1>
          {isLoggedIn && userName && (
            <p style={userNameStyle}>Hey! {userName}</p>
          )}
        </div>
        {!isMobile && <div style={navContainerStyle}>{navButtons}</div>}
      </div>

      <div style={sliderWrapper}>
        {images.map((img, index) => (
          <div
            key={index}
            style={{ ...slideStyle, backgroundImage: `url(${img})` }}
          />
        ))}
      </div>

      <div style={overlayStyle}></div>

      <div style={textContainer}>
        <h2 style={headingStyle}>WELCOME TO BENZAMODS!</h2>
        <p style={subHeadingStyle}>
          Premium modifications for Cars and Bikes
        </p>
        <div
          style={{
            marginLeft: "120px",
            display: "flex",
            flexDirection: "row",
            gap: "20px",
            alignItems: "center",
          }}
        >
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

      {showLogoutConfirm && (
        <div style={confirmOverlay}>
          <div style={confirmBox}>
            <h3>Are you sure you want to logout?</h3>
            <div>
              <button
                style={{ ...confirmBtn, background: "#dc2626", color: "#fff" }}
                onClick={handleLogout}
              >
                Yes
              </button>
              <button
                style={{ ...confirmBtn, background: "#374151", color: "#fff" }}
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate(-50%, -40%); }
          to { opacity: 1; transform: translate(-50%, -50%); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideOut {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        button:hover {
          color: #00eaff;
          text-shadow: 0 0 8px rgba(0,234,255,0.8);
          transform: scale(1.05);
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

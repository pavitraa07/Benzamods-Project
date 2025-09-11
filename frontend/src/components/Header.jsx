import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import { FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";
import bmlogo from "../assets/bmlogo1.jpg";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      try {
        const decoded = jwtDecode(token);
        if (decoded?.name) setUserName(decoded.name);
        else if (decoded?.username) setUserName(decoded.username);
        else if (decoded?.email) setUserName(decoded.email.split("@")[0]);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }

    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleScrollOrNavigate = (id) => {
    if (location.pathname !== "/homepage") {
      navigate("/homepage");
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserName("");
    setShowLogoutConfirm(false);
    navigate("/");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const headerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "15px 40px",
    backgroundColor: "#000",
    color: "#fff",
    position: "sticky",
    top: 0,
    zIndex: 100,
  };

  const logoContainer = { display: "flex", alignItems: "center", gap: "15px" };
  const logoStyle = { height: "50px" };
  const titleStyle = { fontSize: "24px", fontWeight: "700", color: "#fff" };
  const navStyle = { display: "flex", alignItems: "center", gap: "20px" };
  const navButtonStyle = {
    background: "transparent",
    color: "#fff",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "600",
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
  };

  const sidebarBtnStyle = {
    background: "transparent",
    color: "#fff",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "600",
    fontFamily: "sans-serif",
    letterSpacing: "1px",
    textAlign: "left",
    padding: "10px 0",
  };

  
  const navButtons = (
    <>
      <button style={navButtonStyle} onClick={() => navigate("/homepage")}>
        Home
      </button>
      <button style={navButtonStyle} onClick={() => handleScrollOrNavigate("shop")}>
        Shop
      </button>
      <button style={navButtonStyle} onClick={() => handleScrollOrNavigate("services")}>
        Additional Services
      </button>
      <button style={navButtonStyle} onClick={() => handleScrollOrNavigate("reviews")}>
        Reviews
      </button>
      {isLoggedIn ? (
        <button style={navButtonStyle} onClick={() => setShowLogoutConfirm(true)}>
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
      </button>
    </>
  );

  const sidebarButtons = isMobile ? (
    <>
      <motion.button style={sidebarBtnStyle} onClick={() => navigate("/homepage")}
        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} >Home</motion.button>
      <motion.button style={sidebarBtnStyle} onClick={() => handleScrollOrNavigate("shop")}
        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} >Shop</motion.button>
      <motion.button style={sidebarBtnStyle} onClick={() => handleScrollOrNavigate("services")}
        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} >Additional Services</motion.button>
      <motion.button style={sidebarBtnStyle} onClick={() => handleScrollOrNavigate("reviews")}
        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} >Reviews</motion.button>
      {isLoggedIn ? (
        <motion.button style={sidebarBtnStyle} onClick={() => setShowLogoutConfirm(true)}
          initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }} >Logout</motion.button>
      ) : (
        <motion.button style={sidebarBtnStyle} onClick={() => navigate("/login")}
          initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }} >Login</motion.button>
      )}
      <motion.button style={sidebarBtnStyle} onClick={() => navigate("/contact")}
        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }} ><FaEnvelope /> Contact</motion.button>
      <motion.button style={sidebarBtnStyle} onClick={() => navigate("/cart")}
        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.7 }} ><FiShoppingCart /> Cart</motion.button>
      <motion.button style={sidebarBtnStyle} onClick={() => navigate("/adminpanel")}
        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.8 }} >Admin Panel</motion.button>
      <motion.button style={sidebarBtnStyle} onClick={() => navigate("/manageorders")}
        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.9 }} >Manage Orders</motion.button>
      <motion.button style={sidebarBtnStyle} onClick={() => navigate("/manageprofile")}
        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1.0 }} >My Profile</motion.button>
    </>
  ) : (
    <>
      <motion.button style={sidebarBtnStyle} onClick={() => navigate("/adminpanel")}
        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} >Admin Panel</motion.button>
      <motion.button style={sidebarBtnStyle} onClick={() => navigate("/manageorders")}
        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} >Manage Orders</motion.button>
      <motion.button style={sidebarBtnStyle} onClick={() => navigate("/manageprofile")}
        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} >My Profile</motion.button>
    </>
  );

  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            style={sidebarStyle}
            initial={{ x: -250, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -250, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
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
              {sidebarButtons}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.header
        style={headerStyle}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <button
          onClick={toggleSidebar}
          style={{ background: "none", border: "none", color: "#fff", fontSize: "30px", cursor: "pointer" }}
        >
          <FiMenu />
        </button>

        <div style={logoContainer}>
          <img src={bmlogo} alt="Benzamods Logo" style={logoStyle} />
          <h1 style={titleStyle}>Benzamods</h1>
          {isLoggedIn && <span style={{ marginLeft: "10px" }}>Hey, {userName}!</span>}
        </div>

        {!isMobile && <nav style={navStyle}>{navButtons}</nav>}
      </motion.header>

      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 2000,
            }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              style={{
                background: "#1c1c1c",
                padding: "30px",
                borderRadius: "15px",
                color: "#fff",
                textAlign: "center",
                boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
              }}
            >
              <h2>Are you sure?</h2>
              <p>You want to log out of your account?</p>
              <div style={{ marginTop: "20px", display: "flex", gap: "15px" }}>
                <button
                  onClick={confirmLogout}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#ff4d4d",
                    color: "#fff",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Yes, Logout
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#444",
                    color: "#fff",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  No, Stay
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

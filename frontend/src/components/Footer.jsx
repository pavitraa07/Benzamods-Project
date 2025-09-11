import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <motion.footer
      style={footerStyle}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <motion.div
        style={footerContainerStyle}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.2 },
          },
        }}
      >
        <motion.div
          style={footerColumnStyle}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.5 }}
        >
          <h2 style={footerHeadingStyle}>BenzaMods</h2>
          <p style={footerTextStyle}>📍 Jayanagar, Bangalore</p>
          <Link to="/map">
            <button style={mapBtnStyle}>View Map</button>
          </Link>
        </motion.div>

        <motion.div
          style={footerColumnStyle}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.5 }}
        >
          <h3 style={footerSubHeadingStyle}>Quick Links</h3>
          <ul style={footerListStyle}>
            <li style={{ marginBottom: "10px" }}>
              <Link to="/homepage" style={linkStyle}>
                Home
              </Link>
            </li>
            <li style={{ marginBottom: "10px" }}>
              <button onClick={() => handleScrollOrNavigate("shop")} style={linkBtnStyle}>
                Products
              </button>
            </li>
            <li style={{ marginBottom: "10px" }}>
              <button onClick={() => handleScrollOrNavigate("services")} style={linkBtnStyle}>
                Services
              </button>
            </li>
            <li style={{ marginBottom: "10px" }}>
              <Link to="/services/priority-services" style={linkStyle}>
                Priority Services
              </Link>
            </li>
          </ul>
        </motion.div>

        <motion.div
          style={footerColumnStyle}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.5 }}
        >
          <h3 style={footerSubHeadingStyle}>Contact</h3>
          <p>📞 +91 6358254512</p>
          <p>
            📧{" "}
            <a href="mailto:benzamodsmodifications@gmail.com" style={linkStyle}>
              benzamodsmodifications@gmail.com
            </a>
          </p>
          <Link to="/contact">
            <button style={contactBtnStyle}>Contact Us</button>
          </Link>
        </motion.div>
      </motion.div>

      <motion.p
        style={footerCopyrightStyle}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        viewport={{ once: true }}
      >
        © {new Date().getFullYear()} BenzaMods. All Rights Reserved.
      </motion.p>
    </motion.footer>
  );
}

const footerStyle = {
  backgroundColor: "#111",
  color: "#fff",
  padding: "60px 40px 30px",
};
const footerContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  flexWrap: "wrap",
  maxWidth: "1200px",
  margin: "0 auto",
  textAlign: "left",
};
const footerColumnStyle = { flex: "1 1 250px", marginBottom: "20px" };
const footerHeadingStyle = { fontSize: "28px", marginBottom: "15px" };
const footerSubHeadingStyle = { fontSize: "20px", marginBottom: "15px" };
const footerTextStyle = { fontSize: "16px", opacity: "0.9" };
const footerListStyle = { listStyle: "none", padding: 0, fontSize: "16px" };
const linkBtnStyle = {
  background: "none",
  border: "none",
  color: "#fff",
  fontSize: "16px",
  cursor: "pointer",
  padding: 0,
  textAlign: "left",
};
const linkStyle = { color: "#fff", textDecoration: "none" };
const mapBtnStyle = {
  marginTop: "15px",
  padding: "8px 25px",
  fontSize: "15px",
  fontWeight: "600",
  color: "#000",
  backgroundColor: "#fff",
  border: "none",
  borderRadius: "40px",
  cursor: "pointer",
};
const contactBtnStyle = {
  marginTop: "15px",
  padding: "10px 30px",
  fontSize: "16px",
  fontWeight: "600",
  color: "#000",
  backgroundColor: "#fff",
  border: "none",
  borderRadius: "50px",
  cursor: "pointer",
};
const footerCopyrightStyle = {
  textAlign: "center",
  marginTop: "40px",
  fontSize: "14px",
  opacity: "0.7",
};

export default Footer;

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import bmlogo from "../assets/bmlogo1.jpg";

const CompanyPortfolio = () => {
  const [header] = useState("BenzaMods");

  const company = {
    name: header,
    location: "Bangalore, Jaynagar",
    description: [
      "BenzaMods specializes in premium vehicle modifications including wraps, custom paint jobs, and performance enhancements.",
      "Our goal is to transform your vehicle into a unique statement while maintaining quality and precision.",
      "We offer customized solutions for car and bike enthusiasts who want both style and performance.",
      "From exterior aesthetics to engine tuning, every detail is crafted to perfection."
    ],
  };

  const images = [
    "https://i.pinimg.com/736x/68/23/a8/6823a85460551a26773e5e51a20fd10e.jpg",
    "https://i.pinimg.com/1200x/00/4c/0f/004c0f7e802c11e35b0455998dfd491b.jpg",
    "https://i.pinimg.com/1200x/63/d5/ac/63d5aca22a27bb05357f7e7cc3bdde40.jpg",
    "https://i.pinimg.com/1200x/d6/e1/72/d6e172d9982b405fade9092c06697789.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section
      style={{
        backgroundColor: "#000",
        color: "#fff",
        padding: "30px 20px", 
        fontFamily: "'Rajdhani', sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: "15px", gap: "15px" }}>
        <img
          src={bmlogo}
          alt="Logo"
          style={{
            height: "60px",
            width: "60px",
            borderRadius: "50%",
            border: "2px solid #fff",
          }}
        />
        <h1 style={{ fontSize: "48px", fontWeight: "800", letterSpacing: "2px" }}>{header}</h1>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "30px",
          flexWrap: "wrap",
        }}
      >
        {/* Image Carousel */}
        <div style={{ flex: "1 1 350px", minWidth: "280px" }}>
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "20px",
              border: "2px solid #fff",
              height: "450px",
            }}
          >
            <motion.div
              style={{ display: "flex", width: `${images.length * 100}%`, height: "100%" }}
              animate={{ x: `-${currentIndex * (100 / images.length)}%` }}
              transition={{ type: "tween", duration: 0.8 }}
            >
              {images.map((img, idx) => (
                <div
                  key={idx}
                  style={{
                    minWidth: `${100 / images.length}%`,
                    height: "100%",
                    padding: "3px",
                  }}
                >
                  <motion.img
                    src={img}
                    alt={`BenzaMods ${idx + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "15px",
                      border: "2px solid #fff",
                    }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Company Info */}
        <div
          style={{
            flex: "1 1 280px",
            minHeight: "450px",
            backgroundColor: "#111",
            border: "2px solid #fff",
            borderRadius: "20px",
            padding: "30px",
            color: "#fff",
          }}
        >
          <h2 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "10px" }}>{header}</h2>
          <p style={{ fontSize: "19px", color: "#ccc", marginBottom: "10px" }}>{company.location}</p>
          {company.description.map((para, idx) => (
            <p key={idx} style={{ fontSize: "19px", lineHeight: "1.6", margin: "0 0 10px 0" }}>
              {para}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompanyPortfolio;

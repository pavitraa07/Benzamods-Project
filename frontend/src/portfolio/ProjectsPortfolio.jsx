import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const API_BASE = process.env.REACT_APP_API_BASE; 

const getProjects = async () => {
  try {
    const res = await fetch(`${API_BASE}/portfolio/projects`);
    if (!res.ok) throw new Error("Failed to fetch projects");
    return await res.json();
  } catch (err) {
    console.error("Error fetching projects:", err);
    return [];
  }
};

const ProjectsPortfolio = () => {
const [projects, setProjects] = useState([]);

useEffect(() => {
  const fetchProjectData = async () => {
    const data = await getProjects();
    setProjects(data);
  };
  fetchProjectData();
}, []);


  return (
    <section
      style={{
        backgroundColor: "#000",
        color: "#fff",
        padding: "50px 20px",
        fontFamily: "'Rajdhani', sans-serif",
      }}
    >
      <h2
        style={{
          fontSize: "50px",
          fontWeight: "900",
          textAlign: "center",
          marginBottom: "60px",
          letterSpacing: "2px",
        }}
      >
        Company Projects
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "60px" }}>
        {projects.map((project, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
            style={{
              background: "#111",
              border: "2px solid #fff",
              borderRadius: "20px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              padding: "30px",
            }}
          >
            <h3
              style={{
                fontSize: "36px",
                fontWeight: "900",
                marginBottom: "35px",
                letterSpacing: "1px",
              }}
            >
              {project.title}
            </h3>

            <div style={{ display: "flex", justifyContent: "flex-start", gap:"150px", marginBottom: "35px" }}>
              {project.category && <span style={{ fontSize: "22px", fontWeight: "700" }}>•  Category: {project.category}</span>}
              {project.brand && <span style={{ fontSize: "22px", fontWeight: "700" }}>•  Brand: {project.brand}</span>}
              {project.serviceType && <span style={{ fontSize: "22px", fontWeight: "700" }}>•  Service: {project.serviceType}</span>}
            </div>

            <div style={{ display: "flex", gap: "40px", flexWrap: "wrap", marginBottom: "25px" }}>
              <div style={{ flex: "1 1 45%", display: "flex", flexDirection: "column", gap: "10px" }}>
                <h4 style={{ fontSize: "24px", fontWeight: "700" }}>Before Image</h4>
                {project.beforeImages?.map((img, i) => img && (
                  <img
                    key={`before-${i}`}
                    src={img}
                    alt={`Before ${i}`}
                    style={{
                      width: "100%",
                      height: "350px",
                      objectFit: "cover",
                      borderRadius: "15px",
                      border: "2px solid #fff",
                    }}
                  />
                ))}
              </div>

              <div style={{ flex: "1 1 45%", display: "flex", flexDirection: "column", gap: "10px" }}>
                <h4 style={{ fontSize: "24px", fontWeight: "700" }}>After Image</h4>
                {project.afterImages?.map((img, i) => img && (
                  <img
                    key={`after-${i}`}
                    src={img}
                    alt={`After ${i}`}
                    style={{
                      width: "100%",
                      height: "350px",
                      objectFit: "cover",
                      borderRadius: "15px",
                      border: "2px solid #fff",
                    }}
                  />
                ))}
              </div>
            </div>
            {project.description && (
              <p style={{ fontSize: "22px", color: "#fff", lineHeight: "1.8", fontWeight: "500" }}>
                {project.description}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsPortfolio;

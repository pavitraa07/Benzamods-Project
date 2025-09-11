import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Get API base from .env
const API_BASE = process.env.REACT_APP_API_BASE;

// Define API functions
const api = {
  getProducts: async () => {
    try {
      const res = await fetch(`${API_BASE}/portfolio/products`);
      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }
      return await res.json();
    } catch (error) {
      console.error("API error:", error);
      return [];
    }
  },
};

const ProductsPortfolio = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await api.getProducts();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <section
      style={{
        backgroundColor: "#000",
        color: "#fff",
        padding: "40px 20px",
        fontFamily: "'Rajdhani', sans-serif",
      }}
    >
      <h2
        style={{
          fontSize: "42px",
          fontWeight: "800",
          textAlign: "center",
          marginBottom: "30px",
          letterSpacing: "1.5px",
        }}
      >
        Offered Products
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "25px",
        }}
      >
        {products.map((product, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            style={{
              background: "#111",
              border: "2px solid #fff",
              borderRadius: "15px",
              overflow: "hidden",
              cursor: "pointer",
            }}
            onClick={() => navigate(`/productsportfoliodetails/${product._id}`)}
          >
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "220px",
                  objectFit: "cover",
                  borderBottom: "2px solid #fff",
                }}
              />
            )}
            <div style={{ padding: "15px" }}>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  marginBottom: "8px",
                }}
              >
                {product.name}
              </h3>
              <p style={{ fontSize: "16px", color: "#ccc" }}>
                {product.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ProductsPortfolio;

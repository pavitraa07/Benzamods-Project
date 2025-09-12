import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { Helmet } from "react-helmet";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_BASE = process.env.REACT_APP_API_BASE;

function ShopByCar() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [loadingImages, setLoadingImages] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchAllProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/products`);
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error fetching products:", err);
      return [];
    }
  };

  useEffect(() => {
    const fetchCars = async () => {
      const allProducts = await fetchAllProducts();
      const cars = allProducts.filter((p) => p.category.toLowerCase() === "car");
      setProducts(cars);
      setFiltered(cars);
    };
    fetchCars();
  }, []);

  useEffect(() => {
    setFiltered(
      products.filter(
        (p) =>
          p.price <= maxPrice &&
          p.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [products, maxPrice, searchTerm]);

  const resetFilter = () => {
    setMaxPrice(100000);
    setSearchTerm("");
    setFiltered(products);
  };

  const truncateText = (text, max = 60) =>
    text.length > max ? text.slice(0, max) + "..." : text;

  return (
    <>
      <Header />
      <div style={{ background: "#0d0d0d", minHeight: "100vh", padding: "40px" }}>
        <Helmet>
          <title>Shop by Car | Premium Car Accessories & Upgrades</title>
          <meta
            name="description"
            content="Browse premium car accessories, performance upgrades, and parts. Use filters and search to quickly find the best products for your car."
          />
          <meta
            name="keywords"
            content="shop by car, car accessories, car upgrades, car parts, performance parts, premium car gear"
          />
          <meta property="og:title" content="Shop by Car" />
          <meta
            property="og:description"
            content="Shop premium car accessories and upgrades with advanced search and price filters."
          />
          <meta name="author" content="Your Company Name" />
        </Helmet>

        {/* Header + Search */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
            marginBottom: "35px",
          }}
        >
          <h1
            style={{
              fontSize: "40px",
              textAlign: "center",
              color: "#fff",
              fontWeight: "bold",
              letterSpacing: "1px",
              margin: "0",
            }}
          >
            🚗 Shop by Car
          </h1>
          <input
            type="text"
            placeholder="🔍 Search cars..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "10px 18px",
              borderRadius: "20px",
              border: "2px solid #33cc33",
              background: "rgba(255,255,255,0.08)",
              color: "#fff",
              fontSize: "15px",
              outline: "none",
              width: "220px",
              transition: "0.3s",
            }}
          />
        </div>

        {/* Filter Controls (same as ShopByBike) */}
        <div
          style={{
            marginBottom: "40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            padding: "15px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.05)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          <label style={{ color: "#fff", fontSize: "15px" }}>
            💰 Show products under:{" "}
            <b style={{ color: "#33cc33" }}>₹{maxPrice.toLocaleString()}</b>
          </label>
          <input
            type="range"
            min="0"
            max="100000"
            step="1000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            style={{
              width: "220px",
              accentColor: "#33cc33",
              cursor: "pointer",
            }}
          />
          <button
            onClick={resetFilter}
            style={{
              marginTop: "5px",
              padding: "6px 16px",
              borderRadius: "8px",
              border: "none",
              background: "linear-gradient(135deg, #020203ff, #000002ff)",
              fontWeight: "600",
              fontSize: "13px",
              cursor: "pointer",
              color: "#fff",
              transition: "all 0.3s",
            }}
          >
            Reset
          </button>
        </div>

        {/* Products Grid */}
        {filtered.length === 0 ? (
          <p style={{ color: "#aaa", textAlign: "center", fontSize: "18px" }}>
            No car products available.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "25px",
            }}
          >
            {filtered.map((product) => (
              <div
                key={product._id}
                className="product-card"
                onClick={() =>
                  navigate("/order", { state: { singleProduct: product } })
                }
                style={{
                  cursor: "pointer",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.5)",
                  transition: "0.3s all",
                  textAlign: "center",
                  border: "3px solid #fff",
                  position: "relative",
                }}
              >
                {loadingImages[product._id] && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      background: "rgba(0,0,0,0.5)",
                      zIndex: 1,
                    }}
                  >
                    <ClipLoader color="#33cc33" />
                  </div>
                )}
                {product.image && (
                  <LazyLoadImage
                    src={product.image}
                    alt={product.name}
                    effect="blur"
                    beforeLoad={() =>
                      setLoadingImages((prev) => ({
                        ...prev,
                        [product._id]: true,
                      }))
                    }
                    afterLoad={() =>
                      setLoadingImages((prev) => ({
                        ...prev,
                        [product._id]: false,
                      }))
                    }
                    onError={() =>
                      setLoadingImages((prev) => ({
                        ...prev,
                        [product._id]: false,
                      }))
                    }
                    style={{
                      width: "100%",
                      height: "330px",
                      objectFit: "cover",
                      transition: "0.3s",
                    }}
                  />
                )}
                <div style={{ padding: "20px", color: "#fff" }}>
                  <h2
                    style={{
                      fontSize: "20px",
                      marginBottom: "8px",
                      fontWeight: "600",
                    }}
                  >
                    {product.name}
                  </h2>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#aaa",
                      marginBottom: "10px",
                    }}
                  >
                    {product.description
                      ? truncateText(product.description, 70)
                      : "No description available."}
                  </p>
                  <p
                    style={{
                      fontSize: "16px",
                      color: "#33cc33",
                      fontWeight: "bold",
                    }}
                  >
                    ₹{product.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <style>
          {`
            .product-card:hover {
              transform: translateY(-8px) scale(1.04);
              box-shadow: 0 14px 40px rgba(77, 204, 77, 0.6);
              border: 2px solid #33cc33;
            }

            .product-card img:hover {
              transform: scale(1.06);
            }
          `}
        </style>
      </div>
      <Footer />
    </>
  );
}

export default ShopByCar;

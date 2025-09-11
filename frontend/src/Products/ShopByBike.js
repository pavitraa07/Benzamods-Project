import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { Helmet } from "react-helmet";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css"; 
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_BASE = process.env.REACT_APP_API_BASE;

function ShopByBike() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
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
  const fetchBikes = async () => {
    const allProducts = await fetchAllProducts();
    const bikes = allProducts.filter((p) => p.category.toLowerCase() === "bike");
    setProducts(bikes);
    setFiltered(bikes);
  };
  fetchBikes();
}, []);

  useEffect(() => {
    setFiltered(
      products.filter(
        (p) =>
          p.price >= minPrice &&
          p.price <= maxPrice &&
          p.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [products, minPrice, maxPrice, searchTerm]);

  const resetFilter = () => {
    setMinPrice(0);
    setMaxPrice(100000);
    setSearchTerm("");
    setFiltered(products);
  };

  const truncateText = (text, max = 60) =>
    text.length > max ? text.slice(0, max) + "..." : text;
  return (
    <>
      <Header/>
      <div style={{ background: "#0d0d0d", minHeight: "100vh", padding: "40px" }}>
        <Helmet>
          <title>Shop by Bike | Premium Bike Accessories & Upgrades</title>
          <meta
            name="description"
            content="Browse premium bike accessories, performance upgrades, and parts. Use filters and search to quickly find the best products for your motorcycle."
          />
          <meta
            name="keywords"
            content="shop by bike, bike accessories, motorcycle upgrades, motorbike parts, bike tuning, performance parts, premium motorcycle gear"
          />
          <meta property="og:title" content="Shop by Bike" />
          <meta
            property="og:description"
            content="Shop premium bike accessories and upgrades with advanced search and price filters."
          />
          <meta name="author" content="Your Company Name" />
        </Helmet>

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
            🏍️ Shop by Bike
          </h1>
          <input
            type="text"
            placeholder="🔍 Search bikes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "12px 20px",
              borderRadius: "30px",
              border: "2px solid #33cc33",
              background: "rgba(255,255,255,0.08)",
              color: "#fff",
              fontSize: "16px",
              outline: "none",
              width: "250px",
              transition: "0.3s",
            }}
          />
        </div>

        {/* Filter Controls */}
        <div
          style={{
            marginBottom: "50px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
            padding: "20px",
            borderRadius: "15px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
          }}
        >
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            style={{
              padding: "14px 20px",
              borderRadius: "12px",
              border: "1px solid #ff4d4d",
              background: "rgba(255,255,255,0.08)",
              color: "#fff",
              fontSize: "16px",
              outline: "none",
              width: "140px",
              textAlign: "center",
              transition: "0.3s",
            }}
          />
          <span style={{ color: "#fff", fontSize: "18px" }}>—</span>
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            style={{
              padding: "14px 20px",
              borderRadius: "12px",
              border: "1px solid #33cc33",
              background: "rgba(255,255,255,0.08)",
              color: "#fff",
              fontSize: "16px",
              outline: "none",
              width: "140px",
              textAlign: "center",
              transition: "0.3s",
            }}
          />
          <button
            onClick={resetFilter}
            style={{
              padding: "12px 28px",
              borderRadius: "12px",
              border: "none",
              background: "linear-gradient(135deg, #8888ff, #4444ff)",
              fontWeight: "600",
              fontSize: "16px",
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
            No bike products available.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "30px",
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
                  border: "4px solid #fff",
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
                    afterLoad={() =>
                      setLoadingImages((prev) => ({
                        ...prev,
                        [product._id]: false,
                      }))
                    }
                    beforeLoad={() =>
                      setLoadingImages((prev) => ({
                        ...prev,
                        [product._id]: true,
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
                      height: "200px",
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
              transform: translateY(-10px) scale(1.05);
              box-shadow: 0 18px 50px rgba(77, 204, 77, 0.6);
              border: 2px solid #33cc33;
            }

            .product-card img:hover {
              transform: scale(1.08);
            }
          `}
        </style>
      </div>
      <Footer/>
    </>
  );
}

export default ShopByBike;

import { useEffect, useState, useCallback } from "react";
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
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [loadingImages, setLoadingImages] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const fetchAllProducts = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Error fetching products:", err);
      return [];
    }
  }, []);

  const fetchCars = useCallback(async () => {
    const allProducts = await fetchAllProducts();
    const cars = allProducts.filter((p) => p.category.toLowerCase() === "car");
    setProducts(cars);
    setFiltered(cars);

    const initialLoading = {};
    cars.forEach((car) => {
      if (car.image) initialLoading[car._id] = true;
    });
    setLoadingImages(initialLoading);

    return cars;
  }, [fetchAllProducts]);


  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  useEffect(() => {
    setFiltered(
      products.filter(
        (p) =>
          p.price >= minPrice &&
          p.price <= maxPrice &&
          p.name.toLowerCase().startsWith(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, minPrice, maxPrice, products]);

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
      <Header />
      <div style={{ background: "#0d0d0d", minHeight: "100vh", padding: "40px" }}>
        <Helmet>
          <title>Shop by Car | Premium Car Accessories & Upgrades</title>
          <meta
            name="description"
            content="Explore and shop premium car accessories, upgrades, and performance parts. Filter by price, search easily, and find the best fit for your vehicle."
          />
          <meta
            name="keywords"
            content="shop by car, car accessories, car upgrades, car parts, vehicle tuning, premium auto parts, car performance"
          />
          <meta property="og:title" content="Shop by Car" />
          <meta
            property="og:description"
            content="Browse premium car products including accessories, upgrades, and performance parts with advanced filters and search."
          />
          <meta name="author" content="Your Company Name" />
        </Helmet>

        {/* Heading + Search */}
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
              animation: "fadeInDown 1s ease",
            }}
          >
            🚗 Shop by Car
          </h1>
          <input
            type="text"
            placeholder="🔍 Search cars..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchBarStyle}
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
            style={inputStyleMinMax(true)}
          />
          <span style={{ color: "#fff", fontSize: "18px" }}>—</span>
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            style={inputStyleMinMax(false)}
          />
          <button onClick={resetFilter} style={resetButtonStyle}>
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
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "30px",
            }}
          >
            {filtered.map((product, index) => (
              <div
                key={product._id}
                onClick={() =>
                  navigate("/order", { state: { singleProduct: product } })
                }
                className="product-card"
                style={{
                  ...productCardStyle,
                  animation: `fadeInUp 0.8s ease ${index * 0.1}s forwards`,
                  opacity: 0,
                }}
              >
                {product.image && loadingImages[product._id] && (
                  <div style={loaderOverlayStyle}>
                    <ClipLoader color="#ff4c4c" />
                  </div>
                )}

                {product.image && (
                  <LazyLoadImage
                    src={product.image}
                    alt={product.name}
                    beforeLoad={() =>
                      setLoadingImages((prev) => ({ ...prev, [product._id]: true }))
                    }
                    afterLoad={() =>
                      setLoadingImages((prev) => ({ ...prev, [product._id]: false }))
                    }
                    onError={() =>
                      setLoadingImages((prev) => ({ ...prev, [product._id]: false }))
                    }
                    style={productImageStyle}
                  />
                )}

                <div style={{ padding: "20px", color: "#fff" }}>
                  <h2 style={productTitleStyle}>{product.name}</h2>
                  <p style={productDescStyle}>
                    {product.description
                      ? truncateText(product.description, 70)
                      : "No description available."}
                  </p>
                  <p style={productPriceStyle}>₹{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <style>
          {`
            @keyframes fadeInDown {
              from { opacity: 0; transform: translateY(-40px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(40px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .product-card:hover {
              transform: translateY(-10px) scale(1.05);
              box-shadow: 0 18px 50px rgba(255, 77, 77, 0.6);
              border: 2px solid #ff4c4c;
            }
            .product-card img:hover {
              transform: scale(1.08);
            }
          `}
        </style>
      </div>
      <Footer />
    </>
  );
}

const searchBarStyle = {
  padding: "12px 20px",
  borderRadius: "30px",
  border: "2px solid #ff4c4c",
  background: "rgba(255,255,255,0.08)",
  color: "#fff",
  fontSize: "16px",
  outline: "none",
  width: "250px",
  transition: "0.3s",
};

const inputStyleMinMax = (isMin) => ({
  padding: "14px 20px",
  borderRadius: "12px",
  border: `1px solid ${isMin ? "#ff4d4d" : "#33cc33"}`,
  background: "rgba(255,255,255,0.08)",
  color: "#fff",
  fontSize: "16px",
  outline: "none",
  width: "140px",
  textAlign: "center",
  transition: "0.3s",
});

const resetButtonStyle = {
  padding: "12px 28px",
  borderRadius: "12px",
  border: "none",
  background: "linear-gradient(135deg, #8888ff, #4444ff)",
  fontWeight: "600",
  fontSize: "16px",
  cursor: "pointer",
  color: "#fff",
  transition: "all 0.3s",
};

const productCardStyle = {
  cursor: "pointer",
  background: "rgba(255,255,255,0.05)",
  borderRadius: "20px",
  overflow: "hidden",
  boxShadow: "0 8px 25px rgba(0,0,0,0.5)",
  transition: "0.3s all",
  textAlign: "center",
  border: "4px solid #fff",
  position: "relative",
};

const loaderOverlayStyle = {
  position: "absolute",
  inset: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "rgba(0,0,0,0.5)",
  zIndex: 1,
};

const productImageStyle = {
  width: "100%",
  height: "200px",
  objectFit: "cover",
  transition: "0.3s",
};

const productTitleStyle = {
  fontSize: "20px",
  marginBottom: "8px",
  fontWeight: "600",
};

const productDescStyle = {
  fontSize: "14px",
  color: "#aaa",
  marginBottom: "10px",
};

const productPriceStyle = {
  fontSize: "16px",
  color: "#ff4c4c",
  fontWeight: "bold",
};

export default ShopByCar;

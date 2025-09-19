import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectMode, setSelectMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const isAuthenticated = !!localStorage.getItem("token");

  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    } else {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(storedCart);

      // notify HeroBanner of current count
      window.dispatchEvent(
        new CustomEvent("cartUpdated", { detail: { count: storedCart.length } })
      );
    }
  }, [isAuthenticated]);

  const handleRemove = (productId) => {
    const updatedCart = cartItems.filter((item) => item._id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // notify HeroBanner of new count
    window.dispatchEvent(
      new CustomEvent("cartUpdated", { detail: { count: updatedCart.length } })
    );
  };

  const handleSelectToggle = (product) => {
    if (selectedItems.find((item) => item._id === product._id)) {
      setSelectedItems(selectedItems.filter((item) => item._id !== product._id));
    } else {
      setSelectedItems([...selectedItems, product]);
    }
  };

  const handleDone = () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one product to buy!");
      return;
    }

    const total = selectedItems.reduce((acc, item) => acc + item.price, 0);

    navigate("/order", {
      state: {
        products: selectedItems,
        total,
      },
    });
  };

  const goToLogin = () => {
    localStorage.setItem("redirectAfterLogin", "/cart");
    navigate("/login");
  };

  const filteredItems =
    filter === "all"
      ? cartItems
      : cartItems.filter((item) => item.category.toLowerCase() === filter);

  return (
    <div style={{ background: "#0d0d0d", minHeight: "100vh", padding: "40px" }}>
      <Header />
      {showLoginModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            animation: "fadeIn 0.4s ease",
          }}
        >
          <div
            style={{
              background: "#1c1c1c",
              padding: "40px",
              borderRadius: "16px",
              textAlign: "center",
              color: "#fff",
              maxWidth: "420px",
              width: "90%",
              boxShadow: "0 0 30px rgba(56,189,248,0.4)",
              border: "1px solid #333",
            }}
          >
            <h2 style={{ marginBottom: "15px", fontSize: "24px" }}>
              Login Required
            </h2>
            <p style={{ marginBottom: "25px", color: "#bbb", fontSize: "15px" }}>
              Please log in to view and manage your cart products.
            </p>
            <button
              onClick={goToLogin}
              style={{
                padding: "12px 28px",
                borderRadius: "8px",
                border: "none",
                background: "linear-gradient(135deg, #38bdf8, #06b6d4)",
                color: "#000",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
              Go to Login
            </button>
          </div>
        </div>
      )}

      {/*  Cart Content (only if logged in) */}
      {!showLoginModal && (
        <>
          <h1
            style={{
              fontSize: "36px",
              textAlign: "center",
              marginBottom: "20px",
              color: "#fff",
              fontWeight: "bold",
              letterSpacing: "1px",
            }}
          >
            🛒 Cart Products
          </h1>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              marginBottom: "30px",
            }}
          >
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                padding: "10px 20px",
                borderRadius: "10px",
                border: "1px solid #444",
                background: "#1c1c1c",
                color: "#fff",
                fontSize: "16px",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="all">All</option>
              <option value="car">Car</option>
              <option value="bike">Bike</option>
            </select>

            <button
              onClick={() => setSelectMode(!selectMode)}
              style={{
                padding: "10px 20px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #007bff, #00d4ff)",
                color: "#fff",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              {selectMode ? "Cancel" : "Select Products to Buy"}
            </button>

            {selectMode && (
              <button
                onClick={handleDone}
                style={{
                  padding: "10px 20px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #28a745, #85e085)",
                  color: "#fff",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Done
              </button>
            )}
          </div>

          {filteredItems.length === 0 ? (
            <p style={{ color: "#aaa", textAlign: "center", fontSize: "18px" }}>
              Your cart is empty or no items in this category.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "25px",
              }}
            >
              {filteredItems.map((product) => (
                <div
                  key={product._id}
                  className="cart-card"
                  style={{
                    background: "linear-gradient(145deg, #1c1c1c, #292929)",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.6)",
                    paddingBottom: "15px",
                  }}
                >
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <div style={{ padding: "15px", color: "#fff" }}>
                    <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>
                      {product.name}
                    </h2>
                    <p style={{ fontSize: "16px", color: "#ccc" }}>
                      ₹{product.price}
                    </p>
                    <p style={{ fontSize: "14px", color: "#aaa" }}>
                      Category:{" "}
                      {product.category.charAt(0).toUpperCase() +
                        product.category.slice(1)}
                    </p>

                    {selectMode ? (
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "10px",
                          gap: "10px",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={!!selectedItems.find(
                            (item) => item._id === product._id
                          )}
                          onChange={() => handleSelectToggle(product)}
                        />
                        Select to Buy
                      </label>
                    ) : (
                      <button
                        onClick={() => handleRemove(product._id)}
                        style={{
                          marginTop: "10px",
                          padding: "10px 18px",
                          borderRadius: "8px",
                          border: "none",
                          background:
                            "linear-gradient(135deg, #ff0000, #ff5555)",
                          color: "#fff",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <Footer />
        </>
      )}
    </div>
  );
}

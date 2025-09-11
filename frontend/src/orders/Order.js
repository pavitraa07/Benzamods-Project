import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE;

export default function Order() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    quantity: 1,
    instructions: "",
  });

async function placeOrder(orderData) {
  return await axios.post(`${API_BASE}/orders`, orderData);
}

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [cartAdded, setCartAdded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  let { singleProduct, products = [], total = 0 } = location.state || {};
  const isCartCheckout = !singleProduct && products.length > 0;

  useEffect(() => {
    if ((!singleProduct && products.length === 0) && localStorage.getItem("pendingOrderData")) {
      const saved = JSON.parse(localStorage.getItem("pendingOrderData"));
      if (saved.singleProduct || (saved.products && saved.products.length > 0)) {
        navigate(location.pathname, { state: saved, replace: true });
      }
      localStorage.removeItem("pendingOrderData");
    }
  }, [location.pathname, navigate, singleProduct, products]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const requireLogin = (message) => {
    if (!localStorage.getItem("token")) {
      setModalMessage(message);
      setModalOpen(true);

      localStorage.setItem("redirectAfterLogin", location.pathname + location.search);
      localStorage.setItem(
        "pendingOrderData",
        JSON.stringify({ singleProduct, products, total })
      );

      return false;
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!requireLogin("Please login to add this item to cart")) return;

    if (!singleProduct) return;
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({ ...singleProduct, quantity: formData.quantity });
    localStorage.setItem("cart", JSON.stringify(cart));
    setCartAdded(true);
  };

  // Buy Now (just shows form)
  const handleBuyNow = () => {
    if (!requireLogin("Please login to buy this product")) return;
    setShowForm(true);
  };

  // Submit Order
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!requireLogin("Please login to place your order")) return;

    setLoading(true);
    setSuccess("");

    try {
      let orderItems = [];
      let orderTotal = 0;

      if (singleProduct) {
        orderItems = [
          {
            id: singleProduct._id,
            name: singleProduct.name,
            image: singleProduct.image,
            price: singleProduct.price,
            quantity: formData.quantity,
          },
        ];
        orderTotal = singleProduct.price * formData.quantity;
      } else {
        orderItems = products.map((p) => ({
          id: p._id,
          name: p.name,
          image: p.image,
          price: p.price,
          quantity: p.quantity,
        }));
        orderTotal =
          total || orderItems.reduce((sum, p) => sum + p.price * p.quantity, 0);
      }

      const orderData = {
        customer: {
          name: formData.name,
          email: formData.email,
          address: formData.address,
          instructions: formData.instructions,
        },
        items: orderItems,
        total: orderTotal,
      };

     await placeOrder(orderData);

      setSuccess("✅ Order placed successfully! Check your email for confirmation.");
      setFormData({
        name: "",
        email: "",
        address: "",
        quantity: 1,
        instructions: "",
      });
    } catch (err) {
      console.error(err);
      setSuccess("❌ Failed to place order, try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fallback if nothing selected
  if (!singleProduct && products.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#121212",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>No product selected.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#121212",
        color: "#fff",
        padding: "40px",
        display: "flex",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          maxWidth: "1100px",
          width: "100%",
          background: "#1e1e1e",
          borderRadius: "16px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.6)",
          overflow: "hidden",
        }}
      >
        <div style={{ flex: 1, padding: "20px", borderRight: "1px solid #333" }}>
          {singleProduct ? (
            <div style={{ textAlign: "center" }}>
              <img
                src={singleProduct.image}
                alt={singleProduct.name}
                style={{
                  width: "100%",
                  maxHeight: "520px",
                  borderRadius: "12px",
                  objectFit: "cover",
                  marginBottom: "15px",
                }}
              />
              <h2 style={{ fontSize: "1.8rem", margin: "10px 0" }}>
                {singleProduct.name}
              </h2>
              {singleProduct.description && (
                <p style={{ color: "#ccc", marginBottom: "10px" }}>
                  {singleProduct.description}
                </p>
              )}
              <p
                style={{
                  fontSize: "1.3rem",
                  color: "#ff4c4c",
                  fontWeight: "bold",
                }}
              >
                ₹{singleProduct.price}
              </p>
              {!cartAdded ? (
                <button
                  onClick={handleAddToCart}
                  style={{
                    padding: "12px 24px",
                    borderRadius: "10px",
                    border: "none",
                    background: "linear-gradient(135deg, #ff4d4d, #ff1a1a)",
                    color: "#fff",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    marginTop: "12px",
                    width: "100%",
                  }}
                >
                  Add to Cart
                </button>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    marginTop: "12px",
                  }}
                >
                  <button
                    style={{
                      padding: "12px 24px",
                      borderRadius: "10px",
                      border: "none",
                      background: "gray",
                      color: "#fff",
                      fontWeight: "600",
                      cursor: "default",
                      width: "100%",
                    }}
                  >
                    Added to Cart
                  </button>
                  <button
                    onClick={() => navigate("/cart")}
                    style={{
                      padding: "12px 24px",
                      borderRadius: "10px",
                      border: "none",
                      background: "linear-gradient(135deg, #ff9900, #ffcc00)",
                      color: "#000",
                      fontWeight: "600",
                      cursor: "pointer",
                      width: "100%",
                    }}
                  >
                    Go to Cart
                  </button>
                </div>
              )}

              {/* Buy Now */}
              <button
                onClick={handleBuyNow}
                style={{
                  padding: "12px 24px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #33cc33, #009900)",
                  color: "#fff",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  marginTop: "12px",
                  width: "100%",
                }}
              >
                Buy Now
              </button>
            </div>
          ) : (
            // CART CHECKOUT
            <div>
              <h3 style={{ fontSize: "1.4rem", marginBottom: "15px" }}>
                Your Cart Items
              </h3>
              {products.map((p) => (
                <div
                  key={p._id}
                  style={{
                    display: "flex",
                    gap: "12px",
                    marginBottom: "12px",
                    background: "#2a2a2a",
                    padding: "10px",
                    borderRadius: "10px",
                  }}
                >
                  {p.image && (
                    <img
                      src={p.image}
                      alt={p.name}
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  )}
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <strong>{p.name}</strong>
                    <span>
                      ₹{p.price} × {p.quantity}
                    </span>
                    <span style={{ color: "#aaa" }}>
                      Subtotal: ₹{p.price * p.quantity}
                    </span>
                  </div>
                </div>
              ))}
              <p
                style={{
                  fontSize: "1.2rem",
                  marginTop: "15px",
                  fontWeight: "bold",
                }}
              >
                Total: ₹
                {total ||
                  products.reduce((sum, p) => sum + p.price * p.quantity, 0)}
              </p>
            </div>
          )}
        </div>

        <div style={{ flex: 1.2, padding: "30px", display: "flex", flexDirection: "column" }}>
          {(isCartCheckout || showForm) ? (
            <>
              <h2 style={{ fontSize: "1.8rem", marginBottom: "20px" }}>
                {singleProduct ? "Buy this Product" : "Complete your Order"}
              </h2>

              {singleProduct && (
                <div style={{ marginBottom: "10px" }}>
                  <label style={{ display: "block", marginBottom: "6px", color: "#ccc" }}>
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #444",
                      background: "#2a2a2a",
                      color: "#fff",
                      width: "120px",
                    }}
                  />
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #444",
                    background: "#2a2a2a",
                    color: "#fff",
                  }}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #444",
                    background: "#2a2a2a",
                    color: "#fff",
                  }}
                />
                <textarea
                  name="address"
                  placeholder="Delivery Address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="3"
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #444",
                    background: "#2a2a2a",
                    color: "#fff",
                  }}
                />
                <textarea
                  name="instructions"
                  placeholder="Order Instructions (optional)"
                  value={formData.instructions}
                  onChange={handleChange}
                  rows="2"
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #444",
                    background: "#2a2a2a",
                    color: "#fff",
                  }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: "14px",
                    borderRadius: "10px",
                    border: "none",
                    background: "linear-gradient(135deg, #33cc33, #009900)",
                    color: "#fff",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  {loading ? "Placing Order..." : "Place Order"}
                </button>
              </form>

              {success && (
                <p style={{ marginTop: "15px", color: success.includes("✅") ? "lightgreen" : "red" }}>
                  {success}
                </p>
              )}
            </>
          ) : (
            <div style={{ color: "#aaa" }}>
              <h2 style={{ fontSize: "1.6rem", marginBottom: "10px" }}>Ready to Purchase?</h2>
              <p>Click <strong>Buy Now</strong> to fill the form and complete your order.</p>
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#1c1c1c",
              padding: "30px",
              borderRadius: "16px",
              textAlign: "center",
              maxWidth: "400px",
              width: "100%",
              boxShadow: "0 0 20px rgba(0,0,0,0.6)",
            }}
          >
            <h3 style={{ color: "#fff", marginBottom: "15px" }}>Please login</h3>
            <p style={{ color: "#aaa", marginBottom: "20px" }}>{modalMessage}</p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                onClick={() => {
                  navigate("/login");
                }}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#ff6600",
                  color: "#fff",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Login Now
              </button>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "1px solid #444",
                  background: "transparent",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

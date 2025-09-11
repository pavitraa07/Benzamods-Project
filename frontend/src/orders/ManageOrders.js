import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; 
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/Footer";
import Header from "../components/Header"; 

const API_BASE = process.env.REACT_APP_API_BASE;

// -API functions 
async function fetchOrdersAPI() {
  const { data } = await axios.get(`${API_BASE}/orders`);
  return data;
}

async function cancelOrderAPI(id) {
  await axios.delete(`${API_BASE}/orders/${id}`); 
}

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [confirmId, setConfirmId] = useState(null); 
  const [searchQuery, setSearchQuery] = useState(""); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded?.email) {
          setUserEmail(decoded.email);
        }
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }

    const fetchOrders = async () => {
      try {
        const data = await fetchOrdersAPI(); 
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading)
    return <p style={{ color: "#fff", textAlign: "center" }}>Loading orders...</p>;

  const userOrders = orders.filter(
    (order) => order.customer?.email === userEmail
  );
  const filteredOrders = userOrders.filter(
    (order) =>
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const handleCancel = async (id) => {
    try {
      await cancelOrderAPI(id); 
      setOrders((prev) => prev.filter((o) => o._id !== id));
      setConfirmId(null);
    } catch (err) {
      console.error("Cancel order error:", err);
    }
  };

  if (!userOrders.length) {
    return (
      <div style={{ background: "#0d0d0d", minHeight: "100vh", padding: "40px" }}>
        <Header />
        <p style={{ color: "#aaa", textAlign: "center" }}>
          No orders found for {userEmail || "this account"}.
        </p>
      </div>
    );
  }

  return (
    <div style={{ background: "#0d0d0d", minHeight: "100vh", padding: "40px" }}>
      <Header /> 

      <h1
        style={{
          textAlign: "center",
          color: "#fff",
          marginBottom: "20px",
          fontSize: "36px",
          fontWeight: "bold",
        }}
      >
        🛒 My Orders
      </h1>

      <input
        type="text"
        placeholder="Search by Order ID or Product Name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #444",
          background: "#2c2c2c",
          color: "#fff",
          fontSize: "16px",
          width: "100%",
          maxWidth: "600px",
          display: "block",
          margin: "0 auto 30px",
        }}
      />

      {filteredOrders.length === 0 ? (
        <p style={{ color: "#aaa", textAlign: "center" }}>No matching orders.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "30px",
          }}
        >
          {filteredOrders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              style={{
                background: "linear-gradient(145deg, #1c1c1c, #292929)",
                color: "#fff",
                borderRadius: "15px",
                padding: "20px",
                boxShadow: "0 8px 25px rgba(0,0,0,0.5)",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <h3>Order ID: {order._id}</h3>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              <p><strong>Total:</strong> ₹{order.total}</p>
              <p><strong>Products:</strong></p>
              <ul>
                {order.items.map((item) => (
                  <li key={item.productId}>
                    {item.name} x{item.quantity} - ₹{item.price * item.quantity}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setConfirmId(order._id)}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#ff4d4d",
                  color: "#fff",
                  fontWeight: "bold",
                  cursor: "pointer",
                  marginTop: "10px",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                Cancel Order
              </button>
            </motion.div>
          ))}
        </div>
      )}
      <AnimatePresence>
        {confirmId && (
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
              zIndex: 999,
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
              <p>You want to cancel this order?</p>
              <div style={{ marginTop: "20px", display: "flex", gap: "15px" }}>
                <button
                  onClick={() => handleCancel(confirmId)}
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
                  Yes, Cancel
                </button>
                <button
                  onClick={() => setConfirmId(null)}
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
                  No, Keep
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default ManageOrders;

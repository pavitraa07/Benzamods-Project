import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE;

const getOrders = async () => axios.get(`${API_BASE}/orders`);
const deleteOrderById = async (id) => axios.delete(`${API_BASE}/orders/${id}`);

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModal, setDeleteModal] = useState({ visible: false, orderId: null });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getOrders();
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const confirmDelete = (id) => {
    setDeleteModal({ visible: true, orderId: id });
  };

  const handleDelete = async () => {
    if (!deleteModal.orderId) return;
    try {
      await deleteOrderById(deleteModal.orderId);
      setOrders((prev) => prev.filter((o) => o._id !== deleteModal.orderId));
      setDeleteModal({ visible: false, orderId: null });
    } catch (err) {
      console.error("Delete order error:", err);
    }
  };

  if (loading)
    return <p style={{ color: "#fff", textAlign: "center" }}>Loading orders...</p>;

  const filteredOrders = orders.filter(
    (order) =>
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ background: "#0d0d0d", minHeight: "100vh", padding: "40px" }}>
      <h1
        style={{
          textAlign: "center",
          color: "#fff",
          marginBottom: "20px",
          fontSize: "36px",
          fontWeight: "bold",
        }}
      >
        📦 Admin Orders
      </h1>

      <input
        type="text"
        placeholder="Search by Order ID or Customer Name..."
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
        <p style={{ color: "#aaa", textAlign: "center" }}>No orders found.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "30px",
          }}
        >
          {filteredOrders.map((order) => (
            <div
              key={order._id}
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
              <p>
                <strong>Customer:</strong> {order.customer.name} ({order.customer.email})
              </p>
              <p>
                <strong>Address:</strong> {order.customer.address}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              <p>
                <strong>Order Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Products:</strong>
              </p>
              <ul>
                {order.items.map((item) => (
                  <li key={item.productId}>
                    {item.name} x{item.quantity} - ₹{item.price * item.quantity}
                  </li>
                ))}
              </ul>
              <p>
                <strong>Total:</strong> ₹{order.total}
              </p>
              <button
                onClick={() => confirmDelete(order._id)}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#fff",
                  color: "#000",
                  fontWeight: "bold",
                  cursor: "pointer",
                  marginTop: "10px",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                Delete Order
              </button>
            </div>
          ))}
        </div>
      )}
      
      {deleteModal.visible && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#1c1c1c",
              padding: "30px",
              borderRadius: "12px",
              textAlign: "center",
              color: "#fff",
              width: "300px",
            }}
          >
            <h3>Are you sure you want to delete this order?</h3>
            <div
              style={{
                marginTop: "20px",
                display: "flex",
                gap: "15px",
                justifyContent: "center",
              }}
            >
              <button
                onClick={handleDelete}
                style={{
                  padding: "10px 15px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  background: "#e74c3c",
                  color: "#fff",
                }}
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteModal({ visible: false, orderId: null })}
                style={{
                  padding: "10px 15px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  background: "#444",
                  color: "#fff",
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

import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";
const fetchInquiriesApi = () => axios.get(`${API_BASE}/inquiries`);
const deleteInquiryApi = (id) => axios.delete(`${API_BASE}/inquiries/${id}`);

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchInquiries = async () => {
    try {
      const res = await fetchInquiriesApi();
      setInquiries(res.data);
    } catch (err) {
      console.error("Error fetching inquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await deleteInquiryApi(deleteId);
      setInquiries(inquiries.filter((inq) => inq._id !== deleteId));
    } catch (err) {
      console.error("Error deleting inquiry:", err);
    } finally {
      setShowModal(false);
      setDeleteId(null);
    }
  };

  const filteredInquiries = inquiries.filter((inq) =>
    inq.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <p style={{ color: "#fff", textAlign: "center", marginTop: "50px" }}>
        Loading inquiries...
      </p>
    );
  }

  return (
    <div style={{ padding: "40px", minHeight: "100vh", background: "#0d0d0d" }}>
      <h1
        style={{
          color: "#fff",
          fontSize: "36px",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        Inquiries
      </h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by name..."
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

      {filteredInquiries.length === 0 ? (
        <p style={{ color: "#aaa", textAlign: "center", fontSize: "18px" }}>
          No inquiries found.
        </p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "#1a1a1a",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 8px 20px rgba(0,0,0,0.6)",
            }}
          >
            <thead>
              <tr style={{ background: "#222" }}>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Address</th>
                <th style={thStyle}>Vehicle</th>
                <th style={thStyle}>Contact</th>
                <th style={thStyle}>Service</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Details</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredInquiries.map((inq, index) => (
                <tr
                  key={inq._id}
                  style={{
                    background: index % 2 === 0 ? "#1f1f1f" : "#2a2a2a",
                    transition: "background 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#333")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      index % 2 === 0 ? "#1f1f1f" : "#2a2a2a")
                  }
                >
                  <td style={tdStyle}>{inq.name}</td>
                  <td style={tdStyle}>{inq.address}</td>
                  <td style={tdStyle}>
                    {inq.vehicleName} ({inq.vehicleModel})
                  </td>
                  <td style={tdStyle}>{inq.contact}</td>
                  <td style={tdStyle}>{inq.service?.title || inq.serviceTitle}</td>
                  <td style={tdStyle}>{inq.category}</td>
                  <td style={{ ...tdStyle, maxWidth: "250px" }}>
                    {inq.details}
                  </td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>
                    <button
                      onClick={() => confirmDelete(inq._id)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "8px",
                        border: "none",
                        background: "linear-gradient(135deg, #f87171, #fca5a5)",
                        color: "#000",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "transform 0.3s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.05)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: "#1c1c1c",
              padding: "30px",
              borderRadius: "12px",
              textAlign: "center",
              maxWidth: "400px",
              width: "90%",
              color: "#fff",
            }}
          >
            <h2 style={{ marginBottom: "20px" }}>Confirm Delete</h2>
            <p style={{ marginBottom: "25px" }}>
              Are you sure you want to delete this inquiry?
            </p>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={handleDelete}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#ef4444",
                  color: "#fff",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#6b7280",
                  color: "#fff",
                  fontWeight: "bold",
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

// Reusable styles
const thStyle = {
  padding: "14px",
  textAlign: "left",
  color: "#fff",
  fontWeight: "600",
  fontSize: "15px",
  borderBottom: "1px solid #333",
};

const tdStyle = {
  padding: "12px",
  color: "#ddd",
  fontSize: "14px",
  borderBottom: "1px solid #333",
};

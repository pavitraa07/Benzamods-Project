import React, { useState, useEffect } from "react";

const API_BASE = process.env.REACT_APP_API_BASE; 

const getReviews = async () => {
  try {
    const res = await fetch(`${API_BASE}/portfolio/reviews`);
    if (!res.ok) throw new Error("Failed to fetch reviews");
    return await res.json();
  } catch (err) {
    console.error("Error fetching reviews:", err);
    return [];
  }
};

const submitReview = async (reviewData) => {
  try {
    const res = await fetch(`${API_BASE}/portfolio/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewData),
    });
    if (!res.ok) throw new Error("Failed to submit review");
    return await res.json();
  } catch (err) {
    console.error("Error submitting review:", err);
    return null;
  }
};

const ReviewsPortfolio = () => {
  const [reviews, setReviews] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [form, setForm] = useState({
    name: "",
    rating: 5,
    text: "",
    beforeImage: "",
    afterImage: "",
    category: "Product", 
  });

useEffect(() => {
  const fetchReviewsData = async () => {
    const data = await getReviews();
    if (showAll) {
      setReviews(data);
    } else {
      setReviews(data.slice(0, 4));
    }
  };

  fetchReviewsData();
}, [showAll]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  await submitReview(form);

  setForm({
    name: "",
    rating: 5,
    text: "",
    beforeImage: "",
    afterImage: "",
    category: "Product",
  });

  const data = await getReviews();
  if (showAll) {
    setReviews(data);
  } else {
    setReviews(data.slice(0, 4));
  }
};


  const renderStars = (count) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span
        key={i}
        style={{
          color: i < count ? "#FFD700" : "#555",
          fontSize: "16px",
          marginRight: "2px",
        }}
      >
        ★
      </span>
    ));
  };

  return (
    <section
      style={{
        backgroundColor: "#000",
        color: "#fff",
        padding: "40px 20px",
        fontFamily: "'Rajdhani', sans-serif",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1
          style={{
            fontSize: "42px",
            fontWeight: "800",
            marginBottom: "10px",
          }}
        >
          What do you think about us?
        </h1>
        <h2 style={{ fontSize: "28px", fontWeight: "600", color: "#fff" }}>
          Client Reviews
        </h2>
      </div>

      {!showAll && (
        <div
          style={{
            backgroundColor: "#111",
            padding: "20px",
            borderRadius: "15px",
            marginBottom: "40px",
            maxWidth: "500px",
            margin: "auto",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={inputStyle}
              required
            />
            <input
              type="number"
              placeholder="Rating (1-5)"
              value={form.rating}
              onChange={(e) =>
                setForm({ ...form, rating: Number(e.target.value) })
              }
              min={1}
              max={5}
              style={inputStyle}
              required
            />
            <textarea
              placeholder="Your Review"
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              style={{ ...inputStyle, minHeight: "80px" }}
              required
            />
            <input
              type="text"
              placeholder="Before Image URL"
              value={form.beforeImage}
              onChange={(e) =>
                setForm({ ...form, beforeImage: e.target.value })
              }
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="After Image URL"
              value={form.afterImage}
              onChange={(e) =>
                setForm({ ...form, afterImage: e.target.value })
              }
              style={inputStyle}
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              style={inputStyle}
            >
              <option value="Product">Product</option>
              <option value="Service">Service</option>
            </select>
            <button type="submit" style={buttonStyle}>
              Submit Review
            </button>
          </form>
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        {reviews.map((rev, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: "#111",
              padding: "15px",
              borderRadius: "12px",
              width: "250px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <h3 style={{ fontSize: "20px", fontWeight: "700" }}>{rev.name}</h3>
            <div>{renderStars(rev.rating)}</div>
            <p style={{ fontSize: "16px" }}>{rev.text}</p>

            {rev.beforeImage && (
              <div>
                <h4
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    marginBottom: "4px",
                  }}
                >
                  Before Image
                </h4>
                <img
                  src={rev.beforeImage}
                  alt="Before"
                  style={{
                    width: "100%",
                    maxHeight: "150px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </div>
            )}

            {rev.afterImage && (
              <div>
                <h4
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    marginBottom: "4px",
                  }}
                >
                  After Image
                </h4>
                <img
                  src={rev.afterImage}
                  alt="After"
                  style={{
                    width: "100%",
                    maxHeight: "150px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "30px", textAlign: "center" }}>
        {!showAll ? (
          <button
            onClick={() => setShowAll(true)}
            style={{ ...buttonStyle, backgroundColor: "#fff", color: "#000" }}
          >
            See All Reviews
          </button>
        ) : (
          <button
            onClick={() => setShowAll(false)}
            style={{ ...buttonStyle, backgroundColor: "#fff", color: "#000" }}
          >
            Back to Portfolio
          </button>
        )}
      </div>
    </section>
  );
};

const inputStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #444",
  background: "#222",
  color: "#fff",
};
const buttonStyle = {
  padding: "12px 20px",
  border: "none",
  borderRadius: "8px",
  background: "#fff",
  color: "#000",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "16px",
};

export default ReviewsPortfolio;

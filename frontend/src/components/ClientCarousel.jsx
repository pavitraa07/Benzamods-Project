import { useState, useEffect } from "react";

const API_BASE = process.env.REACT_APP_API_BASE;

function ClientCarousel() {
  const [reviews, setReviews] = useState([]);
  const [current, setCurrent] = useState(0);
  const [animate, setAnimate] = useState(false);

async function getReviews() {
  const res = await fetch(`${API_BASE}/portfolio/reviews`);
  return res.json();
}

useEffect(() => {
  const fetchReviews = async () => {
    try {
      const data = await getReviews();
      setReviews(data);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  };
  fetchReviews();
}, []);


  const handleNext = () => {
    if (reviews.length === 0) return;
    setAnimate(true);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % reviews.length);
      setAnimate(false);
    }, 500);
  };

  const containerStyle = {
    backgroundColor: "#000",
    color: "#fff",
    padding: "100px 20px",
    textAlign: "center",
    fontFamily: "'Rajdhani', sans-serif",
  };

  const boxStyle = {
    margin: "0 auto",
    backgroundColor: "#111",
    border: "2px solid #fff",
    borderRadius: "20px",
    padding: "30px",
    maxWidth: "500px",
    minHeight: "200px",
    position: "relative",
    animation: animate ? "slideOut 0.5s forwards" : "slideIn 0.5s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  };

  const starsStyle = {
    fontSize: "18px",
    color: "#FFD700",
  };

  const imagesContainerStyle = {
    display: "flex",
    gap: "8px",
    marginTop: "10px",
  };

  const imgStyle = {
    width: "100px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "6px",
    border: "1px solid #444",
  };

  const textStyle = {
    fontSize: "18px",
    lineHeight: "1.6",
    margin: "10px 0 5px",
    textAlign: "center",
  };

  const nameStyle = {
    fontSize: "16px",
    fontWeight: "bold",
    textAlign: "center",
  };

  const buttonStyle = {
    marginTop: "20px",
    padding: "12px 40px",
    fontSize: "18px",
    fontWeight: "600",
    color: "#000",
    backgroundColor: "#fff",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  return (
    <div style={{ fontFamily: "'Rajdhani', sans-serif" }}>
      <div style={containerStyle}>
        <h2
          style={{
            fontSize: "42px",
            marginBottom: "40px",
            letterSpacing: "3px",
            textTransform: "uppercase",
          }}
        >
          Client Reviews
        </h2>

        {reviews.length > 0 ? (
          <div style={boxStyle}>
            <div style={starsStyle}>{"★".repeat(reviews[current].rating)}</div>
            <p style={textStyle}>{reviews[current].text}</p>

            <div style={imagesContainerStyle}>
              {reviews[current].beforeImage && (
                <img
                  src={reviews[current].beforeImage}
                  alt="Before"
                  style={imgStyle}
                />
              )}
              {reviews[current].afterImage && (
                <img
                  src={reviews[current].afterImage}
                  alt="After"
                  style={imgStyle}
                />
              )}
            </div>

            <p style={nameStyle}>— {reviews[current].name}</p>
          </div>
        ) : (
          <p style={{ color: "#fff", fontSize: "18px" }}>No reviews yet.</p>
        )}

        <button style={buttonStyle} onClick={handleNext}>
          Next ➝
        </button>

        <style>
          {`
            @keyframes slideIn {
              from { opacity: 0; transform: translateX(100px); }
              to { opacity: 1; transform: translateX(0); }
            }
            @keyframes slideOut {
              from { opacity: 1; transform: translateX(0); }
              to { opacity: 0; transform: translateX(-100px); }
            }
            button:hover {
              background-color: #ddd;
            }
          `}
        </style>
      </div>
    </div>
  );
}

export default ClientCarousel;

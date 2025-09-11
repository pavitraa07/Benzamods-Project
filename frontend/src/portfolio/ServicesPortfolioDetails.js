import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import ClipLoader from "react-spinners/ClipLoader";

const API_BASE = process.env.REACT_APP_API_BASE;

const getServiceById = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/portfolio/services/${id}`);
    if (!res.ok) throw new Error("Failed to fetch service");
    return await res.json();
  } catch (err) {
    console.error("Error fetching service details:", err);
    return null;
  }
};

const getReviews = async (category) => {
  try {
    const res = await fetch(`${API_BASE}/portfolio/reviews`);
    if (!res.ok) throw new Error("Failed to fetch reviews");
    const data = await res.json();
    return data.filter((r) => r.category === category);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    return [];
  }
};

const postReview = async (review) => {
  try {
    const res = await fetch(`${API_BASE}/portfolio/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review),
    });
    if (!res.ok) throw new Error("Failed to submit review");
    return await res.json();
  } catch (err) {
    console.error("Error submitting review:", err);
    return null;
  }
};

function ServicesPortfolioDetails() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({
    name: "",
    rating: 5,
    text: "",
    beforeImage: "",
    afterImage: "",
    category: "Service",
  });

  useEffect(() => {
  const fetchServiceData = async () => {
    const data = await getServiceById(id);
    setService(data);
  };
  fetchServiceData();
}, [id]);

  const fetchReviews = async () => {
  const data = await getReviews("Service");
  setReviews(data);
};

  useEffect(() => {
    fetchReviews();
  }, [id]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  const result = await postReview(form);
  if (result) {
    setForm({
      name: "",
      rating: 5,
      text: "",
      beforeImage: "",
      afterImage: "",
      category: "Service",
    });
    fetchReviews();
  }
};

  const renderStars = (count) =>
    Array.from({ length: 5 }).map((_, i) => (
      <span
        key={i}
        style={{ color: i < count ? "#FFD700" : "#555", fontSize: "16px", marginRight: "2px" }}
      >
        ★
      </span>
    ));

  // Lazy-load gallery images
  useEffect(() => {
    if (!service?.gallery?.length) return;
    let loadedCount = 0;
    const totalImages = service.gallery.length;
    service.gallery.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount += 1;
        if (loadedCount === totalImages) setImagesLoaded(true);
      };
      img.onerror = () => {
        loadedCount += 1;
        if (loadedCount === totalImages) setImagesLoaded(true);
      };
    });
  }, [service]);

  if (!service || !imagesLoaded) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#0d0d0d",
        }}
      >
        <ClipLoader color="#36d7b7" size={60} />
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#0d0d0d",
        color: "#fff",
        minHeight: "100vh",
        padding: "40px",
        animation: "fadeIn 1s ease forwards",
      }}
    >
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{service.name} | Benzamods</title>
        <meta
          name="description"
          content={
            service.detailedDesc ||
            `Explore ${service.name} details and reviews at Benzamods.`
          }
        />
        <meta
          name="keywords"
          content={`Benzamods, ${service.name}, Service Details, Reviews`}
        />
        <meta name="author" content="Benzamods" />
        <meta property="og:title" content={`${service.name} | Benzamods`} />
        <meta
          property="og:description"
          content={
            service.detailedDesc ||
            "Check out our service details and customer reviews."
          }
        />
        {service.gallery?.[0] && (
          <meta property="og:image" content={service.gallery[0]} />
        )}
      </Helmet>

      {/* Gallery + Description */}
<div
  style={{
    display: "flex",
    flexDirection: "row",
    gap: "20px",
    flexWrap: "wrap", // allows stacking on smaller screens
    marginBottom: "50px",
  }}
>
  {/* Gallery */}
  <div
    style={{
      flex: "1 1 400px",
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gridTemplateRows: "repeat(3, 220px)",
      gap: "12px",
    }}
  >
    {service.gallery?.slice(0, 6).map((img, idx) => (
      <div
        key={idx}
        style={{
          overflow: "hidden",
          borderRadius: "16px",
          gridColumn: idx === 0 ? "span 2" : "span 1",
          gridRow: idx === 0 ? "span 2" : "span 1",
          animation: `fadeIn 0.6s ease forwards ${idx * 0.1}s`,
        }}
      >
        <img
          src={img}
          alt={`Gallery ${idx}`}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          loading="lazy"
        />
      </div>
    ))}
  </div>

  {/* Description */}
  <div
    style={{
      flex: "1 1 300px",
      background: "linear-gradient(145deg, #1c1c1c, #292929)",
      borderRadius: "20px",
      padding: "30px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      boxShadow: "0 8px 25px rgba(0,0,0,0.6)",
      minHeight: "660px", 
    }}
  >
    <h2 style={{ fontSize: "32px", marginBottom: "15px", fontWeight: "bold" }}>
      {service.name}
    </h2>
    {service.detailedDesc ? (
      <p style={{ color: "#ddd", fontSize: "18px", lineHeight: 1.7 }}>
        {service.detailedDesc}
      </p>
    ) : (
      <p style={{ color: "#777" }}>No detailed description available.</p>
    )}
  </div>
</div>

      {/* Review Form */}
      <div
        style={{
          backgroundColor: "#111",
          padding: "20px",
          borderRadius: "15px",
          marginBottom: "40px",
          maxWidth: "500px",
          margin: "50px auto 40px auto",
          animation: "fadeIn 1s ease forwards 0.7s",
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
            onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
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
            onChange={(e) => setForm({ ...form, beforeImage: e.target.value })}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="After Image URL"
            value={form.afterImage}
            onChange={(e) => setForm({ ...form, afterImage: e.target.value })}
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

      {/* Reviews */}
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
              animation: `fadeIn 0.8s ease forwards ${idx * 0.1}s`,
            }}
          >
            <h3 style={{ fontSize: "20px", fontWeight: "700" }}>{rev.name}</h3>
            <div>{renderStars(rev.rating)}</div>
            <p style={{ fontSize: "16px" }}>{rev.text}</p>
            {rev.beforeImage && (
              <img
                src={rev.beforeImage}
                alt="Before"
                style={{ width: "100%", maxHeight: "150px", objectFit: "cover", borderRadius: "8px" }}
                loading="lazy"
              />
            )}
            {rev.afterImage && (
              <img
                src={rev.afterImage}
                alt="After"
                style={{ width: "100%", maxHeight: "150px", objectFit: "cover", borderRadius: "8px" }}
                loading="lazy"
              />
            )}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

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

export default ServicesPortfolioDetails;

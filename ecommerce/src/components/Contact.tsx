
import React, { useState, useEffect } from "react";
import axios from "axios";
import TopNavBar from "./TopNavBar";
import Footer from "./Footer";
import ResponsiveNavBarWrapper from "./esponsiveNavBarWrapper";
import ReviewSection from "./ReviewSection";

const Contact: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [success, setSuccess] = useState("");
  const [banner, setBanner] = useState<{ image_path: string; banner_text: string } | null>(null);

  useEffect(() => {
    // Fetch banner from backend where placement = 'Contact'
    axios
      .get<any[]>("https://jewelskart-backend.onrender.com/api/banners/Contact")
      .then((res) => {
        if (res.data.length > 0) {
          setBanner({
            image_path: res.data[0].image_url, // already includes /uploads/banner/...
            banner_text: res.data[0].title,
          });
        }
      })
      .catch((err) => console.error("❌ Error fetching banner:", err));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://jewelskart-backend.onrender.com/contact", form);
      if (res.data.success) {
        setSuccess("✅ Message sent successfully!");
        setForm({ name: "", email: "", subject: "", message: "" });
      }
    } catch {
      setSuccess("❌ Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <TopNavBar />
      <ResponsiveNavBarWrapper />

      {/* Dynamic Banner */}
      {banner ? (
        <div style={{ position: "relative" }}>
          <img
            style={{ height: "40vh", width: "100%" }}
            src={`https://jewelskart-backend.onrender.com${banner.image_path}`}
            alt="Contact Banner"
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "2rem",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {banner.banner_text}
          </div>
        </div>
      ) : (
        <p style={{ textAlign: "center", marginTop: 30 }}>Loading banner...</p>
      )}

      <div style={{ background: 'var(--bg-secondary)', padding: '40px 20px' }}>
        <h1 style={{ 
          color: 'var(--primary-teal)',
          fontSize: '2.5rem',
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: '16px'
        }}>
          Consultation
        </h1>
        <div style={{
          width: '80px',
          height: '3px',
          background: 'var(--primary-sage)',
          margin: '0 auto',
          borderRadius: '2px'
        }} />
      </div>

      <div className="container mt-5" style={{ background: 'var(--bg-primary)', padding: '40px 20px', borderRadius: '12px', boxShadow: '0 4px 20px var(--shadow-light)' }}>
        <div className="row">
          {/* Left Column - Map */}
          <div className="col-md-6 mb-4 d-flex align-items-stretch">
            <div style={{ width: "100%", height: "100%", position: "relative" }}>
              <a
                href="https://www.google.com/maps/place/Kothrud,+Pune,+Maharashtra"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 2,
                }}
                aria-label="Get Directions"
              >
                <span
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    background: "rgba(255,255,255,0.8)",
                    padding: "6px 12px",
                    borderRadius: 4,
                    zIndex: 3,
                    fontWeight: 500,
                  }}
                >
                  Get Directions
                </span>
              </a>
              <iframe
                title="Google Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019243787683!2d144.9537363155051!3d-37.816279742021634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf57766dcf4a6f9b1!2sFederation%20Square!5e0!3m2!1sen!2sin!4v1602476564564!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  minHeight: 380,
                  width: "100%",
                  height: "100%",
                }}
                frameBorder="0"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="col-md-6 d-flex align-items-stretch">
            <div style={{ width: "100%" }}>
              <form
                onSubmit={handleSubmit}
                className="h-100 d-flex flex-column justify-content-between"
                style={{ minHeight: 380 }}
              >
                <div>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label" style={{ color: 'var(--primary-teal)', fontWeight: '600' }}>
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label" style={{ color: 'var(--primary-teal)', fontWeight: '600' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="subject" className="form-label" style={{ color: 'var(--primary-teal)', fontWeight: '600' }}>
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Subject"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="message" className="form-label" style={{ color: 'var(--primary-teal)', fontWeight: '600' }}>
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      className="form-control"
                      rows={5}
                      placeholder="Your message"
                    ></textarea>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn w-100 mt-2"
                  style={{
                    background: 'var(--gradient-primary)',
                    color: 'var(--text-light)',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '1.1rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px var(--shadow-light)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px var(--shadow-medium)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px var(--shadow-light)';
                  }}
                >
                  Contact Us
                </button>
                {success && <div className="alert alert-info mt-3">{success}</div>}
              </form>
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: "60px" }}></div>
      <ReviewSection />
      <Footer />
    </>
  );
};

export default Contact;

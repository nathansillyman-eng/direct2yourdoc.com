/**
 * ContactSection — Direct2YourDoc
 * Design: Forest green background, simple inquiry form, warm typography
 */
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Mail, Phone, Shield } from "lucide-react";

export default function ContactSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".fade-up").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    backgroundColor: "oklch(0.97 0.02 200 / 0.07)",
    border: "1px solid oklch(0.97 0.02 200 / 0.2)",
    borderRadius: "2px",
    padding: "0.875rem 1rem",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.95rem",
    color: "white",
    outline: "none",
    transition: "border-color 200ms ease",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.72rem",
    fontWeight: 500,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: "oklch(0.72 0.04 200)",
    display: "block",
    marginBottom: "0.5rem",
  };

  return (
    <section
      id="contact"
      ref={ref}
      style={{ backgroundColor: "oklch(0.13 0.05 200)", paddingTop: "8rem", paddingBottom: "8rem" }}
    >
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left: Copy */}
          <div>
            <div className="fade-up">
              <span
                className="section-label mb-6 block"
                style={{ color: "oklch(0.62 0.13 90)" }}
              >
                Begin Your Inquiry
              </span>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(2.4rem, 4vw, 3.5rem)",
                  fontWeight: 600,
                  color: "white",
                  lineHeight: 1.1,
                }}
              >
                Your Doctor. Your Home. Now.
                <br />
                <em style={{ color: "oklch(0.75 0.15 165)" }}>Now available.</em>
              </h2>
            </div>

            <div className="fade-up mt-8">
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "1.05rem",
                  color: "oklch(0.78 0.04 200)",
                  lineHeight: 1.8,
                }}
              >
                Reach out and we'll take it from there. Our care team personally reads every
                message and responds within 24 hours to set up your first conversation —
                handled with care and kept private.
              </p>
            </div>

            <div className="fade-up mt-10 flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "oklch(0.97 0.02 200 / 0.18)" }}
                >
                  <Phone size={17} style={{ color: "oklch(0.85 0.03 200)" }} />
                </div>
                <div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(0.62 0.13 90)" }}>
                    Direct Line
                  </p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", color: "white", marginTop: "0.2rem" }}>
                    Provided upon membership confirmation
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "oklch(0.97 0.02 200 / 0.18)" }}
                >
                  <Mail size={17} style={{ color: "oklch(0.85 0.03 200)" }} />
                </div>
                <div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(0.62 0.13 90)" }}>
                    Inquiries
                  </p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", color: "white", marginTop: "0.2rem" }}>
                    membership@direct2yourdoc.com
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "oklch(0.97 0.02 200 / 0.18)" }}
                >
                  <Shield size={17} style={{ color: "oklch(0.85 0.03 200)" }} />
                </div>
                <div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(0.62 0.13 90)" }}>
                    Confidentiality
                  </p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", color: "white", marginTop: "0.2rem" }}>
                    All inquiries are strictly private
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="fade-up" style={{ transitionDelay: "150ms" }}>
            <div
              className="rounded-sm p-8"
              style={{ backgroundColor: "oklch(0.28 0.15 165 / 0.5)", border: "1px solid oklch(0.97 0.02 200 / 0.2)" }}
            >
              {submitted ? (
                <div className="flex flex-col items-center text-center py-12 gap-5">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "oklch(0.97 0.02 200 / 0.15)" }}
                  >
                    <ArrowRight size={24} style={{ color: "white" }} />
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "2rem",
                      fontWeight: 600,
                      color: "white",
                    }}
                  >
                    Inquiry Received
                  </h3>
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.95rem",
                      color: "oklch(0.78 0.04 200)",
                      lineHeight: 1.7,
                      maxWidth: "320px",
                    }}
                  >
                    Our team will review your inquiry personally and respond 
                    within 24 hours to schedule a private consultation.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.8rem",
                      fontWeight: 600,
                      color: "white",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Start Your Membership
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cs-name" style={labelStyle}>Full Name</label>
                      <input
                        id="cs-name"
                        type="text"
                        required
                        placeholder="Your name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = "oklch(0.97 0.02 200 / 0.5)")}
                        onBlur={(e) => (e.target.style.borderColor = "oklch(0.97 0.02 200 / 0.2)")}
                      />
                    </div>
                    <div>
                      <label htmlFor="cs-phone" style={labelStyle}>Phone</label>
                      <input
                        id="cs-phone"
                        type="tel"
                        placeholder="Your phone"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = "oklch(0.97 0.02 200 / 0.5)")}
                        onBlur={(e) => (e.target.style.borderColor = "oklch(0.97 0.02 200 / 0.2)")}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="cs-email" style={labelStyle}>Email Address</label>
                    <input
                      id="cs-email"
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = "oklch(0.97 0.02 200 / 0.5)")}
                      onBlur={(e) => (e.target.style.borderColor = "oklch(0.97 0.02 200 / 0.2)")}
                    />
                  </div>

                  <div>
                    <label htmlFor="cs-message" style={labelStyle}>How Can We Help You?</label>
                    <textarea
                      id="cs-message"
                      rows={4}
                      placeholder="Briefly describe your situation or what you're looking for..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      style={{ ...inputStyle, resize: "none" }}
                      onFocus={(e) => (e.target.style.borderColor = "oklch(0.97 0.02 200 / 0.5)")}
                      onBlur={(e) => (e.target.style.borderColor = "oklch(0.97 0.02 200 / 0.2)")}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full justify-center mt-2"
                    style={{
                      backgroundColor: "white",
                      borderColor: "white",
                      color: "var(--forest-green-dark)",
                      fontWeight: 600,
                      padding: "1rem",
                    }}
                  >
                    Submit Inquiry <ArrowRight size={15} />
                  </button>

                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.72rem",
                      color: "oklch(0.63 0.04 200)",
                      textAlign: "center",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Your information is kept private and never shared.
                  </p>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

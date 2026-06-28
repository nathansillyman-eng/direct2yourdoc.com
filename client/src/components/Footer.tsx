/**
 * Footer — MedAssurance
 * Design: Dark charcoal background, minimal, editorial
 * Uses real MedAssurance logo. Slogan: "Your Doctor. Your Home. Now."
 */

const MEDASSURANCE_LOGO = "/manus-storage/logo-medassurance-only_813a4b1e.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: "var(--charcoal)", paddingTop: "4rem", paddingBottom: "3rem" }}>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10" style={{ borderBottom: "1px solid oklch(0.97 0.012 80 / 0.1)" }}>

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={MEDASSURANCE_LOGO}
                alt="MedAssurance"
                style={{ height: "56px", width: "auto", objectFit: "contain" }}
              />
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--aged-bronze)", marginBottom: "0.6rem" }}>
              Your Doctor. Your Home. Now.
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "oklch(0.55 0.005 80)", lineHeight: 1.7, maxWidth: "260px" }}>
              Private medical assurance for those who expect more. 24 hours a day, 7 days a week.
            </p>
          </div>

          {/* Links */}
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(0.5 0.005 80)", marginBottom: "1rem" }}>
              Navigation
            </p>
            <div className="flex flex-col gap-2">
              {[
                { label: "Services", href: "#services" },
                { label: "How It Works", href: "#how-it-works" },
                { label: "About Dr. Heslin", href: "#about" },
                { label: "Membership", href: "#membership" },
                { label: "Contact", href: "#contact" },
                { label: "Direct2YourDoc →", href: "/direct2yourdoc" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={link.href.startsWith("#") ? (e) => { e.preventDefault(); document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" }); } : undefined}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.88rem",
                    color: "oklch(0.62 0.005 80)",
                    transition: "color 200ms ease",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "oklch(0.62 0.005 80)")}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(0.5 0.005 80)", marginBottom: "1rem" }}>
              Contact
            </p>
            <div className="flex flex-col gap-3">
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--aged-bronze)" }}>
                  Membership Inquiries
                </p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "oklch(0.62 0.005 80)", marginTop: "0.2rem" }}>
                  membership@medassurance.com
                </p>
              </div>
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--aged-bronze)" }}>
                  Availability
                </p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "oklch(0.62 0.005 80)", marginTop: "0.2rem" }}>
                  24 / 7 · 365 days a year
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "oklch(0.42 0.005 80)" }}>
            © {currentYear} MedAssurance · Dr. Andrew Heslin, M.D.O. · All rights reserved.
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "oklch(0.38 0.005 80)", letterSpacing: "0.06em", textAlign: "center" }}>
            MedAssurance is a private concierge medical service and does not constitute insurance or a substitute for emergency care.
          </p>
        </div>
      </div>
    </footer>
  );
}

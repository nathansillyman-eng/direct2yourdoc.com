/**
 * Footer — Direct2YourDoc
 * Design: Dark charcoal background, minimal, editorial
 * Uses real Direct2YourDoc logo. Slogan: "Your Doctor. Your Home. Now."
 */

const D2YD_LOGO = "/brand/direct2yourdoc-logo-light.png";
const KEEPMORE_MARK = "/brand/keepmore-km.svg";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: "var(--charcoal)", paddingTop: "4rem", paddingBottom: "3rem" }}>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10" style={{ borderBottom: "1px solid oklch(0.97 0.02 200 / 0.18)" }}>

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={D2YD_LOGO}
                alt="Direct2YourDoc"
                style={{ height: "56px", width: "auto", objectFit: "contain" }}
              />
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--aged-bronze)", marginBottom: "0.6rem" }}>
              Your Doctor. Your Home. Now.
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "oklch(0.64 0.03 200)", lineHeight: 1.7, maxWidth: "260px" }}>
              Private medical care for those who expect more. 24 hours a day, 7 days a week.
            </p>
            {/* KeepMore co-brand endorsement */}
            <a
              href="https://thekeepmoreco.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 mt-5"
              style={{ textDecoration: "none" }}
            >
              <img src={KEEPMORE_MARK} alt="The KeepMore Company" style={{ height: "26px", width: "auto", objectFit: "contain", opacity: 0.9 }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(0.64 0.03 200)" }}>
                A venture of The KeepMore Company
              </span>
            </a>
          </div>

          {/* Links */}
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(0.63 0.03 200)", marginBottom: "1rem" }}>
              Navigation
            </p>
            <div className="flex flex-col gap-2">
              {[
                { label: "Services", href: "#services" },
                { label: "How It Works", href: "#how-it-works" },
                { label: "The Founder", href: "#founder" },
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
                    color: "oklch(0.62 0.03 200)",
                    transition: "color 200ms ease",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "oklch(0.62 0.03 200)")}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(0.63 0.03 200)", marginBottom: "1rem" }}>
              Contact
            </p>
            <div className="flex flex-col gap-3">
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--aged-bronze)" }}>
                  Membership Inquiries
                </p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "oklch(0.62 0.03 200)", marginTop: "0.2rem" }}>
                  <a href="mailto:nate@thekeepmoreco.com" style={{ color: "inherit", textDecoration: "none" }}>
                    membership@direct2yourdoc.com
                  </a>
                </p>
              </div>
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--aged-bronze)" }}>
                  Direct Line
                </p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "oklch(0.62 0.03 200)", marginTop: "0.2rem" }}>
                  <a href="tel:+14804351576" style={{ color: "inherit", textDecoration: "none" }}>(480) 435-1576</a>
                </p>
              </div>
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--aged-bronze)" }}>
                  Availability
                </p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "oklch(0.62 0.03 200)", marginTop: "0.2rem" }}>
                  24 / 7 · 365 days a year
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Legal links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-8">
          {[
            { label: "Privacy Policy", href: "/privacy-policy" },
            { label: "Terms of Service", href: "/terms-of-service" },
            { label: "Accessibility", href: "/accessibility" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.78rem",
                color: "oklch(0.64 0.03 200)",
                textDecoration: "none",
                letterSpacing: "0.02em",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "oklch(0.64 0.03 200)")}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6">
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "oklch(0.63 0.03 200)" }}>
            © {currentYear} The KeepMore Company LLC · Direct2YourDoc · All rights reserved.
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "oklch(0.63 0.03 200)", letterSpacing: "0.06em", textAlign: "center" }}>
            Direct2YourDoc is a private concierge medical service and does not constitute insurance or a substitute for emergency care.
          </p>
        </div>
        <div className="pt-3">
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem", color: "oklch(0.63 0.03 200)", textAlign: "center", lineHeight: 1.6 }}>
            Direct2YourDoc is committed to digital accessibility for all users. If you use assistive technology and
            encounter an issue on this site, contact us at{" "}
            <a href="mailto:nate@thekeepmoreco.com" style={{ color: "oklch(0.64 0.03 200)" }}>
              accessibility@direct2yourdoc.com
            </a>{" "}
            — see our{" "}
            <a href="/accessibility" style={{ color: "oklch(0.64 0.03 200)" }}>
              Accessibility Statement
            </a>.
          </p>
        </div>
      </div>
    </footer>
  );
}

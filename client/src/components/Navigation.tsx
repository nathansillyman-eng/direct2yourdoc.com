/**
 * Navigation — MedAssurance
 * Design: Transparent over dark hero, transitions to deep charcoal on scroll.
 * Uses the real MedAssurance logo (house+cross mark + wordmark).
 * Slogan: "Your Doctor. Your Home. Now."
 */
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

// MedAssurance logo — the house+cross mark with "MedAssurance" wordmark (bottom half of logo-both.png)
const MEDASSURANCE_LOGO = "/manus-storage/logo-medassurance-only_813a4b1e.png";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About", href: "#about" },
  { label: "Membership", href: "#membership" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-400"
        style={{
          backgroundColor: scrolled ? "oklch(0.13 0.010 60 / 0.96)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid oklch(0.97 0.012 80 / 0.08)" : "1px solid transparent",
        }}
      >
        <div className="container">
          <div className="flex items-center justify-between h-20">
            {/* Logo — real MedAssurance logo image, cropped to show just the mark+wordmark */}
            <a
              href="#"
              className="flex items-center gap-0 group"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            >
              <img
                src={MEDASSURANCE_LOGO}
                alt="MedAssurance — Your Doctor. Your Home. Now."
                style={{
                  height: "52px",
                  width: "auto",
                  objectFit: "contain",
                  transition: "transform 200ms ease",
                }}
                className="group-hover:scale-105"
              />
            </a>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                  className="relative group transition-colors duration-200"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "oklch(0.75 0.005 80)",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "oklch(0.75 0.005 80)")}
                >
                  {link.label}
                  <span
                    className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-250"
                    style={{ backgroundColor: "var(--aged-bronze)" }}
                  />
                </a>
              ))}
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); handleNavClick("#contact"); }}
                className="btn-primary"
                style={{ padding: "0.6rem 1.4rem", fontSize: "0.72rem" }}
              >
                Secure Membership
              </a>
            </nav>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 rounded transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              style={{ color: "white" }}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className="fixed inset-0 z-40 md:hidden transition-all duration-300"
        style={{
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? "auto" : "none",
          backgroundColor: "oklch(0.11 0.010 60 / 0.98)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 pt-20">
          <img
            src={MEDASSURANCE_LOGO}
            alt="MedAssurance"
            style={{ height: "64px", width: "auto", objectFit: "contain" }}
          />
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "2.4rem",
                fontWeight: 500,
                color: "white",
                textDecoration: "none",
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); handleNavClick("#contact"); }}
            className="btn-primary mt-4"
          >
            Secure Membership
          </a>
        </div>
      </div>
    </>
  );
}

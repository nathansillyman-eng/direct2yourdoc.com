/**
 * Navigation — Direct2YourDoc
 * Design: Transparent over dark hero, transitions to deep charcoal on scroll.
 * Uses the real Direct2YourDoc logo (house+cross mark + wordmark).
 * Slogan: "Your Doctor. Your Home. Now."
 */
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

// Direct2YourDoc logo — light (cream+gold) variants for dark surfaces
const D2YD_WORDMARK = "/brand/direct2yourdoc-wordmark-light.png"; // legible nav wordmark
const D2YD_CREST = "/brand/direct2yourdoc-logo-light.png";        // full crest (mobile menu)
// KeepMore co-brand mark (gold KM) — Direct2YourDoc is a KeepMore Company venture
const KEEPMORE_MARK = "/brand/keepmore-km.svg";

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
          backgroundColor: scrolled ? "oklch(0.13 0.05 200 / 0.96)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid oklch(0.97 0.02 200 / 0.08)" : "1px solid transparent",
        }}
      >
        <div className="container">
          <div className="flex items-center justify-between h-20">
            {/* Logo — Direct2YourDoc, co-branded as a KeepMore Company venture */}
            <a
              href="#"
              className="flex items-center gap-3 group"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            >
              <span
                className="logo-shimmer transition-transform duration-200 group-hover:scale-105"
                style={{ ["--shimmer-src" as string]: `url(${D2YD_WORDMARK})` } as React.CSSProperties}
              >
                <img
                  src={D2YD_WORDMARK}
                  alt="Direct2YourDoc — Your Doctor. Your Home. Now."
                  style={{ height: "34px", width: "auto", objectFit: "contain", display: "block" }}
                />
              </span>
              <span
                className="hidden sm:flex items-center gap-2"
                style={{ borderLeft: "1px solid oklch(0.97 0.02 200 / 0.18)", paddingLeft: "0.75rem" }}
                title="A venture of The KeepMore Company LLC"
              >
                <img src={KEEPMORE_MARK} alt="The KeepMore Company" style={{ height: "22px", width: "auto", objectFit: "contain", opacity: 0.9 }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.58rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(0.6 0.03 200)", lineHeight: 1.3 }}>
                  A KeepMore<br />Company
                </span>
              </span>
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
                    color: "oklch(0.75 0.03 200)",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "oklch(0.75 0.03 200)")}
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
                Become a Member
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
          backgroundColor: "oklch(0.11 0.05 200 / 0.98)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 pt-20">
          <img
            src={D2YD_CREST}
            alt="Direct2YourDoc"
            style={{ height: "104px", width: "auto", objectFit: "contain", display: "block" }}
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
            Become a Member
          </a>
        </div>
      </div>
    </>
  );
}

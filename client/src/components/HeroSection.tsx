/**
 * HeroSection — Direct2YourDoc
 * Design: DARK CINEMATIC — deep charcoal/near-black background, dramatic portrait,
 * white headline with forest green italic, bold visual tension.
 * Keeps all structural improvements: asymmetric 11-col grid, editorial label, availability bar.
 */
import { useEffect, useRef } from "react";
import { ArrowRight, Phone } from "lucide-react";

const HERO_OFFICE = "/brand/founder-nate-welcoming.png";
const KEEPMORE_MARK = "/brand/keepmore-km.svg";

export default function HeroSection() {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (textRef.current) {
        textRef.current.querySelectorAll(".hero-fade").forEach((el, i) => {
          setTimeout(() => {
            (el as HTMLElement).style.opacity = "1";
            (el as HTMLElement).style.transform = "translateY(0)";
          }, i * 130);
        });
      }
    }, 80);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-stretch overflow-hidden"
      style={{ background: "radial-gradient(115% 85% at 80% 15%, oklch(0.22 0.09 200) 0%, oklch(0.15 0.05 205) 45%, oklch(0.10 0.05 200) 75%)" }}
    >
      {/* Subtle grain texture overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          opacity: 0.4,
        }}
      />

      <div className="container relative z-10 pt-24 pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-11 min-h-screen items-center">

          {/* Left: Text content — 6/11 */}
          <div
            className="lg:col-span-6 flex flex-col justify-center py-20 lg:pr-12"
            ref={textRef}
          >
            {/* Brand mark + label */}
            <div
              className="hero-fade flex items-center gap-3 mb-10"
              style={{
                opacity: 0,
                transform: "translateY(20px)",
                transition: "opacity 500ms cubic-bezier(0.23,1,0.32,1), transform 500ms cubic-bezier(0.23,1,0.32,1)",
              }}
            >
              <img
                src={KEEPMORE_MARK}
                alt="A venture of The KeepMore Company"
                title="A venture of The KeepMore Company LLC"
                style={{ height: "30px", width: "auto", objectFit: "contain" }}
              />
              <div
                style={{
                  width: "1px",
                  height: "2.5rem",
                  backgroundColor: "oklch(0.97 0.02 200 / 0.2)",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--aged-bronze)",
                }}
              >
                Private concierge medicine
              </span>
            </div>

            <h1
              className="hero-fade"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(3.2rem, 6vw, 5.5rem)",
                fontWeight: 600,
                lineHeight: 1.06,
                color: "white",
                letterSpacing: "-0.02em",
                opacity: 0,
                transform: "translateY(20px)",
                transition: "opacity 500ms cubic-bezier(0.23,1,0.32,1), transform 500ms cubic-bezier(0.23,1,0.32,1)",
                maxWidth: "680px",
              }}
            >
              Put on the headset.
              <br />
              <em style={{ color: "var(--forest-green-light)", textShadow: "0 0 32px oklch(0.82 0.17 165 / 0.45)" }}>You're in the office.</em>
            </h1>

            <p
              className="hero-fade mt-7"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "1.05rem",
                lineHeight: 1.78,
                color: "oklch(0.72 0.03 200)",
                maxWidth: "500px",
                opacity: 0,
                transform: "translateY(20px)",
                transition: "opacity 500ms cubic-bezier(0.23,1,0.32,1), transform 500ms cubic-bezier(0.23,1,0.32,1)",
              }}
            >
              One headset, one app — and you're sitting with your doctor. No waiting room,
              no portal login, no hold music. Direct2YourDoc brings your doctor to you the
              moment you need them: consultations, same-day prescriptions, second opinions,
              and a steady hand through any hospital stay. The doctor you'd call at
              midnight? Now you actually can.
            </p>

            <div
              className="hero-fade flex flex-wrap gap-4 mt-10"
              style={{
                opacity: 0,
                transform: "translateY(20px)",
                transition: "opacity 500ms cubic-bezier(0.23,1,0.32,1), transform 500ms cubic-bezier(0.23,1,0.32,1)",
              }}
            >
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); }}
                className="btn-primary"
                style={{ fontSize: "0.82rem", padding: "1rem 2.2rem" }}
              >
                Become a Member <ArrowRight size={15} />
              </a>
              <a
                href="#how-it-works"
                onClick={(e) => { e.preventDefault(); document.querySelector("#how-it-works")?.scrollIntoView({ behavior: "smooth" }); }}
                className="btn-ghost"
                style={{ fontSize: "0.82rem", padding: "1rem 2.2rem" }}
              >
                How It Works
              </a>
            </div>

            {/* Availability badge */}
            <div
              className="hero-fade flex items-center gap-5 mt-10 pt-10"
              style={{
                opacity: 0,
                transform: "translateY(20px)",
                transition: "opacity 500ms cubic-bezier(0.23,1,0.32,1), transform 500ms cubic-bezier(0.23,1,0.32,1)",
                borderTop: "1px solid oklch(0.97 0.02 200 / 0.2)",
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: "oklch(0.55 0.18 145)",
                    boxShadow: "0 0 0 4px oklch(0.55 0.18 145 / 0.25)",
                  }}
                />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "oklch(0.62 0.03 200)", letterSpacing: "0.06em" }}>
                  Available 24 / 7 · 365 days a year
                </span>
              </div>
              <span style={{ color: "oklch(0.3 0.03 200)" }}>·</span>
              <div className="flex items-center gap-2" style={{ color: "oklch(0.55 0.03 200)", fontSize: "0.78rem", fontFamily: "'DM Sans', sans-serif" }}>
                <Phone size={13} />
                48-hour activation
              </div>
            </div>
          </div>

          {/* Mobile-only office image (desktop uses the full-height panel at right) */}
          <div className="lg:hidden -mx-6 sm:mx-0 mt-2">
            <div className="relative">
              <img
                src={HERO_OFFICE}
                alt="Nate Sillyman, founder, welcoming you into Direct2YourDoc"
                className="w-full object-cover sm:rounded-sm"
                style={{ height: "300px", objectPosition: "25% center", filter: "brightness(0.82) saturate(0.9)" }}
              />
              <div
                className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
                style={{ background: "linear-gradient(to bottom, transparent, oklch(0.10 0.05 200))" }}
              />
            </div>
          </div>

          {/* Right: office panel — 5/11, full-height (desktop) */}
          <div
            className="lg:col-span-5 hidden lg:block relative self-stretch"
            style={{ minHeight: "100vh" }}
          >
            {/* Left gradient fade into dark bg */}
            <div
              className="absolute inset-y-0 left-0 w-32 z-10 pointer-events-none"
              style={{ background: "linear-gradient(to right, oklch(0.11 0.05 200), transparent)" }}
            />
            {/* Bottom gradient */}
            <div
              className="absolute inset-x-0 bottom-0 h-48 z-10 pointer-events-none"
              style={{ background: "linear-gradient(to bottom, transparent, oklch(0.11 0.05 200))" }}
            />
            {/* Top gradient */}
            <div
              className="absolute inset-x-0 top-0 h-32 z-10 pointer-events-none"
              style={{ background: "linear-gradient(to bottom, oklch(0.11 0.05 200), transparent)" }}
            />
            <img
              src={HERO_OFFICE}
              alt="Nate Sillyman, founder, welcoming you into Direct2YourDoc"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: "25% center", filter: "brightness(0.78) saturate(0.9) contrast(1.05)" }}
            />
            {/* Caption card */}
            <div
              className="absolute bottom-14 left-8 z-20"
              style={{
                borderLeft: "3px solid var(--aged-bronze)",
                paddingLeft: "1rem",
              }}
            >
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.35rem", fontWeight: 600, color: "white", lineHeight: 1.2 }}>
                Your office, on demand
              </p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--aged-bronze)", marginTop: "0.3rem" }}>
                Private concierge medicine
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

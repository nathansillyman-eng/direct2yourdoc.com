/**
 * HeroSection — Direct2YourDoc
 * Design: DARK CINEMATIC — deep charcoal/near-black background, dramatic portrait,
 * white headline with forest green italic, bold visual tension.
 * Keeps all structural improvements: asymmetric 11-col grid, editorial label, availability bar.
 */
import { useEffect, useRef } from "react";
import { ArrowRight, Phone } from "lucide-react";

// Hero photo: the warm red-oak greeting scene — the host welcoming a family, the
// koi-pond waterfall giving way to the KM mark. (Nate-approved hero, 2026-06-30.)
// Served from /brand/ (a plain static path) — NOT /manus-storage/, which the dev
// storage-proxy plugin intercepts and which can resolve to remote storage in prod.
const HERO_GREETING = "/brand/d2yd-hero-greeting.jpg"; // desktop, 16:9
const HERO_GREETING_MOBILE = "/brand/d2yd-hero-greeting-mobile.jpg"; // phone, 9:16 portrait
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
      className="relative lg:flex lg:items-stretch overflow-hidden"
      style={{ background: "#160d08" }}
    >
      {/* DESKTOP: full-bleed greeting photo + scrims (kept light so the warm
          brightness survives — text shadows carry legibility). Hidden on mobile. */}
      <div className="hidden lg:block">
        <img
          src={HERO_GREETING}
          alt="Direct2YourDoc — the host welcoming a family in the private concierge greeting room"
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ objectPosition: "64% center" }}
        />
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, rgba(18,10,6,0) 38%, rgba(18,10,6,0.18) 56%, rgba(18,10,6,0.48) 76%, rgba(18,10,6,0.62) 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-40 z-0 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(18,10,6,0.6))" }}
        />
        <div
          className="absolute inset-x-0 top-0 h-24 z-0 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(18,10,6,0.5), transparent)" }}
        />
      </div>

      {/* MOBILE: portrait greeting photo as a top band; text stacks below on the
          dark background where it's fully legible (no text-over-photo on phones). */}
      <div className="lg:hidden relative">
        <img
          src={HERO_GREETING_MOBILE}
          alt="Direct2YourDoc — the host welcoming a family in the private concierge greeting room"
          className="w-full object-cover"
          style={{ height: "58vh", objectPosition: "center 26%" }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, #160d08)" }}
        />
        <div
          className="absolute inset-x-0 top-0 h-20 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(18,10,6,0.55), transparent)" }}
        />
      </div>

      <div className="container relative z-10 pt-8 pb-14 lg:pt-24 lg:pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-11 lg:min-h-screen items-center">

          {/* Left: Text content — 6/11 */}
          <div
            className="lg:col-start-7 lg:col-span-5 flex flex-col justify-center py-6 lg:py-20 lg:pl-10"
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
                textShadow: "0 2px 26px rgba(10,6,3,0.75)",
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
                color: "oklch(0.86 0.02 200)",
                maxWidth: "500px",
                opacity: 0,
                transform: "translateY(20px)",
                transition: "opacity 500ms cubic-bezier(0.23,1,0.32,1), transform 500ms cubic-bezier(0.23,1,0.32,1)",
                textShadow: "0 1px 14px rgba(10,6,3,0.85)",
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

          {/* Caption card — anchored bottom-left, under the greeting */}
          <div
            className="hidden lg:block absolute bottom-16 left-10 z-20"
            style={{ borderLeft: "3px solid var(--aged-bronze)", paddingLeft: "1rem" }}
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
    </section>
  );
}

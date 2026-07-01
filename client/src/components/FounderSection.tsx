/**
 * FounderSection — Direct2YourDoc
 * The founder's story. Direct2YourDoc is Nate Sillyman's idea, his build, his company
 * (a venture of The KeepMore Company). The physicians are staff who deliver the care —
 * they are not founders, owners, or originators.
 */
import { useEffect, useRef } from "react";
import { Lightbulb, Zap, Compass } from "lucide-react";

const FOUNDER_IMG = "/brand/founder-nate.png";

const para: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "1.05rem",
  color: "oklch(0.66 0.03 200)",
  lineHeight: 1.8,
};

const principles = [
  { icon: Lightbulb, text: "A decade-plus inside brokerage & advisory firms — he's seen exactly where systems fail people" },
  { icon: Zap, text: "Self-taught builder — an outside team's eight weeks, shipped in a single day" },
  { icon: Compass, text: "One mission — remove the wall between you and the doctor who can help" },
];

export default function FounderSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".fade-up").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 110);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="founder"
      ref={ref}
      style={{ backgroundColor: "oklch(0.15 0.05 200)", paddingTop: "8rem", paddingBottom: "8rem" }}
    >
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-12 lg:gap-20 items-center">

          {/* Left: founder portrait — 5/11 */}
          <div className="lg:col-span-5 fade-up">
            <div className="relative">
              <div
                className="absolute -top-4 -left-4 w-full h-full rounded-sm"
                style={{ border: "2px solid var(--forest-green)", opacity: 0.45 }}
              />
              <img
                src={FOUNDER_IMG}
                alt="Nate Sillyman, founder of Direct2YourDoc"
                className="relative rounded-sm w-full object-cover"
                style={{ height: "560px", objectPosition: "center top", filter: "brightness(0.98)" }}
              />
              {/* Founder badge */}
              <div
                className="absolute -bottom-6 -right-6 px-6 py-5 rounded-sm shadow-xl"
                style={{ backgroundColor: "var(--forest-green)", maxWidth: "240px" }}
              >
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.64rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "oklch(0.86 0.04 200)" }}>
                  Founder
                </p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.7rem", fontWeight: 600, color: "white", lineHeight: 1.05, marginTop: "0.25rem" }}>
                  Nate Sillyman
                </p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "oklch(0.86 0.04 200)", marginTop: "0.25rem" }}>
                  The KeepMore Company
                </p>
              </div>
            </div>
          </div>

          {/* Right: text — 6/11 */}
          <div className="lg:col-span-6 lg:pl-4">
            <div className="fade-up">
              <span className="section-label mb-6 block" style={{ color: "var(--aged-bronze)" }}>The Founder</span>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(2.4rem, 4vw, 3.4rem)",
                  fontWeight: 600,
                  color: "white",
                  lineHeight: 1.1,
                }}
              >
                He watched the wall go up for a decade.<br />
                <em style={{ color: "var(--forest-green-light)" }}>Then he took it down.</em>
              </h2>
            </div>

            <div className="fade-up mt-6">
              <p style={para}>
                <strong style={{ color: "oklch(0.82 0.03 200)", fontWeight: 600 }}>Nate Sillyman</strong>{" "}
                spent more than a decade in and around the country's brokerages and advisory firms — a gold
                desk, an options desk, a fraud hotline, the advisory floor. Everywhere he looked, the same
                thing: capable people kept one phone tree away from the experts who could actually help them.
                He decided that wall was worth tearing down.
              </p>
              <p className="mt-4" style={para}>
                With no formal training in code, he taught himself to build — at a pace that turns an outside
                team's eight weeks into a single day.{" "}
                <em style={{ color: "var(--forest-green)" }}>Direct2YourDoc is what he built with it</em>:
                a real doctor on call, from home, the moment you need one. No waiting room, no portal login,
                no hold music — just the person who can help, one tap away.
              </p>
              <p className="mt-4" style={para}>
                He isn't your physician. He's the one who makes the introduction — the host who vouches you
                into a network of doctors who actually pick up. The idea, the build, and the company are his;
                the care is delivered by real physicians. It's the same conviction behind everything he makes
                at The KeepMore Company: close the distance between people and what they need.
              </p>
            </div>

            <div className="fade-up mt-8">
              <div className="pull-quote" style={{ borderLeftColor: "var(--forest-green)" }}>
                "I spent years watching good people get stuck one phone tree away from help. So I taught
                myself to build the thing that takes the wall down — and I haven't stopped since."
                <footer
                  className="mt-3"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.78rem",
                    fontStyle: "normal",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--aged-bronze)",
                  }}
                >
                  — Nate Sillyman, Founder · The KeepMore Company
                </footer>
              </div>
            </div>

            <div className="fade-up mt-8 flex flex-col gap-3">
              {principles.map((p, i) => {
                const Icon = p.icon;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "oklch(0.38 0.15 165 / 0.25)" }}
                    >
                      <Icon size={15} style={{ color: "var(--forest-green)" }} />
                    </div>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "oklch(0.68 0.03 200)" }}>
                      {p.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

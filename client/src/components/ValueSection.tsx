/**
 * ValueSection — Direct2YourDoc
 * Design: Warm linen dark bg, editorial asymmetric layout, scenario cards with varied hierarchy
 * "Best friend who's a doctor" narrative
 */
import { useEffect, useRef } from "react";

const scenarios = [
  {
    time: "2:00 AM",
    situation: "Your chest feels tight. You're not sure if it's anxiety or something more.",
    response: "Your doctor answers. They listen. They tell you exactly what to do next.",
  },
  {
    time: "Day of surgery",
    situation: "Your surgeon recommends a procedure. You're not sure it's necessary.",
    response: "Your doctor reviews your case and gives you an honest, unfiltered opinion.",
  },
  {
    time: "Traveling abroad",
    situation: "You need a prescription refilled and your pharmacy is 5,000 miles away.",
    response: "Your doctor coordinates with a local pharmacy. Done.",
  },
  {
    time: "Hospital admission",
    situation: "You're admitted and the care team is busy. Things feel uncertain.",
    response: "Your doctor speaks with your team, monitors your progress, and keeps you informed.",
  },
];

export default function ValueSection() {
  const ref = useRef<HTMLDivElement>(null);

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

  return (
    <section
      ref={ref}
      style={{ backgroundColor: "oklch(0.12 0.05 200)", paddingTop: "8rem", paddingBottom: "8rem" }}
    >
      <div className="container">

        {/* Asymmetric header: large quote left, intro right */}
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-12 mb-20">
          <div className="lg:col-span-7 fade-up">
            <span className="section-label mb-6 block" style={{ color: "var(--aged-bronze)" }}>The Direct2YourDoc Difference</span>
            <blockquote
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2rem, 3.8vw, 3rem)",
                fontWeight: 500,
                fontStyle: "italic",
color: "white",
          lineHeight: 1.25,
          borderLeft: "4px solid var(--forest-green)",
                paddingLeft: "2rem",
              }}
            >
              "Everyone deserves a doctor who knows them by name, picks up the phone,
              and tells them the truth. Direct2YourDoc makes that possible."
            </blockquote>
            <p
              className="mt-5"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.8rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--aged-bronze)",
                paddingLeft: "2rem",
              }}
            >
              — Dr. Andrew Heslin, M.D.O.
            </p>
          </div>
          <div className="lg:col-span-4 fade-up flex items-end" style={{ transitionDelay: "100ms" }}>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "1rem",
                color: "oklch(0.65 0.03 200)",
            lineHeight: 1.8,
          }}
        >
          Think of Direct2YourDoc as the medical relationship you always wished you had —
              the one where your doctor actually knows you, and is genuinely available
              when something matters.
            </p>
          </div>
        </div>

        {/* Scenario grid — editorial, not uniform cards */}
        <div className="fade-up mb-6">
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.7rem",
              fontWeight: 500,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "oklch(0.63 0.03 200)",
          }}
        >
          Real situations. Real responses.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ backgroundColor: "oklch(0.25 0.05 200)" }}>
          {scenarios.map((scenario, i) => (
            <div
              key={i}
              className="fade-up group transition-colors duration-300 p-8"
              style={{
                backgroundColor: i % 2 === 0 ? "oklch(0.16 0.05 200)" : "oklch(0.19 0.05 200)",
                transitionDelay: `${i * 80}ms`,
              }}
            >
              <div
                className="inline-flex items-center gap-2 mb-5"
              >
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: "var(--forest-green)" }}
                />
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--forest-green)",
                  }}
                >
                  {scenario.time}
                </span>
              </div>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.3rem",
                  fontWeight: 500,
color: "white",
                lineHeight: 1.4,
                marginBottom: "1.25rem",
                }}
              >
                {scenario.situation}
              </p>
              <div
                className="pt-5"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.92rem",
color: "oklch(0.65 0.03 200)",
                lineHeight: 1.7,
                fontStyle: "italic",
                  }}
                >
                  {scenario.response}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

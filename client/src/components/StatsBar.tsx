/**
 * StatsBar — Direct2YourDoc
 * Design: Deep charcoal background — bridges dark hero into lighter sections.
 * Forest green numerals, aged bronze units, muted white labels.
 */
import { useEffect, useRef } from "react";

const stats = [
  { number: "24", unit: "hrs / day", label: "Always available" },
  { number: "48", unit: "hr activation", label: "From inquiry to on-call" },
  { number: "1×1", unit: "only", label: "Fully dedicated to you" },
  { number: "∞", unit: "consultations", label: "No visit limits" },
];

export default function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".fade-up").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 80);
            });
          }
        });
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{
        backgroundColor: "oklch(0.15 0.05 200)",
        borderTop: "1px solid oklch(0.97 0.02 200 / 0.07)",
        borderBottom: "1px solid oklch(0.97 0.02 200 / 0.07)",
      }}
    >
      <div className="container">
        <div
          className="grid grid-cols-2 md:grid-cols-4"
          style={{ borderLeft: "1px solid oklch(0.97 0.02 200 / 0.07)" }}
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="fade-up flex flex-col items-center text-center py-12 px-6"
              style={{
                transitionDelay: `${i * 80}ms`,
                borderRight: "1px solid oklch(0.97 0.02 200 / 0.07)",
              }}
            >
              <div className="flex items-end gap-2 leading-none mb-2">
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(3rem, 5vw, 4.5rem)",
                    fontWeight: 600,
                    lineHeight: 1,
                    color: "var(--forest-green-light)",
                  }}
                >
                  {stat.number}
                </span>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.72rem",
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--aged-bronze)",
                    paddingBottom: "0.5rem",
                  }}
                >
                  {stat.unit}
                </span>
              </div>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.72rem",
                  color: "oklch(0.63 0.03 200)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

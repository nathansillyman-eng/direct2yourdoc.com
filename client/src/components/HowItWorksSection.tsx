/**
 * HowItWorksSection — Direct2YourDoc
 * Design: Forest green background, editorial numbered steps, warm typography
 * Asymmetric header, varied step hierarchy
 */
import { useEffect, useRef } from "react";

const steps = [
  {
    number: "01",
    title: "Become a Member",
    description:
      "Reach out and tell us what's going on. One short conversation gets your membership set up — no application to be approved for, no waiting to find out if you're 'in.' Just care, started.",
  },
  {
    number: "02",
    title: "48-Hour Activation",
    description:
      "Within 48 hours, your doctor is on call for you. You get a direct line — your own number, straight to your doctor. No phone trees, no answering services, no gatekeepers.",
  },
  {
    number: "03",
    title: "Call Anytime",
    description:
      "Day or night, weekday or holiday — call your doctor directly. They answer, listen, and advise. Whether it is a prescription, a second opinion, or guidance through a hospital stay, they are there.",
  },
  {
    number: "04",
    title: "Care Delivered",
    description:
      "Prescriptions are sent to your pharmacy same day. Referrals are coordinated. Hospital teams are briefed. You receive the care you need, with someone ensuring nothing falls through the cracks.",
  },
];

export default function HowItWorksSection() {
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
      { threshold: 0.08 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={ref}
      style={{
        backgroundColor: "oklch(0.16 0.05 200)",
        paddingTop: "8rem",
        paddingBottom: "8rem",
      }}
    >
      <div className="container">

        {/* Full-width header */}
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-10 mb-16">
          <div className="lg:col-span-5 fade-up">
            <span
              className="section-label mb-6 block"
              style={{ color: "oklch(0.62 0.13 90)" }}
            >
              How It Works
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
              From inquiry to on-call in 48 hours.
            </h2>
          </div>
          <div className="lg:col-span-5 lg:col-start-7 fade-up flex items-end" style={{ transitionDelay: "80ms" }}>
            <div>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "1rem",
                  color: "oklch(0.72 0.04 200)",
                  lineHeight: 1.78,
                }}
              >
                Direct2YourDoc is designed to be simple. No complex enrollment,
                no bureaucracy. Just a direct relationship with your physician.
              </p>
              <div
                className="pull-quote mt-8"
                style={{ borderLeftColor: "var(--aged-bronze)", color: "oklch(0.78 0.03 200)" }}
              >
                "Imagine having a best friend who is a doctor — and who picks up
                every time you call."
              </div>
            </div>
          </div>
        </div>

        {/* Steps — editorial list */}
        <div className="flex flex-col">
          {steps.map((step, i) => (
            <div
              key={i}
              className="fade-up grid grid-cols-1 lg:grid-cols-11 gap-6 group"
              style={{
                transitionDelay: `${i * 110}ms`,
                paddingTop: "2.5rem",
                paddingBottom: "2.5rem",
                borderTop: "1px solid oklch(0.97 0.02 200 / 0.18)",
              }}
            >
              {/* Oversized numeral */}
              <div className="lg:col-span-2">
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(3.5rem, 6vw, 5rem)",
                    fontWeight: 600,
                    lineHeight: 1,
                    color: "oklch(0.48 0.15 165 / 0.35)",
                    transition: "color 300ms ease",
                  }}
                >
                  {step.number}
                </span>
              </div>

              {/* Title */}
              <div className="lg:col-span-3 flex items-start pt-2">
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.65rem",
                    fontWeight: 600,
                    color: "white",
                    lineHeight: 1.2,
                  }}
                >
                  {step.title}
                </h3>
              </div>

              {/* Description */}
              <div className="lg:col-span-5 lg:col-start-7 flex items-start pt-2">
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.95rem",
                    color: "oklch(0.72 0.03 200)",
                    lineHeight: 1.78,
                  }}
                >
                  {step.description}
                </p>
              </div>
            </div>
          ))}
          <div style={{ borderTop: "1px solid oklch(0.97 0.02 200 / 0.18)" }} />
        </div>

      </div>
    </section>
  );
}

/**
 * MembershipSection — Direct2YourDoc
 * Design: Warm linen dark background, single premium membership card
 * Single membership; access-first, not gatekept
 */
import { useEffect, useRef } from "react";
import {
  Check,
  ArrowRight,
  Headset,
  Sparkles,
  Activity,
  HeartPulse,
  Lock,
} from "lucide-react";

const included = [
  "Unlimited 1-on-1 consultations with your doctor",
  "Same-day prescription writing to your pharmacy",
  "Expert second opinions on diagnoses and procedures",
  "Active hospital advocacy during any admission",
  "Direct private line — no answering service",
  "24 hours a day, 7 days a week, 365 days a year",
  "Medical record review and specialist coordination",
  "Priority response within 30 minutes",
];

const notIncluded = [
  "Replaces your primary care physician",
  "Covers insurance premiums or claims",
  "Includes in-person physical examinations",
];

const kit = [
  { icon: Headset, name: "Meta Quest 3", note: "Step into your private room" },
  { icon: Sparkles, name: "Silicone face cover", note: "Cool, wipeable — replaces the stock cloth" },
  { icon: Activity, name: "Blood-pressure monitor", note: "Readings your doctor can see" },
  { icon: HeartPulse, name: "Heart-rate monitor", note: "The vitals that matter, tracked" },
  { icon: Lock, name: "Secure document upload", note: "Send records straight to your file", soon: true },
];

export default function MembershipSection() {
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
      id="membership"
      ref={ref}
      style={{ backgroundColor: "oklch(0.13 0.05 200)", paddingTop: "8rem", paddingBottom: "8rem" }}
      data-dark="true"
    >
      <div className="container">

        {/* Header */}
        <div className="fade-up text-left max-w-2xl mb-16">
          <span className="section-label mb-4 block">Membership</span>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.5rem, 4.5vw, 3.8rem)",
              fontWeight: 600,
              color: "white",
              lineHeight: 1.1,
            }}
          >
            One membership.<br />
            <em style={{ color: "var(--forest-green)" }}>Complete assurance.</em>
          </h2>
          <p
            className="mt-5"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "1.05rem",
color: "oklch(0.65 0.03 200)",
          lineHeight: 1.75,
            }}
          >
            Direct2YourDoc is a simple annual membership. It keeps your care unhurried and
            personal — your doctor has the time to actually know you and be there when you
            need them. Pricing is straightforward and covered in your first conversation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Main membership card — 3/5 */}
          <div className="lg:col-span-3 fade-up">
            <div
              className="h-full rounded-sm overflow-hidden"
              style={{ border: "1px solid oklch(0.97 0.02 200 / 0.18)", backgroundColor: "oklch(0.205 0.045 200)" }}
            >
              {/* Card header */}
              <div
                className="px-8 py-7"
                style={{ backgroundColor: "var(--forest-green)", borderBottom: "none" }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.7rem",
                        fontWeight: 500,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: "oklch(0.75 0.04 200)",
                      }}
                    >
                      Annual Membership
                    </p>
                    <h3
                      className="mt-1"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "2.2rem",
                        fontWeight: 600,
                        color: "white",
                        lineHeight: 1.1,
                      }}
                    >
                      Direct2YourDoc Membership
                    </h3>
                  </div>
                  <div
                    className="text-right"
                    style={{
                      borderLeft: "1px solid oklch(0.97 0.02 200 / 0.2)",
                      paddingLeft: "1.5rem",
                    }}
                  >
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(0.75 0.04 200)" }}>
                      Pricing by
                    </p>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 600, color: "white", marginTop: "0.2rem" }}>
                      Consultation
                    </p>
                  </div>
                </div>
              </div>

              {/* Included items */}
              <div className="px-8 py-8">
                <p
                  className="mb-5"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.72rem",
                    fontWeight: 500,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--aged-bronze)",
                  }}
                >
                  What's Included
                </p>
                <div className="flex flex-col gap-3">
                  {included.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: "oklch(0.38 0.15 165 / 0.12)" }}
                      >
                        <Check size={11} style={{ color: "var(--forest-green)" }} />
                      </div>
                      <span
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "0.92rem",
                          color: "oklch(0.72 0.03 200)",
                          lineHeight: 1.5,
                        }}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right column — 2/5 */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Not included card */}
            <div
              className="fade-up rounded-sm p-7"
              style={{
border: "1px solid oklch(0.97 0.02 200 / 0.18)",
              backgroundColor: "oklch(0.205 0.045 200)",
                transitionDelay: "100ms",
              }}
            >
              <p
                className="mb-4"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.72rem",
                  fontWeight: 500,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "oklch(0.52 0.03 200)",
              }}>
                Not Included
              </p>
              <div className="flex flex-col gap-3">
                {notIncluded.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ color: "var(--charcoal-light)" }}
                    >
                      <span style={{ fontSize: "1rem", lineHeight: 1 }}>–</span>
                    </div>
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.88rem",
                        color: "oklch(0.55 0.03 200)",
                        lineHeight: 1.5,
                      }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA card */}
            <div
              className="fade-up rounded-sm p-7 flex flex-col gap-5"
              style={{
                backgroundColor: "var(--charcoal)",
                transitionDelay: "200ms",
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.8rem",
                    fontWeight: 600,
                    color: "white",
                    lineHeight: 1.15,
                  }}
                >
                  Ready to become a member?
                </h3>
                <p
                  className="mt-3"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.88rem",
                    color: "oklch(0.72 0.03 200)",
                    lineHeight: 1.65,
                  }}
                >
                  Becoming a member takes one conversation. Reach out and we'll get you
                  set up and answer anything you want to know.
                </p>
              </div>
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); }}
                className="btn-primary w-full justify-center"
                style={{ backgroundColor: "var(--aged-bronze)", borderColor: "var(--aged-bronze)" }}
              >
                Begin Inquiry <ArrowRight size={15} />
              </a>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.72rem",
                  color: "oklch(0.5 0.03 200)",
                  textAlign: "center",
                  letterSpacing: "0.06em",
                }}
              >
                Private and secure · Start within 48 hours
              </p>
            </div>

          </div>
        </div>

        {/* The Membership Kit — the physical box that ships with every membership */}
        <div
          className="fade-up rounded-sm mt-8 px-8 py-8"
          style={{
            border: "1px solid oklch(0.97 0.02 200 / 0.18)",
            backgroundColor: "oklch(0.205 0.045 200)",
            transitionDelay: "120ms",
          }}
        >
          <div className="flex items-baseline justify-between flex-wrap gap-2 mb-6">
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.72rem",
                fontWeight: 500,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--aged-bronze)",
              }}
            >
              In Your Kit
            </p>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.35rem",
                fontWeight: 600,
                color: "white",
              }}
            >
              Everything arrives at your door.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {kit.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="rounded-sm p-5 flex flex-col gap-3 relative"
                  style={{
                    border: "1px solid oklch(0.97 0.02 200 / 0.1)",
                    backgroundColor: "oklch(0.17 0.04 200)",
                  }}
                >
                  {item.soon && (
                    <span
                      className="absolute top-3 right-3"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.56rem",
                        fontWeight: 500,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--aged-bronze)",
                        border: "1px solid oklch(0.7 0.12 85 / 0.35)",
                        borderRadius: "999px",
                        padding: "2px 7px",
                      }}
                    >
                      Coming soon
                    </span>
                  )}
                  <div
                    className="w-9 h-9 rounded-sm flex items-center justify-center"
                    style={{ backgroundColor: "oklch(0.38 0.15 165 / 0.12)" }}
                  >
                    <Icon size={17} style={{ color: "var(--forest-green)" }} />
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.86rem",
                        fontWeight: 600,
                        color: "white",
                        lineHeight: 1.3,
                      }}
                    >
                      {item.name}
                    </p>
                    <p
                      className="mt-1"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.74rem",
                        color: "oklch(0.6 0.03 200)",
                        lineHeight: 1.45,
                      }}
                    >
                      {item.note}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <p
            className="mt-5"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.72rem",
              color: "oklch(0.5 0.03 200)",
              letterSpacing: "0.04em",
            }}
          >
            Secure document upload is being built to full medical-privacy standards before it goes live.
          </p>
        </div>
      </div>
    </section>
  );
}

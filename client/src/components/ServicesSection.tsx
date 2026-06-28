/**
 * ServicesSection — MedAssurance
 * Design: Editorial asymmetric layout, large serif numerals, varied hierarchy
 * Warm linen background, forest green accents, bronze labels
 */
import { useEffect, useRef } from "react";
import { FileText, Stethoscope, ShieldCheck, Clock } from "lucide-react";

const CONSULT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663709880590/GKCMVQZrp5BBHin5LMZUpn/service-consultation-EZRzCNnVu5vjNNBxFh2hjS.webp";
const RX_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663709880590/GKCMVQZrp5BBHin5LMZUpn/service-prescription-YuXJvDQs9bHsSpt7KVRhLC.webp";

const services = [
  {
    icon: Stethoscope,
    number: "01",
    title: "1-on-1 Consultations",
    tagline: "Your physician. Your time.",
    description:
      "Schedule a private consultation with Dr. Heslin at any hour. No waiting rooms, no rushed appointments. A full, unhurried conversation about your health — the way medicine was meant to be practiced.",
    detail: "Available same-day with 48-hour membership activation.",
  },
  {
    icon: FileText,
    number: "02",
    title: "Same-Day Prescriptions",
    tagline: "Written. Sent. Done.",
    description:
      "Need a prescription? Dr. Heslin evaluates your situation and sends it directly to your preferred pharmacy — same day. No unnecessary office visits, no delays.",
    detail: "Sent directly to any pharmacy in your network.",
  },
  {
    icon: ShieldCheck,
    number: "03",
    title: "Second Opinions",
    tagline: "Know before you decide.",
    description:
      "Before any major procedure or diagnosis, get a frank, expert second opinion from Dr. Heslin. He reviews your records, speaks with your specialists, and tells you exactly what he thinks — without the politics.",
    detail: "Includes record review and specialist liaison.",
  },
  {
    icon: Clock,
    number: "04",
    title: "Hospital Advocacy",
    tagline: "Someone in your corner.",
    description:
      "If you're admitted to a hospital, Dr. Heslin ensures you receive the care you need — and nothing more. He communicates with your care team, interprets findings, and protects your interests at every step.",
    detail: "Active monitoring throughout your stay.",
  },
];

export default function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".fade-up").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 90);
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
    <section id="services" ref={ref} style={{ backgroundColor: "var(--warm-linen)", paddingTop: "8rem", paddingBottom: "8rem" }}>
      <div className="container">

        {/* Section header — left-anchored, asymmetric */}
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-8 mb-20">
          <div className="lg:col-span-5 fade-up">
            <span className="section-label mb-5 block">Services</span>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.6rem, 4.5vw, 3.8rem)",
                fontWeight: 600,
                color: "var(--charcoal)",
                lineHeight: 1.1,
              }}
            >
              Every service a close friend{" "}
              <em style={{ color: "var(--forest-green)" }}>with a medical degree</em> would offer.
            </h2>
          </div>
          <div className="lg:col-span-5 lg:col-start-7 fade-up flex items-end" style={{ transitionDelay: "80ms" }}>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "1.05rem",
                color: "var(--charcoal-light)",
                lineHeight: 1.78,
              }}
            >
              MedAssurance is not insurance. It is assurance — the quiet confidence
              of knowing exactly who to call, and that they will answer.
              No waiting rooms. No bureaucracy. Just medicine.
            </p>
          </div>
        </div>

        {/* Services — editorial list with large numerals */}
        <div className="flex flex-col">
          {services.map((service, i) => {
            const Icon = service.icon;
            const isEven = i % 2 === 1;
            return (
              <div
                key={i}
                className="fade-up grid grid-cols-1 lg:grid-cols-11 gap-6 lg:gap-0 group"
                style={{
                  transitionDelay: `${i * 90}ms`,
                  paddingTop: "3rem",
                  paddingBottom: "3rem",
                  borderTop: "1px solid var(--border)",
                }}
              >
                {/* Oversized numeral */}
                <div className={`lg:col-span-2 ${isEven ? "lg:col-start-1" : "lg:col-start-1"} flex items-start`}>
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "clamp(4rem, 7vw, 6rem)",
                      fontWeight: 600,
                      lineHeight: 1,
                      color: "oklch(0.38 0.085 155 / 0.18)",
                      transition: "color 300ms ease",
                      userSelect: "none",
                    }}
                    className="group-hover:text-forest"
                  >
                    {service.number}
                  </span>
                </div>

                {/* Icon + title */}
                <div className="lg:col-span-3 flex flex-col justify-start pt-2">
                  <div
                    className="w-10 h-10 rounded-sm flex items-center justify-center mb-4"
                    style={{ backgroundColor: "oklch(0.38 0.085 155 / 0.1)" }}
                  >
                    <Icon size={18} style={{ color: "var(--forest-green)" }} />
                  </div>
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.68rem",
                      fontWeight: 500,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--aged-bronze)",
                      marginBottom: "0.4rem",
                      display: "block",
                    }}
                  >
                    {service.tagline}
                  </span>
                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.75rem",
                      fontWeight: 600,
                      color: "var(--charcoal)",
                      lineHeight: 1.15,
                    }}
                  >
                    {service.title}
                  </h3>
                </div>

                {/* Description */}
                <div className="lg:col-span-4 lg:col-start-7 flex flex-col justify-start pt-2">
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.97rem",
                      color: "var(--charcoal-light)",
                      lineHeight: 1.8,
                    }}
                  >
                    {service.description}
                  </p>
                  <div className="flex items-center gap-2 mt-5">
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: "var(--forest-green)" }}
                    />
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.8rem",
                        color: "var(--charcoal-mid)",
                        fontStyle: "italic",
                      }}
                    >
                      {service.detail}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          {/* Bottom border */}
          <div style={{ borderTop: "1px solid var(--border)" }} />
        </div>

        {/* Two image panels — full bleed editorial */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-20 fade-up">
          <div className="md:col-span-3 relative overflow-hidden rounded-sm" style={{ height: "380px" }}>
            <img
              src={CONSULT_IMG}
              alt="Private consultation"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, oklch(0.12 0.010 60 / 0.6) 0%, transparent 55%)" }}
            />
            <div className="absolute bottom-7 left-7">
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 500, color: "white" }}>
                Private Consultation
              </p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "oklch(0.82 0.005 80)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "0.3rem" }}>
                On your schedule
              </p>
            </div>
          </div>
          <div className="md:col-span-2 relative overflow-hidden rounded-sm" style={{ height: "380px" }}>
            <img
              src={RX_IMG}
              alt="Prescription writing"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, oklch(0.12 0.010 60 / 0.6) 0%, transparent 55%)" }}
            />
            <div className="absolute bottom-7 left-7">
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 500, color: "white" }}>
                Same-Day Prescriptions
              </p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "oklch(0.82 0.005 80)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "0.3rem" }}>
                Sent to your pharmacy
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

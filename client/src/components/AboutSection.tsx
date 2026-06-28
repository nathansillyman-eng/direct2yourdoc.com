/**
 * AboutSection — Direct2YourDoc
 * Design: Asymmetric 55/45 split, doctor photo left, editorial text right
 * Warm linen background, forest green accents
 */
import { useEffect, useRef } from "react";
import { GraduationCap, Award, Heart } from "lucide-react";

const DOCTOR_IMG = "/manus-storage/hero-doctor-eB3pNfzAXfpxMomtAqv2kr.webp";

const credentials = [
  { icon: GraduationCap, text: "Doctor of Osteopathic Medicine (M.D.O.)" },
  { icon: Award, text: "Licensed across multiple specialties" },
  { icon: Heart, text: "Dedicated to the patient-first philosophy" },
];

export default function AboutSection() {
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
      id="about"
      ref={ref}
      style={{ backgroundColor: "oklch(0.15 0.05 285)", paddingTop: "8rem", paddingBottom: "8rem" }}
    >
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-12 lg:gap-20 items-center">

          {/* Left: Photo — 5/11 */}
          <div className="lg:col-span-5 fade-up">
            <div className="relative">
              {/* Decorative green border offset */}
              <div
                className="absolute -top-4 -left-4 w-full h-full rounded-sm"
                style={{ border: "2px solid var(--forest-green)", opacity: 0.45 }}
              />
              <img
                src={DOCTOR_IMG}
                alt="Dr. Andrew Heslin, M.D.O."
                className="relative rounded-sm w-full object-cover"
                style={{ height: "580px", objectPosition: "center top", filter: "brightness(0.95)" }}
              />
              {/* Credential badge */}
              <div
                className="absolute -bottom-6 -right-6 p-5 rounded-sm shadow-xl"
                style={{ backgroundColor: "var(--forest-green)", maxWidth: "200px" }}
              >
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.2rem", fontWeight: 600, color: "white", lineHeight: 1 }}>
                  M.D.O.
                </p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(0.75 0.04 200)", marginTop: "0.35rem" }}>
                  Osteopathic Medicine
                </p>
              </div>
            </div>
          </div>

          {/* Right: Text — 6/11 */}
          <div className="lg:col-span-6 lg:pl-4">
            <div className="fade-up">
              <span className="section-label mb-6 block" style={{ color: "var(--aged-bronze)" }}>About Dr. Heslin</span>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(2.4rem, 4vw, 3.4rem)",
                  fontWeight: 600,
                  color: "white",
                lineHeight: 1.1,
              }}
            >
              Medicine the way it<br />
                <em style={{ color: "var(--forest-green)" }}>was always meant to be.</em>
              </h2>
            </div>

            <div className="fade-up mt-6">
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "1.05rem",
                  color: "oklch(0.65 0.03 285)",
                lineHeight: 1.8,
              }}
            >
              Dr. Andrew Heslin, M.D.O., practices on a simple conviction:
                that every person deserves the kind of medical attention that used to
                require knowing the right people. The kind where your doctor knows your
                name, your history, and your concerns — and is genuinely available when
                you need them.
              </p>
              <p
                className="mt-4"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "1.05rem",
                  color: "oklch(0.65 0.03 285)",
                lineHeight: 1.8,
              }}
            >
              With a background in osteopathic medicine and years of clinical
                experience, Dr. Heslin brings both the technical expertise and the
                personal commitment that concierge medicine demands. He does not
                over-treat. He does not under-inform. He simply tells you the truth
                and helps you act on it.
              </p>
              <p
                className="mt-4"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "1.05rem",
                  color: "oklch(0.65 0.03 285)",
                  lineHeight: 1.8,
                }}
              >
                Direct2YourDoc is a venture of <strong style={{ color: "oklch(0.78 0.03 285)", fontWeight: 600 }}>The KeepMore Company</strong> —
                Nate Sillyman's lifelong work of removing the barriers between people and what
                they need. First it was barriers to <em style={{ color: "var(--forest-green)" }}>knowledge</em>;
                now, to <em style={{ color: "var(--forest-green)" }}>professional care</em> — delivered by
                the very professionals who came up learning from that same brand. Dr. Heslin is its
                founding physician.
              </p>
            </div>

            <div className="fade-up mt-8">
              <div
                className="pull-quote"
                style={{ borderLeftColor: "var(--forest-green)" }}
              >
                "I became Direct2YourDoc's founding physician because I watched too many
                people navigate the healthcare system alone. No one should have to."
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
                  — Dr. Andrew Heslin, M.D.O., Founding Physician
                </footer>
              </div>
            </div>

            <div className="fade-up mt-8 flex flex-col gap-3">
              {credentials.map((cred, i) => {
                const Icon = cred.icon;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "oklch(0.38 0.15 165 / 0.25)" }}
                    >
                      <Icon size={15} style={{ color: "var(--forest-green)" }} />
                    </div>
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.9rem",
                        color: "oklch(0.68 0.03 285)",
                      }}
                    >
                      {cred.text}
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

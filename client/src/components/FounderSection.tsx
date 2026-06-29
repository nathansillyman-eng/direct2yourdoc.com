/**
 * FounderSection — Direct2YourDoc
 * The founder's story. Direct2YourDoc is Nate Sillyman's idea, his build, his company
 * (a venture of The KeepMore Company). The physicians are staff who deliver the care —
 * they are not founders, owners, or originators.
 */
import { useEffect, useRef } from "react";
import { Lightbulb, Zap, Compass } from "lucide-react";

const OFFICE_IMG = "/manus-storage/d2yd-waiting-room_1f40a156.png";

const para: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "1.05rem",
  color: "oklch(0.66 0.03 200)",
  lineHeight: 1.8,
};

const principles = [
  { icon: Lightbulb, text: "His idea — conceived and built independently, from the ground up" },
  { icon: Zap, text: "Eight weeks of work, now turned out in a single day" },
  { icon: Compass, text: "One mission: remove the barrier between you and your care" },
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

          {/* Left: office image — 5/11 */}
          <div className="lg:col-span-5 fade-up">
            <div className="relative">
              <div
                className="absolute -top-4 -left-4 w-full h-full rounded-sm"
                style={{ border: "2px solid var(--forest-green)", opacity: 0.45 }}
              />
              <img
                src={OFFICE_IMG}
                alt="The Direct2YourDoc private office"
                className="relative rounded-sm w-full object-cover"
                style={{ height: "560px", objectPosition: "center", filter: "brightness(0.92)" }}
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
                One conviction.<br />
                <em style={{ color: "var(--forest-green-light)" }}>Built by hand.</em>
              </h2>
            </div>

            <div className="fade-up mt-6">
              <p style={para}>
                Direct2YourDoc began as a single conviction held by{" "}
                <strong style={{ color: "oklch(0.82 0.03 200)", fontWeight: 600 }}>Nate Sillyman</strong>,
                founder of The KeepMore Company: that reaching a real doctor should never depend on who
                you know, what you can afford to navigate, or how long you'll wait on hold. It wasn't a
                doctor's idea, or anyone else's. It was his.
              </p>
              <p className="mt-4" style={para}>
                He came to it with no formal background in code or medicine — and taught himself to build
                it anyway. What once took an outside team eight weeks, he now turns out in a single day;
                the work in front of you moved from idea to live in the time most companies spend booking
                a kickoff call. The same relentless pace that built The KeepMore Company is what makes
                Direct2YourDoc real.
              </p>
              <p className="mt-4" style={para}>
                It is all one mission — removing the barriers between people and what they need: first to{" "}
                <em style={{ color: "var(--forest-green)" }}>knowledge</em>, now to{" "}
                <em style={{ color: "var(--forest-green)" }}>care</em>. The physicians of Direct2YourDoc
                are the hands that deliver it. The idea, the build, and the company are his.
              </p>
            </div>

            <div className="fade-up mt-8">
              <div className="pull-quote" style={{ borderLeftColor: "var(--forest-green)" }}>
                "I was tired of watching good people get stuck behind a phone tree just to reach their
                own doctor. So I built the thing that takes the wall down."
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

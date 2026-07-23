/**
 * OfficeBand — Direct2YourDoc
 * Full-width cinematic office image with overlaid line. A mid-page visual breather
 * that reinforces the "the headset is the door" idea. Brand-matched reception image.
 */
const BAND_IMG = "/brand/founder-nate-band.png";

export default function OfficeBand() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "clamp(360px, 54vh, 640px)", backgroundColor: "oklch(0.14 0.05 200)" }}
    >
      <img
        src={BAND_IMG}
        alt="Nate Sillyman, founder, standing before The KeepMore Company sign"
        className="absolute inset-0 w-full h-full object-contain"
        style={{ objectPosition: "center center", filter: "brightness(0.9) saturate(0.95)" }}
      />
      {/* Right scrim for text legibility — Nate is centered in this photo, so the
          text panel and its dark scrim sit on the right, keeping his face and the
          KeepMore signage behind him visible on the left. */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(270deg, oklch(0.10 0.05 200 / 0.94) 0%, oklch(0.10 0.05 200 / 0.5) 52%, oklch(0.10 0.05 200 / 0.15) 100%)" }}
      />
      {/* Top/bottom blend into adjacent dark sections */}
      <div
        className="absolute inset-x-0 top-0 h-24"
        style={{ background: "linear-gradient(to bottom, oklch(0.16 0.05 200), transparent)" }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-24"
        style={{ background: "linear-gradient(to top, oklch(0.15 0.05 200), transparent)" }}
      />

      <div className="relative z-10 container h-full flex items-center justify-end">
        <div className="max-w-xl fade-up visible text-right">
          <span className="section-label mb-4 block" style={{ color: "var(--aged-bronze)" }}>The Door</span>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              fontWeight: 600,
              color: "white",
              lineHeight: 1.12,
            }}
          >
            Step inside.<br />
            <em style={{ color: "var(--forest-green-light)", textShadow: "0 0 28px oklch(0.82 0.17 165 / 0.4)" }}>
              The office is yours.
            </em>
          </h2>
          <p
            className="mt-4"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "1.02rem",
              color: "oklch(0.84 0.04 200)",
              lineHeight: 1.7,
              maxWidth: "440px",
            }}
          >
            No lobby to sit in, no front desk to get past. The headset is the door — and your
            doctor is already on the other side of it.
          </p>
        </div>
      </div>
    </section>
  );
}

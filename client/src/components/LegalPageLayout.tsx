/**
 * LegalPageLayout — Direct2YourDoc
 * Shared shell for legal/policy pages (Privacy Policy, Terms of Service, Accessibility).
 * Matches the site's Quiet Luxury Clinic palette — editorial, readable, no imagery.
 */
import { ReactNode } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function LegalPageLayout({
  title,
  effectiveDate,
  children,
}: {
  title: string;
  effectiveDate: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--warm-linen)" }}>
      <Navigation />
      <div className="container" style={{ paddingTop: "9rem", paddingBottom: "6rem", maxWidth: "780px" }}>
        <span className="section-label mb-4 block" style={{ color: "var(--aged-bronze)" }}>
          Direct2YourDoc
        </span>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2.2rem, 5vw, 3.2rem)",
            fontWeight: 600,
            color: "var(--charcoal)",
            lineHeight: 1.1,
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.82rem",
            color: "var(--charcoal-light)",
            marginTop: "0.75rem",
            marginBottom: "3rem",
            letterSpacing: "0.03em",
          }}
        >
          Effective {effectiveDate}
        </p>
        <div className="legal-content">{children}</div>
      </div>
      <Footer />
    </div>
  );
}

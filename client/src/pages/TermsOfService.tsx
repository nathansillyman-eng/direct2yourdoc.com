/**
 * TermsOfService — Direct2YourDoc
 * Route: /terms-of-service
 * Contains the binding arbitration clause / class action waiver (Section 9).
 */
import LegalPageLayout from "@/components/LegalPageLayout";

export default function TermsOfService() {
  return (
    <LegalPageLayout title="Terms of Service" effectiveDate="July 5, 2026">
      <p>
        These Terms of Service ("<strong>Terms</strong>") govern your access to and use of the Direct2YourDoc
        website and membership services, operated by The KeepMore Company LLC ("<strong>KeepMore</strong>,"
        "<strong>we</strong>," "<strong>us</strong>"). By using our site or enrolling in a membership, you agree
        to these Terms.
      </p>

      <h2>1. Not Insurance, Not Emergency Care</h2>
      <div className="legal-callout">
        Direct2YourDoc is a private concierge medical membership service. It is not health insurance and does not
        replace health insurance. It is not an emergency service. If you are experiencing a medical emergency,
        call 911 or go to the nearest emergency room immediately.
      </div>

      <h2>2. Description of Service</h2>
      <p>
        Direct2YourDoc facilitates a membership relationship between you and an independently practicing, licensed
        physician who provides consultations, prescription management, second opinions, and related services
        described on our site. Medical care itself is provided by the physician, not by KeepMore, and the
        physician-patient relationship is between you and that physician.
      </p>

      <h2>3. Eligibility</h2>
      <p>
        You must be at least 18 years old and legally capable of entering a binding agreement to become a member.
        Membership is subject to acceptance by a participating physician and availability in your location.
      </p>

      <h2>4. Membership and Payment</h2>
      <ul>
        <li>Membership fees, billing frequency, and included services are as described at the time of enrollment.</li>
        <li>Fees are billed in advance and are non-refundable except as required by law or as separately agreed in writing.</li>
        <li>We may change membership pricing prospectively upon reasonable notice.</li>
        <li>You may cancel your membership at any time in accordance with the cancellation terms provided at enrollment.</li>
      </ul>

      <h2>5. Your Responsibilities</h2>
      <p>
        You agree to provide accurate information, use the service only for lawful purposes, and understand that
        the quality and outcome of medical care depends on the accuracy and completeness of information you provide
        to your physician.
      </p>

      <h2>6. Disclaimers</h2>
      <p>
        The Direct2YourDoc website and general content are provided "as is" for informational purposes and do not
        constitute medical advice. Only the individualized guidance you receive directly from your treating
        physician should be relied upon for medical decisions. We make no warranty regarding the availability,
        accuracy, or outcome of any consultation.
      </p>

      <h2>7. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, KeepMore's total liability arising out of or relating to these
        Terms or the service is limited to the amount you paid us in the twelve (12) months preceding the claim.
        KeepMore is not liable for indirect, incidental, special, or consequential damages. Nothing in these Terms
        limits a physician's independent professional liability for the medical care they provide.
      </p>

      <h2>8. Indemnification</h2>
      <p>
        You agree to indemnify and hold KeepMore harmless from claims, damages, and expenses (including reasonable
        attorneys' fees) arising from your violation of these Terms or misuse of the service.
      </p>

      <h2>9. Binding Arbitration and Class Action Waiver</h2>
      <div className="legal-callout">
        <strong>Please read this section carefully. It affects your legal rights, including your right to file a
        lawsuit in court and to have a jury trial.</strong>
      </div>
      <h3>9.1 Agreement to Arbitrate</h3>
      <p>
        Except for claims that qualify for small claims court, any dispute, claim, or controversy arising out of or
        relating to these Terms, your membership, or the Direct2YourDoc service (a "<strong>Dispute</strong>") will
        be resolved exclusively through final and binding arbitration, rather than in court, except that you may
        assert claims in small claims court if your claims qualify.
      </p>
      <h3>9.2 Arbitration Rules</h3>
      <p>
        The arbitration will be administered by the American Arbitration Association ("AAA") under its Consumer
        Arbitration Rules then in effect. The arbitration will take place in Maricopa County, Arizona, or another
        mutually agreed location, or may be conducted by telephone or video conference where permitted by the AAA
        rules. The arbitrator's decision will be final and binding and may be entered as a judgment in any court of
        competent jurisdiction.
      </p>
      <h3>9.3 Class Action Waiver</h3>
      <p>
        <strong>You and KeepMore agree that any Dispute will be brought only in an individual capacity, and not as
        a plaintiff or class member in any purported class, collective, or representative proceeding.</strong> The
        arbitrator may not consolidate more than one person's claims and may not otherwise preside over any form of
        a representative or class proceeding.
      </p>
      <h3>9.4 Opt-Out Right</h3>
      <p>
        You may opt out of this arbitration agreement by sending written notice to{" "}
        <a href="mailto:legal@direct2yourdoc.com">legal@direct2yourdoc.com</a> within thirty (30) days of first
        accepting these Terms, stating your name and a clear statement that you wish to opt out of this
        arbitration agreement. If you opt out, neither you nor KeepMore will be required to arbitrate Disputes, and
        Section 10 (Governing Law) will govern venue instead.
      </p>
      <h3>9.5 Severability</h3>
      <p>
        If the class action waiver in Section 9.3 is found unenforceable as to a particular Dispute, then this
        entire arbitration agreement (Section 9) will not apply to that Dispute, and it must be brought in the
        courts identified in Section 10.
      </p>

      <h2>10. Governing Law and Venue</h2>
      <p>
        These Terms are governed by the laws of the State of Arizona, without regard to conflict-of-law principles.
        Subject to Section 9, the state and federal courts located in Maricopa County, Arizona will have exclusive
        jurisdiction over any Dispute not subject to arbitration.
      </p>

      <h2>11. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. Continued use of the site or service after changes take
        effect constitutes acceptance of the updated Terms.
      </p>

      <h2>12. Contact Us</h2>
      <p>
        Questions about these Terms can be sent to{" "}
        <a href="mailto:legal@direct2yourdoc.com">legal@direct2yourdoc.com</a>.
      </p>
    </LegalPageLayout>
  );
}

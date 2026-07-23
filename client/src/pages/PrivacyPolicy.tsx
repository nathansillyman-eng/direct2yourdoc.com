/**
 * PrivacyPolicy — Direct2YourDoc
 * Route: /privacy-policy
 */
import LegalPageLayout from "@/components/LegalPageLayout";

export default function PrivacyPolicy() {
  return (
    <LegalPageLayout title="Privacy Policy" effectiveDate="July 5, 2026">
      <p>
        The KeepMore Company LLC ("<strong>KeepMore</strong>," "<strong>we</strong>," "<strong>us</strong>," or "<strong>our</strong>")
        operates Direct2YourDoc, a private concierge medical membership service. This Privacy Policy explains what
        information we collect, how we use and share it, and the choices available to you.
      </p>

      <div className="legal-callout">
        Direct2YourDoc connects members with independently practicing, licensed physicians. Any medical information
        you share directly with your physician as part of your care is governed by that physician's own Notice of
        Privacy Practices under HIPAA, in addition to this Policy.
      </div>

      <h2>1. Information We Collect</h2>
      <p>We collect information in the following ways:</p>
      <ul>
        <li><strong>Information you provide</strong> — name, email, phone number, mailing address, payment information, and any details you submit through our contact, membership, or intake forms.</li>
        <li><strong>Health-related information</strong> — if you become a member, information you or your physician generate in the course of care (symptoms, history, prescriptions, records) is collected and stored by our physician staff and/or their electronic health record and telehealth platforms, not directly by KeepMore's marketing site.</li>
        <li><strong>Automatically collected information</strong> — IP address, browser and device type, pages viewed, and referring URLs, collected via standard web server logs and analytics tools.</li>
        <li><strong>Cookies</strong> — small data files used to remember preferences and measure site performance. You can disable cookies in your browser settings; some site features may not function without them.</li>
      </ul>

      <h2>2. How We Use Information</h2>
      <ul>
        <li>To respond to inquiries and process membership applications.</li>
        <li>To facilitate the connection between you and a Direct2YourDoc physician.</li>
        <li>To process payments and manage billing.</li>
        <li>To send administrative communications, including appointment reminders and membership updates.</li>
        <li>To improve our website, services, and member experience.</li>
        <li>To comply with legal, regulatory, and contractual obligations.</li>
      </ul>

      <h2>3. How We Share Information</h2>
      <p>We do not sell your personal information. We may share it with:</p>
      <ul>
        <li><strong>Service providers</strong> — payment processors, scheduling and telehealth platforms, and hosting providers who process data on our behalf under confidentiality obligations.</li>
        <li><strong>Physicians</strong> — independent, licensed physicians providing your care, who maintain their own medical records subject to HIPAA and state law.</li>
        <li><strong>Legal and safety purposes</strong> — where required by law, subpoena, or to protect the rights, property, or safety of KeepMore, our members, or others.</li>
        <li><strong>Business transfers</strong> — in connection with a merger, acquisition, or sale of assets, subject to standard confidentiality terms.</li>
      </ul>

      <h2>4. Data Security</h2>
      <p>
        We use administrative, technical, and physical safeguards designed to protect your information. No method
        of transmission or storage is completely secure, and we cannot guarantee absolute security.
      </p>

      <h2>5. Data Retention</h2>
      <p>
        We retain personal information for as long as necessary to provide our services, satisfy legal or
        regulatory recordkeeping requirements (including medical recordkeeping rules that may require longer
        retention), and resolve disputes.
      </p>

      <h2>6. Your Choices and Rights</h2>
      <ul>
        <li>You may request access to, correction of, or deletion of the personal information we hold about you, subject to our legal and recordkeeping obligations.</li>
        <li>You may opt out of non-essential marketing communications at any time using the unsubscribe link or by contacting us.</li>
        <li>Residents of certain states may have additional rights under applicable state privacy law; contact us to make a request.</li>
      </ul>

      <h2>7. Children's Privacy</h2>
      <p>
        Direct2YourDoc is intended for adults. We do not knowingly collect personal information from children under
        13. If you believe a child has provided us information, contact us and we will delete it.
      </p>

      <h2>8. Changes to This Policy</h2>
      <p>
        We may update this Policy from time to time. Material changes will be reflected by an updated effective
        date at the top of this page.
      </p>

      <h2>9. Contact Us</h2>
      <p>
        Questions about this Policy or your information can be sent to{" "}
        <a href="mailto:nate@thekeepmoreco.com">privacy@direct2yourdoc.com</a>.
      </p>
    </LegalPageLayout>
  );
}

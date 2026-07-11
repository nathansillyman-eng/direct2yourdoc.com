/**
 * AccessibilityStatement — Direct2YourDoc
 * Route: /accessibility
 * ADA / WCAG accessibility commitment + accommodation contact.
 */
import LegalPageLayout from "@/components/LegalPageLayout";

export default function AccessibilityStatement() {
  return (
    <LegalPageLayout title="Accessibility Statement" effectiveDate="July 5, 2026">
      <p>
        The KeepMore Company LLC is committed to ensuring digital accessibility for people of all abilities. We are
        continually improving the user experience for everyone and applying the relevant accessibility standards to
        the Direct2YourDoc website.
      </p>

      <h2>1. Our Standard</h2>
      <p>
        We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1, Level AA, which help make web
        content more accessible to people with a wide range of disabilities, including visual, auditory, physical,
        speech, cognitive, and neurological disabilities.
      </p>

      <h2>2. Ongoing Efforts</h2>
      <p>
        Accessibility is an ongoing effort. We periodically review our site for issues such as color contrast,
        keyboard navigation, screen-reader compatibility, and descriptive alt text, and we work to remediate
        issues as they are identified.
      </p>

      <h2>3. Known Limitations</h2>
      <p>
        Despite our efforts, some content or third-party tools embedded on our site may not yet be fully
        accessible. We are actively working to address these gaps.
      </p>

      <h2>4. Feedback and Accommodation Requests</h2>
      <p>
        If you use assistive technology (such as a screen reader, magnifier, or voice input software) and
        encounter an issue accessing content on this site, or if you need an alternative way to reach us or enroll
        in membership, please contact us:
      </p>
      <ul>
        <li>Email: <a href="mailto:accessibility@direct2yourdoc.com">accessibility@direct2yourdoc.com</a></li>
        <li>Phone: available on request via the email above</li>
      </ul>
      <p>
        Please include the web page and a description of the issue you encountered. We aim to respond to
        accessibility feedback within a reasonable time and will work with you to provide the information or
        service you need through an accessible alternative.
      </p>

      <h2>5. Formal Complaints</h2>
      <p>
        If you are not satisfied with our response, you may also file a complaint with the U.S. Department of
        Justice, Civil Rights Division, under the Americans with Disabilities Act (ADA).
      </p>
    </LegalPageLayout>
  );
}

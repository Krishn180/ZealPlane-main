import React from "react";
import "./PrivacyPolicy.scss";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy">
      <h1>Privacy Policy</h1>
      <p><strong>Effective Date:</strong> {new Date().toLocaleDateString()}</p>

      <p>
        Welcome to ComicPlane! This Privacy Policy explains how we collect, use,
        disclose, and safeguard your information when you visit our website. By
        using our site, you consent to the data practices described in this
        policy.
      </p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li><strong>Personal Information:</strong> Information you voluntarily provide,
          such as your name, email address, or other contact details when signing up,
          commenting, or filling out forms.
        </li>
        <li><strong>Account Credentials:</strong> If you create an account, we may store
          your username and encrypted password.
        </li>
        <li><strong>Usage Data:</strong> Pages you visit, time spent on pages, click patterns,
          IP address, and browser/device details.
        </li>
        <li><strong>Cookies & Tracking:</strong> Cookies, web beacons, tags, and similar
          tracking technologies to enhance user experience.
        </li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To operate and maintain the website effectively.</li>
        <li>To personalize your experience and deliver relevant content.</li>
        <li>To monitor website traffic and usage trends using analytics tools.</li>
        <li>To respond to user inquiries and customer service requests.</li>
        <li>To detect and prevent fraudulent activity or abuse of services.</li>
        <li>To send updates, newsletters, or promotional material (only if you opt in).</li>
      </ul>

      <h2>3. Google AdSense and Third-Party Advertisers</h2>
      <p>
        We use Google AdSense to serve ads based on prior visits to our site or other sites.
        Google may use cookies and web beacons to collect non-personally identifiable
        information such as your IP address, browser type, ISP, and other details to serve
        interest-based advertisements.
      </p>
      <p>
        You can opt out of personalized ads through Google's{" "}
        <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer">
          Ads Settings
        </a>
        , or review the full policy at{" "}
        <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noreferrer">
          Google Ad Policies
        </a>.
      </p>

      <h2>4. Cookies and Tracking Technologies</h2>
      <p>
        We use cookies to store user preferences, track page visits, and enhance
        performance. By using our site, you consent to the use of cookies.
      </p>
      <p>
        You may disable cookies through your browser settings. However, this may
        affect some functionality on our website.
      </p>

      <h2>5. Data Sharing and Disclosure</h2>
      <p>
        We do not sell, trade, or rent your personal information to others.
        However, we may share your information with:
      </p>
      <ul>
        <li>Trusted third-party service providers that help us operate the website.</li>
        <li>Legal authorities if required by law, subpoena, or regulation.</li>
        <li>Business transfers (e.g., merger, sale, or acquisition).</li>
      </ul>

      <h2>6. Third-Party Links</h2>
      <p>
        Our website may include links to other sites. We are not responsible for the content
        or privacy practices of these external websites. Please review their policies separately.
      </p>

      <h2>7. Data Security</h2>
      <p>
        We use encryption, secure socket layer (SSL) technology, and regular malware
        scanning to protect your information. Despite these efforts, no method of transmission
        over the internet is 100% secure.
      </p>

      <h2>8. Children’s Privacy</h2>
      <p>
        Our website is not intended for children under the age of 13. We do not knowingly
        collect personal data from children. If you believe we have, please contact us and
        we will delete the information immediately.
      </p>

      <h2>9. Your Rights and Choices</h2>
      <ul>
        <li>You have the right to access, update, or delete your personal information.</li>
        <li>You can opt out of newsletters or promotional emails at any time.</li>
        <li>For EU users, you have additional rights under GDPR (data access, correction, erasure, etc.).</li>
      </ul>

      <h2>10. Changes to This Policy</h2>
      <p>
        We reserve the right to update or change our privacy policy at any time. All changes
        will be posted on this page. Continued use of our website following changes indicates
        acceptance of the revised policy.
      </p>

      <h2>11. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy or your personal data:
      </p>
      <p>
        <strong>Email:</strong> teamzealplane@gmail.com <br />
        <strong>Website:</strong> <a href="https://comicplane.site/contact" target="_blank" rel="noreferrer">
          comicplane.site/contact
        </a>
      </p>
    </div>
  );
};

export default PrivacyPolicy;

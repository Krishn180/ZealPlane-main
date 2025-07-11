import React from "react";
import "./TermsOfUse.scss";

const TermsOfUse = () => {
  return (
    <div className="terms-of-use">
      <h1>Terms of Use</h1>
      <p><strong>Effective Date:</strong> {new Date().toLocaleDateString()}</p>

      <p>
        Welcome to <strong>ComicPlane</strong>. These Terms of Use ("Terms") govern your access to and use of our website, including comics, forums, user accounts, and all services provided by ComicPlane. By using our platform, you agree to comply with these Terms.
      </p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using any part of ComicPlane, you agree to be bound by these Terms and our Privacy Policy. If you do not agree, please discontinue use of the site.
      </p>

      <h2>2. Account Registration</h2>
      <ul>
        <li>You may need to register for an account to access certain features such as posting in the forum or uploading comics.</li>
        <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
        <li>You must not create accounts for malicious purposes or impersonate others.</li>
      </ul>

      <h2>3. Community & Forum Usage</h2>
      <p>
        ComicPlane offers a community space similar to forums (e.g., Reddit), where users can post, discuss, upvote/downvote, and comment on content. By participating in the community, you agree to follow our community guidelines:
      </p>
      <ul>
        <li>Be respectful and civil to others. Hate speech, harassment, bullying, or discrimination will not be tolerated.</li>
        <li>No NSFW, violent, or illegal content is allowed.</li>
        <li>Spam, self-promotion without permission, or misleading links are prohibited.</li>
        <li>Content must be posted in relevant topics or categories.</li>
        <li>Do not share personal data (yours or others') publicly.</li>
      </ul>

      <p>
        We reserve the right to remove posts, suspend accounts, or ban users who violate these community rules.
      </p>

      <h2>4. User-Generated Content</h2>
      <ul>
        <li>You retain ownership of the comics, posts, comments, and media you submit.</li>
        <li>By submitting content, you grant ComicPlane a non-exclusive, royalty-free license to use, display, promote, and distribute your content on our platform.</li>
        <li>You must ensure your content does not infringe on copyrights, trademarks, or any other third-party rights.</li>
        <li>We are not responsible for user-submitted content but may remove it at our discretion.</li>
      </ul>

      <h2>5. Prohibited Activities</h2>
      <ul>
        <li>Posting or sharing any illegal, defamatory, or pornographic content.</li>
        <li>Impersonating other users, moderators, or site admins.</li>
        <li>Hacking, data mining, or exploiting the platform in any way.</li>
        <li>Attempting to interfere with the normal functioning of the website or its community.</li>
      </ul>

      <h2>6. Intellectual Property</h2>
      <p>
        All site content not submitted by users — including logos, design, and software — is owned by ComicPlane. You may not copy, modify, or distribute our platform content without permission.
      </p>

      <h2>7. Moderation and Reporting</h2>
      <p>
        Moderators may remove content that violates our terms or community standards. Users can report inappropriate content or behavior using the reporting tools provided.
      </p>

      <h2>8. Disclaimers</h2>
      <p>
        ComicPlane provides its services "as is" without warranties of any kind. We do not guarantee the accuracy, availability, or reliability of any content or user interactions on the platform.
      </p>

      <h2>9. Limitation of Liability</h2>
      <p>
        ComicPlane and its team will not be liable for any damages arising from your use of the platform, including but not limited to lost profits, data loss, or personal injury.
      </p>

      <h2>10. Account Termination</h2>
      <p>
        We reserve the right to suspend or terminate any user account that violates these Terms or engages in harmful or illegal activity. Termination may be with or without notice.
      </p>

      <h2>11. Changes to Terms</h2>
      <p>
        We may update these Terms from time to time. Any changes will be posted on this page, and continued use of the site indicates your acceptance of the revised terms.
      </p>

      <h2>12. Contact Information</h2>
      <p>
        If you have any questions about these Terms, you may contact us at:
      </p>
      <p>
        <strong>Email:</strong> teamzealplane@gmail.com <br />
        <strong>Contact:</strong>{" "}
        <a href="https://comicplane.site/contact" target="_blank" rel="noreferrer">
          comicplane.site/contact
        </a>
      </p>
    </div>
  );
};

export default TermsOfUse;

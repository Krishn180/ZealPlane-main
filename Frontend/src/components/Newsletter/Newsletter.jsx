import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaGift, FaFire, FaBell, FaStar } from "react-icons/fa";
import "./newsletter.scss";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiBaseUrl}/newsletter`, { email });
      toast.success(res.data.message || "Subscribed successfully!");
      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrsong!");
    }
  };

  return (
    <div className="newsletter">
      <div className="newsletter-left">
        <h2> Join the ZealPlane Universe</h2>
        <p>Get early access to new comics, exclusive drops, and fan rewards.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">SUBSCRIBE</button>
        </form>
      </div>

      <div className="newsletter-right">
        <h4>Why Subscribe?</h4>
        <ul>
          <li><FaGift /> Free comics & digital goodies</li>
          <li><FaFire /> Early access to exclusive issues</li>
          <li><FaStar /> Members-only perks & contests</li>
          <li><FaBell /> Get notified before anyone else!</li>
        </ul>
      </div>
    </div>
  );
};

export default Newsletter;

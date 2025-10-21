import { useEffect } from "react";

export default function InstagramVideo() {
  useEffect(() => {
    // Load Instagram embed script if not already loaded
    if (!window.instgrm) {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    } else {
      window.instgrm.Embeds.process();
    }
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", margin: "2rem 0" }}>
      <blockquote
        className="instagram-media"
        data-instgrm-permalink="https://www.instagram.com/p/DPT61WDj9VQ/"
        data-instgrm-version="14"
        style={{
          background: "#040404ff",
          borderRadius: "12px",
          maxWidth: "540px",
          width: "100%",
          margin: "auto",
        }}
      ></blockquote>
    </div>
  );
}

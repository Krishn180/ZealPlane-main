import React from "react";
import "./ComicSpeechLoader.scss";

const ComicSpeechLoader = () => {
  return (
    <div className="comic-loader">
      <div className="character">
        <div className="head"></div>
        <div className="body"></div>
      </div>

      <div className="speech-bubble">
        <p>Loading... just a sec!</p>
      </div>
    </div>
  );
};

export default ComicSpeechLoader;

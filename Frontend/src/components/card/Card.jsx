// src/components/ui/card/Card.jsx
import React from "react";

const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-gray-900 rounded-xl shadow-md overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;

// src/components/ui/progress/Progress.jsx
import React from "react";

const Progress = ({ value = 0, className = "" }) => {
  return (
    <div className={`w-full bg-gray-700 rounded-full h-3 ${className}`}>
      <div
        className="bg-pink-600 h-3 rounded-full transition-all duration-300"
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
};

export default Progress;

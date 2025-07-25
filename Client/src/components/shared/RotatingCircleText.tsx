import React from "react";
import "./RotatingCircleText.css";

// Adjust the text so it fits the circle and is not cut off
const circleText = " * HOMNIX * HOMNIX * HOMNIX ";

const RotatingCircleText = () => (
  <div className="rotating-circle-container">
    <svg viewBox="0 0 200 200" width="180" height="180" className="rotating-circle-svg">
      <defs>
        <path
          id="circlePath"
          d="M 100, 100 m -80, 0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0"
        />
        <linearGradient id="circleTextGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00c6ff" />
          <stop offset="50%" stopColor="#7f53ac" />
          <stop offset="100%" stopColor="#43e97b" />
        </linearGradient>
      </defs>
      <g>
        <text fontSize="26" fontWeight="bold" letterSpacing="3" fill="url(#circleTextGradient)">
          <textPath xlinkHref="#circlePath">{circleText}</textPath>
        </text>
      </g>
    </svg>
  </div>
);

export default RotatingCircleText; 
// src/components/BackButton.js
import React from "react";
// Inside BackButton.js
function BackButton({ onClick, label = "Back to Topics" }) {
  return (
    <button className="back-button" onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        style={{ marginRight: 6 }}
        aria-hidden="true"
        focusable="false"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      {label}
    </button>
  );
}


export default BackButton;




import React from "react";
import TypeNavBar from "./TypeNavBar";

/**
 * Shows NavBar only on desktop (≥ lg).
 * Hides it automatically on mobile (< lg).
 */
const ResponsiveNavBarWrapper: React.FC = () => {
  return (
    <div className="d-none d-lg-block">
      <TypeNavBar />
    </div>
  );
};

export default ResponsiveNavBarWrapper;

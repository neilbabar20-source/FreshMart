
import React from "react";

const Announcement = () => {
  const messages = [
    "🥬 Fresh & Quality Groceries",
    "🚚 Fast & Reliable Delivery",
    "🎁 Great Offers Every Day",
    "💚 Trusted by FreshMart Customers",
    "🥑 Fresh Products, Better Choices",
    "⚡ Quick Delivery to Your Doorstep",
  ];

  return (
    <div className="announcement-bar">
      <div className="announcement-track">

        {/* First Set */}
        <div className="announcement-content">
          {messages.map((message, index) => (
            <React.Fragment key={`first-${index}`}>
              <span>{message}</span>
              <span className="announcement-dot">•</span>
            </React.Fragment>
          ))}
        </div>

        {/* Duplicate Set for Seamless Loop */}
        <div className="announcement-content">
          {messages.map((message, index) => (
            <React.Fragment key={`second-${index}`}>
              <span>{message}</span>
              <span className="announcement-dot">•</span>
            </React.Fragment>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Announcement;

import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const primaryItems = [
    { label: "Home", icon: "H" },
    { label: "Shorts", icon: "S" },
    { label: "Subscriptions", icon: "Sub" },
  ];

  const libraryItems = [
    { label: "History", icon: "Hi" },
    { label: "Playlists", icon: "Pl" },
    { label: "Your videos", icon: "Y" },
    { label: "Watch later", icon: "W" },
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-section" aria-label="Primary">
        {primaryItems.map((item) => (
          <Link
            key={item.label}
            to="/"
            className={item.label === "Home" ? "sidebar-link active" : "sidebar-link"}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <nav className="sidebar-section" aria-label="Library">
        <h2>You</h2>
        {libraryItems.map((item) => (
          <Link key={item.label} to="/" className="sidebar-link">
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <nav className="sidebar-section" aria-label="Explore">
        <h2>Explore</h2>
        {["Trending", "Music", "Gaming", "News", "Sports"].map((item) => (
          <Link key={item} to="/" className="sidebar-link">
            <span className="sidebar-icon">#</span>
            <span>{item}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

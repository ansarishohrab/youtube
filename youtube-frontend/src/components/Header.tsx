import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";

export default function Header() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(`/?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header className="header">
      <div className="brand-group">
        <button className="icon-button" aria-label="Open navigation">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <Link to="/" className="logo" aria-label="MyTube home">
          <span className="logo-mark">Play</span>
          <span>MyTube</span>
        </Link>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          className="search-input"
          placeholder="Search"
          aria-label="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="search-button" type="submit">
          Search
        </button>
      </form>

      <div className="header-actions">
        {user ? (
          <>
            <Link to="/upload" className="upload-link">
              Upload
            </Link>
            <button className="logout-button" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="signin-button">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}

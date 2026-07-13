import React, { useState } from "react";
import { login } from "../services/auth.service";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const data = await login(email, password);

      localStorage.setItem("token", data.token);
      setUser(data.user);
      navigate("/");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="login-title">
        <Link to="/" className="auth-logo" aria-label="MyTube home">
          <span className="logo-mark">Play</span>
          <span>MyTube</span>
        </Link>

        <div className="auth-copy">
          <h1 id="login-title">Sign in</h1>
          <p>Continue watching, uploading, and managing your channel.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            Email
            <input
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="field">
            Password
            <input
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button
            className="primary-button auth-submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="auth-switch">
          New to MyTube? <Link to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
};

export default LoginPage;

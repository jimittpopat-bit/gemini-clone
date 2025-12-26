import { useState } from "react";
import "./login.css";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // basic frontend check
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
        setLoading(false);
        return;
      }
      setLoading(false);

      // after successful signup → go to login
      window.location.href = "/";
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="logoAndcard">
      <div className="gemini-logo">
        <h1>Gemini clone</h1>
      </div>

      <div className="login-page">
        <div className="login-card">
          <h2>Create Account</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p
              style={{
                fontSize: "14px",
                textAlign: "right",
                cursor: "pointer",
                color: "#4f8cff",
                marginTop: "-8px",
                marginBottom: "12px",
              }}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Hide password" : "Show password"}
            </p>

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          {/* {error && <div className="login-error">{error}</div>} */}
          <p
            style={{
              marginTop: "16px",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            {" "}
            <span
              style={{ color: "#4f8cff", cursor: "pointer" }}
              onClick={() => (window.location.href = "/")}
            >
              Already have an account? Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

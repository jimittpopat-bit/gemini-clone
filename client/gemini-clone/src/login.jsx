import { useState } from "react";
import "./login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const BASE_URL = "https://gemini-clone-542w.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("theme", data.user.theme);
      localStorage.setItem("name", data.user.name);

      window.location.href = "/";
    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <div className="logoAndcard">
      <div className="gemini-logo">
        <h1>Gemini clone</h1>
      </div>
      <div className="login-page">
        <div className="login-card">
          <h2>Login</h2>

          <form onSubmit={handleSubmit}>
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
            <div className="createpass">
              <p onClick={() => (window.location.href = "/signup")}>
                Create an account
              </p>
              <p onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? "Hide password" : "Show password"}
              </p>
            </div>
            <button type="submit">Login</button>
          </form>

          {error && <div className="login-error">{error}</div>}
        </div>
      </div>
    </div>
  );
}

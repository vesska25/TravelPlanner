import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

import { inputCls, labelCls, primaryBtn } from "../lib/trip";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setUser } = useAuth(); // shared setter — lets us fill the pipe after login

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    if (!email.trim() && !password) {
      setError("Please enter your email and password.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      // Step 1 — exchange credentials for a token.
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message ?? "Login failed");
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);

      // Step 2 — now that we have a token, fetch WHO just logged in and fill the pipe.
      // Without this, AuthContext would still hold the previous user (its startup
      // useEffect already ran and won't re-run without a page reload).
      const meRes = await fetch("http://localhost:8080/api/users/me", {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      if (meRes.ok) {
        const me = await meRes.json();
        setUser(me); // navbar + profile now show the correct, fresh user
      }

      navigate("/trips");
    } catch (error) {
      console.error("Request failed:", error);
      setError("Something went wrong. Please try again.");
    }
  }

  return (
      <div className="min-h-screen flex">
        {/* brand panel */}
        <div
            className="hidden md:flex flex-[1.1] relative flex-col justify-between p-12 text-white overflow-hidden"
            style={{ background: "linear-gradient(150deg,#1f6f86 0%,#2f93ab 46%,#e8d9b5 100%)" }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-white/10 text-[260px]">
            <i className="ph ph-compass" />
          </div>
          <div className="relative flex items-center gap-2.5">
          <span className="w-[34px] h-[34px] rounded-[10px] bg-white/20 flex items-center justify-center text-lg">
            <i className="ph-fill ph-compass" />
          </span>
            <span className="font-display font-bold text-lg">Travel Planner</span>
          </div>
          <div className="relative">
            <h2 className="font-display text-[38px] font-extrabold tracking-tight leading-[1.1] mb-3.5 max-w-[440px]">
              Every journey starts with a plan.
            </h2>
            <p className="text-base leading-relaxed max-w-[380px] opacity-90">
              Map your trips, collect the places you love, and keep every detail in
              one calm, bright place.
            </p>
          </div>
          <span className="relative font-mono text-[11px] tracking-[0.2em] opacity-70">
          TRAVEL PLANNER
        </span>
        </div>

        {/* form panel */}
        <div className="flex-1 flex items-center justify-center p-10 bg-[#f5f9fb]">
          <div className="w-full max-w-[360px]">
            <h1 className="font-display text-[28px] font-extrabold tracking-tight mb-1.5">
              Welcome back
            </h1>
            <p className="text-[#5b7785] text-[15px] mb-7">
              Log in to keep planning your trips.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputCls}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={inputCls}
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button type="submit" className={`${primaryBtn} w-full mt-1`}>
                Log in
              </button>
            </form>

            <p className="text-center text-[#5b7785] text-sm mt-6">
              No account yet?{" "}
              <Link to="/register" className="text-[#1f6f86] font-semibold hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
  );
}

export default LoginPage;
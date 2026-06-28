import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { inputCls, labelCls, primaryBtn } from "../lib/trip";

function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message);
        return;
      }

      navigate("/login");
    } catch (err) {
      setError("Network error — is the backend running?");
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
          <i className="ph ph-airplane-tilt" />
        </div>
        <div className="relative flex items-center gap-2.5">
          <span className="w-[34px] h-[34px] rounded-[10px] bg-white/20 flex items-center justify-center text-lg">
            <i className="ph-fill ph-compass" />
          </span>
          <span className="font-display font-bold text-lg">Travel Planner</span>
        </div>
        <div className="relative">
          <h2 className="font-display text-[38px] font-extrabold tracking-tight leading-[1.1] mb-3.5 max-w-[440px]">
            Start your next adventure.
          </h2>
          <p className="text-base leading-relaxed max-w-[380px] opacity-90">
            Create an account and turn scattered ideas into one organized itinerary.
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
            Create account
          </h1>
          <p className="text-[#5b7785] text-[15px] mb-7">
            Free, and takes less than a minute.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Confirm password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={inputCls}
              />
            </div>

            {error && (
              <p className="text-sm text-[#b25c4e] bg-[#fbeeec] border border-[#f3d6d1] rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <button type="submit" className={`${primaryBtn} w-full mt-1`}>
              Create account
            </button>
          </form>

          <p className="text-center text-[#5b7785] text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-[#1f6f86] font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;

import { useState } from "react";
import { apiFetch } from "../api";
import { useAuth } from "../AuthContext";
import { inputCls, labelCls, primaryBtn, ghostBtn } from "../lib/trip";

export default function Profile() {
  // Read the shared user + the shared setter from context.
  // No local fetch: AuthProvider already loaded the user on startup.
  const { user, loading, setUser } = useAuth();

  // --- name-editing state (local UI state only, not shared) ---
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // --- password-change state ---
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState(null);
  const [pwSuccess, setPwSuccess] = useState(false);

  // ----- name editing -----
  function startEdit() {
    setName(user.name);
    setSaveError(null);
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setSaveError(null);
  }

  async function saveName() {
    setSaving(true);
    setSaveError(null);
    try {
      const res = await apiFetch("/api/users/me", {
        method: "PUT",
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? "Could not save name");
      }

      const updated = await res.json();
      // Update the SHARED user. This is the whole point of the refactor:
      // the navbar reads the same user, so it re-renders with the new name instantly.
      setUser(updated);
      setEditing(false);
    } catch (e) {
      setSaveError(e.message);
    } finally {
      setSaving(false);
    }
  }

  // ----- password change -----
  async function changePassword() {
    setPwError(null);
    setPwSuccess(false);

    if (newPassword !== confirmPassword) {
      setPwError("New passwords don't match");
      return;
    }

    setPwSaving(true);
    try {
      const res = await apiFetch("/api/users/me/password", {
        method: "PUT",
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? "Could not change password");
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPwSuccess(true);
    } catch (e) {
      setPwError(e.message);
    } finally {
      setPwSaving(false);
    }
  }

  // --- render states ---
  // While the provider is still loading the user on startup.
  if (loading) {
    return <p className="text-[#5b7785] px-6 py-10">Loading…</p>;
  }
  // Loaded but no user (e.g. token expired) — shouldn't happen behind ProtectedRoute, but guard anyway.
  if (!user) {
    return <p className="text-red-600 px-6 py-10">Could not load profile.</p>;
  }

  return (
      <div className="max-w-md mx-auto mt-10 px-4 space-y-6">
        {/* ---------- Card 1: profile details ---------- */}
        <div className="rounded-2xl bg-white border border-[#d9e6ec] p-6 shadow-[0_6px_24px_rgba(20,54,66,0.06)]">
          <h1 className="text-2xl font-bold text-[#143642] mb-6">Profile</h1>

          <div className="space-y-5">
            <div>
              <p className={labelCls}>Name</p>

              {editing ? (
                  <div className="mt-1.5 space-y-3">
                    <input
                        className={inputCls}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        autoFocus
                    />

                    {saveError && <p className="text-sm text-red-600">{saveError}</p>}

                    <div className="flex gap-2">
                      <button className={primaryBtn} onClick={saveName} disabled={saving}>
                        {saving ? "Saving…" : "Save changes"}
                      </button>
                      <button className={ghostBtn} onClick={cancelEdit} disabled={saving}>
                        Cancel
                      </button>
                    </div>
                  </div>
              ) : (
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-[#143642]">{user.name}</p>
                    <button
                        className="text-[#2f93ab] text-sm font-semibold hover:underline cursor-pointer"
                        onClick={startEdit}
                    >
                      Edit
                    </button>
                  </div>
              )}
            </div>

            <div>
              <p className={labelCls}>Email</p>
              <p className="mt-1 text-[#143642]">{user.email}</p>
            </div>
          </div>
        </div>

        {/* ---------- Card 2: change password ---------- */}
        <div className="rounded-2xl bg-white border border-[#d9e6ec] p-6 shadow-[0_6px_24px_rgba(20,54,66,0.06)]">
          <h2 className="text-lg font-bold text-[#143642] mb-4">Change password</h2>

          <div className="space-y-3">
            <div>
              <p className={labelCls}>Current password</p>
              <input
                  type="password"
                  className={`${inputCls} mt-1.5`}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
              />
            </div>

            <div>
              <p className={labelCls}>New password</p>
              <input
                  type="password"
                  className={`${inputCls} mt-1.5`}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
              />
            </div>

            <div>
              <p className={labelCls}>Confirm new password</p>
              <input
                  type="password"
                  className={`${inputCls} mt-1.5`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
              />
            </div>

            {pwError && <p className="text-sm text-red-600">{pwError}</p>}
            {pwSuccess && (
                <p className="text-sm text-[#1f6f86] font-semibold">Password changed.</p>
            )}

            <button className={primaryBtn} onClick={changePassword} disabled={pwSaving}>
              {pwSaving ? "Changing…" : "Change password"}
            </button>
          </div>
        </div>
      </div>
  );
}
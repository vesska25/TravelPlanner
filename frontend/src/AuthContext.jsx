import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "./api"; // api.js is in src/, same folder as this file

// 1. THE PIPE. Created once. Holds no data yet — the Provider fills it.
//    Components never touch this directly; they use the useAuth() hook below.
const AuthContext = createContext(null);

// 2. THE PROVIDER. Wraps the app, loads the user once, and pipes the value down.
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);    // the current user object, or null
    const [loading, setLoading] = useState(true); // true while we fetch /me on startup

    // On startup, if we have a token, fetch the current user once.
    useEffect(() => {
        const token = localStorage.getItem("token");

        // No token → nobody is logged in. Nothing to load; stop the loading state.
        if (!token) {
            setLoading(false);
            return;
        }

        let cancelled = false;
        async function loadUser() {
            try {
                const res = await apiFetch("/api/users/me");
                if (!res.ok) throw new Error("Failed to load user");
                const data = await res.json();
                if (!cancelled) setUser(data);
            } catch {
                // Token invalid/expired or network issue → treat as logged-out.
                if (!cancelled) setUser(null);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadUser();
        return () => {
            cancelled = true;
        };
    }, []);

    // The value that flows through the pipe: the user, a loading flag,
    // and setUser so any component can update the shared user (e.g. after a name change).
    const value = { user, loading, setUser };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. THE TAP. One-line access for any component inside the Provider.
//    Instead of importing AuthContext + useContext everywhere, call useAuth().
export function useAuth() {
    return useContext(AuthContext);
}
const BASE_URL = "http://localhost:8080";

// Wrapper around fetch that automatically attaches the JWT.
// path: e.g. "/api/trips"   options: same object you'd pass to fetch
export async function apiFetch(path, options = {}) {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...options.headers, // keep any headers the caller passed
    };

    // attach the token only if we have one
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers,
    });

    return response;
}

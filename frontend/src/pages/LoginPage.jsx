import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function LoginPage() {
    // state for the two input fields
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); // gives us a function to redirect programmatically

    // called when the form is submitted
    // note the "async" keyword — required to use "await" inside
    async function handleSubmit(event) {
        event.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                // backend returned 401 (or 403) — login failed
                const errorData = await response.json();
                console.error("Login failed:", errorData.message);
                return;
            }

            const data = await response.json();
            localStorage.setItem("token", data.token); // persist the JWT
            navigate("/trips"); // redirect to the trips page
        } catch (error) {
            // network-level failure (backend down, CORS, no connection)
            console.error("Request failed:", error);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-900">
            <div className="w-full max-w-md bg-zinc-800 rounded-xl shadow-lg p-8 border border-zinc-700">
                <h1 className="text-2xl font-bold text-zinc-100 mb-6 text-center">
                    Log in
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-zinc-300">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-zinc-300">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-zinc-100 hover:bg-white text-zinc-900 font-medium rounded-lg py-2 mt-2 transition-colors"
                    >
                        Log in
                    </button>
                </form>

                <p className="text-sm text-zinc-400 text-center mt-6">
                    No account?{" "}
                    <Link to="/register" className="text-zinc-200 hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
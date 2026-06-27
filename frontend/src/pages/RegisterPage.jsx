import { useState } from "react";
import {Link, useNavigate} from "react-router-dom";

function RegisterPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState(""); // holds an error message to show the user

    function handleChange(event) {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError(""); // clear any previous error before trying again

        try {
            const response = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                const errorData = await response.json();
                // show the backend's message (e.g. "Email already in use")
                setError(errorData.message);
                return;
            }

            // success (201) → registration done, send them to login
            navigate("/login");
        } catch (err) {
            setError("Network error — is the backend running?");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-900">
            <div className="w-full max-w-md bg-zinc-800 rounded-xl shadow-lg p-8 border border-zinc-700">
                <h1 className="text-2xl font-bold text-zinc-100 mb-6 text-center">
                    Register
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-zinc-300">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-zinc-300">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-zinc-300">Confirm password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            className="bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-400 bg-red-950 border border-red-800 rounded-lg px-3 py-2">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="bg-zinc-100 hover:bg-white text-zinc-900 font-medium rounded-lg py-2 mt-2 transition-colors"
                    >
                        Register
                    </button>
                </form>

                <p className="text-sm text-zinc-400 text-center mt-6">
                    Already have an account?{" "}
                    <Link to="/login" className="text-zinc-200 hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;
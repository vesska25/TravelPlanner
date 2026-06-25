import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Log in</button>
            </form>
        </div>
    );
}

export default LoginPage;
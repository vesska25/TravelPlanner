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
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" name="password" value={form.password} onChange={handleChange} />
                </div>
                <div>
                    <label>Confirm password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                    />
                    <p>
                        Already have an account? <Link to="/login">Log in</Link>
                    </p>
                </div>

                {/* show the error only if there is one */}
                {error && <p style={{ color: "red" }}>{error}</p>}

                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default RegisterPage;
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    function handleLogout() {
        localStorage.removeItem("token"); // delete the JWT
        navigate("/login");               // send user back to login
    }

    return (
        <nav style={{ display: "flex", gap: "1rem", padding: "1rem", borderBottom: "1px solid #ccc" }}>
            <Link to="/trips">My Trips</Link>

            {/* show logout only when logged in */}
            {token && <button onClick={handleLogout}>Logout</button>}
        </nav>
    );
}

export default Navbar;
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // no token (login / register pages) → no navbar at all
    if (!token) {
        return null;
    }

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/login");
    }

    return (
        <nav className="flex items-center gap-6 px-6 py-4 bg-zinc-800 border-b border-zinc-700">
            <Link to="/trips" className="text-zinc-100 font-medium hover:text-white">
                My Trips
            </Link>

            <button
                onClick={handleLogout}
                className="ml-auto text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
            >
                Logout
            </button>
        </nav>
    );
}

export default Navbar;
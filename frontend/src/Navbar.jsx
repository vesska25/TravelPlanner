import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function initialsFrom(name) {
    if (!name) return "";
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();
}

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const { user } = useAuth();

    // no token (login / register pages) → no navbar at all
    if (!token) {
        return null;
    }

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/login");
    }

    const name = user?.name; // user may still be null while loading
    const initials = initialsFrom(name);

    return (
        <nav className="sticky top-0 z-30 flex items-center gap-5 px-7 py-3.5 bg-white border-b border-[#e6eef2]">
            <Link to="/trips" className="flex items-center gap-2.5">
        <span className="w-8 h-8 rounded-[10px] bg-[#2f93ab] text-white flex items-center justify-center text-lg">
          <i className="ph-fill ph-compass" />
        </span>
                <span className="font-display font-bold text-[17px] tracking-tight text-[#143642]">
          Travel&nbsp;Planner
        </span>
            </Link>

            <div className="flex items-center gap-1 ml-3">
                <Link
                    to="/trips"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#eaf4f7] text-[#1f6f86] font-semibold text-sm"
                >
                    <i className="ph-bold ph-suitcase-rolling" /> Trips
                </Link>
                <span className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[#5b7785] font-medium text-sm cursor-default">
          <i className="ph ph-map-trifold" /> Map
          <span className="text-[10px] font-semibold text-[#9a7b2f] bg-[#f3e7c6] px-1.5 py-0.5 rounded-md">
            SOON
          </span>
        </span>
            </div>

            <div className="ml-auto flex items-center gap-3.5">
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-[10px] bg-[#f1f6f8] text-[#5b7785] text-[13px] w-40">
                    <i className="ph ph-magnifying-glass" /> Search trips
                </div>

                {/* Profile button: avatar with the user's initials + their name. */}
                <Link
                    to="/profile"
                    title="Profile"
                    className="flex items-center gap-2.5 pl-1 pr-2.5 py-1 rounded-full hover:bg-[#f1f6f8] transition-colors"
                >
          <span
              className="w-[34px] h-[34px] rounded-full text-white flex items-center justify-center font-bold text-[13px]"
              style={{ background: "linear-gradient(135deg,#2f93ab,#e8d9b5)" }}
          >
            {initials}
          </span>
                    {name && (
                        <span className="hidden sm:block font-semibold text-sm text-[#143642]">
              {name}
            </span>
                    )}
                </Link>

                <button
                    onClick={handleLogout}
                    title="Log out"
                    className="text-[#5b7785] hover:text-[#143642] text-lg flex items-center transition-colors cursor-pointer"
                >
                    <i className="ph ph-sign-out" />
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
import { useLocation } from "react-router-dom";

// Simple footer shown on the app's inner pages (not on login/register).
// Honest about what this is: a learning / portfolio project, not a real service.
export default function Footer() {
    const location = useLocation();

    // Hide the footer on the auth screens, which are full-page forms.
    const hiddenOn = ["/login", "/register"];
    if (hiddenOn.includes(location.pathname)) {
        return null;
    }

    const year = new Date().getFullYear(); // stays current automatically

    return (
        <footer className="border-t border-[#e6eef2] bg-white mt-10">
            <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[13px] text-[#5b7785]">
                <p>
                    Travel Planner — a personal learning project by Sergei Savich. Not a
                    commercial service.
                </p>
                <a
                    href="https://github.com/vesska25/TravelPlanner"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-100 hover:underline transition-opacity"
                >
                    github.com/vesska25/TravelPlanner
                </a>
                <p className="text-[#9fb3bc]">© {year}</p>

            </div>
        </footer>
    );
}
import { useState, useEffect } from "react";
import { apiFetch } from "../api";
import { useNavigate, Link } from "react-router-dom";

function TripsPage() {
    const [trips, setTrips] = useState([]); // start with an empty list
    const navigate = useNavigate();

    // runs once, after the component first appears on screen
    useEffect(() => {
        async function loadTrips() {
            const response = await apiFetch("/api/trips");
            const data = await response.json();
            setTrips(data); // store the fetched trips in state
        }

        loadTrips();
    }, []); // empty array = run only once

    async function handleDelete(id) {
        // ask for confirmation before an irreversible action
        const confirmed = window.confirm("Delete this trip?");
        if (!confirmed) {
            return; // user clicked Cancel — do nothing
        }

        try {
            const response = await apiFetch(`/api/trips/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                console.error("Failed to delete trip");
                return;
            }

            // remove the deleted trip from state (keep all trips whose id is different)
            setTrips((prev) => prev.filter((trip) => trip.id !== id));
        } catch (error) {
            console.error("Request failed:", error);
        }
    }

    return (
        <div className="min-h-screen bg-zinc-900 px-6 py-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-zinc-100">My Trips</h1>
                    <button
                        onClick={() => navigate("/trips/new")}
                        className="bg-zinc-100 hover:bg-white text-zinc-900 font-medium rounded-lg px-4 py-2 transition-colors"
                    >
                        + Add trip
                    </button>
                </div>

                {trips.length === 0 ? (
                    <p className="text-zinc-400">No trips yet. Create your first one!</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {trips.map((trip) => (
                            <div
                                key={trip.id}
                                className="bg-zinc-800 border border-zinc-700 rounded-xl p-5 flex flex-col gap-3 hover:border-zinc-500 transition-colors"
                            >
                                <Link to={`/trips/${trip.id}`} className="block">
                                    <h2 className="text-lg font-semibold text-zinc-100 hover:underline">
                                        {trip.name}
                                    </h2>
                                    <p className="text-sm text-zinc-400 mt-1">{trip.country}</p>
                                </Link>

                                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-zinc-700 text-zinc-200 rounded-full px-2 py-1">
                    {trip.status}
                  </span>
                                    <span className="text-zinc-400">
                    {trip.budget} {trip.currency}
                  </span>
                                </div>

                                <div className="flex gap-2 mt-auto pt-2">
                                    <button
                                        onClick={() => navigate(`/trips/${trip.id}/edit`)}
                                        className="text-sm text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded-lg px-3 py-1 transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(trip.id)}
                                        className="text-sm text-red-400 hover:text-red-300 border border-zinc-700 hover:border-red-800 rounded-lg px-3 py-1 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TripsPage;
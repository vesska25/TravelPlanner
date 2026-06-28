import { useState, useEffect } from "react";
import { apiFetch } from "../api";
import { useParams, useNavigate } from "react-router-dom";

function TripDetailPage() {
    const { id } = useParams(); // trip id from the URL
    const navigate = useNavigate();

    const [trip, setTrip] = useState(null);   // the trip itself (null until loaded)
    const [places, setPlaces] = useState([]); // places inside this trip

    const [placeForm, setPlaceForm] = useState({
        name: "",
        city: "",
        category: "RESTAURANT",
        notes: "",
        visited: false,
    });

    function handlePlaceChange(event) {
        const { name, value, type, checked } = event.target;
        // for checkboxes use "checked" (true/false); for everything else use "value"
        setPlaceForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    async function handlePlaceSubmit(event) {
        event.preventDefault();

        try {
            const response = await apiFetch(`/api/trips/${id}/places`, {
                method: "POST",
                body: JSON.stringify(placeForm),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Failed to add place:", errorData.message);
                return;
            }

            const newPlace = await response.json();
            // append the newly created place (with its server-assigned id) to the list
            setPlaces((prev) => [...prev, newPlace]);

            // reset the form so the user can add another place
            setPlaceForm({
                name: "",
                city: "",
                category: "RESTAURANT",
                notes: "",
                visited: false,
            });
        } catch (error) {
            console.error("Request failed:", error);
        }
    }

    async function handleDeletePlace(placeId) {
        const confirmed = window.confirm("Delete this place?");
        if (!confirmed) {
            return;
        }

        try {
            const response = await apiFetch(`/api/places/${placeId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                console.error("Failed to delete place");
                return;
            }

            // remove the deleted place from state
            setPlaces((prev) => prev.filter((place) => place.id !== placeId));
        } catch (error) {
            console.error("Request failed:", error);
        }
    }

    useEffect(() => {
        async function loadData() {
            // load the trip details
            const tripResponse = await apiFetch(`/api/trips/${id}`);
            if (tripResponse.ok) {
                setTrip(await tripResponse.json());
            }

            // load the places belonging to this trip
            const placesResponse = await apiFetch(`/api/trips/${id}/places`);
            if (placesResponse.ok) {
                setPlaces(await placesResponse.json());
            }
        }

        loadData();
    }, [id]);

    // while the trip is still loading, show a placeholder
    if (!trip) {
        return <p>Loading...</p>;
    }

    // while the trip is still loading, show a placeholder
    if (!trip) {
        return (
            <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
                <p className="text-zinc-400">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-900 px-6 py-8">
            <div className="max-w-3xl mx-auto flex flex-col gap-6">

                <button
                    onClick={() => navigate("/trips")}
                    className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors self-start"
                >
                    ← Back to trips
                </button>
                {/* trip header */}
                <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
                    <h1 className="text-2xl font-bold text-zinc-100">{trip.name}</h1>
                    <div className="flex items-center gap-3 mt-2 text-sm">
            <span className="bg-zinc-700 text-zinc-200 rounded-full px-2 py-1 text-xs">
              {trip.status}
            </span>
                        <span className="text-zinc-400">{trip.country}</span>
                        <span className="text-zinc-400">
              {trip.budget} {trip.currency}
            </span>
                    </div>
                </div>

                {/* places list */}
                <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-zinc-100 mb-4">Places</h2>

                    {places.length === 0 ? (
                        <p className="text-zinc-400 text-sm">No places yet.</p>
                    ) : (
                        <ul className="flex flex-col gap-2">
                            {places.map((place) => (
                                <li
                                    key={place.id}
                                    className="flex items-center justify-between bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3"
                                >
                                    <div>
                                        <span className="text-zinc-100">{place.name}</span>
                                        <span className="text-zinc-400 text-sm"> — {place.city}</span>
                                        <span className="text-zinc-500 text-xs ml-2">({place.category})</span>
                                        {place.visited && (
                                            <span className="text-green-400 text-xs ml-2">✓ visited</span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleDeletePlace(place.id)}
                                        className="text-sm text-red-400 hover:text-red-300 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* add place form */}
                <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-zinc-100 mb-4">Add a place</h3>
                    <form onSubmit={handlePlaceSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-zinc-300">Name</label>
                            <input
                                name="name"
                                value={placeForm.name}
                                onChange={handlePlaceChange}
                                className="bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-zinc-300">City</label>
                            <input
                                name="city"
                                value={placeForm.city}
                                onChange={handlePlaceChange}
                                className="bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-zinc-300">Category</label>
                            <select
                                name="category"
                                value={placeForm.category}
                                onChange={handlePlaceChange}
                                className="bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                            >
                                <option value="RESTAURANT">RESTAURANT</option>
                                <option value="HOTEL">HOTEL</option>
                                <option value="MUSEUM">MUSEUM</option>
                                <option value="ATTRACTION">ATTRACTION</option>
                                <option value="NATURE">NATURE</option>
                                <option value="OTHER">OTHER</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-zinc-300">Notes</label>
                            <textarea
                                name="notes"
                                value={placeForm.notes}
                                onChange={handlePlaceChange}
                                className="bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                            />
                        </div>
                        <label className="flex items-center gap-2 text-sm text-zinc-300">
                            <input
                                type="checkbox"
                                name="visited"
                                checked={placeForm.visited}
                                onChange={handlePlaceChange}
                                className="w-4 h-4 accent-zinc-400"
                            />
                            Visited
                        </label>
                        <button
                            type="submit"
                            className="bg-zinc-100 hover:bg-white text-zinc-900 font-medium rounded-lg py-2 transition-colors self-start px-6"
                        >
                            Add place
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default TripDetailPage;
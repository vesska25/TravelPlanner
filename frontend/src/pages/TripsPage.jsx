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
        <div>
            <h1>My Trips</h1>
            <button onClick={() => navigate("/trips/new")}>+ Add trip</button>
            <ul>
                {trips.map((trip) => (
                    <li key={trip.id}>
                        <Link to={`/trips/${trip.id}`}>
                            {trip.name} — {trip.country}
                        </Link>
                        <button onClick={() => handleDelete(trip.id)}>Delete</button>
                        <button onClick={() => navigate(`/trips/${trip.id}/edit`)}>Edit</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TripsPage;
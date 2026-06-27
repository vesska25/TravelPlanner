import { useState, useEffect } from "react";
import { apiFetch } from "../api";
import { useNavigate } from "react-router-dom";

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

    return (
        <div>
            <h1>My Trips</h1>
            <button onClick={() => navigate("/trips/new")}>+ Add trip</button>
            <ul>
                {trips.map((trip) => (
                    <li key={trip.id}>
                        {trip.name} — {trip.country}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TripsPage;
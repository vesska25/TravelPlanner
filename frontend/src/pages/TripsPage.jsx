import { useState, useEffect } from "react";
import { apiFetch } from "../api";

function TripsPage() {
    const [trips, setTrips] = useState([]); // start with an empty list

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
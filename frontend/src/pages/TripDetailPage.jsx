import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api";

function TripDetailPage() {
    const { id } = useParams(); // trip id from the URL

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

    return (
        <div>
            <h1>{trip.name}</h1>
            <p>
                {trip.country} · {trip.status} · {trip.budget} {trip.currency}
            </p>

            <h2>Places</h2>
            {places.length === 0 ? (
                <p>No places yet.</p>
            ) : (
                <ul>
                    {places.map((place) => (
                        <li key={place.id}>
                            {place.name} — {place.city} ({place.category})
                            <button onClick={() => handleDeletePlace(place.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}

            <h3>Add a place</h3>
            <form onSubmit={handlePlaceSubmit}>
                <div>
                    <label>Name</label>
                    <input name="name" value={placeForm.name} onChange={handlePlaceChange} />
                </div>
                <div>
                    <label>City</label>
                    <input name="city" value={placeForm.city} onChange={handlePlaceChange} />
                </div>
                <div>
                    <label>Category</label>
                    <select name="category" value={placeForm.category} onChange={handlePlaceChange}>
                        <option value="RESTAURANT">RESTAURANT</option>
                        <option value="HOTEL">HOTEL</option>
                        <option value="MUSEUM">MUSEUM</option>
                        <option value="ATTRACTION">ATTRACTION</option>
                        <option value="NATURE">NATURE</option>
                        <option value="OTHER">OTHER</option>
                    </select>
                </div>
                <div>
                    <label>Notes</label>
                    <textarea name="notes" value={placeForm.notes} onChange={handlePlaceChange} />
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            name="visited"
                            checked={placeForm.visited}
                            onChange={handlePlaceChange}
                        />
                        Visited
                    </label>
                </div>
                <button type="submit">Add place</button>
            </form>
        </div>
    );
}

export default TripDetailPage;
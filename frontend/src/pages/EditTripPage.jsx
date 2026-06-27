import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../api";

function EditTripPage() {
    const navigate = useNavigate();
    const { id } = useParams(); // the trip id from the URL

    const [form, setForm] = useState({
        name: "",
        country: "",
        startDate: "",
        endDate: "",
        budget: "",
        currency: "EUR",
        status: "PLANNED",
        description: "",
    });

    // load the existing trip once, when the page opens
    useEffect(() => {
        async function loadTrip() {
            const response = await apiFetch(`/api/trips/${id}`);
            if (!response.ok) {
                console.error("Failed to load trip");
                return;
            }
            const data = await response.json();
            // fill the form with the trip's current values
            setForm({
                name: data.name,
                country: data.country,
                startDate: data.startDate,
                endDate: data.endDate,
                budget: data.budget,
                currency: data.currency,
                status: data.status,
                description: data.description,
            });
        }

        loadTrip();
    }, [id]); // re-run if the id ever changes

    function handleChange(event) {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            const response = await apiFetch(`/api/trips/${id}`, {
                method: "PUT",
                body: JSON.stringify({
                    ...form,
                    budget: parseFloat(form.budget),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Failed to update trip:", errorData.message);
                return;
            }

            navigate("/trips"); // back to the list after saving
        } catch (error) {
            console.error("Request failed:", error);
        }
    }

    return (
        <div>
            <h1>Edit Trip</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input name="name" value={form.name} onChange={handleChange} />
                </div>
                <div>
                    <label>Country</label>
                    <input name="country" value={form.country} onChange={handleChange} />
                </div>
                <div>
                    <label>Start date</label>
                    <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />
                </div>
                <div>
                    <label>End date</label>
                    <input type="date" name="endDate" value={form.endDate} onChange={handleChange} />
                </div>
                <div>
                    <label>Budget</label>
                    <input type="number" name="budget" value={form.budget} onChange={handleChange} />
                </div>
                <div>
                    <label>Currency</label>
                    <select name="currency" value={form.currency} onChange={handleChange}>
                        <option value="EUR">EUR</option>
                        <option value="USD">USD</option>
                        <option value="GBP">GBP</option>
                        <option value="CHF">CHF</option>
                    </select>
                </div>
                <div>
                    <label>Status</label>
                    <select name="status" value={form.status} onChange={handleChange}>
                        <option value="PLANNED">PLANNED</option>
                        <option value="ONGOING">ONGOING</option>
                        <option value="COMPLETED">COMPLETED</option>
                    </select>
                </div>
                <div>
                    <label>Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} />
                </div>
                <button type="submit">Save changes</button>
            </form>
        </div>
    );
}

export default EditTripPage;
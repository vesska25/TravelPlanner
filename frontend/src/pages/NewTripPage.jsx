import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

function NewTripPage() {
    const navigate = useNavigate();

    // all form fields live in a single state object
    const [form, setForm] = useState({
        name: "",
        country: "",
        startDate: "",
        endDate: "",
        budget: "",
        currency: "EUR",   // default dropdown value
        status: "PLANNED", // default dropdown value
        description: "",
    });

    // one generic handler for every field
    // it reads the field's "name" attribute and updates that key
    function handleChange(event) {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            const response = await apiFetch("/api/trips", {
                method: "POST",
                body: JSON.stringify({
                    ...form,
                    budget: parseFloat(form.budget), // convert string to number
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Failed to create trip:", errorData.message);
                return;
            }

            // success → go back to the trips list
            navigate("/trips");
        } catch (error) {
            console.error("Request failed:", error);
        }
    }

    return (
        <div>
            <h1>New Trip</h1>
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
                <button type="submit">Create trip</button>
            </form>
        </div>
    );
}

export default NewTripPage;
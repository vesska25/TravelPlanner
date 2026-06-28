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

    const [error, setError] = useState("")

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
        setError(""); // clear previous error

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
                setError(errorData.message || "Failed to update trip");
                return;
            }

            navigate("/trips");
        } catch (err) {
            setError("Network error — is the backend running?");
        }
    }


    return (
        <div className="min-h-screen bg-zinc-900 px-6 py-8">
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => navigate("/trips")}
                    className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors mb-4"
                >
                    ← Back to trips
                </button>
                <h1 className="text-2xl font-bold text-zinc-100 mb-6">Edit Trip</h1>

                <form
                    onSubmit={handleSubmit}
                    className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 flex flex-col gap-4"
                >
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-zinc-300">Name</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-zinc-300">Country</label>
                        <input
                            name="country"
                            value={form.country}
                            onChange={handleChange}
                            className="bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-sm font-medium text-zinc-300">Start date</label>
                            <input
                                type="date"
                                name="startDate"
                                value={form.startDate}
                                onChange={handleChange}
                                className="bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                            />
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-sm font-medium text-zinc-300">End date</label>
                            <input
                                type="date"
                                name="endDate"
                                value={form.endDate}
                                onChange={handleChange}
                                className="bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-sm font-medium text-zinc-300">Budget</label>
                            <input
                                type="number"
                                name="budget"
                                value={form.budget}
                                onChange={handleChange}
                                className="bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                            />
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-sm font-medium text-zinc-300">Currency</label>
                            <select
                                name="currency"
                                value={form.currency}
                                onChange={handleChange}
                                className="bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                            >
                                <option value="EUR">EUR</option>
                                <option value="USD">USD</option>
                                <option value="GBP">GBP</option>
                                <option value="CHF">CHF</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-zinc-300">Status</label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                        >
                            <option value="PLANNED">PLANNED</option>
                            <option value="ONGOING">ONGOING</option>
                            <option value="COMPLETED">COMPLETED</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-zinc-300">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-400 bg-red-950 border border-red-800 rounded-lg px-3 py-2">
                            {error}
                        </p>
                    )}
                    <button
                        type="submit"
                        className="bg-zinc-100 hover:bg-white text-zinc-900 font-medium rounded-lg py-2 mt-2 self-start px-6 transition-colors"
                    >
                        Save changes
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditTripPage;
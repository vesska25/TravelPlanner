import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../api";
import CountrySelect from "../components/CountrySelect";

import { inputCls, labelCls, primaryBtn, ghostBtn } from "../lib/trip";

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
    description: "",
  });

  const [error, setError] = useState("");

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
    <div className="min-h-screen bg-[#f5f9fb] px-6 py-8">
      <div className="max-w-[640px] mx-auto">
        <button
          onClick={() => navigate("/trips")}
          className="inline-flex items-center gap-1.5 text-sm text-[#5b7785] hover:text-[#143642] transition-colors cursor-pointer"
        >
          <i className="ph ph-arrow-left" /> All trips
        </button>
        <h1 className="font-display text-[30px] font-extrabold tracking-tight mt-3.5 mb-1">
          Edit trip
        </h1>
        <p className="text-[#5b7785] text-[15px] mb-5.5">Update the details of your journey.</p>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#e6eef2] rounded-[18px] p-6 flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Trip name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className={inputCls}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Country</label>
            <CountrySelect
              value={form.country}
              onChange={(code) => setForm((prev) => ({ ...prev, country: code }))}
            />
          </div>

          <div className="flex gap-3.5 flex-wrap">
            <div className="flex flex-col gap-1.5 flex-1 min-w-[150px]">
              <label className={labelCls}>Start date</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1.5 flex-1 min-w-[150px]">
              <label className={labelCls}>End date</label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
          </div>

          <div className="flex gap-3.5 flex-wrap">
            <div className="flex flex-col gap-1.5 flex-1 min-w-[120px]">
              <label className={labelCls}>Budget</label>
              <input
                type="number"
                name="budget"
                value={form.budget}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1.5 flex-1 min-w-[110px]">
              <label className={labelCls}>Currency</label>
              <select
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className={inputCls}
              >
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
                <option value="CHF">CHF</option>
              </select>
            </div>

          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className={`${inputCls} resize-y`}
            />
          </div>

          {error && (
            <p className="text-sm text-[#b25c4e] bg-[#fbeeec] border border-[#f3d6d1] rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-2.5 mt-1">
            <button type="submit" className={primaryBtn}>
              <i className="ph-bold ph-check" /> Save changes
            </button>
            <button type="button" onClick={() => navigate("/trips")} className={ghostBtn}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTripPage;

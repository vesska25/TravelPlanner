import { useState, useEffect } from "react";
import { apiFetch } from "../api";
import { useParams, useNavigate } from "react-router-dom";

import {
  flagUrl,
  flagThumb,
  countryName,
  dateRange,
  money,
  statusMeta,
  categoryMeta,
  inputCls,
  labelCls,
  primaryBtn,
} from "../lib/trip";

function TripDetailPage() {
  const { id } = useParams(); // trip id from the URL
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null); // the trip itself (null until loaded)
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
    return (
      <div className="min-h-screen bg-[#f5f9fb] flex items-center justify-center">
        <p className="text-[#5b7785]">Loading…</p>
      </div>
    );
  }

  const st = statusMeta(trip.status);

  return (
    <div className="min-h-screen bg-[#f5f9fb] px-6 py-7">
      <div className="max-w-[820px] mx-auto">
        <button
          onClick={() => navigate("/trips")}
          className="inline-flex items-center gap-1.5 text-sm text-[#5b7785] hover:text-[#143642] transition-colors mb-4.5 cursor-pointer"
        >
          <i className="ph ph-arrow-left" /> All trips
        </button>

        {/* hero banner — country flag */}
        <div className="relative rounded-[20px] overflow-hidden bg-[#dfeaee] h-[200px] flex items-end p-6">
          {trip.country && (
            <img
              src={flagUrl(trip.country)}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(160deg,rgba(255,255,255,0.05) 0%,rgba(15,42,51,0.58) 100%)",
            }}
          />
          <div className="relative w-full">
            <div className="flex items-center gap-2 mb-2">
              {trip.country && (
                <span className="flex items-center gap-1.5 bg-white/92 pl-[5px] pr-2.5 py-1 rounded-full text-[12px] font-semibold text-[#143642]">
                  <img src={flagThumb(trip.country)} alt="" className="w-[18px] h-[13px] rounded-sm block" />
                  {countryName(trip.country)}
                </span>
              )}
              <span
                className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide"
                style={{ background: st.bg, color: st.color }}
              >
                {st.label}
              </span>
            </div>
            <h1 className="font-display text-[30px] font-extrabold tracking-tight text-white drop-shadow-[0_1px_12px_rgba(15,42,51,0.45)]">
              {trip.name}
            </h1>
          </div>
        </div>

        {/* stat row */}
        <div className="flex gap-2.5 mt-4 flex-wrap">
          <div className="flex-1 min-w-[130px] bg-white border border-[#e6eef2] rounded-[14px] px-4 py-3.5">
            <div className="text-[12px] text-[#5b7785] flex items-center gap-1.5">
              <i className="ph ph-calendar-blank" /> Dates
            </div>
            <div className="font-display font-bold text-[16px] mt-1">
              {dateRange(trip.startDate, trip.endDate)}
            </div>
          </div>
          <div className="flex-1 min-w-[130px] bg-white border border-[#e6eef2] rounded-[14px] px-4 py-3.5">
            <div className="text-[12px] text-[#5b7785] flex items-center gap-1.5">
              <i className="ph ph-wallet" /> Budget
            </div>
            <div className="font-display font-bold text-[16px] mt-1">
              {money(trip.budget, trip.currency)}
            </div>
          </div>
          <div className="flex-1 min-w-[130px] bg-white border border-[#e6eef2] rounded-[14px] px-4 py-3.5">
            <div className="text-[12px] text-[#5b7785] flex items-center gap-1.5">
              <i className="ph ph-map-pin" /> Places
            </div>
            <div className="font-display font-bold text-[16px] mt-1">{places.length}</div>
          </div>
          <button
            onClick={() => navigate(`/trips/${id}/edit`)}
            className="bg-white border border-[#e6eef2] rounded-[14px] px-[18px] cursor-pointer text-[#1f6f86] font-semibold text-sm flex items-center gap-2 hover:border-[#2f93ab] transition-colors"
          >
            <i className="ph ph-pencil-simple" /> Edit
          </button>
        </div>

        {trip.description && (
          <p className="mt-4.5 mx-0.5 text-[#3f5a64] text-[15px] leading-relaxed">
            {trip.description}
          </p>
        )}

        {/* places list */}
        <div className="bg-white border border-[#e6eef2] rounded-[18px] p-5.5 mt-5.5">
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="font-display text-[19px] font-bold">Places</h2>
            <span className="text-[13px] text-[#5b7785]">{places.length} saved</span>
          </div>

          {places.length === 0 ? (
            <p className="text-[#5b7785] text-sm">No places yet — add your first one below.</p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {places.map((place) => {
                const cat = categoryMeta(place.category);
                return (
                  <div
                    key={place.id}
                    className="flex items-center gap-3.5 bg-[#f5f9fb] border border-[#e6eef2] rounded-[13px] px-3.5 py-2.5"
                  >
                    <div className="w-[38px] h-[38px] flex-none rounded-[10px] bg-[#eaf4f7] text-[#1f6f86] flex items-center justify-center text-lg">
                      <i className={`ph ${cat.icon}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[15px] text-[#143642]">{place.name}</div>
                      <div className="text-[13px] text-[#5b7785]">
                        {place.city ? `${place.city} · ` : ""}
                        {cat.label}
                      </div>
                    </div>
                    {place.visited && (
                      <span className="flex items-center gap-1.5 text-[#2f8a6a] text-[12px] font-semibold bg-[#e3f3ec] px-2.5 py-1 rounded-full">
                        <i className="ph-bold ph-check" /> visited
                      </span>
                    )}
                    <button
                      onClick={() => handleDeletePlace(place.id)}
                      title="Delete"
                      className="text-[#a9b9bf] hover:text-[#b25c4e] text-[17px] flex items-center transition-colors cursor-pointer"
                    >
                      <i className="ph ph-trash" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* add place form */}
        <div className="bg-white border border-[#e6eef2] rounded-[18px] p-5.5 mt-4.5">
          <h3 className="font-display text-[17px] font-bold mb-4">Add a place</h3>
          <form onSubmit={handlePlaceSubmit} className="flex flex-col gap-3.5">
            <div className="flex gap-3.5 flex-wrap">
              <div className="flex-[2] min-w-[180px] flex flex-col gap-1.5">
                <label className={labelCls}>Name</label>
                <input
                  name="name"
                  value={placeForm.name}
                  onChange={handlePlaceChange}
                  placeholder="e.g. Blue Dome Café"
                  className={inputCls}
                />
              </div>
              <div className="flex-1 min-w-[140px] flex flex-col gap-1.5">
                <label className={labelCls}>City</label>
                <input
                  name="city"
                  value={placeForm.city}
                  onChange={handlePlaceChange}
                  placeholder="e.g. Oia"
                  className={inputCls}
                />
              </div>
            </div>

            <div className="flex gap-3.5 flex-wrap items-end">
              <div className="flex-1 min-w-[160px] flex flex-col gap-1.5">
                <label className={labelCls}>Category</label>
                <select
                  name="category"
                  value={placeForm.category}
                  onChange={handlePlaceChange}
                  className={inputCls}
                >
                  <option value="RESTAURANT">Restaurant</option>
                  <option value="HOTEL">Hotel</option>
                  <option value="MUSEUM">Museum</option>
                  <option value="ATTRACTION">Attraction</option>
                  <option value="NATURE">Nature</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm text-[#143642] pb-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  name="visited"
                  checked={placeForm.visited}
                  onChange={handlePlaceChange}
                  className="w-[17px] h-[17px] accent-[#2f93ab]"
                />
                Already visited
              </label>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Notes</label>
              <textarea
                name="notes"
                value={placeForm.notes}
                onChange={handlePlaceChange}
                rows={2}
                placeholder="Optional notes…"
                className={`${inputCls} resize-y`}
              />
            </div>

            <button type="submit" className={`${primaryBtn} self-start`}>
              <i className="ph-bold ph-plus" /> Add place
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TripDetailPage;

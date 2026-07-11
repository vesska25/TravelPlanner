import { useState, useEffect } from "react";
import { apiFetch } from "../api";
import { useParams, useNavigate } from "react-router-dom";
import TripMap from "../components/TripMap";
import BackButton from "../components/BackButton";

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

  // A place is now defined by: a geocoded location (name = full address + coords),
  // a category, and whether it's been visited. No manual name/city/notes anymore.
  const [placeForm, setPlaceForm] = useState({
    name: "", // filled from the chosen location's display_name
    category: "RESTAURANT",
    visited: false,
    latitude: null,
    longitude: null,
  });

  // --- location search (geocoding) state ---
  const [locationQuery, setLocationQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);

  function handlePlaceChange(event) {
    const { name, value, type, checked } = event.target;
    setPlaceForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // Ask Nominatim to geocode the typed text. Button-triggered (not per keystroke)
  // to respect Nominatim's ~1 request/second policy. accept-language=en forces
  // English results regardless of the user's system/browser language.
  async function searchLocation() {
    const query = locationQuery.trim();
    if (query === "") return;

    setSearching(true);
    setResults([]);
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query
      )}&format=json&limit=5&accept-language=en`;
      const res = await fetch(url); // plain fetch: external service, no JWT
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Geocoding failed:", error);
    } finally {
      setSearching(false);
    }
  }

  // User picked a result: store its full address as the place name, plus coordinates.
  function selectLocation(result) {
    setPlaceForm((prev) => ({
      ...prev,
      name: result.display_name, // the full technical address becomes the place name
      latitude: parseFloat(result.lat), // Nominatim returns strings; backend wants Double
      longitude: parseFloat(result.lon),
    }));
    setLocationQuery(result.display_name); // reflect the choice in the search box
    setResults([]); // hide the dropdown
  }

  async function handlePlaceSubmit(event) {
    event.preventDefault();

    // Guard: don't submit without a chosen location (no coords = nothing to map).
    if (placeForm.latitude === null) return;

    try {
      const response = await apiFetch(`/api/trips/${id}/places`, {
        method: "POST",
        body: JSON.stringify(placeForm),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message ?? "Couldn't add the place. Please try again.");
        return;
      }

      const newPlace = await response.json();
      setPlaces((prev) => [...prev, newPlace]);

      // reset the form and the search UI
      setPlaceForm({
        name: "",
        category: "RESTAURANT",
        visited: false,
        latitude: null,
        longitude: null,
      });
      setLocationQuery("");
      setResults([]);
    } catch (error) {
      alert("Couldn't add the place. Please try again.");
    }
  }

  // Toggle a place's "visited" flag. We update the UI immediately (optimistic update)
  // for a snappy feel, AND persist to the backend so the change survives a reload.
  // If the server rejects it, we roll the UI back to the truth.
  async function toggleVisited(place) {
    const updated = { ...place, visited: !place.visited };

    // optimistic: flip it in local state right away
    setPlaces((prev) => prev.map((p) => (p.id === place.id ? updated : p)));

    try {
      // The PUT endpoint expects the WHOLE place object, so we send all fields,
      // not just `visited`. `updated` already has everything with the flag flipped.
      const response = await apiFetch(`/api/places/${place.id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: updated.name,
          category: updated.category,
          latitude: updated.latitude,
          longitude: updated.longitude,
          visited: updated.visited,
        }),
      });

      if (!response.ok) {
        // roll back to the previous value — the server didn't accept the change
        setPlaces((prev) => prev.map((p) => (p.id === place.id ? place : p)));
        console.error("Failed to update place");
      }
    } catch (error) {
      // network error → roll back too
      setPlaces((prev) => prev.map((p) => (p.id === place.id ? place : p)));
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
        alert("Couldn't delete the place. Please try again.");
        return;
      }

      setPlaces((prev) => prev.filter((place) => place.id !== placeId));
    } catch (error) {
      alert("Couldn't delete the place. Please try again.");
    }
  }

  useEffect(() => {
    async function loadData() {
      try {
        const tripResponse = await apiFetch(`/api/trips/${id}`);
        if (!tripResponse.ok) {
          throw new Error("Couldn't load this trip.");
        }
        setTrip(await tripResponse.json());

        const placesResponse = await apiFetch(`/api/trips/${id}/places`);
        if (placesResponse.ok) {
          setPlaces(await placesResponse.json());
        }
      } catch (err) {
        setError(err.message || "Couldn't load this trip.");
      }
    }

    loadData();
  }, [id]);

  if (error) {
    return (
        <div className="min-h-screen bg-[#f5f9fb] flex flex-col items-center justify-center gap-4">
          <p className="text-[#b25c4e]">{error}</p>
          <BackButton />
        </div>
    );
  }

  if (!trip) {
    return (
        <div className="min-h-screen bg-[#f5f9fb] flex items-center justify-center">
          <p className="text-[#5b7785]">Loading…</p>
        </div>
    );
  }

  const st = statusMeta(trip.status);

  // whether the user has picked a location yet — gates the submit button
  const hasLocation = placeForm.latitude !== null;

  return (
      <div className="min-h-screen bg-[#f5f9fb] px-6 py-7">
        <div className="max-w-[820px] mx-auto">
          <BackButton />

          {/* hero banner — country flag */}
          <div className="relative rounded-[20px] overflow-hidden bg-[#dfeaee] h-[200px] flex items-end p-6">
            {trip.country && (
                <img
                    src={flagUrl(trip.country)}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover object-center"
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
                    // visited places get a green treatment; unvisited keep the neutral coastal look
                    const cardCls = place.visited
                        ? "bg-[#e9f5ee] border-[#bfe2cd]"
                        : "bg-[#f5f9fb] border-[#e6eef2]";
                    const iconCls = place.visited
                        ? "bg-[#cfeadb] text-[#2f8a6a]"
                        : "bg-[#eaf4f7] text-[#1f6f86]";
                    return (
                        <div
                            key={place.id}
                            onClick={() => toggleVisited(place)}
                            title={place.visited ? "Mark as not visited" : "Mark as visited"}
                            className={`flex items-start gap-3.5 border rounded-[13px] px-3.5 py-2.5 cursor-pointer transition-colors ${cardCls}`}
                        >
                          <div className={`w-[38px] h-[38px] flex-none rounded-[10px] flex items-center justify-center text-lg mt-0.5 transition-colors ${iconCls}`}>
                            <i className={`ph ${cat.icon}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-[14px] text-[#143642] leading-snug">
                              {place.name}
                            </div>
                            <div className="text-[13px] text-[#5b7785] mt-0.5">{cat.label}</div>
                          </div>
                          {place.visited && (
                              <span className="flex-none flex items-center gap-1.5 text-[#2f8a6a] text-[12px] font-semibold bg-[#d3edde] px-2.5 py-1 rounded-full mt-0.5">
                        <i className="ph-bold ph-check" /> visited
                      </span>
                          )}
                          <button
                              onClick={(e) => {
                                e.stopPropagation(); // don't let the delete click also toggle visited
                                handleDeletePlace(place.id);
                              }}
                              title="Delete"
                              className="flex-none text-[#a9b9bf] hover:text-[#b25c4e] text-[17px] flex items-center transition-colors cursor-pointer mt-1"
                          >
                            <i className="ph ph-trash" />
                          </button>
                        </div>
                    );
                  })}
                </div>
            )}
          </div>

          {/* map — shown only once there's at least one located place */}
          {places.some((p) => p.latitude != null && p.longitude != null) && (
              <div className="bg-white border border-[#e6eef2] rounded-[18px] p-3 mt-4.5">
                <TripMap places={places} center={[48.0, 10.0]} />
              </div>
          )}

          {/* add place form */}
          <div className="bg-white border border-[#e6eef2] rounded-[18px] p-5.5 mt-4.5">
            <h3 className="font-display text-[17px] font-bold mb-4">Add a place</h3>
            <form onSubmit={handlePlaceSubmit} className="flex flex-col gap-3.5">
              {/* --- location search (geocoding) --- */}
              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Location</label>
                <div className="flex gap-2">
                  <input
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault(); // Enter searches, doesn't submit the form
                          searchLocation();
                        }
                      }}
                      placeholder="Search a place, address or landmark…"
                      className={`${inputCls} flex-1`}
                  />
                  <button
                      type="button"
                      onClick={searchLocation}
                      disabled={searching}
                      className="flex-none px-4 rounded-xl bg-[#eaf4f7] text-[#1f6f86] font-semibold text-sm hover:bg-[#d9ecf1] transition-colors cursor-pointer disabled:opacity-60"
                  >
                    {searching ? "…" : "Search"}
                  </button>
                </div>

                {/* results dropdown */}
                {results.length > 0 && (
                    <div className="border border-[#e6eef2] rounded-xl overflow-hidden mt-1">
                      {results.map((r) => (
                          <button
                              key={r.place_id}
                              type="button"
                              onClick={() => selectLocation(r)}
                              className="w-full text-left px-3.5 py-2.5 text-[13px] text-[#3f5a64] hover:bg-[#f1f6f8] border-b border-[#eef4f6] last:border-b-0 cursor-pointer"
                          >
                            {r.display_name}
                          </button>
                      ))}
                    </div>
                )}

                {/* chosen location confirmation */}
                {hasLocation && (
                    <p className="text-[13px] text-[#2f8a6a] flex items-start gap-1.5 mt-1">
                      <i className="ph-fill ph-map-pin mt-0.5 flex-none" />
                      <span>Location set</span>
                    </p>
                )}
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
              </div>

              <button
                  type="submit"
                  disabled={!hasLocation}
                  className={`${primaryBtn} self-start disabled:opacity-50 disabled:cursor-not-allowed`}
                  title={hasLocation ? "" : "Search and pick a location first"}
              >
                <i className="ph-bold ph-plus" /> Add place
              </button>
            </form>
          </div>
        </div>
      </div>
  );
}

export default TripDetailPage;
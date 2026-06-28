import { useState, useEffect } from "react";
import { apiFetch } from "../api";
import { useNavigate } from "react-router-dom";

import {
  flagUrl,
  flagThumb,
  countryName,
  dateRange,
  money,
  statusMeta,
  primaryBtn,
} from "../lib/trip";

function TripsPage() {
  const [trips, setTrips] = useState([]); // start with an empty list
  const [loading, setLoading] = useState(true); // true until the first load finishes
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  // runs once, after the component first appears on screen
  useEffect(() => {
    async function loadTrips() {
      try {
        const response = await apiFetch("/api/trips");
        const data = await response.json();
        setTrips(data);
      } catch (error) {
        console.error("Failed to load trips:", error);
      } finally {
        setLoading(false); // stop loading no matter what
      }
    }

    loadTrips();
  }, []);

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

      // remove the deleted trip from state
      setTrips((prev) => prev.filter((trip) => trip.id !== id));
    } catch (error) {
      console.error("Request failed:", error);
    }
  }

  const filters = [
    { key: "all", label: "All" },
    { key: "PLANNED", label: "Planned" },
    { key: "ONGOING", label: "Ongoing" },
    { key: "COMPLETED", label: "Completed" },
  ];

  const visible = trips.filter((t) => filter === "all" || t.status === filter);

  const upcoming = trips.filter((t) => t.status === "PLANNED").length;
  const ongoing = trips.filter((t) => t.status === "ONGOING").length;

  return (
    <div className="min-h-screen bg-[#f5f9fb] px-6 py-8">
      <div className="max-w-5xl mx-auto">
        {/* header */}
        <div className="flex items-end justify-between gap-5">
          <div>
            <h1 className="font-display text-[34px] font-extrabold tracking-tight text-[#143642]">
              My Trips
            </h1>
            <p className="text-[#5b7785] text-[15px] mt-1.5">
              {trips.length} journeys · {upcoming} upcoming · {ongoing} on the road
            </p>
          </div>
          <button
            onClick={() => navigate("/trips/new")}
            className={`${primaryBtn} shadow-[0_6px_16px_rgba(47,147,171,0.32)]`}
          >
            <i className="ph-bold ph-plus" /> New trip
          </button>
        </div>

        {/* filter chips */}
        <div className="flex gap-2 mt-5 flex-wrap">
          {filters.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="px-4 py-1.5 rounded-full text-[13px] font-semibold border transition-colors cursor-pointer"
                style={{
                  background: active ? "#143642" : "#ffffff",
                  color: active ? "#ffffff" : "#5b7785",
                  borderColor: active ? "#143642" : "#e0e9ee",
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* body */}
        {loading ? (
          <p className="text-[#5b7785] mt-8">Loading trips…</p>
        ) : visible.length === 0 ? (
          <div className="mt-10 text-center px-5 py-14 bg-white border border-dashed border-[#cfe0e7] rounded-[18px]">
            <div className="w-14 h-14 rounded-2xl bg-[#eaf4f7] text-[#2f93ab] flex items-center justify-center text-[28px] mx-auto mb-4">
              <i className="ph ph-suitcase-rolling" />
            </div>
            <h3 className="font-display text-[19px] font-bold mb-1.5">No trips here yet</h3>
            <p className="text-[#5b7785] text-sm mb-4">Start planning your first journey.</p>
            <button onClick={() => navigate("/trips/new")} className={primaryBtn}>
              <i className="ph-bold ph-plus" /> New trip
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px] mt-[22px]">
            {visible.map((trip) => {
              const st = statusMeta(trip.status);
              return (
                <div
                  key={trip.id}
                  onClick={() => navigate(`/trips/${trip.id}`)}
                  className="group bg-white border border-[#e6eef2] rounded-[18px] overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(20,54,66,0.16)]"
                >
                  {/* flag cover */}
                  <div className="relative h-[148px] overflow-hidden bg-[#dfeaee]">
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
                          "linear-gradient(160deg,rgba(255,255,255,0.08) 0%,rgba(15,42,51,0.5) 100%)",
                      }}
                    />
                    {trip.country && (
                      <span className="absolute top-3 left-3 flex items-center bg-white/90 p-[5px] rounded-lg">
                        <img
                          src={flagThumb(trip.country)}
                          alt=""
                          className="w-[22px] h-4 rounded-sm block"
                        />
                      </span>
                    )}
                    <span
                      className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide"
                      style={{ background: st.bg, color: st.color }}
                    >
                      {st.label}
                    </span>
                    <span className="absolute bottom-2.5 left-3.5 text-white font-display font-extrabold text-[18px] uppercase tracking-wide drop-shadow-[0_1px_10px_rgba(15,42,51,0.5)]">
                      {countryName(trip.country)}
                    </span>
                  </div>

                  {/* body */}
                  <div className="px-[18px] pt-[15px] pb-4">
                    <h2 className="font-display text-[18px] font-bold tracking-tight text-[#143642]">
                      {trip.name}
                    </h2>
                    <div className="flex gap-4 mt-2.5 text-[#5b7785] text-[13px] flex-wrap">
                      <span className="flex items-center gap-1.5">
                        <i className="ph ph-calendar-blank" />{" "}
                        {dateRange(trip.startDate, trip.endDate)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <i className="ph ph-wallet" /> {money(trip.budget, trip.currency)}
                      </span>
                    </div>

                    {/* actions — stopPropagation so the card click doesn't fire */}
                    <div className="flex gap-2 mt-3.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/trips/${trip.id}/edit`);
                        }}
                        className="flex items-center gap-1.5 text-[13px] font-semibold text-[#1f6f86] bg-[#eaf4f7] hover:bg-[#d9ecf1] rounded-[9px] px-3 py-1.5 transition-colors cursor-pointer"
                      >
                        <i className="ph ph-pencil-simple" /> Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(trip.id);
                        }}
                        className="flex items-center gap-1.5 text-[13px] font-semibold text-[#b25c4e] bg-[#fbeeec] hover:bg-[#f6ddd9] rounded-[9px] px-3 py-1.5 transition-colors cursor-pointer"
                      >
                        <i className="ph ph-trash" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default TripsPage;

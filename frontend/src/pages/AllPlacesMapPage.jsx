import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { apiFetch } from "../api";
import { categoryMeta } from "../lib/trip";
import BackButton from "../components/BackButton.jsx";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function AllPlacesMapPage() {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load every place across all of the user's trips (backend filters by owner).
    useEffect(() => {
        async function load() {
            try {
                const res = await apiFetch("/api/places");
                if (res.ok) {
                    setPlaces(await res.json());
                }
            } catch (error) {
                console.error("Failed to load places:", error);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    // Only places with coordinates can be drawn.
    const located = places.filter(
        (p) => p.latitude != null && p.longitude != null
    );

    return (
        <div className="min-h-screen bg-[#f5f9fb] px-6 py-8">
            <div className="max-w-5xl mx-auto">
                <BackButton />
                <h1 className="font-display text-[30px] font-extrabold tracking-tight text-[#143642] mb-1">
                    Your world map
                </h1>
                <p className="text-[#5b7785] text-[15px] mb-5">
                    {loading
                        ? "Loading your places…"
                        : `${located.length} place${located.length === 1 ? "" : "s"} across all your trips`}
                </p>

                <div className="bg-white border border-[#e6eef2] rounded-[18px] p-3">
                    {/* Fixed world view: center near [20, 0] at a low zoom shows the whole
              planet. The center does NOT depend on the places, so there's no
              data-race: the map is born showing the world, markers appear on it
              as data arrives. */}
                    <MapContainer
                        center={[20, 0]}
                        zoom={2}
                        minZoom={2}
                        scrollWheelZoom={false}
                        maxBounds={[
                            [-85, -Infinity], // no horizontal limit — the world wraps east/west freely
                            [85, Infinity],
                        ]}
                        maxBoundsViscosity={1.0}
                        worldCopyJump={true} // makes markers/panning behave correctly across world copies
                        style={{ height: "560px", width: "100%", borderRadius: "14px" }}
                    >
                        <TileLayer
                            attribution="&copy; OpenStreetMap contributors"
                            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                            noWrap={false}
                        />

                        {located.map((place) => (
                            <Marker key={place.id} position={[place.latitude, place.longitude]}>
                                <Popup>
                  <span style={{ fontWeight: 600 }}>
                    {categoryMeta(place.category).label}
                  </span>
                                    <br />
                                    {place.name}
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
}
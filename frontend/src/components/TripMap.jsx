import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { categoryMeta } from "../lib/trip";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});


export default function TripMap({ places, center }) {
    // Keep only places that actually have coordinates — the rest can't be mapped.
    const located = places.filter(
        (p) => p.latitude != null && p.longitude != null
    );

    // Decide where to center the map:
    //   - if we have located places, center on the first one
    //   - otherwise fall back to the country center passed in via props
    const mapCenter =
        located.length > 0
            ? [located[0].latitude, located[0].longitude]
            : center;

    // If we don't even have a fallback center yet, render nothing (avoids a crash).
    if (!mapCenter) return null;

    return (
        <MapContainer
            center={mapCenter}
            zoom={located.length > 0 ? 12 : 5}
            scrollWheelZoom={false} // avoid hijacking page scroll; users zoom with buttons/pinch
            style={{ height: "360px", width: "100%", borderRadius: "14px" }}
        >
            {/* The actual map imagery, from OpenStreetMap's free tile servers. */}
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {located.map((place) => (
                <Marker key={place.id} position={[place.latitude, place.longitude]}>
                    <Popup>
                        <span style={{ fontWeight: 600 }}>{categoryMeta(place.category).label}</span>
                        <br />
                        {place.name}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
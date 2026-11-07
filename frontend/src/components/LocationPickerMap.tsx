import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CircleMarker, MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function UpdateView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => { map.setView(center, zoom); }, [center, map, zoom]);
  return null;
}

function ClickToSelect({ onSelect }: { onSelect: (latitude: number, longitude: number) => void }) {
  useMapEvents({ click(event) { onSelect(event.latlng.lat, event.latlng.lng); } });
  return null;
}

export function LocationPickerMap({ latitude, longitude, onSelect }: { latitude: number; longitude: number; onSelect: (latitude: number, longitude: number) => void }) {
  const [placeQuery, setPlaceQuery] = useState("");
  const [results, setResults] = useState<{ lat: string; lon: string; display_name: string }[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const hasLocation = Number.isFinite(latitude) && Number.isFinite(longitude) && !(latitude === 0 && longitude === 0);
  const center: [number, number] = hasLocation ? [latitude, longitude] : [16.54, 81.49];

  async function searchPlace() {
    const query = placeQuery.trim();
    if (!query) return;
    setSearching(true);
    setSearchError("");
    setResults([]);
    try {
      // Search only after an explicit user action; this is not autocomplete.
      const endpoint = import.meta.env.VITE_GEOCODING_URL || "https://nominatim.openstreetmap.org/search";
      const params = new URLSearchParams({ q: query, format: "jsonv2", limit: "5" });
      const response = await fetch(`${endpoint}?${params}`, { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error("Place search is temporarily unavailable. You can still choose the location on the map.");
      const places = await response.json() as { lat: string; lon: string; display_name: string }[];
      if (places.length === 0) setSearchError("No matching village or place found. Try adding the district or state, or click the map.");
      else setResults(places);
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : "Could not search for that place.");
    } finally {
      setSearching(false);
    }
  }

  return <div>
    <p className="mb-2 text-sm text-muted-foreground">Search for a village, town, or address, select a result, then click the map to fine-tune the pin.</p>
    <div className="mb-2 flex gap-2">
      <Input aria-label="Village, town, or address" value={placeQuery} onChange={(event) => setPlaceQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); void searchPlace(); } }} placeholder="Village or town name (include district/state)" />
      <Button type="button" variant="outline" disabled={searching || !placeQuery.trim()} onClick={() => void searchPlace()}>{searching ? "Searching…" : "Search place"}</Button>
    </div>
    {searchError && <p role="status" className="mb-2 text-sm text-amber-700">{searchError}</p>}
    {results.length > 0 && <div className="mb-2 max-h-36 space-y-1 overflow-y-auto rounded-md border p-2">{results.map((place) => <button type="button" key={`${place.lat},${place.lon}`} onClick={() => { onSelect(Number(place.lat), Number(place.lon)); setResults([]); }} className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-muted">{place.display_name}</button>)}</div>}
    <MapContainer center={center} zoom={hasLocation ? 14 : 6} scrollWheelZoom className="h-[320px] w-full rounded-lg border">
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <UpdateView center={center} zoom={hasLocation ? 14 : 6} />
      <ClickToSelect onSelect={onSelect} />
      {hasLocation && <CircleMarker center={center} radius={10} pathOptions={{ color: "#fff", weight: 2, fillColor: "#ef4444", fillOpacity: 0.95 }} />}
    </MapContainer>
    <p className="mt-2 text-xs text-muted-foreground">Selected coordinates: {hasLocation ? `${latitude.toFixed(5)}, ${longitude.toFixed(5)}` : "search for a place or click the map"} · Place search © OpenStreetMap contributors</p>
  </div>;
}

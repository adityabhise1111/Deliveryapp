import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import type { LatLngExpression } from "leaflet";

export interface IPosition {
    latitude: number;
    longitude: number;
}
interface INewMapProps {
    pos: LatLngExpression;
}

const NewMap = ({ pos }: INewMapProps) => {
    const map = useMap();
    useEffect(() => {
        map.setView(pos);
    }, [pos, map]);
    return null;

}

const LiveMap = () => {
    const [userPosition, setUserPosition] = useState<LatLngExpression>([18.5204, 73.8567]);
    useEffect(() => {
        if (!navigator.geolocation) {
            alert("Geolocation not supported");
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserPosition([latitude, longitude]);
            },
            (error) => {
                console.error("Geolocation error:", error);
                alert(`${error.code}: ${error.message}`);
            }
            , {
                enableHighAccuracy: true,
                timeout: 30000,
                maximumAge: 10000
            }
        );
        return () => {
            navigator.geolocation.clearWatch(watchId);
        }

    }, []);

    return (
        <div className="absolute inset-0">
            <MapContainer
                // center ={userPosition}
                zoom={13}
                className="h-[50%] w-full z-0"
            >
                <TileLayer
                    url={`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${import.meta.env.VITE_GEOAPIFY_API_KEY}`}
                />
                <Marker position={userPosition} />
                <NewMap pos={userPosition} />
            </MapContainer>
        </div>
    );
};

export default LiveMap;

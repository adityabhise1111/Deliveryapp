import { MapContainer, TileLayer, Marker  } from "react-leaflet";

const LiveMap = () => {
  const position = [18.5204, 73.8567];

  return (
    <div className="absolute inset-0">
      <MapContainer
        center={position}
        zoom={13}
        className="h-[50%] w-full"
      >
        <TileLayer
          url={`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${import.meta.env.VITE_GEOAPIFY_API_KEY}`}
        />
        <Marker position={position} />
      </MapContainer>
    </div>
  );
};

export default LiveMap;

import axios, { isAxiosError } from 'axios';

const geoapifyApiKey = process.env.GEOAPIFY_API_KEY;
if (!geoapifyApiKey) {
    throw new Error('GEOAPIFY_API_KEY is not set in environment variables');
}


interface OpenCageGeometry {
    lat: number;
    lng: number;
}

interface OpenCageResult {
    geometry: OpenCageGeometry;
}

interface OpenCageResponse {
    results: OpenCageResult[];
}

interface NominatimResult {
    lat: string;
    lon: string;
    display_name: string;
}

// export async function getAddressCoordinate(address:string):Promise<{lat:number,lng:number}> {
//     console.log("[maps.service] getAddressCoordinate called");
//     console.log("Geocoding address:", address);
//     const apikey = process.env.GOOGLE_MAPS_API_KEY;
//     if (!apikey) {
//         throw new Error('GOOGLE_MAPS_API_KEY is not set in environment variables');
//     }
//     console.log("[maps.service] API Key exists:", apikey ? 'Yes' : 'No');
//     console.log("[maps.service] API Key length:", apikey?.length);

//     const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apikey}`;
//     try {
//         console.log("[maps.service] Making request to Google Maps API...");
//         const response = await axios.get(url);

//         console.log("[maps.service] Response status:", response.data.status);
//         console.log("[maps.service] Full response:", JSON.stringify(response.data, null, 2));

//         if(response.data.status === 'OK'){
//             const location = response.data.results[0].geometry.location;
//             return {
//                 lat: location.lat,
//                 lng: location.lng
//             };
//         } else {
//             const errorMessage = response.data.error_message || 'No error message provided';
//             console.error("[maps.service] Google API Error:", {
//                 status: response.data.status,
//                 error_message: errorMessage
//             });
//             throw new Error(`Geocoding error: ${response.data.status} - ${errorMessage}`);
//         }
//     } catch (error) {
//         console.error("[maps.service] Error in getAddressCoordinate:", error);
//         if (axios.isAxiosError(error)) {
//             console.error("[maps.service] Axios error details:", {
//                 status: error.response?.status,
//                 data: error.response?.data
//             });
//         }
//         throw error;
//     }
// }

// export async function getAddressCoordinates(address: string) {
//     const apiKey = process.env.OPENCAGE_API_KEY; // <-- Store your key in .env file
//     const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`;

//     const response = await axios.get<OpenCageResponse>(url);
//     const data = response.data;

//     if (!data.results || data.results.length === 0) {
//         return null;
//     }

//     // Take first result
//     const { lat, lng } = data.results[0].geometry;
//     return { lat, lng };
// }



export async function getAddressCoordinates(address: string): Promise<{ lat: number; lon: number } | null> {
    try {
        console.log("[maps.service] Fetching coordinates for:", address);

        // ✅ Proper Geoapify API URL
        const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${geoapifyApiKey}`;

        const response = await axios.get(url, {
            timeout: 10000,
        });

        const data = response.data;

        if (!data || !data.features || data.features.length === 0) {
            console.log("[maps.service] No results found for address:", address);
            return null;
        }

        // ✅ Extract coordinates correctly from Geoapify response
        const { lat, lon } = data.features[0].properties;

        const result = { lat, lon };

        console.log("[maps.service] Coordinates found:", result);
        return result;
    } catch (error: any) {
        console.error("[maps.service] Error in getAddressCoordinates:", error.message || error);
        throw error;
    }
}

export async function getDistanceAndTime(
  origin: string,
  destination: string
): Promise<{ distance: number; duration: number } | null> {
  if (!origin || !destination) {
    throw new Error("Origin and destination are required");
  }

  try {
    // Get coordinates for both addresses
    const [orig, dest] = await Promise.all([
      getAddressCoordinates(origin),
      getAddressCoordinates(destination),
    ]);

    if (!orig || !dest) {
      console.log("[maps.service] Could not get coordinates for origin or destination");
      return null;
    }

    // Geoapify Routing API
    const url = `https://api.geoapify.com/v1/routing?waypoints=${orig.lat},${orig.lon}|${dest.lat},${dest.lon}&mode=drive&apiKey=${geoapifyApiKey}`;

    const { data } = await axios.get(url);

    if (!data.features || data.features.length === 0) {
      console.log("[maps.service] No route found between origin and destination");
      return null;
    }

    const route = data.features[0].properties;

    return {
      distance: route.distance, // meters
      duration: route.time,     // seconds
    };
  } catch (error) {
    console.error("[maps.service] Error in getDistanceAndTime:", error);
    throw error;
  }
}

export async function getSuggestions(input: string): Promise<string[]> {
    if (!input) {
        throw new Error('Input is required');
    }
    try {
        const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(input)}&apiKey=${geoapifyApiKey}&limit=5`;
        const response = await axios.get(url);
        const data = response.data;
        if (!data || !data.features) {
            console.log('[maps.service] No suggestions found for input:', input);
            return [];
        }
        const suggestions = data.features.map((feature: any) => feature.properties.formatted);
        return suggestions;

    } catch (error) {
        console.error('[maps.service] Error in getAutoCompleteSuggestions:', error);
        throw error;
    }
}
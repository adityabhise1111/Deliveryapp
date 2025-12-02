import axios from 'axios';
import captainModel from '../model/captain.model';

const geoapifyApiKey = process.env.GEOAPIFY_API_KEY;
if (!geoapifyApiKey) {
    throw new Error('GEOAPIFY_API_KEY is not set in environment variables');
}

import { ICaptain } from '../model/captain.model';

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
interface GeoapifyFeature {
    properties: {
        time: number;
        distance: number;
        formatted: string;
        lat: number;
        lon: number;
    };
    geometry?: {
        type: string;
        coordinates: [number, number];
    };
}

interface GeoapifyResponse {
    features: GeoapifyFeature[];
}




export async function getAddressCoordinates(address: string): Promise<{ lat: number; lon: number } | null> {
    try {
        console.log("[maps.service] Fetching coordinates for:", address);

        // ✅ Proper Geoapify API URL
        const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${geoapifyApiKey}`;

        const response = await axios.get<GeoapifyResponse>(url, {
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

    const { data } = await axios.get<GeoapifyResponse>(url);

    if (!data.features || data.features.length === 0) {
      console.log("[maps.service] No route found between origin and destination");
      return null;
    }

    const route = data.features[0].properties;

    return {
      distance: route.distance, // km
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
        const response = await axios.get<GeoapifyResponse>(url);
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

// export async function getCaptainsIntheRadius(
//   lat: number,  // Keep parameter name as lat for clarity
//   lng: number,
//   radius: number
// ): Promise<ICaptain[]> {
//     console.log(`[maps.service] Finding captains within ${radius} km of (${lat}, ${lng})`);
    
//     try {
//         // Use simple bounding box query since we're using ltd/lng (not proper GeoJSON)
//         const latDelta = radius / 111; // 1 degree lat ≈ 111 km
//         const lngDelta = radius / (111 * Math.cos(lat * Math.PI / 180));
        
//         const captains = await captainModel.find({
//             'location.ltd': { 
//                 $gte: lat - latDelta, 
//                 $lte: lat + latDelta 
//             },
//             'location.lng': { 
//                 $gte: lng - lngDelta, 
//                 $lte: lng + lngDelta 
//             },
//             status: 'active' // Only find active captains
//         });
        
//         console.log('[maps.service] Query conditions:', {
//             lat: { min: lat - latDelta, max: lat + latDelta },
//             lng: { min: lng - lngDelta, max: lng + lngDelta }
//         });
//         console.log('[maps.service] Captains found:', captains.length); 
        
//         return captains;
//     } catch (error) {
//         console.error('[maps.service] Error finding captains:', error);
//         throw error;
//     }
// }

export async function getCaptainsIntheRadius(
  lat: number,  // Keep parameter name as lat for clarity
  lng: number,
  radius: number
): Promise<ICaptain[]> {
    console.log(`[maps.service] Finding captains within ${radius} km of (${lat}, ${lng})`);
    try {
        const captains = await captainModel.find({
            location:{
                $geoWithin: {
                    $centerSphere: [ [ lat, lng ], radius / 6378.1 ] // radius in radians
                }
            }
        })
        return captains;
    } catch (error) {
        console.error('[maps.service] Error finding captains:', error);
        throw error;
    }
}
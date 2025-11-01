import axios, {type AxiosResponse} from 'axios';


export async function getAddressCoordinate(address:string):Promise<{lat:number,lng:number}> {
    console.log("[maps.service] getAddressCoordinate called");
    console.log("Geocoding address:", address);
    const apikey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apikey) {
        throw new Error('GOOGLE_MAPS_API_KEY is not set in environment variables');
    }
    console.log("[maps.service] API Key exists:", apikey ? 'Yes' : 'No');
    console.log("[maps.service] API Key length:", apikey?.length);
    
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apikey}`;
    try {
        console.log("[maps.service] Making request to Google Maps API...");
        const response: AxiosResponse = await axios.get(url);
        
        console.log("[maps.service] Response status:", response.data.status);
        console.log("[maps.service] Full response:", JSON.stringify(response.data, null, 2));
        
        if(response.data.status === 'OK'){
            const location = response.data.results[0].geometry.location;
            return {
                lat: location.lat,
                lng: location.lng
            };
        } else {
            const errorMessage = response.data.error_message || 'No error message provided';
            console.error("[maps.service] Google API Error:", {
                status: response.data.status,
                error_message: errorMessage
            });
            throw new Error(`Geocoding error: ${response.data.status} - ${errorMessage}`);
        }
    } catch (error) {
        console.error("[maps.service] Error in getAddressCoordinate:", error);
        if (axios.isAxiosError(error)) {
            console.error("[maps.service] Axios error details:", {
                status: error.response?.status,
                data: error.response?.data
            });
        }
        throw error;
    }
}
# Project Errors & Solutions

## Backend Errors

### 1. Double Slash in URL - `Cannot GET /rides //start-ride`

**Error Response:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>Cannot GET /rides //start-ride</pre>
</body>
</html>
```

**Cause:** Extra slash in the URL path

**Solution:** 
- Remove double slash
- Wrong: `http://localhost:4000/rides//start-ride?rideId=xxx&otp=xxx`
- Correct: `http://localhost:4000/rides/start-ride?rideId=xxx&otp=xxx`

---

### 2. "Ride not found or invalid OTP" Error

**Error Response:**
```json
{
  "message": "Ride not found or invalid OTP."
}
```

**Causes & Solutions:**

#### Cause 1: Ride Status is `pending` (not `accepted`)
- **Problem:** Ride must be confirmed by captain first before starting
- **Solution:** 
  1. Captain must call `POST /rides/confirm` with `rideId`
  2. This changes status from `pending` to `accepted`
  3. Then captain can call `/rides/start-ride`

#### Cause 2: Missing Captain Assignment
- **Problem:** Ride doesn't have a captain assigned
- **Solution:** Confirm the ride first (see Cause 1)

#### Cause 3: Invalid OTP
- **Problem:** OTP doesn't match the one in database
- **Solution:** Use the correct OTP from the ride document

**Workflow:**
```
1. Create Ride (User) → Status: pending
2. Confirm Ride (Captain) → Status: accepted + Captain assigned
3. Start Ride (Captain) → Status: ongoing
```

---

### 3. "User not found" Error on Captain Endpoints

**Error Response:**
```json
{
  "message": "User not found."
}
```

**Cause:** Wrong authentication middleware triggered or captain not found in database

**Solution:**
- Ensure you're using a valid **Captain authentication token**
- For captain-only routes (`/rides/confirm`, `/rides/start-ride`), you need captain JWT token
- Don't mix up user and captain tokens

---

## Frontend Errors

### 4. Geolocation Permission Blocked

**Error Message:**
```
Geolocation permission has been blocked as the user has dismissed 
the permission prompt several times. This can be reset in Page Info 
which can be accessed by clicking the tune icon next to the URL.
```

**Cause:** User dismissed location permission prompt multiple times, browser blocked it

**Solution:**
1. Click the **lock/info icon** 🔒 next to the URL in address bar
2. Go to **Site settings** or **Permissions**
3. Find **Location** permission
4. Change from "Blocked" to **"Allow"** or **"Ask"**
5. **Refresh the page** (F5 or Ctrl+R)

---

### 5. Location Not Updating on Captain Page

**Problem:** New location not showing up on captain page

**Cause 1: Multiple Permission Rejections**
- **Solution:** Click location icon in browser top bar and allow access (see Error #4)

**Cause 2: Captain Not in Radius**
- **Problem:** Captain is outside the search radius for available rides
- **Solution:** Increase the search radius in the code or get closer to user location

**Cause 3: Socket Not Connected**
- **Problem:** Real-time location updates depend on socket connection
- **Solution:** Check browser console for socket connection errors, verify socket server is running

---

### 6. "Captain Not Found" on Frontend

**Error:** Getting 404 or "Captain not found" when fetching captain data

**Cause:** Logged in with wrong account type

**Solution:** 
- Always login with the **respective account type**
- For Captain Pages: Login as **Captain** account
- For User Pages: Login as **User** account
- Don't mix accounts: User account cannot access Captain-only features

---

## Common API Integration Issues

### Issue 1: No Token/Authentication

**Symptom:** 401 Unauthorized errors

**Solution:**
- Verify token is stored in cookies or localStorage after login
- Pass token in request headers: `Authorization: Bearer <token>`
- Check token expiration

### Issue 2: CORS Errors

**Symptom:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
- Backend already has CORS enabled in `app.ts`
- Verify frontend is making requests to correct backend URL
- Check browser console for exact CORS error

### Issue 3: Socket Connection Issues

**Symptom:** Real-time updates not working (location, ride status, etc.)

**Solution:**
- Verify socket server is running on backend
- Check if socket endpoint matches in frontend context
- Look for socket connection errors in browser console

**Cause:** Logged in with wrong account type

**Solution:** 
- Always login with the **respective account type**
- For Captain APIs: Login as **Captain**
- For User APIs: Login as **User**
- Don't mix up: User account cannot access Captain-only endpoints

---

### 7. React-Leaflet Map Not Recentering on Live Location Updates

**Error Message:**
```
Type '{ children: Element[]; center: number[]; zoom: number; className: string; }' 
is not assignable to type 'IntrinsicAttributes & MapContainerProps & RefAttributes<LeafletMap>'.
Property 'center' does not exist on type 'IntrinsicAttributes & MapContainerProps & RefAttributes<LeafletMap>'.
```

**Symptoms:**
- Map doesn't move/recenter when user position changes
- Only the marker updates its position
- Browser console shows: `GeolocationPositionError: Timeout expired (code: 3)`
- TypeScript errors on `MapContainer` component

**Root Causes:**

#### Cause 1: Leaflet Map Doesn't Auto-Update on State Change
- **Problem:** `MapContainer`'s `center` prop only works on **initial render**
- Leaflet uses **imperative API** while React is **declarative**
- Updating React state doesn't trigger map re-centering

```tsx
// ❌ This doesn't work - map won't move when userPosition updates
<MapContainer center={userPosition} zoom={13}>
  <Marker position={userPosition} />
</MapContainer>
```

#### Cause 2: TypeScript Type Mismatch
- **Problem:** Leaflet expects `LatLngExpression` type: `[number, number]` or `{ lat, lng }`
- Custom objects like `{ latitude, longitude }` don't match Leaflet's structure

#### Cause 3: Geolocation Timeout on Desktop
- **Problem:** Desktop devices lack GPS, rely on slower WiFi/IP-based location
- `enableHighAccuracy: true` with short timeout causes frequent errors

**Solution:**

**Step 1:** Create a custom component using `useMap()` to imperatively control map view

```tsx
import { useMap } from "react-leaflet";
import { useEffect } from "react";
import type { LatLngExpression } from "leaflet";

interface INewMapProps {
  pos: LatLngExpression;
}

const NewMap = ({ pos }: INewMapProps) => {
  const map = useMap();

  useEffect(() => {
    map.setView(pos); // Imperatively move the map
  }, [pos, map]);

  return null;
};
```

**Step 2:** Use correct tuple format for positions

```tsx
// ✓ Correct - tuple format
const [userPosition, setUserPosition] = useState<LatLngExpression>([18.5204, 73.8567]);

// In watchPosition callback
setUserPosition([latitude, longitude]); // ✓ Tuple format
```

**Step 3:** Add the custom component to MapContainer

```tsx
<MapContainer center={userPosition} zoom={13} className="h-[50%] w-full">
  <TileLayer url="..." />
  <Marker position={userPosition} />
  <NewMap pos={userPosition} /> {/* ✓ Handles map view updates */}
</MapContainer>
```

**Optional:** Adjust geolocation options for better desktop compatibility

```tsx
{
  enableHighAccuracy: false, // Use network-based location
  timeout: 60000,            // Longer timeout
  maximumAge: 10000
}
```

**Key Learnings:**
- Leaflet uses imperative APIs; bridge the gap with custom React components
- `MapContainer` props like `center` only work on mount
- Always match Leaflet's expected types (`LatLngExpression`)
- Desktop geolocation behaves differently than mobile GPS
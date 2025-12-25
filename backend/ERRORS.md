# Backend Errors & Solutions

## 1. Double Slash in URL - `Cannot GET /rides //start-ride`

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

## 2. "Ride not found or invalid OTP" Error

**Error Response:**
```json
{
  "message": "Ride not found or invalid OTP."
}
```

**Causes & Solutions:**

### Cause 1: Ride Status is `pending` (not `accepted`)
- **Problem:** Ride must be confirmed by captain first before starting
- **Solution:** 
  1. Captain must call `POST /rides/confirm` with `rideId`
  2. This changes status from `pending` to `accepted`
  3. Then captain can call `/rides/start-ride`

### Cause 2: Missing Captain Assignment
- **Problem:** Ride doesn't have a captain assigned
- **Solution:** Confirm the ride first (see Cause 1)

### Cause 3: Invalid OTP
- **Problem:** OTP doesn't match the one in database
- **Solution:** Use the correct OTP from the ride document

**Workflow:**
```
1. Create Ride (User) → Status: pending
2. Confirm Ride (Captain) → Status: accepted + Captain assigned
3. Start Ride (Captain) → Status: ongoing
```

---

## 3. "User not found" Error

**Error Response:**
```json
{
  "message": "User not found."
}
```

**Cause:** `authUser` middleware cannot find user in database or token is invalid

**Solutions:**

### For authUser middleware errors:
- Ensure you're sending a valid user JWT token
- Token should be in cookies or Authorization header: `Bearer <token>`
- Verify token hasn't expired
- Check user exists in database

### For authCaptain middleware errors:
- Ensure you're sending a valid captain JWT token (not user token)
- Verify captain document exists in database with correct _id

---

## 4. "User/Captain not found" on Protected Routes

**Error:** Getting "User not found" or "[auth.middleware] captain not found"

**Cause:** Wrong token type or user/captain deleted from database

**Solution:**
- Use correct JWT token for the endpoint
- For user endpoints: Use user authentication token
- For captain endpoints: Use captain authentication token
- Verify user/captain still exists in MongoDB

---

## Database & Model Errors

### Issue 1: Ride not populating user/captain data

**Problem:** User or captain fields are null or empty objects

**Solution:**
- Ensure `.populate('user')` or `.populate('captain')` is called in queries
- Check that user/captain _id exists in respective collections
- Verify foreign key references are correct

### Issue 2: OTP field not accessible

**Problem:** Can't access `ride.otp` field

**Solution:**
- Add `.select('+otp')` to the query if otp is hidden by default
- Example: `RideModel.findById(rideId).select('+otp')`

---

## Socket & Real-time Errors

### Issue 1: Socket not connected

**Problem:** Socket events not being sent to clients

**Solution:**
- Verify socket server is initialized in `server.ts`
- Check socket connection in browser console
- Ensure `sendMessageToSocket()` is using correct socketId
- Verify captain/user has socketId stored in database

### Issue 2: Captain not receiving ride notifications

**Problem:** New ride event not reaching nearby captains

**Solution:**
- Verify captain's socketId is properly stored in database after connection
- Check if captain is actually within the search radius
- Ensure nearby captains are correctly fetched from maps service
- Verify socket event name matches frontend listener: `"new-ride"`

---

## Authentication & JWT Errors

### Issue 1: "Invalid token" error

**Error Response:**
```json
{
  "message": "Invalid token."
}
```

**Solutions:**
- Verify JWT_PRIVATE_KEY is set in .env
- Check token hasn't expired
- Ensure token format is correct
- Re-login to get fresh token

### Issue 2: "Token has been revoked"

**Error Response:**
```json
{
  "message": "Token has been revoked."
}
```

**Cause:** Token is in blacklist (usually after logout)

**Solution:**
- Login again to get new token
- Check blacklistToken collection in MongoDB

---

## Request Validation Errors

### Issue 1: Validation failed

**Error Response:**
```json
{
  "errors": [
    {
      "msg": "Pickup location is required"
    }
  ]
}
```

**Solution:**
- Include all required fields in request body/query
- Validate data types match API documentation
- Check field names exactly match schema

### Issue 2: Invalid MongoDB ObjectId

**Error Response:**
```json
{
  "errors": [
    {
      "msg": "invalid ride ID"
    }
  ]
}
```

**Cause:** rideId is not a valid MongoDB ObjectId format

**Solution:**
- Verify rideId is a valid 24-character hex string
- Check rideId from database, not a generated string

---

## CORS & Frontend Integration

### Issue 1: CORS blocked

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
- CORS is already enabled in `app.ts` with `app.use(cors())`
- Verify frontend URL matches allowed origins if needed
- Check browser console for specific CORS error

### Issue 2: Cookie not being sent

**Problem:** Token in cookies not being sent with requests

**Solution:**
- Configure axios/fetch with `credentials: 'include'`
- Ensure frontend is on same domain or CORS credentials are enabled
- Check `cookieParser()` middleware is configured in `app.ts`

---

## Common Debugging Tips

1. **Check .env file** - Ensure all required variables are set:
   - `JWT_PRIVATE_KEY`
   - `MONGODB_URI`
   - `GOOGLE_MAPS_API_KEY` (if using maps)

2. **Check server logs** - Look for console.log statements in:
   - Controllers
   - Services
   - Middleware

3. **Check MongoDB** - Verify:
   - Data structure matches schema
   - Referenced documents exist (user, captain, ride)
   - Indexes are properly created

4. **Check Socket Connection** - On browser console:
   ```javascript
   // Check if socket is connected
   console.log(socket.connected);
   // Check socket id
   console.log(socket.id);
   ```

5. **Verify Request Headers** - Use Postman/Insomnia to test:
   - Include Authorization header
   - Include Content-Type header
   - Check request body format

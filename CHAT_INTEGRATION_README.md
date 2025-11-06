# Chat Backend Integration Documentation

## Overview
The chat frontend has been successfully integrated with the backend API at `http://localhost:8000/api/chat/send`. The integration preserves all existing UI behavior while adding real-time communication with the backend.

## Changes Made

### 1. ChatPage.jsx Updates
- Added `sessionId` state management for conversation persistence
- Added `token` from `useAuth()` for authentication
- Implemented `sendChatMessage()` function with proper error handling and retry logic
- Updated `handleSend()` to use real API instead of mock timeout
- Added response parsing for bot messages and hotel data
- Added hotel data normalization before passing to `HotelsMsg`

### 2. HotelsMsg.jsx Updates
- Changed from local JSON file reading to accepting `data` prop
- Added safety check to render nothing if no hotels provided
- Maintained original hotel card rendering logic

### 3. API Request Format
```javascript
POST http://localhost:8000/api/chat/send
Headers:
  Content-Type: application/json
  Authorization: Bearer <token> (if token exists)
Body:
{
  "message": "<user input text>",
  "metadata": {
    "source": "web",
    "timestamp": "<ISO8601 timestamp>",
    "language": "ar"
  },
  "sessionId": "<session_id>" // included if exists
}
```

### 4. Expected Backend Response
```javascript
{
  "success": true,
  "message": { "en": "Message sent successfully", "ar": "تم إرسال الرسالة بنجاح" },
  "data": {
    "sessionId": "chat_xxx",
    "signal": "success",
    "message": "تمام! الطائف!\n\nلقيت لك فندق في الطائف",
    "hotels": [
      {
        "name": "Hotel Oasis 6",
        "rating": 3.1,
        "price": "495 ريال للليلة",
        "features": ["خدمة نقل من وإلى المطار", "موقف سيارات مجاني"],
        "image": "https://images.unsplash.com/...",
        "distance": "2 كم من وسط المدينة", // optional
        "offer": "خصم 20%", // optional
        "id": "hotel_123" // optional
      }
    ]
  }
}
```

## Features Implemented

### ✅ Authentication
- Uses `token` from `AuthContext` when available
- Handles 401 unauthorized responses with user-friendly message
- Continues to work even without token (sends request without auth header)

### ✅ Session Management
- Saves `sessionId` from backend response
- Includes `sessionId` in subsequent requests
- Maintains conversation context

### ✅ Error Handling
- Single retry mechanism for network failures (600ms delay)
- Specific handling for 401 unauthorized errors
- Generic error message for other server errors
- Console logging for debugging

### ✅ Hotel Data Normalization
Before passing to `HotelsMsg`, each hotel object is normalized to:
```javascript
{
  id: hotel.id || Math.random().toString(36).substr(2, 9),
  name: hotel.name || "فندق غير معروف",
  rating: hotel.rating ? `${hotel.rating} ⭐` : "غير محدد",
  distance: hotel.distance || "المسافة غير محددة", 
  price: hotel.price || "السعر غير محدد",
  offer: hotel.offer || (hotel.features ? hotel.features.join(" + ") : ""),
  image: hotel.image || "/images/hotel-default.png"
}
```

### ✅ UI Behavior Preservation
- Suggestions hide after first user message (unchanged)
- Loading component displays during API requests
- Audio message functionality remains intact
- Scroll behavior maintained
- Recording functionality preserved

## Testing Instructions

### 1. Start Development Server
```bash
npm run dev
```

### 2. Test Scenarios

#### Normal Hotel Search Flow
1. Navigate to chat page
2. Send message: "الطائف"
3. Verify loading component appears
4. Verify bot response appears with hotel cards (if hotels returned)

#### No Hotels Response
1. Send a message that doesn't trigger hotel results
2. Verify only bot text message appears

#### Error Scenarios
1. **Network Error**: Disconnect internet and send message
   - Expected: Error message "حدث خطأ أثناء التواصل مع السيرفر. حاول مرة أخرى."
2. **401 Unauthorized**: Use invalid/expired token
   - Expected: Error message "سجل دخولك مرة أخرى."

#### Session Persistence
1. Send first message, note the sessionId in network tab
2. Send second message, verify sessionId is included in request

### 3. Backend Requirements
Ensure the backend server is running on `http://localhost:8000` and implements:
- POST `/api/chat/send` endpoint
- Proper CORS headers for frontend domain
- Response format matching the expected structure above

## Debugging

### Console Logs
- API errors are logged with `console.error("Chat API error:", error)`
- Retry attempts are logged with `console.log("Retrying request...")`

### Network Tab
- Check request headers include proper Authorization and Content-Type
- Verify request body format matches specification
- Check response status and data structure

### Common Issues
1. **CORS errors**: Ensure backend allows requests from frontend domain
2. **Token issues**: Check AuthContext is providing valid token
3. **Network errors**: Verify backend server is running on correct port
4. **Hotel rendering**: Check hotel data structure matches normalization expectations

## Next Steps
- Add loading states for image loading in hotel cards
- Implement hotel booking functionality
- Add chat history persistence
- Consider adding typing indicators
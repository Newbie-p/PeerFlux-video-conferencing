# PeerFlux Guest Join Feature - Quick Start Guide

## How It Works

### For Guests 👥
```
Landing Page → Click "Join as Guest" 
    ↓
Guest Join Form (Enter name & meeting code)
    ↓
Click "Join Meeting"
    ↓
Video Meeting Room (Username auto-filled)
```

### For Hosts 🎥
```
Landing Page → Click "Login"
    ↓
Authenticate
    ↓
Home Page → Create/Join Meeting
    ↓
Video Meeting Room
```

## Testing the Feature Locally

### Prerequisites
- Backend running on `http://localhost:8000`
- Frontend running on `http://localhost:3000` (or your dev server)

### Step 1: Test Guest Join
1. Open browser to `http://localhost:3000`
2. Click **"Join as Guest"** button
3. Fill in:
   - Your Name: "Test Guest"
   - Meeting Code: "TEST123"
4. Click **"Join Meeting"**
5. You'll be redirected to the meeting room with username pre-filled

### Step 2: Test Host Login
1. Go back to Landing Page
2. Click **"Login"** button
3. Enter credentials
4. You'll be on Home page (protected route)
5. Click **"Logout"** to return to login

### Step 3: Verify Data Storage
1. Open Developer Tools (F12)
2. Go to **Application** tab
3. Click **LocalStorage** → Select your domain
4. **For Guests**: Should see `isGuest: "true"` and `guestName: "Test Guest"`
5. **For Hosts**: Should see `token: "your-auth-token"`

## Code Locations

### Frontend Files Modified
- ✅ `frontend/src/pages/LandingPage.jsx` - Added guest join button
- ✅ `frontend/src/pages/GuestJoin.jsx` - **NEW** Guest join form
- ✅ `frontend/src/pages/VideoMeet.jsx` - Guest auto-fill functionality
- ✅ `frontend/src/App.js` - Added route
- ✅ `frontend/src/App.css` - Added styling

### No Changes Required to Backend
The current backend works with the guest feature. Optional backend enhancements:
- Validate meeting codes before allowing joins
- Track guest participation
- Set guest limits per meeting

## Key Features

| Feature | Status | Description |
|---------|--------|-------------|
| Guest Join Form | ✅ Ready | Users can enter name and meeting code |
| Form Validation | ✅ Ready | Prevents empty submissions |
| Auto Username Fill | ✅ Ready | Guest name pre-fills in video room |
| Guest Indicator | ✅ Ready | Shows "Joining as Guest" badge |
| Responsive Design | ✅ Ready | Works on mobile and desktop |
| Session Cleanup | ✅ Ready | Clears guest data on leave |
| Host Protection | ✅ Ready | Login required via `withAuth` |

## Styling Preview

### Guest Join Page
- Modern glass-morphism design
- Orange accent color (#FF9839)
- Responsive form layout
- Error message display
- Loading state handling

### VideoMeet Lobby
- Guest indicator badge
- Disabled username field for guests
- Better visual hierarchy
- Video preview area

## Common Issues & Solutions

### Issue: "Join as Guest" button doesn't work
- **Solution**: Clear browser cache and reload
- Check console (F12) for errors

### Issue: Username field is enabled in video room
- **Solution**: Check LocalStorage for `isGuest` flag
- Guest mode only activates if `isGuest === 'true'`

### Issue: Guest data persists after leaving
- **Solution**: This shouldn't happen - component cleanup is automatic
- Manually clear: Open DevTools → LocalStorage → Delete `guestName` and `isGuest`

### Issue: Can't login after guest session
- **Solution**: Guest and authenticated sessions are separate
- Refresh page to clear state

## Environment Variables

No new environment variables needed. Uses existing:
- `http://localhost:8000` - Backend API

## Performance Notes

- Guest form loads instantly
- No additional API calls required for guest join (optional for validation)
- LocalStorage operations are synchronous and fast
- Video stream initialization is unchanged

## Accessibility

- Form labels are associated with inputs
- Error messages are clear and visible
- Button states are clearly indicated
- Disabled fields show visual feedback

## Browser Compatibility

Works on:
- ✅ Chrome/Chromium (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## Next Steps

1. **Test thoroughly** in your environment
2. **Add backend validation** (optional but recommended)
3. **Deploy** to your server
4. **Monitor** guest vs. host usage
5. **Gather feedback** from users

## Development Notes

### Component Dependencies
- React Router (navigation)
- Material-UI (optional, used only in VideoMeet)
- LocalStorage API (data persistence)

### State Management
- Guest data: LocalStorage (persists on page reload)
- Form inputs: React state
- Meeting participants: Socket.io (existing)

### Socket.io Integration
- Socket server expects username (works for guests)
- Meeting code is part of the URL
- No special guest handling needed in socket events (optional)

---

**Questions?** Check GUEST_JOIN_FEATURE.md for detailed documentation.

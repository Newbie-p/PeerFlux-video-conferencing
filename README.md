# PeerFlux

A modern, real-time video conferencing application built with React and Node.js. PeerFlux enables users to create and join video meetings with features like screen sharing, real-time chat, and guest access - all with a professional UI similar to Google Meet and Zoom.

![Version](https://img.shields.io/badge/version-2.1-blue)
![Status](https://img.shields.io/badge/status-production%20ready-success)
![License](https://img.shields.io/badge/license-ISC-green)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Usage](#-usage)
- [API Endpoints](#-api-endpoints)
- [User Flows](#-user-flows)
- [Browser Support](#-browser-support)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

---

## ✨ Features

### Core Features
- ✅ **User Authentication** - Secure login/register with token-based sessions
- ✅ **Meeting Management** - Create meetings with auto-generated unique codes
- ✅ **Guest Access** - Join meetings without registration using meeting codes
- ✅ **Real-time Video** - WebRTC peer-to-peer video conferencing
- ✅ **Audio Controls** - Mute/unmute microphone
- ✅ **Video Controls** - Turn camera on/off
- ✅ **Screen Sharing** - Share desktop or specific windows
- ✅ **Real-time Chat** - Google Meet-style chat panel with message notifications
- ✅ **Meeting History** - Track all participated meetings
- ✅ **Responsive Design** - Works seamlessly on mobile, tablet, and desktop

### UI/UX Features
- 🎨 Modern gradient design with orange accent colors
- 📱 Fully responsive layout
- 🎯 Intuitive lobby screen before joining
- 💬 Chat panel with unread message badges
- 🔔 Real-time notifications
- ⚡ Smooth animations and transitions

---

## 🛠 Tech Stack

### Frontend
- **React 19** - UI framework with hooks
- **React Router 7** - Client-side routing
- **Material-UI** - Component library
- **Socket.io Client** - Real-time communication
- **WebRTC** - Peer-to-peer video/audio
- **CSS3** - Modern styling with gradients and grid

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **MongoDB** - Database (via Mongoose)
- **Socket.io** - WebSocket server
- **Bcrypt** - Password hashing
- **Crypto** - Token generation

---

## 📁 Project Structure

```
PeerFlux/
│
├── Backend/
│   ├── src/
│   │   ├── app.js                 # Express server setup
│   │   ├── controllers/
│   │   │   ├── user.controller.js # User/auth logic
│   │   │   └── socketManager.js   # Socket.io handling
│   │   ├── models/
│   │   │   ├── user.model.js      # User schema
│   │   │   └── meeting.model.js   # Meeting schema
│   │   └── routes/
│   │       └── users.routes.js    # API routes
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx    # Landing page
│   │   │   ├── Authentication.jsx # Login/Register
│   │   │   ├── Home.jsx           # Dashboard (protected)
│   │   │   ├── GuestJoin.jsx      # Guest join form
│   │   │   ├── VideoMeet.jsx      # Video conference room
│   │   │   └── History.jsx        # Meeting history
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx    # Auth state management
│   │   ├── utils/
│   │   │   └── withAuth.jsx       # Auth HOC
│   │   ├── styles/
│   │   │   └── VideoMeet.css      # Video meeting styles
│   │   └── App.js                 # Main app component
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PeerFlux
   ```

2. **Setup Backend**
   ```bash
   cd Backend
   npm install
   ```

3. **Configure Environment Variables**
   
   Create a `.env` file in the `Backend` directory:
   ```env
   PORT=8000
   MONGO_URL=mongodb://localhost:27017/peerflux
   ```

4. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start Backend Server**
   ```bash
   cd Backend
   npm start
   # Server runs on http://localhost:8000
   ```

3. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm start
   # App runs on http://localhost:3000
   ```

4. **Open your browser**
   - Navigate to `http://localhost:3000`
   - The app should load and connect to the backend

---

## 📖 Usage

### For Authenticated Users

#### Create a Meeting
1. Log in with your credentials
2. On the Home page, click **"Create New Meeting"**
3. A unique 6-character meeting code is generated (e.g., "ABC7XYZ")
4. You're automatically redirected to the video room
5. Share the meeting code with participants

#### Join an Existing Meeting
1. Log in to your account
2. On the Home page, enter the meeting code
3. Click **"Join Meeting"**
4. The system validates the meeting exists
5. Enter the video room

#### In the Video Meeting
- 🎥 Toggle camera on/off
- 🎤 Toggle microphone on/off
- 📺 Share your screen
- 💬 Open chat panel and send messages
- 🔴 End call to leave (stays logged in)

### For Guest Users

#### Join as Guest
1. On the landing page, click **"Join as Guest"**
2. Enter your name
3. Enter the meeting code (provided by host)
4. Click **"Join Meeting"**
5. System validates the meeting exists
6. Enter the video room with your name pre-filled

**Note:** Guests have the same video/audio/chat capabilities as authenticated users, but cannot create meetings.

---

## 🔌 API Endpoints

### Authentication

**Register User**
```
POST /api/v1/users/register
Content-Type: application/json

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "password123"
}
```

**Login**
```
POST /api/v1/users/login
Content-Type: application/json

Body:
{
  "loginId": "johndoe",  // username or email
  "password": "password123"
}

Response:
{
  "token": "jwt-token-here",
  "user": { ... }
}
```

### Meeting Management

**Check Meeting Exists**
```
POST /api/v1/users/check-meeting
Content-Type: application/json

Body:
{
  "meetingCode": "ABC123"
}

Response:
{
  "exists": true,
  "message": "Meeting found"
}
```

**Get User History**
```
GET /api/v1/users/get_all_activity?token=<user-token>
```

**Add Meeting to History**
```
POST /api/v1/users/add_to_activity
Content-Type: application/json

Body:
{
  "token": "user-token",
  "meeting_code": "ABC123"
}
```

---

## 🎯 User Flows

### Host Flow
```
Landing Page → Login → Home (Protected) → Create/Join Meeting → Video Room → End Call → Home
```

### Guest Flow
```
Landing Page → Join as Guest → Enter Name & Code → Video Room → End Call → Landing Page
```

### Meeting Creation Flow
```
1. User clicks "Create New Meeting"
2. Frontend generates 6-character code
3. Code saved to user history via API
4. Backend creates meeting record in MongoDB
5. User redirected to video room
6. Code can be shared with others
```

---

## 🌐 Browser Support

- ✅ Chrome/Chromium (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

**Note:** WebRTC features require HTTPS in production. HTTP works for local development.

---

## 🐛 Troubleshooting

### Common Issues

**Issue: Meeting code not showing**
- Solution: Refresh the page and clear browser cache

**Issue: Can't join meeting**
- Solution: Verify the meeting code is correct and the meeting exists
- Check backend is running on port 8000
- Verify MongoDB connection

**Issue: Video not showing**
- Solution: Allow camera permissions in browser
- Check WebRTC connection in browser console
- Verify STUN server is accessible

**Issue: Chat messages not sending**
- Solution: Verify Socket.io connection is established
- Check browser console for connection errors
- Ensure backend Socket.io server is running

**Issue: Screen sharing unavailable**
- Solution: Use Chrome or Firefox (best support)
- Feature requires HTTPS in production
- Check browser support for screen capture API

**Issue: Backend connection failed**
- Solution: Verify backend is running on port 8000
- Check CORS configuration
- Verify MongoDB is running and connected

### Debug Mode

Open browser console (F12) to see:
- Socket.io connection status
- WebRTC peer connection logs
- API request/response details
- Error messages

---

## 🎨 Color Scheme

- **Primary Orange:** `#FF9839`
- **Dark Orange:** `#D97500`
- **Dark Blue:** `#1a1a2e`
- **Navy:** `#16213e`
- **White:** `#ffffff`
- **Success Green:** `#4CAF50`
- **Error Red:** `#d32f2f`

---

## 🔐 Security Features

- ✅ Bcrypt password hashing
- ✅ Token-based authentication
- ✅ Meeting code validation
- ✅ CORS configuration
- ✅ Input validation
- ✅ Secure session management

**Production Recommendations:**
- Use HTTPS
- Implement rate limiting
- Add backend meeting validation
- Enable guest access controls
- Add session timeout

---

## 📊 Performance

- Lazy loading of video streams
- Optimized grid layout for rendering
- Efficient state management
- LocalStorage caching for sessions
- Real-time validation prevents unnecessary connections

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the ISC License.

---

## 👤 Author

**Praful Suryawanshi**

---

## 📞 Support

For issues, questions, or feature requests:
- Check the browser console (F12) for error messages
- Review the troubleshooting section above
- Verify all services are running correctly

---

## 🎉 Acknowledgments

- Built with modern web technologies
- Inspired by Google Meet and Zoom
- Uses WebRTC for peer-to-peer communication
- Material-UI for beautiful components

---

**Version:** 2.1  
**Last Updated:** January 2026  
**Status:** ✅ Production Ready

import React, { useEffect, useRef, useState } from 'react'
import io from "socket.io-client";
import { Badge, IconButton, Snackbar, Alert } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import "../styles/VideoMeet.css";
import CallEndIcon from '@mui/icons-material/CallEnd'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
import ChatIcon from '@mui/icons-material/Chat'
import { useNavigate } from 'react-router-dom';
import server from '../environment';


const server_url = server;

var connections = {};

const peerConfigConnections = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" }
    ]
};

export default function VideoMeet() {

    const navigate = useNavigate();

    var socketRef = useRef();
    let socketIdRef = useRef();

    let localVideoref = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);

    let [audioAvailable, setAudioAvailable] = useState(true);

    let [video, setVideo] = useState([]);

    let [audio, setAudio] = useState();

    let [screen, setScreen] = useState();

    let [showModal, setModal] = useState(true);

    let [screenAvailable, setScreenAvailable] = useState();

    let [messages, setMessages] = useState([])

    let [message, setMessage] = useState("");

    let [newMessages, setNewMessages] = useState(3);

    let [askForUsername, setAskForUsername] = useState(true);

    let [username, setUsername] = useState("");

    let [meetingCode, setMeetingCode] = useState("");

    let [copySnackbar, setCopySnackbar] = useState(false);

    const videoRef = useRef([])

    let [videos, setVideos] = useState([])

    useEffect(() => {
        // Get meeting code from URL
        const code = window.location.pathname.substring(1);
        setMeetingCode(code);

        // Check if user is joining as guest
        const isGuest = localStorage.getItem('isGuest') === 'true';
        const guestName = localStorage.getItem('guestName');
        
        if (isGuest && guestName) {
            setUsername(guestName);
            setAskForUsername(false);
        } else {
            // User is logged in, get username from token
            const token = localStorage.getItem('token');
            if (token) {
                // Fetch user data from backend
                fetchUserData(token);
            }
        }
        
        console.log("HELLO")
        getPermissions();

    }, [])

    let getDislayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => console.log(e))
            }
        }
    }

    const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoPermission) {
                setVideoAvailable(true);
                console.log('Video permission granted');
            } else {
                setVideoAvailable(false);
                console.log('Video permission denied');
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (audioPermission) {
                setAudioAvailable(true);
                console.log('Audio permission granted');
            } else {
                setAudioAvailable(false);
                console.log('Audio permission denied');
            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoref.current) {
                        localVideoref.current.srcObject = userMediaStream;
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
            console.log("SET STATE HAS ", video, audio);

        }


    }, [video, audio])
    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();

    }

    useEffect(() => {
        if (!askForUsername) {
            getMedia();
        }
    }, [askForUsername]);

    const fetchUserData = async (token) => {
        try {
            // Decode token to get username (or you can create a backend endpoint to get user info)
            // For now, we'll store username in localStorage after login
            const storedUsername = localStorage.getItem('username');
            if (storedUsername) {
                setUsername(storedUsername);
                setAskForUsername(false);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }

    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                console.log(description)
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            for (let id in connections) {
                connections[id].addStream(window.localStream)

                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                        })
                        .catch(e => console.log(e))
                })
            }
        })
    }

    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .then((stream) => { })
                .catch((e) => console.log(e))
        } else {
            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { }
        }
    }





    let getDislayMediaSuccess = (stream) => {
        console.log("HERE")
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            getUserMedia()

        })
    }

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }
    }




    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false })

        socketRef.current.on('signal', gotMessageFromServer)

        socketRef.current.on('connect', () => {
            // Send meeting code instead of full URL
            socketRef.current.emit('join-call', meetingCode)
            socketIdRef.current = socketRef.current.id
            console.log('Socket connected, ID:', socketIdRef.current, 'Meeting Code:', meetingCode)

            socketRef.current.on('chat-message', addMessage)

            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id))
            })

            socketRef.current.on('user-joined', (id, clients) => {
                clients.forEach((socketListId) => {

                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections)
                    // Wait for their ice candidate       
                    connections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }
                    }

                    // Wait for their video stream
                    connections[socketListId].onaddstream = (event) => {
                        console.log("BEFORE:", videoRef.current);
                        console.log("FINDING ID: ", socketListId);

                        let videoExists = videoRef.current.find(video => video.socketId === socketListId);

                        if (videoExists) {
                            console.log("FOUND EXISTING");

                            // Update the stream of the existing video
                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.stream } : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        } else {
                            // Create a new video
                            console.log("CREATING NEW");
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoplay: true,
                                playsinline: true
                            };

                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };


                    // Add the local video stream
                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream)
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()])
                        window.localStream = blackSilence()
                        connections[socketListId].addStream(window.localStream)
                    }
                })

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue

                        try {
                            connections[id2].addStream(window.localStream)
                        } catch (e) { }

                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }))
                                })
                                .catch(e => console.log(e))
                        })
                    }
                }
            })
        })
    }

    let silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator()
        let dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }
    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height })
        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }

    let handleVideo = () => {
        setVideo(!video);
        // getUserMedia();
    }
    let handleAudio = () => {
        setAudio(!audio)
        // getUserMedia();
    }

    useEffect(() => {
        if (screen !== undefined) {
            getDislayMedia();
        }
    }, [screen])
    let handleScreen = () => {
        setScreen(!screen);
    }

    let handleEndCall = () => {
        try {
            let tracks = localVideoref.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
        } catch (e) { }
        
        // Clean up guest session if guest
        const isGuest = localStorage.getItem('isGuest') === 'true';
        if (isGuest) {
            localStorage.removeItem('guestName');
            localStorage.removeItem('isGuest');
        }
        
        // Navigate back to home without clearing token
        navigate('/home');
    }

    let openChat = () => {
        setModal(true);
        setNewMessages(0);
    }
    let closeChat = () => {
        setModal(false);
    }
    let handleMessage = (e) => {
        setMessage(e.target.value);
    }

    const addMessage = (data, sender, socketIdSender) => {
        try {
            setMessages((prevMessages) => {
                const updatedMessages = [
                    ...prevMessages,
                    { sender: sender, data: data, timestamp: new Date() }
                ];
                // Update badge count based on actual messages
                setNewMessages(updatedMessages.length);
                return updatedMessages;
            });
        } catch (error) {
            console.error('Error adding message:', error);
        }
    };



    let sendMessage = () => {
        if (!message.trim()) {
            console.warn('Empty message, not sending');
            return;
        }
        try {
            console.log('Sending message:', message);
            console.log('Socket connected:', socketRef.current?.connected);
            console.log('Socket ID:', socketIdRef.current);
            
            // Add message to local state immediately
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: username || 'You', data: message, timestamp: new Date() }
            ]);
            
            // Emit to server if socket exists
            if (socketRef.current) {
                socketRef.current.emit('chat-message', message, username);
                console.log('Message emitted to server');
            } else {
                console.error('Socket not available');
            }
            
            // Clear input
            setMessage("");
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }

    
    let connect = () => {
        setAskForUsername(false);
    }

    const handleCleanup = () => {
        // Clear guest session data when leaving
        localStorage.removeItem('isGuest');
        localStorage.removeItem('guestName');
    }

    // Clear guest data on component unmount
    useEffect(() => {
        return () => {
            handleCleanup();
        };
    }, []);


    return (
        <div>

            {askForUsername === true ?

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    padding: '20px',
                    gap: '20px',
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
                }}>

                    <div style={{
                        maxWidth: '500px',
                        width: '100%',
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        padding: '40px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        textAlign: 'center'
                    }}>
                        <h1 style={{ color: '#202124', marginBottom: '8px', fontSize: '28px', fontWeight: '600' }}>PeerFlux</h1>
                        <h2 style={{ color: '#5f6368', marginBottom: '32px', fontSize: '20px', fontWeight: '400' }}>Ready to join?</h2>
                        
                        {/* Meeting Code Display */}
                        {meetingCode && (
                            <div style={{
                                backgroundColor: '#f8f9fa',
                                border: '1px solid #dadce0',
                                borderRadius: '8px',
                                padding: '16px',
                                marginBottom: '24px',
                                textAlign: 'center'
                            }}>
                                <p style={{margin: '0 0 8px 0', color: '#5f6368', fontSize: '0.85rem', fontWeight: '500'}}>Meeting Code</p>
                                <p style={{margin: '0 0 12px 0', fontSize: '20px', fontWeight: '500', color: '#202124', letterSpacing: '1px', fontFamily: 'monospace'}}>{meetingCode}</p>
                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(meetingCode);
                                        setCopySnackbar(true);
                                    }}
                                    style={{
                                        backgroundColor: '#f8f9fa',
                                        color: '#4285f4',
                                        border: '1px solid #dadce0',
                                        padding: '8px 16px',
                                        borderRadius: '20px',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        fontWeight: '500',
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#f0f0f0';
                                        e.currentTarget.style.borderColor = '#dadce0';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = '#f8f9fa';
                                    }}
                                >
                                    📋 Copy code
                                </button>
                            </div>
                        )}

                        {/* Guest Indicator */}
                        {localStorage.getItem('isGuest') === 'true' && (
                            <div style={{
                                color: '#4285f4',
                                fontSize: '0.9rem',
                                padding: '10px 12px',
                                backgroundColor: '#f0f4ff',
                                borderRadius: '6px',
                                border: '1px solid #c6d7f7',
                                marginBottom: '20px'
                            }}>
                                ℹ️ Joining as Guest
                            </div>
                        )}

                        {/* Username Display/Input */}
                        <div style={{ marginBottom: '24px', textAlign: 'left' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '0.85rem',
                                fontWeight: '500',
                                color: '#5f6368',
                                marginBottom: '8px'
                            }}>Your name</label>
                            {askForUsername && !username ? (
                                <input 
                                    type="text"
                                    value={username} 
                                    onChange={e => setUsername(e.target.value)} 
                                    placeholder="Enter your name"
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        border: '1px solid #dadce0',
                                        borderRadius: '6px',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                        transition: 'all 0.2s',
                                        backgroundColor: '#fff'
                                    }}
                                    onFocus={(e) => {
                                        e.currentTarget.style.borderColor = '#4285f4';
                                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(66, 133, 244, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.currentTarget.style.borderColor = '#dadce0';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && username.trim()) {
                                            connect();
                                        }
                                    }}
                                />
                            ) : (
                                <div style={{
                                    backgroundColor: '#f8f9fa',
                                    padding: '10px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid #dadce0',
                                    fontSize: '1rem',
                                    color: '#202124',
                                    fontWeight: '500'
                                }}>{username}</div>
                            )}
                        </div>

                        {/* Local Video Preview */}
                        <div style={{
                            marginBottom: '24px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            backgroundColor: '#000',
                            aspectRatio: '16/9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                        }}>
                            <video 
                                ref={localVideoref} 
                                autoPlay 
                                muted 
                                style={{ 
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transform: 'scaleX(-1)'
                                }}
                            />
                        </div>

                        {/* Join Button */}
                        <button 
                            onClick={connect}
                            style={{
                                width: '100%',
                                backgroundColor: '#4285f4',
                                color: 'white',
                                border: 'none',
                                fontSize: '1rem',
                                fontWeight: '500',
                                padding: '12px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.15)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#3367d6';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.25)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#4285f4';
                                e.currentTarget.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.15)';
                            }}
                        >
                            🎥 Join now
                        </button>
                    </div>

                </div> :

                /* MEETING ACTIVE */
                <div className="meetVideoContainer">

                    {/* Chat Panel */}
                    {showModal && <div className="chatRoom">
                        <h1>💬 Chat</h1>
                        <div className="chatContainer">
                            <div className="chattingDisplay">
                                {messages.length !== 0 ? messages.map((item, index) => (
                                    <div key={index}>
                                        <p style={{color: '#4285f4', fontWeight: '500'}}>{item.sender}</p>
                                        <p style={{color: '#e0e0e0'}}>{item.data}</p>
                                    </div>
                                )) : <p style={{color: '#888', textAlign: 'center', marginTop: '20px'}}>No messages yet. Start the conversation!</p>}
                            </div>

                            <div className="chattingArea">
                                <input 
                                    type="text"
                                    value={message} 
                                    onChange={(e) => {
                                        console.log('Message input changed:', e.target.value);
                                        setMessage(e.target.value);
                                    }}
                                    placeholder="Send a message..."
                                    autoComplete="off"
                                    disabled={false}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            console.log('Enter key pressed');
                                            sendMessage();
                                        }
                                    }}
                                />
                                <button 
                                    onClick={() => {
                                        console.log('Send button clicked, message:', message);
                                        sendMessage();
                                    }}
                                    title="Send message"
                                    style={{
                                        padding: '8px 12px',
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        color: '#4285f4',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem',
                                        fontWeight: '500',
                                        transition: 'all 0.2s',
                                        zIndex: 100
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = 'rgba(66, 133, 244, 0.1)';
                                        e.currentTarget.style.borderRadius = '4px';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>}

                    {/* Control Buttons */}
                    <div className="buttonContainers">
                        <IconButton 
                            onClick={handleVideo} 
                            title="Toggle Video"
                            sx={{backgroundColor: '#3c4043', '&:hover': {backgroundColor: '#464748'}}}
                        >
                            {(video === true) ? <VideocamIcon sx={{color: 'white'}} /> : <VideocamOffIcon sx={{color: 'white'}} />}
                        </IconButton>
                        
                        <IconButton 
                            onClick={handleAudio}
                            title="Toggle Microphone" 
                            sx={{backgroundColor: '#3c4043', '&:hover': {backgroundColor: '#464748'}}}
                        >
                            {audio === true ? <MicIcon sx={{color: 'white'}} /> : <MicOffIcon sx={{color: 'white'}} />}
                        </IconButton>

                        {screenAvailable === true &&
                            <IconButton 
                                onClick={handleScreen}
                                title="Share Screen" 
                                sx={{backgroundColor: '#3c4043', '&:hover': {backgroundColor: '#464748'}}}
                            >
                                {screen === true ? <ScreenShareIcon sx={{color: 'white'}} /> : <StopScreenShareIcon sx={{color: 'white'}} />}
                            </IconButton>
                        }

                        <Badge badgeContent={messages.length} max={999} color='error'>
                            <IconButton 
                                onClick={() => setModal(!showModal)}
                                title="Toggle Chat" 
                                sx={{backgroundColor: '#3c4043', '&:hover': {backgroundColor: '#464748'}}}
                            >
                                <ChatIcon sx={{color: 'white'}} />
                            </IconButton>
                        </Badge>

                        {/* Meeting Code Display */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: '#3c4043',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            marginLeft: '16px'
                        }}>
                            <span style={{color: 'white', fontSize: '0.85rem', fontFamily: 'monospace', fontWeight: '600'}}>
                                📌 {meetingCode}
                            </span>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(meetingCode);
                                    setCopySnackbar(true);
                                }}
                                title="Copy meeting code"
                                style={{
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    color: '#4285f4',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(66, 133, 244, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                            >
                                Copy
                            </button>
                        </div>

                        <IconButton 
                            onClick={handleEndCall}
                            title="End Call" 
                            sx={{backgroundColor: '#d32f2f', '&:hover': {backgroundColor: '#c62828'}}}
                        >
                            <CallEndIcon sx={{color: 'white'}} />
                        </IconButton>
                    </div>

                    {/* Local Video Preview */}
                    <div className={`meetUserVideo ${showModal ? 'chat-open' : 'chat-closed'}`}>
                        <video 
                            ref={localVideoref} 
                            autoPlay 
                            muted
                        ></video>
                        <div style={{
                            position: 'absolute',
                            bottom: '12px',
                            left: '12px',
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            color: '#e0e0e0',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '500',
                            zIndex: 51
                        }}>
                            🎥 {username}
                        </div>
                    </div>

                    {/* Remote Videos Grid */}
                    <div className="conferenceView">
                        {videos.map((video) => (
                            <div key={video.socketId} style={{position: 'relative', borderRadius: '10px', overflow: 'hidden'}}>
                                <video
                                    data-socket={video.socketId}
                                    ref={ref => {
                                        if (ref && video.stream) {
                                            ref.srcObject = video.stream;
                                        }
                                    }}
                                    autoPlay
                                    style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                />
                            </div>
                        ))}
                    </div>

                </div>

            }

            <Snackbar
                open={copySnackbar}
                autoHideDuration={2000}
                onClose={() => setCopySnackbar(false)}
            >
                <Alert onClose={() => setCopySnackbar(false)} severity="success" sx={{ width: '100%' }}>
                    ✅ Meeting code copied to clipboard!
                </Alert>
            </Snackbar>

        </div>
    )
}

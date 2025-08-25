import { useRef, useState } from 'react';
import "../styles/VideoMeet.css"

const server_url = "http://localhost:8000";

var connection = {};

const peerConfigConnections = {
    "iceServers": [
        {"urls": "stun:stun.l.google.com:19302"}
    ]
}

export default function VideoMeet(){

    var socketRef = useRef(); 
    var socketIdRef = useRef();

    let localVideoRef = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);

    let [audioAvailable, setAudioAvailable] = useState(true);

    let [video, setVideo] = useState();
    let [audio, setAudio] = useState();

    let [screen, setScreen] = useState();
    let [showModal, setShowModal] = useState();

    let [screenAvailabe, setScreenAvailable] = useState();

    let [messages, setMessages] = useState([]); // saare message dikhege

    let [messsage, setMessage] = useState(""); // jo message likh rahe h 

    let [newMessages, setNewMessages] = useState(0); // jab koi naya msg aayega

    let [askForUsername, setAskForUsername] = useState(true); // when a user join meet as a guest

    let [username, setUsername] = useState("");

    const videoRef = useRef([]);

    let [videos, setVideos] = useState([]);

    return(
        <div>VideoMeet</div>
    )
}
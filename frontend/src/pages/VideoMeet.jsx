import { useEffect, useRef, useState } from 'react';
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
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

    const getPermission = async()=>{
        try{
            const videoPermission = await navigator.mediaDevices.getUserMedia({video: true});

            if(videoPermission){ //video permission
                setVideoAvailable(true);
            }else{
                setVideoAvailable(false);
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({audio: true});

            if(audioPermission){ // audio permission
                setAudioAvailable(true);
            }else{
                setAudioAvailable(false);
            }

            if(navigator.mediaDevices.getDisplayMedia){ // screen share
                setScreenAvailable(true);
            }else{
                setScreenAvailable(false);
            }

            if(videoAvailable || audioAvailable){
                const userMediaStream = await navigator.mediaDevices.getUserMedia({video: videoAvailable, audio: audioAvailable})
                if(userMediaStream){
                    window.localStream = userMediaStream;
                    if(localVideoRef.current){
                        localVideoRef.current.srcObject = userMediaStream;
                    }
                }
            }
             
        }catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        getPermission();
    }, [])

    let getUserMediaSuccess = (stream) =>{

    }

    let getUserMedia = ()=>{
        if((video && videoAvailable) || (audio && audioAvailable)){
            navigator.mediaDevices.getUserMedia({video: video, audio: audio})
            .then(getUserMediaSuccess)
            .then((stream)=>{})
            .catch((e)=> console.log(e));
        }else{
            try{
                let tracks = localVideoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop())
            }catch(e){

            }
        }
    }
    useEffect(()=>{
        if(video !== undefined && audio !== undefined){
            getUserMedia();
        }
    },[audio, video])

    let getMedia = ()=>{
        setVideo(videoAvailable);
        setAudio(audioAvailable);
    }

    let connect = ()=>{
        setAskForUsername(false);
        getMedia();
    }

    return(
        <div>
            {askForUsername === true? 
            <div>
                <h2>Enter into lobby</h2>
                <TextField id="outlined-basic" label="username" value={username} onChange ={e => setUsername(e.target.value)} variant="outlined" />
                <Button variant="contained" onClick={connect}>Connect</Button>

                <div>
                    <video ref={localVideoRef} autoPlay muted></video>
                </div>
            </div> : <></>}
        </div>
    )
}
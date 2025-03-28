import { useRef } from "react";
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import {Room} from "./Room";
import React from "react";

const Landing = ()=>{
    const [name,setName] = useState(""); 
    const [joined ,setjoined] = useState(false);
    const [localAudioTrack,setLocalAudioTrack] = useState<MediaStreamTrack | null>(null);
    const [localVideoTrack,setLocalVideoTrack] = useState<MediaStreamTrack | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const getCam = async()=>{
        const stream =await window.navigator.mediaDevices.getUserMedia({
            video:true,
            audio:true
        })
        const videoTracks = stream.getVideoTracks()[0];
        const audioTracks = stream.getAudioTracks()[0];
        setLocalAudioTrack(audioTracks);
        setLocalVideoTrack(videoTracks);

        if(!videoRef.current){
            return;
        }
        videoRef.current.srcObject = new MediaStream([videoTracks,audioTracks]);
        videoRef.current.play();

    }
    useEffect(()=>{
        if(videoRef && videoRef.current){
            getCam();
        }
    },[videoRef]);
    

    if(!joined){
        return <div>
            <video ref={videoRef} autoPlay></video>
            <input type="text" onChange={(e)=>{setName(e.target.value)}}/>
            <button onClick={()=>{
                setjoined(true);
            }}>Join</button>
        </div>
    }
    return <Room name={name} localAudioTrack={localAudioTrack} localVideoTrack={localVideoTrack}/>
}

export default Landing;
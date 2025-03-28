import React from "react";
import  { useRef } from "react";
import { useEffect, useState } from "react";
import {useSearchParams} from "react-router-dom"
import {io, Socket} from "socket.io-client"



export const Room = ({
    name,
    localAudioTrack,
    localVideoTrack
}:{
        name:string,
        localAudioTrack:MediaStreamTrack | null,
        localVideoTrack:MediaStreamTrack | null,

    })=>{
    const [searchParams,setSearchParams] = useSearchParams();
    const [socket,setSocket] = useState<null | Socket>(null);
    const [lobby,setlobby] = useState(true);
    const [sendingpc,setSendingpc] = useState<RTCPeerConnection | null>(null);
    const [receivingPc,setReceivingPc] = useState<RTCPeerConnection | null>(null);
    const [remoteVideoTrack,setRemoteVideoTrack] = useState<MediaStreamTrack | null>(null);
    const [remoteAudioTrack,setRemoteAudioTrack] = useState<MediaStreamTrack | null>(null);
    const [remoteMediaStream,setRemoteMediaStream] = useState<MediaStream | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    
    // const name = searchParams.get('name');


    useEffect(()=>{
        // socket created 
         const socket = io("http://localhost:3000");
        console.log(socket);
        //send offer
        socket.on("send-offer",async({roomId})=>{
            console.log("this is send-offer");
            alert("send offer please");

            const pc = new RTCPeerConnection();
            console.log(pc);

            setSendingpc(pc);
            
            setlobby(false);

            if(localAudioTrack){
                pc.addTrack(localAudioTrack);
            }
            if(localVideoTrack){
                pc.addTrack(localVideoTrack);
            }
            
            
            pc.onicecandidate = async(e)=>{
                console.log("receving ice candidates locally");
                if(e.candidate){
                    socket.emit("add-ice-candidates",{
                        candidate:e.candidate,
                        type:"sender",
                        roomId
                    });
                }
            }

            pc.onnegotiationneeded = async() =>{
                console.log("on negotiation needed sending offer")
                const sdp = await pc.createOffer();
                pc.setLocalDescription(sdp);
                socket.emit("offer",{
                    sdp,
                    roomId
                })
            }
        });


        socket.on("offer",async({roomId,sdp:remotesdp})=>{
           
            console.log("recived offer ")
            setlobby(false);
            const pc = new RTCPeerConnection();
            pc.setRemoteDescription(remotesdp);

            const sdp = await pc.createAnswer();
            
            pc.setLocalDescription(sdp);

            const stream = new MediaStream();

            if(remoteVideoRef.current){
                remoteVideoRef.current.srcObject = stream;
            }
            setRemoteMediaStream(stream);

            setReceivingPc(pc);
            


            pc.onicecandidate = async (e)=>{
                if(!e.candidate){
                    return;
                }
                console.log("on ice candidates on reciving saide")
                if(e.candidate){
                    socket.emit("add-ice-candidate",{
                        candidate:e.candidate,
                        type:"receiver",
                        roomId
                    })
                }
            }
            
            socket.emit("answer",{
                roomId,
                sdp:sdp
            });

              
                const track1 = pc.getTransceivers()[0].receiver.track;
                const track2 = pc.getTransceivers()[1].receiver.track;

                console.log(track1);
                if(track1.kind === "video"){
                    setRemoteAudioTrack(track2);
                    setRemoteVideoTrack(track1);
                }else{
                    setRemoteAudioTrack(track1);
                    setRemoteVideoTrack(track2);
                }
                //@ts-ignore
                remoteVideoRef.current?.srcObject.addTrack(track1);
                //@ts-ignore
                remoteVideoRef.current?.srcObject.addTrack(track2);
                //@ts-ignore
                remoteVideoRef.current?.play();
            
        });

        

        socket.on("answer",({roomId,sdp:remotesdp})=>{
            setlobby(false);

            setSendingpc(pc =>{
                pc?.setRemoteDescription(remotesdp)
                return pc;
            })
            console.log("loop closed");
        })

        socket.on("lobby",()=>{
            setlobby(true);
        })

        socket.on("add-ice-candidate", ({candidate, type}) => {
            console.log("add ice candidate from remote");
            console.log({candidate, type})
            if (type == "sender") {
                setReceivingPc(pc => {
                    if (!pc) {
                        console.error("receicng pc nout found")
                    } else {
                        console.error(pc.ontrack)
                    }
                    pc?.addIceCandidate(candidate)
                    return pc;
                });
            } else {
                setSendingpc(pc => {
                    if (!pc) {
                        console.error("sending pc nout found")
                    } else {
                        // console.error(pc.ontrack)
                    }
                    pc?.addIceCandidate(candidate)
                    return pc;
                });
            }
        })

        setSocket(socket);
    },[name]);

    useEffect(() => {
        if (localVideoRef.current) {
            if (localVideoTrack) {
                localVideoRef.current.srcObject = new MediaStream([localVideoTrack]);
                localVideoRef.current.play();
            }
        }
    }, [localVideoRef])
    
    
    return(<div>
        Hi {name}
        <video autoPlay width={400} height={400} ref={localVideoRef} />
        {lobby ? "Waiting to join someone" : null}
        <video autoPlay width={400} height={400}ref={remoteVideoRef}/>
    </div>)
}

export default Room 
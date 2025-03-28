import { User } from "./userManager"

let GLOBAL_ROOM_ID = 1;

interface Room {
    user1:User,
    user2:User,

}

export class RoomManager{

    private rooms: Map<string,Room>

    constructor(){
        this.rooms = new Map<string,Room>();
    }

    createRoom(user1:User,user2:User){
        console.log("createing room ");
        const roomId = this.generate().toString();

        this.rooms.set(roomId.toString(), {
            user1,
            user2
        })

        
        user1.socket.emit("send-offer",{
            roomId
        })
        user2.socket.emit("send-offer",{
            roomId
        })
    }

    onOffer(roomId:string,sdp:string,senderSocketId:string){
        console.log("this is from onoffer");
        const room = this.rooms.get(roomId);
        if(!room){
            return;
        }
        const receivingUser = room.user1.socket.id === senderSocketId ? room.user2:room.user1;
        receivingUser?.socket.emit("offer",{
            sdp,
            roomId
        })
        
    }

    onAnswer(roomId:string,sdp:string,senderSocketId:string){
        console.log("this is from answer");
        const room = this.rooms.get(roomId);
        if (!room) {
            return;
        }

        const receivingUser = room.user1.socket.id === senderSocketId ? room.user2:room.user1;

        receivingUser?.socket.emit("answer",{
            sdp,
            roomId
        })
        
    }
    
    onIceCandidates(roomId:string,senderSocketId:string,candidate:any,type:"sender" | "receiver"){
        console.log("this is from onIcecandidates");
        const room = this.rooms.get(roomId);
        if(!room){
            return;
        }
        const recevingUser = room.user1.socket.id === senderSocketId ? room.user2: room.user1;
        recevingUser.socket.emit("add-ice-candidate",({candidate,type}));
    }

    generate(){
        return GLOBAL_ROOM_ID++;
    }

   
}


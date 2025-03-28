import { Socket } from "socket.io";
import { RoomManager } from "./roomManager";


export interface User {
    socket:Socket;
    name: string;
}

export class UserManager {

    // initalize user and queue 
    private users: User[];
    private queue: string[];
    private roomManger: RoomManager;

    constructor(){
        this.users = [];
        this.queue = [];
        this.roomManger = new RoomManager() ;
    }
    
    addUser(name:string,socket:Socket){ 
        console.log("this add user");
        this.users.push({
            name,socket
        })

        console.log(this.users);
        this.queue.push(socket.id);
        
        console.log(this.queue);

        socket.emit("lobby");
        console.log("after lobby");
        this.clearQueue();  
        this.initHandlers(socket);
    }

    removeUser(socketId:string){
        console.log("this is remover user");
        const user = this.users.find(x=> x.socket.id === socketId);
        
        this.users = this.users.filter(x => x.socket.id !== socketId);
        this.queue = this.queue.filter(x => x === socketId);
    }

    clearQueue(){
        console.log("tjis is clear queue");
        if(this.queue.length <2){
            return;
        }

        console.log("from clear queue");

        const u1 = this.queue.pop();
        const u2 = this.queue.pop();

        console.log(u1 + " " + u2 );

        const user1 = this.users.find(x=>x.socket.id === u1);
        const user2 = this.users.find(x=>x.socket.id === u2);

        console.log(user1,user2);
        
        if(!user1 || !user2){
            return;
        }
        const room = this.roomManger.createRoom(user1,user2);
        this.clearQueue();  
    }

    initHandlers(socket:Socket){
        console.log("this is inithandlers");

        socket.on("offer",({sdp,roomId}:{sdp:string,roomId:string})=>{
            console.log("this is from offer under inithandlers");
            this.roomManger.onOffer(roomId,sdp,socket.id);
        })

        socket.on("answer",({sdp,roomId}:{sdp:string,roomId:string})=>{
            console.log("this is from answer under inithandlers");
            this.roomManger.onAnswer(roomId,sdp,socket.id);
        })

        socket.on("add-ice-candidate", ({candidate, roomId, type}) => {
            this.roomManger.onIceCandidates(roomId, socket.id, candidate, type);
        });
    }

}
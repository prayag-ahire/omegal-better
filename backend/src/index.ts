import express from "express"
import http from "http"
import { Server, Socket } from "socket.io";
import { UserManager } from "./managers/userManager";

const app = express();
const server  = http.createServer(app);
const io = new Server(server,{
   cors:{
    origin : "*"
   } 
});
const port = 3000;

const userManager = new UserManager();

io.on('connection',(socket:Socket)=>{
    console.log("a user connected");
    userManager.addUser("rendomName",socket);
    
    socket.on('disconnect',()=>{
        userManager.removeUser(socket.id);
    })
}) 



server.listen(port,()=>{
    console.log(`server running on port${port}...`)
})
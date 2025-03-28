"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const userManager_1 = require("./managers/userManager");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*"
    }
});
const port = 3000;
const userManager = new userManager_1.UserManager();
io.on('connection', (socket) => {
    console.log("a user connected");
    userManager.addUser("rendomName", socket);
    socket.on('disconnect', () => {
        userManager.removeUser(socket.id);
    });
});
server.listen(port, () => {
    console.log(`server running on port${port}...`);
});

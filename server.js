const path = require('path');
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const {userJoin, getCutUser, leaveChat, getRoomUsers} = require('./utils/users');
const socket = require('socket.io');
const io = socket(server);


// use static folder
app.use(express.static(path.join(__dirname, 'public')));

// run this when a coonection has established

io.on('connection', (socket) => {
    socket.on('joinRoom', ({username, room}) => {
        // create instance of join user with those informations
        const user = userJoin(socket.id, username, room);
        // join to specific room
        socket.join(user.room);
        // sending a reception msg to client by Admin
        socket.emit('message', 'Welcome to chatCord');
        // broadcast to all users except sender
        socket.broadcast.to(user.room).emit('message', `${user.username} has joined the chat`);
        // send room users info
        io.to(user.room).emit('roomUsers', ({
            room : user.room,
            users : getRoomUsers(user.room)
        }));
    });
    // listen for message
    socket.on('sendMessage', (msg) => {
        // we need to know information about the user that send the msg
        // console.log(getCutUser(socket.id));
        const user = getCutUser(socket.id);
        // console.log(user);
        io.to(user.room).emit('message',msg)
    });
    // run when user disconnects

    socket.on('disconnect', () => {
        const user = leaveChat(socket.id);
        if(user){
            io.to(user.room).emit('message', `${user.username} has left the chat`);
        }
    })
})

server.listen(3000, () => {
    console.log(`new WS connection running on port 3000...`);
})
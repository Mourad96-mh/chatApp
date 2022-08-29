const chatForm = document.getElementById('chat-form');
const chatMsg = document.querySelector('.chat-message');
const usersList = document.getElementById('users');

// get the username and room from URL
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

// join chatRoom
socket.emit('joinRoom', {username, room});


socket.on('message', (msg) => {
    // use a helper function to deliver the message in the chat box
    outputMessage(msg);
    chatMsg.scrollTop = chatMsg.scrollHeight;
});

// get room users

socket.on('roomUsers',(data) => {
    outputUsers(data.users);
    outputRoom(data.room);
})

// submit event
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msgVal = e.target.elements.msg.value;
    // emit msg to server
    socket.emit('sendMessage', msgVal);
    // clear the input
    e.target.elements.msg.value = "";
    // focus in input msg field
    e.target.elements.msg.focus();
})

// utility function to output messages to DOM

function outputMessage(msg) {
    const paraMsg = document.createElement('p');
    paraMsg.className = 'paraMsg';
    paraMsg.innerHTML = msg;
    chatMsg.appendChild(paraMsg);
}



// utilty function to add room name to DOM
function outputRoom(room){
    document.getElementById('room-name').innerHTML = room;
};

// utility function to add usres to DOM
function outputUsers(users){
    usersList.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.innerText = user.username;
        usersList.appendChild(li);
    })
}
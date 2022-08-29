const users = [];

// join user to chat
function userJoin(id, username, room){
    const user = {id, username, room};
    users.push(user);
    return user;
};

// get cut user

function getCutUser(id){
    return users.find(user => user.id === id)
};


// utility function when user leave the chat

function leaveChat(id){
    const index = users.findIndex(user => user.id === id);
    if(index !== -1){
        return users.splice(index, 1)[0];
    }
}

// get users os specific room
function getRoomUsers(room){
    return users.filter(user => user.room === room)
}

module.exports = {userJoin, getCutUser, leaveChat, getRoomUsers};


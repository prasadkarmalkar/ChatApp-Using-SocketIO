const users =[]

// Join user to chat 
const userJoin= (id, username, room)=>{
    const user = {id, username, room}

    users.push(user)
    return user
}

// Get the current user
const getCurrentUser = (id)=>{
    return users.find(user => user.id === id)
}
// Remove user from array when user leave
const userLeave = (id)=>{
    const index = users.findIndex(user=> user.id === id)
    if(index !== -1){
        return users.splice(index,1)[0]
    }
}
// Get all users from room
const getRoomUsers = (room) =>{
    return users.filter(user => user.room === room)
} 

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}
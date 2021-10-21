const submitForm = document.getElementById('chat-form')
const chatMessage = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const   userList = document.getElementById('users')



// get username and room name from url
const {username, room} = Qs.parse(location.search,{
    ignoreQueryPrefix: true
})
const socket = io()

// Join Chatroom
socket.emit('joinRoom',{username, room})


// Get All users from room
socket.on('roomUsers',({room,users})=>{
    outputRoomName(room)
    outputUsers(users)
})


// Getting msg from server
socket.on('message',message =>{
    outputMessage(message)
    
    // Scroll down
    chatMessage.scrollTop = chatMessage.scrollHeight
})


// When user submit form
submitForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const msg = e.target.elements.msg.value
    // Sending msg to server
    socket.emit('chatMessage',msg)

    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()
})


// OutPuting the message on front end
const outputMessage = (message)=>{
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML =`	<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
       ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div)
}

// Add room name to dom 
const outputRoomName = (room) =>{

    roomName.innerText = room
}
// Add users to dom 
const outputUsers = (users) =>{
    userList.innerHTML = `
    ${users.map(user=> `<li> ${user.username}</li>`).join('')}
    `
}
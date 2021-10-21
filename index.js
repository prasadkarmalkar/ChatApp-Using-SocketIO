const path = require('path')
const express = require('express')
const http = require('http')
const formatMessage = require('./utils/messages')
const { getCurrentUser, userJoin, userLeave, getRoomUsers } = require('./utils/users')


// Importing Socket Io
const socketio = require('socket.io')


const app = express()
const server = http.createServer(app)
const PORT = 4000 || process.env.PORT
const io = socketio(server)
// Setting The Public Folder As Static
app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', socket => {

    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room)

        socket.join(user.room)
        // This will send msg to user which is connected
        socket.emit('message', formatMessage('Admin', `Hello ${user.username}`))

        // This will send msg to everyone except that user
        socket.broadcast.to(user.room).emit('message', formatMessage('Admin', `${user.username} has joined the chat`))

        // Send All the users in room 
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })

    // This will broadcast everyone even the user
    // io.emit('message','Everyone can see this')

    // Run when the user disconnect
    socket.on('disconnect', () => {
        const user = userLeave(socket.id)
        if (user) {
            io.to(user.room).emit('message', formatMessage('Admin', `${user.username} has left the chat`))
            // Send All the users in room 
            socket.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }

    })

    // Listen for chat message
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id)

        io.to(user.room).emit('message', formatMessage(user.username, msg))
    })

})

server.listen(PORT, () => {
    console.log(`Server Runnig On ${PORT}`)
})
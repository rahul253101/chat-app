const express = require('express')
const socketIo = require('socket.io')
const path = require('path')
const http = require('http')
const Filter = require('bad-words')
const { messageGenerator, locationmessageGenerator } = require('./utils/messages')
const { getUsersInRoom, addUser, getUser, removeUser } = require('./utils/users')




const app = express()
const server = http.createServer(app)
const io = socketIo(server)
const port = process.env.Port||3000

const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))

app.get('/',(req,res)=>{
    res.render('index')
})

let count = 0

io.on("connection", (socket) => {
    console.log(`socketIo is running`)



    socket.on('join',(data,callback)=>{

        const {error, user} = addUser({id: socket.id, username: data.username, room: data.room})

        if (error){
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('welcome',user.username)
        io.to(user.room).emit('sidebarData',{
                room: user.room,
                username: user.username,
                users: getUsersInRoom(user.room)
            })
        socket.broadcast.to(data.room).emit('userJoined', `user ${data.username} is joined!!`)
        callback()

    })


    socket.on('userMessage',(message,callback)=>{
        const filter = new Filter()
        if(filter.isProfane(message)){
            return callback('profain words are not allowed')
        }
        const user = getUser(socket.id)

        io.to(user.room).emit('welcomeUser',messageGenerator(user.username,message))
        callback('message delivered')
    })

    socket.on('location',(location,callback)=>{
        let url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`

        const user = getUser(socket.id)

        io.to(user.room).emit('userLocation',locationmessageGenerator(user.username,url))
        callback('location shared')
    })


    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)

        if(user){
            io.to(user.room).emit('userLeft',`${user.username} has left!!`)
            io.to(user.room).emit('sidebarData',{
                room: user.room,
                username: user.username,
                users: getUsersInRoom(user.room)
            })
        }


    })
    // socket.emit('message', 'Welcome!')

    // socket.on('sendMessage', (message) => {
    //     io.emit('message', message)
    // })

    // socket.emit('countSet',count)

    // socket.on('increment',()=>{
    //     count++
    //     io.emit('countSet',count)
    // })
});

server.listen(port,()=>{
    console.log(`running on port ${port}`)
})

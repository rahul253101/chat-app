

const users = []

const addUser = ({id, username, room})=>{

    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if (!username || !room){
        return {
            error: `username and room are required fields!!`
        }
    }

    const exisitingUser = users.find((user)=>{
        return user.room === room && user.username === username
    })

    if(exisitingUser){
        return {
            error: 'Sorry user name alredy exist!!'
        }

    }

    const user = {id,username,room}

    users.push(user)

    return {user}

}

const removeUser = (id)=>{

    const index  = users.findIndex((user)=>{
    return user.id === id
    })

    if (index!=-1){
        return users.splice(index,1)[0]
    }
}

const getUser = (id)=>{

    name = users.find((user)=>{
        return user.id === id
    })

    return name
}

const getUsersInRoom = (room)=>{
    room = room.trim().toLowerCase()
    const roomUsers = users.filter((user)=>{
        return user.room === room
    })

    return roomUsers
}


module.exports = {
    getUsersInRoom,
    addUser,
    getUser,
    removeUser

}

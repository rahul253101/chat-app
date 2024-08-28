const socket = io()



// socket.on('countSet',(count)=>{
//     console.log(`current count: ${count}`)
// })

// document.querySelector('#increment').addEventListener('click',()=>{
//     socket.emit('increment')
//     console.log('clicked')
// })

const $messageTemplate = document.querySelector('#message-template').innerHTML
const $locationTemplate = document.querySelector('#location-template').innerHTML
const $sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
const $messages = document.querySelector('#messages')

const userData = Qs.parse(location.search,{ ignoreQueryPrefix:true})

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('welcome',(data)=>{
    const html = Mustache.render($messageTemplate,{
        username: 'Admin',
        message: `welcome ${data}`,
        date:  moment(new Date().getTime()).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
})

socket.on('sidebarData',(data)=>{

    const html = Mustache.render($sidebarTemplate,{
        room: data.room,
        users: data.users
    })

    document.querySelector('#sidebar').innerHTML = html
})


socket.on('welcomeUser',(message)=>{
    console.log(`user: ${message} is joined`)
    const html = Mustache.render($messageTemplate,{
        username: message.username,
        message: message.text,
        date:  moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('userJoined',(data)=>{

    const html = Mustache.render($messageTemplate,{
        username: 'Admin',
        message: data,
        date:  moment(new Date().getTime()).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)

})

socket.on('userLeft',(data)=>{

    const html = Mustache.render($messageTemplate,{
        username: 'Admin',
        message: data,
        date:  moment(new Date().getTime()).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)

    console.log(data)
})

socket.on('userLocation',(location)=>{
    console.log(`${location}`)
    const html = Mustache.render($locationTemplate,{
        username: location.username,
        message: location.text,
        date:  moment(location.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()

})

document.querySelector('#nameButton').addEventListener('click',()=>{

    document.querySelector('#nameButton').setAttribute('disabled',true)

    message = document.querySelector('#name').value

    socket.emit('userMessage',message,(error)=>{
        console.log(`${error}`)

        document.querySelector('#name').value=''
        document.querySelector('#name').focus()
        document.querySelector('#nameButton').removeAttribute('disabled')
    })


})

document.querySelector('#locationButton').addEventListener('click',()=>{
    if (!navigator.geolocation){
        return alert('your browser doesnt support this option')
    }
    document.querySelector('#locationButton').setAttribute('disabled',true)
    navigator.geolocation.getCurrentPosition((location)=>{
        console.log({
                        latitude: location['coords']['latitude'],
                        longitude: location['coords']['longitude']
                                })
        socket.emit('location',{
                                latitude: location['coords']['latitude'],
                                longitude: location['coords']['longitude']
                                },(result)=>{
                                    console.log(`${result}`)
                                })
        document.querySelector('#locationButton').removeAttribute('disabled')
    })

})

socket.emit('join',userData,(error)=>{

    if(error){
        alert(error)
        location.href = '/'
    }

})



// socket.on('message', (message) => {
//     console.log(message)
// })

// document.querySelector('#message-form').addEventListener('submit', (e) => {
//     e.preventDefault()

//     const message = e.target.elements.message.value

//     socket.emit('sendMessage', message)
// })




const messageGenerator = (username,text)=>{

    return {
        username,
        text,
        createdAt: new Date().getTime()
    }

}

const locationmessageGenerator = (username, url)=>{

    return {
        username,
        url,
        createdAt: new Date().getTime()
    }

}

module.exports = {
    messageGenerator,
    locationmessageGenerator
}

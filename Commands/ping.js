export default function(Message, Socket, Args) {
    Socket.send(JSON.stringify({
        "type": "console", 
        "command": `tellraw @a [{"text":"Pong!"}]`
    }));
}
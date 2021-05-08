module.exports = { // exporting an object 
    name: '/verify', // commmand name 
    description: 'Ping!', 
    execute(msg, args) { // a function 
        msg.reply('pong'); 
        msg.channel.send('pong'); 
    }
}

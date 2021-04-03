module.exports = { // exporting an object 
    name: 'ping', // commmand name 
    description: 'Ping!', 
    execute(msg, args) { // a function 
        msg.reply('pong');
        msg.channel.send('pong');
    }
}
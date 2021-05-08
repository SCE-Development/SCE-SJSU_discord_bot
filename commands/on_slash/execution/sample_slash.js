module.exports = {
    name: 'sample_slash',
    description: 'It echos back to channel and dm -- test',
    execute(client, interaction, command, args, user, guild) {
        //DM user private
        user.send(
            `Hello, you used the 'sample_slash' command in ${guild.name} with param - 
            ${args[0]? `${args[0].name}:${args[0].value}`:'none'}
            ${args[1]? `${args[1].name}:${args[1].value}`:'none'}
            `)
            .catch(console.error);
        //Reply in server
        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 3, //https://discord.com/developers/docs/interactions/slash-commands#applicationcommandoptiontype
                data: {
                    content: "Hello world!!! check your DM"
                }
            }
        })
    }
}

const { create_slash_commands, delete_slash_commands } = require('../util/slash_discord')

const commandData = {
    name: "ping",
    description: "ping pong!",
    options: [
        {
            name: "paramName1",
            description: "choose one of these option that do nothing",
            type: 3, //https://discord.com/developers/docs/interactions/slash-commands#applicationcommandoptiontype
            required: false,
            choices: [
                {
                    name: "Magellanic",
                    value: "magellanic"
                },
                {
                    name: "Emperor",
                    value: "emperor"
                },
                {
                    name: "Chinstrap",
                    value: "chinstrap"
                },
                {
                    name: "Gentoo",
                    value: "gentoo"
                }
            ]
        },
        {
            name: "paramName2",
            description: "True/False options that do nothing",
            type: 5, //https://discord.com/developers/docs/interactions/slash-commands#applicationcommandoptiontype
            required: false
        }
    ]
}

create_slash_commands(commandData)

/**
 * Need slash command's ID (concat to tring) to delete
 */
//delete_slash_commands('id_in_string')
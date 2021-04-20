module.exports = {
    name: "sample_slash",
    description: "It echos back to channel and dm",
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

module.exports = {
    name: "remove",
    description: "Remove a verified account with discord-ID or SJSU-email",
    options: [
        {
            name: "discord-id",
            description: `Provide a discord id of that user (right-click on that user for is or @), discordID is prioritized.`,
            type: 6, //USER
            required: false,
        },
        {
            name: "sjsu-email",
            description: "Provide an SJSU email of the account to be removed.",
            type: 3, //String
            required: false
        }
    ]    
}

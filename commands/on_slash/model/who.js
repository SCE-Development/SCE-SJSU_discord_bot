module.exports = {
    name: "who",
    description: "Check who is a verified user",
    options: [
        {
            name: "discord-id",
            description: `Provide a discord id of that user (right-click on that user for is or @), discordID is prioritized.`,
            type: 6, //USER
            required: false,
        },
        {
            name: "sjsu-email",
            description: "Provide an SJSU email to find a user.",
            type: 3, //String
            required: false
        }
    ]    
}

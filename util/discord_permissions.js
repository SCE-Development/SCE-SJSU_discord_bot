/**
 * Add more for future
 * https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags
 */
const permList = {
    ADMINISTRATOR: (1 << 3),
    MANAGE_CHANNELS: (1 << 4),
    MANAGE_GUILD: (1 << 5),
    MANAGE_ROLES: (1 << 28),
}

/**
 * Check if a discord user have the right to certain permission
 * @param {String/Int} userPermID - discord perm number
 * @param {Array-String}} permissions - array of permission to check from @permList 
 * ex: ['ADMINISTRATOR', 'MANAGE_CHANNELS'] -> 'or' statement - not 'and'
 * @param {obj} client - direct pass from interaction
 * @param {obj} interaction - direct pass from interaction
 * @returns true/false
 */
async function isAllowed(userPermID, permissions , client, interaction) {
    let int_permissions = parseInt(userPermID)
    let perm_strings = ""
    let isTrue = false;

    for (let permission of permissions) {
        isTrue = (isTrue || ((int_permissions & permList[permission]) == permList[permission]))
        perm_strings += permission + " "
    }

    if (!isTrue) {
        await client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data: {
                    content: `Only users with permission(s/or) **${perm_strings}** can use this command.`
                }
            }
        })
        return false
    }
    return true
}

module.exports = {
    isAllowed
}
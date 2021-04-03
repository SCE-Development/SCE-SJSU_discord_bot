/**
 * 'verify' commmand 
 * call '/getUser' w/ discordId in body 
 * 
 * if user is not in database => 
 * add to temp-cache 
 * send link to google verification to channel/user 
 * 
 * frontend:
 * if possible, call another api to remove the user from 'temp-cache' 
 * after successful verification 
 * 
 * if user in database =>
 * if user doesn't have verified tag =>
 * add 'verify' tag to discordId
 * 
 */

const tempCache = require('../util/temp_users'); // import specific functions 

// <dev> git pull
// <discord-bot> git rebase 

module.exports = {
    name: 'verify', 
    description: 'fill in later',
    execute(msg, args) {
        let id = msg.author.id;
        let username = msg.author.username;
        let discriminator = msg.author.discriminator;

        /**
         * check if user exists in db (getUser)
         * use axios 
         **/

        let user = {
            id: id,
            username: username, 
            discriminator: discriminator
        };

        let randNum = tempCache.add_tempUser(user); // used to send link 

        // test if user is added to cache 
        let tempCacheDict = tempCache.get_AlltempUser();
        console.log(tempCacheDict); 

        msg.reply(msg.author.username + msg.author.discriminator);
    }
}

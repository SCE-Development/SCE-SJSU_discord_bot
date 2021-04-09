/**
 * 'verify' commmand 
 * call '/getUser' w/ discordId in body 
 * 
 * if user is not in database & cache => 
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

const axios = require('axios');
const { response } = require('express');
const tempCache = require('../util/temp_users'); // import specific functions 
const roleId = "828004607556845608";

// git fetch: add branches locally 
// <dev> git pull 
// <discord-bot> git rebase 

module.exports = {
    name: 'verify', 
    description: 'fill in later',
    execute(msg, args) {
        let id = msg.author.id;
        let username = msg.author.username;
        let discriminator = msg.author.discriminator;
        
        checkDB(id) // sample: 123
        .then(status => { 
            console.log('status: ', status);
            if(status == 200) {
                // already in db
                if(msg.member.roles.cache.has(roleId)) {
                    msg.reply('you already have role');
                } else {
                    let role = msg.guild.roles.cache.find(r => r.name === "weeb");
                    msg.member.roles.add(role) 
                    .then(msg.reply('role added'))
                    .catch(console.error);
                }
            } else {
                // check if user exists in temp-cache 
                let tempId = tempCache.find_tempUser(id); 
                if(tempId != null) { // in temp cache
                    msg.reply(`https://sce.engr.sjsu.edu/discordSJSU/LoginWithGoogle/${tempId}`);  
                } else {
                    let user = {
                        id: id,
                        username: username, 
                        discriminator: discriminator
                    };
                    
                    // add user to temp cache 
                    let randNum = tempCache.add_tempUser(user);
                    // test if user is added to cache 
                    let tempCacheDict = tempCache.get_AlltempUser();
                    console.log(tempCacheDict);
                    msg.reply(`https://sce.engr.sjsu.edu/discordSJSU/LoginWithGoogle/${randNum}`);
                }
            }
        })
        .catch(error => console.log(error)); 
    }
}

async function checkDB(id) {
    let status;
    await axios.post('http://localhost:8080/api/VerifiedUser/getUsers', {discordID: id})
    .then(res => {
        console.log(res.msg);
        status = res.status;
    })
    .catch(err => {
        console.log(err);
    });
    return status; 
}
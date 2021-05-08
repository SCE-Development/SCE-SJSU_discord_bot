const axios = require('axios');
const { response } = require('express');
const tempCache = require('../../../util/temp_users') // import specific functions 
const roleId = "828004607556845608";

module.exports = {
    name: 'verify',
    description: 'checks if user is a current SJSU student',
    execute(client, interaction, command, args, user, guild) {
        let id = user.id;
        let username = user.username;
        let discriminator = user.discriminator;   
        let guildMemberRoles = interaction.member.roles; // is this an api call
        let guildRoles = guild.roles.cache; 
        // client.guilds.fetch(interaction.guild_id).then(guild_obj=>{
        //     console.log(guild_obj.members.first());
        // });
        
        // issue: access user's array of roles 
        // interaction.member.roles does not work ...
        // previously thru msg.memnber.roles.cache

        // cache every member of a guild
                    
        checkDB(id) // sample: 123, usually id 
        .then(status => { 
            console.log('status: ', status);
            if(status == 200) {
                // already in db
                if(guildMemberRoles.indexOf(roleId) >= 0) { /* check if user has roleID */
                    user.send('you already have role');
                } else {
                    // console.log("members in cache: " + guild.members.cache)
                    console.log("guild: " + guild);
                    const guildTest = client.guilds.cache.get("785700685144260659");
                    if(!guildTest) return console.log("guild not found");

                    console.log("printing members cache")
                    console.log("cache size: " + guild.members.cache.size);
                    console.log("guild size: " + guild.memberCount);
                    // guild.members.cache.forEach((value,key) => console.log(value + " " + key)) // what is data structure

                    let role = guild.roles.cache.find(r => r.name === "weeb"); /* replace 'msg.guild */
                    console.log("found guild role: " + role)
                    // just add role to member - guildMember
                    let member = guild.members.fetch(id); // search for member <- [object Promise]
                    interaction.member.roles.set([role])
                    .then(console.log)
                    .catch(console.error);
                }
            } else {
                // check if user exists in temp-cache 
                let tempId = tempCache.find_tempUser(id); 
                if(tempId != null) { // in temp cache
                    user.send(`https://sce.engr.sjsu.edu/discordSJSU/LoginWithGoogle/${tempId}`);  
                } else {
                    let newUser = {
                        id: id,
                        username: username, 
                        discriminator: discriminator
                    };
                    
                    // add user to temp cache 
                    let randNum = tempCache.add_tempUser(newUser);
                    // test if user is added to cache 
                    let tempCacheDict = tempCache.get_AlltempUser();
                    console.log(tempCacheDict);
                    user.send(`https://sce.engr.sjsu.edu/discordSJSU/LoginWithGoogle/${randNum}`);
                }
            }
        })
        .catch(error => console.log(error)); 

        user.send( `id: ${id} user:${username} discriminator: ${discriminator}`)
        .catch(console.error);

        // responding to an interaction 
        // send an interaction response object 
        client.api.interactions(interaction.id, interaction.token).callback.post({data: {
            type: 4,
            data: {
              content: 'check ur DM'
            }
          }})                
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
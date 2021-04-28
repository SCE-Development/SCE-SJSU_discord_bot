let temp_users = {
    3244: { //sample discord object 
        id: '435345346234234324',
        username: 'SomeUserName With Space',
        discriminator: '4543',
        TTL: new Date()
    },
    4545: { //sample discord object 2
        id: '342626282828292992',
        username: 'SirArthur',
        discriminator: '2263',
        TTL: new Date()
    }
}

/**
 * get random number between 0-9999
 * @returns 
 */
function get_randomNum(count = 0, max = 10000) {
    //Keep loop down to 10,000
    while (count < 10000) {
        let num = Math.floor(Math.random() * max);
        if (!temp_users[num]) return num
        count++
    }
    return null
}

/**
 * add an object to temp_User
 * @param {object} user_obj - objec to add 
 * @returns random generated ID of that obj || null if fail
 */
function add_tempUser(user_obj) {
    let random_num = get_randomNum()
    let object = {
        id: user_obj.id,
        username: user_obj.username,
        discriminator: user_obj.discriminator,
        TTL: user_obj.TTL || new Date()
    }
    if (random_num) temp_users[random_num] = object
    return random_num
}

/**
 * This function is for TESTING purposes!
 * add an object to temp_user
 * @param {object} user_obj - objec to add 
 * @returns added user
 */
function test_add_tempUser(user_obj) {
    let random_num = get_randomNum()
    if (random_num) temp_users[random_num] = { ...user_obj, TTL: new Date() }
    return random_num
}

/**
 * get user Object of an ID
 * @param {int} id - id of the user obj 
 * @returns - user object of that ID || null if non
 */
function get_tempUser(id) {
    return temp_users[id]
}

/**
 * entire temp_user list
 * @returns - object
 */
function get_AlltempUser() {
    return temp_users
}

/**
 * get ID of a temp_user through their discord_ID
 * @param {int} discord_id - id of the user obj 
 * @returns - ID of that temp_obj || null if non
 */
function find_tempUser(discord_id) {
    for (let key in temp_users) {
        if (parseInt(temp_users[key].id) == parseInt(discord_id)) return key
    }
    return null
}

/**
 * update an temp object
 * @param {int} id - id to be updated
 * @param {Object} new_userObj - new object to be updated
 * @returns 
 */
function edit_tempUser(id, new_userObj) {
    temp_users[id] = { ...new_userObj, TTL: new Date() }
    return temp_users[id]
}

/**
 * delete a temp_userobj
 * @param {int} id - id of to be deleted user
 * @returns 
 */
function delete_tempUser(id) {
    delete temp_users[id]
    return
}

/**
 * Delete old tempUser
 * @param {int} sec - how old should the obj be (second). More than `sec` is deleted. Default 30m.
 */
function clean_tempUser_TTL(sec = 30 * 60) {
    let currentTime = new Date()
    for (let key in temp_users) {
        let TLL = temp_users[key].TTL
        //Delete obj if remained more than 30m (default)
        if (parseInt((currentTime - TLL) / 1000) > sec) delete_tempUser(key)
    }
}

//Repeatedly clean the tempUser every 15m
setInterval(() => {
    console.log(get_AlltempUser())
    clean_tempUser_TTL()
}, 15 * 60 * 1000)//miliseconds 15 * 60 * 1000

module.exports = {
    add_tempUser, get_tempUser,
    edit_tempUser, delete_tempUser,
    find_tempUser, test_add_tempUser,
    get_AlltempUser, clean_tempUser_TTL
}

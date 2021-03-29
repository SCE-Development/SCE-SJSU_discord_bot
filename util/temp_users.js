let temp_users = {
    23423: {
        id: '435345346234234324',
        username: 'SomeUserName',
        discriminator: '4543',
        TTL: new Date()
    }
}

/**
 * get random number between 0-9999
 * @returns 
 */
function get_randomNum(){
    let num = Math.floor(Math.random() * 10000);
    if (temp_users[num]) return get_randomNum()
    else return num
}

/**
 * 
 * @param {object} user_obj - objec to add 
 * @returns added user
 */
function add_tempUser(user_obj){
    let random_num = get_randomNum()
    temp_users[random_num] = {...user_obj, TTL: new Date()}
    return random_num
}

/**
 * 
 * @param {int} id - id of the user obj 
 * @returns 
 */
function get_tempUser(id){
    return temp_users[id]
}


function edit_tempUser(id, new_userObj){
    temp_users[id] = {...new_userObj, TTL: new Date()}
    return temp_users[id]
}



function delete_tempUser(id){
    delete temp_users[id]
    return
}

module.exports = {add_tempUser, get_tempUser, edit_tempUser, delete_tempUser}
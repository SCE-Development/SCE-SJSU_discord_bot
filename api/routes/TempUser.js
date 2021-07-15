const express = require('express');
const router = express.Router();
const verifiedUser = require('../models/VerifiedUser');
const { OK, BAD_REQUEST, UNAUTHORIZED, NOT_FOUND } = require('../util/constants').STATUS_CODES
const {add_tempUser, delete_tempUser, get_tempUser, find_tempUser} = require('../util/temp_users');

/**
 * GET, Find a tempUser id from discordID
 * @param {String} discordID  
 * @returns response with all users 
 */
router.get('/find_tempUser/:discordID', async (req, res) => {
  let id = find_tempUser(req.params.discordID)
  if (id) {
    return res.status(OK).send({id});
  }
  return res.status(NOT_FOUND).send(null);
})

/**
 * POST, Add ab obj to tempUser w/ *discord info
 * @param {String} id 
 * @param {String} username 
 * @param {String} discriminator 
 * @param {String} TTL - optional 
 * @returns return id of added obj 
 */
router.post('/add_tempUser', async (req, res) => {
  let object = {
    id: req.body.id,
    username: req.body.username,
    discriminator: req.body.discriminator,
    TTL: req.body.TTL || new Date()
}
  let id = add_tempUser(object)
  if (id) {
    return res.status(OK).send({id});
  }
  return res.status(NOT_FOUND).send(null);
})

/**
 * GET, get a tempUser obj from tempUser-id
 * @param {String/Int} tempID 
 * @returns return id of added obj 
 */
router.get('/get_tempUser/:tempID', async (req, res) => {
  let obj = get_tempUser(req.params.tempID)
  if (obj) {
    return res.status(OK).send({...obj});
  }
  return res.status(NOT_FOUND).send(null);
})

module.exports = router;

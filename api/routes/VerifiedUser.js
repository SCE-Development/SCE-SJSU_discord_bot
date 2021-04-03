const express = require('express');
const router = express.Router();
const verifiedUser = require('../models/VerifiedUser');
const { OK, BAD_REQUEST, UNAUTHORIZED, NOT_FOUND } = require('../util/constants').STATUS_CODES
const {add_tempUser, delete_tempUser, get_tempUser} = require('../../util/temp_users');

/**
 * GET REST API 
 * @param {null}  
 * @returns response with all users 
 */
router.get('/getAllUsers', async (req, res) => {
  verifiedUser.find({}, (error, forms) => {
    if (error) {
      return res.status(BAD_REQUEST).send(error);
    }
    return res.status(OK).send(forms);
  });
})

/**
 * POST REST API 
 * @param {String}param - query with `email`, `discordID`, or `googleId`
 * @returns response with all users of finding
 */
router.post('/getUsers', (req, res) => {
  // Query Criteria; require
  let obj = {};
  if (typeof req.body.email !== 'undefined') obj = { email: req.body.email };
  else if (typeof req.body.discordID !== 'undefined') obj = { discordID: req.body.discordID };
  else if (typeof req.body.googleId !== 'undefined') obj = { googleId: req.body.googleId };
  else return res.status(BAD_REQUEST).send({ msg: `Must choose a criteria` });

  verifiedUser.find(obj, (error, forms) => {
    if (error) {
      return res.status(BAD_REQUEST).send(error);
    }
    if (forms.n < 1) return res.status(NOT_FOUND).send({ msg: `No such user(s)` });
    return res.status(OK).send(forms);
  });
});

/**
 * POST REST API 
 * @param {String} discordID
 * @param {String} profileObj - from google login
 * @returns added User
 */
router.post('/addUser', async (req, res) => {
  //require
  const user = new verifiedUser({
    discordID: req.body.discordID,
    googleId: req.body.profileObj.googleId,
    email: req.body.profileObj.email,
    name: req.body.profileObj.name,
    givenName: req.body.profileObj.givenName,
    familyName: req.body.profileObj.familyName
  });

  verifiedUser.create(user, (error, post) => {
    if (error) {
      return res.status(BAD_REQUEST).send(error);
    }
    return res.status(OK).send(post);
  })
})

/**
 * POST REST API 
 * @param {String} email - of user
 * @param {String} discordID - of the same user
 * @returns {String} - msg
 */
router.post('/deleteUser', (req, res) => {
  //require
  const obj = { email: req.body.email, discordID: req.body.discordID }
  verifiedUser.deleteOne(
    obj, (error, form) => {
      if (error) {
        return res.status(BAD_REQUEST).send(error);
      }
      if (form.n < 1) {
        return res.status(NOT_FOUND).send({ msg: `${req.body.email} & ${req.body.discordID} not found.` });
      } else {
        return res.status(OK).send({ msg: `${req.body.email} was deleted.` });
      }
    }
  );
});

/**
 * POST REST API 
 * @param {String} query_email - query user
 * @param {String} query_discordID - query user
 * @param {String} newForm - new info please follow model
 * @returns edited User
 */
router.post('/editUser', (req, res) => {
  const query = { email: req.body.query_email, discordID: req.body.query_discordID };
  //Make sure req.body follow model
  const newForm = {
    ...req.body.newForm
  };
  verifiedUser.updateOne(query, newForm, { new: true }, (error, result) => {
    if (error) {
      return res.sendStatus(BAD_REQUEST);
    }
    if (result.nModified < 1) {
      return res
        .status(NOT_FOUND)
        .send({ msg: `${req.body.email} & ${req.body.discordID} not found.` });
    }
    return res.status(OK).send(result);
  });
});

/**
 * POST REST API 
 * @param {String} discordID - 4-digit ID
 * @param {String} discordUsername - username
 * @param {String} discriminator
 * @param {Date} TTL
 * @returns added User
 */
 router.post('/addTempUser', async (req, res) => {
  //require
  const user = {
    discordID: req.body.id,
    discordUsername: req.body.username,
    discriminator: req.body.discriminator,
    TTL: new Date()
  };

  let id = add_tempUser(user);
  if(id) {
    res.status(OK).send(id);
  } else {
    res.status(BAD_REQUEST).send(error);
  }
});

/**
 * POST REST API 
 * @param {int} id - unique id in the cache
 * @returns user || null, if not present
 */
 router.post('/getTempUser', (req, res) => {
  //require
  let id = req.body.id;
  let user = get_tempUser(id);
  if (user) {
    res.status(OK).send(user);
  } else {
    res.status(BAD_REQUEST).send(error);
  }
});

/**
 * POST REST API 
 * @param {int} id - unique id in the cache
 * @returns
 */
 router.post('/deleteTempUser', async (req, res) => {
  //require
  const id = req.body.id;

  delete_tempUser(id);
  let user = get_tempUser(id);
  if (user){
    res.status(BAD_REQUEST).send(error);
  } else {
    res.status(OK).send({msg: `${req.body.id} was deleted.`});
  }
})


module.exports = router;
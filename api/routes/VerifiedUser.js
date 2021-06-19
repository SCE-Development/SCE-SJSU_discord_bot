const express = require('express');
const router = express.Router();
const verifiedUser = require('../models/VerifiedUser');
const { OK, BAD_REQUEST, UNAUTHORIZED, NOT_FOUND } = require('../util/constants').STATUS_CODES
const {add_tempUser, delete_tempUser, get_tempUser, find_tempUser} = require('../../util/temp_users');

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

router.post('/getUser', (req, res) => {
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
    if (forms.length < 1) { 
      return res.status(NOT_FOUND).send({ msg: `No such user(s)` });
    }
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
  const user = new verifiedUser({
    discordID: req.body.discordID,
    googleId: req.body.googleId,
    email: req.body.email,
    name: req.body.name,
    givenName: req.body.givenName,
    familyName: req.body.familyName
  });

  verifiedUser.create(user, (error, post) => {
    if (error) {
      return res.status(BAD_REQUEST).send(error);
    }
    // remove TempUser 

    return res.status(OK).send(post);
  })
})

/**
 * POST REST API 
 * @param {String} discordID
 * @param {String} profileObj - from google login
 * @returns added User
 */
 router.post('/addUser_withGoogleToken', async (req, res) => {
  const {verify} = require('../util/googleAuth');
  //require
  verify(req.body.googleTokenId).then(response => {
    const user = new verifiedUser({
      discordID: req.body.discordID,
      googleId: response.userid,
      email: response.payload.email,
      name: response.payload.name,
      givenName: response.payload.given_name,
      familyName: response.payload.family_name
    });
    verifiedUser.create(user, (error, post) => {
      if (error) {
        return res.status(BAD_REQUEST).send(error);
      }
      let tempID = find_tempUser(req.body.discordID)
      if(tempID){
        delete_tempUser(tempID)
        return res.status(OK).send(post);
      }
      return res.status(NOT_FOUND).send(post);
    })
  }).catch(err => {
    return res.status(UNAUTHORIZED).send(err);
  })
})

/**
 * DELETE REST API 
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
  if (!req.body.query_email || !req.body.query_discordID || !req.body.newForm){
    return res.status(BAD_REQUEST).send({msg:"Need query_email, query_discordID and newForm"});
  }
  const query = { email: req.body.query_email, discordID: req.body.query_discordID };
  //Make sure req.body follow model
  const newForm = {
    ...req.body.newForm,
    ...query
  };
  verifiedUser.findOneAndUpdate(query,newForm, (error, form)=>{
    if (error) return res.status(BAD_REQUEST).send(error);
    else if (form) {
      let tempID = find_tempUser(query.discordID)
      if(tempID) delete_tempUser(tempID)
      return res.status(OK).send(form);
    }
    else return res.status(NOT_FOUND).send({msg: `not found ${query.email} and ${query.discordID}`});
  })
});


module.exports = router;
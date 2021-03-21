const express = require('express');
const router = express.Router();
const verifiedUser = require('./models/verifiedUser');

 /* GET 
  /verify
  Params: n/a
  Returns: array of verified user objects
*/
router.get('/', async(req, res) => {
    const users = await verifiedUser.find();
    res.send(users);
})

/* GET 
  /verify/add
  Params: n/a
  Returns: newly added object
*/
router.post('/add', async(req, res) => {
    const user = new verifiedUser({
        username: req.body.username,
        googleId: req.body.googleId,
        email: req.body.email,
        name: req.body.name,
        givenName: req.body.givenName,
        familyName: req.body.familyName,
    });
    await user.save();
    res.send(user);
})

module.exports = router;
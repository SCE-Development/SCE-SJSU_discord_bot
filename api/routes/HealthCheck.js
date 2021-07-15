const express = require('express');
const router = express.Router();
const verifiedUser = require('../models/VerifiedUser');
const { OK, BAD_REQUEST, UNAUTHORIZED, NOT_FOUND } = require('../util/constants').STATUS_CODES

/**
 * GET, health check for connections
 * @returns server and db statuses
 */
router.get('/status', async (req, res) => {
  let db_status = NOT_FOUND
  try {
    await verifiedUser.find({}, (error, forms) => {
      if (!error) {
        db_status = OK
      }
    });
  }
  catch (err) { }
  return res.status(OK).send({ server: OK, db: db_status });
})

module.exports = router;

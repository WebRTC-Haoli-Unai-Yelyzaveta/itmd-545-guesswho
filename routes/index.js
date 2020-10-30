'use strict';
const express = require('express');
const router = express.Router();

const util = require('../lib/utilities.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  //Generate a room and redirect to that room
  res.redirect(`/${util.getRoom(3,4,3)}`);
  //res.render('index', { title: 'Express' });
});

module.exports = router;

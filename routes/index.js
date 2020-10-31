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

router.get('/:room([a-z]{3}-[a-z]{4}-[a-z]{3})', function(req, res, next) {
  res.render('index', { title: `room ${req.params['room']}` });
})

module.exports = router;

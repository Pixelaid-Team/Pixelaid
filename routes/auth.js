const express = require('express')
const router = express.Router()
const pg = require('../db/knex')
const db = require('../db/query')
const app = express()
const passport = require('passport')

// router.get('/login', (req, res, next) => {
//   res.render('index')
// })

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true })
);

module.exports = router

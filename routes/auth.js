const express = require('express')
const router = express.Router()
const pg = require('../db/knex')
const db = require('../db/query')
const app = express()
const passport = require('passport')

router.get('/login', (req, res, next) => {
  res.render('index', {error: 'Invalid username or password'})
})

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/canvas',
    failureRedirect: '/login',
    failureFlash: true })
);

module.exports = router

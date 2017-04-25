const express = require('express')
const router = express.Router()
const pg = require('../db/knex')
const db = require('../db/query')
const app = express()
const passport = require('passport')

app.get('/login', (req, res) => {
  res.render('index')
})

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true })
);

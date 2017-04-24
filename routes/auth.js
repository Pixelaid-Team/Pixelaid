const express = require('express')
const router = express.Router()
const knex = require('../db/knex')
const db = require('../db/queries')
const app = express()
const passport = require('passport')

const pg = require('../db/knex')

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true })
);

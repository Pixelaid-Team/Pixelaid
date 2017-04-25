const express = require('express')
const router = express.Router()
const pg = require('../db/knex')
const db = require('../db/query')
const app = express()
const passport = require('passport')
const bcrypt = require('bcrypt')


router.post('/signup', (req, res) => {
  const salt = bcrypt.genSaltSync()
  const hash = bcrypt.hashSync(req.body.user.password, salt)
  return pg('users').insert({
    username: req.body.user.username,
    password: hash
  })
  .then(user => {
    res.send(user)
  })
})

module.exports = router

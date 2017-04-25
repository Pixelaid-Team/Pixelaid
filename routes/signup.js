const express = require('express')
const router = express.Router()
const pg = require('../db/knex')
const db = require('../db/query')
const app = express()
const passport = require('passport')

router.get('/signup', (req, res, next) => {
  
})


module.exports = router

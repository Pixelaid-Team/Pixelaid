const pg = require('./knex')

function getAll(){
  return pg('question')
}

function add(obj){
  return pg('question').insert(obj)
}


module.exports={
  getAll,
  add
}

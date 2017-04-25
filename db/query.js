const pg = require('./knex')

function getAll(){
  return pg('question')
}

function findUserIfExists(obj) {
  return pg('users').select()
}

function add(obj){
  return pg('question').insert(obj)
}

function deleteQuestion(id){
  return pg('question').where('id', id).del()}

function getAnswer(id){
  return pg('answer')
  .fullOuterJoin('question', 'question.id', 'answer.question_id')
  .select('*', "answer.body as answer_body", "answer.id as answer_id").where('question.id', '=', id).orderBy('votes', 'desc')
}


function addAnswer(obj){
  console.log(obj);
  return pg('answer').insert(obj)
}

function endorse(obj){
  return pg('answer').where('id', obj['answer_id']).update('votes', +obj['votes' ]+1)
}



module.exports={
  getAll,
  findUserIfExists,
  add,
  deleteQuestion,
  getAnswer,
  addAnswer,
  endorse
}

const pg = require('./knex')

function getAll(){
  return pg('question')
}

function add(obj){
  return pg('question').insert(obj)
}

function deleteQuestion(id){
  return pg('question').where('id', id).del()}

function getAnswer(id){
  return pg('answer')
  .fullOuterJoin('question', 'question.id', 'answer.question_id')
  .select('*').where('question.id', '=', id)
}

function addAnswer(obj){

  return pg('answer').insert(obj)

}

module.exports={
  getAll,
  add,
  deleteQuestion,
  getAnswer,
  addAnswer

}

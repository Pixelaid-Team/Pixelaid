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

//get the canvas and tables.
function getCanvas(){
  return pg('section').orderBy('id', 'asc')
}
//update teh canvas
function updateCanvas(obj){
  let temp = obj['json']
  let newObj = JSON.parse(temp)
  console.log(newObj);
  return pg('section').where('id', newObj['id']).update({
    'row_0': newObj[0],
    'row_1': newObj[1],
    'row_2': newObj[2],
    'row_3': newObj[3],
    'row_4': newObj[4],
    'row_5': newObj[5],
    'row_6': newObj[6],
    'row_7': newObj[7],
    'row_8': newObj[8],
    'row_9': newObj[9],
    'row_10': newObj[10],
    'row_11': newObj[11],
    'row_12': newObj[12],
    'row_13': newObj[13],
    'row_14': newObj[14],
    'row_15': newObj[15]
  })

}
function addAnswer(obj){
  return pg('answer').insert(obj)
}

function endorse(obj){
  return pg('answer').where('id', obj['answer_id']).update('votes', +obj['votes' ]+1)
}

function getKudos(id){
  return pg('kudo')
  .fullOuterJoin('kudo', 'kudo.from_user_id', 'answer.question_id')
  .select('*', "answer.body as answer_body", "answer.id as answer_id").where('question.id', '=', id)
}

function giveKudo(obj){
  return pg('kudo').insert(obj)
}



module.exports={
  getAll,
  findUserIfExists,
  add,
  deleteQuestion,
  getAnswer,
  addAnswer,
  getCanvas,
  updateCanvas,
  endorse,
  getKudos,
  giveKudo

}

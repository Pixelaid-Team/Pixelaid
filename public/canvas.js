var sectionSize = 64,
  sectionRows = 1,
  sectionCols = 3,
  modalUp = false



//on document ready
$(document).ready(function(){
  console.log("js connected");
  $.get('/data').then(function(data){

    var fullPic = unpack(data)
    drawCanvas(fullPic)

    $('#canvasFrame').click(function(event){
      let secDiv = event.target.parentElement
      if(secDiv.classList.contains('section')){
        modalUp = true
        let id = getId(secDiv.id)
        let modal = document.getElementById('myModal')
        //console.log(modal.style.display);
        modal.style.display = "flex"
        drawSection(fullPic, secDiv.id)
      }
    })
  })
})

function drawCanvas(arr){
  let canvas = $('#canvasFrame')
  //canvas.style.width = sectionSize * fullPic.length
  //canvas.style.height = sectionSize * fullPic.length
  for (let foo in arr) {
    let tempSection = document.createElement('div')
    tempSection.style.width = sectionSize +"px"
    tempSection.style.height = sectionSize +"px"
    tempSection.className = "section"
    tempSection.id = foo
    tempSection.innerHTML = "<p class='posP'>"+foo+"</p>"
    canvas.append(tempSection)
    for (var i = 2; i < arr[foo].length; i++) {
      for (var n = 0; n < arr[foo].length; n++) {
        if(arr[foo][i][n] != undefined){
          //console.log(arr[foo][i]);
          let tempString = arr[foo][i]
          let tempPixel = document.createElement('div')
          tempPixel.className = "pixel"
          tempPixel.style.width = (sectionSize/16) +"px"
          tempPixel.style.height = (sectionSize/16) +"px"
          tempPixel.style.backgroundColor = getColor(arr[foo][i][n])
          tempSection.append(tempPixel)
        }
      }
    }
  }
}

function drawSection(obj, key){
  let editCanvas = $('#modalCanvas')
  let arr = obj[key]
  for (var i = 2; i < arr.length; i++) {
    for (var n = 0; n < arr[i].length; n++) {
      let tempDiv = document.createElement('div')
      tempDiv.className = "editPixel"
      tempDiv.style.backgroundColor = getColor(arr[i][n])
      editCanvas.append(tempDiv)
    }
  }

}

//unpack the data from its string form
function unpack(arr){
  let num = 0
  let tempArr = []
  for (var y = 0; y < sectionRows; y++) {
    for (var x = 0; x < sectionCols; x++) {
      tempArr[y +","+ x] = []
      let tempNum = 0
      for(let key in arr[num]){
        let tempString = arr[num][key]
        tempArr[y +","+ x][tempNum] = []
        for (var i = 0; i < arr[num][key].length; i++) {
          tempArr[y +","+ x][tempNum][i] = tempString.charAt(i)
        }
        tempNum += 1
      }
      num+=1
    }
  }
  return tempArr
}

//get the obj id from the div coords
function getId(pos){
  let stringA = ""
  let stringB = ""
  for (var i = 0; i < pos.length; i++) {
    if(pos.charAt(i) === ","){
      stringA = pos.substring(0,i)
      stringB = pos.substring(i+1,pos.length)
    }
  }
  return (+stringA +1)*(+stringB) +1
}

//switch to edit page and send section arr and id
function editSection(data, id){
  var json, form, input
  let obj = {
    0: id,
    1: data
  }
  json = JSON.stringify(obj)
  form = document.createElement("form")
  form.method = "post"
  form.action = "/pixelEdit"
  input = document.createElement('input')
  input.setAttribute("name", "json")
  input.setAttribute("value", json)
  form.appendChild(input)
  document.body.appendChild(form)
  form.submit();
}

//return color from character
function getColor(char){
  switch(char){
    case "G":
      return "rgb(37, 156, 35)"
      break;
    case "Y":
      return "rgb(220, 228, 55)"
      break;
    case "R":
      return "rgb(244, 38, 24)"
      break;
    case "B":
      return "rgb(55, 171, 228)"
      break;
    case "V":
      return "rgb(131, 1, 201)"
      break;
    case "O":
      return "rgb(228, 143, 55)"
      break;
    case "W":
      return "rgb(255, 255, 255)"
      break;
    case "E":
      return "rgb(152, 152, 152)"
      break;
    case "L":
      return "rgb(0, 0, 0)"
      break;
  }
}

var sectionSize = 128,
  sectionRows = 3,
  sectionCols = 5,
  modalUp = false,
  userPixels = 0,
  pixelsUsed = 0,
  sectionArr = [],
  sectionId = "",
  sectionPos = "",
  selectedColor = "rgb(255, 255, 255)";

var colors = ["G", "A", "Y", "R", "P", "T", "B", "D", "V", "M", "O", "S", "W", "E", "H", "L"]
var modal = document.getElementById('myModal')
var modalCanvas = $('#modalCanvas')
var palette = $('#palette')
var colorDiv = $('#colorDiv')

//on document ready
$(document).ready(function(){
  console.log("js connected");
  $.get('/data').then(function(data){

    var fullPic = unpack(data)
    //console.log(data);
    drawCanvas(fullPic)

    //click on section to open modal edit window
    $('#canvasFrame').click(function(event){
      let secDiv = event.target.parentElement
      if(secDiv.classList.contains('section')){
        modalUp = true
        sectionPos = secDiv.id
        sectionId = getId(sectionPos)
        console.log(fullPic[secDiv.id]);
        //sectionArr = fullPic[secDiv.id]
        sectionArr = copyArr(fullPic[secDiv.id])
        //FIX cancel and erase the sectionArr here!
        modal.style.display = "flex"
        drawSection(sectionArr, sectionId)
        selectColor(selectedColor)

      }
    })



    //change selected color
    $('#palette').click(function(event){
      selectedColor = event.target.style.backgroundColor
      selectColor(event.target.style.backgroundColor)
    })

    //change color of section pixels and update the selected Array
    $('#modalCanvas').click(function(event){
      if(event.target.classList.contains('editPixel')){
        //make sure user has enough pixels
        if(userPixel > 0 && pixelsUsed < userPixel){
          let yy = event.target.getAttribute('y')
          let xx = event.target.getAttribute('x')
          //forgive a misclick of same color
          if(event.target.style.backgroundColor != selectedColor){
            sectionArr[yy][xx] = getChar(selectedColor)
            event.target.style.backgroundColor = selectedColor
            pixelsUsed += 1
            $('#spendPixels').text(pixelsUsed)
          }
        } else {
          //add warning message
        }
      }
    })

    //cancel button on modal window
    $("#modalCancel").click(function(){
      modalUp = false
      modal.style.display = "none"
      modalCanvas.empty()
      palette.empty()
      selectedColor = "rgb(255, 255, 255)"
      //FIX cancel and erase the sectionArr here!
      //sectionArr = []
      //sectionId = ""
    })

    //submit edited section to the DB canvas
    $("#modalSubmit").click(function(){
      let newData = pack(sectionArr, sectionId)
      console.log(newData);
      PostObjectToUrl("/updateCanvas", {section: newData, pixels: pixelsUsed})
      //subtractPixels("/subtractPixels", pixelsUsed)



    })

    //clear the edits, array, and pixels used in the section
    $('#modalClear').click(function(){
      sectionArr = copyArr(fullPic[sectionPos])
      drawSection(sectionArr, sectionPos)
      pixelsUsed = 0
      $('#spendPixels').text(pixelsUsed)
    })
  })
})

//initialize the canvas from DB
function drawCanvas(arr){
  let canvas = $('#canvasFrame')
  for (let foo in arr) {
    let tempSection = document.createElement('div')
    tempSection.style.width = sectionSize +"px"
    tempSection.style.height = sectionSize +"px"
    tempSection.className = "section"
    tempSection.id = foo
    tempSection.innerHTML = "<p class='posP'>"+foo+"</p>"
    canvas.append(tempSection)
    for (let i = 2; i < arr[foo].length; i++) {
      for (let n = 0; n < arr[foo].length; n++) {
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

//create single selected section with color palette
function drawSection(arr, pos){
  $('#modalPos').text(pos)
  $('#spendPixels').text(pixelsUsed)
  modalCanvas.empty()
  palette.empty()
  let tempPixel = $('#userPixels').text()
  userPixel = +tempPixel


  //let arr = obj[pos]
  for (let i = 2; i < arr.length; i++) {
    for (let n = 0; n < arr[i].length; n++) {
      let tempDiv = document.createElement('div')
      tempDiv.className = "editPixel"
      tempDiv.style.backgroundColor = getColor(arr[i][n])
      tempDiv.setAttribute("y", i)
      tempDiv.setAttribute("x", n)
      modalCanvas.append(tempDiv)
    }
  }
  for (let i = 0; i < colors.length; i++) {
    let colorDiv = document.createElement('div')
    colorDiv.className = "color"
    colorDiv.style.backgroundColor = getColor(colors[i])
    palette.append(colorDiv)
  }
}

//update selected color div and variable
function selectColor(color){
  colorDiv.empty()
  let tempDiv = document.createElement('div')
  tempDiv.className = "color"
  tempDiv.style.backgroundColor = color
  colorDiv.append(tempDiv)

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

//repackage the sectiona array into an object to be sent to database
function pack(arr, pos){
  let newObj = {}
  //newArr[0] = getId(pos)
  newObj["id"] = pos
  newObj["canvas_id"] = 1
  for (var i = 0; i < arr.length -2; i++) {
    newObj[i] = arr[i+2].reduce(function(acc, val){
      return acc + val
    })
  }
  return newObj
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
  if(stringA === "0"){
    return +stringB +1
  } else if(stringA === "1"){
    return +stringB + 6
  } else if(stringA === "2"){
    return +stringB + 11
  }
}

//copy the array into a NEW copy
function copyArr(arr){
  let newArr = []
  console.log(arr);
  for (let i = 0; i < arr.length; i++) {
    newArr[i] = []
    for (let n = 0; n < arr[i].length; n++) {
      newArr[i][n] = arr[i][n]
    }
  }
  //console.log(newArr);
  return newArr
}

//post the current selectedArr to the database
function PostObjectToUrl(url, obj){

      var json, form, input;
      json = JSON.stringify(obj);

      form = document.createElement("form");
      form.method = "post";
      form.action = url;
      input = document.createElement("input");
      input.setAttribute("name", "json");
      input.setAttribute("value", json);
      form.appendChild(input);
      document.body.appendChild(form);
      form.submit();
}

function subtractPixels(url, val){

        var form, input;
        //json = JSON.stringify(obj);

        form = document.createElement("form");
        form.method = "post";
        form.action = url;
        input = document.createElement("input");
        input.setAttribute("name", "json");
        input.setAttribute("value", val);
        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
}

//return color from character
function getColor(char){
  switch(char){
    case "G":
      return "rgb(74, 214, 72)"
      break;
    case "A":
      return "rgb(14, 113, 51)"
      break;
    case "Y":
      return "rgb(240, 238, 77)"
      break;
    case "R":
      return "rgb(244, 38, 24)"
      break;
    case "P":
      return "rgb(245, 105, 172)"
      break;
    case "T":
      return "rgb(255, 224, 189)"
      break;
    case "B":
      return "rgb(55, 171, 228)"
      break;
    case "D":
      return "rgb(20, 39, 204)"
      break;
    case "V":
      return "rgb(131, 1, 201)"
      break;
    case "M":
      return "rgb(145, 20, 84)"
      break;
    case "O":
      return "rgb(242, 146, 33)"
      break;
    case "S":
      return "rgb(33, 242, 205)"
      break;
    case "W":
      return "rgb(255, 255, 255)"
      break;
    case "E":
      return "rgb(196, 196, 196)"
      break;
    case "H":
      return "rgb(48, 48, 48)"
      break;
    case "L":
      return "rgb(0, 0, 0)"
      break;
  }
}
//get character from color
function getChar(color){
  switch(color){
    case "rgb(37, 156, 35)":
      return "G"
      break;
    case "rgb(240, 238, 77)":
      return "Y"
      break;
    case "rgb(244, 38, 24)":
      return "R"
      break;
    case "rgb(55, 171, 228)":
      return "B"
      break;
    case "rgb(131, 1, 201)":
      return "V"
      break;
    case "rgb(242, 146, 33)":
      return "O"
      break;
    case "rgb(255, 255, 255)":
      return "W"
      break;
    case "rgb(152, 152, 152)":
      return "E"
      break;
    case "rgb(0, 0, 0)":
      return "L"
      break;
  }
}

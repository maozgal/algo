function Point(x, y) {
  this.x = x;
  this.y = y;
  this.isVisited = false;
  this.neighbors = new Array();
  this.id = -1;
}
function Arrow(p1, p2) {
  this.p1 = p1;
  this.p2 = p2;
}
const NUM_OF_VERTEXES = 7;
const GAP_BETWEEN_VERTEXES = 80;
const VERTEXES_SIZE = 40;
var vertexArray = [];
var edgeArray = new Array();
var arrowsArray = new Array();
var canvas = document.getElementById("myCanvas");
var queue;

function clearCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 40;

  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  queue = new Queue();
}

function start(shouldBeArranged) {
  clearCanvas()

  vertexArray = new Array();
  edgeArray = new Array();
  arrowsArray = new Array();

  var i;
  var currentLeftSpace = VERTEXES_SIZE
  for (i = 0; i < NUM_OF_VERTEXES; i++) {
    var candidatePoint;

    do {
      candidatePoint = new Point(
        Math.max(VERTEXES_SIZE,(Math.random() * canvas.width) - VERTEXES_SIZE)
        ,Math.max(VERTEXES_SIZE,(Math.random() * canvas.height) -VERTEXES_SIZE));
      }
      while (!isPointNotInRadiusOfOtherPoints(vertexArray,candidatePoint));
      if(shouldBeArranged){
        candidatePoint.x = currentLeftSpace;
        currentLeftSpace += 3*VERTEXES_SIZE;
      }
      candidatePoint.id = i;
      vertexArray.push(candidatePoint)

      edgeArray[i] = createRandomEdgesArray(i,3);
      candidatePoint.neighbors = edgeArray[i]
    }

    //drawArrows
    for (i = 0; i < edgeArray.length; i++) {
      for (j = 0; j < edgeArray[i].length; j++) {
        var edge = edgeArray[i][j];
        var edgePoint1 = vertexArray[i];
        var edgePoint2 = vertexArray[edge];

        var lineAngle = ((edgePoint2.y - edgePoint1.y)/(edgePoint2.x - edgePoint1.x));
        var newX = (edgePoint2.x - VERTEXES_SIZE)
        if (edgePoint1.x > edgePoint2.x) {
          var newX = (edgePoint2.x + VERTEXES_SIZE)
        }
        var newY = lineAngle *(newX - edgePoint1.x) + edgePoint1.y

        var circleStart = {
          radius : VERTEXES_SIZE,
          center : edgePoint1,
        }
        var circleEnd = {
          radius : VERTEXES_SIZE,
          center : edgePoint2,
        }
        var line = {
          p1 : edgePoint1,
          p2 : edgePoint2,
        }
        var arrowEndPoint = inteceptCircleLineSeg(circleEnd,line)[0]
        var arrowStartPoint = inteceptCircleLineSeg(circleStart,line)[0]

        var arrow = new Arrow(arrowStartPoint,arrowEndPoint);
        arrowsArray.push(arrow)
      }
    }

    drawInitState()
    queue.enqueue(vertexArray[0]);
  }

  function createRandomEdgesArray(currentIndex,numOfMaxNeighbors){
    var randomEdgesArray = new Array();
    var randomNumOfNeighbors = Math.floor((Math.random()*  numOfMaxNeighbors) + 1);
    for (i=0; i<randomNumOfNeighbors;i++){
      var eadgCandidate;
      do {
        eadgCandidate = Math.floor(Math.random()*  NUM_OF_VERTEXES);
      }
      while (eadgCandidate == currentIndex && !arrayContainsItem(randomEdgesArray,eadgCandidate));
      randomEdgesArray.push(eadgCandidate)
    }
    return randomEdgesArray;
  }

  function drawInitState(){
    drawAllVertexes(vertexArray);
    drawAllArrows(arrowsArray);
  }

  function arrayContainsItem(array,item){
    var ans = false;
    for(i=0;i<array.length;i++){
      if(array[i] == item){
        ans = true;
      }
    }
    return ans;
  }

  function drawAllArrows(arrayOfArrows){
    for (j = 0;j < arrayOfArrows.length; j++){
      drawArrow(arrayOfArrows[j].p1.x,arrayOfArrows[j].p1.y,arrayOfArrows[j].p2.x,arrayOfArrows[j].p2.y,'black',1);
    }
  }

  function isPointNotInRadiusOfOtherPoints(arrayOfPoints,point) {
    var i;
    for (i = 0; i < arrayOfPoints.length; i++) {

      var iterationPoint = arrayOfPoints[i];

      if (Math.abs(iterationPoint.x - point.x) < GAP_BETWEEN_VERTEXES ||
      Math.abs(iterationPoint.y - point.Y) < GAP_BETWEEN_VERTEXES){
        return false;
      }
    }
    return true;
  }
  function drawAllVertexes(arrayOfPoints) {
    var i;
    for (i = 0; i < arrayOfPoints.length; i++) {
      drawVertex(arrayOfPoints[i].x,arrayOfPoints[i].y,i,'orange');
    }
  }

  function drawVertex(x,y,text,color) {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x,y,VERTEXES_SIZE,0,2*Math.PI);
    ctx.fill();

    ctx.fillStyle = 'black';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = '16px serif';
    ctx.fillText(text, x,y);
    ctx.closePath();

  }

  function drawArrow(startX, startY, endX, endY,color,lineSize){
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");

    var headLength = 10;   // length of head in pixels
    var angle = Math.atan2(endY - startY,endX - startX);
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.lineTo(endX - (headLength * Math.cos(angle - Math.PI/6)) ,
    endY - (headLength * Math.sin(angle - Math.PI/6)));
    ctx.moveTo(endX, endY);
    ctx.lineTo(endX - (headLength * Math.cos(angle + Math.PI/6)),
    endY - (headLength * Math.sin(angle + Math.PI/6)));
    ctx.strokeStyle = color;
    ctx.lineWidth = lineSize;
    ctx.closePath();
    ctx.stroke();

  }

  function inteceptCircleLineSeg(circle, line){
    var a, b, c, d, u1, u2, ret, retP1, retP2, v1, v2;
    v1 = {};
    v2 = {};
    v1.x = line.p2.x - line.p1.x;
    v1.y = line.p2.y - line.p1.y;
    v2.x = line.p1.x - circle.center.x;
    v2.y = line.p1.y - circle.center.y;
    b = (v1.x * v2.x + v1.y * v2.y);
    c = 2 * (v1.x * v1.x + v1.y * v1.y);
    b *= -2;
    d = Math.sqrt(b * b - 2 * c * (v2.x * v2.x + v2.y * v2.y - circle.radius * circle.radius));
    if(isNaN(d)){ // no intercept
      return [];
    }
    u1 = (b - d) / c;  // these represent the unit distance of point one and two on the line
    u2 = (b + d) / c;
    retP1 = {};   // return points
    retP2 = {}
    ret = []; // return array
    if(u1 <= 1 && u1 >= 0){  // add point if on the line segment
      retP1.x = line.p1.x + v1.x * u1;
      retP1.y = line.p1.y + v1.y * u1;
      ret[0] = retP1;
    }
    if(u2 <= 1 && u2 >= 0){  // second add point if on the line segment
      retP2.x = line.p1.x + v1.x * u2;
      retP2.y = line.p1.y + v1.y * u2;
      ret[ret.length] = retP2;
    }
    return ret;
  }

  function getVertexArrayByIndexes(arrayOfVertexIndexes){
    var vertexesArrayToReturn = new Array();
    for (i = 0; i < arrayOfVertexIndexes.length; i++) {
      var currentIndex = arrayOfVertexIndexes[i];
      var vertex = vertexArray[currentIndex];
      vertexesArrayToReturn.push(vertex);
    }
    return vertexesArrayToReturn;
  }

  start();

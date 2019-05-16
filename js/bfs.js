function bfs() {
  if (!queue.isEmpty()){
    var vertex = queue.dequeue();
    if (vertex.isVisited) {
      bfs()
    } else {
      setVisited(vertex)
      var neighborsList = getVertexArrayByIndexes(vertex.neighbors);
      for (i = 0; i < neighborsList.length; i++) {
        queue.enqueue(neighborsList[i]);
      }
    }
  }
}

function clearBfsArrows(){
  clearCanvas()
  drawInitState()
}

function setVisited(vertex){
  vertex.isVisited = true;
  drawVertex(vertex.x,vertex.y,vertex.id,'blue');
}


function find4bfs() {
  if (!queue.isEmpty()){
    var vertex = queue.dequeue();
    console.log(vertex.id);
    if (vertex.id === 4){
        console.log("gggggg");
      drawVertex(vertex.x,vertex.y,vertex.id,'red');
    } else {
      if (vertex.isVisited) {
        find4bfs()
      } else {
        setVisited(vertex)
        var neighborsList = getVertexArrayByIndexes(vertex.neighbors);
        for (i = 0; i < neighborsList.length; i++) {
          queue.enqueue(neighborsList[i]);
        }
      }
    }
  }
}

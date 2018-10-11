const d3 = require('d3');

function firstFrame(points,data,pointWidth,canvasHeight,canvasWidth){
  points.forEach((point,i)=>{
    point.y = canvasHeight*data[i][1],
    point.x = (i*0.01)
  })
  return points
}
function secondFrame(points, data, pointWidth, canvasHeight, canvasWidth) {
  points.forEach((point, i) => {
    point.y = canvasHeight * data[i][2],
    point.x = (canvasWidth / 4 - (i * 0.01))
  })
   return points
}
function thirdFrame(points, data, pointWidth, canvasHeight, canvasWidth) {
  points.forEach((point, i) => {
    point.y = canvasHeight * data[i][3],
    point.x = (canvasWidth / 4 - (i * 0.01)) + (canvasWidth / 4) + (canvasWidth / 4)
  })
  return points
}
function fourthFrame(points, data, pointWidth, canvasHeight, canvasWidth) {
  points.forEach((point, i) => {
    point.y = canvasHeight * data[i][4],
    point.x = (canvasWidth - (i * 0.01))
  })
  return points
}

function randomLayout(points, pointWidth, width, height) {
  points.forEach((point, i) => {
    point.x = Math.random() * (width - pointWidth);
    point.y = Math.random() * (height - pointWidth);
  });

  return points;
}


/**
 * Generate an object array of `numPoints` length with unique IDs
 * and assigned colors
 */
function createPoints(pointData, pointWidth, width, height) {

  const colorScale = ['#1fef5d', '#4b9bf2', '#b945f7', '#ed2323', '#edc122'];
  console.log(pointData);
  const points = d3.range(pointData.length).map(index => ({
    index,
    color: colorScale[pointData[index][0]],
  }));

  return randomLayout(points, pointWidth, width, height);
}

module.exports = {
  createPoints,
  firstFrame,
  secondFrame,
  thirdFrame,
  fourthFrame
}
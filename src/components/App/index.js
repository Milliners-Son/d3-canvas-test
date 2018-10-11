const styles = require('./styles.scss');
const worm = require('./worm.svg');
const d3 = require('d3');
const {
  createPoints,
  firstFrame,
  secondFrame,
  thirdFrame,
  fourthFrame
} = require('./common');

const {fakeArray} = require('./fakedata');

// canvas settings
const width = 1000;
const height = 1000;

// point settings
const pointWidth = 3;

// animation settings
const duration = 5000;
const ease = d3.easePolyInOut;
let timer;
let currLayout = 0;

// create set of points
//const points = createPoints(numPoints, pointWidth, width, height);
const points = createPoints(fakeArray, pointWidth, width, height);

// wrap layout helpers so they only take points as an argument
const first = (points) => firstFrame(points, fakeArray, pointWidth, width, height);

const second = (points) => secondFrame(points, fakeArray, pointWidth, width, height);
const third = (points) => thirdFrame(points, fakeArray, pointWidth, width, height);
const fourth = (points) => fourthFrame(points, fakeArray, pointWidth, width, height);

  
// store the layouts in an array to sequence through
const layouts = [second, third, fourth, first];

// draw the points based on their current layout
function draw() {
  const ctx = canvas.node().getContext('2d');
  ctx.save();

  // erase what is on the canvas currently
  ctx.clearRect(0, 0, width, height);

  // draw each point as a rectangle
  for (let i = 0; i < points.length; ++i) {
    const point = points[i];
    ctx.fillStyle = point.color;
    ctx.fillRect(point.x, point.y, pointWidth, pointWidth);
  }

  ctx.restore();
}

// animate the points to a given layout
function animate(layout) {
  // store the source position
  points.forEach(point => {
    point.sx = point.x;
    point.sy = point.y;
  });

  // get destination x and y position on each point
  layout(points);

  // store the destination position
  points.forEach(point => {
    point.tx = point.x;
    point.ty = point.y;
  });

  timer = d3.timer((elapsed) => {
    // compute how far through the animation we are (0 to 1)
    const t = Math.min(1, ease(elapsed / duration));

    // update point positions (interpolate between source and target)
    points.forEach(point => {
      point.x = point.sx * (1 - t) + point.tx * t;
      point.y = point.sy * (1 - t) + point.ty * t;
    });

    // update what is drawn on screen
    draw();

    // if this animation is over
    if (t === 1) {
      // stop this timer for this layout and start a new one
      timer.stop();

      // update to use next layout
      currLayout = (currLayout + 1) % layouts.length;

      // start animation for next layout
      animate(layouts[currLayout]);
    }
  });
}

// create the canvas
const screenScale = window.devicePixelRatio || 1;
const canvas = d3.select('body').append('canvas')
  .attr('width', width * screenScale)
  .attr('height', height * screenScale)
  .style('width', '100%')
  .style('height', '100%')
  .on('click', function () {
    d3.select('.play-control').style('display', '');
    timer.stop();
  });
canvas.node().getContext('2d').scale(screenScale, screenScale);

// start off as a grid
first(points);
draw();

d3.select('body').append('div')
  .attr('class', 'play-control')
  .on('click', function () {
    // start the animation
    animate(layouts[currLayout]);

    // remove the play control
    d3.select(this).style('display', 'none');
  });

function App({ projectName }) {
  console.log(`[${projectName}] mounted`);
}

module.exports = App;

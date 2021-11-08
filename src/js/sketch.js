let perceptron;
let typeOne;
let typeTwo;
let typeThree;
const points = [];

const type1 = { x: -170, y: 170 };
const type2 = { x: 170, y: 170 };
const type3 = { x: -170, y: -170 };

const LAYERS = {
  entry: 2,
  hidden: 4,
  exit: 3,
};

const LEARNING_RATE = 0.1;

function setup() {
  createCanvas(WIDTH, HEIGHT);
  frameRate(2);

  perceptron = new Neuron(LAYERS, LEARNING_RATE);

  Array.from(new Array(50)).forEach(() => {
    points.push(
      new Point(
        getRandom(type1.x + RANGE, type1.x - RANGE),
        getRandom(type1.y + RANGE, type1.y - RANGE)
      )
    );
    points.push(
      new Point(
        getRandom(type2.x + RANGE, type2.x - RANGE),
        getRandom(type2.y + RANGE, type2.y - RANGE)
      )
    );
    points.push(
      new Point(
        getRandom(type3.x + RANGE, type3.x - RANGE),
        getRandom(type3.y + RANGE, type3.y - RANGE)
      )
    );
  });
}

function draw() {
  background(250);
  drawAxis();
  drawCircles();

  translate(xCenter, yCenter);
  scale(1, -1);

  points.forEach((point) => {
    const values = categorize([0, 0, 0], point);

    perceptron.train([point.x, point.y], values);
    point.type = getPointType(perceptron.classify([point.x, point.y]));
    point.draw();
  });
}

function categorize(values = [], point) {
  const vals = values;

  if (isInRange(point, type1)) {
    vals[0] = 1;
  } else if (isInRange(point, type2)) {
    vals[1] = 1;
  } else if (isInRange(point, type3)) {
    vals[2] = 1;
  }

  return vals;
}

const isInRange = (point, target) =>
  dist(point.x, point.y, target.x, target.x) < RANGE;

function drawCircles() {
  push();
  translate(xCenter, yCenter);
  scale(1, -1);
  fill(0, 0, 0, 0);
  stroke(0, 0, 255);
  ellipse(type1.x, type1.y, RANGE * 2);
  stroke(0, 255, 0);
  ellipse(type2.x, type2.y, RANGE * 2);
  stroke(255, 0, 0);
  ellipse(type3.x, type3.y, RANGE * 2);
  pop();
}

function drawAxis() {
  push();
  stroke(200);
  line(xCenter, 0, xCenter, yCenter * 2);
  line(0, yCenter, xCenter * 2, yCenter);
  pop();
}

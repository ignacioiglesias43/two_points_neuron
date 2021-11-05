function setup() {
  createCanvas(WIDTH, HEIGHT);
  frameRate(2);
}

function draw() {
  background(200);
  translate(xCenter, yCenter);
  scale(1, -1);

  line(-xCenter, -xCenter * M, xCenter, xCenter * M);
}

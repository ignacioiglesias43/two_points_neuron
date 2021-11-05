class Point {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
  }

  draw() {
    push();
    strokeWeight(3);
    stroke(50);

    /* if (this.type === 1) stroke(255, 0, 0);
    if (this.type === 2) stroke(0, 255, 0); */

    stroke(colors[this.type][0], colors[this.type][1], colors[this.type][2]);

    point(this.x, this.y);
    pop();
  }
}

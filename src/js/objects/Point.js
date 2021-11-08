class Point {
  constructor(x, y, type = 1) {
    this.x = x;
    this.y = y;
    this.type = type;
  }

  draw() {
    push();
    strokeWeight(5);
    if (this.type === 1) stroke(255, 0, 0);
    else if (this.type === 2) stroke(0, 255, 0);
    else if (this.type === 3) stroke(0, 0, 255);
    else stroke(80);

    point(this.x, this.y);
    pop();
  }
}

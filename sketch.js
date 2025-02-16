let stars = [];
let warpEffect = [];

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight * 2.33);
  canvas.position(0, 0);
  canvas.style("z-index", "-1");

  for (let i = 0; i < 200; i++) {
    stars.push(new Star());
  }
}

function draw() {
  // Background color changes as you scroll down
  let scrollFactor = map(window.scrollY, 0, document.body.scrollHeight - windowHeight, 10, 200);
  background(color(scrollFactor / 2, scrollFactor / 2, scrollFactor / 1.5));

  // Draw stars
  for (let star of stars) {
    star.move();
    star.show();
  }

  // Draw and update warp effects
  for (let i = warpEffect.length - 1; i >= 0; i--) {
    warpEffect[i].expand();
    warpEffect[i].show();
    if (warpEffect[i].size > width) {
      warpEffect.splice(i, 1);
    }
  }
}

// Star class
class Star {
  constructor(x = random(width), y = random(height)) {
    this.x = x;
    this.y = y;
    this.size = random(2, 5);
    this.speed = random(0.5, 2);
  }

  move() {
    this.y += this.speed;
    if (this.y > height) {
      this.y = 0;
      this.x = random(width);
    }
  }

  show() {
    fill(255);
    noStroke();
    ellipse(this.x, this.y, this.size);
  }
}

// Warp Effect class
class Warp {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 10;
    this.alpha = 255;
  }

  expand() {
    this.size += 15;
    this.alpha -= 5;
  }

  show() {
    noFill();
    stroke(255, this.alpha);
    strokeWeight(2);
    ellipse(this.x, this.y, this.size);
  }
}

// Click effect - Warp burst
function mousePressed() {
  // Create a warp effect at the mouse position
  warpEffect.push(new Warp(mouseX, mouseY));

  // Move all stars outward like a hyperspace effect
  for (let star of stars) {
    let angle = atan2(star.y - mouseY, star.x - mouseX);
    let force = random(5, 15);
    star.x += cos(angle) * force;
    star.y += sin(angle) * force;
  }
}

// Resize canvas on window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight * 2.33);
}

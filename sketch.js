// initalizing variables
let xBall = 200
let yBall = 35
let xPaddle = 150
let xballSpeed = 0
let yballSpeed = 0
let pts = 0
let treasure
let bouncesound
let losesound
let foreground1
let foreground2
let foreground1Y = 0
let foreground2Y = -1000
let backgrounds
let collectsound
let treasure1Y = -100
let treasure1X = -100
let treasure2Y = -100
let treasure2X = 500
let treasureflag = false
let ptsvalue = 1

function preload() { // loading assets
    backgrounds = loadImage('images/background.png')
    foreground1 = loadImage('images/foreground.png')
    foreground2 = loadImage('images/foreground.png')
    treasure = loadImage('images/treasure.png')
    bouncesound = loadSound('sounds/boing.mp3')
    losesound = loadSound('sounds/loss.mp3')
    collectsound = loadSound('sounds/collect.mp3')
}

function setup() { // set up canvas
    let canvas = createCanvas(400, 500)
    canvas.parent('content');
    background(0)
    frameRate(120); 
}

function draw() {
    fill(250)
    image(backgrounds, 0, 0) // background
    image(foreground1, 0, foreground1Y) // foregrounds
    image(foreground2, 0, foreground2Y)
    foreground1Y += 2 // move both foregrounds simulatenously downwards
    foreground2Y += 2
    if (foreground1Y > 1000) { // once it reaches the end pull it back up
        foreground1Y = -1000
    }
    if (foreground2Y > 1000) {
        foreground2Y = -1000
    }
    text(`Points: ${pts}`, 25, 30) // display points
    fill(70)
    noStroke()
    // Draw rotating treasures
    let angle = frameCount * 0.02; 
    push(); // Save the current drawing state
    translate(treasure1X, treasure1Y);
    rotate(angle);
    image(treasure, (-treasure.width / 2), (-treasure.height / 2)); // Center the image
    pop(); // Restore the previous state

    push(); // Save the current drawing state
    translate(treasure2X, treasure2Y);
    rotate(-angle);
    image(treasure, (-treasure.width / 2) - 10, (-treasure.height / 2) - 10); // Center the image
    pop(); // Restore the previous state
    // borders
    rect(0, 0, 500, 10)
    rect(0, 0, 10, 500)
    rect(390, 0, 10, 500)
    let r = map(xBall, 0, 500, 0, 255); // Red 
    let g = map(yBall, 0, 500, 255, 0); // Green  (inverse)
    let b = map(yBall, 0, 500, 0, 255); // Blue 
    fill(b, r, g) 
    ellipse(xBall, yBall, 40) // draw the ball
    fill(200)
    rect(xPaddle, 485, 100, 15) // draw the battle
    if (keyIsDown(68) && xPaddle < 400 - 111) { // move paddle with A and limit movement to border
        xPaddle += 5;
    }
    if (keyIsDown(65) && xPaddle > 13) { // move paddle with D and limit movement to border
        xPaddle -= 5;
    }
    if (xBall > 370) { // border bounce + sound
        xballSpeed *= -1.1
        xBall = 370
        bouncesound.play();
    }
    if (xBall < 30) { // border bounce + sound
        xballSpeed *= -1.1
        xBall = 30
        bouncesound.play();
    }
    if (yBall < 30) { // border bounce + sound
        yballSpeed *= -1.03
        yBall = 35
        bouncesound.play();
    }

    if (xBall > xPaddle && xBall < xPaddle + 100 && yBall > 470 && yBall < 500) { // paddle bounce physics
        let impactPoint = xBall - xPaddle;
        let mappedSpeed = map(impactPoint, 0, 100, -3, 3); // More side movement at the edges

        // Apply a threshold to remove small values close to zero
        if (abs(mappedSpeed) < 0.5) { 
            if (xballSpeed > 0) {
                xballSpeed = 0.5
            } else {
                xballSpeed = -0.5
            }
        } else {
            xballSpeed *= abs(mappedSpeed); 
        }
        yballSpeed *= -1.03;
        yBall = 470;
        bouncesound.play();
    }

    xBall += constrain(xballSpeed, -7, 7) // constrain speed to a limit
    yBall += constrain(yballSpeed, -6.5, 6.5)
    if (abs(yballSpeed) < 6) { // pts system depending on speed
        ptsvalue = 1
    }
    if (abs(yballSpeed) >= 6) {
        ptsvalue = 2
    }
    if (abs(yballSpeed) >= 6.9) {
        ptsvalue = 3
    }

    if (treasureflag == true) { // treasure movement
        treasure1X += 3
        treasure2X -= 3
    }
    if (treasure1X > 430) { // if the treasure passed the border move it to the other side at a random Y
        treasure1X = -100
        treasure1Y = random(100, 400)
    }
    if (treasure2X < -20) { // if the treasure passed the border move it to the other side at a random Y
        treasure2X = 500
        treasure2Y = random(100, 400)
    }
    if (dist(treasure1X, treasure1Y, xBall, yBall) < 43) { // ball and treasure collision
        pts += ptsvalue;
        treasure1X = -100; // Move off-screen after collection
        collectsound.play()
    }
    if (dist(treasure2X, treasure2Y, xBall, yBall) < 43) { // ball and treasure collision
        pts += ptsvalue;
        treasure2X = 500; // Move off-screen after collection
        collectsound.play()
    }

    // Loss 
    if (yBall > 520) { // reset game
        xBall = 200
        yBall = 30
        xballSpeed = 0
        yballSpeed = 0
        pts = 0
        treasureflag = false
        treasure1X = -100
        treasure2X = 500
        losesound.play()
    }
}

// begin game
function mousePressed() {
    if (xballSpeed == 0 && yballSpeed == 0) { // check if game is inactive and begin if it is
        xballSpeed = random([-5, -4.5, -4, 4, 4.5, 5])
        yballSpeed = random([4, 4.5, 5,5.5])
        treasureflag = true
        treasure1X = -100
        treasure2X = 500
        treasure1Y = random(100, 400)
        treasure2Y = random(100, 400)
    }
}

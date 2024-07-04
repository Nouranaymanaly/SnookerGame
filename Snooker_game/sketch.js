var tableWidth, tableHeight;
var ballDiameter;
var pocketDiameter;
var balls = [];
var frames = [];
var cushions = [];
var cue;
var mode = 1; // default mode
var initCueBall = false;
var cueBall;
var halfPocket;
var colouredBallCount;

var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Events = Matter.Events;

var engine, world;

var pockets = [];

var corners = [];

var img;

var collisionMessage = '';
var messageTimer = 0;

function preload() {
  img  = loadImage('/Hand.png');
} 

function setup() {
  createCanvas(1200, 600); // maintain the 2:1 ratio
  initializeGame();
}

function draw() {
    background(102); 
    Engine.update(engine);
    
    
    drawTable();

    isStriking();

    checkCollisions();

    if (!initCueBall)
      {
        image(img, mouseX-17, mouseY-28 , 40, 40);

      }
          // Display collision message if the timer is active
    if (messageTimer > 0) {
      fill(255);
      textSize(25);
      textAlign(CENTER, CENTER);
      text(collisionMessage, width / 2, height - 20);
      messageTimer--;
  }
    
}

//initialization
function initializeGame()
{
    tableWidth = 1000;
    tableHeight = tableWidth/2;
    ballDiameter = tableHeight / 36;
    pocketDiameter = ballDiameter * 1.5;
    Ddiameter = tableWidth/3;
    halfPocket = pocketDiameter/2;

    pockets = [
        { x: pocketDiameter / 6, y: pocketDiameter / 6}, // left upper corner pocket
        { x: tableWidth - pocketDiameter / 6, y: pocketDiameter / 6}, // right upper corner pocket
        { x: tableWidth - pocketDiameter / 6, y: tableHeight - pocketDiameter / 6 }, // right bottom corner pocket
        { x: pocketDiameter / 6, y: tableHeight - pocketDiameter / 6 }, // left bottom corner pocket
        { x: tableWidth / 2 , y: 0 }, // middle upper pocket
        { x: tableWidth / 2 , y: tableHeight } // middle bottom pocket
    ];
    corners = [
        { x: -(pocketDiameter / 1.5), y: -(pocketDiameter / 1.5), w: pocketDiameter, h: pocketDiameter, r: [20, 0, 0, 0] }, // left upper
        { x: tableWidth - (pocketDiameter / 3), y: -(pocketDiameter / 1.5), w: pocketDiameter, h: pocketDiameter, r: [0, 20, 0, 0] }, // right upper
        { x: tableWidth - (pocketDiameter / 3), y: tableHeight - (pocketDiameter / 3), w: pocketDiameter, h: pocketDiameter, r: [0, 0, 20, 0] }, // right bottom
        { x: -(pocketDiameter / 1.5), y: tableHeight - (pocketDiameter / 3), w: pocketDiameter, h: pocketDiameter, r: [0, 0, 0, 20] }, // left bottom
        { x: (tableWidth / 2) - 1 - halfPocket, y: -(pocketDiameter / 1.5), w: pocketDiameter + 2, h: pocketDiameter, r: [0, 0, 0, 0] }, // middle upper
        { x: (tableWidth / 2) - 1 - halfPocket, y: tableHeight - (pocketDiameter / 3), w: pocketDiameter + 2, h: pocketDiameter, r: [0, 0, 0, 0] } // middle bottom
      ];

    // Initialize Matter.js
    engine = Engine.create();
    world = engine.world;

    // Initialize balls, Frame, Cushions and cue, and add to world
    initialiseElements();

    // Add collision event listener
    Events.on(engine, 'collisionStart', handleCollision);

}

function initialiseElements()
{
    initBalls();
    initFrame();
    cue = new Cue();
}

function isStriking()
{
    if (cue.striking) {
        cue.checkCueBallStop();
    } else {
        cue.show();
    } 
}

class Frame {
    constructor(x, y, sizeX, sizeY) {
        this.body = Bodies.rectangle(x, y, sizeX, sizeY, { isStatic: true });
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        World.add(world, this.body);
    }

    show() {
        var vertices = this.body.vertices;
        fill(70, 35, 5);
        drawVertices(vertices);
    }
}
function initFrame() {
    // Initialize frames around the table edges
    frames = [];

    // Top boundary
    frames.push(new Frame(tableWidth / 2, 0, tableWidth, pocketDiameter * 1.3));
    // Bottom boundary
    frames.push(new Frame(tableWidth / 2, tableHeight, tableWidth, pocketDiameter * 1.3));
    // Left boundary
    frames.push(new Frame(0, tableHeight / 2, pocketDiameter* 1.3, tableHeight));
    // Right boundary
    frames.push(new Frame(tableWidth, tableHeight / 2, pocketDiameter * 1.3, tableHeight));
}

function drawFrames() {
    // Draw all frames
    for (var frame of frames) {
        frame.show();
    }
}

class Ball {
    constructor(x, y, color) {
      

      this.body = Bodies.circle(x, y, ballDiameter / 2, { restitution: 0.8, friction: 0.05, gravity:0});
      this.color = color;
      engine.world.gravity.y = 0;
      World.add(world, this.body);

      if (color === "white") {
        this.body.label = 'cue-ball';
    } else if (color === "red") {
      this.body.label = 'red-ball';
    } else {
      this.body.label = color + '-ball';
    }
      
    }
  
    show() {
      push();
      translate(100,50);
      var pos = this.body.position;
      fill(this.color);
      ellipse(pos.x, pos.y, ballDiameter);
      pop();
    }
}

function initBalls() {
    // Clear existing balls
    balls = [];

    // Initialize balls in their starting positions
    //RED BALLS
    var baseX = tableWidth - (tableWidth / 4);
    var baseY = tableHeight / 2;
    
    for (var row = 1; row <= 5; row++) {
        for (var i = 0; i < row; i++) {
            var x = baseX + (row * ballDiameter);
            var y = baseY + (i - (row - 1) / 2) * ballDiameter;
            balls.push(new Ball(x, y, "red"));
        }
    }
    

    // OTHER BALLS
    balls.push(new Ball(tableWidth - (tableWidth/11), tableHeight / 2, "black")); 

    balls.push(new Ball(tableWidth - (tableWidth/4), tableHeight / 2, "pink")); 

    balls.push(new Ball(tableWidth/2, tableHeight / 2, "blue")); 

    balls.push(new Ball(tableWidth/5, tableHeight / 2, "orange")); 

    balls.push(new Ball(tableWidth/5, tableHeight / 2 - tableHeight/6 , "green")); 

    balls.push(new Ball(tableWidth/5, tableHeight / 2 + tableHeight/6 , "yellow")); 

}

function drawBalls() {
  // Draw all balls
  for (var ball of balls) {
    ball.show();
  }
}

class Cue {
    constructor() {
        this.striking = false;
        this.cueBall = null;
        // this.cueStart = createVector(0, 0); // Starting point of cue
        this.cueEnd = createVector(0, 0); // Ending point of cue
        this.maxCueLength = tableWidth; // Maximum length of the cue 
        this.minForceMagnitude = 0.001; // Minimum force magnitude
        this.maxForceMagnitude = 0.01; // Maximum force magnitude

        // Set initial cue ball if already initialized
        if (initCueBall) {
            this.cueBall = balls.find(ball => ball.color === "white");
        }
    }

    show() {
        if (!this.striking && initCueBall) {
            this.cueEnd.set(mouseX - 100, mouseY - 50);
            // Draw cue direction
            push();
            translate(100, 50);
            stroke(255);
            strokeWeight(1);
            line(this.cueBall.body.position.x, this.cueBall.body.position.y, this.cueEnd.x, this.cueEnd.y);
            pop();
        }
    }


    strike() {
        if (initCueBall && !this.striking) {
            this.striking = true;

            // Calculate the direction and length of the cue
            var direction = createVector(this.cueEnd.x - this.cueBall.body.position.x, this.cueEnd.y - this.cueBall.body.position.y);
            // var direction = createVector(this.cueBall.body.position.x- this.cueEnd.x, this.cueBall.body.position.y- this.cueEnd.y );
            var cueLength = direction.mag();
            direction.normalize();

            // Calculate force magnitude based on cue length
            var forceMagnitude = map(cueLength, 0, this.maxCueLength, this.minForceMagnitude, this.maxForceMagnitude);

            // Apply force based on direction and calculated magnitude
            var force = p5.Vector.mult(direction, forceMagnitude);
            Body.applyForce(this.cueBall.body, this.cueBall.body.position, force);
        }
    }

    checkCueBallStop() {
        var speed = this.cueBall.body.speed;
        if (speed < 0.1) { // Threshold speed to consider the ball stopped
            this.striking = false;
        }
    }
}

function drawTable()
{
    
    noStroke();

    push();
    translate(100,50);

    //FRAME
    drawFrames();

    //CORNERS
    fill(240,200,0);
    for (var corner of corners) {
        rect(corner.x, corner.y, corner.w, corner.h,corner.r[0],corner.r[1],corner.r[2], corner.r[3]);
      }

    //GREEN TABLE
    fill(79,135,51); 
    rect(0, 0, tableWidth, tableHeight);

    //CUSHIONS
    fill(69,125,41);
    // RIGHT UPPER
    quad((tableWidth/2), 0, (tableWidth/2)+20, halfPocket, tableWidth-pocketDiameter, halfPocket, tableWidth-halfPocket, 0);
    //LEFT UPPER
    quad(halfPocket, 0, pocketDiameter, halfPocket, (tableWidth/2)-20, halfPocket, (tableWidth/2), 0);

    //RIGHT LOWER
    quad((tableWidth/2), tableHeight, (tableWidth/2)+20, tableHeight - halfPocket, tableWidth-pocketDiameter, tableHeight-halfPocket, tableWidth-halfPocket, tableHeight);
    //LEFT LOWER
    quad(halfPocket, tableHeight, pocketDiameter, tableHeight-halfPocket, (tableWidth/2)-20, tableHeight- halfPocket, (tableWidth/2), tableHeight);

    //right
    quad(tableWidth-halfPocket, pocketDiameter, tableWidth, halfPocket, tableWidth, tableHeight-halfPocket, tableWidth - halfPocket, tableHeight-pocketDiameter);
    //LEFT
    quad(halfPocket, pocketDiameter, 0, halfPocket, 0, tableHeight-halfPocket, halfPocket, tableHeight-pocketDiameter);
    
    //POCKETS
    fill(0)
    for (var pocket of pockets) 
        {
        ellipse(pocket.x, pocket.y, pocketDiameter, pocketDiameter);
      }

      //Dzone
      push()
        ellipseMode(CORNER);
        stroke(255);
        noFill();
        arc((tableWidth / 5)- (tableHeight / 6),(tableHeight/3) , tableHeight / 3, tableHeight / 3, HALF_PI, PI + HALF_PI);
        line(tableWidth / 5,0,tableWidth / 5, tableHeight);
        pop()

    pop();
    
    drawBalls();
} 

function mouseReleased() {
    if (initCueBall) {
        cue.strike();
    } else {
        // Check if the mouse is inside the Dzone to place the cue ball
        var DzoneCenterX = (tableWidth / 5) + 100;
        var DzoneCenterY = (tableHeight / 2) + 50;
        var DzoneRadius = tableHeight / 6;

        var distanceToCenter = dist(mouseX, mouseY, DzoneCenterX, DzoneCenterY);

        if (distanceToCenter < DzoneRadius && DzoneCenterX - mouseX > 0) {
            var newCueBall = new Ball(mouseX - 100, mouseY - 50, "white");
            balls.push(newCueBall);
            cue.cueBall = newCueBall;
            initCueBall = true;
        } else {
            alert("You cannot set the Cue Ball outside the Dzone");
        }
    }
}

function keyPressed() {
  if (key == '1') {
    mode = 1;
    initBalls(); // Reset to starting positions
  } else if (key == '2') {
    mode = 2;
    randomizeRedBalls();
  } else if (key == '3') {
    mode = 3;
    randomizeAllBalls();
  }
}

function randomizeRedBalls() {
  // Randomize positions of red balls only
  balls = balls.filter(ball => ball.color !== "red");
  for (var i = 0; i < 15; i++) {
    var x = random(tableWidth / 2 + ballDiameter, tableWidth - ballDiameter);
    var y = random(ballDiameter, tableHeight - ballDiameter);
    balls.push(new Ball(x, y, "red"));
  }
}

function randomizeAllBalls() {
  // Randomize positions of all balls except the cue ball
  balls = balls.filter(ball => ball.color === "white");
  var colors = ["red", "yellow", "green", "brown", "blue", "pink", "black"];
  for (var color of colors) {
    var x = random(ballDiameter, tableWidth - ballDiameter);
    var y = random(ballDiameter, tableHeight - ballDiameter);
    balls.push(new Ball(x, y, color));
  }
  randomizeRedBalls();
}

function checkCollisions() {
  for (var ball of balls) {
    // Check collision with pockets
    if (isInPocket(ball)) {
      if (ball.color == "white") {
        // Cue ball falls in pocket
        resetCueBall();
        colouredBallCount =0;
      } 
      else if(ball.color == "red") {
        // Red ball falls in pocket
        handleRedBallInPocket(ball);
        colouredBallCount =0;
      }
      //handle coloured ball when falling in pocket
      else
      {
        resetColourBall(ball);
        
        if (colouredBallCount > 0) 
        {
          alert("Mistake: Two consecutive coloured balls have fallen into the pocket!");
        }
        colouredBallCount +=1;
        
      }
    }
  }
}

function isInPocket(ball) {
    var pos = ball.body.position;
    for (var pocket of pockets) {
        var d = dist(pos.x, pos.y, pocket.x , pocket.y);
        if (d < (pocketDiameter/2)+(ballDiameter)) {
            return true;
        }
    }
    return false;
}

function resetCueBall() {
  // Reset the cue ball to the D zone 
  World.remove(world, balls.find(ball => ball.color == "white").body);
  balls = balls.filter(ball => ball.color !== "white");
//   balls.push(new Ball(tableWidth / 4, tableHeight / 2, "white"));
initCueBall = false
}

function resetColourBall(ball) {
World.remove(world, ball.body);
balls = balls.filter(b => b !== ball);

var newPosition;
switch (ball.color) {
    case 'black':
    newPosition = { x: tableWidth - tableWidth / 11, y: tableHeight / 2 };
    break;
    case 'pink':
    newPosition = { x: tableWidth - tableWidth / 4, y: tableHeight / 2 };
    break;
    case 'blue':
    newPosition = { x: tableWidth / 2, y: tableHeight / 2 };
    break;
    case 'orange':
    newPosition = { x: tableWidth / 5, y: tableHeight / 2 };
    break;
    case 'green':
    newPosition = { x: tableWidth / 5, y: tableHeight / 2 - tableHeight / 6 };
    break;
    case 'yellow':
    newPosition = { x: tableWidth / 5, y: tableHeight / 2 + tableHeight / 6 };
    break;
    default:
    return;
}

balls.push(new Ball(newPosition.x, newPosition.y, ball.color));
}
   
function handleRedBallInPocket(ball) {
  // Handle a ball falling into the pocket
  World.remove(world, ball.body);
  balls = balls.filter(b => b !== ball);
}

function drawVertices(vertices) {
    beginShape();
    for (var i = 0; i < vertices.length; i++) {
      vertex(vertices[i].x, vertices[i].y);
    }
    endShape(CLOSE);
}

function handleCollision(event) {
  var pairs = event.pairs;

  for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i];
      var bodyA = pair.bodyA;
      var bodyB = pair.bodyB;

      if (isCueBall(bodyA) || isCueBall(bodyB)) {
          var cueBall = isCueBall(bodyA) ? bodyA : bodyB;
          var otherBody = isCueBall(bodyA) ? bodyB : bodyA;

          if (isRedBall(otherBody)) {
            notifyUser('cue-red');
          } else if (isColoredBall(otherBody)) {
            notifyUser('cue-colour');
          } else if (isCushion(otherBody)) {
            notifyUser('cue-cushion');
          }
      }
  }
}

function isCueBall(body) {
  return body.label == 'cue-ball';
}

function isRedBall(body) {
  return body.label === 'red-ball';
}

function isColoredBall(body) {
  return body.label !== 'cue-ball' && body.label !== 'red-ball' && body.label !== 'cushion';
}

function isCushion(body) {
  return body.label === 'cushion';
}

function notifyUser(type) {
  switch (type) {
      case 'cue-red':
          collisionMessage = "Cue ball hit a red ball!";
          break;
      case 'cue-colour':
          collisionMessage = "Cue ball hit a colored ball!";
          break;
      case 'cue-cushion':
          collisionMessage = "Cue ball hit a cushion!";
          break;
  }
  messageTimer = 120; // Display the message for 2 seconds (assuming 60 FPS)
}


//preview: python -m http.server
let team1;
let team2;
let leftView;
let rightView;
let imgFlag;
let imgStartScreen;
let imgEndScreen;
let imgPortal;
let imgStartButton;
let imgResetButton;
let imgDarkGplayer;
let imgLightGplayer;
let imgDarkRplayer;
let imgLightRplayer;
let arrayOfPlayers = [];
let timerLength = 500;
let timer = timerLength; 
let portal1;   
let portal2;
let gameState = "Before";
let startButton;
let resetButton;

async function setup() {
  imgFlag = await loadImage('flag-hackathon_2026.png');
  imgStartScreen = await loadImage('oct26-startscreen.png');
  imgEndScreen = await loadImage('hackthon-tag-oct26-gameover.png');
  imgPortal = await loadImage('oct26-portal.png');
  imgStartButton = await loadImage('oct26-play-button.png');
  imgResetButton = await loadImage('0ct26-resetbutton.png');
  imgDarkGplayer = await loadImage('oct26-darkgreen.png');
  imgLightGplayer = await loadImage('oct26-lightgreen.png');
  imgDarkRplayer = await loadImage('oct26-red.png');
  imgLightRplayer = await loadImage('oct26-pink.png');

  createButtons();
  
  createCanvas(windowWidth-30, windowHeight-30);
  leftView = createGraphics((windowWidth-30)/2, windowHeight-30);
  rightView = createGraphics((windowWidth-30)/2, windowHeight-30);

  createTeams();

  assignFlag();

  createPortals();
}

function mousePressed() {
  if (gameState == "Before"){
    if (startButton.checkcollision() == true){
      team2.Points = 0
      team1.points = 0
      resetGame();
      gameState = "Playing";
    }
  }
  if (gameState == "After"){
    if (resetButton.checkcollision() == true){
      resetGame();
      gameState = "Before"
    }
  }
}

function draw() {
  if (gameState == "Playing"){
    background(30);

    upDateplayingBackground();

    UpDateportals();

    upDatePlayers(team1, team2);
    upDatePlayers(team2, team1);

    fill(0);
    textSize(60);
    textAlign(CENTER, CENTER)
    text(team2.Points + " : " + team1.Points , (windowWidth-31)/ 2 , 40);

    upDateTimer()

    if (team1.Points == 5 || team2.Points == 5){
      gameState = "After"
    }

  } else if (gameState == "Before"){
    background(30)
    image(imgStartScreen, 0, 0, windowWidth-30, windowHeight-30)
    startButton.display();

  } else if (gameState == "After"){
    let teamWMostP;
    if (team1.Points > team2.Points){
      teamWMostP = team1;
    }
    if (team1.Points < team2.Points){
      teamWMostP = team2;
    }
    background(50)

    image(imgEndScreen, 0, 0, windowWidth-30, windowHeight-30)

    resetButton.display();

    fill(255);
    textSize(100);
    textAlign(CENTER, CENTER)
    text(team2.Points + " : " + team1.Points , 280 , 400);

    if (teamWMostP == team1){
      fill(255, 0, 0);
      textSize(30);
      textAlign(CENTER, CENTER)
      text("RED WINS", 280 , 500);
    } else {
      fill(0, 255, 0);
      textSize(30);
      textAlign(CENTER, CENTER)
      text("GREEN WINS", 280 , 500);
    }

    upDatePlayersModForEnd(teamWMostP);
  }
}

function upDateplayingBackground(){
  leftView.background(50, 100, 200); // Blue background
  leftView.fill(255);
  leftView.noStroke();

  rightView.background(255, 150, 0); // Red background
  rightView.fill(255);
  rightView.noStroke();

  image(leftView,(windowWidth-30)/2, 0);
  image(rightView, 0, 0);

  stroke(255);
  strokeWeight(6);
  line((windowWidth/2)-15, 0, (windowWidth/2)-15, height);
}

function UpDateportals(){
  portal1.display();
  portal2.display();

  for (let i = 0; i < arrayOfPlayers.length; i++){
    portal1.checkCollision(arrayOfPlayers[i], portal2);
    portal2.checkCollision(arrayOfPlayers[i], portal1);
  }
}

function upDatePlayers(target, check){
    for (let i = 0; i < target.arrayofteam.length; i++){
    target.arrayofteam[i].canMoveAround();
    target.arrayofteam[i].update();   
    target.arrayofteam[i].checkKeys();
    target.arrayofteam[i].display();
    target.arrayofteam[i].checkEdges();
    for (let j = 0; j < team2.arrayofteam.length; j++){
      if(target.arrayofteam[i].checkCollision(check.arrayofteam[j])){ 
        target.Points++
      }
    }
  }
}

function upDatePlayersModForEnd(target){
    for (let i = 0; i < target.arrayofteam.length; i++){
    target.arrayofteam[i].canMoveAround();
    target.arrayofteam[i].update();   
    target.arrayofteam[i].checkKeys();
    target.arrayofteam[i].display();
    target.arrayofteam[i].checkEdges();
  }
}

function upDateTimer(){
  timer--
  fill(0);
  textSize(60);
  textAlign(CENTER, CENTER)
  text(timer, (windowWidth-31)/ 2 , 90);
  if (timer <= 0){
    if (team1.isTagger == false){
      team1.Points++
    } else {
      team2.Points++
    }
    for (let i = 0; i < arrayOfPlayers.length; i++){
      resetRound();
    }
    timer = timerLength;
  }
}

function resetRound(){
  for (let i = 0; i < arrayOfPlayers.length; i++){
    arrayOfPlayers[i].pos.x = arrayOfPlayers[i].startingPos.x
    arrayOfPlayers[i].pos.y = arrayOfPlayers[i].startingPos.y
    arrayOfPlayers[i].canMoveTimer = 50;
  }
  assignFlag();
}

function assignFlag(){
  for (let i = 0; i < arrayOfPlayers.length; i++){
    arrayOfPlayers[i].holdingFlag = false;
    arrayOfPlayers[i].isTagger = true;
  }
  team1.isTagger = true;
  team2.isTagger = true;
  let rand = random([team1, team2])
  rand.isTagger = false;
  rand.teamate1.isTagger = false;
  rand.teamate2.isTagger = false;
  rand.arrayofteam[random([0 , 1])].holdingFlag = true;
}

function resetGame(){
  team1.Points = 0
  team2.points = 0
  for (let i = 0; i < arrayOfPlayers.length; i++){
    arrayOfPlayers[i].vel.x = 0;
    arrayOfPlayers[i].vel.y = 0;
    arrayOfPlayers[i].acc.x = 0;
    arrayOfPlayers[i].acc.y = 0;
  }
}

function createTeams(){
  team1 = new Team((new Ball((width / 4)*3, height/4, 40, UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, 255, 0, 200, team1, imgLightRplayer)), (new Ball((width / 4)*3, (height/4)*3, 40, 101, 98, 97, 99, 255, 0, 0, team1, imgDarkRplayer)), 0);
  team2 = new Team((new Ball(width / 4, height/4, 40, 87, 83, 65, 68, 0, 255, 0, team2, imgLightGplayer)), (new Ball(width / 4, (height/4)*3, 40, 73, 75, 74, 76, 0, 255, 150, team2, imgDarkGplayer)), 0);
   
  arrayOfPlayers.push(...team1.arrayofteam);
  arrayOfPlayers.push(...team2.arrayofteam);
}

class Team{
  constructor(teamate1, teamate2, Points){
    this.teamate1 = teamate1
    this.teamate2 = teamate2
    this.Points = Points
    this.isTagger = true
    this.arrayofteam = [this.teamate1, this.teamate2]
  }
}

class Ball {
  constructor(x, y, diameter, w, a, s, d, rd, gn, bu, teamNumber, image) {
    this.startingPos = createVector(x,y)
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.diameter = diameter;
    this.topSpeed = 20;
    this.friction = 0.92;
    this.up = w;
    this.down = s;
    this.left = a;
    this.right = d;
    this.red =rd;
    this.green = gn;
    this.blue = bu;
    this.hasTagged = false;
    this.team = teamNumber
    this.holdingFlag = false;
    this.canMove = true;
    this.canMoveTimerValue = 50;
    this.canMoveTimer = this.canMoveTimerValue;
    this.isTagger = true;
    this.image = image;
  }
 checkCollision(other){
  var d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
  if (this.holdingFlag == false){
    if ((d < this.diameter/2 + other.diameter/2 && this.hasTagged == false && other.holdingFlag == true)){
      this.hasTagged = true
      for (let i = 0; i < arrayOfPlayers.length; i++){
         resetRound();
      }
      this.hasTagged = false
      timer = timerLength;
      return true;
    }
    if ((d < this.diameter/2 + other.diameter/2 && this.hasTagged == false && other.isTagger == true)){
      for (let i = 0; i < arrayOfPlayers.length; i++){
        other.canMoveTimer = 100;
      }
    }
  }
}

canMoveAround(){
  if (this.canMoveTimer > 0){
    this.canMove = false
    this.canMoveTimer--
  }
  if (this.canMoveTimer <= 0){
    this.canMove = true
  }
}
  // Method to check keyboard input and apply forces
  checkKeys() {
    let forceMagnitude = 12;
    
    if (keyIsDown(this.down))  this.applyForce(createVector(-forceMagnitude, 0));
    if (keyIsDown(this.right)) this.applyForce(createVector(forceMagnitude, 0));
    if (keyIsDown(this.up))    this.applyForce(createVector(0, -forceMagnitude));
    if (keyIsDown(this.left))  this.applyForce(createVector(0, forceMagnitude));
  }

  // The "Force" pattern: Force adds to Acceleration
  applyForce(force) {
    if (this.canMove == true){
      this.acc.add(force);
    }
  }

  update() {
    if (this.canMove == true){
      this.acc.mult(0.1)
      // 1. Acceleration changes Velocity
      this.vel.add(this.acc);
      
      // 2. Limit the speed so it doesn't go infinite
      if (this.holdingFlag == true){
        this.vel.limit(this.topSpeed - 10);
      } else {
        this.vel.limit(this.topSpeed);
      }
      
      
      // 3. Velocity changes Position
      this.pos.add(this.vel);
      
      // 4. Apply friction (velocity decay)
      this.vel.mult(this.friction);
      
      // 5. Reset acceleration for the next frame
      this.acc.mult(0);
    }
  }

  display() {
    fill(this.red, this.green, this.blue);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.diameter);
    image(this.image, this.pos.x -this.diameter/2, this.pos.y -this.diameter/2, this.diameter, this.diameter);
    if (this.holdingFlag == true){
      image(imgFlag, this.pos.x-15, this.pos.y-37, 75, 75);
    }
  }
 
  checkEdges() {
    if (this.pos.x > width-(this.diameter/2)){
      this.vel.x = Math.abs(this.acc.x)*-1.2; 
      // this.pos.x = 0
    }
    if (this.pos.x < 0 + this.diameter/2){
      this.vel.x = Math.abs(this.acc.x)*1.2;
      // this.pos.x = windowWidth-(30+this.d/2)
    }
    
    if (this.pos.y > height-(this.diameter/2)){
      this.vel.y = Math.abs(this.acc.y)*-1.2;
      // this.pos.y = 0
    }
    if (this.pos.y < 0 + this.diameter/2){
      this.vel.y = Math.abs(this.acc.y)*1.2;
      // this.pos.y = windowHeight-(30+this.d/2)
    }
  }
}

function createPortals() {
    portal1 = new Portal(random(30, (windowWidth-30)/2), random(30, windowHeight-30), 40);
    portal2 = new Portal(random((windowWidth-30)/2, windowWidth-30), random(30, windowHeight-30), 40);
}

class Portal{
  constructor(posx, posy, radius){
    this.x = posx
    this.y = posy
    this.radius = radius
    this.image = imgPortal
  }
    display() {
    fill(255, 150 , 0);
    noStroke();
    ellipse(this.x, this.y, this.radius);
    image(this.image, this.x -20, this.y -20, this.radius, this.radius)
  }
  checkCollision(other, link){
    var d = dist(this.x, this.y, other.pos.x, other.pos.y);
    if (d < this.radius/2 + other.diameter/2){
      other.pos.x = link.x
      other.pos.y = link.y
      other.vel.x = 0
      other.vel.y = 0
      other.acc.x = 0
      other.acc.y = 0 
      createPortals();
    }
  }
}

function createButtons(){
  startButton = new Button (windowWidth/2+20, windowHeight/2+100, 200, 100, imgStartButton);
  resetButton = new Button (0, 0, 100, 100, imgResetButton);
}

class Button{
  constructor(x, y, w, h, image){
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.image = image
    this.r = 255
    this.g = 0
    this.b = 0
  }
  display(){
    fill(this.r, this.g, this.b)
    noStroke()
    image(this.image, this.x, this.y, this.w, this.h);
  }
  checkcollision(){
    if (this.x - this.w/2 < mouseX + 1 && this.x + this.w/2 > mouseX + 1 && this.y - this.h/2 < mouseY + 1 && this.y + this.h/2 > mouseY + 1) {
      return true;
    } else {
      return false;
    }
  }
}
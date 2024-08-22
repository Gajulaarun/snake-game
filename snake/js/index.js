// Game Constants & Variables
let inputDir = {x: 0, y: 0}; 
const foodSound = new Audio('food.mp3');
const gameOverSound = new Audio('gameover.mp3');
const moveSound = new Audio('move.mp3');
const musicSound = new Audio('music.mp3');
let speed = 5;  // Initial speed
let score = 0;
let lastPaintTime = 0;
let snakeArr = [
    {x: 13, y: 15}
];

food = {x: 6, y: 7};

// Flag to track user interaction and pause state
let userInteracted = false;
let isPaused = false;

// Function to handle user interaction
function handleUserInteraction() {
    if (!userInteracted) {
        userInteracted = true;
        musicSound.play().catch(error => console.log("Playback error: ", error)); // Start playing background music after user interaction
    }
}

// Game Functions
function main(ctime) {
    window.requestAnimationFrame(main);
    // Proceed only if enough time has passed since the last frame and the game is not paused
    if((ctime - lastPaintTime)/1000 < 1/speed || isPaused){
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    // Check if the snake collides with itself
    for (let i = 1; i < snakeArr.length; i++) {
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y){
            return true;
        }
    }
    // Check if the snake hits the wall
    if(snake[0].x >= 18 || snake[0].x <=0 || snake[0].y >= 18 || snake[0].y <=0){
        return true;
    }
    return false;
}

function gameEngine(){
    // Part 1: Handle game over and reset the game
    if(isCollide(snakeArr)){
        gameOverSound.play().catch(error => console.log("Playback error: ", error));
        musicSound.pause();
        inputDir = {x: 0, y: 0}; 
        alert("Game Over. Press any key to play again!");
        snakeArr = [{x: 13, y: 15}];
        musicSound.play().catch(error => console.log("Playback error: ", error));
        score = 0;
        speed = 5; // Reset speed when the game restarts
    }

    // Part 2: Check if the snake has eaten the food
    if(snakeArr[0].y === food.y && snakeArr[0].x === food.x){
        foodSound.play().catch(error => console.log("Playback error: ", error));
        score += 1;
        
        // Increase the speed gradually
        speed *= 1.05; // Increase speed by 5%
        
        // Update high score if needed
        if(score > highscoreval){
            highscoreval = score;
            localStorage.setItem("highscore", JSON.stringify(highscoreval));
            highscoreBox.innerHTML = "HighScore: " + highscoreval;
        }
        scoreBox.innerHTML = "Score: " + score;
        // Add new segment to the snake
        snakeArr.unshift({x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y});
        // Generate new food position
        let a = 2;
        let b = 16;
        food = {x: Math.round(a + (b-a) * Math.random()), y: Math.round(a + (b-a) * Math.random())}
    }

    // Part 3: Move the snake
    for (let i = snakeArr.length - 2; i>=0; i--) { 
        snakeArr[i+1] = {...snakeArr[i]};
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 4: Render the snake and food on the board
    board.innerHTML = "";
    snakeArr.forEach((e, index)=>{
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if(index === 0){
            snakeElement.classList.add('head');
        } else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });
    // Display the food
    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// Main logic starts here
let highscore = localStorage.getItem("highscore");
if(highscore === null){
    highscoreval = 0;
    localStorage.setItem("highscore", JSON.stringify(highscoreval));
} else {
    highscoreval = JSON.parse(highscore);
}
highscoreBox.innerHTML = "HighScore: " + highscoreval;

window.requestAnimationFrame(main);

// Add event listener for user interaction
window.addEventListener('click', handleUserInteraction);
window.addEventListener('keydown', handleUserInteraction);

window.addEventListener('keydown', e => {
    if (e.key === 'Escape') { // Pause/Resume the game when 'Escape' key is pressed
        isPaused = !isPaused;
        if (isPaused) {
            musicSound.pause();
        } else {
            musicSound.play().catch(error => console.log("Playback error: ", error));
        }
        return;
    }
    if (isPaused) return; // Ignore other key events when paused

    inputDir = {x: 0, y: 1}; // Start the game
    moveSound.play().catch(error => console.log("Playback error: ", error));
    handleUserInteraction(); // Ensure the user has interacted

    switch (e.key) {
        case "ArrowUp":
            console.log("ArrowUp");
            inputDir.x = 0;
            inputDir.y = -1;
            break;

        case "ArrowDown":
            console.log("ArrowDown");
            inputDir.x = 0;
            inputDir.y = 1;
            break;

        case "ArrowLeft":
            console.log("ArrowLeft");
            inputDir.x = -1;
            inputDir.y = 0;
            break;

        case "ArrowRight":
            console.log("ArrowRight");
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        default:
            break;
    }
});

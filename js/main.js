import createTetrominoes from './tetrominoes/tetrominoes.js';
import { smallTetrominoes } from './tetrominoes/smallTetrominoes.js';
import { colors, svgColors } from './colors/colors.js';
import generateRandomIndex from './utils/generateRandomIndex.js';

const GRID_WIDTH = 10;
const GRID_HEIGHT = 20;
const GRID_SIZE = GRID_WIDTH * GRID_HEIGHT;

const gameGrid = createGrid(GRID_SIZE, GRID_WIDTH);
const cells = Array.from(gameGrid.querySelectorAll('div'));
const tetrominoes = createTetrominoes(GRID_WIDTH);
const nextTetrominoSVG = document.querySelector('#next-tetromino-wrapper svg');
const startButton = document.getElementById('start-button');
const score = document.getElementById('score');
const width = 10;

let gameStart = false;
let gameSpeed = 1000;
let isDescending;

// Create grid
function createGrid(size, width) {
  const grid = document.getElementById('game-grid');
  // Main grid
  for (let i = 0; i < size; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    // Set bottom boundary
    if (i >= size - width) {
      cell.classList.add('bottom');
    }
    grid.appendChild(cell);
  }

  return grid;
}

let currentPosition = 3;
// Draw Tetromino
function drawCurrent(tetromino, colorIndex) {
  tetromino.forEach((index) => {
    // cells[index + currentPosition].classList.add('block');
    cells[index + currentPosition].style.backgroundImage = colors[colorIndex];
  });
}

// Undraw Tetromino
function undrawCurrent(tetromino) {
  tetromino.forEach((index) => {
    // cells[index + currentPosition].classList.remove('block');
    cells[index + currentPosition].style.backgroundImage = '';
  });
}

// Display next Tetromino
function drawNext(smallTetromino, colorIndex) {
  const xmlns = 'http://www.w3.org/2000/svg';
  const path = document.createElementNS(xmlns, 'path');
  path.setAttribute('fill', `${svgColors[colorIndex]}`);
  path.setAttribute('d', smallTetromino);

  nextTetrominoSVG.appendChild(path);
}

// Undraw next Tetromino
function undrawNext() {
  while (nextTetrominoSVG.firstChild) {
    nextTetrominoSVG.removeChild(nextTetrominoSVG.firstChild);
  }
}

let currentTetrominoIndex;
let currentTetrominoRotation = 0;
let currentTetromino;
let currentColorIndex;

let nextTetrominoIndex;
const nextTetrominoRotation = 0;
let nextTetromino;
let nextColorIndex;

// Start or pause the game
startButton.addEventListener('click', () => {
  gameStart = !gameStart;
  if (gameStart) {
    if (!currentTetromino && !nextTetromino) {
      currentTetrominoIndex = generateRandomIndex(tetrominoes.length);
      currentTetromino =
        tetrominoes[currentTetrominoIndex][currentTetrominoRotation];
      currentColorIndex = generateRandomIndex(colors.length);

      nextTetrominoIndex = generateRandomIndex(tetrominoes.length);
      nextTetromino =
        smallTetrominoes[nextTetrominoIndex][nextTetrominoRotation];
      nextColorIndex = generateRandomIndex(svgColors.length);

      drawCurrent(currentTetromino, currentColorIndex);
      drawNext(nextTetromino, nextColorIndex);
    }
    descend();
  }
  if (!gameStart && isDescending !== undefined) {
    clearInterval(isDescending);
  }
});

// Tetromino descends
function descend() {
  isDescending = setInterval(() => {
    // Check if the Tetromino reaches the bottom or lands on the previous piece
    const reachBottom = currentTetromino.some(
      (index) =>
        cells[index + currentPosition].classList.contains('bottom') ||
        cells[index + currentPosition + width].classList.contains(
          'previousPiece'
        )
    );

    if (reachBottom) {
      clearInterval(isDescending);
      currentTetromino.forEach((index) =>
        cells[index + currentPosition].classList.add('previousPiece')
      );
      calculateScore();
      currentTetrominoIndex = nextTetrominoIndex;
      currentTetrominoRotation = 0;
      currentTetromino =
        tetrominoes[currentTetrominoIndex][currentTetrominoRotation];
      currentColorIndex = nextColorIndex;
      currentPosition = 3;

      nextTetrominoIndex = generateRandomIndex(tetrominoes.length);
      nextTetromino =
        smallTetrominoes[nextTetrominoIndex][nextTetrominoRotation];
      nextColorIndex = generateRandomIndex(svgColors.length);
      undrawNext();
      drawNext(nextTetromino, nextColorIndex);
      drawCurrent(currentTetromino, currentColorIndex);
      descend();
    } else {
      undrawCurrent(currentTetromino);
      currentPosition += 10;
      drawCurrent(currentTetromino, currentColorIndex);
    }
  }, gameSpeed);
}

// Game controls
function control(e) {
  switch (e.key) {
    case 'ArrowRight':
      moveRight();
      break;
    case 'ArrowLeft':
      moveLeft();
      break;
    case 'ArrowDown':
      moveDown();
      break;
    case 'ArrowUp':
      rotation();
      break;
    default:
      return null;
  }
}

// Listen for key down
document.addEventListener('keydown', control);

function moveRight() {
  const rightmost = currentTetromino.some(
    (index) =>
      (index + currentPosition + 1) % 10 === 0 ||
      cells[index + currentPosition + 1].classList.contains('previousPiece')
  );
  if (!rightmost) {
    undrawCurrent(currentTetromino);
    currentPosition++;
    drawCurrent(currentTetromino, currentColorIndex);
  }
}

function moveLeft() {
  const leftmost = currentTetromino.some(
    (index) =>
      (index + currentPosition) % 10 === 0 ||
      cells[index + currentPosition - 1].classList.contains('previousPiece')
  );
  if (!leftmost) {
    undrawCurrent(currentTetromino);
    currentPosition--;
    drawCurrent(currentTetromino, currentColorIndex);
  }
}

function moveDown() {
  const bottom = currentTetromino.some(
    (index) =>
      cells[index + currentPosition].classList.contains('bottom') ||
      cells[index + currentPosition + width].classList.contains('previousPiece')
  );
  if (!bottom) {
    undrawCurrent(currentTetromino);
    currentPosition += 10;
    drawCurrent(currentTetromino, currentColorIndex);
  }
}

function rotation() {
  const leftmost = currentTetromino.some(
    (index) => (index + currentPosition) % 10 === 0
  );
  const rightmost = currentTetromino.some(
    (index) => (index + currentPosition + 1) % 10 === 0
  );
  const rotation =
    currentTetrominoRotation + 1 === 4 ? 0 : currentTetrominoRotation + 1;
  const rotatedTetromino = tetrominoes[currentTetrominoIndex][rotation];
  const leftmostBlock = rotatedTetromino[0];
  const rightmostBlockOne = rotatedTetromino[3];
  const rightmostBlockTwo = rotatedTetromino[2];
  const bottommostBlock = Math.max(...rotatedTetromino);
  const topmostBlock = Math.min(...rotatedTetromino);
  let tempPosition = currentPosition;
  let isCollidedLeft = false;
  let isCollidedRight = false;
  let isCollidedBottom = false;
  if (
    (leftmost && (leftmostBlock + tempPosition) % width === 9) ||
    cells[leftmostBlock + tempPosition].classList.contains('previousPiece')
  ) {
    tempPosition++;
    if (
      cells[rightmostBlockOne + tempPosition].classList.contains(
        'previousPiece'
      ) ||
      cells[rightmostBlockTwo + tempPosition].classList.contains(
        'previousPiece'
      )
    ) {
      isCollidedLeft = true;
    }
  }
  for (let i = 0; i < 2; i++) {
    if (
      (rightmost && (rightmostBlockOne + tempPosition) % width <= 1) ||
      cells[rightmostBlockOne + tempPosition].classList.contains(
        'previousPiece'
      )
    ) {
      tempPosition--;
    }
  }
  if (
    (rightmost && (rightmostBlockTwo + tempPosition) % width === 0) ||
    cells[rightmostBlockTwo + tempPosition].classList.contains('previousPiece')
  ) {
    tempPosition--;
  }
  if (cells[leftmostBlock + tempPosition].classList.contains('previousPiece')) {
    isCollidedRight = true;
  }
  for (let i = 0; i < 2; i++) {
    if (
      bottommostBlock + tempPosition >= GRID_SIZE ||
      cells[bottommostBlock + tempPosition].classList.contains('previousPiece')
    ) {
      tempPosition -= 10;
      if (
        cells[topmostBlock + tempPosition].classList.contains('previousPiece')
      ) {
        isCollidedBottom = true;
      }
    }
  }
  if (!isCollidedLeft && !isCollidedRight && !isCollidedBottom) {
    undrawCurrent(currentTetromino);
    currentPosition = tempPosition;
    currentTetrominoRotation = rotation;
    currentTetromino = rotatedTetromino;
    drawCurrent(rotatedTetromino, currentColorIndex);
  }
}

function calculateScore() {
  for (let i = 0; i < GRID_SIZE; i += 10) {
    const line = cells.slice(i, i + width);
    const completedLine = line.every((cell) =>
      cell.classList.contains('previousPiece')
    );
    if (completedLine) {
      line.forEach((cell) => {
        cell.style.backgroundImage = '';
        cell.classList.remove('previousPiece');
      });
      for (let index = i - 1; index >= 0; index--) {
        if (cells[index].classList.contains('previousPiece')) {
          cells[index + 10].classList.add('previousPiece');
          cells[index + 10].style.backgroundImage =
            cells[index].style.backgroundImage;
          cells[index].classList.remove('previousPiece');
          cells[index].style.backgroundImage = '';
        }
      }
      score.innerText = String(Number(score.innerText) + 1);
    }
  }
}

import { Board } from './Board';
import { Tetromino } from './Tetromino';

import type { TetrominoTypes, Colors, TetrominoPreview } from './Tetromino';

export class State {
  #score: number;
  #level: number;
  #clearedLines: number;
  #isGameOver: boolean;
  #currTetromino: Tetromino;
  #nextTetromino: TetrominoPreview;
  #board: Board;
  #onTetrominoLock: () => void;

  constructor(
    board: Board,
    currTetromino: Tetromino,
    nextTetromino: TetrominoPreview,
    onTetrominoLock: () => void
  ) {
    this.#score = 0;
    this.#level = 0;
    this.#clearedLines = 0;
    this.#isGameOver = false;
    this.#currTetromino = currTetromino;
    this.#nextTetromino = nextTetromino;
    this.#board = board;
    this.#onTetrominoLock = onTetrominoLock;
  }

  update(elapsedTime: number, keys: Record<string, boolean>) {}

  get score() {
    return this.#score;
  }

  get level() {
    return this.#level;
  }

  get isGameOver() {
    return this.#isGameOver;
  }

  get currTetromino() {
    return this.#currTetromino;
  }

  set currTetromino(tetromino: Tetromino) {}

  get nextTetromino() {
    return this.#nextTetromino;
  }

  set nextTetromino(tetromino: TetrominoPreview) {}

  get board() {
    return this.#board;
  }
}

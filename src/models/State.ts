import { Board } from './Board';
import { Tetromino } from './Tetromino';

import type { TetrominoTypes, Colors, TetrominoPreview } from './Tetromino';

export class State {
  private _score: number;
  private _level: number;
  private clearedLines: number;
  private _isGameOver: boolean;
  private _currTetromino: Tetromino;
  private _nextTetromino: TetrominoPreview;
  private _board: Board;
  private onTetrominoLock: () => void;

  constructor(
    board: Board,
    currTetromino: Tetromino,
    nextTetromino: TetrominoPreview,
    onTetrominoLock: () => void
  ) {
    this._score = 0;
    this._level = 0;
    this.clearedLines = 0;
    this._isGameOver = false;
    this._currTetromino = currTetromino;
    this._nextTetromino = nextTetromino;
    this._board = board;
    this.onTetrominoLock = onTetrominoLock;
  }

  update(elapsedTime: number, keys: Record<string, boolean>) {}

  get score() {
    return this._score;
  }

  get level() {
    return this._level;
  }

  get isGameOver() {
    return this._isGameOver;
  }

  get currTetromino() {
    return this._currTetromino;
  }

  set currTetromino(tetromino: Tetromino) {}

  get nextTetromino() {
    return this._nextTetromino;
  }

  set nextTetromino(tetromino: TetrominoPreview) {}

  get board() {
    return this._board;
  }
}

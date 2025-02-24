import type { State } from './State';

export enum TetrominoTypes {
  I = 'I',
  O = 'O',
  T = 'T',
  S = 'S',
  Z = 'Z',
  J = 'J',
  L = 'L',
}
const TETROMINO_TYPES = Object.values(TetrominoTypes);
const NUM_OF_TETROMINO_TYPES = TETROMINO_TYPES.length;

type TetrominoBlocks = {
  [key in TetrominoTypes]: number[][]; // 4 x 2 matrix
};
const TETROMINO_BLOCKS: TetrominoBlocks = {
  [TetrominoTypes.I]: [
    [0, -1],
    [0, 0],
    [0, 1],
    [0, 2],
  ],
  [TetrominoTypes.O]: [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ],
  [TetrominoTypes.T]: [
    [-1, 0],
    [0, -1],
    [0, 0],
    [0, 1],
  ],
  [TetrominoTypes.S]: [
    [0, -1],
    [0, 0],
    [-1, 0],
    [-1, 1],
  ],
  [TetrominoTypes.Z]: [
    [-1, -1],
    [-1, 0],
    [0, 0],
    [0, 1],
  ],
  [TetrominoTypes.J]: [
    [-1, -1],
    [0, -1],
    [0, 0],
    [0, 1],
  ],
  [TetrominoTypes.L]: [
    [0, -1],
    [0, 0],
    [-1, 1],
    [0, 1],
  ],
};

const COLORS = ['blue', 'green', 'navy', 'peach', 'pink', 'purple', 'yellow'];
const NUM_OF_COLORS = COLORS.length;
export type Colors = (typeof COLORS)[number];

export class Tetromino {
  private type: TetrominoTypes;
  private _color: Colors;
  private _blocks: number[][]; // 4 x 2 matrix
  private _pivotPosition: number[]; // [row, col]
  private DAS: number; // Delayed Auto Shift
  private isDownPressed: boolean;
  private fallInterval: number;
  private hardDropInterval: number;
  private _isLocked: boolean;

  /**
   * Create a Tetromino.
   * @param {TetrominoTypes} type
   * @param {Colors} color
   * @param {number[]} pivotPosition - [row, col]
   * @param {number} level -  non-negative integer
   */
  constructor(
    type: TetrominoTypes,
    color: Colors,
    pivotPosition: number[],
    level: number
  ) {
    this.type = type;
    this._color = color;
    this._blocks = TETROMINO_BLOCKS[type];
    this._pivotPosition = pivotPosition;
    this.DAS = 200; // 200ms
    this.isDownPressed = false;
    this.fallInterval = 1000 - 50 * level;
    this.hardDropInterval = 50;
    this._isLocked = false;
  }

  update(elapsedTime: number, state: State, keys: Record<string, boolean>) {}

  private moveDown() {}

  private hardDrop() {}

  private horizontalMove(direction: 'left' | ' right') {}

  private rotate(direction = 'clockwise') {}

  get isLocked() {
    return this._isLocked;
  }

  get blocks() {
    return this._blocks;
  }

  get pivotPosition() {
    return this._pivotPosition;
  }

  get color() {
    return this._color;
  }
}

export interface TetrominoPreview {
  type: TetrominoTypes;
  color: Colors;
}
export function getRandomTetrominoPreview(): TetrominoPreview {}

function generateRandomIndex(range: number): number {
  return Math.floor(Math.random() * range);
}

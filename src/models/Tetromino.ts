import type { Position } from '../types';
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
const TETROMINO_TYPE_COUNT = TETROMINO_TYPES.length;

export type BlockPositions = [Position, Position, Position, Position];
type TetrominoBlocks = {
  [key in TetrominoTypes]: BlockPositions;
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
const COLOR_COUNT = COLORS.length;
export type Colors = (typeof COLORS)[number];

const DELAYED_AUTO_SHIFT = 200; // 200ms
const HARD_DROP_INTERVAL = 50; // 50ms

export class Tetromino {
  readonly #type: TetrominoTypes;
  readonly #color: Colors;
  readonly #blocks: BlockPositions;
  #pivotPosition: Position;
  #isDownPressed: boolean;
  #isLocked: boolean;
  readonly #fallInterval: number;

  /**
   * Create a Tetromino.
   * @param {TetrominoTypes} type
   * @param {Colors} color
   * @param {Position} pivotPosition - [x, y]
   * @param {number} level -  non-negative integer
   */
  constructor(
    type: TetrominoTypes,
    color: Colors,
    pivotPosition: Position,
    level: number
  ) {
    this.#type = type;
    this.#color = color;
    this.#blocks = TETROMINO_BLOCKS[type];
    this.#pivotPosition = pivotPosition;
    this.#isDownPressed = false;
    this.#isLocked = false;
    this.#fallInterval = 1000 - 50 * level;
  }

  update(elapsedTime: number, state: State, keys: Record<string, boolean>) {}

  getBlockPositions(): BlockPositions {
    return this.#blocks.map(([offsetX, offsetY]) => [
      offsetX + this.#pivotPosition[0],
      offsetY + this.#pivotPosition[1],
    ]) as BlockPositions;
  }

  private moveDown() {}

  private hardDrop() {}

  private horizontalMove(direction: 'left' | ' right') {}

  private rotate(direction = 'clockwise') {}

  get isLocked() {
    return this.#isLocked;
  }

  get color() {
    return this.#color;
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

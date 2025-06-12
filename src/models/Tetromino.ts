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
} as const;

const COLORS = [
  'blue',
  'green',
  'navy',
  'peach',
  'pink',
  'purple',
  'yellow',
] as const;
const COLOR_COUNT = COLORS.length;
export type Colors = (typeof COLORS)[number];

const DELAYED_AUTO_SHIFT = 200; // 200ms
const HARD_DROP_INTERVAL = 50; // 50ms
// https://harddrop.com/wiki/Tetris_The_Grand_Master
const GRAVITY_DENOMINATOR = 256;
// Gravity G = number of rows per frame
// For instance, at level 0, G = 4/256 rows per frame.
const LEVEL_GRAVITY_TABLE: [number, number][] = [
  [0, 4 / GRAVITY_DENOMINATOR],
  [30, 6 / GRAVITY_DENOMINATOR],
  [35, 8 / GRAVITY_DENOMINATOR],
  [40, 10 / GRAVITY_DENOMINATOR],
  [50, 12 / GRAVITY_DENOMINATOR],
  [60, 16 / GRAVITY_DENOMINATOR],
  [70, 32 / GRAVITY_DENOMINATOR],
  [80, 48 / GRAVITY_DENOMINATOR],
  [90, 64 / GRAVITY_DENOMINATOR],
  [100, 80 / GRAVITY_DENOMINATOR],
  [120, 96 / GRAVITY_DENOMINATOR],
  [140, 112 / GRAVITY_DENOMINATOR],
  [160, 128 / GRAVITY_DENOMINATOR],
  [170, 144 / GRAVITY_DENOMINATOR],
  // In Tetris The Grand Master, gravity doesn't increase uniformly. It rises and falls depending on the level.
  // So, it’s intentional that the gravity at level 200 is 4/256.
  [200, 4 / GRAVITY_DENOMINATOR],
  [220, 32 / GRAVITY_DENOMINATOR],
  [230, 64 / GRAVITY_DENOMINATOR],
  [233, 96 / GRAVITY_DENOMINATOR],
  [236, 128 / GRAVITY_DENOMINATOR],
  [239, 160 / GRAVITY_DENOMINATOR],
  [243, 192 / GRAVITY_DENOMINATOR],
  [247, 224 / GRAVITY_DENOMINATOR],
  [251, 256 / GRAVITY_DENOMINATOR],
  [300, 512 / GRAVITY_DENOMINATOR],
  [330, 768 / GRAVITY_DENOMINATOR],
  [360, 1024 / GRAVITY_DENOMINATOR],
  [400, 1280 / GRAVITY_DENOMINATOR],
  [420, 1024 / GRAVITY_DENOMINATOR],
  [450, 768 / GRAVITY_DENOMINATOR],
  [500, 5120 / GRAVITY_DENOMINATOR],
] as const;

export function getGravity(level: number): number {
  let gravity = LEVEL_GRAVITY_TABLE[0][1];

  for (let i = 1; i < LEVEL_GRAVITY_TABLE.length; i++) {
    const [_level, _gravity] = LEVEL_GRAVITY_TABLE[i];
    if (
      level >= _level &&
      (i + 1 === LEVEL_GRAVITY_TABLE.length ||
        level < LEVEL_GRAVITY_TABLE[i + 1][0])
    ) {
      gravity = _gravity;
      break;
    }
  }

  return gravity;
}

export class Tetromino {
  readonly #type: TetrominoTypes;
  readonly #color: Colors;
  readonly #blocks: BlockPositions;
  #pivotPosition: Position;
  readonly #gravity: number;
  #rowsToDrop: number;
  #isDownPressed: boolean;
  #isLocked: boolean;

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
    this.#gravity = getGravity(level);
    this.#rowsToDrop = 0;
    this.#isDownPressed = false;
    this.#isLocked = false;
  }

  update(elapsedTime: number, state: State, keys: Record<string, boolean>) {}

  getBlockPositions(): BlockPositions {
    return this.#blocks.map(([offsetX, offsetY]) => [
      offsetX + this.#pivotPosition[0],
      offsetY + this.#pivotPosition[1],
    ]) as BlockPositions;
  }

  #moveDown() {}

  #hardDrop() {}

  #horizontalMove(direction: 'left' | ' right') {}

  #rotate(direction = 'clockwise') {}

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

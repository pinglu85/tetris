const L_TETROMINO_ZERO = 'M75.5 50h-34V33h-17v34h51z';
const L_TETROMINO_ONE = 'M50 75.5v-34h17v-17H33v51z';
const L_TETROMINO_TWO = 'M24.5 50h34v17h17V33h-51z';
const L_TETROMINO_THREE = 'M50 24.5v34H33v17h34v-51z';

const _L_TETROMINO_ZERO = 'M24.5 50h34V33h17v34h-51z';
const _L_TETROMINO_ONE = 'M50 75.5v-34H33v-17h34v51z';
const _L_TETROMINO_TWO = 'M75.5 50h-34v17h-17V33h51z';
const _L_TETROMINO_THREE = 'M50 24.5v34h17v17H33v-51z';

const Z_TETROMINO_ZERO = 'M58.5 33h-17v17h-17v17h34V50h17V33z';
const Z_TETROMINO_ONE = 'M67 58.5v-17H50v-17H33v34h17v17h17z';

const _Z_TETROMINO_ZERO = 'M41.5 33h17v17h17v17h-34V50h-17V33z';
const _Z_TETROMINO_ONE = 'M33 58.5v-17h17v-17h17v34H50v17H33z';

const T_TETROMINO_ZERO = 'M58.5 50V33h-17v17h-17v17h51V50z';
const T_TETROMINO_ONE = 'M50 58.5h17v-17H50v-17H33v51h17z';
const T_TETROMINO_TWO = 'M41.5 50v17h17V50h17V33h-51v17z';
const T_TETROMINO_THREE = 'M50 41.5H33v17h17v17h17v-51H50z';

const O_TETROMINO = 'M50 33H33v34h34V33z';

const I_TETROMINO_ZERO = 'M67 41.5H16v17h68v-17z';
const I_TETROMINO_ONE = 'M41.5 33v51h17V16h-17z';

const lTetrominoSmall = [
  L_TETROMINO_ZERO,
  L_TETROMINO_ONE,
  L_TETROMINO_TWO,
  L_TETROMINO_THREE,
];

const _lTetrominoSmall = [
  _L_TETROMINO_ZERO,
  _L_TETROMINO_ONE,
  _L_TETROMINO_TWO,
  _L_TETROMINO_THREE,
];

const zTetrominoSmall = [
  Z_TETROMINO_ZERO,
  Z_TETROMINO_ONE,
  Z_TETROMINO_ZERO,
  Z_TETROMINO_ONE,
];

const _zTetrominoSmall = [
  _Z_TETROMINO_ZERO,
  _Z_TETROMINO_ONE,
  _Z_TETROMINO_ZERO,
  _Z_TETROMINO_ONE,
];

const tTetrominoSmall = [
  T_TETROMINO_ZERO,
  T_TETROMINO_ONE,
  T_TETROMINO_TWO,
  T_TETROMINO_THREE,
];

const oTetrominoSmall = [O_TETROMINO, O_TETROMINO, O_TETROMINO, O_TETROMINO];

const iTetrominoSmall = [
  I_TETROMINO_ZERO,
  I_TETROMINO_ONE,
  I_TETROMINO_ZERO,
  I_TETROMINO_ONE,
];

export const smallTetrominoes = [
  lTetrominoSmall,
  _lTetrominoSmall,
  zTetrominoSmall,
  _zTetrominoSmall,
  tTetrominoSmall,
  oTetrominoSmall,
  iTetrominoSmall,
];
export default function tetrominoes(width) {
  const lTetromino = [
    [width, width * 2, width * 2 + 1, width * 2 + 2],
    // [0, width, width + 1, width + 2],
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    // [0, 1, 2, width + 2],
    [1, width + 1, width * 2 + 1, width * 2],
  ];

  const _lTetromino = [
    [width * 2, width * 2 + 1, width + 2, width * 2 + 2],
    // [2, width, width + 1, width + 2],
    [0, 1, width + 1, width * 2 + 1],
    [width, width + 1, width + 2, width * 2],
    // [0, 1, 2, width],
    [1, width + 1, width * 2 + 1, width * 2 + 2],
  ];

  const zTetromino = [
    [width * 2, width + 1, width * 2 + 1, width + 2],
    // [1, 2, width, width + 1],
    [0, width, width + 1, width * 2 + 1],
    [width * 2, width + 1, width * 2 + 1, width + 2],
    // [1, 2, width, width + 1],
    [0, width, width + 1, width * 2 + 1],
  ];

  const _zTetromino = [
    [width, width + 1, width * 2 + 1, width * 2 + 2],
    // [0, 1, width + 1, width + 2],
    [2, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width * 2 + 1, width * 2 + 2],
    // [0, 1, width + 1, width + 2],
    [2, width + 1, width + 2, width * 2 + 1],
  ];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];

  const oTetromino = [
    [1, 2, width + 1, width + 2],
    [1, 2, width + 1, width + 2],
    [1, 2, width + 1, width + 2],
    [1, 2, width + 1, width + 2],
  ];

  const iTetromino = [
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
  ];

  return [
    lTetromino,
    _lTetromino,
    zTetromino,
    _zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];
}

import { describe, it, expect } from 'vitest';

import { Board } from './Board';
import { BUFFER_ROW_COUNT } from '../constants';

import type { Cell, TetrominoLike } from './Board';
import type { BlockPositions } from './Tetromino';
import type { Position } from '../types';

enum Colors {
  BLUE = 'blue',
  GREEN = 'green',
  NAVY = 'navy',
  PINK = 'pink',
  YELLOW = 'yellow',
  RED = 'red',
  WHITE = 'white',
}

const CHARACTER_TO_CELL_STATE: Record<string, Cell> = {
  '.': { filled: false, color: '' },
  B: { filled: true, color: Colors.BLUE },
  G: { filled: true, color: Colors.GREEN },
  N: { filled: true, color: Colors.NAVY },
  P: { filled: true, color: Colors.PINK },
  Y: { filled: true, color: Colors.YELLOW },
  R: { filled: true, color: Colors.RED },
  W: { filled: true, color: Colors.WHITE },
};

describe('Board', () => {
  describe('createEmpty', () => {
    it('creates a board instance with an empty grid of the specified number of rows and columns', () => {
      const totalRowCount = 20 + BUFFER_ROW_COUNT;
      const columnCount = 10;
      const board = Board.createEmpty(
        totalRowCount,
        columnCount,
        BUFFER_ROW_COUNT
      );
      const expectedGrid: Cell[][] = createEmptyGrid(
        totalRowCount,
        columnCount
      );

      expect(board).toBeInstanceOf(Board);
      expect(board.grid).toStrictEqual(expectedGrid);
    });

    it('throws an error if `totalRowCount` is less than `bufferRowCount`', () => {
      const totalRowCount = 4;
      const columnCount = 3;
      const bufferRowCount = 5;

      expect(() => {
        Board.createEmpty(totalRowCount, columnCount, bufferRowCount);
      }).toThrowError(Error);
    });

    it('throws an error if `totalRowCount` is not positive', () => {
      const totalRowCount = 0;
      const columnCount = 3;
      const bufferRowCount = -3;

      expect(() => {
        Board.createEmpty(totalRowCount, columnCount, bufferRowCount);
      }).toThrowError(RangeError);
    });

    it('throws an error if `columnCount` is not positive', () => {
      const totalRowCount = 20;
      const columnCount = 0;

      expect(() => {
        Board.createEmpty(totalRowCount, columnCount, BUFFER_ROW_COUNT);
      }).toThrowError(RangeError);
    });

    it('throws an error if `bufferRowCount` is negative', () => {
      const totalRowCount = 20;
      const columnCount = 10;
      const bufferRowCount = -1;

      expect(() => {
        Board.createEmpty(totalRowCount, columnCount, bufferRowCount);
      }).toThrowError(RangeError);
    });
  });

  describe('fromGrid', () => {
    it('creates a board from a given grid', () => {
      const grid = stringToGrid(
        `
          . . W . . . . . . .
          . . W . . . . . . .
          . . W W . . . . Y Y
          G . N . . R R . Y Y
          G N N N . R R Y Y .
          G G . P P P P . Y Y
        `,
        BUFFER_ROW_COUNT
      );
      const board = Board.fromGrid(grid, BUFFER_ROW_COUNT);

      expect(board).toBeInstanceOf(Board);
      expect(board.grid).toStrictEqual(grid);
    });

    it('creates a deep copy of the input grid', () => {
      const grid = stringToGrid(
        `
          . . W . . . . . . .
          . . W . . . . . . .
          . . W W . . . . Y Y
          G . N . . R R . Y Y
          G N N N . R R Y Y .
          G G . P P P P . Y Y
        `,
        BUFFER_ROW_COUNT
      );
      const board = Board.fromGrid(grid, BUFFER_ROW_COUNT);

      expect(board.grid).not.toBe(grid);

      for (let i = 0; i < grid.length; i++) {
        expect(board.grid[i]).not.toBe(grid[i]);

        for (let j = 0; j < grid[i].length; j++) {
          expect(board.grid[i][j]).not.toBe(grid[i][j]);
        }
      }
    });

    it('throws an error if the grid is an empty array', () => {
      const grid: Cell[][] = [];
      const bufferRowCount = -1;

      expect(() => {
        Board.fromGrid(grid, bufferRowCount);
      }).toThrowError(RangeError);
    });

    it('throws an error if the grid contains any empty arrays as rows', () => {
      const grid: Cell[][] = [
        [
          { filled: false, color: '' },
          { filled: false, color: '' },
          { filled: false, color: '' },
        ],
        [
          { filled: false, color: '' },
          { filled: false, color: '' },
          { filled: false, color: '' },
        ],
        [
          { filled: false, color: '' },
          { filled: false, color: '' },
          { filled: false, color: '' },
        ],
        [
          { filled: false, color: '' },
          { filled: false, color: '' },
          { filled: false, color: '' },
        ],
        [],
        [
          { filled: false, color: '' },
          { filled: false, color: '' },
          { filled: false, color: '' },
        ],
        [],
        [
          { filled: false, color: '' },
          { filled: false, color: '' },
          { filled: false, color: '' },
        ],
      ];

      expect(() => {
        Board.fromGrid(grid, BUFFER_ROW_COUNT);
      }).toThrowError(RangeError);
    });

    it('throws an error if the grid has inconsistent row lengths', () => {
      const grid: Cell[][] = [
        [
          { filled: false, color: '' },
          { filled: false, color: '' },
          { filled: false, color: '' },
        ],
        [
          { filled: false, color: '' },
          { filled: false, color: '' },
          { filled: false, color: '' },
        ],
        [
          { filled: false, color: '' },
          { filled: false, color: '' },
          { filled: false, color: '' },
        ],
        [{ filled: false, color: '' }],
        [
          { filled: false, color: '' },
          { filled: false, color: '' },
        ],
        [
          { filled: false, color: '' },
          { filled: false, color: '' },
          { filled: false, color: '' },
          { filled: false, color: '' },
        ],
        [
          { filled: false, color: '' },
          { filled: false, color: '' },
          { filled: false, color: '' },
        ],
        [
          { filled: false, color: '' },
          { filled: false, color: '' },
          { filled: false, color: '' },
        ],
      ];

      expect(() => {
        Board.fromGrid(grid, BUFFER_ROW_COUNT);
      }).toThrowError(/rows?.*lengths?/);
    });

    it('throws an error when grid has fewer rows than `bufferRowCount`', () => {
      const totalRowCount = 5;
      const columnCount = 5;
      const bufferRowCount = 6;
      const grid: Cell[][] = createEmptyGrid(totalRowCount, columnCount);

      expect(() => {
        Board.fromGrid(grid, bufferRowCount);
      }).toThrowError(Error);
    });

    it('throws an error if `bufferRowCount` is negative', () => {
      const totalRowCount = 5;
      const columnCount = 5;
      const bufferRowCount = -1;
      const grid: Cell[][] = createEmptyGrid(totalRowCount, columnCount);

      expect(() => {
        Board.fromGrid(grid, bufferRowCount);
      }).toThrowError(RangeError);
    });

    it('throws an error if the grid contains any completed lines', () => {
      const grid = stringToGrid(
        `
          . . . . . . . . . .
          . . W . . . . . . .
          . . W W W W . . . .
          N N W W R R R N Y Y
          G . N N N R R N Y Y
          G N N N . R R Y Y .
          G G . P P P P . Y Y
        `,
        BUFFER_ROW_COUNT
      );

      expect(() => {
        Board.fromGrid(grid, BUFFER_ROW_COUNT);
      }).toThrowError();
    });
  });

  describe('lockTetromino', () => {
    it('integrates the tetromino correctly into an empty grid', () => {
      const totalRowCount = 5 + BUFFER_ROW_COUNT;
      const columnCount = 5;
      const board = Board.createEmpty(
        totalRowCount,
        columnCount,
        BUFFER_ROW_COUNT
      );
      const expectedGrid = stringToGrid(
        `
              . . . . .
              . . . . .
              . B . . .
              B B . . .
              B . . . .
            `,
        BUFFER_ROW_COUNT
      );
      const tetromino: TetrominoLike = {
        color: Colors.BLUE,
        getBlockPositions: mockGetBlockPosition(
          [
            [-1, 1],
            [0, 0],
            [0, 1],
            [1, 0],
          ],
          [totalRowCount - 2, 0]
        ),
      };

      board.lockTetromino(tetromino);
      expect(board.grid).toStrictEqual(expectedGrid);
    });

    it('integrates the tetromino correctly into a non-empty grid', () => {
      const initialGrid = stringToGrid(
        `
              . . . . . . . . . .
              . . . . . . . . . .
              . . . . . . . . Y Y
              G . N . . R R . Y Y
              G N N N . R R Y Y .
              G G . P P P P . Y Y
            `,
        BUFFER_ROW_COUNT
      );
      const board = Board.fromGrid(initialGrid, BUFFER_ROW_COUNT);
      const expectedGrid = stringToGrid(
        `
              . . . . . . . . . .
              . . . G . . . . . .
              . . . G G . . . Y Y
              G . N G . R R . Y Y
              G N N N . R R Y Y .
              G G . P P P P . Y Y
            `,
        BUFFER_ROW_COUNT
      );
      const tetromino: TetrominoLike = {
        color: Colors.GREEN,
        getBlockPositions: mockGetBlockPosition(
          [
            [-1, 0],
            [0, 0],
            [0, 1],
            [1, 0],
          ],
          [2 + BUFFER_ROW_COUNT, 3]
        ),
      };

      board.lockTetromino(tetromino);
      expect(board.grid).toStrictEqual(expectedGrid);
    });

    it('throws an error if the tetromino is not resting on the bottom or other blocks', () => {
      const totalRowCount = 20 + BUFFER_ROW_COUNT;
      const columnCount = 10;
      const board = Board.createEmpty(
        totalRowCount,
        columnCount,
        BUFFER_ROW_COUNT
      );
      /**
       * Tetromino:
       *  B B
       *  B
       *  B
       */
      const tetromino: TetrominoLike = {
        color: Colors.BLUE,
        getBlockPositions: mockGetBlockPosition(
          [
            [-1, 0],
            [-1, 1],
            [0, 0],
            [1, 0],
          ],
          [totalRowCount - 3, 0]
        ),
      };

      expect(() => {
        board.lockTetromino(tetromino);
      }).toThrowError();
    });

    it('throws an error when any part of the tetromino is in the buffer rows', () => {
      const initialGrid = stringToGrid(
        `
          . . . . . . . . . .
          . . . . . . . . . .
          . . . . G G G G Y Y
          G . N . . R R . Y Y
          G N N N . R R Y Y .
          G G . P P P P . Y Y
        `,
        BUFFER_ROW_COUNT
      );
      const board = Board.fromGrid(initialGrid, BUFFER_ROW_COUNT);
      /**
       *  Tetromino and its position on the grid:
       *    . . . . . . . . . .  buffer row
       *    . . . . . . . B . .  buffer row
       *    . . . . . . . B B .
       *    . . . . . . . B . .
       *    . . . . G G G G Y Y
       *    G . N . . R R . Y Y
       *    G N N N . R R Y Y .
       *    G G . P P P P . Y Y
       */
      const tetromino: TetrominoLike = {
        color: Colors.BLUE,
        getBlockPositions: mockGetBlockPosition(
          [
            [-1, 1],
            [0, 0],
            [0, 1],
            [1, 0],
          ],
          [2, 7]
        ),
      };

      expect(() => {
        board.lockTetromino(tetromino);
      }).toThrowError();
    });

    type BoundaryTestCase = [
      name: string,
      tetrominoInfo: {
        blockOffsets: BlockPositions;
        pivotPosition: Position;
      },
      gridInfo: {
        totalRowCount: number;
        columnCount: number;
        bufferRowCount: number;
      }
    ];

    it.each<BoundaryTestCase>([
      [
        'left boundary',
        {
          /**
           *  Tetromino:
           *     B
           *   B B B
           */
          blockOffsets: [
            [-1, 0],
            [0, -1],
            [0, 0],
            [0, 1],
          ],
          pivotPosition: [5 + BUFFER_ROW_COUNT - 1, 0],
        },
        {
          totalRowCount: 5 + BUFFER_ROW_COUNT,
          columnCount: 5,
          bufferRowCount: BUFFER_ROW_COUNT,
        },
      ],
      [
        'right boundary',
        {
          /**
           *  Tetromino:
           *     B
           *   B B B
           */
          blockOffsets: [
            [-1, 0],
            [0, -1],
            [0, 0],
            [0, 1],
          ],
          pivotPosition: [5 + BUFFER_ROW_COUNT - 1, 4],
        },
        {
          totalRowCount: 5 + BUFFER_ROW_COUNT,
          columnCount: 5,
          bufferRowCount: BUFFER_ROW_COUNT,
        },
      ],
      [
        'top boundary',
        {
          /**
           *  Tetromino:
           *     B
           *   B B B
           */
          blockOffsets: [
            [-1, 0],
            [0, -1],
            [0, 0],
            [0, 1],
          ],
          pivotPosition: [0, 2],
        },
        {
          totalRowCount: 1,
          columnCount: 5,
          bufferRowCount: 0,
        },
      ],
      [
        'bottom boundary',
        {
          /**
           *  Tetromino:
           *     B
           *   B B B
           */
          blockOffsets: [
            [-1, 0],
            [0, -1],
            [0, 0],
            [0, 1],
          ],
          pivotPosition: [5 + BUFFER_ROW_COUNT, 2],
        },
        {
          totalRowCount: 5 + BUFFER_ROW_COUNT,
          columnCount: 5,
          bufferRowCount: BUFFER_ROW_COUNT,
        },
      ],
    ])(
      'throws an error when the tetromino exceeds %s',
      (_, tetrominoInfo, gridInfo) => {
        const { totalRowCount, columnCount, bufferRowCount } = gridInfo;
        const board = Board.createEmpty(
          totalRowCount,
          columnCount,
          bufferRowCount
        );
        const { blockOffsets, pivotPosition } = tetrominoInfo;
        const tetromino: TetrominoLike = {
          color: Colors.BLUE,
          getBlockPositions: mockGetBlockPosition(blockOffsets, pivotPosition),
        };

        expect(() => {
          board.lockTetromino(tetromino);
        }).toThrowError(/tetromino/);
      }
    );

    type OverlapTestCase = [
      name: string,
      tetrominoInfo: {
        blockOffsets: BlockPositions;
        pivotPosition: Position;
      },
      gridInfo: {
        grid: Cell[][];
        bufferRowCount: number;
      }
    ];

    it.each<OverlapTestCase>([
      [
        'to its left',
        {
          /**
           *  Tetromino:
           *   B
           *   B B B
           */
          blockOffsets: [
            [-1, -1],
            [0, -1],
            [0, 0],
            [0, 1],
          ],
          pivotPosition: [3 + BUFFER_ROW_COUNT, 3],
        },
        {
          grid: stringToGrid(
            `
              . . . . . . . . . .
              . . . . . . . . . .
              . P . . . . . . P .
              P P P . . . . P P P
              W W . . G G . . W W
              W W . . G G . . W W
            `,
            BUFFER_ROW_COUNT
          ),
          bufferRowCount: BUFFER_ROW_COUNT,
        },
      ],
      [
        'to its right',
        {
          /**
           *  Tetromino:
           *       B
           *   B B B
           */
          blockOffsets: [
            [-1, 1],
            [0, -1],
            [0, 0],
            [0, 1],
          ],
          pivotPosition: [3 + BUFFER_ROW_COUNT, 6],
        },
        {
          grid: stringToGrid(
            `
              . . . . . . . . . .
              . . . . . . . . . .
              . P . . . . . . P .
              P P P . . . . P P P
              W W . . G G . . W W
              W W . . G G . . W W
            `,
            BUFFER_ROW_COUNT
          ),
          bufferRowCount: BUFFER_ROW_COUNT,
        },
      ],
      [
        'above',
        {
          /**
           *  Tetromino:
           *   B
           *   B
           *   B
           *   B
           */
          blockOffsets: [
            [-2, 0],
            [-1, 0],
            [0, 0],
            [1, 0],
          ],
          pivotPosition: [4 + BUFFER_ROW_COUNT, 3],
        },
        {
          grid: stringToGrid(
            `
              . . . . . . . . . .
              . . . . . . . . . .
              . P P P . . . . P .
              . P . . . . . . P P
              W W . . . . . . W W
              W W . . . . . . W W
            `,
            BUFFER_ROW_COUNT
          ),
          bufferRowCount: BUFFER_ROW_COUNT,
        },
      ],
      [
        'below',
        {
          /**
           *  Tetromino:
           *   B
           *   B B
           *     B
           */
          blockOffsets: [
            [-1, -1],
            [0, -1],
            [0, 0],
            [1, 0],
          ],
          pivotPosition: [2 + BUFFER_ROW_COUNT, 4],
        },
        {
          grid: stringToGrid(
            `
              . . . . . . . . . .
              . . . . . . . . . .
              W W . . . . . . W W
              W W . . P . . . W W
            `,
            BUFFER_ROW_COUNT
          ),
          bufferRowCount: BUFFER_ROW_COUNT,
        },
      ],
    ])(
      'throws an error when the tetromino overlaps with filled cells %s',
      (_, tetrominoInfo, gridInfo) => {
        const board = Board.fromGrid(gridInfo.grid, gridInfo.bufferRowCount);
        const { blockOffsets, pivotPosition } = tetrominoInfo;
        const tetromino: TetrominoLike = {
          color: Colors.BLUE,
          getBlockPositions: mockGetBlockPosition(blockOffsets, pivotPosition),
        };

        expect(() => {
          board.lockTetromino(tetromino);
        }).toThrowError();
      }
    );
  });

  describe('clearCompletedRows', () => {
    it('clears a single completed row', () => {
      const grid = stringToGrid(
        `
          . . . . . . . . . .
          . . . . . . . . . .
          . . . . . . . . . .
          N N N N R R R R . .
          G . B . P P P . . .
        `,
        BUFFER_ROW_COUNT
      );
      const board = Board.fromGrid(grid, BUFFER_ROW_COUNT);
      /**
       *  Tetromino:
       *   B B
       *   B B
       */
      const tetromino: TetrominoLike = {
        color: Colors.BLUE,
        getBlockPositions: mockGetBlockPosition(
          [
            [-1, 0],
            [-1, 1],
            [0, 0],
            [0, 1],
          ],
          [4 + BUFFER_ROW_COUNT, 8]
        ),
      };
      const expectedGrid = stringToGrid(
        `
          . . . . . . . . . .
          . . . . . . . . . .
          . . . . . . . . . .
          . . . . . . . . . .
          G . B . P P P . B B
        `,
        BUFFER_ROW_COUNT
      );

      board.lockTetromino(tetromino);
      board.clearCompletedRows();
      expect(board.grid).toStrictEqual(expectedGrid);
    });

    it('clears multiple continuous completed rows', () => {
      const grid = stringToGrid(
        `
          . . . . . . . . . .
          P P W W W Y Y N . .
          P P W G G Y R N N .
          N N N G G Y R R N .
          G N B B B P R P . .
        `,
        BUFFER_ROW_COUNT
      );
      const board = Board.fromGrid(grid, BUFFER_ROW_COUNT);
      /**
       *  Tetromino:
       *   B B
       *     B
       * v   B
       */
      const tetromino: TetrominoLike = {
        color: Colors.BLUE,
        getBlockPositions: mockGetBlockPosition(
          [
            [-1, -1],
            [-1, 0],
            [0, 0],
            [1, 0],
          ],
          [2 + BUFFER_ROW_COUNT, 9]
        ),
      };
      const expectedGrid = stringToGrid(
        `
          . . . . . . . . . .
          . . . . . . . . . .
          . . . . . . . . . .
          . . . . . . . . . .
          G N B B B P R P . .
        `,
        BUFFER_ROW_COUNT
      );

      board.lockTetromino(tetromino);
      board.clearCompletedRows();
      expect(board.grid).toStrictEqual(expectedGrid);
    });

    it('clears a single completed row and shifts the above rows down', () => {
      const grid = stringToGrid(
        `
          . . . . . . . . . 
          . . . . . . . . . 
          . G . . . N . . . 
          . G G G . N N N . 
          P P P P Y Y Y Y . 
          N . . . R . . . .
        `,
        BUFFER_ROW_COUNT
      );
      const board = Board.fromGrid(grid, BUFFER_ROW_COUNT);
      /**
       *  Tetromino:
       *   B
       *   B
       *   B
       *   B
       */
      const tetromino: TetrominoLike = {
        color: Colors.BLUE,
        getBlockPositions: mockGetBlockPosition(
          [
            [-2, 0],
            [-1, 0],
            [0, 0],
            [1, 0],
          ],
          [4 + BUFFER_ROW_COUNT, 8]
        ),
      };
      const expectedGrid = stringToGrid(
        `
          . . . . . . . . . 
          . . . . . . . . . 
          . . . . . . . . . 
          . G . . . N . . B 
          . G G G . N N N B 
          N . . . R . . . B
        `,
        BUFFER_ROW_COUNT
      );

      board.lockTetromino(tetromino);
      board.clearCompletedRows();
      expect(board.grid).toStrictEqual(expectedGrid);
    });

    it('clears multiple continuous completed rows and shifts the above rows down', () => {
      const grid = stringToGrid(
        `
          . . . . . . . . . .
          . . . . . . . . . .
          P P . . . . W W Y .
          P . . . G G W W Y Y
          P N . G G N N N N Y
          R N . P P P P G G G
          R R . N N N N B B G
          R P . N N N N B W W
          P P . . . . G B W .
          P N N R R G G . W .
          N N N R R G W B B .
        `,
        BUFFER_ROW_COUNT
      );
      const board = Board.fromGrid(grid, BUFFER_ROW_COUNT);
      /**
       *  Tetromino:
       *   B
       *   B
       *   B
       *   B
       */
      const tetromino: TetrominoLike = {
        color: Colors.BLUE,
        getBlockPositions: mockGetBlockPosition(
          [
            [-2, 0],
            [-1, 0],
            [0, 0],
            [1, 0],
          ],
          [7 + BUFFER_ROW_COUNT, 2]
        ),
      };
      const expectedGrid = stringToGrid(
        `
          . . . . . . . . . .
          . . . . . . . . . .
          . . . . . . . . . .
          . . . . . . . . . .
          . . . . . . . . . .
          P P . . . . W W Y .
          P . . . G G W W Y Y
          P N . G G N N N N Y
          P P B . . . G B W .
          P N N R R G G . W .
          N N N R R G W B B .
        `,
        BUFFER_ROW_COUNT
      );

      board.lockTetromino(tetromino);
      board.clearCompletedRows();
      expect(board.grid).toStrictEqual(expectedGrid);
    });

    it('clears multiple completed rows separated by incomplete lines and shifts all the incomplete rows correctly down', () => {
      const grid = stringToGrid(
        `
          . . . . . . . . . .
          . . . . . . . . . .
          . . . . . . . . . .
          . B B N . . . . . .
          N B N N R R . . P .
          N B N N B R R P P .
          N N N N B B B G P .
          N N N N N N N G G .
          N N P P P . . . G .
          N N P P B B B B B .
          N P P P B . . . B .
          N G G P B R R . G G
          B Y Y B B B . B N N
        `,
        BUFFER_ROW_COUNT
      );
      const board = Board.fromGrid(grid, BUFFER_ROW_COUNT);
      /**
       *  Tetromino:
       *   N
       *   N
       *   N
       *   N
       */
      const tetromino: TetrominoLike = {
        color: Colors.NAVY,
        getBlockPositions: mockGetBlockPosition(
          [
            [-2, 0],
            [-1, 0],
            [0, 0],
            [1, 0],
          ],
          [9 + BUFFER_ROW_COUNT, 9]
        ),
      };
      const expectedGrid = stringToGrid(
        `
          . . . . . . . . . .
          . . . . . . . . . .
          . . . . . . . . . .
          . . . . . . . . . .
          . . . . . . . . . .
          . B B N . . . . . .
          N B N N R R . . P .
          N B N N B R R P P .
          N N N N B B B G P .
          N N P P P . . . G N
          N P P P B . . . B N
          N G G P B R R . G G
          B Y Y B B B . B N N
        `,
        BUFFER_ROW_COUNT
      );

      board.lockTetromino(tetromino);
      board.clearCompletedRows();
      expect(board.grid).toStrictEqual(expectedGrid);
    });
  });
});

function stringToGrid(gridString: string, bufferRowCount: number): Cell[][] {
  const grid = gridString
    .trim()
    .split('\n')
    .map((row) =>
      row
        .trim()
        .split(' ')
        .map((char) => CHARACTER_TO_CELL_STATE[char])
    );

  if (bufferRowCount === 0) return grid;

  const bufferRows = Array.from({ length: bufferRowCount }, () =>
    Array.from({ length: grid[0].length }, () => CHARACTER_TO_CELL_STATE['.'])
  );

  return [...bufferRows, ...grid];
}

function createEmptyGrid(totalRowCount: number, columnCount: number): Cell[][] {
  return Array.from({ length: totalRowCount }, () =>
    Array.from({ length: columnCount }, () => ({
      filled: false,
      color: '',
    }))
  );
}

function mockGetBlockPosition(
  blockOffsets: BlockPositions,
  pivotPosition: Position
): () => BlockPositions {
  return () =>
    blockOffsets.map(([offsetX, offsetY]) => [
      offsetX + pivotPosition[0],
      offsetY + pivotPosition[1],
    ]) as BlockPositions;
}

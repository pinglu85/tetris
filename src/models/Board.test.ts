import { describe, it, expect } from 'vitest';

import { Board } from './Board';
import { BUFFER_ROW_COUNT } from '../constants';

import type { Cell } from './Board';

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

import { describe, it, expect } from 'vitest';

import { Board } from './Board';
import { NUM_OF_BUFFER_ROWS } from '../constants';

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
    it('creates a board with an empty grid', () => {
      const numOfRows = 20;
      const numOfCols = 10;
      const board = Board.createEmpty(numOfRows, numOfCols);
      const expectedGrid: Cell[][] = Array.from(
        { length: numOfRows + NUM_OF_BUFFER_ROWS },
        () =>
          Array.from({ length: numOfCols }, () => ({
            filled: false,
            color: '',
          }))
      );

      expect(board).toBeInstanceOf(Board);
      expect(board.grid).toStrictEqual(expectedGrid);
    });
  });

  describe('fromGrid', () => {
    it('creates a board from a given grid', () => {
      const grid = `
        . . W . . . . . . .
        . . W . . . . . . .
        . . W W . . . . Y Y
        G . N . . R R . Y Y
        G N N N . R R Y Y .
        G G . P P P P . Y Y
      `;
      const board = Board.fromGrid(stringToGrid(grid));

      expect(board).toBeInstanceOf(Board);
      expect(board.grid).toStrictEqual(stringToGrid(grid, true));
    });
  });
});

function stringToGrid(gridString: string, addBufferRows = false): Cell[][] {
  const grid = gridString
    .trim()
    .split('\n')
    .map((row) =>
      row
        .trim()
        .split(' ')
        .map((char) => CHARACTER_TO_CELL_STATE[char])
    );

  if (!addBufferRows) return grid;

  const bufferRows = Array.from({ length: NUM_OF_BUFFER_ROWS }, () =>
    Array.from({ length: grid[0].length }, () => CHARACTER_TO_CELL_STATE['.'])
  );

  return [...bufferRows, ...grid];
}

import { describe, it, expect } from 'vitest';

import { Board } from './Board';
import { BUFFER_ROW_COUNT } from '../constants';

import type { Cell } from './Board';

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
      const expectedGrid: Cell[][] = Array.from({ length: totalRowCount }, () =>
        Array.from({ length: columnCount }, () => ({
          filled: false,
          color: '',
        }))
      );

      expect(board).toBeInstanceOf(Board);
      expect(board.grid).toStrictEqual(expectedGrid);
    });
  });
});

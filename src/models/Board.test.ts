import { describe, it, expect } from 'vitest';

import { Board } from './Board';
import { BUFFER_ROW_COUNT } from '../constants';

import type { Cell } from './Board';

describe('Board', () => {
  describe('createEmpty', () => {
    it('creates a board with an empty grid', () => {
      const numOfRows = 20;
      const numOfCols = 10;
      const board = Board.createEmpty(numOfRows, numOfCols, BUFFER_ROW_COUNT);
      const expectedGrid: Cell[][] = Array.from(
        { length: numOfRows + BUFFER_ROW_COUNT },
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
});

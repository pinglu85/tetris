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

    it('throws an error if `totalRowCount` is less than `bufferRowCount`', () => {
      const totalRowCount = 4;
      const columnCount = 3;
      const bufferRowCount = 5;

      expect(() => {
        Board.createEmpty(totalRowCount, columnCount, bufferRowCount);
      }).toThrowError(RangeError);
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
      const bufferRowCount = BUFFER_ROW_COUNT;

      expect(() => {
        Board.createEmpty(totalRowCount, columnCount, bufferRowCount);
      }).toThrowError(RangeError);
    });

    it('throws an error if `bufferRowCount` is not positive', () => {
      const totalRowCount = 20;
      const columnCount = 10;
      const bufferRowCount = 0;

      expect(() => {
        Board.createEmpty(totalRowCount, columnCount, bufferRowCount);
      }).toThrowError(RangeError);
    });
  });
});

import type { Tetromino } from './Tetromino';

export interface Cell {
  filled: boolean;
  color: string;
}

export type TetrominoLike = Pick<
  Tetromino,
  'getBlockPositions' | 'isLocked' | 'color'
>;

export class Board {
  #grid: Cell[][];
  readonly #totalRowCount: number;
  readonly #columnCount: number;
  readonly #bufferRowCount: number;

  private constructor(grid: Cell[][], bufferRowCount: number) {
    this.#grid = grid;
    this.#totalRowCount = grid.length;
    this.#columnCount = grid[0].length;
    this.#bufferRowCount = bufferRowCount;
  }

  static createEmpty(
    totalRowCount: number,
    columnCount: number,
    bufferRowCount: number
  ): Board {
    if (totalRowCount <= 0) {
      throw new RangeError('`totalRowCount` must be positive.');
    }

    if (columnCount <= 0) {
      throw new RangeError('`columnCount` must be positive.');
    }

    if (bufferRowCount < 0) {
      throw new RangeError('`bufferRowCount` must be non-negative.');
    }

    if (totalRowCount < bufferRowCount) {
      throw new Error(
        '`totalRowCount` must be greater than or equal to `bufferRowCount`.'
      );
    }

    const grid: Cell[][] = Array.from({ length: totalRowCount }, () =>
      Array.from({ length: columnCount }, () => ({ filled: false, color: '' }))
    );

    return new Board(grid, bufferRowCount);
  }

  static fromGrid(gridWithBufferRows: Cell[][], bufferRowCount: number): Board {
    const totalRowCount = gridWithBufferRows.length;

    if (totalRowCount === 0) {
      throw new RangeError('The grid must have at least one row.');
    }

    if (totalRowCount < bufferRowCount) {
      throw new Error(
        'The grid row count must be greater than or equal to the buffer row count.'
      );
    }

    if (bufferRowCount < 0) {
      throw new RangeError('`bufferRowCount` must be non-negative.');
    }

    const columnCount = gridWithBufferRows[0].length;
    const grid: Cell[][] = new Array(totalRowCount);

    for (let i = 0; i < totalRowCount; i++) {
      if (gridWithBufferRows[i].length === 0) {
        throw new RangeError('All grid rows must have at least one column.');
      }

      if (gridWithBufferRows[i].length !== columnCount) {
        throw new Error('All grid rows must have the same length.');
      }

      grid[i] = new Array(columnCount);
      let filledCellCount = 0;
      for (let j = 0; j < columnCount; j++) {
        grid[i][j] = { ...gridWithBufferRows[i][j] };

        if (grid[i][j].filled) filledCellCount += 1;
      }

      if (filledCellCount === columnCount) {
        throw new Error('Grid should not contain any completed lines.');
      }
    }

    return new Board(grid, bufferRowCount);
  }

  integrateLockedTetromino(tetromino: TetrominoLike): void {
    if (!tetromino.isLocked) {
      throw new Error('The tetromino must be locked.');
    }

    const blocks = tetromino.getBlockPositions();
    let isFloating = true;

    for (const block of blocks) {
      if (!this.isValidPosition(block)) {
        throw new Error('Invalid tetromino position.');
      }

      const [i, j] = block;
      if (i < this.#bufferRowCount) {
        throw new Error('The tetromino must not be in the buffer row(s).');
      }

      if (i === this.#totalRowCount - 1 || this.#grid[i + 1][j].filled) {
        isFloating = false;
      }
    }

    if (isFloating) {
      throw new Error(
        'The tetromino must rest on the ground or another block.'
      );
    }

    for (const [i, j] of blocks) {
      this.#grid[i][j].filled = true;
      this.#grid[i][j].color = tetromino.color;
    }
  }

  isValidPosition([i, j]: number[]): boolean {
    if (
      i < 0 ||
      i >= this.#totalRowCount ||
      j < 0 ||
      j >= this.#columnCount ||
      this.#grid[i][j].filled
    ) {
      return false;
    }

    return true;
  }

  clearLines(): number {
    const availableRowIndexQueue: number[] = [];
    let clearedLineCount = 0;

    for (let i = this.#totalRowCount - 1; i >= 0; i--) {
      if (this.#grid[i].every((col) => col.filled)) {
        clearedLineCount += 1;
        availableRowIndexQueue.push(i);

        for (let j = 0; j < this.#columnCount; j++) {
          this.#grid[i][j].filled = false;
          this.#grid[i][j].color = '';
        }
        continue;
      }

      const availableRowIndex = availableRowIndexQueue.shift();
      if (availableRowIndex === undefined) continue;

      let emptyCellCount = 0;

      for (let j = 0; j < this.#columnCount; j++) {
        if (!this.#grid[i][j].filled) emptyCellCount++;

        this.#grid[availableRowIndex][j].filled = this.#grid[i][j].filled;
        this.#grid[availableRowIndex][j].color = this.#grid[i][j].color;
        this.#grid[i][j].filled = false;
        this.#grid[i][j].color = '';
      }

      if (emptyCellCount === this.#columnCount) break;

      availableRowIndexQueue.push(i);
    }

    return clearedLineCount;
  }

  get grid(): readonly (readonly Readonly<Cell>[])[] {
    return this.#grid;
  }
}

import type { Tetromino } from './Tetromino';

export interface Cell {
  filled: boolean;
  color: string;
}

export type TetrominoState = Pick<
  Tetromino,
  'getBlockPositions' | 'isLocked' | 'color'
>;

export interface WithTetromino {
  currTetromino: TetrominoState;
}

export class Board {
  #grid: Cell[][];
  readonly #numOfRows: number;
  readonly #numOfCols: number;
  readonly #numOfBufferRows: number;

  private constructor(grid: Cell[][], numOfBufferRows: number) {
    this.#grid = grid;
    this.#numOfRows = grid.length;
    this.#numOfCols = grid[0].length;
    this.#numOfBufferRows = numOfBufferRows;
  }

  static createEmpty(
    totalRowCount: number,
    numOfCols: number,
    numOfBufferRows: number
  ): Board {
    if (totalRowCount <= numOfBufferRows) {
      throw new Error(
        '`totalRowCount` must be greater than `numOfBufferRows`.'
      );
    }

    const grid = Array.from({ length: totalRowCount }, () =>
      Array.from({ length: numOfCols }, () => ({ filled: false, color: '' }))
    );

    return new Board(grid, numOfBufferRows);
  }

  static fromGrid(originalGrid: Cell[][], numOfBufferRows: number): Board {
    const numOfRows = originalGrid.length;
    const numOfCols = originalGrid[0].length;

    if (numOfRows <= numOfBufferRows) {
      throw new Error('The grid must include buffer rows.');
    }

    const grid: Cell[][] = Array.from({ length: numOfRows }, (_, i) =>
      Array.from({ length: numOfCols }, (_, j) => ({
        filled: originalGrid[i][j].filled,
        color: originalGrid[i][j].color,
      }))
    );

    return new Board(grid, numOfBufferRows);
  }

  /**
   * Integrate the locked tetromino into its grid and clear lines.
   * @param {WithTetromino} state
   */
  update(state: WithTetromino): number {
    const { currTetromino } = state;
    const blocks = currTetromino.getBlockPositions();

    for (const [i, j] of blocks) {
      this.#grid[i][j].filled = true;
      this.#grid[i][j].color = currTetromino.color;
    }

    return this.#clearLines();
  }

  canMoveDown(tetromino: TetrominoState): boolean {
    const blocks = tetromino.getBlockPositions();

    for (const [i, j] of blocks) {
      if (i + 1 === this.#numOfRows || this.#grid[i + 1][j].filled) {
        return false;
      }
    }

    return true;
  }

  isValidPosition(tetromino: TetrominoState): boolean {
    const blocks = tetromino.getBlockPositions();

    for (const [i, j] of blocks) {
      if (
        i >= this.#numOfRows ||
        j < 0 ||
        j >= this.#numOfCols ||
        this.#grid[i][j].filled
      ) {
        return false;
      }
    }

    return true;
  }

  #clearLines(): number {
    const availableRowIndexQueue: number[] = [];
    let clearedLines = 0;

    for (let i = this.#numOfRows - 1; i >= 0; i--) {
      if (this.#grid[i].every((col) => col.filled)) {
        clearedLines += 1;
        availableRowIndexQueue.push(i);

        for (let j = 0; j < this.#numOfCols; j++) {
          this.#grid[i][j].filled = false;
          this.#grid[i][j].color = '';
        }
        continue;
      }

      const availableRowIndex = availableRowIndexQueue.shift();
      if (availableRowIndex === undefined) continue;

      let numOfUnfilledCells = 0;

      for (let j = 0; j < this.#numOfCols; j++) {
        if (!this.#grid[i][j].filled) numOfUnfilledCells++;

        this.#grid[availableRowIndex][j].filled = this.#grid[i][j].filled;
        this.#grid[availableRowIndex][j].color = this.#grid[i][j].color;
        this.#grid[i][j].filled = false;
        this.#grid[i][j].color = '';
      }

      if (numOfUnfilledCells === this.#numOfCols) break;

      availableRowIndexQueue.push(i);
    }

    return clearedLines;
  }

  get grid(): Cell[][] {
    return Array.from({ length: this.#numOfRows }, (_, i) =>
      Array.from({ length: this.#numOfCols }, (_, j) => ({
        filled: this.#grid[i][j].filled,
        color: this.#grid[i][j].color,
      }))
    );
  }
}

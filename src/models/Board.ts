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
  private readonly numOfRows: number;
  private readonly numOfCols: number;

  private constructor(
    private _grid: Cell[][],
    private readonly numOfBufferRows: number
  ) {
    this.numOfRows = _grid.length;
    this.numOfCols = _grid[0].length;
  }

  static createEmpty(
    numOfRows: number,
    numOfCols: number,
    numOfBufferRows: number
  ): Board {
    if (numOfRows <= numOfBufferRows) {
      throw new Error('`numOfRows` must be greater than `numOfBufferRows`.');
    }

    const grid = Array.from({ length: numOfRows }, () =>
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
      this._grid[i][j].filled = true;
      this._grid[i][j].color = currTetromino.color;
    }

    return this.clearLines();
  }

  canMoveDown(tetromino: TetrominoState): boolean {
    const blocks = tetromino.getBlockPositions();

    for (const [i, j] of blocks) {
      if (i + 1 === this.numOfRows || this._grid[i + 1][j].filled) {
        return false;
      }
    }

    return true;
  }

  isValidPosition(tetromino: TetrominoState): boolean {
    const blocks = tetromino.getBlockPositions();

    for (const [i, j] of blocks) {
      if (
        i >= this.numOfRows ||
        j < 0 ||
        j >= this.numOfCols ||
        this._grid[i][j].filled
      ) {
        return false;
      }
    }

    return true;
  }

  private clearLines(): number {
    const availableRowIndexQueue: number[] = [];
    let clearedLines = 0;

    for (let i = this.numOfRows - 1; i >= 0; i--) {
      if (this._grid[i].every((col) => col.filled)) {
        clearedLines += 1;
        availableRowIndexQueue.push(i);

        for (let j = 0; j < this.numOfCols; j++) {
          this._grid[i][j].filled = false;
          this._grid[i][j].color = '';
        }
        continue;
      }

      const availableRowIndex = availableRowIndexQueue.shift();
      if (availableRowIndex === undefined) continue;

      let numOfUnfilledCells = 0;

      for (let j = 0; j < this.numOfCols; j++) {
        if (!this._grid[i][j].filled) numOfUnfilledCells++;

        this._grid[availableRowIndex][j].filled = this._grid[i][j].filled;
        this._grid[availableRowIndex][j].color = this._grid[i][j].color;
        this._grid[i][j].filled = false;
        this._grid[i][j].color = '';
      }

      if (numOfUnfilledCells === this.numOfCols) break;

      availableRowIndexQueue.push(i);
    }

    return clearedLines;
  }

  get grid() {
    return this._grid;
  }
}

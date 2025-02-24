import type { Tetromino } from './Tetromino';

export interface Cell {
  filled: boolean;
  color: string;
}

export interface WithTetromino {
  currTetromino: Pick<
    Tetromino,
    'blocks' | 'pivotPosition' | 'isLocked' | 'color'
  >;
}

export class Board {
  private _numOfRows: number;
  private _numOfCols: number;
  private _grid: Cell[][];

  constructor(numOfRows: number, numOfCols: number) {
    this._numOfRows = numOfRows;
    this._numOfCols = numOfCols;
    this._grid = Array.from({ length: numOfRows }, () =>
      Array.from({ length: numOfCols }, () => ({ filled: false, color: '' }))
    );
  }

  /**
   * Integrate the locked tetromino into its grid and clear lines.
   * @param {WithTetromino} state
   */
  update(state: WithTetromino): number {
    const { currTetromino } = state;
    const [pivotX, pivotY] = currTetromino.pivotPosition;

    for (const [x, y] of currTetromino.blocks) {
      const row = x + pivotX;
      const col = y + pivotY;
      this._grid[row][col].filled = true;
      this._grid[row][col].color = currTetromino.color;
    }

    return this.clearLines();
  }

  checkCollision(tetromino: Tetromino): boolean {
    const { blocks, pivotPosition } = tetromino;

    for (const block of blocks) {
      const blockRow = pivotPosition[0] + block[0];
      const blockCol = pivotPosition[1] + block[1];

      if (
        blockRow + 1 === this._numOfRows ||
        this._grid[blockRow + 1][blockCol].filled
      ) {
        return true;
      }
    }

    return false;
  }

  private clearLines(): number {
    const availableRowQueue: number[] = [];
    let clearedLines = 0;

    for (let row = this._numOfRows - 1; row >= 0; row--) {
      if (this._grid[row].every((col) => col.filled)) {
        clearedLines += 1;
        availableRowQueue.push(row);
        continue;
      }

      const availableRow = availableRowQueue.shift();
      if (availableRow === undefined) continue;

      for (let col = 0; col < this._numOfCols; col++) {
        this._grid[availableRow][col] = this._grid[row][col];
      }

      availableRowQueue.push(row);
    }

    return clearedLines;
  }

  get grid() {
    return this._grid;
  }

  get numOfCols() {
    return this._numOfCols;
  }
}

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

  private constructor(private _grid: Cell[][]) {
    this.numOfRows = _grid.length;
    this.numOfCols = _grid[0].length;
  }

  static createEmpty(numOfRows: number, numOfCols: number): Board {
    const grid = Array.from({ length: numOfRows }, () =>
      Array.from({ length: numOfCols }, () => ({ filled: false, color: '' }))
    );

    return new Board(grid);
  }

  static fromGrid(grid: Cell[][]): Board {
    return new Board(grid);
  }

  /**
   * Integrate the locked tetromino into its grid and clear lines.
   * @param {WithTetromino} state
   */
  update(state: WithTetromino): number {
    const { currTetromino } = state;
    const blocks = currTetromino.getBlockPositions();

    for (const [row, col] of blocks) {
      this._grid[row][col].filled = true;
      this._grid[row][col].color = currTetromino.color;
    }

    return this.clearLines();
  }

  canMoveDown(tetromino: TetrominoState): boolean {
    const blocks = tetromino.getBlockPositions();

    for (const [row, col] of blocks) {
      if (row + 1 === this.numOfRows || this._grid[row + 1][col].filled) {
        return false;
      }
    }

    return true;
  }

  private clearLines(): number {
    const availableRowQueue: number[] = [];
    let clearedLines = 0;

    for (let row = this.numOfRows - 1; row >= 0; row--) {
      if (this._grid[row].every((col) => col.filled)) {
        clearedLines += 1;
        availableRowQueue.push(row);
        continue;
      }

      const availableRow = availableRowQueue.shift();
      if (availableRow === undefined) continue;

      for (let col = 0; col < this.numOfCols; col++) {
        this._grid[availableRow][col] = this._grid[row][col];
      }

      availableRowQueue.push(row);
    }

    return clearedLines;
  }

  get grid() {
    return this._grid;
  }
}

import type { State } from './State';
import type { Tetromino } from './Tetromino';

interface Cell {
  filled: boolean;
  color: string;
}

export class Board {
  #numOfRows: number;
  #numOfCols: number;
  #grid: Cell[][];

  constructor(numOfRows: number, numOfCols: number) {
    this.#numOfRows = numOfRows;
    this.#numOfCols = numOfCols;
    this.#grid = Array.from({ length: numOfRows }, () =>
      Array.from({ length: numOfCols }, () => ({ filled: false, color: '' }))
    );
  }

  /**
   * Integrate the locked tetromino into its grid and clear lines.
   * @param {State} state
   */
  update(state: State) {}

  checkCollision(tetromino: Tetromino): boolean {
    const { blocks, pivotPosition } = tetromino;

    for (const block of blocks) {
      const blockRow = pivotPosition[0] + block[0];
      const blockCol = pivotPosition[1] + block[1];

      if (
        blockRow + 1 === this.#numOfRows ||
        this.#grid[blockRow + 1][blockCol].filled
      ) {
        return true;
      }
    }

    return false;
  }

  #clearLines(): number {
    const availableRowQueue: number[] = [];
    let clearedLines = 0;

    for (let row = this.#numOfRows - 1; row >= 0; row--) {
      if (this.#grid[row].every((col) => col.filled)) {
        clearedLines += 1;
        availableRowQueue.push(row);
        continue;
      }

      const availableRow = availableRowQueue.shift();
      if (availableRow === undefined) continue;

      for (let col = 0; col < this.#numOfCols; col++) {
        this.#grid[availableRow][col] = this.#grid[row][col];
      }

      availableRowQueue.push(row);
    }

    return clearedLines;
  }

  get grid() {
    return this.#grid;
  }

  get numOfCols() {
    return this.#numOfCols;
  }
}

import type { State } from './State';
import type { Tetromino } from './Tetromino';

interface Cell {
  filled: boolean;
  color: string;
}

export class Board {
  #grid: Cell[][];

  constructor(numOfRows: number, numOfCols: number) {
    this.#grid = Array.from({ length: numOfRows }, () =>
      Array.from({ length: numOfCols }, () => ({ filled: false, color: '' }))
    );
  }

  update(state: State) {}

  checkCollision(tetromino: Tetromino): boolean {}

  #clearLines() {}

  get grid() {
    return this.#grid;
  }
}

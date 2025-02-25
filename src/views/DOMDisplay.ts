import { elt } from './utils';

import type { Board } from '../models/Board';
import type { State } from '../models/State';
import type { Tetromino, TetrominoPreview } from '../models/Tetromino';

const NEXT_TETROMINO_CELL_COUNT = 16;

const GRID_CLASS_NAME = 'grid';
const CELL_CLASS_NAME = 'cell';
const GAME_INFO_CLASS_NAME = 'game-info';
const GAME_INFO_LABEL_CLASS_NAME = 'game-info-label';
const GAME_INFO_VALUE_CLASS_NAME = 'game-info-value';
const SCORE_INFO_VALUE_ID = 'score';
const LEVEL_INFO_VALUE_ID = 'level';

export class DOMDisplay {
  #cellElements: HTMLElement[];
  #levelValueElement: HTMLElement;
  #scoreValueElement: HTMLElement;
  #nextTetrominoCellElements: HTMLElement[];

  constructor(
    root: HTMLElement,
    numOfRows: number,
    numOfCols: number,
    onPauseGame: () => void
  ) {
    const gridElement = createGridElement(numOfRows * numOfCols);
    this.#cellElements = Array.from(
      gridElement.querySelectorAll(`.${CELL_CLASS_NAME}`)
    );

    const gameInfoPanelElement = createGameInfoPanelElement();

    this.#nextTetrominoCellElements = Array.from(
      gameInfoPanelElement.querySelectorAll(`.${CELL_CLASS_NAME}`)
    );

    this.#scoreValueElement = gameInfoPanelElement.querySelector(
      `#${SCORE_INFO_VALUE_ID}`
    ) as HTMLElement;
    this.#levelValueElement = gameInfoPanelElement.querySelector(
      `#${LEVEL_INFO_VALUE_ID}`
    ) as HTMLElement;

    const pauseButtonElement = createPauseButtonElement();
    pauseButtonElement.addEventListener('click', onPauseGame);

    root.append(gameInfoPanelElement, pauseButtonElement, gridElement);
  }

  syncState(state: State) {}

  createGridElement(board: Board, currTetromino: Tetromino) {}

  clearGrid() {}

  createNextTetrominoElement(tetromino: TetrominoPreview) {}

  clearNextTetromino() {}

  updateScore() {}

  resetScore() {}
}

function createGridElement(cellCount: number) {
  return elt(
    'div',
    { class: GRID_CLASS_NAME },
    ...Array.from({ length: cellCount }, () =>
      elt('div', { class: CELL_CLASS_NAME })
    )
  );
}

function createGameInfoPanelElement() {
  return elt(
    'div',
    { class: 'game-info-panel' },
    createLevelInfoElement(),
    createScoreInfoElement(),
    createNextTetrominoElement()
  );
}

function createLevelInfoElement() {
  return elt(
    'div',
    { class: GAME_INFO_CLASS_NAME },
    elt('span', { class: GAME_INFO_LABEL_CLASS_NAME }, 'Level'),
    elt(
      'span',
      { class: GAME_INFO_VALUE_CLASS_NAME, id: LEVEL_INFO_VALUE_ID },
      '0'
    )
  );
}

function createScoreInfoElement() {
  return elt(
    'div',
    { class: GAME_INFO_CLASS_NAME },
    elt('span', { class: GAME_INFO_LABEL_CLASS_NAME }, 'Score'),
    elt(
      'span',
      { class: GAME_INFO_VALUE_CLASS_NAME, id: SCORE_INFO_VALUE_ID },
      '0'
    )
  );
}

function createNextTetrominoElement() {
  return elt(
    'div',
    { class: `${GAME_INFO_CLASS_NAME} next-tetromino-container` },
    elt('span', { class: GAME_INFO_LABEL_CLASS_NAME }, 'Next'),
    elt(
      'div',
      { class: GRID_CLASS_NAME },
      ...Array.from({ length: NEXT_TETROMINO_CELL_COUNT }, () =>
        elt('div', { class: CELL_CLASS_NAME })
      )
    )
  );
}

function createPauseButtonElement() {
  return elt('button', { class: 'button pause-button' }, 'Pause');
}

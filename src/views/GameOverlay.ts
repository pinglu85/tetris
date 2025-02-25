import { elt } from './utils';

const PRIMARY_BUTTON_CLASS_NAME = 'primary-button';

export class GameOverlay {
  #overlayElement: HTMLElement;
  #buttonElement: HTMLElement;

  constructor(root: HTMLElement, onClick: () => void) {
    this.#overlayElement = createOverlayElement();
    this.#buttonElement = createButtonElement();
    this.#buttonElement.addEventListener('click', onClick);

    this.#overlayElement.append(this.#buttonElement);
    root.append(this.#overlayElement);
  }

  show(gameState) {}

  hide() {}
}

function createOverlayElement() {
  return elt('div', { class: 'overlay' });
}

function createButtonElement() {
  return elt(
    'button',
    { class: `button ${PRIMARY_BUTTON_CLASS_NAME}` },
    'Play'
  );
}

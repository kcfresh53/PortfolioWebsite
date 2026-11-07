/** Everything the console can be told to do, regardless of whether it came from keys, wheel, touch or a gamepad. */
export interface InputActions {
  /** Returns true when the input was consumed (so the browser default can be prevented). */
  move(dx: number, dy: number): boolean;
  confirm(): void;
  back(): void;
  shoulder(delta: number): void;
  toggleMode(): void;
  toggleSound(): void;
  /** False while a modal sheet owns the screen; wheel, swipe and stick input are ignored then. */
  canBrowse(): boolean;
}

const REPEAT_FIRST_MS = 380;
const REPEAT_MS = 130;
const WHEEL_THRESHOLD = 36;
const WHEEL_COOLDOWN_MS = 170;
const SWIPE_DISTANCE = 44;
const STICK_THRESHOLD = 0.6;

function isInteractiveTarget(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && target.closest('input, textarea, select, a, button, [contenteditable]') !== null;
}

function attachKeyboard(actions: InputActions): () => void {
  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const key: string = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    let handled = false;
    switch (key) {
      case 'ArrowLeft':
      case 'a':
        handled = actions.move(-1, 0);
        break;
      case 'ArrowRight':
      case 'd':
        handled = actions.move(1, 0);
        break;
      case 'ArrowUp':
      case 'w':
        handled = actions.move(0, -1);
        break;
      case 'ArrowDown':
      case 's':
        handled = actions.move(0, 1);
        break;
      case 'Enter':
      case ' ':
        // Let focused buttons and links do their own thing.
        if (!isInteractiveTarget(event.target)) {
          actions.confirm();
          handled = true;
        }
        break;
      case 'Escape':
      case 'Backspace':
        actions.back();
        handled = true;
        break;
      case 'p':
        actions.toggleMode();
        handled = true;
        break;
      case 'm':
        actions.toggleSound();
        handled = true;
        break;
      default:
        break;
    }
    if (handled) event.preventDefault();
  };
  window.addEventListener('keydown', onKeyDown);
  return (): void => window.removeEventListener('keydown', onKeyDown);
}

function attachWheel(actions: InputActions): () => void {
  let accumX = 0;
  let accumY = 0;
  let lastFire = 0;
  const onWheel = (event: WheelEvent): void => {
    if (!actions.canBrowse()) return;
    accumX += event.deltaX;
    accumY += event.deltaY;
    const now: number = performance.now();
    if (now - lastFire < WHEEL_COOLDOWN_MS) return;
    const horizontal: boolean = Math.abs(accumX) > Math.abs(accumY);
    const amount: number = horizontal ? accumX : accumY;
    if (Math.abs(amount) < WHEEL_THRESHOLD) return;
    const step: number = Math.sign(amount);
    actions.move(horizontal ? step : 0, horizontal ? 0 : step);
    accumX = 0;
    accumY = 0;
    lastFire = now;
  };
  window.addEventListener('wheel', onWheel, { passive: true });
  return (): void => window.removeEventListener('wheel', onWheel);
}

interface Held {
  since: number;
  last: number;
}

function attachGamepad(actions: InputActions): () => void {
  const held = new Map<string, Held>();
  let raf = 0;

  /** Fires on press, then repeats while held. */
  const pulse = (id: string, down: boolean, now: number, fire: () => void): void => {
    const state: Held | undefined = held.get(id);
    if (!down) {
      held.delete(id);
      return;
    }
    if (state === undefined) {
      held.set(id, { since: now, last: now });
      fire();
      return;
    }
    const wait: number = state.last === state.since ? REPEAT_FIRST_MS : REPEAT_MS;
    if (now - state.last >= wait) {
      state.last = now;
      fire();
    }
  };

  const poll = (now: number): void => {
    const pads: (Gamepad | null)[] = Array.from(navigator.getGamepads());
    const pad: Gamepad | undefined = pads.find((p: Gamepad | null): p is Gamepad => p !== null);
    if (pad === undefined) {
      raf = 0;
      return;
    }
    const pressed = (index: number): boolean => pad.buttons[index]?.pressed === true;
    const axisX: number = pad.axes[0] ?? 0;
    const axisY: number = pad.axes[1] ?? 0;
    const browse: boolean = actions.canBrowse();
    pulse('left', pressed(14) || axisX < -STICK_THRESHOLD, now, (): void => void actions.move(-1, 0));
    pulse('right', pressed(15) || axisX > STICK_THRESHOLD, now, (): void => void actions.move(1, 0));
    pulse('up', pressed(12) || (browse && axisY < -STICK_THRESHOLD), now, (): void => void actions.move(0, -1));
    pulse('down', pressed(13) || (browse && axisY > STICK_THRESHOLD), now, (): void => void actions.move(0, 1));
    pulse('a', pressed(0), now, (): void => actions.confirm());
    pulse('b', pressed(1), now, (): void => actions.back());
    pulse('lb', pressed(4), now, (): void => actions.shoulder(-1));
    pulse('rb', pressed(5), now, (): void => actions.shoulder(1));
    pulse('start', pressed(9), now, (): void => actions.toggleMode());
    raf = requestAnimationFrame(poll);
  };

  const start = (): void => {
    if (raf === 0) raf = requestAnimationFrame(poll);
  };
  window.addEventListener('gamepadconnected', start);
  start();
  return (): void => {
    window.removeEventListener('gamepadconnected', start);
    cancelAnimationFrame(raf);
    raf = 0;
  };
}

/** Wires keyboard, wheel and gamepad to the console. Returns a single detach function. */
export function attachInput(actions: InputActions): () => void {
  const detachers: (() => void)[] = [attachKeyboard(actions), attachWheel(actions), attachGamepad(actions)];
  return (): void => {
    for (const detach of detachers) detach();
  };
}

/** Touch swipes on an element. Mouse drags are ignored so clicks stay clicks. */
export function attachSwipe(element: HTMLElement, onSwipe: (dx: number, dy: number) => void): () => void {
  let startX = 0;
  let startY = 0;
  let tracking = false;
  let swiped = false;

  const onDown = (event: PointerEvent): void => {
    if (event.pointerType === 'mouse') return;
    tracking = true;
    swiped = false;
    startX = event.clientX;
    startY = event.clientY;
  };
  const onUp = (event: PointerEvent): void => {
    if (!tracking) return;
    tracking = false;
    const dx: number = event.clientX - startX;
    const dy: number = event.clientY - startY;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_DISTANCE) return;
    swiped = true;
    // A swipe moves the shelf in the direction the finger travels, like flicking a deck of cards.
    if (Math.abs(dx) > Math.abs(dy)) onSwipe(-Math.sign(dx), 0);
    else onSwipe(0, -Math.sign(dy));
  };
  const onClickCapture = (event: MouseEvent): void => {
    if (!swiped) return;
    swiped = false;
    event.stopPropagation();
    event.preventDefault();
  };

  element.addEventListener('pointerdown', onDown);
  element.addEventListener('pointerup', onUp);
  element.addEventListener('pointercancel', (): void => void (tracking = false));
  element.addEventListener('click', onClickCapture, true);
  return (): void => {
    element.removeEventListener('pointerdown', onDown);
    element.removeEventListener('pointerup', onUp);
    element.removeEventListener('click', onClickCapture, true);
  };
}

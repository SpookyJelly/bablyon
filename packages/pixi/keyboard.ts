interface KeyInterface {
  value: string;
  isDown: boolean;
  isUp: boolean;
  press?: Function;
  release?: Function;
  downHandler: (e: KeyboardEvent) => void;
  upHandler: (e: KeyboardEvent) => void;
  unsubscribe: () => void;
}
export function keyboard(value: string) {
  const key: KeyInterface = {
    value: value,
    isDown: false,
    isUp: true,
    press: undefined,
    release: undefined,
    downHandler: (e: KeyboardEvent) => {
      if (e.key == key.value) {
        if (key.isUp && key.press) key.press();
        key.isDown = true;
        key.isUp = false;
        e.preventDefault();
      }
    },
    upHandler: (e: KeyboardEvent) => {
      if (e.key === key.value) {
        if (key.isDown && key.release) key.release();
        key.isDown = false;
        key.isUp = true;
        e.preventDefault();
      }
    },
    unsubscribe: () => {
      window.removeEventListener("keydown", downListener);
      window.removeEventListener("keyup", upListener);
    },
  };
  const downListener = key.downHandler.bind(key); // bind를 사용해서 this를 key로 고정시켜준다.
  const upListener = key.upHandler.bind(key);
  window.addEventListener("keydown", downListener, false);
  window.addEventListener("keyup", upListener, false);

  return key;
}

import { LANGUAGES } from "@/assets/languages";
import State from "@/store/interfaces/State";

/* Default values that are used if not set in local storage */
const state: State = {
  TAB_SIZE: 2,
  LINE_NUMBERS: true,
  LANGUAGE: LANGUAGES[Math.floor(Math.random() * LANGUAGES.length)],

  styles: {
    input: {
      fontSize: "16px",
      lineHeight: "24px"
    },

    prism: {
      fontSize: "16px",
      lineHeight: "24px"
    },

    lineNumbers: {
      width: "40px"
    }
  }
};

// Apply local storage values to the state
// tslint:disable-next-line: forin
for (const property in state) {
  if (property !== "styles") {
    const item = localStorage.getItem(property);
    if (!item || item === state[property]) continue;

    state[property] = item;
  } else {
    // tslint:disable-next-line: forin
    for (const reference in state[property]) { // input, prism, lineNumbers...
      // tslint:disable-next-line: forin
      for (const prop in state[property][reference]) { // fontSize, lineHeight, width...
        const userStyle = localStorage.getItem(`${reference}-${prop}`);
        if (!userStyle || userStyle === state[property][reference][prop]) continue;

        state[property][reference][prop] = userStyle;
      }
    }
  }
}

export default (): State => state;